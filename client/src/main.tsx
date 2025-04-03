import  { createRoot }  from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import MainPage from './pages/MainPage.tsx'
import ErrorPage from './pages/ErrorPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx'


console.log('Running MAIN.tsx')
const router = createBrowserRouter([
  {
    path: '/',                 //root route
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
    {
      index: true,      // when root is visited, MainPage will load as outlet
      element: <MainPage />
    }, 
    {
      path: '/dash',
      element: <DashboardPage />
    },
  ]
  }
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement); // Use createRoot from react-dom/client
  root.render(
    <RouterProvider router={router} />
  );
}