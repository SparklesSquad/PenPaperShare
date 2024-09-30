import './App.css';
import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/"></Route>
        <Route path="/auth">
          <Route path="login" element={<AuthPage route="login" />}></Route>
          <Route
            path="register"
            element={<AuthPage route="register" />}
          ></Route>
          <Route
            path="verifyotp"
            element={<AuthPage route="verifyotp" />}
          ></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
