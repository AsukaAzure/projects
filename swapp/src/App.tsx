import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppRoute from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer theme="dark"/>
      <AppRoute />
    </BrowserRouter>
  );
}
