import React from 'react';
import './loginPage.css';
import LoginWindow from '../components/Login/LoginWindow.jsx';
import WelcomeMessage from '../components/Login/WelcomeMessage.jsx';

function LoginPage() {
  return (
    <div className="login-welcome-container">
      <div>
        <LoginWindow />
      </div>
      {/*     <div>
        <WelcomeMessage />
      </div> */}
    </div>
  );
}

export default LoginPage;
