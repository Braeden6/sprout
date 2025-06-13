import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'
import { initializeApi } from './services/api';
import { AuthPopup } from './components/AuthPopup'
import { useAuthStore } from './stores/authStore'
import { useEffect } from 'react';
import Home from '@/routes/index';

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient();
initializeApi();

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { initLogin, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    initLogin();
  }, [initLogin]);

  if (!isAuthenticated) {
    return (
      <>
        <Home />
        <AuthPopup />
      </>
    )
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }
  
  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthWrapper>
        <RouterProvider router={router} />
      </AuthWrapper>
    </QueryClientProvider>
  )
}

export default App;

