//https://www.geeksforgeeks.org/reactjs/reactjs-usenavigate-hook/
//use navigate to change routes aka screens

import { useNavigate } from "react-router-dom";
import UserLogin from "./UserLogin.jsx";

function Login() {

  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/home");
  };

  return (
    <UserLogin onLoginSuccess={handleLoginSuccess} />
  );
}

export default Login;