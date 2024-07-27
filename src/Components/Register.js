import React from 'react';
import './Styles/Register.css';
import Header from './Layout/Header';

function Register() {
  return (
    <div>
      
    <div className="register-body">
      <div className="register-container">
        <div className="register-form">
          <h2>Register</h2>
          <form className="register">
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Register</button>
          </form>
          <div className="signin-link">
            <span>Already have an account?</span>
            <a href="/login">Login</a>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Register;
