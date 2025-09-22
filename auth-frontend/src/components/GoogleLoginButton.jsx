import { useEffect, useCallback } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const GoogleLoginButton = () => {
  const { login } = useAuth();

  const handleCredentialResponse = useCallback(async (response) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        { credential: response.credential },
        { withCredentials: true }
      );

      // Save user + tokens in context
      login(res.data.user, res.data.accessToken);
    } catch (error) {
      console.error("Google login failed", error);
    }
  }, [login]);

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("googleLoginDiv"),
        { theme: "outline", size: "large" }
      );
    }
  }, [handleCredentialResponse]);

  return <div id="googleLoginDiv"></div>;
};

export default GoogleLoginButton;
