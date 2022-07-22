import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const { hash } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(hash.slice(1));
    const accessToken = params.get("access_token");
    if (accessToken != null) {
      localStorage.setItem("accessToken", accessToken);
      navigate("/");
    }
  }, [hash]);

  return <div>Login</div>;
}
