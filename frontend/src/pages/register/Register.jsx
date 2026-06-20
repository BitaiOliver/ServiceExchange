import React, { useState } from "react";
import { Link } from "react-router-dom";
//import { base44 } from "@/api/base44Client";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../components/ui/input-otp";
import AuthLayout from "../../components/AuthLayout";
import GoogleIcon from "../../components/GoogleIcon";
import { toast } from "../../components/ui/use-toast";
import axios from 'axios';


export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [profile, setProfile] = useState({
    name: "", surname: "", phone: "", country: "", state: "", city: "", street: "", number: "", postal_code: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Parolele nu coincid");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/register', {
        name: profile.name,
        surname: profile.surname,
        phone: profile.phone,
        country: profile.country,
        state: profile.state,
        city: profile.city,
        street: profile.street,
        number: profile.number,
        postalCode: profile.postal_code,
        phone: profile.phone,
        email: email,
        password: password,
      });

      if (response.data?.success) {
        //console.log('Registration successful! You can now log in.');
        setProfile({
          name: "", surname: "", phone: "", country: "", state: "", city: "", street: "", number: "", postal_code: ""
        });
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError('Registration failed. Please try again.');
      }
      setShowOtp(false); //obi12: set to true if your register api sends otp and you want to show otp input after registration
      window.location.href = "/login"; // /obi12: redirect to login page after successful registration
    } catch (err) {
      setError(err.message || "Înregistrarea a eșuat");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      /*const result = await base44.auth.verifyOtp({ email, otpCode }); obi12: replace with verify otp api when available*/
      // if (result?.access_token) {
      //   /*base44.auth.setToken(result.access_token); obi12: replace with set token method if needed*/
      //   const hasProfile = Object.values(profile).some(v => v);
      //   if (hasProfile) {
      //     /*await base44.auth.updateMe(profile); obi12: replace with update me api when available*/
      //   }
      //}
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Cod de verificare invalid");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      /*await base44.auth.resendOtp(email); obi12: replace with resend otp api when available*/
      toast({
        title: "Cod trimis",
        description: "Verifică-ți emailul pentru noul cod.",
      });
    } catch (err) {
      setError(err.message || "Nu s-a putut retrimite codul");
    }
  };

  const handleGoogle = () => {
    /*base44.auth.loginWithProvider("google", "/"); obi12: replace with login with provider api when available*/
  };

  if (showOtp) {
    return (
      <AuthLayout
        icon={Mail}
        title="Verifică-ți emailul"
        subtitle={`Ți-am trimis un cod la ${email}`}
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
        <div className="flex justify-center mb-6">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={setOtpCode}
            autoFocus
            autoComplete="one-time-code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          className="w-full h-12 font-medium"
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Se verifică...
            </>
          ) : (
            "Verifică"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Nu ai primit codul?{" "}
          <button onClick={handleResend} className="text-primary font-medium hover:underline">
            Retrimite
          </button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title="Creează contul tău"
      subtitle="Înregistrează-te pentru a începe"
      footer={
        <>
          Ai deja cont?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Conectează-te
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
          <Label htmlFor="password">Parolă</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <div className="border-t border-border pt-4 mt-2">
          <p className="text-xs font-medium text-muted-foreground mb-3">
            Informații profil
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="reg-name" className="text-xs">Nume</Label>
              <Input id="reg-name" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="h-10 text-sm" placeholder="Nume" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-surname" className="text-xs">Prenume</Label>
              <Input id="reg-surname" value={profile.surname} onChange={(e) => setProfile({...profile, surname: e.target.value})} className="h-10 text-sm" placeholder="Prenume" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="reg-phone" className="text-xs">Telefon</Label>
              <Input id="reg-phone" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="h-10 text-sm" placeholder="07xx xxx xxx" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-country" className="text-xs">Țară</Label>
              <Input id="reg-country" value={profile.country} onChange={(e) => setProfile({...profile, country: e.target.value})} className="h-10 text-sm" placeholder="România" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-state" className="text-xs">Județ</Label>
              <Input id="reg-state" value={profile.state} onChange={(e) => setProfile({...profile, state: e.target.value})} className="h-10 text-sm" placeholder="Județ" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-city" className="text-xs">Oraș</Label>
              <Input id="reg-city" value={profile.city} onChange={(e) => setProfile({...profile, city: e.target.value})} className="h-10 text-sm" placeholder="Oraș" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-street" className="text-xs">Stradă</Label>
              <Input id="reg-street" value={profile.street} onChange={(e) => setProfile({...profile, street: e.target.value})} className="h-10 text-sm" placeholder="Stradă" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-number" className="text-xs">Număr</Label>
              <Input id="reg-number" value={profile.number} onChange={(e) => setProfile({...profile, number: e.target.value})} className="h-10 text-sm" placeholder="Nr." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-postal" className="text-xs">Cod poștal</Label>
              <Input id="reg-postal" value={profile.postal_code} onChange={(e) => setProfile({...profile, postal_code: e.target.value})} className="h-10 text-sm" placeholder="Cod poștal" />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Se creează contul...
            </>
          ) : (
            "Creează cont"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}