import { Route, Routes } from "react-router-dom";

import Welcome from "./pages/welcome";
import Login from "./pages/login";
import {Home} from "./pages/home";
import Discover from "./pages/discover";
import Profile from "./pages/profile";
import Search from "./pages/search";
import Question from "./pages/question";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

export default function AppRoute() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/question" element={<Question />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </>
  );
}
