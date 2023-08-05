
import Header from '@/Components/header'
import Puzzle from '@/Components/puzzle'
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
