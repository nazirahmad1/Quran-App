import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 text-emerald-100 py-16">
      <div className="container mx-auto px-4 text-center flex flex-col items-center">

        {/* Top subtle line */}
        <div className="w-24 h-[2px] bg-emerald-400/30 rounded-full mb-6"></div>

        {/* Small Islamic icon / text */}
        <div className="text-emerald-300 text-sm mb-3 tracking-widest">
          ﷽
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold tracking-wide mb-4">
          Noor — The Holy Quran
        </h2>

        {/* Description */}
        <p className="text-emerald-300 text-sm md:text-base max-w-md leading-relaxed mb-6">
          A spiritual digital experience to explore and reflect on the Holy Quran
        </p>

        {/* Divider */}
        <div className="w-64 h-px bg-emerald-700/40 mb-6"></div>

        {/* Copyright */}
        <p className="text-xs text-emerald-400 mb-2">
          Noor. All rights reserved {new Date().getFullYear()} ©
        </p>

        {/* Author */}
        <a href="https://t.me/ahmadrahmaty1" target="_blank" className="">
        <p className="text-xs text-emerald-500 hover:text-emerald-300 transition duration-300">
          Made with ❤️ by N. Ahmad Rahmaty
        </p>
    </a>
      </div>
    </footer>
  );
};

export default Footer;