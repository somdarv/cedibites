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
        <div className=''>
            <div className='w-[95%] bg-primary/5  border-b border-neutral-gray/20  md:w-[80%]  xl:w-[70%] my-2 p-6 rounded-2xl  mx-auto flex items-center justify-between'>
                <div className='shrink-0  '>
                    <DynamicGreeting />
                </div>
                <UniversalSearch items={sampleMenuItems} />
                {/* the cart icon */}

            </div>



            {/* categories */}
            <div className='gap-4 w-[95%]  md:w-[80%]  xl:w-[70%] mx-auto my-2 flex items-center justify-start flex-wrap'>
                {HeroSearchCategoryItems.map((item) => (

                    <button
                        key={item.id}
                        onClick={() => setSelectedCategory(item.id === selectedCategory ? null : item.id)}
                        className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium text-text-dark dark:text-text-light transition-all border border-primary
                ${selectedCategory === item.id
                                ? 'bg-primary text-text-light'
                                : ' hover:bg-primary/20'
                            }`}
                    >
                        <p>{item.label}</p>
                    </button>
                ))}
            </div>

        </div>
    )
}
