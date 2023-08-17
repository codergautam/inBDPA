import Head from "next/head"
import Navbar from "@/components/navbar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faPenNib } from "@fortawesome/free-solid-svg-icons"
import { withIronSessionSsr } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { countSessionsForArticle, getArticle, increaseArticleViewCountMongo, incrementArticleViews } from "@/utils/api"
import { useEffect, useRef, useState } from "react"
import { marked } from "marked"
import { useRouter } from "next/router"
import Modal from 'react-modal';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import Link from "next/link"
import { sanitize } from "isomorphic-dompurify";

import ArticleForm from "@/components/ArticleForm"
import rateLimit from "@/utils/rateLimit"

const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hr
  uniqueTokenPerInterval: 1000,
})

async function updateInfo(article_id) {
    let data = await fetch("/api/articles/getArticle", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            article_id
        })
    }).then(res => res.json())
    if(data.article) {
        return {views: data.article.views, active: data.article.sessions}
    } else {
        return {views: "N/A", active: "N/A"}
    }
}


export default function Article({user, article, activeSessions}) {
    const router = useRouter()

    const [views, setViews] = useState(article?.views)
    const [active, setActive] = useState(activeSessions)
    const [editingArticle, setEditingArticle] = useState(null)
    const [value, setValue] = useState("");
    const [title, setTitle] = useState("")
    const [keywords, setKeywords] = useState([]);
    const [parsedContent, setParsedContent] = useState("");
    const [formSubmitting, setFormSubmitting] = useState(false);

    let refreshRef = useRef()

    useEffect(()=>{
      if(!article || article.error) return;
        refreshRef.current = setInterval(async ()=> {
            // setViews("...")
            // setActive("...")
            let { views, active } = await updateInfo(article.article_id)
            setViews(views)
            setActive(active)
        }, 5000)
        return () => clearInterval(refreshRef.current)
    }, [])

    useEffect(() => {
      const parsed = (marked(article?.contents ?? "",  {gfm: true, breaks: true, mangle: false, headerIds: false, headerPrefix: false}));
      setParsedContent(parsed);
    }, [article?.contents]);


    const deleteArticle = async (article_id) => {
      let data = await fetch("/api/articles/deleteArticle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          article_id
        })
      }).then(res => res.json());
      if(data.success) {
        router.push("/")
        return
      } else {
        alert("Failed to delete article...")
      }
    }

    const editArticle = async () => {
      if(formSubmitting) return;
      if(!title || !value) {
        alert("Please fill out all fields!")
        return
      }
      setFormSubmitting(true);
      let data = await fetch("/api/articles/editArticle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          article_id: editingArticle.article_id,
          title: title,
          contents: value,
          keywords: keywords
        })
      }).then(res => res.json())
      setFormSubmitting(false);
      if(data.success) {
        router.reload()
        return
      } else {
        alert("Failed to edit this article...")
        setValue("")
        setEditingArticle(null)
        setTitle("")
      }
    }


    return (
      <section className="text-black bg-white dark:bg-gray-800 flex flex-col min-h-screen">
  <div className="bg-gray-100 dark:bg-gray-800">
    <Head>
        <title>{article && article.title ? article.title : "inBDPA Articles"}</title>

    </Head>
    <Navbar user={user}></Navbar>
    </div>

        {!article || article.error ? (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
          <p className="text-4xl text-gray-800 dark:text-white font-bold mb-8">{article?.error ?? "Article not found"}</p>
          <Link
            href="/"
            className="text-lg text-gray-800 dark:text-white font-semibold py-2 px-6 bg-blue-500 hover:bg-blue-600 rounded transition duration-200 ease-in-out"
          >
            Go back
          </Link>
        </div>

        ) : (
          <main className="w-5/6 mx-auto mt-6 bg-white dark:bg-gray-800 rounded-lg p-8">
<div className="sm:flex sm:justify-center lg:inline-block pb-0 sm:pb-5 ">
  <Link
    href="/"
    className="inline-block align-middle py-2 px-4 bg-transparent text-gray-800 font-bold rounded outline-none border border-gray-800 hover:bg-gray-200  transition duration-200 ease-in-out mt-4 dark:text-gray-200 dark:border-gray-200 dark:hover:bg-gray-600"
  >
    Back to Feed
  </Link>
</div>
            <Modal
              isOpen={!!editingArticle}
              contentLabel="Edit Article"
              className={"p-0 m-20 bg-gray-800"}
            >
              <ArticleForm title={title} setTitle={setTitle} value={value} setValue={setValue} handleFormSubmit={editArticle} handleClose={() => setEditingArticle(null)} editingArticles={true} submitting={formSubmitting} keywords={keywords} setKeywords={setKeywords}/>
            </Modal>
            <div className="bg-gray-100 dark:bg-gray-700 p-12 rounded-md">
            <p className="text-l sm:text-xl md:text-2xl lg:text-3xl text-center font-bold text-gray-800 dark:text-white break-words">

              {article.title}
            </p>
            <p className="flex text-gray-600 dark:text-gray-100 text-lg w-min min-w-max mx-auto mt-2 space-x-2">
  <span className="inline-flex items-center px-2.5 py-1.5 bg-gray-200 dark:bg-gray-800 text-lg font-medium text-gray-800 dark:text-gray-200 rounded-xl">
   Views: {views}
  </span>
  <span className="inline-flex items-center px-2.5 py-1.5 bg-gray-200 dark:bg-gray-800 text-lg font-medium text-gray-800 dark:text-gray-200 rounded-xl">
    Active Viewers:  {isNaN(active) ? active : Math.max(active, 1)}

  </span>
</p>
<div className="flex flex-row flex-wrap justify-center  dark:text-gray-100 w-full mx-auto mt-2 space-x-2">
  {article.keywords.map((keyword, index) => (
    <span key={index} className="items-center px-2.5 mt-2 py-1.5 bg-gray-200 dark:bg-gray-800 text-md font-medium text-gray-800 dark:text-gray-200 rounded-xl">
      {keyword}
    </span>
  ))}
</div>


            {article.creator_id == user.id ? (
              <div className='flex space-x-2 mt-2 mx-auto w-min min-w-max'>
                <span onClick={() => deleteArticle(article.article_id)} className="cursor-pointer rounded-md text-red-50 flex bg-red-600 hover:bg-red-500 p-1 transition duration-300 ease-in-out">
                  Delete <FontAwesomeIcon className="text-white w-4 h-4 my-auto ml-1" icon={faTrash} />
                </span>
                <span onClick={() => {
                  setEditingArticle(article)
                  setTitle(article.title)
                  setValue(article.contents)
                  setKeywords(article.keywords)
                }} className="cursor-pointer rounded-md flex bg-orange-600 hover:bg-orange-500 p-1 text-orange-50 transition duration-300 ease-in-out">
                  Edit <FontAwesomeIcon className="text-white w-4 h-4 my-auto ml-1" icon={faPenNib} />
                </span>
              </div>
            ) : null}
            <br/>
            <hr/>
            <div className="text-lg text-gray-800 dark:text-white md:w-11/12 sm:w-full mx-auto mt-2 break-words">
              <div className="markdown-content" dangerouslySetInnerHTML={{ __html: (marked(article.contents, {gfm: true, breaks: true, mangle: false, headerIds: false, headerPrefix: false})) }}></div>
            </div>
            </div>
          </main>
        )}
        </section>

    );


}

export const getServerSideProps = withIronSessionSsr(async ({
    req,
    res,
    params
}) => {

    if(!req.session.user || !req.session.user?.id) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false
        },
        props: {}
      }
    }

    let increase = true;
    // try {
    // } catch(e) {
    //   increase = false;
    // }
    if(increase) {
    try {
         incrementArticleViews(params.id)
         increaseArticleViewCountMongo(params.id)
    } catch (error) {
        console.log(`Error incrementing views on Opportity ${params.id}: ${error} `)
    }
  }
    let active = (await countSessionsForArticle(params.id)).active
    let article = (await getArticle(params.id));
   if(article.success) {
    article = article.article;
    article.contents = sanitize(article.contents)
   }
    // const window = new JSDOM('').window
    // const DOMPurify = createDOMPurify(window)
    // article.contents = marked(article.contents)
    return { props: { user: req.session.user ?? null, article: article ?? null, activeSessions: active ?? 0}}
}, ironOptions)