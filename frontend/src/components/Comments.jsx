import React, { useState, useEffect } from "react";
import axios from "axios";
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
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/comments?article_id=${articleId}`
      );
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !user?.id) return;

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/comments`,
        {
          article_id: articleId,
          comment_text: text.trim(),
        }
      );

      setComments((prev) => [response.data.comment, ...prev]);
      setText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!user?.id && !isAdmin) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/comments/${commentId}`
      );
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const canDelete = (comment) => {
    if (isAdmin) return true;
    return Number(comment.author_id) === Number(user?.id);
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
                    {comment.created_date && (
                      <span className="text-xs text-muted-foreground">
                        {moment(comment.created_date).format("DD.MM.YYYY HH:mm")}
                      </span>
                    )}
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