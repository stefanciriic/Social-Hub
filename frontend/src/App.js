import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/home/Home";
import { Login } from "./pages/login/Login";
import { Register } from "./pages/register/Register";
import { Profile } from "./pages/profile/Profile";
import { Chat } from "./pages/chat/Chat";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";

function App() {
  return (
    <Routes>
      <Route element={<LoggedInRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/chat/:chatId" element={<Chat />} />
      </Route>
      <Route element={<NotLoggedInRoutes />}>
        <Route path="/login" element={<Login />} exact />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
