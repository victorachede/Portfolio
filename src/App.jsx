import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast'; // Import Toaster
import Admin from './pages/Admin';
import PostDetail from './pages/PostDetail';
import Header from "./components/Header";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import "./index.css";

const App = () => {
  return (
    <>
      <Header />
      <main className="pt-20 px-4 md:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/blog/:slug" element={<PostDetail />} />
          <Route path="/courses" element={<Courses />} />
        </Routes>
      </main>
      <Toaster /> 
    </>
  );
};

export default App;