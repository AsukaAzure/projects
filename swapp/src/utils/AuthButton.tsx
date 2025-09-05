// // AuthContext.tsx
// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext<any>(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("api/auth/check", {
//       credentials: "include",
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.loggedIn) setUser(data.user);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   const logout = async () => {
//     await fetch("/api/auth/logout", {
//       method: "POST",
//       credentials: "include",
//     });
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
