import React from 'react'

const steps = ['EventDetails', 'UserBio', 'PersonalInfo', 'Summary'];
const Stepper = () => {
    return (
        <>
            {steps.map((step) => (
            <>
                {step}
            </>
            ))}
        </>
    )
}

export default Stepper