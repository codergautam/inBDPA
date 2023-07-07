import Navbar from "@/components/Navbar";
import { getRequestCookie } from "@/utils/getRequestCookie";
import { cookies } from "next/headers";
import Head from "next/head";

export default async function Home() {
  const user = await getRequestCookie(cookies());
  return (
    <div className="flex flex-col">
      <Head>
        <title>inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full">
        <Navbar user={user} />
      </div>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 md:w-4/5 3xl:w-2/3 mx-auto text-center">
        {/* Welcome section */}
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl sm:text-6xl font-bold">
            Welcome to{" "}
            <a className="text-blue-600" href="https://inbdpa.com">
              inBDPA! 
            </a>
          </h1>

          <p className="mt-3 text-xl md:text-2xl">
            The professional network for the digital age.
          </p>
          {user ? (
            <p className="mt-3 text-2xl">Welcome back, <b className="text-blue-600">{user.username}!</b></p>
          ) : (
            <div className="flex flex-wrap items-center justify-center max-w-4xl mt-6 sm:w-full md:w-full sm:space-x-0 md:space-x-0 lg:space-x-12">
              <a
                href="/auth/signup"
                className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 border-black dark:border-white"
              >
                <h3 className="text-2xl font-bold">Sign up &rarr;</h3>
                <p className="mt-4 text-xl">
                  Start connecting with professionals today.
                </p>
              </a>

              <a
                href="/auth/login"
                className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 border-black dark:border-white"
              >
                <h3 className="text-2xl font-bold">Log in &rarr;</h3>
                <p className="mt-4 text-xl">
                  Already have an account? Log in here.
                </p>
              </a>
            </div>
          )}
        </div>

        <div className="container">

          <div className="flex flex-col items-center justify-center mb-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">User Profiles</h2>
            <p className="text-sm sm:text-lg text-center">
              Create a personalized profile to showcase your skills,
              experiences, and achievements. Customize your profile with
              pictures, background themes, and detailed information about your
              work history, education, certifications, skills, and more. Connect
              with others, receive recommendations, and manage your privacy
              settings. Our user profiles feature empowers you to present
              yourself professionally and make meaningful connections within our
              community.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center my-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">Job Search</h2>
            <p className="text-sm sm:text-lg text-center">
              Find your dream job with ease using our comprehensive job search
              functionality. Our advanced filters allow you to refine your
              search based on location, industry, salary, and more. Spend less
              time searching and more time applying to relevant opportunities.
              We streamline the job search process, giving you the competitive
              edge in finding the perfect position that matches your skills and
              aspirations.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center my-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">
              Networking Opportunities
            </h2>
            <p className="text-sm sm:text-lg text-center">
              Connect with professionals in your industry, join communities, and
              participate in discussion forums. Expand your network, learn from
              others, and explore collaboration opportunities. Our networking
              feature fosters meaningful connections, allowing you to grow both
              personally and professionally within our community.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center my-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">Resume Builder</h2>
            <p className="text-sm sm:text-lg text-center">
              Build professional resumes tailored to your desired job positions
              with our user-friendly resume builder tool. Create a visually
              appealing and comprehensive resume that highlights your skills,
              experiences, and qualifications. Our intuitive interface guides
              you through the process, ensuring your resume stands out to
              potential employers.
            </p>
          </div>
{/* 
          <div className="flex flex-col items-center justify-center my-48">
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
          <div className="flex flex-col items-center justify-center my-48">
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
          <div className="flex flex-col items-center justify-center my-48">
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
          <div className="flex flex-col items-center justify-center my-48">
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
          <div className="flex flex-col items-center justify-center my-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">Industry Insights</h2>
            <p className="text-sm sm:text-lg text-center">
              Gain valuable insights and trends about specific industries or job
              markets. Stay informed about the latest developments, salary
              ranges, and in-demand skills within your field. Our industry
              insights feature equips you with the knowledge to make informed
              career decisions and stay ahead in your industry.
            </p>
          </div> */}

          <div className="flex flex-col items-center justify-center my-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">Collaborative Projects</h2>
            <p className="text-sm sm:text-lg text-center">
              Collaborate on projects, join teams, and showcase your teamwork
              and collaboration skills. Engage with like-minded professionals,
              contribute to meaningful projects, and demonstrate your ability to
              work effectively in a team environment. Our collaborative projects
              feature enables you to showcase your talents and expand your
              professional network.
            </p>
          </div>
{/* 
          <div className="flex flex-col items-center justify-center my-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">Events and Webinars</h2>
            <p className="text-sm sm:text-lg text-center">
              Participate in virtual or in-person events, webinars, or workshops
              related to career development and industry topics. Expand your
              knowledge, network with industry experts, and stay updated with
              the latest trends. Our events and webinars feature provides you
              with valuable opportunities to learn and grow professionally.
            </p>
          </div> */}

          <div className="flex flex-col items-center justify-center mt-48">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">
              Messaging and Communication
            </h2>
            <p className="text-sm sm:text-lg text-center">
              Communicate with ease through our integrated messaging
              featuresthat facilitate seamless communication between users,
              employers, and recruiters. Connect with potential employers,
              schedule interviews, and stay in touch throughout the hiring
              process. Our messaging and communication feature ensures effective
              and efficient communication, enhancing your chances of securing
              the perfect job opportunity.
            </p>
          </div>
{/* 
          <div className="flex flex-col items-center justify-center my-48">
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
          <div className="flex flex-col items-center justify-center my-48">
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
          <div className="flex flex-col items-center justify-center my-48">
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

        </div>
      </main>
    </div>
  );
}
