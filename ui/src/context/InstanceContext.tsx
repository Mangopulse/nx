"use client"
import { createContext } from "react";

export const InstanceContext = createContext(null as any);

const InstanceContextProvider = InstanceContext.Provider;

export default InstanceContextProvider;