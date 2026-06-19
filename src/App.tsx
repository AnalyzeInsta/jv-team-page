import { Team } from './components/Team'
import { Sparkles, ArrowUpRight, Github } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Premium Header */}
      <header className="border-b border-border/40 bg-card/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a 
              href="https://analyzeinsta.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center font-bold text-primary-foreground shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
                AI
              </div>
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 group-hover:text-primary transition-colors">
                AnalyzeInsta
              </span>
            </a>
            <span className="text-[10px] font-mono bg-primary/10 text-primary border border-primary/25 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              Open Source
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/analyzeinsta/jv-team-page"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium bg-secondary/50 border border-border/50 px-3 py-1.5 rounded-xl"
            >
              <Github size={14} />
              <span>Contribute</span>
            </a>
            <a 
              href="https://analyzeinsta.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-primary hover:underline flex items-center gap-0.5 font-semibold group"
            >
              <span>Visit analyzeinsta.com</span>
              <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Team />
      </main>

      {/* Premium Minimalist Footer */}
      <footer className="border-t border-border/20 py-8 bg-card/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()}</span>
            <a href="https://analyzeinsta.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-semibold">
              AnalyzeInsta
            </a>
            <span>• Developed by Julian Vance</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/analyzeinsta/jv-team-page/blob/main/LICENSE" 
              className="hover:text-foreground transition-colors"
            >
              MIT License
            </a>
            <span>•</span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground/40 font-mono">
              <Sparkles size={10} className="text-primary/60" /> Powered by Antigravity AI
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
