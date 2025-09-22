import Image from 'next/image'
import React from 'react'

const AboutUs = () => {
  return (
    <div className='my-20 px-4 md:px-8 lg:px-12'>
        <div className='max-w-3xl mx-auto flex flex-col items-center'>


            <h1 className='text-5xl font-semibold mb-4'>About <span className='text-[#37B7C3]'>Us</span></h1>
        <p className='mb-12 text-[#909090] text-center'>Our mission is to make pigeon management simple, smart, and reliable. From maintaining pedigrees to tracking race results, we provide powerful tools to help you organize and showcase </p>

        </div>

        <div className='w-full'>
            <Image
                src="/assests/aboutus.webp"
                alt="About Us"
                width={500}
                height={500}
                className='rounded-md w-full'
                priority
                loading='eager'
                objectFit='contain'
                quality={100}


            />

        </div>
    </div>
  )
}

export default AboutUs