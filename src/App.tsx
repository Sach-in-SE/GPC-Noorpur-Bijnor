
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Public Pages
import Layout from "./layouts/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AcademicProgramsPage from "./pages/AcademicProgramsPage";
import FacilitiesPage from "./pages/FacilitiesPage";
import HostelPage from "./pages/HostelPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import ResultPage from "./pages/ResultPage";
import NoticesPage from "./pages/NoticesPage";
import PublicNoticesPage from "./pages/PublicNoticesPage"; 

// Authenticated Pages
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import { default as AdminNoticesPage } from "./pages/admin/notices/NoticesPage";
import NoticeDetailPage from "./pages/admin/notices/NoticeDetailPage";
import GalleryManagementPage from "./pages/admin/content/GalleryManagementPage";
import SettingsPage from "./pages/admin/settings/SettingsPage";

// Auth Components
import PrivateRoute from "./components/auth/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="academics" element={<AcademicProgramsPage />} />
              <Route path="facilities" element={<FacilitiesPage />} />
              <Route path="hostel" element={<HostelPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="notices" element={<PublicNoticesPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="results" element={<ResultPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
              <PrivateRoute allowedRole="admin">
                <AdminLayout />
              </PrivateRoute>
            }>
              <Route index element={<AdminDashboard />} />
              
              {/* Notice Management */}
              <Route path="notices" element={<AdminNoticesPage />} />
              <Route path="notices/create" element={<NoticeDetailPage />} />
              <Route path="notices/:id" element={<NoticeDetailPage />} />
              
              {/* Gallery Management */}
              <Route path="gallery-management" element={<GalleryManagementPage />} />
              
              {/* Settings */}
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
