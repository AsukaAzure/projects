// import { createContext, useContext, useState } from "react";
// import type { ReactNode } from "react"; // ✅ type-only import

// // Shape of the user object
// type User = {
//   id: string;
//   username: string;
//   email?: string; // optional if backend gives more info
// };

// // Shape of the context
// type AuthContextType = {
//   user: User | null;
//   login: (userData: User) => void;
//   logout: () => void;
// };

// // Create the context
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Provider props
// type AuthProviderProps = {
//   children: ReactNode;
// };

// // Provider component
// export function AuthProvider({ children }: AuthProviderProps) {
//   const [user, setUser] = useState<User | null>(null);

//   const login = (userData: User) => {
//     setUser(userData);
//     // (Optional) save to localStorage for persistence
//     localStorage.setItem("user", JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   const value: AuthContextType = { user, login, logout };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// // Custom hook to use context
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }