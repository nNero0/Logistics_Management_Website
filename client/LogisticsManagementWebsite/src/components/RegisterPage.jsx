import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [Username, setUsername] = useState('');
  const [Email, setEmail] = useState('');
  const [PasswordHash, setPassword] = useState(''); 
  const [Sdt, setSdt] = useState(''); 
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (PasswordHash.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username, Email, PasswordHash, Sdt }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Registration failed.');

      navigate('/auth/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 vw-100">
      <div className="card p-4 shadow" style={{ minWidth: '350px', maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="e.g., User1"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g., user@gmail.com"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="sdt" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="sdt"
              className="form-control"
              value={Sdt}
              onChange={(e) => setSdt(e.target.value)}
              required
              placeholder="e.g., 123456789"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={PasswordHash}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min. 6 characters"
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">Create Account</button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/auth/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
