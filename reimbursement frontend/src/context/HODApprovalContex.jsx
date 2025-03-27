import { createContext, useReducer, useContext } from "react";

const HODContext = createContext();

const initialState = {
  bills: [],
};

const HODreducers = (state, action) => {
  switch (action.type) {
    case "SET_BILLS":
      return {
        ...state,
        bills: action.payload,
      };
    case "APPROVED_BILLS":
      return {
        ...state,
        bills: state.bills.filter((bill) => bill._id !== action.payload),
      };
    case "REJECTED_BILLS":
      return {
        ...state,
        bills: state.bills.filter((bill) => bill._id !== action.payload),
      };

    default:
      return state;
  }
};

export const HODProvider = ({ children }) => {
  const [state, dispatch] = useReducer(HODreducers, initialState);

  const setbills = (bills) => {
    dispatch({ type: "SET_BILLS", payload: bills });
  };
  const approvedbills = (ID) => {
    dispatch({ type: "APPROVED_BILLS", payload: ID });
  };
  const rejectedbills = (ID) => {
    dispatch({ type: "REJECTED_BILLS", payload: ID });
  };

  return (
    <HODContext.Provider
      value={{
        bills: state.bills,
        setbills,
        approvedbills,
        rejectedbills,
      }}
    >
      {children}
    </HODContext.Provider>
  );
};

export const useHOD = () => {
  const context = useContext(HODContext);
  if (!context) {
    throw new Error("useBills must be used within a BillsProvider");
  }
  return context;
};
