import React from 'react';
import Skeleton from "@/components/Skeleton"

const RegisterFormLoading: React.FC = () => {
  return (
    <>
        <Skeleton className="w-[100px] h-[20px] rounded-full" />
    </>
  );
};

export default RegisterFormLoading;