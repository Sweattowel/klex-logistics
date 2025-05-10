'use client'

import { Children, createContext, ReactNode, useContext, useState } from "react";

type ThemeContextType = {
    theme: number;
    setTheme: (value: number) => void;
};

const themeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children } : { children: ReactNode }) => {
    const [ theme, setTheme ] = useState<number>(0);

    return (
        <themeContext.Provider value={{ theme, setTheme }}>
            {children}
        </themeContext.Provider>
    )
};

export const useTheme = () => {
    const context = useContext(themeContext);
    if (!context) throw new Error('useTheme must be used inside ThemeProvider');
    return context;
  };