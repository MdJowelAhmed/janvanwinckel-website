import Image from 'next/image'
import React from 'react'

const AboutUs = () => {
  return (
    <div className='my-20 px-4 md:px-8 lg:px-12' id='about-us'>
        <div className='max-w-4xl mx-auto flex flex-col items-center'>


            <h1 className='text-5xl font-semibold mb-4'>About <span className='text-[#37B7C3]'>Us</span></h1>
        <p className='mb-12 text-[#909090] text-center'>ThePigeonHub.com was created by the team behind the iconic Dubai One Loft Pigeon Race, widely recognized as one of the best-organized One Loft Races in the world. Driven by a passion for excellence and authenticity in the sport, ThePigeonHub aims to improve the quality and credibility of pigeon pedigrees. Our platform makes it easy to create detailed pedigrees, while also providing tools to verify pigeons and recognize the legacy of renowned breeders. At ThePigeonHub, we believe every great pigeon has a story—and we’re here to help you tell it right. </p>

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