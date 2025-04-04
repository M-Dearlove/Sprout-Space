import  { createRoot }  from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/index.css'
import App from './App'
import MainPage from './pages/MainPage.tsx'
import ErrorPage from './pages/ErrorPage.tsx';
import GardenPlanner from './pages/GardenPlanner.tsx'
import ProfilePage from './pages/Profile.tsx'

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
      path: '/garden-planner',
      element: <GardenPlanner />
    },
    {
      path: '/profile',
      element: <ProfilePage />
    },
    // {
    //   path: '/pest-control',
    //   element: <PestControl /> //??? 
    // },
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