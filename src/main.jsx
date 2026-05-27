import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { makeRouter } from './router';
import { loadContent } from './data/contentStore';
import './styles.css';

const queryClient = new QueryClient();

const RoboticsSite = () => {
  const { data: content } = useQuery({ queryKey: ['site-content'], queryFn: loadContent, initialData: loadContent, staleTime: Infinity });
  const router = React.useMemo(() => makeRouter(content), [content]);

  return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RoboticsSite />
    </QueryClientProvider>
  </React.StrictMode>
);
