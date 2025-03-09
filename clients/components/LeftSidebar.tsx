'use client'
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import React from 'react'

const LeftSidebar = () => {
    const pathname = usePathname();
    return (
        <section className='left_sidebar'>
            <nav className='flex flex-col gap-6'>
                <Link href='/' className='flex cursor-pointer items-center gap-2 pb-10 max-lg:justify-center'>
                    <Image src='/icons/logo.svg' alt='logo' width={27} height={27} />
                    <h1 className='text-24 font-extrabold text-white max-lg:hidden'>Easy Order</h1>
                </Link>
                {sidebarLinks.map((item) => {
                    const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;

                    return (
                        <Link href={item.route} key={item.label} className={cn('flex items-center gap-3 py-4 max-lg:px-4 lg:justify-start justify-center', { 'bg-nav-focus border-r-4 border-orange-1': isActive })}>
                            <Image src={item.icon} alt={item.label} width={24} height={24} />
                            <h1 className='text-24 font-extrabold text-white max-lg:hidden'>{item.label}</h1>
                        </Link>
                    )
                })}
            </nav>
        </section>
    )
}

export default LeftSidebar