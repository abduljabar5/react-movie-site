import React, { createContext, useState, useEffect } from "react";

export const MyContext = createContext();

export function MyProvider({ children }) {
  const [myState, setMyState] = useState(() => {
    const savedState = localStorage.getItem("myState");
    return savedState !== null ? JSON.parse(savedState) : 0;
  });

  useEffect(() => {
    localStorage.setItem("myState", JSON.stringify(myState));
  }, [myState]);

  const incrementMyState = () => {
    setMyState(prevState => prevState + 1);
  };

  return (
    <MyContext.Provider value={{ myState, setMyState, incrementMyState }}>
      {children}
    </MyContext.Provider>
  );
}
