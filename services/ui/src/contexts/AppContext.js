import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  activeDeliveries: [],
  alerts: [],
  selectedDelivery: null,
  loading: false,
  error: null
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_DELIVERIES':
      return { ...state, activeDeliveries: action.payload };
    case 'ADD_DELIVERY_TELEMETRY':
      // If delivery already exists, update it; otherwise, add new delivery
      const existingIndex = state.activeDeliveries.findIndex(
        delivery => delivery.part_id === action.payload.part_id
      );
      
      if (existingIndex !== -1) {
        const updatedDeliveries = [...state.activeDeliveries];
        updatedDeliveries[existingIndex] = action.payload;
        return { ...state, activeDeliveries: updatedDeliveries };
      } else {
        return { 
          ...state, 
          activeDeliveries: [...state.activeDeliveries, action.payload] 
        };
      }
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts]
      };
    case 'SET_SELECTED_DELIVERY':
      return { ...state, selectedDelivery: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};