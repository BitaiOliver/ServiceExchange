import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, User, EyeOff, MapPin } from "lucide-react";
import moment from "moment";

export default function ArticleCard({ article }) {
  const { isAuthenticated } = useAuth();

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
    <Link to={`/articol/${article.id}`}>
      <Card className="group h-full overflow-hidden border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer">
        {article.picture_url ? (
          <div className="aspect-[16/10] overflow-hidden bg-secondary">
            <img
              src={import.meta.env.VITE_BACKEND_URL + article.picture_url}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 via-primary/5 to-secondary flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <HardHatIcon className="w-8 h-8 text-primary/40" />
            </div>
          </div>
        )}

        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            <Badge className={`shrink-0 text-xs font-medium ${statusColors[article.status] || statusColors.active}`}>
              {statusLabels[article.status] || statusLabels.active}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {article.description}
          </p>

          {article.price != null && article.price > 0 && (
            <p className="text-lg font-bold text-primary mb-3">
              {article.price.toLocaleString("ro-RO")} RON
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {moment(article.created_date).format("DD.MM.YYYY")}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {article.author_name || "Anonim"}
            </span>
          </div>

          {!isAuthenticated && (
            <div className="mt-3 p-2.5 rounded-lg bg-secondary/60 border border-border flex items-center gap-2 text-xs text-muted-foreground">
              <EyeOff className="w-3.5 h-3.5 shrink-0" />
              <span>Autentifică-te pentru a vedea datele de contact</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function HardHatIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z" />
      <path d="M10 15V8a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v7" />
      <path d="M6 15V9a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v6" />
    </svg>
  );
}