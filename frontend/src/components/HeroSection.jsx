import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobslice'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const [query,setQuery]=useState("")
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const searchJobhandler=()=>{
        dispatch(setSearchedQuery(query))
        navigate("/browse")
    }
    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#f83002]  font-medium'>No. 1 Job Hunt Website</span>
                <h1 className='text-5xl font-bold'>Search,Apply & <br />Get Your <span className='text-[#6A38C2]'>Dreams Jobs</span></h1>
                <p>Explore thousands of opportunities and land your dream job today.</p>

            </div>
            <div className='flex w-[30%] shadow-lg border border-gray-200 pl-3 my-10 rounded-full items-center gap-5 mx-auto'>
                <input
                    type="text"
                    placeholder='find your dream jobs'
                    onChange={(e)=>setQuery(e.target.value)}
                    className='outline-none border-none w-full'

                />
            <Button onClick={searchJobhandler} className='rounded-r-full bg-[#6A38C2]'>
                <Search className='h-5 w-5'/>
            </Button>
            </div>


        </div>
    )
}

export default HeroSection
