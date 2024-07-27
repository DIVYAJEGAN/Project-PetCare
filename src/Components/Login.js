// src/Components/Login.js

import React from 'react';
import './Styles/Login.css';
import Header from './Layout/Header';

function Login() {
  return (

    <div className="login-page">
      
      <div className="login-container">
        <div className="login-form">
          <form className="login">
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button type="submit">Login</button>
          </form>
          <div className="signup-link">
            Don't have an account? <a href="/register">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
