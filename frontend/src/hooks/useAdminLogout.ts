import { logoutUser } from "@/api/auth";
import { useSignOut } from "react-auth-kit";
import { useFetchQuery } from "@/hooks/useApi";
import { getCookie, removeCookie } from "typescript-cookie";
import { useNavigate } from "react-router-dom";

export const useAdminLogout = () => {
  const navigate = useNavigate();
  const { fetchQuery } = useFetchQuery();
  const signOut = useSignOut();

  const onLogoutAdmin = async () => {
    try {
      const accessToken = getCookie("_auth")!;
      const data = await fetchQuery(logoutUser(accessToken));
      if (data) {
        signOut();
        removeCookie("_auth_user");
        navigate("/admin/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { onLogoutUser: onLogoutAdmin };
};
