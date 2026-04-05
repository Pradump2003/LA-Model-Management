// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BecomeModel from "./pages/BecomeModel";

// Blog Pages (you already have these)
import Blogs from "./pages/Blogs"; // Same as News
import BlogDetail from "./pages/BlogDetail"; // Same as NewsDetail

// Model Pages
import AllModels from "./pages/models/AllModels";
import Women from "./pages/models/Women";
import Men from "./pages/models/Men";
import NewFaces from "./pages/models/NewFaces";
import Direct from "./pages/models/Direct";
import SpecialBooking from "./pages/models/SpecialBooking";
import Juniors from "./pages/models/Juniors";
import ModelDetail from "./pages/models/ModelDetail";
import ApplicationSuccess from "./pages/ApplicationSuccess";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            {/* Blog/News Routes */}
            <Route path="/news" element={<Blogs />} />
            <Route path="/news/:slug" element={<BlogDetail />} />

            <Route path="/contact" element={<Contact />} />
            <Route
              path="/application-success"
              element={<ApplicationSuccess />}
            />
            <Route path="/apply" element={<BecomeModel />} />

            {/* Model Routes */}
            <Route path="/models" element={<AllModels />} />
            <Route path="/models/women" element={<Women />} />
            <Route path="/models/men" element={<Men />} />
            <Route path="/models/new-faces" element={<NewFaces />} />
            <Route path="/models/direct" element={<Direct />} />
            <Route
              path="/models/special-booking"
              element={<SpecialBooking />}
            />
            <Route path="/models/juniors" element={<Juniors />} />
            <Route path="/model/:slug" element={<ModelDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
