import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import ThemeTogglebutton from "./components/ui/theme-togggle";
import { Link } from "react-router-dom";

function App() {
  const token = localStorage.getItem("token");
  const LocalStorageData = token ? JSON.parse(token) : null;
  const apikey = LocalStorageData.apiKey;
  const navigate = useNavigate();

  useEffect(() => {
    console.log(import.meta.env.VITE_BASE_URL);
    fetch(`${import.meta.env.VITE_BASE_URL}/protected`, {
      headers: {
        Authorization: `Bearer ${apikey}`,
      },
    }).then((res) => {
      if (res.status !== 200) {
        navigate("/login");
      }
    });
  }, []);

  return (
    <>
      <Button>Click me</Button>
      <ThemeTogglebutton />
      <br />
      <Link to="/dashboard">Dashboard</Link>
      <br />
      <Link to="/login">Login</Link>
      <br />
      <Link to="/register">Register</Link>
      <br />
      <Link to="/input">Input Form</Link>
    </>
  );
}

export default App;
