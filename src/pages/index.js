
import Header from '@/components/header'
import Puzzle from '@/components/puzzle'
import { Inter } from '@next/font/google'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
  <Header/>
  <Puzzle/>
    </>
  )
}
