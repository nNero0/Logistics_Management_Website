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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username,
          Email,
          PasswordHash,
          Sdt
        }),
      });


      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      navigate('/auth/login');

    } catch (err) {

      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="e.g., User1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="e.g., user@gmail.com"
          />
        </div>
         <div className="form-group">
          <label htmlFor="sdt">Phone Number</label>
          <input
            type="tel"
            id="sdt"
            value={Sdt}
            onChange={(e) => setSdt(e.target.value)}
            required
            placeholder="e.g., 123456789"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={PasswordHash}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Min. 6 characters"
          />
        </div>
        <button type="submit" className="register-button">Create Account</button>
        

        {error && <p className="error-message">{error}</p>}
      </form>
      <p>
        Already have an account? <Link to="/auth/login">Login here</Link>
      </p>
    </div>
  );
}

export default RegisterPage;