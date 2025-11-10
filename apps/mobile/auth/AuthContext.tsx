import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";
import { login, LoginResponse } from "@pets/sdk";

type Session = {
  token: string;
  user: LoginResponse["user"];
};

type AuthContextValue = {
  isAuthenticated: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await login(email, password);
    setSession({ token: result.accessToken, user: result.user });
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: session !== null,
      session,
      signIn,
      signOut
    }),
    [session, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
