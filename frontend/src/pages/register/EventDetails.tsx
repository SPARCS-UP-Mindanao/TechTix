import React from 'react'
import Icon from "@/components/Icon";
import Separator from '@/components/Separator';

const EventDetails = () => {
  return (
   <>
        <div className="h-full">
            <h1 className="text-lg text-left mb-3">UP Mindanao SPARCS Application A.Y 2023 - 2024</h1>
            <div className="flex text-sm text-left mb-1">
                <Icon name="Clock" className="mr-1"/>
                <p className=""> November 11, 2023 | 12:30 - 5:00 PM GMT+8</p>
            </div>
            <div className="flex">
                <Icon name="MapPin" size={20} className="mr-1"/>
                <p className="flex text-sm text-left mb-4">UP Mindanao, Tugbok, Davao City, 8000, Davao Del Sur</p>
            </div>
        </div>
        <Separator className="my-5"/>
        <div className="mb-12">
            <h3 className="text-base text-left mt-4 mb-6">About this Event</h3>
            <p className="text-sm text-left">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </div>
   </>
  )
}

export default EventDetails