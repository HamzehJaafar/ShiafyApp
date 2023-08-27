// context/AuthContext.js
import {createContext} from 'react';

export const AuthContext = createContext({
  user: true,
  isLoading: false,
  setUser: () => {},
});
