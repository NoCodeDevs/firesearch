import { Chat } from './chat';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Advanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Primary morphing gradient blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-500/25 to-teal-500/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/15 to-purple-500/10 rounded-full blur-3xl animate-pulse-glow"></div>

        {/* Secondary floating elements */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/15 rounded-full blur-2xl animate-bounce-in" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-500/15 to-red-500/10 rounded-full blur-2xl animate-bounce-in" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 right-1/3 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-violet-500/15 rounded-full blur-2xl animate-bounce-in" style={{ animationDelay: '3s' }}></div>

        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>

        {/* Subtle particle effect */}
        <div className="absolute inset-0 particles"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Sticky Pill Navigation */}
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6">
          <nav className="max-w-7xl mx-auto">
            <div className="glass-premium rounded-full px-6 md:px-8 py-3 border border-white/10 shadow-glow-lg backdrop-blur-xl bg-slate-900/80">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-glow">
                    <span className="text-white font-bold text-sm md:text-lg">🔥</span>
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      FireSearch AI
                    </h1>
                  </div>
                  <div className="sm:hidden">
                    <h1 className="text-base font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      FireSearch
                    </h1>
                  </div>
                </div>

                {/* Tech Stack Connectors */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {/* Firecrawl Connector */}
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-glow border border-slate-700">
                      <span className="text-white text-xs">⚡</span>
                    </div>
                    {/* Connection Line */}
                    <div className="w-3 h-0.5 bg-gradient-to-r from-orange-500 to-green-500 data-flow-line"></div>
                    {/* OpenAI Connector */}
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-glow border border-slate-700" style={{ animationDelay: '0.2s' }}>
                      <span className="text-white text-xs">🤖</span>
                    </div>
                    {/* Connection Line */}
                    <div className="w-3 h-0.5 bg-gradient-to-r from-green-500 to-purple-500 data-flow-line" style={{ animationDelay: '0.4s' }}></div>
                    {/* LangGraph Connector */}
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-glow border border-slate-700" style={{ animationDelay: '0.6s' }}>
                      <span className="text-white text-xs">🧠</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-slate-300 font-medium hidden md:inline">Connected</span>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 relative px-6 pb-12 pt-24 md:pt-28">
          <Chat />
        </main>

        {/* Enhanced Footer */}
        <footer className="relative z-20 border-t border-white/10 bg-gradient-to-t from-slate-900/80 to-transparent backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Brand Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow">
                    <span className="text-white font-bold text-xl">🔥</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      FireSearch AI
                    </h3>
                    <p className="text-sm text-slate-400">Market Intelligence Platform</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Empowering entrepreneurs with AI-powered market research, competitive analysis, and real-time insights across 40+ industries.
                </p>
              </div>



              {/* Tech Stack */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Powered By</h4>
                <div className="space-y-3">
                  <a
                    href="https://firecrawl.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-slate-300 hover:text-white transition-all duration-300 group hover-lift"
                  >
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">⚡</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Firecrawl</div>
                      <div className="text-xs text-slate-400">Data Extraction</div>
                    </div>
                  </a>
                  <a
                    href="https://www.langchain.com/langgraph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-slate-300 hover:text-white transition-all duration-300 group hover-lift"
                  >
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🧠</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">LangGraph</div>
                      <div className="text-xs text-slate-400">AI Orchestration</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-sm text-slate-400">
                  <span className="font-medium">© 2024 FireSearch AI</span>
                  <span className="hidden md:block text-white/20">•</span>
                  <span className="font-medium">Built for Entrepreneurs</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Status:</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-emerald-400 font-medium">All Systems Operational</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}