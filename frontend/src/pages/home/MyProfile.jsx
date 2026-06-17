import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { User, Save, Loader2, Mail, Shield, MapPin } from "lucide-react";
import axios from 'axios';


export default function MyProfile() {
  const { user, checkUserAuth } = useAuth();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    street: "",
    number: "",
    postal_code: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const me = await axios.get('http://localhost:8080/api/userInfo', {
        params: {
          userID: user?.id
        }
      }); 
      //console.log("Profile data:", me);

      setForm({
        name: me.data?.name || "",
        surname: me.data?.surname || "",
        phone: me.data?.phone || "",
        country: me.data?.country || "",
        state: me.data?.state || "",
        city: me.data?.city || "",
        street: me.data?.street || "",
        number: me.data?.number || "",
        postal_code: me.data?.postal_code || "",
      });
    } catch (err) {
      console.error("Failed to load profile data:", err);
      setError("Nu s-au putut încărca datele profilului.");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await axios.put('http://localhost:8080/api/updateUserInfo', {
        ...form,
        userID: user?.id
      });
      setSuccess("Profilul a fost salvat cu succes.");
      await checkUserAuth();
    } catch (err) {
      setError(err.message || "A apărut o eroare la salvarea profilului.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2 mb-2">
        <User className="w-6 h-6 text-primary" /> Profilul meu
      </h1>
      <p className="text-muted-foreground mb-8">
        Gestionează informațiile tale personale
      </p>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
      )}
      {success && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm border border-emerald-200">{success}</div>
      )}

      <Card className="border-border mb-6">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{user?.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Rol</p>
                <p className="text-sm font-medium text-foreground">
                  {isAdmin ? "Administrator" : "Utilizator"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Informații personale</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nume</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Nume" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Prenume</Label>
                <Input id="surname" name="surname" value={form.surname} onChange={handleChange} placeholder="Prenume" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="07xx xxx xxx" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Țară</Label>
                <Input id="country" name="country" value={form.country} onChange={handleChange} placeholder="România" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Județ</Label>
                <Input id="state" name="state" value={form.state} onChange={handleChange} placeholder="Județ" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Oraș</Label>
                <Input id="city" name="city" value={form.city} onChange={handleChange} placeholder="Oraș" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Stradă</Label>
                <Input id="street" name="street" value={form.street} onChange={handleChange} placeholder="Stradă" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Număr</Label>
                <Input id="number" name="number" value={form.number} onChange={handleChange} placeholder="Nr." />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="postal_code">Cod poștal</Label>
                <Input id="postal_code" name="postal_code" value={form.postal_code} onChange={handleChange} placeholder="Cod poștal" />
              </div>
            </div>

            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              {saving ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1.5" />
              )}
              Salvează profilul
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}