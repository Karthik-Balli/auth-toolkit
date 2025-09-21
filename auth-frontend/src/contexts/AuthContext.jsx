import { createContext, useReducer, useEffect, useState } from "react";
import { authInitialState, authReducer } from "../reducers/authReducer";
import api from "../services/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);
  const [loading, setLoading] = useState(true);

  // Persist user and access token in localStorage when state changes
  useEffect(() => {
    if (state.user && state.accessToken) {
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("accessToken", state.accessToken);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    }
  }, [state.user, state.accessToken, state.isAuthenticated]);

  // Authentication check on mount
  useEffect(() => {
    const authenticateUser = async () => {      
      try {
        // Step 1: Check localStorage
        const storedUser = localStorage.getItem("user");
        const storedAccessToken = localStorage.getItem("accessToken");

        if (storedUser && storedAccessToken) {          
          try {            
            // Token is valid, restore user state
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: {
                user: JSON.parse(storedUser),
                accessToken: storedAccessToken,
              },
            });
            setLoading(false);
            return;
          } catch (tokenError) {
            // Continue to refresh attempt
            console.error("Stored token invalid:", tokenError);
          }
        } else {
          console.log("📭 No valid tokens in localStorage");
        }
        
        const refreshResponse = await api.post("api/auth/refresh");

        if (refreshResponse?.data?.accessToken && refreshResponse?.data?.user) {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              user: refreshResponse.data.user,
              accessToken: refreshResponse.data.accessToken,
            },
          });
        } else {
          dispatch({ type: "LOGOUT" });
        }

      } catch (error) {
        // Clear any stale data
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        
        dispatch({ type: "LOGOUT" });
        console.error("Authentication check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    authenticateUser();
  }, []); // Only run once on mount

  // Login function
  const login = (user, accessToken) => {
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        user: user,
        accessToken,
      },
    });
  };

  // Logout function
  const logout = async () => {    
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("❌ Server logout failed:", err);
    } finally {
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      console.log("🧹 Client-side logout complete");
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };