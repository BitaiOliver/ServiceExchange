import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../auth/AuthProvider';

type Article = {
  id: number;
  authorId: number;
  title: string;
  category: string;
  price: number;
};

export function MyArticles() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchArticles() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/articles', {
          params: { authorId: user.id },
        });
        setArticles(response.data.articles || []);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Unable to load your articles');
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [user]);

  if (!user) {
    return <div className="my-articles-page">Please log in to view your articles.</div>;
  }

  if (loading) {
    return <div className="my-articles-page">Loading your articles…</div>;
  }

  if (error) {
    return <div className="my-articles-page">{error}</div>;
  }

  return (
    <div className="my-articles-page">
      <h2>My Articles</h2>
      {articles.length === 0 ? (
        <p>You haven’t created any articles yet.</p>
      ) : (
        <ul className="article-list">
          {articles.map((article) => (
            <li key={article.id} className="article-list-item">
              <Link to={`/article/${article.id}`}>{article.title}</Link>
              <div>
                <span>{article.category}</span>
                <span> - ${article.price.toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
