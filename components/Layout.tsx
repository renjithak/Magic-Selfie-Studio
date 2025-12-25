
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Magic Selfie Studio
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-500 font-medium">
            <span>Powered by Gemini</span>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="hover:text-indigo-600">API Docs</a>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Magic Selfie Studio. AI-generated photography.</p>
      </footer>
    </div>
  );
};
