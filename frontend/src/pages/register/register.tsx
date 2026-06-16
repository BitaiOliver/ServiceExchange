import React, { useState } from 'react';
import axios from 'axios';
import './register.css';

function Register() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/register', {
        name,
        surname,
        country,
        state,
        city,
        street,
        number,
        postalCode,
        phone,
        email,
        password,
      });

      if (response.data?.success) {
        setSuccessMessage('Registration successful! You can now log in.');
        setName('');
        setSurname('');
        setCountry('');
        setState('');
        setCity('');
        setStreet('');
        setNumber('');
        setPostalCode('');
        setPhone('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      const message = error?.response?.data?.error || 'Registration failed. Please try again.';
      setErrorMessage(message);
    }
  };

  return (
    <div className="register-page">

      <h1>Crează un cont nou </h1>

      <form onSubmit={handleSubmit}>
        <div className="rform-section">
          <div className="rform-section-label"><i className="ti ti-user-circle" style={{ fontSize: '14px' }} aria-hidden="true"></i> Informații personale</div>
          <div className="rform-grid cols2">
            <div className="rform-field">
              <label htmlFor="name">First name</label>
              <input type="text" id="name" name="name" placeholder="Oliver" autocomplete="given-name" />
            </div>
            <div className="rform-field">
              <label htmlFor="surname">Last name</label>
              <input type="text" id="surname" name="surname" placeholder="Müller" autocomplete="family-name" />
            </div>
            <div className="rform-field">
              <label htmlFor="phone">Phone number</label>
              <input type="tel" id="phone" name="phone" placeholder="+49 40 123 456" autocomplete="tel" />
            </div>
            <div className="rform-field">
              <label htmlFor="email">Email address</label>
              <input type="email" id="email" name="email" placeholder="oliver@example.com" autocomplete="email" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="name">Nume:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="surname">Prenume:</label>
          <input
            type="text"
            id="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="country">Țara:</label>
          <input
            type="text"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="state">Județul:</label>
          <input
            type="text"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="city">Orașul:</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="street">Strada:</label>
          <input
            type="text"
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="number">Număr:</label>
          <input
            type="text"
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="postalCode">Cod Poștal:</label>
          <input
            type="text"
            id="postalCode"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="phone">Telefon:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

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
          <label htmlFor="password">Parolă:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirmare Parolă:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Înregistrează-te</button>
      </form>
      {errorMessage && <p style={{ color: 'red', marginTop: '12px' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green', marginTop: '12px' }}>{successMessage}</p>}
    </div>
  );
}

export default Register;
