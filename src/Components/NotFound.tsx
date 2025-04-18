import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from './SEO';


/**
 * 404 Not Found page component that properly sets status code
 * and redirects to the home page after 3 seconds.
 */
export const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/'); // Redirect to home page
    }, 3000); // 3 seconds delay

    // Cleanup the timer if the component unmounts before the timeout finishes
    return () => clearTimeout(timer);
  }, [navigate]); // Dependency array includes navigate

  return (
    <>
      <SEO
        title="Page Not Found | Createathon"
        description="The page you are looking for does not exist or has been moved. Redirecting..."
        status={404}
        noindex={true}
      />

      <main className="overflow-x-hidden min-h-screen flex flex-col bg-black text-white">
        {/* Navigation - Placeholder if needed */}


        {/* 404 Content */}
        <div className="flex-grow flex flex-col items-center justify-center pt-24 px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-purple-500">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-lg mb-8 max-w-md text-gray-300">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <p className="text-md text-gray-400">Redirecting you back home shortly...</p>


        </div>

      </main>
    </>
  );
};

export default NotFound;