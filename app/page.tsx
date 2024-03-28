import Image from 'next/image'
import Link from 'next/link'

import Product from './components/product'
export default function Home() {
  return (
    <main className=' bg-red-400 w-full h-20 '>
   <div className='text-center my-5 flex flex-col gap-4 p-5 mt-0' >
   <h1 className='text-4xl font-bold text-white'>CRUD project</h1>
   <Product/>
</div>
   </main>
   
  )
}
