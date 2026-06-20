import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Lock, Loader2, AlertTriangle } from "lucide-react";
import AuthLayout from "../../components/AuthLayout";
import axios from 'axios';


export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");
  //console.log('Reset token from URL:', resetToken); // Log the reset token for debugging

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Parolele nu coincid");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/reset-password', {
        token: resetToken,
        newPassword: newPassword
      });
      window.location.href = "/login";
    } catch (error) {
      setError("Resetarea parolei a eșuat: " + error.response?.data?.error || "Resetarea parolei a eșuat");
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <AuthLayout
        icon={AlertTriangle}
        title="Link invalid"
        subtitle="Acest link de resetare lipsește sau este invalid"
        footer={
          <Link to="/forgot-password" className="text-primary font-medium hover:underline">
            Solicită un link nou
          </Link>
        }
      >
        <p className="text-sm text-foreground text-center">
          Linkul folosit pare a fi incomplet. Te rugăm să soliciți un nou email de resetare a parolei.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Lock}
      title="Parolă nouă"
      subtitle="Introdu noua parolă mai jos"
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Parolă nouă</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              autoFocus
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirmă parola</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Se resetează...
              </>
              ) : (
              "Resetează parola"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}