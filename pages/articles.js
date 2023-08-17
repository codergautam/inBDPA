// pages/opportunities.js
// This code is for the "Opportunities" page of the inBDPA project. It allows users to view, create, edit, and delete opportunities. The page includes a list of opportunities, a create article button (only visible to staff and administrators), and modals for creating and editing opportunities. The code fetches opportunities from the server and dynamically loads more when the user reaches the bottom of the page. The code also handles form submissions for creating and editing opportunities. It uses Next.js, React, and various libraries for components and functionality. The code also includes server-side authentication and session management.
import Head from "next/head";
import Navbar from "@/components/navbar";
import { useState, useEffect, useRef } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import { getUserFromMongo } from "@/utils/api";
import Modal from "react-modal";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import Article from "@/components/Article";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenNib, faTrash } from "@fortawesome/free-solid-svg-icons";
import ArticleForm from "@/components/ArticleForm";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
    </div>
  ),
});

export default function Page({ user }) {
  const router = useRouter();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [title, setTitle] = useState("");
  const [creatingArticle, setCreatingArticle] = useState(false);
  const [editingArticle, setEditingArticle] = useState(false);
  const [value, setValue] = useState("");
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const lastOppRef = useRef(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const loadOpportunities = async (first = false) => {
    if (!lastOppRef.current && !first) return;
    setLoading(true);

    let data = await fetch("/api/opportunities/getOpportunities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        article_id: lastOppRef.current,
      }),
    }).then((res) => res.json());

    if (data.success) {
      let newOpps = data.opportunities;
      setOpps((prevOpps) => [...prevOpps, ...newOpps]);
      lastOppRef.current = newOpps[newOpps.length - 1]?.article_id;
    } else {
      alert("Failed to load opportunities...");
    }
    setLoading(false);
  };
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const handleScroll = debounce(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1
    ) {
      loadOpportunities();
    }
  }, 100);

  useEffect(() => {
    const loadInitialOpportunities = async () => {
      await loadOpportunities(true);
      // Check if the document height is less than or equal to the window height
      console.log(document.documentElement.scrollHeight, window.innerHeight);
      if (document.documentElement.scrollHeight <= window.innerHeight) {
        // Load more opportunities as the screen is not filled
        await loadOpportunities();
      }
    };
    loadInitialOpportunities();

    window.addEventListener("scroll", () => {
      setLoading(true);
      handleScroll();
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const makeNewArticle = async () => {
    if (formSubmitting) return;

    if (!title || !value) {
      alert("Please fill out all fields!");
      return;
    }
    setFormSubmitting(true);

    let data = await fetch("/api/opportunities/createArticle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        contents: value,
      }),
    }).then((res) => res.json());
    setFormSubmitting(false);
    if (data.success) {
      setCreatingArticle(false);
      setValue("");
      setTitle("");
      setSelectedArticle(null);
      router.push("/article/" + data.article.article_id);
    } else {
      alert(data.error ?? "Failed to create new article...");
    }
  };

  const deleteArticle = async (article_id) => {
    let data = await fetch("/api/opportunities/deleteArticle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        article_id,
      }),
    }).then((res) => res.json());

    if (data.success) {
      setMessage("Successfully deleted article");
      setTimeout(() => {
        setMessage("");
        router.push("/opportunities");
      }, 1000);
    } else {
      alert("Failed to delete article...");
    }
  };

  const editArticle = async () => {
    if (formSubmitting) return;

    if (!title || !value) {
      alert("Please fill out all fields!");
      return;
    }
    setFormSubmitting(true);
    let data = await fetch("/api/opportunities/editArticle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        article_id: editingArticle.article_id,
        title: title,
        contents: value,
      }),
    }).then((res) => res.json());
    setFormSubmitting(false);
    if (data.success) {
      router.reload();
    } else {
      alert("Failed to edit this article...");
    }

    setValue("");
    setEditingArticle(null);
    setTitle("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      <Head>
        <title>inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Navbar user={user} />
      </div>

      <main className="container px-5 py-16 mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-12 text-gray-600 dark:text-gray-300 text-center">
          Articles
        </h2>
        {message ? (
          <div className="text-black mx-auto font-semibold min-w-max w-min md:text-xl sm:text-lg text-base dark:text-green-500">
            {message}
          </div>
        ) : (
          <></>
        )}
        {user.type === "staff" || user.type === "administrator" ? (
          <div className="flex justify-center">
            <button
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md duration-200 ease-in-out transition mb-8"
              onClick={() => setCreatingArticle(true)}
            >
              Create Article
            </button>
          </div>
        ) : null}

        <Modal
          isOpen={creatingArticle}
          contentLabel="Create Article"
          ariaHideApp={false}
        >
          <ArticleForm
            user={user}
            editingArticle={false}
            handleFormSubmit={makeNewArticle}
            handleClose={() => setCreatingArticle(false)}
            setTitle={setTitle}
            setValue={setValue}
            value={value}
            title={title}
            submitting={formSubmitting}
          />
        </Modal>

        <Modal
          isOpen={editingArticle}
          contentLabel="Create Article"
          ariaHideApp={false}
        >
          <ArticleForm
            user={user}
            editingArticle={editingArticle}
            handleFormSubmit={editArticle}
            handleClose={() => setEditingArticle(false)}
            setTitle={setTitle}
            setValue={setValue}
            value={value}
            title={title}
            submitting={formSubmitting}
          />
        </Modal>

        <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto items-center">
          {opps.map((article, i) => (
            <Article
              key={i}
              i={i}
              user={user}
              article={article}
              selected={selectedArticle}
              deleteArticle={deleteArticle}
              setEditingArticle={setEditingArticle}
              setTitle={setTitle}
              setValue={setValue}
            />
          ))}
          {loading ? (
            <div className="flex justify-center items-center h-10">
              <span className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 dark:border-white"></span>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
  params,
}) {
  if (!req.session.user || !req.session.user?.id) {
    return {
      redirect: {
        destination:
          "/auth/login?error=You must have an account or be logged in to view this page.",
        permanent: false,
      },
      props: {},
    };
  }

  if (req.session.user) {
    let user = await getUserFromMongo(req.session.user.id);
    if (user && user.link && user.type) {
      req.session.user.type = user.type;
    } else {
      // Log em out
      req.session.destroy();
      return { user: null };
    }
  }

  return {
    props: { user: req.session.user ?? null },
  };
},
ironOptions);
