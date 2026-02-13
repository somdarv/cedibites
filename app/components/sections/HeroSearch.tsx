import React from 'react'
import DynamicGreeting from '../ui/DynamicGreeting'
import UniversalSearch from '../ui/UniversalSearch'
import { sampleMenuItems } from '@/lib/data/SampleMenu'
import { HeroSearchCategoryItems } from '@/lib/data/HeroSearchCategoryItems'
import { useMenuDiscovery } from '../providers/MenuDiscoveryProvider'
import { ShoppingBagIcon } from '@phosphor-icons/react'




export default function HeroSearch() {

    const { selectedCategory, setSelectedCategory } = useMenuDiscovery();



    return (
        <div className='w-full bg-primary/5 px-6 md:px-4 lg:px-12 py-4 md:py-8 lg:py-10 md:mt-32 border-neutral-gray/20  md:w-[85%] lg:w-[95%]  2xl:w-[80%]   rounded-2xl items-start  mx-auto flex justify-items-start flex-wrap md:flex-nowrap md:justify-between'>
            <div className='md:shrink-0 md:w-[25%] bg-green-2 '>
                <DynamicGreeting />
            </div>

            <div className='min-w-0 md:w-[70%] bg-blue-20'>
                <div className='w-full bg-red-20    '>
                    <UniversalSearch items={sampleMenuItems} />

                </div>


                <div className=' '>
                    {/* categories */}
                    <div className='flex gap-3 w-ful overflow-x-auto no-scrollbar my-1 lg:my-3  pb-1'>
                        {HeroSearchCategoryItems.map((item) => (

                            <button
                                key={item.id}
                                onClick={() => setSelectedCategory(item.id === selectedCategory ? null : item.id)}
                                className={`cursor-pointer  shrink-0 px-4 py-2 rounded-full text-sm font-medium text-text-dark dark:text-text-light transition-all border border-primary
                         ${selectedCategory === item.id
                                        ? 'bg-primary text-text-light'
                                        : ' hover:bg-primary/20'
                                    }`} >
                                <p>{item.label}</p>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>





    )
}
