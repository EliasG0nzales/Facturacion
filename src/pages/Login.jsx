import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    if (user === "Smith" && pass === "Smith") {
      localStorage.setItem("auth", "true");
      navigate("/dashboard");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <h2>Login</h2>
        <input placeholder="Usuario" onChange={(e)=>setUser(e.target.value)} />
        <input type="password" placeholder="Contraseña" onChange={(e)=>setPass(e.target.value)} />
        <button onClick={handleLogin}>Ingresar</button>
      </div>
    </div>
  );
}

export default Login;