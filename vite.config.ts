import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({plugins:[react(),VitePWA({registerType:'autoUpdate',manifest:{name:'CyberGuard AI',short_name:'CyberGuard',start_url:'/',display:'standalone',background_color:'#09060E',theme_color:'#09060E',icons:[{src:'icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]},includeAssets:['icon.svg']})]})
