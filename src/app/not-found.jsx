import { Button } from '@/components/ui/button'
import { ArrowBigLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function notFound() {
    return (
        <div className='h-screen flex flex-col items-center justify-center'>
            <img src="/notfound.png" width={500} />
            <div className='text-center mt-6'>
                <h2 className='text-4xl font-bold mb-2'>Page Not Found</h2>
                <p className='text-gray-700 mb-4'>This page is not existant, please you are imagining.</p>
                <Link href="/">
                    <Button className="bg-indigo-700">
                        <ArrowBigLeft />
                        Home
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default notFound