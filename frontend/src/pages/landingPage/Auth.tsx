import { useAuth } from "@/hooks/useAuth";
import { signInWithRedirect, signOut } from "aws-amplify/auth";

const AuthPage = () => {
  const auth = useAuth();
  console.log("auth", auth);
  const onClickSignIn = async () => {
    try {
      await signInWithRedirect({ provider: "Google" });
    } catch (error) {
      console.error("Error signing in:", error);
    }
  }

  const signOutUser = async () => {
    console.log("signOutUser called");
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      window.location.reload();
    }
  }

  return <header className="w-full flex justify-end p-2">
    {
      auth?.user?.tokens
        ? <div className="flex flex-row items-center gap-x-2">
          <div>{auth.user.tokens?.idToken?.payload?.name?.toString()}</div>
          <img onMouseDown={async () => await signOutUser()} className="rounded-full w-10 cursor-pointer" src={auth.user.tokens?.idToken?.payload?.picture?.toString()} alt="user profile" />
        </div>
        : <button className="rounded-md" onClick={onClickSignIn}>
          Sign In with Google
        </button>
    }
  </header>
}

export const Component = AuthPage;

export default AuthPage;