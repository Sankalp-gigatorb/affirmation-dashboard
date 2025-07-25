import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";
import AdminSubscriptions from "./pages/AdminSubscriptions";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { NotificationManager } from "./components/notifications/NotificationManager";
import { Toaster } from "sonner";
import AuthService from "./services/auth.service";

function App() {
  const isAuthenticated = AuthService.isAuthenticated();

  return (
    <>
      <Toaster />
      {isAuthenticated && <NotificationManager />}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Admin Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <main>
                      <Dashboard />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/affirmations"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <main>
                      <ManageAffirmations />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <main>
                      <PostsManagement />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <main>
                      <CategoriesManagement />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <main>
                      <Users />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/communities"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <main>
                      <Communities />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/subscriptions"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <main>
                      <Subscriptions />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/subscriptions"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <main>
                      <AdminSubscriptions />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <main>
                      <Notifications />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <main>
                      <Reports />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <main>
                      <Settings />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <main>
                      <Profile />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Subscription Success and Cancel Routes */}
          <Route
            path="/subscription/success"
            element={<SubscriptionSuccess />}
          />
          <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
