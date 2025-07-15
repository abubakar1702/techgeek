import "./App.css";
import Navbar from "./components/navbar/Navbar";
import { Home } from "./pages/home/Home";
import Footer from "./components/Footer";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BlogDetails from "./pages/BlogDetails";
import UserProfile from "./components/users/UserProfile";
import CategoryPage from "./pages/CategoryPage";
import WriteBlog from "./pages/WriteBlog";
import UserDetails from "./pages/UserDetails";
import { useAuth } from "./context/AuthContext";
import SearchResults from "./pages/SearchResults";
import Notifications from "./pages/Notifications";

function App() {
  const { user } = useAuth();
  const Layout = () => {
    return (
      <>
        <Navbar />
        <Outlet />
        <Footer />
      </>
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="categories/:slug" element={<CategoryPage />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route
          path="/profile"
          element={
            user && user.id ? (
              <Navigate to={`/profile/${user.id}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/write-blog" element={
          user && user.id ? (
            <WriteBlog />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/write-blog/:id" element={
          user && user.id ? (
            <WriteBlog />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/user/:id" element={<UserDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
}

export default App;
