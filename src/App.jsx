import MapRouter from './router/AppRouter';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BuilderProvider } from './context/BuilderContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'sonner';
import SuspendedPage from './pages/SuspendedPage';
// import { LoadingScreen } from './router/AppRouter'; 

function AppContent() {
    const { user, loading } = useAuth();

    if (loading) return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;

    // CRITICAL: Block access if suspended
    // Use optional chaining just in case user is null during initial load
    if (user?.status === 'suspended') {
        return <SuspendedPage />;
    }

    return (
        <>
            <MapRouter />
            <Toaster position="top-right" richColors />
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <BuilderProvider>
                <NotificationProvider>
                    <AppContent />
                </NotificationProvider>
            </BuilderProvider>
        </AuthProvider>
    );
}

export default App;
