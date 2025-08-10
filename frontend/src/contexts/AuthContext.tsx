import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthState } from "@/types";
import { authService } from "@/services/auth";

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "SET_USER"; payload: User };

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem("medihealth_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
      } catch (error) {
        localStorage.removeItem("medihealth_user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });
    try {
      const user = await authService.login(email, password);
      if (user) {
        localStorage.setItem("medihealth_user", JSON.stringify(user));
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return true;
      } else {
        dispatch({ type: "LOGIN_FAILURE" });
        return false;
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      return false;
    }
  };

  const register = async (data: any): Promise<boolean> => {
    try {
      const user = await authService.register(data);
      if (user) {
        localStorage.setItem("medihealth_user", JSON.stringify(user));
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("medihealth_user");
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (user: User) => {
    localStorage.setItem("medihealth_user", JSON.stringify(user));
    dispatch({ type: "SET_USER", payload: user });
  };

  return (
    <AuthContext.Provider
      value={{ state, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
