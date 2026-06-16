import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../auth/AuthProvider';
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        email,
        password,
      });

      if (response.data?.success) {
        login({ id: response.data.userId, email: response.data.email });
        setSuccessMessage('Login successful! Redirecting...');
        setEmail('');
        setPassword('');
        navigate('/');
      } else {
        setErrorMessage('Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      const message = error?.response?.data?.error || 'Login failed. Please try again.';
      setErrorMessage(message);
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p style={{ color: 'red', marginTop: '12px' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green', marginTop: '12px' }}>{successMessage}</p>}
      <p style={{ marginTop: '12px' }}>
        Not registered? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;