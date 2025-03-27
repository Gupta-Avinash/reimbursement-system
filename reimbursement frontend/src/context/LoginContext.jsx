import React, { createContext, useReducer, useContext } from "react";

// Step 1: Define the initial state
const initialState = {
  accessToken: "",
  isLoggedIn: null,
};

let token = localStorage.getItem("accessToken");
if (token) {
  initialState.isLoggedIn = true;
} else {
  initialState.isLoggedIn = false;
}

// Step 2: Define action types
const ACTIONS = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};

// Step 3: Create a reducer to handle state changes based on actions
const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        accessToken: action.payload,
        isLoggedIn: true,
      };
    case ACTIONS.LOGOUT:
      return {
        accessToken: "",
        isLoggedIn: false,
      };
    default:
      return state;
  }
};

// Step 4: Create Context
const AuthContext = createContext();

// Step 6: Create the provider component to wrap your app
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Step 7: Define the actions
  const login = (user) => {
    let token = localStorage.getItem("accessToken");
    if (token) {
      dispatch({ type: ACTIONS.LOGIN, payload: token });
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    dispatch({ type: ACTIONS.LOGOUT });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: state.isLoggedIn,
        accessToken: state.accessToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Step 5: Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
