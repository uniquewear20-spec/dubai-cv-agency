import React from 'react';
import { MessageCircle } from 'lucide-react'; // تأكد من تثبيت lucide-react أو استخدم أيقونة عادية

const PAYMENT_LINKS = {
  basic: "https://buy.stripe.com/test_eVq4gyeEe25R03d5GG0oM00",
  professional: "https://buy.stripe.com/test_aFa28q8fQcKv3fpglk0oM01",
  ultimate: "https://buy.stripe.com/test_aFadR89jU6m75nx4CC0oM02"
};

const WHATSAPP_NUMBER = "971502879462"; // ضع رقمك هنا بدون أصفار أو علامة + (مثلاً 971501234567) 

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans relative">
      
      {/* Hero Section */}
      <section className="py-24 text-center bg-slate-50 border-b">
        <h1 className="text-6xl font-extrabold mb-6 tracking-tight">Dubai CV Agency</h1>
        <p className="text-2xl text-slate-600 mb-8">Elevate your career with professional CVs.</p>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Basic */}
        <div className="border p-10 rounded-3xl shadow-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Basic</h2>
          <p className="text-4xl font-black mb-8 text-slate-900">AED 199</p>
          <a href={PAYMENT_LINKS.basic} className="block w-full py-4 bg-black text-white rounded-2xl font-bold hover:opacity-90 transition">Buy with Apple Pay</a>
        </div>
        
        {/* Professional */}
        <div className="border-4 border-black p-10 rounded-3xl shadow-xl text-center relative scale-105 bg-white">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-xs uppercase font-bold tracking-widest">Most Popular</span>
          <h2 className="text-2xl font-bold mb-4">Professional</h2>
          <p className="text-4xl font-black mb-8 text-slate-900">AED 399</p>
          <a href={PAYMENT_LINKS.professional} className="block w-full py-4 bg-black text-white rounded-2xl font-bold hover:opacity-90 transition">Buy with Apple Pay</a>
        </div>

        {/* Ultimate */}
        <div className="border p-10 rounded-3xl shadow-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Ultimate</h2>
          <p className="text-4xl font-black mb-8 text-slate-900">AED 599</p>
          <a href={PAYMENT_LINKS.ultimate} className="block w-full py-4 bg-black text-white rounded-2xl font-bold hover:opacity-90 transition">Buy with Apple Pay</a>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'm interested in a CV package!`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
        aria-label="Contact on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"/></svg>
      </a>

      <footer className="py-12 text-center text-slate-400 border-t bg-white">
        <p>© 2026 Dubai CV Agency. All rights reserved.</p>
      </footer>
    </main>
  );
}