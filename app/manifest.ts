import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SakuKu Financial Dashboard',
    short_name: 'SakuKu',
    description: 'Kelola keuangan pribadi dengan cerdas dan estetis.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#f43f5e',
    icons: [
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
