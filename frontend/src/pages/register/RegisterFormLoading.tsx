import React from 'react';

const RegisterFormLoading: React.FC = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse mb-4"></div>
        <div className="w-full h-56 bg-gray-300 rounded-md animate-pulse mb-4"></div>
        <div className="w-full h-8 bg-gray-300 rounded-sm animate-pulse mb-2"></div>
        <div className="w-full h-5 bg-gray-300 rounded-sm animate-pulse my-2"></div>
        <div className="w-full h-6 bg-gray-300 rounded-sm animate-pulse mt-2 mb-20"></div>

        <div className="w-full">
          <div className="space-y-4 mb-12">
            <div className="w-28 h-4 bg-gray-300 rounded-sm animate-pulse"></div>
            <div className="w-full h-12 bg-gray-300 rounded-sm animate-pulse"></div>
            <div className="w-full h-12 bg-gray-300 rounded-sm animate-pulse"></div>
          </div>

          <div className="flex w-full justify-around my-4">
            <div className="w-28 h-12 rounded-md bg-gray-300 animate-pulse" />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterFormLoading;