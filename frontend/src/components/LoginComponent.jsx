import React from 'react';
import InputComponent from './InputComponent';

function LoginComponent() {
  return (
    <div>
      LoginComponent
      <InputComponent type="text" required={true} placeholder="Name" />
      <InputComponent type="email" required={true} placeholder="Email" />
      <InputComponent type="password" required={true} placeholder="Password" />
      <InputComponent
        type="password"
        required={true}
        placeholder="Verify Password"
      />
      <InputComponent type="tel" required={true} placeholder="Mobile" />
    </div>
  );
}

export default LoginComponent;
