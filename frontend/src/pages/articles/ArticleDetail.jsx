import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
//import { base44 } from "@/api/base44Client";
import { useAuth } from "../../lib/AuthContext";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import Comments from "../../components/Comments";
import {
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  EyeOff,
  ArrowLeft,
  Edit,
  Trash2,
  HardHat,
  Loader2,
} from "lucide-react";
import moment from "moment";

export default function ArticleDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = user?.role === "admin";
  const isOwner = article && user && article.created_by_id === user.id;
  const canEdit = isOwner || isAdmin;
  const canDelete = isOwner || isAdmin;

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    setLoading(true);
    /*const data = await base44.entities.Article.filter({ id }); obi12: replace with get api when available*/
    const data = [];
    setArticle(data.length > 0 ? data[0] : null);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest articol?")) return;
    setDeleting(true);
    /*await base44.entities.Article.delete(article.id); obi12: replace with delete api when available*/
    navigate("/");
  };

  const handleStatusChange = async (newStatus) => {
    /*await base44.entities.Article.update(article.id, { status: newStatus }); obi12: replace with patch api when available*/
    loadArticle();
  };

  const statusColors = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    ongoing: "bg-amber-100 text-amber-700 border-amber-200",
    done: "bg-slate-100 text-slate-500 border-slate-200",
  };

  const statusLabels = {
    active: "Activ",
    ongoing: "În derulare",
    done: "Finalizat",
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <HardHat className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Articol negăsit</h2>
        <p className="text-muted-foreground mb-6">Acest articol nu există sau a fost șters.</p>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Înapoi la articole
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Înapoi la articole
      </Link>

      <Card className="overflow-hidden border-border">
        {article.picture && (
          <div className="aspect-[21/9] overflow-hidden bg-secondary">
            <img
              src={article.picture}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {article.title}
            </h1>
            <div className="flex items-center gap-2">
              {canEdit && (
                <select
                  value={article.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`text-xs font-medium px-2.5 py-1.5 rounded-full border cursor-pointer ${statusColors[article.status]}`}
                >
                  <option value="active">Activ</option>
                  <option value="ongoing">În derulare</option>
                  <option value="done">Finalizat</option>
                </select>
              )}
              {!canEdit && (
                <Badge className={`text-xs font-medium ${statusColors[article.status]}`}>
                  {statusLabels[article.status]}
                </Badge>
              )}
            </div>
          </div>

          {article.price != null && article.price > 0 && (
            <p className="text-2xl font-bold text-primary mb-4">
              {article.price.toLocaleString("ro-RO")} RON
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Publicat: {moment(article.created_date).format("DD.MM.YYYY")}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Expiră: {moment(article.expiration_date).format("DD.MM.YYYY")}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {article.author_name || "Anonim"}
            </span>
          </div>

          <div className="prose prose-sm max-w-none mb-8">
            <h3 className="text-lg font-semibold mb-2">Descriere</h3>
            <p className="text-foreground/80 whitespace-pre-wrap">{article.description}</p>
          </div>

          <div className="rounded-xl bg-secondary/30 border border-border p-5">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Persoană de contact
            </h3>

            {isAuthenticated ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{article.contact_name} {article.contact_surname}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${article.contact_phone}`} className="text-primary hover:underline">
                    {article.contact_phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm sm:col-span-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${article.contact_email}`} className="text-primary hover:underline">
                    {article.contact_email}
                  </a>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 blur-sm select-none opacity-40">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span>Prenume Nume</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>07xx xxx xxx</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:col-span-2">
                    <Mail className="w-4 h-4" />
                    <span>email@exemplu.ro</span>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-4">
                    <EyeOff className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground mb-2">
                      Autentifică-te pentru a vedea datele de contact
                    </p>
                    <Link to="/login">
                      <Button size="sm">Conectare</Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {canEdit && (
            <div className="flex items-center gap-2 mt-6 pt-6 border-t border-border">
              <Link to={`/editeaza-articol/${article.id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1.5" /> Editează
                </Button>
              </Link>
              {canDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-1.5" />
                  )}
                  Șterge
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <Comments articleId={article.id} />
      </div>
    </div>
  );
}