import { useStorageState } from "./useStorageState";
import axiosInstance, { setAuthToken } from "../utils/axiosInstance";
import { router } from "expo-router";
import { eventEmitter } from "../utils/eventEmitter";
import React, { useState, useEffect, useCallback } from "react";

const AuthContext = React.createContext<{
  signIn: (credentials: any) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  user?: string | null;
  role?: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  err?: string | null;
}>({
  signIn: () => Promise.resolve(),
  signOut: () => null,
  session: null,
  user: null,
  role: null,
  isAdmin: false,
  isLoading: false,
  err: null,
});

export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [[stateUser, user], setUser] = useStorageState("user");
  const [[stateRole, role], setRole] = useStorageState("role");
  const [isAdmin, setIsAdmin] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const initializeAuth = useCallback(async () => {
    if (session) {
      setAuthToken(session);
    }
  }, [session]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (err) {
      const timer = setTimeout(() => {
        setErr(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [err]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setErr("Tus credenciales se vencieron");
      signOut();
    };
    eventEmitter.on("unauthorized", handleUnauthorized);
    return () => {
      eventEmitter.on("unauthorized", handleUnauthorized);
    };
  }, []);

  const signIn = async (credentials: any) => {
    try {
      const res = await axiosInstance.post("users/auth", credentials);
      const userRes = res.data;
      if (userRes && userRes.status === "success") {
        setSession(userRes.token);
        setUser(userRes.user.user);
        setRole(userRes.user.role);
        if (
          userRes.user.role === "admin" ||
          userRes.user.role === "supervisor"
        ) {
          setIsAdmin(true);
        }
        router.replace("/");
      } else {
        throw new Error("Error de autenticación");
      }
    } catch (error: any) {
      setErr(error.response?.data?.error || "Error de autenticación");
    }
  };

  const signOut = useCallback(() => {
    setUser(null);
    setRole(null);
    setSession(null);
    setIsAdmin(false);
    setAuthToken(null);
  }, [setUser, setRole, setSession]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        user,
        role,
        isAdmin,
        isLoading,
        err,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
