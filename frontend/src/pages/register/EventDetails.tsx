import React from 'react'
import Icon from "@/components/Icon";

const EventDetails = () => {
  return (
   <>
        <div className="border-b-2 h-full">
            <h1 className="text-xl text-left">UP Mindanao SPARCS Application A.Y 2023 - 2024</h1>
            <div className="inline-flex items-center text-left">
                <Icon name="Clock"/>
                <p className="text-base text-left"> November 11, 2023 | 12:30 - 5:00 PM GMT+8</p>
            </div>
            <div className="inline-flex">
                <Icon name="MapPin"/>
                <p className="text-base items-center text-left">UP Mindanao, Tugbok, Davao City, 8000, Davao Del Sur</p>
            </div>
        </div>
        <div>
            <h3 className="text-lg text-left">About this Event</h3>
            <p className="text-base text-left">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </div>
   </>
  )
}

export default EventDetails