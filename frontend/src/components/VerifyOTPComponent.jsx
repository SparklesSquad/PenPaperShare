import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import axios from 'axios';

function VerifyOTPComponent() {
  const [otp, setOTP] = useState(null);
  const [otpError, setOTPError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const registerController = async () => {
    try {
      console.log('Hehe');
      if (!otp) setOTPError('OTP is requried');
      if (otp.length < 6) setOTPError('Enter valid OTP');

      const response = await axios.post('http://localhost:5500/auth/register', {
        otp: otp,
        username: location.state.username,
        email: location.state.email,
        mobile: location.state.mobile,
        password: location.state.password,
      });
      console.log(response);
      if (response.data.success) {
        navigate('/auth/login');
      } else {
        console.log('In Verify otp component sucess is false');
        setOTPError(response.data.message);
      }
    } catch (error) {
      console.log(error.response.data.message);
      setOTPError(error.response.data.message);
    }
  };

  return (
    <div>
      <input type="number" onChange={(e) => setOTP(e.target.value)} />
      {otpError && <span>{otpError}</span>}
      <Button onClick={registerController} name="Register"></Button>
    </div>
  );
}

export default VerifyOTPComponent;
