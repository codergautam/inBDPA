"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar({user}) {
  const [isOpen, setIsOpen] = useState(false);

  return (

<div class="flex flex-row content-center justify-between w-full h-2 bg-white border-b-2 border-blue-600 p-8 text-center">
<div class="flex flex-row self-center text-3xl font-bold text-blue-600 cursor-pointer select-none"><img class="w-8 h-8" src="https://bdpa.org/wp-content/uploads/2020/12/f0e60ae421144f918f032f455a2ac57a.png" alt="BDPA logo"/>
inBDPA</div>

<div class="flex flex-row space-x-8 self-center justify-end text-center ">
    <div class="cursor-pointer text-base text-blue-600 hover:font-bold"><a href="/auth/login"/>Home</div>
    <div class="cursor-pointer text-base text-blue-600 hover:font-bold">Sign Up</div>
    <div class="cursor-pointer text-base text-blue-600 hover:font-bold">Log In</div>
</div>
</div>
  );
}