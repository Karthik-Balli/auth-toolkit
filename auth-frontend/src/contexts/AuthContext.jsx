import { createContext, useReducer, useEffect, useContext } from "react";
import { authInitialState, authReducer } from "../reducers/authReducer";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState, () => {
    const user = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    return {
      user: user ? JSON.parse(user) : null,
      accessToken: accessToken ? accessToken : null,
    };
  });

  // Persist user in localStorage
  useEffect(() => {
    if (state.user && state.accessToken) {
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("accessToken", state.accessToken);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    }
  }, [state.user, state.accessToken]);


// Helper Auth functions
const login = (user, accessToken) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, accessToken } });
}

const logout = () => {
    dispatch({ type: 'LOGOUT' });
}

return(
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
);
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);