'use client'
import React from 'react'
import Navbar from '../components/layout/Navbar'
import HeroSearch from '../components/sections/HeroSearch'
import MenuGrid from '../components/ui/MenuGrid'

export default function page() {
    return (
        <div>
            <Navbar />
            <div className='mt-24 '>
                <HeroSearch />

            </div>
            <MenuGrid />
        </div>
    )
}
