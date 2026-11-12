import { Moon, Sun } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useApp } from '../context/AppContext'

export default function ThemeToggle(){
 const {theme,toggleTheme}=useApp()
 const nextTheme=theme==='dark'?'light':'dark'
 const reduceMotion=useReducedMotion()
 return <button type="button" role="switch" aria-label="Dark mode" aria-checked={theme==='dark'} onClick={toggleTheme} title={`Switch to ${nextTheme} mode`} className="relative h-10 w-[88px] overflow-hidden rounded-full border bg-elev p-1 shadow-inner transition-colors">
  <motion.span
   aria-hidden="true"
   animate={{x:theme==='light'?0:40}}
   transition={reduceMotion?{duration:0}:{type:'spring',stiffness:520,damping:34}}
   className={`absolute left-1 top-1 z-0 h-8 w-10 rounded-full shadow-md ${theme==='dark'?'bg-[#A644D6] shadow-[0_0_14px_rgba(214,92,235,.45)]':'bg-amber-400 shadow-[0_0_14px_rgba(245,158,11,.35)]'}`}
  />
  <span aria-hidden="true" className="relative grid h-8 grid-cols-2">
   <Sun size={17} strokeWidth={1.8} className={`place-self-center transition-colors ${theme==='light'?'text-[#422500]':'text-muted'}`}/>
   <Moon size={16} strokeWidth={1.8} className={`place-self-center transition-colors ${theme==='dark'?'text-white':'text-muted'}`}/>
  </span>
 </button>
}
