import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import Sidebar from "./components/sideNavigation/Sidebar";
import Dashboard from "./pages/Dashboard";
import ManageAffirmations from "./pages/ManageAffirmations";
import PostsManagement from "./pages/PostsManagement";
import CategoriesManagement from "./pages/CategoriesManagement";
import Users from "./pages/Users";
import Communities from "./pages/Communities";
import Subscriptions from "./pages/Subscriptions";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/affirmations" element={<ManageAffirmations />} />
              <Route path="/posts" element={<PostsManagement />} />
              <Route path="/categories" element={<CategoriesManagement />} />
              <Route path="/users" element={<Users />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
