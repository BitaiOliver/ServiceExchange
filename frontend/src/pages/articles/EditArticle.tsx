import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../auth/AuthProvider';

type ArticlePayload = {
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
  authorId: number;
};

export function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState<ArticlePayload | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState({ country: '', state: '', city: '', street: '', number: '' });
  const [contact, setContact] = useState({ name: '', telephone: '', email: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchArticle() {
      if (!id) return;
      try {
        const response = await axios.get(`http://localhost:8080/api/articles/${id}`);
        const fetched = response.data.article;
        if (user && fetched.authorId !== user.id) {
          setErrorMessage('Only the author can edit this article.');
          return;
        }
        setArticle(fetched);
        setTitle(fetched.title);
        setDescription(fetched.description);
        setCategory(fetched.category);
        setPrice(String(fetched.price));
        setAddress(fetched.address);
        setContact(fetched.contact);
      } catch (err: any) {
        setErrorMessage(err?.response?.data?.error || 'Unable to load article');
      }
    }

    fetchArticle();
  }, [id, user]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user || !id) return;

    const payload: ArticlePayload = {
      title,
      description,
      category,
      price: Number(price),
      authorId: user.id,
      address,
      contact,
    };

    setSaving(true);
    try {
      await axios.put(`http://localhost:8080/api/articles/${id}`, payload);
      navigate(`/article/${id}`);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.error || 'Could not update article.');
    } finally {
      setSaving(false);
    }
  };

  if (errorMessage) {
    return <div className="edit-article-page">{errorMessage}</div>;
  }

  if (!article) {
    return <div className="edit-article-page">Loading article for edit…</div>;
  }

  return (
    <div className="edit-article-page">
      <h2>Edit Article</h2>
      <form onSubmit={handleUpdate} className="article-form">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label>
          Category
          <input value={category} onChange={(e) => setCategory(e.target.value)} required />
        </label>
        <label>
          Price
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" />
        </label>
        <fieldset>
          <legend>Address</legend>
          <label>
            Country
            <input value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} required />
          </label>
          <label>
            State
            <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
          </label>
          <label>
            City
            <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
          </label>
          <label>
            Street
            <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
          </label>
          <label>
            Number
            <input value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} required />
          </label>
        </fieldset>
        <fieldset>
          <legend>Contact Person</legend>
          <label>
            Name
            <input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} required />
          </label>
          <label>
            Telephone
            <input value={contact.telephone} onChange={(e) => setContact({ ...contact, telephone: e.target.value })} required />
          </label>
          <label>
            Email
            <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} required />
          </label>
        </fieldset>
        <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Update Article'}</button>
      </form>
    </div>
  );
}
