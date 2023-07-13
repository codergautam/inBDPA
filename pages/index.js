/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/navbar";
import { ironOptions } from "@/utils/ironConfig";
import { withIronSessionSsr } from "iron-session/next";
import Head from "next/head";
import Link from "next/link";

export default function Home(props) {
  const user = props?.user;
  console.log(user);
  return (
    <div className="flex flex-col">
      <Head>
        <title>inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full">
        <Navbar user={user} />
      </div>

      <main className="flex flex-col items-center justify-center w-7/8 px-4 md:px-0 flex-1 md:w-5/6 3xl:w-2/3 mx-auto text-center">
        {/* Welcome section */}
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl sm:text-6xl font-bold flex items-center">
            <span>Welcome to </span>
            <Link className="text-blue-600 flex items-center" href="/">
              <div className="flex flex-row content-center justify-between self-center w-full h-1/6 p-4 text-center">
                <div className="flex flex-row self-center text-5xl font-bold text-black dark:text-gray-200 cursor-pointer select-none">
                  <h1 className="text-4xl sm:text-6xl font-bold">in</h1>
                  <img
                    className="w-10 h-10 self-center"
                    src="https://bdpa.org/wp-content/uploads/2020/12/f0e60ae421144f918f032f455a2ac57a.png"
                    alt="BDPA logo"
                  />
                  <h1 className="text-4xl sm:text-6xl font-bold">dpa</h1>
                </div>
              </div>
            </Link>
          </h1>

          <p className="mt-3 text-xl md:text-2xl">
            The professional network for the digital age.
          </p>
          {user ? (
            <>
              <p className="mt-3 text-2xl">
                Welcome back, <b className="text-blue-600">{user.username}!</b>
              </p>
              <Link
                href={`/profile/${user.link}`}
                className="text-white bg-blue-600 hover:bg-slate-800 transition duration-300 ease-in-out rounded px-4 py-2 mt-2"
              >
                Profile
              </Link>
            </>
          ) : (
            <div className="flex flex-wrap items-center justify-center max-w-4xl mt-6 sm:w-full md:w-full sm:space-x-0 md:space-x-0 lg:space-x-12">
              <Link
                href="/auth/signup"
                className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 border-black dark:border-white"
              >
                <h3 className="text-2xl font-bold">Sign up &rarr;</h3>
                <p className="mt-4 text-xl">
                  Start connecting with professionals today!
                </p>
              </Link>

              <Link
                href="/auth/login"
                className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 border-black dark:border-white"
              >
                <h3 className="text-2xl font-bold">Log in &rarr;</h3>
                <p className="mt-4 text-xl">
                  Already have an account? Log in here.
                </p>
              </Link>
            </div>
          )}
        </div>

        <div className="container">
          <hr className="h-px bg-black border-0 dark:bg-gray-900 overflow" />
          <div className="my-16 sm:my-20">
            <div className="flex flex-col lg:flex-row items-center justify-center">
              <div className="text-center">
                <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4 text-blue-600">
                  Networking Opportunities
                </h2>
                <p className="text-center text-md sm:text-lg w-fit mb-8">
                  Connect with professionals in your industry, join communities,
                  and participate in discussion forums. Expand your network,
                  learn from others, and explore collaboration opportunities.
                  Our networking feature fosters meaningful connections,
                  allowing you to grow both personally and professionally within
                  our community.
                </p>
                <Link
                  href="/"
                  className="border-white border hover:text-blue-600 hover:border-blue-600 transition duration-200 ease-in-out rounded px-4 py-3"
                >
                  Connect now!
                </Link>
              </div>
            </div>
          </div>
          <hr className="h-px bg-black border-0 dark:bg-gray-900 overflow" />
          <div className="my-16 sm:my-20">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-center flex-items-center y-48">
              <div className="lg:pr-3 xl:pr-14 3xl:pr-16 flex flex-wrap lg:basis-2/5 justify-center lg:justify-normal">
                <Link
                  href="/"
                  className="my-auto border-blue-600 border-2 dark:hover:text-white dark:hover:border-white hover:text-black hover:border-black transition duration-100 ease-in-out px-4 py-3 rounded-full m-2 h-min"
                >
                  Engineering
                </Link>
                <Link
                  href="/"
                  className="my-auto border-blue-600 border-2 dark:hover:text-white dark:hover:border-white hover:text-black hover:border-black transition duration-100 ease-in-out px-4 py-3 rounded-full m-2 h-min"
                >
                  Finance
                </Link>
                <Link
                  href="/"
                  className="border-blue-600 border-2 dark:hover:text-white dark:hover:border-white hover:text-black hover:border-black transition duration-100 ease-in-out px-4 py-3 rounded-full m-2 h-min"
                >
                  Information Technology
                </Link>
                <Link
                  href="/"
                  className="border-blue-600 border-2 dark:hover:text-white dark:hover:border-white hover:text-black hover:border-black transition duration-100 ease-in-out px-4 py-3 rounded-full m-2 h-min"
                >
                  Chicago
                </Link>
                <Link
                  href="/"
                  className="border-blue-600 border-2 dark:hover:text-white dark:hover:border-white hover:text-black hover:border-black transition duration-100 ease-in-out px-4 py-3 rounded-full m-2 h-min"
                >
                  New York
                </Link>
                <Link
                  href="/"
                  className="border-blue-600 border-2 dark:hover:text-white dark:hover:border-white hover:text-black hover:border-black transition duration-100 ease-in-out px-4 py-3 rounded-full m-2 h-min"
                >
                  Iowa
                </Link>
                <Link
                  href="/"
                  className="border-blue-600 border-2 dark:hover:text-white dark:hover:border-white hover:text-black hover:border-black transition duration-100 ease-in-out px-4 py-3 rounded-full m-2 h-min"
                >
                  $80,000
                </Link>
                <Link
                  href="/"
                  className="border-blue-600 border-2 dark:hover:text-white dark:hover:border-white hover:text-black hover:border-black transition duration-100 ease-in-out px-4 py-3 rounded-full m-2 h-min"
                >
                  $75,500
                </Link>
                <Link
                  href="/"
                  className="border-blue-600 border-2 dark:hover:text-white dark:hover:border-white hover:text-black hover:border-black transition duration-100 ease-in-out px-4 py-3 rounded-full m-2 h-min"
                >
                  Facebook
                </Link>
                <Link
                  href="/"
                  className="border-blue-600 border-2 dark:hover:text-white dark:hover:border-white hover:text-black hover:border-black transition duration-100 ease-in-out px-4 py-3 rounded-full m-2 h-min"
                >
                  AT&T
                </Link>
                <Link
                  href="/"
                  className="border-blue-600 border-2 dark:hover:text-white dark:hover:border-white hover:text-black hover:border-black transition duration-100 ease-in-out px-4 py-3 rounded-full m-2 h-min"
                >
                  Intel
                </Link>
                <Link
                  href="/"
                  className="border-blue-600 border-4 dark:border-white dark:hover:text-white dark:hover:border-blue-600 hover:text-black hover:border-black transition duration-100 ease-in-out px-4 py-3 rounded-full m-2 h-min"
                >
                  More <b className="text-blue-600">v</b>
                </Link>
              </div>
              <div className="pb-5 lg:pb-0 text-center lg:basis-3/5">
                <h2 className="text-center lg:text-right text-2xl sm:text-3xl font-bold mb-4 text-blue-600">
                  Job Search
                </h2>
                <p className="text-center lg:text-right text-md sm:text-lg w-fit">
                  Find your dream job with ease using our comprehensive job
                  search functionality. Our advanced filters allow you to refine
                  your search based on location, industry, salary, and more.
                  Spend less time searching and more time applying to relevant
                  opportunities. We streamline the job search process, giving
                  you the competitive edge in finding the perfect position that
                  matches your skills and aspirations.
                </p>
              </div>
            </div>
          </div>
          <hr className="h-px bg-black border-0 dark:bg-gray-900 overflow" />
          <div className="my-16 sm:my-20">
            <div className="flex flex-col lg:flex-row items-center justify-center">
              <div className="text-center">
                <h2 className="text-center lg:text-left text-2xl sm:text-3xl font-bold mb-4 text-blue-600">
                  User Profiles
                </h2>
                <p className="text-center lg:pr-3 xl:pr-14 3xl:pr-16 lg:text-left text-sm sm:text-lg w-fit mb-4 md:mb-7">
                  Create a personalized profile to showcase your skills,
                  experiences, and achievements. Customize your profile with
                  pictures, background themes, and detailed information about
                  your work history, education, certifications, skills, and
                  more. Connect with others, receive recommendations, and manage
                  your privacy settings. Our user profiles feature empowers you
                  to present yourself professionally and make meaningful
                  connections within our community.
                </p>
                <Link
                  href="/"
                  className="hidden lg:inline border-black dark:border-white border dark:hover:text-blue-600 dark:hover:border-blue-600 hover:text-blue-600 hover:border-blue-600 transition duration-200 ease-in-out rounded px-4 py-3"
                >
                  Try it out
                </Link>
              </div>
              <img
                className="w-3/4 sm:w-2/3 md:w-2/4 mb-8 lg:mb-0 lg:w-1/2 self-center"
                src="https://cdn.discordapp.com/attachments/1121115967120998540/1128079632651014174/Screenshot_2023-07-10_at_4.45.19_PM.png"
                alt="User Profile"
              />
              <Link
                href="/"
                className="lg:hidden border-black dark:border-white border dark:hover:text-blue-600 dark:hover:border-blue-600 hover:text-blue-600 hover:border-blue-600 transition duration-200 ease-in-out rounded px-4 py-3"
              >
                Try it out
              </Link>
            </div>
          </div>
          <hr className="h-px bg-black border-0 dark:bg-gray-900 overflow" />
          <div className="items-center justify-center my-16 sm:my-20">
            <h2 className="text-2xl sm:text-3xl 2xl:text-4xl font-bold mb-6 text-blue-600">
              Resume Builder -{" "}
              <Link href="/">
                <u>Build Now→</u>
              </Link>
            </h2>
            <img
              className="w-full self-center"
              src="https://cdn.discordapp.com/attachments/1121115967120998540/1128418009757790299/Screenshot_2023-07-11_at_3.10.01_PM.png"
              alt="User Profile"
            />
          </div>

          {/*
          <div className="flex flex-row items-center justify-center my-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">Skill Development</h2>
            <p className="text-sm sm:text-lg text-center">
              Stay ahead in your career by accessing online courses, tutorials,
              and resources to enhance your skills. Our platform provides you
              with opportunities to expand your knowledge, learn new
              technologies, and stay updated withthe latest industry trends.
              Develop valuable skills that are in demand and increase your
              marketability in the job market.
            </p>
          </div> */}
          {/*
          <div className="flex flex-row items-center justify-center my-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">
              Recommendations and Personalization
            </h2>
            <p className="text-sm sm:text-lg text-center">
              Receive personalized job recommendations based on your profile,
              preferences, and browsing history. Our advanced algorithms analyze
              your data to suggest relevant job opportunities that align with
              your skills and interests. Get tailored recommendations to save
              time and focus on the opportunities that matter most to you.
            </p>
          </div> */}
          {/*
          <div className="flex flex-row items-center justify-center my-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">Company Pages</h2>
            <p className="text-sm sm:text-lg text-center">
              Explore dedicated pages for companies where you can discover
              valuable information about their culture, values, and job
              openings. Get insights into company profiles, read employee
              reviews, and gather valuable information to make informed
              decisions about potential employers. Our company pages feature
              empowers you to research companies and find the best fit for your
              career.
            </p>
          </div> */}
          {/*
          <div className="flex flex-row items-center justify-center my-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">
              Job Application Tracking
            </h2>
            <p className="text-sm sm:text-lg text-center">
              Keep track of your job applications with our convenient tracking
              system. Stay organized by monitoring application statuses,
              interview schedules, and communication history in one place. Our
              job application tracking feature ensures you never miss an
              important update and helps you stay on top of your job search.
            </p>
          </div> */}
          {/*
          <div className="flex flex-row items-center justify-center my-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">Industry Insights</h2>
            <p className="text-sm sm:text-lg text-center">
              Gain valuable insights and trends about specific industries or job
              markets. Stay informed about the latest developments, salary
              ranges, and in-demand skills within your field. Our industry
              insights feature equips you with the knowledge to make informed
              career decisions and stay ahead in your industry.
            </p>
          </div> */}
          {/*
          <div className="flex flex-row items-center justify-center my-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">
              Collaborative Projects
            </h2>
            <p className="text-sm sm:text-lg text-center">
              Collaborate on projects, join teams, and showcase your teamwork
              and collaboration skills. Engage with like-minded professionals,
              contribute to meaningful projects, and demonstrate your ability to
              work effectively in a team environment. Our collaborative projects
              feature enables you to showcase your talents and expand your
              professional network.
            </p>
          </div> */}
          {/*
          <div className="flex flex-row items-center justify-center my-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">Events and Webinars</h2>
            <p className="text-sm sm:text-lg text-center">
              Participate in virtual or in-person events, webinars, or workshops
              related to career development and industry topics. Expand your
              knowledge, network with industry experts, and stay updated with
              the latest trends. Our events and webinars feature provides you
              with valuable opportunities to learn and grow professionally.
            </p>
          </div> */}
          <hr className="h-px bg-black border-0 dark:bg-gray-900 overflow" />
          <div className="my-16 sm:my-20">
            <div className="items-center justify-center">
              <div className="text-center">
                <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4 text-blue-600">
                  Messaging and Communication
                </h2>
                <p className="text-center text-md sm:text-lg w-fit">
                  Communicate with ease through our integrated messaging
                  featuresthat facilitate seamless communication between users,
                  employers, and recruiters. Connect with potential employers,
                  schedule interviews, and stay in touch throughout the hiring
                  process. Our messaging and communication feature ensures
                  effective and efficient communication, enhancing your chances
                  of securing the perfect job opportunity.
                </p>
              </div>
            </div>
          </div>

          {/*
          <div className="flex flex-row items-center justify-center my-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">
              Job Alerts and Notifications
            </h2>
            <p className="text-sm sm:text-lg text-center">
              Stay updated with personalized job alerts and notifications based
              on your preferences and saved searches. Receive timely updates on
              new job openings, application deadlines, and relevant industry
              news. Our job alerts and notifications feature keeps you informed
              and ensures you never miss out on important opportunities.
            </p>
          </div> */}
          {/*
          <div className="flex flex-row items-center justify-center my-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">
              Company Reviews and Ratings
            </h2>
            <p className="text-sm sm:text-lg text-center">
              Share your feedback, provide reviews, and rate companies based on
              your experiences with their hiring processes. Help fellow
              professionals make informed decisions by sharing your insights and
              opinions. Our company reviews and ratings feature promotes
              transparency and empowers users with valuable information about
              potential employers.
            </p>
          </div> */}
          {/*
          <div className="flex flex-row items-center justify-center my-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">Mobile Application</h2>
            <p className="text-sm sm:text-lg text-center">
              Access our platform on the go with our mobile application. Enjoy a
              seamless and convenient user experience on your smartphones and
              tablets. Stay connected, search for jobs, communicate with
              employers, and manage your career anytime, anywhere. Our mobile
              application ensures flexibility and accessibility, keeping you in
              control of your professional journey.
            </p>
          </div> */}
          <hr className="h-px bg-black border-0 dark:bg-gray-900 overflow" />
          <div className="items-center justify-center my-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-blue-600">
              Join your friends, classmates, co-workers, and publish yourself.
            </h2>
            <Link
              href="/"
              className="border-black dark:border-white border dark:hover:text-blue-600 dark:hover:border-blue-600 hover:text-blue-600 hover:border-blue-600 transition duration-200 ease-in-out rounded px-4 py-3"
            >
              Join Now!
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(function ({ req, res }) {
  return {
    props: { user: req.session.user ?? null },
  };
}, ironOptions);
