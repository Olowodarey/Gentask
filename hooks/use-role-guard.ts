import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "./use-session";
import { UserRole } from "@/lib/types";

export function useRoleGuard(requiredRole: UserRole) {
  const { isSignedIn, activeRole, maintainerEnabled } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (requiredRole === "maintainer" && !maintainerEnabled) {
      // Redirect to setup screen
      router.push("/maintainer/setup");
      return;
    }
  }, [isSignedIn, activeRole, maintainerEnabled, requiredRole, router]);

  return {
    canAccess: isSignedIn && (requiredRole === "contributor" || maintainerEnabled),
    isLoading: false,
  };
}
