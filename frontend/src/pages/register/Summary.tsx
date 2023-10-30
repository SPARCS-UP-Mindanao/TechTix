import React from 'react'
import { useFormContext } from 'react-hook-form'

const Summary = () => {
    const form  = useFormContext(); 
    const summary = form.watch();
    return (
        <>
            <h3>Summary</h3>
            <h3>User Bio</h3>
            <p>{summary.firstName}</p>
            <p>{summary.lastName}</p>
            <p>{summary.email}</p>
            <p>{summary.contactNumber}</p>
            
            <h3>Personal Information</h3>
            <p>{summary.status}</p>
            <p>{summary.yearsOfExperience}</p>
            <p>{summary.organization}</p>
            <p>{summary.title}</p>
        </>
    )
}

export default Summary