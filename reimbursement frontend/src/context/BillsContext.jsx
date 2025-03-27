import { createContext, useContext, useReducer } from "react";

// Create Context
export const BillsContext = createContext();

// Initial State
const initialState = {
  bills: [],
};

// Reducer Function
const billsReducer = (state, action) => {
  switch (action.type) {
    case "SET_BILLS":
      return { ...state, bills: action.payload };

    case "CREATE_BILL":
      return { ...state, bills: [...state.bills, action.payload] };

    case "DELETE_BILL":
      return {
        ...state,
        bills: state.bills.filter((bill) => bill._id !== action.payload),
      };

    case "EDIT_BILL":
      return {
        ...state,
        bills: state.bills.map((bill) =>
          bill.id === action.payload._id
            ? { ...bill, ...action.payload.data }
            : bill
        ),
      };

    default:
      return state;
  }
};

// Context Provider
export const BillsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(billsReducer, initialState);

  // Action Creators
  const setBills = (bills) => {
    // console.warn(bills);
    dispatch({ type: "SET_BILLS", payload: bills });
  };

  const createBill = (bill) => {
    dispatch({ type: "CREATE_BILL", payload: bill });
  };

  const deleteBill = (id) => {
    dispatch({ type: "DELETE_BILL", payload: id });
  };

  const editBill = (id, data) => {
    dispatch({ type: "EDIT_BILL", payload: { id, data } });
  };

  return (
    <BillsContext.Provider
      value={{
        bills: state.bills,
        setBills,
        createBill,
        deleteBill,
        editBill,
      }}
    >
      {children}
    </BillsContext.Provider>
  );
};

const useBills = () => {
  const context = useContext(BillsContext);
  if (!context) {
    throw new Error("useBills must be used within a BillsProvider");
  }
  return context;
};

export { useBills };
