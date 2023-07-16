import React, { useEffect, useState } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Tilt from 'react-parallax-tilt';
import Image from 'next/image';
import { faGears, faSuitcase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const faqData = [
  {
    question: "What is your cancellation policy?",
    answer:
      "Our cancellation policy allows you to cancel your subscription at any time with no additional fees or charges.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer refunds within 30 days of your purchase. Please contact our support team for assistance.",
  },
  // Add more FAQ items as needed
];


export default function Main() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  const [openIndexes, setOpenIndexes] = useState([]);

  const handleToggle = (index) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes((prevIndexes) => prevIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes((prevIndexes) => [...prevIndexes, index]);
    }
  };


  return (
    <section className="text-gray-600 body-font dark:text-gray-300 gradient-bg">
      <div className="max-w-5xl pt-20 pb-24 mx-auto flex flex-col items-center">
      <div className="text-4xl sm:text-6xl font-bold items-center justify-center" data-aos="fade-down">
            <span>Welcome to </span>
            <Link href="/">
              <img
                className="w-28 sm:w-48 self-center dark:hidden inline"
                src="https://cdn.discordapp.com/attachments/1121115967120998540/1129195814447759410/Screenshot_2023-07-13_at_6.34.43_PM-PhotoRoom.png-PhotoRoom.png"
                alt="BDPA logo"
              />
            </Link>
            <Link href="/">
              <img
                className="w-28 sm:w-48 self-center hidden dark:inline"
                src="https://cdn.discordapp.com/attachments/1121115967120998540/1129463854536085557/168935544518199980.png"
                alt="BDPA logo"
              />
            </Link>
          </div>
        <h2 data-aos="fade-up" className="text-2xl font-4 lh-6 ld-04 pb-11 text-gray-700 dark:text-gray-200 text-center">
          The professional network for the digital age.
        </h2>
        <div className="ml-6 text-center">
  <a
    data-aos="fade-up"
    className="inline-flex items-center py-3 text-black dark:text-white transition duration-500 ease-in-out transform bg-transparent bg-white dark:bg-gray-800 px-7 text-md md:mt-0 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 focus:shadow-outline"
    href="/signup"
  >
    <div className="flex text-lg">
      <span className="justify-center">Sign up &rarr;</span>
    </div>
  </a>
  <a
    data-aos="fade-up"
    className="inline-flex items-center py-3 tracking-tighter text-white transition duration-500 ease-in-out transform bg-transparent ml-11 bg-gradient-to-r from-blue-500 to-blue-800 px-14 text-md md:mt-0 focus:shadow-outline hover:bg-blue-700 hover:from-blue-600 hover:to-blue-900"
    href="/login"
  >
    <div className="flex text-lg">
      <span className="justify-center">Log in &rarr;</span>
    </div>
  </a>
</div>

      </div>
      <div className="container flex flex-col items-center justify-center mx-auto">
      <Tilt className="Tilt" tiltMaxAngleX="5" tiltMaxAngleY="5">
  <img
    className="object-cover object-center border shadow-md g327"
    alt="Placeholder Image"
    src="/home.png"
  />
</Tilt>
      </div>
      <h2 data-aos="fade-up" className="pt-40 mb-1 text-2xl  tracking-tighter text-center text-black dark:text-gray-200 lg:text-7xl md:text-6xl">
        Networking Opportunities
      </h2>
      <br />
      <p data-aos="fade-up" className="mx-auto text-xl text-center font-normal text-gray-800 dark:text-gray-300 leading-relaxed fs521 lg:w-2/3">
        Connect with professionals in your industry, join communities, and participate in discussion forums. Expand your network, learn from others, and explore collaboration opportunities. Our networking feature fosters meaningful connections, allowing you to grow both personally and professionally within our community.
      </p>
      <div data-aos="fade-up" className="pt-12 pb-24 max-w-4xl mx-auto fsac4 md:px-1 px-3">
      <Tilt className="Tilt" tiltMaxAngleX="5" tiltMaxAngleY="5">



        <div className="ktq4">
          {/* faGear */}
<FontAwesomeIcon icon={faGears} className="text-6xl text-gray-200" />
          <h3 className="pt-3  text-lg text-white">
            Engineering
          </h3>
          <p className="pt-2 value-text text-md text-gray-200 fkrr1">
            Find engineering-related networking opportunities.
          </p>
        </div>
        </Tilt>

        <Tilt className="Tilt" tiltMaxAngleX="5" tiltMaxAngleY="5">

        <div className="ktq4">
                    {/* faGear */}
<FontAwesomeIcon icon={faSuitcase} className="text-6xl text-gray-200" />
          <h3 className="pt-3  text-lg text-white">
            Finance
          </h3>
          <p className="pt-2 value-text text-md text-gray-200 fkrr1">
            Discover finance-related networking opportunities.
          </p>
        </div>
        </Tilt>
      </div>

      <div className="max-w-5xl pt-20 pb-24 mx-auto flex flex-col items-center min-w-3xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6 w-3/4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-gray-100 dark:bg-gray-800 ${
                openIndexes.includes(index) ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}
            >
              <button
                className="flex justify-between items-center w-full focus:outline-none"
                onClick={() => handleToggle(index)}
              >
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {faq.question}
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ${
                    openIndexes.includes(index) ? "transform rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndexes.includes(index) && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
