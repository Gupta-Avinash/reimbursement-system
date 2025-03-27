import { createContext, useContext, useReducer } from "react";

export const userContext = createContext();

const initialState = {
  users: [],
};

const usersReducer = (state, action) => {
  switch (action.type) {
    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };

    case "DELETE_USERS":
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.payload),
      };

    default:
      return state;
  }
};

export const UsersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(usersReducer, initialState);

  // Action Creators
  const setUsers = (users) => {
    dispatch({ type: "SET_USERS", payload: users });
  };
  const deleteUsers = (ID) => {
    dispatch({ type: "DELETE_USERS", payload: ID });
  };
  return (
    <userContext.Provider
      value={{
        users: state.users,
        setUsers,
        deleteUsers,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("User must be used within a userProvider");
  }
  // console.log(context);
  return context;
};
