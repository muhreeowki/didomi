"use client";
import {
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

type DidomiState = {
  csrf: string | undefined;
  setCsrf: Dispatch<SetStateAction<string | undefined>>;
  loading: boolean;
  signedIn: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setSignedIn: Dispatch<SetStateAction<boolean>>;
  signInWindowOpen: boolean;
  setSignInWindowOpen: Dispatch<SetStateAction<boolean>>;
};

const DidomiContext = createContext<DidomiState>({} as DidomiState);

export function DidomiProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [signInWindowOpen, setSignInWindowOpen] = useState(false);
  const [csrf, setCsrf] = useState<string | undefined>(undefined);
  const defaultDidomiState: DidomiState = {
    csrf,
    setCsrf,
    loading,
    setLoading,
    signedIn,
    setSignedIn,
    signInWindowOpen,
    setSignInWindowOpen,
  };
  if (!defaultDidomiState) return null;

  return (
    <>
      <DidomiContext.Provider value={defaultDidomiState}>
        {children}
      </DidomiContext.Provider>
    </>
  );
}

export function useDidomiContext() {
  const ctx = useContext(DidomiContext);
  if (!ctx) {
    throw new Error("useDidomiContext must be used within DidomiProvider");
  }
  return ctx;
}
