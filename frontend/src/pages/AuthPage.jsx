import React from 'react';
import LoginComponent from '../components/LoginComponent';
import RegisterComponent from '../components/RegisterComponent';
import VerifyOTPComponent from '../components/VerifyOTPComponent';

const AuthPage = (props) => {
  const route = props.route;

  let component = <LoginComponent />;

  if (route === 'login') {
    component = <LoginComponent />;
  } else if (route === 'register') {
    component = <RegisterComponent />;
  } else if (route === 'verifyotp') {
    component = <VerifyOTPComponent />;
  }

  return (
    <div>
      <div className="left">
        <h1>PenPaperShare</h1>
        <h3>Where Documents Meet Community</h3>
      </div>
      <div className="right">{component}</div>
    </div>
  );
};

export default AuthPage;
