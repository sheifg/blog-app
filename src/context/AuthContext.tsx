import axios from "axios";
import { createContext, useEffect, useState, ReactNode } from "react";
import { useContext } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../constants";
import { ICurrentUser, IUser } from "../types/types";

interface IAuthContext {
  register: (
    userData: IUser,
    // navigate function doesn't return anything
    navigate: (path: string) => void
  ) => Promise<void>;
  userInfo: ICurrentUser | null;
  login: (userData: IUser, navigate: (path: string) => void) => Promise<void>;
  logout: (navigate: (path: string) => void) => Promise<void>;
  updateUser: (userData: IUser, message: string) => Promise<void>;
}

interface IAuthProviderProps {
  children: ReactNode;
}
// 1 - Create context and specify what kind of context is
const AuthContext = createContext<IAuthContext | undefined>(undefined);

// const baseUrl = "https://33000.fullstack.clarusway.com";
// const baseUrl = "https://39222.fullstack.clarusway.com";
// console.log(baseUrl);

// 2 - Create a provider and specify what kind of props use
export const AuthProvider = ({ children }: IAuthProviderProps) => {
  // Initialize the state from localStorage if available
  // Create user info
  // It can be checked wether if there is userInfo in the localStorage or not, writing a function to check it
  const [userInfo, setUserInfo] = useState<ICurrentUser | null>(() => {
    const storedUser = localStorage.getItem("user");
    // If there is a user, returns the user. If there is no user, returns null
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Effect to update localStorage whenever userInfo changes([userInfo])
  useEffect(() => {
    if (userInfo) {
      // Save user information in localStorage when available
      localStorage.setItem("user", JSON.stringify(userInfo));
    } else {
      // Clear localStorage when userInfo is null (user logged out)
      localStorage.removeItem("user");
    }
  }, [userInfo]);

  // Check authentication when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    // If there is a storedUser and there is no userinfo, it means null or !object -> it means false
    if (storedUser && !userInfo) {
      setUserInfo(JSON.parse(storedUser)); // Restore userInfo from localStorage if available
    }
    // Alternatively, perform an async token validation with the server here
    
  }, []);

  // function checkAuth() {
  //   if (userInfo) {
  //     // add user information to localStorage
  //     localStorage.setItem('user', JSON.stringify(userInfo));
  //   } else {
  //     // retrieve it from localStorage
  //     const user = localStorage.getItem('user');
  //     if (user) setUserInfo(JSON.parse(user));
  //   }
  // }

  // Register function
  const register = async (
    // userData first parameter
    userData: IUser,
    // navigate second paraemeter and it will be a function and it will return nothing
    navigate: (path: string) => void
  ) => {
    try {
      const { data } = await axios({
        url: `${BASE_URL}/users/`,
        method: "POST",
        data: userData,
      });
      const user = {
        // data.token, the token comes outside of data.data, for that reason it is included like this
        token: data.token,
        // data.data because the info from user comes inside the object data in postman
        // spread is a copy of the data inside the data object, plus the token
        ...data.data,
      };
      setUserInfo(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
      toast.success("User registered successfully!");
    } catch (error) {
      console.log(error);
      // error is a parameter, what is the type of this parameter? TS knows it or not?
      // It is not known, because if it comes from axios. The error should shown the following message
      if (axios.isAxiosError(error)) {
        // The following message it comes just, if it comes from axios error
        toast.error(error.response?.data?.message);
        // This part will always be used like this: error insteadof Error
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Login user
  // First parameter -> userData
  // Second paramerer -> navigate function
  const login = async (userData: IUser, navigate: (path: string) => void) => {
    console.log("login", userData);
    try {
      const { data } = await axios({
        url: `${BASE_URL}/auth/login`,
        method: "POST",
        data: userData,
      });
      console.log(data);
      const user = {
        token: data.token,
        // The data comes inside the user
        ...data.user,
      };
      setUserInfo(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
      toast.success("Login Successful!");
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Logout function
  // It will only have navigate as parameter
  const logout = async (navigate: (path: string) => void) => {
    // Alternatively here the token can be got from the local storage
    // const user = localStorage.getItem('user');
    // if (user) {
    //   const token = JSON.parse(user).token;
    try {
      await axios({
        url: `${BASE_URL}/auth/logout/`,
        method: "GET",
        // token can be included as authorization in headers here or alternatively getting the token from the local storage
        headers: {
          Authorization: `Token ${userInfo?.token}`,
        },
      });
      // It is necessary to clear the user from the state
      setUserInfo(null);
      // It is necessary to clear the user from localStorage
      localStorage.removeItem("user");
      navigate("/auth/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Update user
  const updateUser = async (userData: IUser, message: string) => {
    // const token = JSON.parse(localStorage.getItem('user') || '{}').token;
    try {
      const { data } = await axios({
        url: `${BASE_URL}/users/${userData?._id}/`,
        method: "PATCH",
        data: userData,
        headers: {
          Authorization: `Token ${userInfo?.token}`,
        },
      });
      const user = {
        // current user information
        ...userInfo,
        // It is wanted to overwrite with new data comes from the api
        // new comes from the Api, it can be checked in postman updating a user
        // .new comes with all data, the updated and not updated, but there is not included the token. That was one of the reason to spread the userInfo first and then overwriting spreading with data.new , that it will include the update info and plus the token
        ...data.new,
      };
      // setUserInfo({ ...userInfo, ...data.new });
      setUserInfo(user);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(message);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // 3 - Return the provider

  return (
    <AuthContext.Provider
      value={{ register, login, logout, userInfo, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 4 - Create custom hook
export const useAuth = (): IAuthContext => {
  // With this syntax it is necessary to cover as possible undefined values
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

//! falsy values: null, undefined, faklse and 0
// As boolean values mean false, and with ! mean true
//! trutty values: the rest
// As boolean values mean true, and with ! mean false
