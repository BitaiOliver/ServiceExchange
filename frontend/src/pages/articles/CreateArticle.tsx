import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../auth/AuthProvider';

const initialAddress = {
  country: '',
  state: '',
  city: '',
  street: '',
  number: '',
};

const initialContact = {
  name: '',
  telephone: '',
  email: '',
};

export function CreateArticle() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState(initialAddress);
  const [contact, setContact] = useState(initialContact);
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      setErrorMessage('You must be logged in to create an article.');
      return;
    }

    const payload = {
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
      const response = await axios.post('http://localhost:8080/api/articles', payload);
      navigate(`/article/${response.data.article.id}`);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.error || 'Could not create article.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-article-page">
      <h2>Create Article</h2>
      <form onSubmit={handleSave} className="article-form">
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
        <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Create Article'}</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
    </div>
  );
}
