
import React, { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { faGears, faNetworkWired, faSearch, faShare, faShareNodes, faSuitcase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function LoggedInHome({ user }) {
useEffect(() => {
AOS.init({
duration: 1000,
once: true,
});
}, []);

return (
<section className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 h-screen flex-grow">
<div className="container px-5 py-24 mx-auto">
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-12 text-center">
Hello, {user.username}!
</h1>
<h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-12 text-center">
What do you want to do today?
</h3>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center md:justify-center">

<div className="rounded-lg overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700">
<Link href={`/profile/${user.link}`} className="p-6 flex flex-col items-center justify-center h-full hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 ease-in-out">
<FontAwesomeIcon icon={faGears} className="text-4xl text-gray-500 dark:text-gray-400 mb-4" />
<h2 className="text-xl font-semibold mb-2">Customize Profile</h2>
<p className="text-gray-600 dark:text-gray-400">
Take control of your account settings and personalize your experience.
</p>
</Link>
</div>
<div className="rounded-lg overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700">
<Link href="/search" className="p-6 flex flex-col items-center justify-center h-full hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 ease-in-out">
<FontAwesomeIcon icon={faSearch} className="text-4xl text-gray-500 dark:text-gray-400 mb-4" />
<h2 className="text-xl font-semibold mb-2">Find Connections</h2>
<p className="text-gray-600 dark:text-gray-400">
Expand your professional network and connect with like-minded individuals.
</p>
</Link>
</div>
<div className="rounded-lg overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700">
<Link href="/opportunities" className="p-6 flex flex-col items-center justify-center h-full hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 ease-in-out">
<FontAwesomeIcon icon={faSuitcase} className="text-4xl text-gray-500 dark:text-gray-400 mb-4" />
<h2 className="text-xl font-semibold mb-2">Explore Opportunities</h2>
<p className="text-gray-600 dark:text-gray-400">
Discover job openings and career opportunities tailored to your interests.
</p>
</Link>
</div>
</div>
</div>
</section>
);
}