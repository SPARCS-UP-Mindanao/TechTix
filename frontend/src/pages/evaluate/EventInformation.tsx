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
import Icon from "@/components/Icon";
import image_placeholder from "./image_placeholder/sparcs-image-placeholder.png";
import sparcs_logo_white from "../../assets/logos/sparcs_logo_white.png"

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
          <Avatar src={sparcs_logo_white} fallback="CN" />
        </div>
        <div className="mt-6 sm:h-72 w-[91vw] drop-shadow-xl">
          <img
            src={image_placeholder}
            alt="image_placeholder"
            className="rounded-2xl object-center object-cover w-full h-full"
          />
        </div>
        <div className="mt-6 w-[91vw]">
          <p className="text-xl font-subjectivity font-bold text-left leading-6">UP Mindanao SPARCS Application A.Y 2023 - 2024</p>
          <div className="w-full mt-3.5 space-y-1.5 items-start">
            <div className="flex">
              <Icon name="Clock" weight="light" className="w-6 h-6" />
              <span className="text-sm font-raleway font-medium text-left leading-5 ml-1">November 11, 2023  |  12:30 – 5:00 PM GMT+8</span>
            </div>
            <div className="flex">
              <Icon name="MapPin" weight="light" className="w-6 h-6" />
              <p className="text-sm font-raleway font-medium text-left leading-5 ml-1">UP Mindanao, Tugbok, Davao City, 8000 Davao del Sur</p>
            </div>
          </div>
          <hr className="bg-neutral-200 my-9" />
          <div>
            <p className="text-left font-raleway font-semibold text-lg leading-5 tracking-tight mb-6">Claim your certificate by evaluating the event</p>
            <FormProvider {...form}>
                <FormItem name="email">
                  {({ field }) => (
                    <div className="flex flex-col items-start space-y-2">
                      <FormLabel className="font-raleway text-neutral-50 font-medium leading-5 tracking-tight">
                        Enter your e-mail
                      </FormLabel>
                      <Input
                        type="email"
                        {...field}
                        className="text-neutral-300 rounded-2xl py-3 px-6 my-3 bg-neutral-900 tracking-tighter leading-5"
                        placeholder="Email"
                      />
                      <FormDescription className="text-left font-raleway font-medium text-sm leading-4 tracking-tighter text-neutral-300">
                        *Please enter the email address you used when registering for the event 
                      </FormDescription>
                      <FormError />
                    </div>
                  )}
                </FormItem>
                <Button
                  onClick={submit}
                  className="py-3 px-12 rounded-2xl font-bold font-raleway leading text-white bg-gradient-to-r from-[#4F65E3] to-[#F43F79]"
                >
                  Evaluate
                </Button>
              </FormProvider>
          </div>
        </div>
        {/* <p className="mt-7 text-xl font-bold">
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
        </div> */}
      </div>
    </>
  );
};

export default EventInformation;
