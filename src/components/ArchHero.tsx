import { motion } from 'framer-motion'
const scenes=[['#2A0F45','#A644D6'],['#1A1124','#D65CEB'],['#251833','#BA55EC'],['#110B1A','#A644D6']]
export default function ArchHero({word,height=340}:{word:string;height?:number}){
 return <div className="relative w-full overflow-hidden" style={{height}}>
  <div className="absolute inset-0 flex justify-center gap-4 md:gap-8 px-4">
   {scenes.map(([a,b],i)=><motion.svg key={i} viewBox="0 0 100 200" preserveAspectRatio="none" className="h-full flex-1 max-w-[190px]" initial={{y:60,opacity:0}} animate={{y:i%2?24:0,opacity:1}} transition={{duration:1,delay:i*.12,ease:'easeOut'}}>
    <defs><linearGradient id={`g${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a}/><stop offset="1" stopColor={b} stopOpacity=".85"/></linearGradient><clipPath id={`c${i}`}><path d="M0 200V50A50 50 0 0 1 100 50V200Z"/></clipPath></defs>
    <g clipPath={`url(#c${i})`}><rect width="100" height="200" fill={`url(#g${i})`}/>
     {Array.from({length:7}).map((_,k)=><rect key={k} x={k*15+((i*7+k*5)%6)} y={90+((i*23+k*37)%60)} width="9" height="200" fill="#09060E" opacity=".55"/>)}
     </g></motion.svg>)}
  </div>
  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#09060E] to-transparent"/>
  <h1 className="login-brand-word absolute inset-0 flex items-center justify-center font-serif tracking-[.08em] text-[clamp(44px,11vw,150px)] mix-blend-normal">{word}</h1>
 </div>}
