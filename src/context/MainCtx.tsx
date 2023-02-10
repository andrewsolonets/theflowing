/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { UserData } from "@prisma/client";
import { useSession } from "next-auth/react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { api } from "../utils/api";

type MainCtx = {
  localData: UserData[];
  color: string;
  colorOpen: string;
  setColorOpen: Dispatch<SetStateAction<string>>;
  setColor: Dispatch<SetStateAction<string>>;
  setLocalData: Dispatch<SetStateAction<UserData[]>>;
};

type MainProviderProps = {
  children: ReactNode;
};

const MainContext = createContext({} as MainCtx);

export function useMainCtx() {
  return useContext(MainContext);
}

export function MainProvider({ children }: MainProviderProps) {
  const [localData, setLocalData] = useLocalStorage(
    "userData",
    [] as UserData[]
  );
  const [color, setColor] = useState("#aabbcc");
  const [colorOpen, setColorOpen] = useState("");
  const { data: sessionData } = useSession();

  const userId = sessionData?.user?.id;
  const localMigration = api.flow.postManyFlows.useMutation();

  useEffect(() => {
    if (userId && localData) {
      const newData = localData.map((el) => {
        return { ...el, userId };
      });
      //@ts-expect-error
      localMigration.mutate(newData);
      setLocalData([]);
    }
  }, [userId]);

  return (
    <MainContext.Provider
      value={{
        localData,
        setLocalData,
        color,
        setColor,
        setColorOpen,
        colorOpen,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}
