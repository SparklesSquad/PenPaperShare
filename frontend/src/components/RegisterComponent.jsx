import React from 'react';
import InputComponent from './InputComponent';
import Button from './Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterComponent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [verifyPasswordError, setVerifyPasswordError] = useState(null);
  const [mobileError, setMobileError] = useState(null);
  const [overallError, setOverallError] = useState(null);

  const validateEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  };

  const validateMobile = (mobile) => {
    const pattern = /^[6-9]\d{9}$/;
    return pattern.test(mobile);
  };

  const validate = (name, value) => {
    switch (name) {
      case 'name': {
        if (!value) setNameError('Name is Required !!');
        else setNameError(null);
        break;
      }

      case 'email': {
        if (!validateEmail(value)) setEmailError('Enter valid email !!');
        else setEmailError(null);
        break;
      }

      case 'password': {
        if (!value) setPasswordError('Password is Required');
        else if (value.length < 8)
          setPasswordError('Password must be atleast 8 characters !!');
        else setPasswordError(null);
        break;
      }

      case 'verifypassword': {
        if (!value) setVerifyPasswordError('Verify Password is Required');
        else if (value !== password)
          setVerifyPasswordError('Both Passwords Should match');
        else setVerifyPasswordError(null);
        break;
      }

      case 'mobile': {
        if (!value) setMobileError('Mobile Number is required !!');
        else if (!validateMobile(value))
          setMobileError('Enter valid Mobile Number !!');
        else setMobileError(null);
        break;
      }
      default: {
      }
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log('Coming');
      if (
        !name ||
        nameError ||
        !email ||
        emailError ||
        !password ||
        passwordError ||
        !verifyPassword ||
        verifyPasswordError ||
        !mobile ||
        mobileError
      ) {
        setOverallError('Form must be valid !!');
        return;
      } else {
        setOverallError(null);
      }

      // Backend request.
      const response = await axios.post('http://localhost:5500/auth/send-otp', {
        email: email,
        username: name,
      });
      console.log(response.data.success);
      if (response.data.success) {
        // Forward to next page

        navigate('/auth/verifyotp', {
          state: {
            username: name,
            email: email,
            password: password,
            mobile: mobile,
          },
        });
      }
    } catch (error) {
      setOverallError(error.response.data.message);
      console.log('error while sending otp in register component !!');
    }
  };

  return (
    <form>
      Register Component
      <InputComponent
        type="text"
        required={true}
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        onBlur={(e) => validate('name', e.target.value)}
      />
      {nameError && <span>{nameError}</span>}
      <InputComponent
        type="email"
        required={true}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        onBlur={(e) => validate('email', e.target.value)}
      />
      {emailError && <span>{emailError}</span>}
      <InputComponent
        type="password"
        required={true}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        onBlur={(e) => validate('password', e.target.value)}
      />
      {passwordError && <span>{passwordError}</span>}
      <InputComponent
        type="password"
        required={true}
        placeholder="Verify Password"
        onChange={(e) => setVerifyPassword(e.target.value)}
        onBlur={(e) => validate('verifypassword', e.target.value)}
      />
      {verifyPasswordError && <span>{verifyPasswordError}</span>}
      <InputComponent
        type="tel"
        required={true}
        placeholder="Mobile"
        onChange={(e) => setMobile(e.target.value)}
        onBlur={(e) => validate('mobile', e.target.value)}
      />
      {mobileError && <span>{mobileError}</span>}
      {overallError && <span>{overallError}</span>}
      <Button name="Register" onClick={handleSubmit}></Button>
    </form>
  );
};

export default RegisterComponent;
