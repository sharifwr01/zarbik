import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

export default function AdminSetup() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [setupNotNeeded, setSetupNotNeeded] = useState(false);

  // Check if setup is needed
  const { data: setupStatus } = trpc.admin.checkSetup.useQuery();

  useEffect(() => {
    if (setupStatus && !setupStatus.setupRequired) {
      setSetupNotNeeded(true);
    }
  }, [setupStatus]);

  const setupMutation = trpc.admin.setup.useMutation({
    onSuccess: () => {
      toast.success("Admin account created successfully");
      setLocation("/admin/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Setup failed");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await setupMutation.mutateAsync({ username, email, password });
    } finally {
      setIsLoading(false);
    }
  };

  if (setupNotNeeded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <Card className="w-full max-w-md p-8 bg-slate-800 border-slate-700 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
              <p className="text-blue-300">Admin account already exists</p>
            </div>
            <Button
              onClick={() => setLocation("/admin/login")}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Go to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md p-8 bg-slate-800 border-slate-700 shadow-2xl">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Zarbik Admin Setup</h1>
            <p className="text-slate-400">Create your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                disabled={isLoading}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isLoading}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                disabled={isLoading}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={isLoading}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Create Admin Account"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500">
            This creates a single admin account for managing your projects
          </p>
        </div>
      </Card>
    </div>
  );
}
