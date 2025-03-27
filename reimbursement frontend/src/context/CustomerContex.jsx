import { createContext, useReducer, useContext } from "react";

export const customerContext = createContext();

const initialState = {
  customers: [],
};

const customerReducer = (state, action) => {
  switch (action.type) {
    case "SET_CUSTOMER":
      return {
        ...state,
        customers: action.payload,
      };
    case "DELETE_CUSTOMER":
      return {
        ...state,
        customers: state.customers.filter(
          (customer) => customer._id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export const CustomersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(customerReducer, initialState);
  const setCustomers = (customers) => {
    dispatch({ type: "SET_CUSTOMER", payload: customers });
  };
  const deleteCustomers = (ID) => {
    dispatch({ type: "DELETE_CUSTOMER", payload: ID });
  };
  return (
    <customerContext.Provider
      value={{
        customers: state.customers,
        setCustomers,
        deleteCustomers,
      }}
    >
      {children}
    </customerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(customerContext);
  if (!context) {
    throw new Error("User must be used within a customerProvider");
  }
  return context;
};
