import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
//import { base44 } from "@/api/base44Client";
import { useAuth } from "../../lib/AuthContext";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import {
  PlusCircle,
  FileText,
  Edit,
  Trash2,
  Loader2,
  HardHat,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import moment from "moment";
import axios from 'axios';


export default function MyArticles() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleting, setDeleting] = useState(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadArticles();
  }, [user]);

  const loadArticles = async () => {
    setLoading(true);
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/articles');
    if (isAdmin) {
      setArticles(response.data.articles);
    } else if (user) {
      setArticles(response.data.articles.filter((a) => a.author_id === user.id));
    } else {
      setArticles([]);
    }
    setLoading(false);
  };

  const handleDelete = async (article) => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest articol?")) return;
    setDeleting(article.id);
    const response = await axios.delete(import.meta.env.VITE_BACKEND_URL + `/api/article/${article.id}`);
    setDeleting(null);
    loadArticles();
  };

  const handleStatusChange = async (articleId, newStatus) => {
    const response = await axios.put(import.meta.env.VITE_BACKEND_URL + '/api/articleStatus' ,{
      article_id: articleId,
      status: newStatus
    });
    loadArticles();
  };

  const filtered = articles.filter((a) => {
    if (statusFilter === "all") return true;
    return a.status === statusFilter;
  });

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            {isAdmin ? "Toate articolele" : "Articolele mele"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin
              ? `Administrare articole — ${filtered.length} articole`
              : `Gestionează articolele tale — ${filtered.length} articole`}
          </p>
        </div>
        <Link to="/adauga-articol">
          <Button>
            <PlusCircle className="w-4 h-4 mr-1.5" /> Adaugă articol
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="ongoing">În derulare</SelectItem>
            <SelectItem value="done">Finalizate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <HardHat className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {statusFilter !== "all" ? "Niciun articol cu acest status" : "Niciun articol"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {statusFilter !== "all"
              ? "Nu există articole care să corespundă filtrului selectat."
              : "Nu ai publicat încă niciun articol."}
          </p>
          <Link to="/adauga-articol">
            <Button>
              <PlusCircle className="w-4 h-4 mr-1.5" /> Adaugă primul articol
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((article) => (
            <Card key={article.id} className="border-border hover:border-primary/20 transition-colors">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  {article.picture_url && (
                    <div className="shrink-0 w-full sm:w-32 h-24 rounded-lg overflow-hidden bg-secondary">
                      <img
                        src={import.meta.env.VITE_BACKEND_URL + article.picture_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <Link
                        to={`/articol/${article.id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {article.title}
                      </Link>
                      <select
                        value={article.status}
                        onChange={(e) => handleStatusChange(article.id, e.target.value)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer shrink-0 ${statusColors[article.status]}`}
                      >
                        <option value="active">Activ</option>
                        <option value="ongoing">În derulare</option>
                        <option value="done">Finalizat</option>
                      </select>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {article.description}
                    </p>
                    {article.price != null && article.price > 0 && (
                      <p className="text-sm font-semibold text-primary mb-2">
                        {article.price.toLocaleString("ro-RO")} RON
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{moment(article.created_date).format("DD.MM.YYYY")}</span>
                      {isAdmin && (
                        <span>— de {article.author_name || "Anonim"}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <Link to={`/editeaza-articol/${article.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-1.5" /> Editează
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => handleDelete(article)}
                      disabled={deleting === article.id}
                    >
                      {deleting === article.id ? (
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-1.5" />
                      )}
                      Șterge
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}