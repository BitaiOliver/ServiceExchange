import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../auth/AuthProvider';

type Article = {
  id: number;
  authorId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: {
    country: string;
    state: string;
    city: string;
    street: string;
    number: string;
  };
  contact: {
    name: string;
    telephone: string;
    email: string;
  };
};

export function ArticlePage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    async function fetchArticle() {
      if (!id) return;
      try {
        const response = await axios.get(`http://localhost:8080/api/articles/${id}`);
        setArticle(response.data.article);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Unable to load article');
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="article-page">Loading article…</div>;
  }

  if (error) {
    return <div className="article-page">{error}</div>;
  }

  if (!article) {
    return <div className="article-page">Article not found.</div>;
  }

  const isAuthor = user?.id === article.authorId;

  return (
    <div className="article-page">
      <h2>{article.title}</h2>
      <p><strong>Category:</strong> {article.category}</p>
      <p><strong>Price:</strong> ${article.price.toFixed(2)}</p>
      <p><strong>Description:</strong> {article.description}</p>
      <div className="article-address">
        <h3>Address</h3>
        <p>{article.address.street} {article.address.number}</p>
        <p>{article.address.city}, {article.address.state}</p>
        <p>{article.address.country}</p>
      </div>
      <div className="article-contact">
        <h3>Contact Person</h3>
        <p><strong>Name:</strong> {article.contact.name}</p>
        <p><strong>Telephone:</strong> {article.contact.telephone}</p>
        <p><strong>Email:</strong> {article.contact.email}</p>
      </div>
      {isAuthor && (
        <Link to={`/article/${article.id}/edit`} className="article-edit-link">
          Edit article
        </Link>
      )}
    </div>
  );
}
