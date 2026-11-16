import { useSessionStore } from "@/lib/store/session-store";

export function useSession() {
  const {
    walletAddress,
    githubHandle,
    activeRole,
    maintainerEnabled,
    connectedProjects,
    isConnecting,
    balance,
    chainId,
    setWallet,
    setGitHub,
    enableMaintainer,
    switchRole,
    disconnect,
    setConnecting,
  } = useSessionStore();

  const isSignedIn = !!walletAddress && !!githubHandle;

  return {
    // State
    walletAddress,
    githubHandle,
    activeRole,
    maintainerEnabled,
    connectedProjects,
    isConnecting,
    balance,
    chainId,
    isSignedIn,
    
    // Actions
    setWallet,
    setGitHub,
    enableMaintainer,
    switchRole,
    disconnect,
    setConnecting,
  };
}
