import React from 'react';

const SimpleFooter = () => {
  return (
    <footer className="w-full relative z-20 px-6 sm:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[#888] text-[10px] tracking-[0.2em] font-light uppercase border-t border-white/5">
      
      {/* Left: Copyright */}
      <div className="hover:text-white transition-colors cursor-default">
        2XSM © 2024
      </div>

      {/* Center: Slogan */}
      <div className="hover:text-white transition-colors cursor-default tracking-[0.3em]">
        ENGINEERED FOR EXTREMES
      </div>

      {/* Right: Socials */}
      <div className="flex gap-6 items-center">
        {/* X (Twitter) */}
        <a href="#" className="hover:text-white transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        
        {/* Facebook */}
        <a href="#" className="hover:text-white transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </a>
        
        {/* Instagram */}
        <a href="#" className="hover:text-white transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
          </svg>
        </a>
        
        {/* YouTube */}
        <a href="#" className="hover:text-white transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
          </svg>
        </a>
      </div>

    </footer>
  );
};

export default SimpleFooter;
