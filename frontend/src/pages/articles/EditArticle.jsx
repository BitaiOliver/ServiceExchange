import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
//import { base44 } from "@/api/base44Client";
import { useAuth } from "../../lib/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ArrowLeft, Save, Loader2, Upload, X, HardHat } from "lucide-react";
import axios from 'axios';


export default function EditArticle() {
  const { id } = useParams();
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
    status: "active",
  });
  const [articleID, setArticleID] = useState(null);
  const [picture, setPicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const [existingPicture, setExistingPicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    setLoading(true);
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + `/api/article/${id}`);
    console.log('din edit articol', response.data.article);
    const article = response.data.article;
    if (!article) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    else{
      setArticleID(article.id);
    }
    if (article.author_id !== user?.id && !isAdmin) {
      navigate("/articolele-mele");
      return;
    }

    setForm({
      title: article.title || "",
      description: article.description || "",
      price: article.price ? String(article.price) : "",
      contact_name: article.contact_name || "",
      contact_surname: article.contact_surname || "",
      contact_phone: article.contact_phone || "",
      contact_email: article.contact_email || "",
      status: article.status || "active",
    });
    setExistingPicture(import.meta.env.VITE_BACKEND_URL + article.picture_url || null);
    setLoading(false);
  };

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

  const removePicture = () => {
    setPicture(null);
    setPicturePreview(null);
    setExistingPicture(null);
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

    setSaving(true);

    try {
      let picUrl = existingPicture.replace(import.meta.env.VITE_BACKEND_URL, "");
      if (picture) {
        const formData = new FormData();
        formData.append('picture', picture);
        const picresponse = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/articlePicture', formData);
        picUrl = picresponse.data.imageUrl;
      } else if (picture === null && existingPicture === null) {
        pictureUrl = null;
      }

      const response = await axios.put(import.meta.env.VITE_BACKEND_URL + '/api/article', {
        articleID,
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.price ? parseFloat(form.price) : null,
        picture_url: picUrl,
        author_id: user?.id,
        contact_name: form.contact_name.trim(),
        contact_surname: form.contact_surname.trim(),
        contact_phone: form.contact_phone.trim(),
        contact_email: form.contact_email.trim(),
        status: form.status.trim(),
      });
      //console.log('Din edit article...response', response);


      navigate(`/articol/${id}`);
    } catch (err) {
      setError(err.message || "A apărut o eroare la salvarea articolului.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <HardHat className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Articol negăsit</h2>
        <Link to="/articolele-mele">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Înapoi</Button>
        </Link>
      </div>
    );
  }

  const displayPicture = picturePreview || existingPicture;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to={`/articol/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Înapoi la articol
      </Link>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl">Editează articolul</CardTitle>
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
              <Input id="title" name="title" value={form.title} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descriere *</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
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
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="active">Activ</option>
                <option value="ongoing">În derulare</option>
                <option value="done">Finalizat</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Imagine — opțional</Label>
              {displayPicture ? (
                <div className="relative inline-block">
                  <img
                    src={displayPicture}
                    alt="Previzualizare"
                    className="max-h-48 rounded-lg border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePicture}
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
                  <Input id="contact_name" name="contact_name" value={form.contact_name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_surname">Prenume *</Label>
                  <Input id="contact_surname" name="contact_surname" value={form.contact_surname} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Telefon *</Label>
                  <Input id="contact_phone" name="contact_phone" value={form.contact_phone} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email *</Label>
                  <Input id="contact_email" name="contact_email" type="email" value={form.contact_email} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1.5" />
                )}
                Salvează modificările
              </Button>
              <Link to={`/articol/${id}`}>
                <Button type="button" variant="outline">Anulează</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}