import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBuilder } from '../context/BuilderContext';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import VerifyEmail from '../pages/VerifyEmail';
import Projects from '../pages/Projects';
import ProjectDetails from '../pages/ProjectDetails';
import Units from '../pages/Units';
import Tenants from '../pages/Tenants';
import Rent from '../pages/Rent';
import Staff from '../pages/Staff';
import Reports from '../pages/Reports';
import Notifications from '../pages/Notifications';
import Settings from '../pages/Settings';
import Contact from '../pages/Contact';
import Society from '../pages/Society';
import SidebarLayout from '../components/layout/SidebarLayout';

const ProtectedBuilderRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Email Verification Guard
    if (!user.emailVerified) {
        return <Navigate to="/verify-email" replace />;
    }

    return children;
};

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/verify-email" element={<VerifyEmail />} />

                <Route path="/" element={
                    <ProtectedBuilderRoute>
                        <SidebarLayout />
                    </ProtectedBuilderRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="projects/:projectId" element={<ProjectDetails />} />
                    <Route path="units" element={<Units />} />
                    <Route path="tenants" element={<Tenants />} />
                    <Route path="rent" element={<Rent />} />
                    <Route path="society" element={<Society />} />
                    <Route path="staff" element={<Staff />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="contact" element={<Contact />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
