import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import { base44 } from "@/api/base44Client";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "../../components/AuthLayout";
import GoogleIcon from "../../components/GoogleIcon";
import { useAuth } from '../../lib/AuthContext';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/login', {
        email,
        password,
      });

      if (response.data?.success===true) {
        login(
          {
            id: response.data.userId,
            email: response.data.email,
            ...response.data.user,
          },
          response.data.token
        );
        setEmail('');
        setPassword('');
        navigate('/profilul-meu');
      } else {
        setError('Autentificare eșuată. Te rugăm să încerci din nou.');
      }
    } catch (err) {
      const message = err?.response?.data?.error || 'Autentificare eșuată. Te rugăm să încerci din nou.';
      setError(message);
    }
  };


  // obi12: old code for handleSubmit, replace with actual login api call when available
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);
  //   try {
  //     /*await base44.auth.loginViaEmailPassword(email, password); obi12: replace with login api when available*/
  //     window.location.href = "/";
  //   } catch (err) {
  //     setError(err.message || "Email sau parolă incorecte");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleGoogle = () => {
    /*base44.auth.loginWithProvider("google", "/"); obi12: replace with login with provider api when available*/
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Bine ai revenit"
      subtitle="Conectează-te la contul tău"
      footer={
        <>
          Nu ai cont?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Creează unul
          </Link>
        </>
      }
    >
      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-6"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continuă cu Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">sau</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Ai uitat parola?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Se conectează...
            </>
          ) : (
            "Conectare"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}