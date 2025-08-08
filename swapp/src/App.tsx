import { BrowserRouter } from "react-router-dom";
import AppRoute from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <AppRoute />
    </BrowserRouter>
  );
}
