import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Auth/login";
import Register from "./Pages/Auth/register";
import UserHome from "./Pages/user/home";
import AdminHome from "./Pages/Admin/home";
import PrivateRoute from "./components/routes/privateRoute";
import AdminRoute from "./components/routes/adminRoute";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { rehydrateUser } from "./redux/features/auth/authSlice";

function App() {
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (token && userId) {
      dispatch(rehydrateUser({ token, userId, role }));
    }

    setIsChecking(false);
  }, [dispatch]);

  if (isChecking) return <div>Loading...</div>;

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/app/*"
          element={
            <PrivateRoute>
              <UserHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminHome />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
