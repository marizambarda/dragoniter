import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('access_token') !== null
  );

  const [loggedUser, setLoggedUser] = useState(null);
  const [isLoadingLoggedUser, setIsLoadingLoggedUser] = useState(false);

  function isMe(user) {
    const userId = user && user.id ? user.id : user;
    return loggedUser && userId === loggedUser.id;
  }

  useEffect(() => {
    async function getData() {
      if (isLoggedIn) {
        setIsLoadingLoggedUser(true);
        const response = await api.get('/me');
        setIsLoadingLoggedUser(false);
        setLoggedUser(response.data);
      }
    }
    getData();
  }, [isLoggedIn]);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        loggedUser,
        setLoggedUser,
        isLoadingLoggedUser,
        isMe,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
