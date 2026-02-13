'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import Button from './components/base/Button'
import Navbar from './components/layout/Navbar'
import Loader from './components/base/Loader'
import { sampleMenuItems } from '@/lib/data/SampleMenu'
import UniversalSearch from './components/ui/UniversalSearch'
import DynamicGreeting from './components/ui/DynamicGreeting'
import HeroSearch from './components/sections/HeroSearch'
import MenuGrid from './components/ui/MenuGrid'






export default function page() {
  const [isLoading, setIsLoading] = useState(false);



  return (
    <div className='  overflow-y-auto'>
      <div>
        <Navbar />

      </div>
      <div className='mt-24 '>
        <HeroSearch />

      </div>
      <MenuGrid />







    </div>
  )
}
