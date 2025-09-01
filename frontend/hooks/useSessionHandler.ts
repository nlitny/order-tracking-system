import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export function useSessionHandler() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (
      session?.error === "RefreshTokenExpired" ||
      session?.error === "InvalidRefreshToken"
    ) {
      console.log("[NextAuth] Session expired, signing out...");
      signOut({
        callbackUrl: "/auth",
        redirect: true,
      });
    }
  }, [session]);

  return { session, status };
}
