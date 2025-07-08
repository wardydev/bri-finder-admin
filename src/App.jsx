import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Register from "./pages/register";
import PrivateRoute from "./routes/private-route";
import Comments from "./pages/comments";
import Layout from "./components/layout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/comment"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <Comments />
                </Layout>
              }
            />
          }
        />
      </Routes>
    </Router>
  );
}
