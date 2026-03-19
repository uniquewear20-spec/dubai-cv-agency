import React from 'react';

const PAYMENT_LINKS = {
  basic: "https://buy.stripe.com/test_eVq4gyeEe25R03d5GG0oM00",
  professional: "https://buy.stripe.com/test_aFa28q8fQcKv3fpglk0oM01",
  ultimate: "https://buy.stripe.com/test_aFadR89jU6m75nx4CC0oM02"
};

const WHATSAPP_NUMBER = "971502879462"; // ضع رقمك هنا

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans relative">
      
      {/* Header / Logo Section */}
      <header className="py-8 px-6 max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-black tracking-tighter italic">DUBAI CV AGENCY</div>
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-black">Services</a>
          <a href="#" className="hover:text-black">Process</a>
          <a href="#" className="hover:text-black">Pricing</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
          GET HIRED IN <span className="text-slate-400 italic">DUBAI.</span>
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Professional CV writing and LinkedIn optimization tailored for the UAE's competitive job market.
        </p>
      </section>

      {/* Pricing Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {/* Basic */}
        <div className="border border-slate-200 p-12 rounded-[40px] shadow-sm flex flex-col justify-between hover:border-black transition-colors duration-500 bg-white">
          <div>
            <h2 className="text-xl font-bold mb-2">Basic</h2>
            <p className="text-slate-400 mb-8 text-sm">Standard CV Update</p>
            <p className="text-5xl font-black mb-10 tracking-tighter">199 <span className="text-xl font-medium text-slate-400">AED</span></p>
          </div>
          <a href={PAYMENT_LINKS.basic} className="block w-full py-5 bg-slate-100 text-black text-center rounded-2xl font-bold hover:bg-black hover:text-white transition-all duration-300">Buy Now</a>
        </div>
        
        {/* Professional */}
        <div className="border-2 border-black p-12 rounded-[40px] shadow-2xl flex flex-col justify-between relative scale-105 z-10 bg-white">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest">Most Popular</div>
          <div>
            <h2 className="text-xl font-bold mb-2">Professional</h2>
            <p className="text-slate-400 mb-8 text-sm">CV + Cover Letter</p>
            <p className="text-5xl font-black mb-10 tracking-tighter">399 <span className="text-xl font-medium text-slate-400">AED</span></p>
          </div>
          <a href={PAYMENT_LINKS.professional} className="block w-full py-5 bg-black text-white text-center rounded-2xl font-bold hover:opacity-80 transition-all duration-300 shadow-xl">Buy with Apple Pay</a>
        </div>

        {/* Ultimate */}
        <div className="border border-slate-200 p-12 rounded-[40px] shadow-sm flex flex-col justify-between hover:border-black transition-colors duration-500 bg-white">
          <div>
            <h2 className="text-xl font-bold mb-2">Ultimate</h2>
            <p className="text-slate-400 mb-8 text-sm">Full Career Branding</p>
            <p className="text-5xl font-black mb-10 tracking-tighter">599 <span className="text-xl font-medium text-slate-400">AED</span></p>
          </div>
          <a href={PAYMENT_LINKS.ultimate} className="block w-full py-5 bg-slate-100 text-black text-center rounded-2xl font-bold hover:bg-black hover:text-white transition-all duration-300">Buy Now</a>
        </div>
      </section>

      {/* Floating WhatsApp Button (Pure SVG) */}
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'm interested in your CV packages!`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-10 right-10 bg-[#25D366] text-white w-16 h-16 rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform z-50 flex items-center justify-center"
      >
        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path>
        </svg>
      </a>

      <footer className="py-20 text-center border-t border-slate-100">
        <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">© 2026 Dubai CV Agency. Premium Careers.</p>
      </footer>
    </main>
  );
}