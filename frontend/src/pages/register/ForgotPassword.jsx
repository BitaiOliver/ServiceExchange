import React, { useState } from "react";
import { Link } from "react-router-dom";
//import { base44 } from "@/api/base44Client";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import AuthLayout from "../../components/AuthLayout";
import axios from 'axios';


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/forgot-password', {
        email: email
      });

      //console.log('Password reset request sent for email:', email); // Log the email for debugging
    } catch (err) {
      console.error('Error occurred while sending password reset request:', err);
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout
      icon={Mail}
      title="Resetează parola"
      subtitle="Îți vom trimite un link pentru resetare"
      footer={
        <Link to="/login" className="text-primary font-medium hover:underline">
          <ArrowLeft className="w-3 h-3 inline mr-1" />Înapoi la conectare
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-foreground text-center">
          Dacă există un cont cu acest email, vei primi în curând un link de resetare a parolei.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adresă de email</Label>
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
          <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Se trimite...
              </>
            ) : (
              "Trimite linkul de resetare"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}