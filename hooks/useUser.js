import { useSession, signIn, signOut } from "next-auth/react";
import { useQuery } from "react-query";
import useAlerts from "./useAlerts";

export default function useUser() {
  const { showAlert } = useAlerts();
  const { data: session = { loading: true } } = useSession();

  const {
    isLoading: dbUserLoading,
    error,
    data: dbUser = {},
  } = useQuery("user", async () => await fetch(`/api/users/${session?.user?.email}`), {
    enabled: session?.user?.email,
  });

  if (error) {
    showAlert({
      status: "error",
      title: "User Database Error",
      description: error.message,
    });
  }

  return {
    user: {
      ...dbUser,
      ...session?.user,
    },
    signIn,
    signOut,
    isUserLoading: dbUserLoading || session?.loading,
  };
}
