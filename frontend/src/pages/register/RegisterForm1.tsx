import { FormItem, FormLabel, FormError } from "@/components/Form";
import Input from "@/components/Input";

const RegisterForm1 = () => {
    return (
        <>
            <FormItem name="firstName">
                {({ field }) => (
                <div className="flex flex-col items-start mb-5 space-y-2 w-full">
                    <FormLabel>First Name</FormLabel>
                    <Input type="text" className="bg-white text-black" {...field} />
                    <FormError />
                </div>
                )}
            </FormItem>

            <FormItem name="lastName">
                {({ field }) => (
                <div className="flex flex-col items-start mb-5 space-y-2 w-full">
                    <FormLabel>Last Name</FormLabel>
                    <Input type="text" className="bg-white text-black" {...field} />
                    <FormError />
                </div>
                )}
            </FormItem>

            <FormItem name="email">
                {({ field }) => (
                <div className="flex flex-col items-start mb-5 space-y-2 w-full">
                    <FormLabel>Email</FormLabel>
                    <Input type="email" className="bg-white text-black"{...field} />
                    <FormError />
                </div>
                )}
            </FormItem>

            <FormItem name="contactNumber">
                {({ field }) => (
                <div className="flex flex-col items-start mb-5 space-y-2 w-full">
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