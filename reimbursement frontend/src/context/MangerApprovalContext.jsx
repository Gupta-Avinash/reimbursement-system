import { createContext, useReducer, useContext } from "react";

const ManagerContext = createContext();

const initialState = {
  bills: [],
};

const Managerreducers = (state, action) => {
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
      state;
  }
};

export const ManagerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Managerreducers, initialState);

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
    <ManagerContext.Provider
      value={{ bills: state.bills, setbills, approvedbills, rejectedbills }}
    >
      {children}
    </ManagerContext.Provider>
  );
};

export const useManager = () => {
  const context = useContext(ManagerContext);
  if (!context) {
    throw new Error("useBills must be used within a BillsProvider");
  }
  return context;
};
