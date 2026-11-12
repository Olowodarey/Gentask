import { Session, UserRole } from "@/lib/types";
import { DEMO_PERSONAS, PERSONA_DATA } from "@/lib/mock/personas";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface SignInParams {
  walletAddress: string;
  githubHandle: string;
}

export interface EnableMaintainerParams {
  projectId: string;
  projectName: string;
}

export const authService = {
  async connectWallet(): Promise<{ address: string; balance: number; chainId: string }> {
    await delay(800);
    
    return {
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8",
      balance: 1250.5,
      chainId: "base",
    };
  },

  async connectGitHub(): Promise<{ githubHandle: string }> {
    await delay(600);
    
    return {
      githubHandle: "demo-user",
    };
  },

  async signInWithPersona(personaId: string): Promise<Session> {
    await delay(500);
    
    const persona = DEMO_PERSONAS.find((p) => p.id === personaId);
    if (!persona) {
      throw new Error("Persona not found");
    }

    return {
      walletAddress: persona.walletAddress,
      githubHandle: persona.githubHandle,
      activeRole: "contributor", // Always start as contributor
      maintainerEnabled: persona.maintainerEnabled,
      connectedProjects: persona.connectedProjects,
    };
  },

  async signOut(): Promise<void> {
    await delay(200);
  },

  async enableMaintainer(params: EnableMaintainerParams): Promise<{ projectIds: string[] }> {
    await delay(1000);
    
    // Mock: connect the project
    return {
      projectIds: [params.projectId],
    };
  },

  async switchRole(role: UserRole): Promise<void> {
    await delay(300);
    // Mock role switch with layout transition
  },

  async getSession(): Promise<Session | null> {
    await delay(100);
    // In a real app, this would fetch from backend or JWT
    // For now, Zustand persist handles this
    return null;
  },

  // Get persona-specific mock data
  getPersonaData(personaId: string) {
    return PERSONA_DATA[personaId as keyof typeof PERSONA_DATA] || null;
  },
};
