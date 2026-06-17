import React, { useState, useEffect } from "react";
//import { base44 } from "@/api/base44Client";
import { useAuth } from "../lib/AuthContext";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { MessageCircle, Trash2, Loader2, Send } from "lucide-react";
import moment from "moment";

export default function Comments({ articleId }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadComments();
  }, [articleId]);

  const loadComments = async () => {
    setLoading(true);
    /*const data = await base44.entities.Comment.filter({ article_id: articleId }, "-created_date"); obi12: replace later with api call*/
     const data = [
      {
        id: 1,
        article_id: articleId,
        author_name: "Ion Popescu",
        text: "Acesta este un comentariu de test.",
        created_date: "2024-06-01T12:34:56Z",
        created_by_id: 2,
      },
      {
        id: 2,
        article_id: articleId,
        author_name: "Maria Ionescu",
        text: "Alt comentariu pentru testare.",
        created_date: "2024-06-02T08:20:00Z",
        created_by_id: 3,
      },
    ]; /* obi12: const from above is just dummy data */
    setComments(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    /*await base44.entities.Comment.create({
      article_id: articleId,
      author_name: user?.name && user?.surname ? `${user.name} ${user.surname}` : (user?.full_name || "Utilizator"),
      text: text.trim(),
    }); obi12: replace later with api call*/
    setText("");
    setSubmitting(false);
    loadComments();
  };

  const handleDelete = async (commentId) => {
    /*await base44.entities.Comment.delete(commentId); obi12: replace later with api call*/
    loadComments();
  };

  const canDelete = (comment) => {
    if (isAdmin) return true;
    return comment.created_by_id === user?.id;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Comentarii ({comments.length})
        </h3>
      </div>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Scrie un comentariu..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={!text.trim() || submitting}>
              {submitting ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-1.5" />
              )}
              Trimite
            </Button>
          </div>
        </form>
      )}

      {!isAuthenticated && (
        <p className="text-sm text-muted-foreground p-4 rounded-lg bg-secondary/50 border border-border text-center">
          Autentifică-te pentru a lăsa un comentariu.
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Niciun comentariu încă. Fii primul care comentează!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 rounded-xl bg-secondary/30 border border-border">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">
                      {comment.author_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {moment(comment.created_date).format("DD.MM.YYYY HH:mm")}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80">{comment.text}</p>
                </div>
                {canDelete(comment) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}