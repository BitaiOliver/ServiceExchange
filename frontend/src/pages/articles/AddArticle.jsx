import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { base44 } from "@/api/base44Client";
import { useAuth } from "../../lib/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ArrowLeft, PlusCircle, Loader2, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
import axios from 'axios';


export default function AddArticle() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    contact_name: "",
    contact_surname: "",
    contact_phone: "",
    contact_email: "",
  });
  const [picture, setPicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
      setPicturePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Titlul și descrierea sunt obligatorii.");
      return;
    }
    if (!form.contact_name.trim() || !form.contact_surname.trim() || !form.contact_phone.trim() || !form.contact_email.trim()) {
      setError("Toate datele persoanei de contact sunt obligatorii.");
      return;
    }

    setLoading(true);

    try {
      /*let pictureUrl = null;
      if (picture) {
        const uploadResult = await base44.integrations.Core.UploadFile({ file: picture });
        pictureUrl = uploadResult.file_url;
      }

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      await base44.entities.Article.create({
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.price ? parseFloat(form.price) : null,
        picture: pictureUrl,
        author_name: user?.name && user?.surname ? `${user.name} ${user.surname}` : (user?.full_name || ""),
        contact_name: form.contact_name.trim(),
        contact_surname: form.contact_surname.trim(),
        contact_phone: form.contact_phone.trim(),
        contact_email: form.contact_email.trim(),
        expiration_date: expirationDate.toISOString().split("T")[0],
        status: "active",
      }); obi12: replace with post api when available */
      const formData = new FormData();
      formData.append('picture', picture);
      const picresponse = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/articlePicture', formData);
      const picUrl = picresponse.data.imageUrl;
      //console.log("Picture uploaded, URL:", picUrl);

      await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/article', {
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.price ? parseFloat(form.price) : null,
        picture_url: picUrl,
        contact_name: form.contact_name.trim(),
        contact_surname: form.contact_surname.trim(),
        contact_phone: form.contact_phone.trim(),
        contact_email: form.contact_email.trim(),
        status: "active",
      });

      /*const response = await axios.post('http://localhost:8080/api/article', {
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.price ? parseFloat(form.price) : null,
        picture: null, // picture upload not implemented yet
        author_id: user?.id,
        contact_name: form.contact_name.trim(),
        contact_surname: form.contact_surname.trim(),
        contact_phone: form.contact_phone.trim(),
        contact_email: form.contact_email.trim(),
        status: "active",
      });*/


      navigate("/articolele-mele"); 
    } catch (err) {
      setError(err.message || "A apărut o eroare la publicarea articolului.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/articolele-mele"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Înapoi la articolele mele
      </Link>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <PlusCircle className="w-5 h-5 text-primary" /> Adaugă articol nou
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Titlu *</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ex: Renovare apartament 3 camere"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descriere *</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descrie serviciul sau proiectul în detaliu..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preț (RON) — opțional</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="Ex: 5000"
              />
            </div>

            <div className="space-y-2">
              <Label>Imagine — opțional</Label>
              {picturePreview ? (
                <div className="relative inline-block">
                  <img
                    src={picturePreview}
                    alt="Previzualizare"
                    className="max-h-48 rounded-lg border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => { setPicture(null); setPicturePreview(null); }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-secondary/20">
                  <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-sm text-muted-foreground">Încarcă o imagine</span>
                  <input type="file" accept="image/*" onChange={handlePictureChange} className="hidden" />
                </label>
              )}
            </div>

            <div className="border-t border-border pt-5">
              <h3 className="text-base font-semibold mb-4">Persoană de contact</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_name">Nume *</Label>
                  <Input
                    id="contact_name"
                    name="contact_name"
                    value={form.contact_name}
                    onChange={handleChange}
                    placeholder="Nume"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_surname">Prenume *</Label>
                  <Input
                    id="contact_surname"
                    name="contact_surname"
                    value={form.contact_surname}
                    onChange={handleChange}
                    placeholder="Prenume"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Telefon *</Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    value={form.contact_phone}
                    onChange={handleChange}
                    placeholder="07xx xxx xxx"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email *</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={form.contact_email}
                    onChange={handleChange}
                    placeholder="email@exemplu.ro"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                )}
                Publică articolul
              </Button>
              <Link to="/articolele-mele">
                <Button type="button" variant="outline">
                  Anulează
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}