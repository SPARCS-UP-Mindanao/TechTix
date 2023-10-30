import Avatar from "@/components/Avatar";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormDescription,
  FormItem,
  FormLabel,
  FormError,
} from "@/components/Form";
import Input from "@/components/Input";
import { FormProvider } from "react-hook-form";
import Button from "@/components/Button";
import image_placeholder from "./image_placeholder/sparcs-image-placeholder.png";

const ClaimCertificateSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

// TO REMOVE
const logo_placeholder = [
  "1UNEuxhoCBbFXkEnmWfpwaBykjLTkOMDE",
  "1NXwPcnLz_FiLeilirIOly-o5Pa_lFqh1",
  "15ouLpbrCkm-PNbr2JJiz-QNruKj2zURc",
  "1J1H5NsTH37NjSM768dLZCVjLBMSIfNcv",
];

const EventInformation = () => {
  const form = useForm<z.infer<typeof ClaimCertificateSchema>>({
    resolver: zodResolver(ClaimCertificateSchema),
    defaultValues: {
      email: "",
    },
  });

  const submit = form.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <>
      <div className="flex flex-col items-center pt-4">
        <div className="h-12 w-12">
          <Avatar src="https://github.com/shadcn.png" fallback="CN" />
        </div>
        <div className="mt-6 sm:h-72 w-[91vw] drop-shadow-xl">
          <img
            src={image_placeholder}
            alt="image_placeholder"
            className="rounded-2xl object-center object-cover w-full h-full"
          />
        </div>
        <p className="mt-7 text-xl font-bold">
          UP Mindanao SPARCS Application A.Y 2023 - 2024
        </p>
        <div className="flex flex-col items-center h-64 w-[91vw] mt-8 rounded-2xl border-2 border-[#B0B0B0] bg-[#F6F6F6] p-4">
          <p className="text-black text-base font-bold">
            CLAIM YOUR CERTIFICATE
          </p>
          <div className="w-11/12 mt-2.5">
            <FormProvider {...form}>
              <FormItem name="email">
                {({ field }) => (
                  <div className="flex flex-col items-start mb-5 space-y-2">
                    <FormLabel className="text-black">
                      Enter your e-mail
                    </FormLabel>
                    <Input
                      type="email"
                      {...field}
                      className="text-black rounded-2xl"
                      placeholder="email@example.com"
                    />
                    <FormDescription className="text-[#4F4F4F] text-left">
                      Use the e-mail address you used when signing up for the
                      event
                    </FormDescription>
                    <FormError />
                  </div>
                )}
              </FormItem>
              <Button
                onClick={submit}
                className="w-full bg-[#1F3BD8] text-white rounded-2xl focus:bg-[#1F3BD8] hover:bg-[#1F3BD8]"
              >
                Claim
              </Button>
            </FormProvider>
          </div>
        </div>
        <div className="flex flex-row flex-wrap justify-center w-full mt-14">
          {logo_placeholder.map((id) => (
            <img
              src={`https://drive.google.com/uc?export=view&id=${id}`} // TO Modify
              alt="image_placeholder"
              className="rounded-2xl object-center object-cover h-10"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default EventInformation;
