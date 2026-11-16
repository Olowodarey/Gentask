"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/utils/animation";
import { Wallet, Github, Loader2 } from "lucide-react";
import { authService } from "@/lib/services/auth-service";
import { useSession } from "@/hooks/use-session";
import { DEMO_PERSONAS } from "@/lib/mock/personas";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const { setWallet, setGitHub, enableMaintainer, setConnecting } = useSession();
  const [step, setStep] = useState<"wallet" | "github" | "done">("wallet");
  const [loading, setLoading] = useState(false);

  const handleConnectWallet = async () => {
    setLoading(true);
    setConnecting(true);
    try {
      const wallet = await authService.connectWallet();
      setWallet(wallet.address, wallet.balance, wallet.chainId);
      setStep("github");
      toast.success("Wallet connected");
    } catch (error) {
      toast.error("Failed to connect wallet");
    } finally {
      setLoading(false);
      setConnecting(false);
    }
  };

  const handleConnectGitHub = async () => {
    setLoading(true);
    try {
      const github = await authService.connectGitHub();
      setGitHub(github.githubHandle);
      toast.success("GitHub connected");
      router.push("/contributor/overview");
    } catch (error) {
      toast.error("Failed to connect GitHub");
      setLoading(false);
    }
  };

  const handlePersonaClick = async (personaId: string) => {
    setLoading(true);
    setConnecting(true);
    try {
      const session = await authService.signInWithPersona(personaId);
      const persona = DEMO_PERSONAS.find((p) => p.id === personaId)!;
      
      setWallet(session.walletAddress!, 1250.5, "base");
      setGitHub(session.githubHandle!);
      
      if (session.maintainerEnabled) {
        enableMaintainer(session.connectedProjects);
      }
      
      toast.success(`Signed in as ${persona.name}`);
      router.push("/contributor/overview");
    } catch (error) {
      toast.error("Failed to sign in");
    } finally {
      setLoading(false);
      setConnecting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        <motion.div variants={fadeInUp} className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Sign In to Gentask</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Connect your wallet and GitHub to get started
          </p>
        </motion.div>

        {/* Sign-in steps */}
        <motion.div variants={fadeInUp} className="mx-auto max-w-md space-y-4">
          <Card className={step === "wallet" ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step !== "wallet" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {step !== "wallet" ? "✓" : "1"}
                </div>
                <CardTitle>Connect Wallet</CardTitle>
              </div>
            </CardHeader>
            {step === "wallet" && (
              <CardContent>
                <Button
                  onClick={handleConnectWallet}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wallet className="mr-2 h-4 w-4" />
                  )}
                  Connect Wallet
                </Button>
              </CardContent>
            )}
          </Card>

          <Card className={step === "github" ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step === "done" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {step === "done" ? "✓" : "2"}
                </div>
                <CardTitle>Connect GitHub</CardTitle>
              </div>
            </CardHeader>
            {step === "github" && (
              <CardContent>
                <Button
                  onClick={handleConnectGitHub}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Github className="mr-2 h-4 w-4" />
                  )}
                  Connect GitHub
                </Button>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Demo Personas */}
        <motion.div variants={fadeInUp}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Or try a demo persona</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              One-click sign-in with pre-populated data
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEMO_PERSONAS.map((persona) => (
              <Card
                key={persona.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
                onClick={() => !loading && handlePersonaClick(persona.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={persona.avatar}
                      alt={persona.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <CardTitle className="text-lg">{persona.name}</CardTitle>
                      <CardDescription className="text-xs">{persona.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{persona.description}</p>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Sign in as " + persona.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
