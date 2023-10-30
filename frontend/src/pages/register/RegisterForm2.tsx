import Input from "@/components/Input";
import { useFormContext } from "react-hook-form";
import { FormItem, FormLabel, FormError } from "@/components/Form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/Select";

const RegisterForm1 = () => {
    const form  = useFormContext(); 
    const status = form.watch('status');
    return (
        <>
            <h1 className="text-xl">Register</h1>
            <FormItem name="status">
                {({ field }) => (
                    <div className="flex flex-col items-start mb-5 space-y-2">
                        <FormLabel>Status</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Student">Student</SelectItem>
                                <SelectItem value="Professional">Professional</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormError />
                    </div>
                )}
            </FormItem>

            {status === "Professional" && (
                <FormItem name="yearsOfExperience">
                    {({ field }) => (
                        <div className="flex flex-col items-start mb-5 space-y-2">
                            <FormLabel>Years of Experience</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Years of Experience" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1-3">1-3</SelectItem>
                                    <SelectItem value="3-5">3-5</SelectItem>
                                    <SelectItem value="5-10">5-10</SelectItem>
                                    <SelectItem value="10 and above">10 and above</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormError />
                        </div>
                    )}
                </FormItem>
            )}

            <FormItem name="organization">
                {({ field }) => (
                    <div className="flex flex-col items-start mb-5 space-y-2">
                        <FormLabel optional>Organization</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter organization name"
                            className="bg-white text-black"
                            {...field}
                        />
                        <FormError />
                    </div>
                )}
            </FormItem>

            <FormItem name="title">
                {({ field }) => (
                    <div className="flex flex-col items-start mb-5 space-y-2">
                        <FormLabel optional>Title</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter organization title"
                            className="bg-white text-black"
                            {...field}
                        />
                        <FormError />
                    </div>
                )}
            </FormItem>
        </>
    )
}

export default RegisterForm1