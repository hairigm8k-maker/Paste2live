import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import VerifyEmailPage from "./pages/public/VerifyEmailPage";
import ForgotPasswordPage from "./pages/public/ForgotPasswordPage";
import ResetPasswordPage from "./pages/public/ResetPasswordPage";
import PricingPage from "./pages/public/PricingPage";
import DocsPage from "./pages/public/DocsPage";
import TermsPage from "./pages/public/TermsPage";
import PrivacyPage from "./pages/public/PrivacyPage";
import NotFoundPage from "./pages/public/NotFoundPage";

import OverviewPage from "./pages/dashboard/OverviewPage";
import SitesListPage from "./pages/dashboard/SitesListPage";
import NewSitePage from "./pages/dashboard/NewSitePage";
import EditorPage from "./pages/dashboard/EditorPage";
import SiteSettingsPage from "./pages/dashboard/SiteSettingsPage";
import ReleasesPage from "./pages/dashboard/ReleasesPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSitesPage from "./pages/admin/AdminSitesPage";
import AdminAuditPage from "./pages/admin/AdminAuditPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<OverviewPage />} />
          <Route path="sites" element={<SitesListPage />} />
          <Route path="sites/new" element={<NewSitePage />} />
          <Route path="sites/:id/editor" element={<EditorPage />} />
          <Route path="sites/:id/settings" element={<SiteSettingsPage />} />
          <Route path="sites/:id/releases" element={<ReleasesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="sites" element={<AdminSitesPage />} />
          <Route path="audit" element={<AdminAuditPage />} />
        </Route>

        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
