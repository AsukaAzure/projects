import { Route, Routes } from "react-router-dom";

import Welcome from "./pages/welcome";
import Login from "./pages/login";
import { Home } from "./pages/home";
import { Discover } from "./pages/discover";
import { ProfilePage as Profile} from "./pages/profile";
import { SearchPage as Search } from "./pages/search";
import { Question } from "./pages/question";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoutes from "./utils/ProtectedRoute";
import { QuestionDetails } from "./pages/QuestionDetail";
import { Leaderboard } from "./pages/leaderboard";

export default function AppRoute() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoutes />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/question" element={<Question />} />
          </Route>
          <Route path="/home" element={<Home />} />
          <Route path="/question/:id" element={<QuestionDetails />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/search" element={<Search />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </>
  );
}
