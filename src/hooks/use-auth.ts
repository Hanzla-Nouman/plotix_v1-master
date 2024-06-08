import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAuth = () => {
  const session = useSession();
  const router = useRouter();

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/sign-in");
      toast.success("Signed out successfully");
      router.refresh();
    } catch (err) {
      toast.error("Couldn't sign out, please try again.");
    }
  };

  return { user: session.data?.user, logout, updateSesssion: session.update };
};
