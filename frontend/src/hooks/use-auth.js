// hooks/useAuth.js
import { useState, useEffect } from "react";
import axios from 'axios';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Default true

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false); 
        return;
      }

      await check_token(token);
      setIsLoading(false); 
    };

    verify();
  }, []);

  // useEffect(() => {
  //   console.log("Status Auth terbaru:", isAuthenticated);
  // }, [isAuthenticated]);

  const check_token = async (token) => {
    try {
      const response = await axios.get(`/api/check-token?token=${token}`);
      const isEmpty = (obj) => Object.keys(obj).length === 0;
      const newValue = !isEmpty(response.data);

      setIsAuthenticated(newValue);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const login = async (data) => {
    try {
      const response = await axios.post(`/api/login`, data);

      if (Object.hasOwn(response.data, "error")) {
        return {
          status: "error",
          message: response.data.error,
        };
      }

      localStorage.setItem("token", response.data.access_token);
      setIsAuthenticated(true);

      return {
        status: "success",
      };
    } catch (error) {
      return {
        status: "error",
        message: "Login gagal",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    login,
    logout,
    isLoading
  };
};

export default useAuth;