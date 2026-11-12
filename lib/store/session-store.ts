import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Session, UserRole } from "@/lib/types";

interface SessionStore extends Session {
  isConnecting: boolean;
  balance: number;
  chainId: string;
  
  // Actions
  setWallet: (address: string, balance: number, chainId: string) => void;
  setGitHub: (githubHandle: string) => void;
  enableMaintainer: (projectIds: string[]) => void;
  switchRole: (role: UserRole) => void;
  disconnect: () => void;
  setConnecting: (connecting: boolean) => void;
}

const initialState: Session = {
  walletAddress: null,
  githubHandle: null,
  activeRole: "contributor",
  maintainerEnabled: false,
  connectedProjects: [],
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      ...initialState,
      isConnecting: false,
      balance: 0,
      chainId: "base",

      setWallet: (address, balance, chainId) =>
        set({ walletAddress: address, balance, chainId }),

      setGitHub: (githubHandle) => set({ githubHandle }),

      enableMaintainer: (projectIds) =>
        set({
          maintainerEnabled: true,
          connectedProjects: projectIds,
          activeRole: "maintainer",
        }),

      switchRole: (role) => set({ activeRole: role }),

      disconnect: () =>
        set({
          ...initialState,
          balance: 0,
          chainId: "base",
        }),

      setConnecting: (connecting) => set({ isConnecting: connecting }),
    }),
    {
      name: "gentask-session",
      partialize: (state) => ({
        walletAddress: state.walletAddress,
        githubHandle: state.githubHandle,
        activeRole: state.activeRole,
        maintainerEnabled: state.maintainerEnabled,
        connectedProjects: state.connectedProjects,
      }),
    }
  )
);
