import { FormItem, FormLabel, FormError } from "@/components/Form";
import Input from "@/components/Input";

const RegisterForm1 = () => {
    return (
        <>
            <h1 className="text-xl">Register</h1>
            <FormItem name="firstName">
                {({ field }) => (
                <div className="flex flex-col items-start mb-5 space-y-2">
                    <FormLabel>First Name</FormLabel>
                    <Input type="text" className="bg-white text-black" {...field} />
                    <FormError />
                </div>
                )}
            </FormItem>

            <FormItem name="lastName">
                {({ field }) => (
                <div className="flex flex-col items-start mb-5 space-y-2">
                    <FormLabel>Last Name</FormLabel>
                    <Input type="text" className="bg-white text-black" {...field} />
                    <FormError />
                </div>
                )}
            </FormItem>

            <FormItem name="email">
                {({ field }) => (
                <div className="flex flex-col items-start mb-5 space-y-2">
                    <FormLabel>Email</FormLabel>
                    <Input type="email" className="bg-white text-black"{...field} />
                    <FormError />
                </div>
                )}
            </FormItem>

            <FormItem name="contactNumber">
                {({ field }) => (
                <div className="flex flex-col items-start mb-5 space-y-2">
                    <FormLabel>Contact #</FormLabel>
                    <Input type="text" placeholder="09XXXXXXXXX" className="bg-white text-black" {...field} />
                    <FormError />
                </div>
                )}
            </FormItem>
        </>
    )
}

export default RegisterForm1