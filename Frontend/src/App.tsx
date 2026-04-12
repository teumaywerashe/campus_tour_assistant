import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Categories from './pages/Categories';
import About from './pages/About';
import BuildingDetails from './pages/BuildingDetails';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminFeedbackReview from './pages/AdminFeedbackReview';
import Feedback from './pages/FeedBack';
import { Toaster } from 'react-hot-toast';
import { storeContext } from './context/StoreContext';

function App() {
  const { isAuthenticated, setIsAuthenticated } = useContext(storeContext)!;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onBuildingSelect, setOnBuildingSelect] = useState<any>(null);

  return (
    <Layout>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/search"
          element={
            <Search
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onBuildingSelect={onBuildingSelect}
              setOnBuildingSelect={setOnBuildingSelect}
            />
          }
        />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/location/:id" element={<BuildingDetails />} />
        <Route path="/category/:category" element={<Categories />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLogin setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/admin"
          element={isAuthenticated ? <Admin /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin/feedback"
          element={isAuthenticated ? <AdminFeedbackReview /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Layout>
  );
}

export default App;
