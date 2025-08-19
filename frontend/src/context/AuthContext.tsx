import React from 'react';
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import {
  AuthSession,
  fetchAuthSession,
} from "aws-amplify/auth";
import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@/api/utils/createApi';

Amplify.configure(outputs);

interface AuthContextProviderProps {
  children: React.ReactNode;
}

type AuthContext = {
  user: AuthSession;
} | null

export const AuthContext = React.createContext<AuthContext>(null);


const AuthContextProvider = ({ children }: AuthContextProviderProps) => {


  const { data, isFetching } = useQuery({
    queryKey: createQueryKey('getCurrentUser'),
    queryFn: async () => await fetchAuthSession(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  if (isFetching){
    //todo
    return <></>
  }
  
  return (
    <AuthContext.Provider value={{user:data!}}>
      {children}
      </AuthContext.Provider>
  );
};

export default AuthContextProvider;
