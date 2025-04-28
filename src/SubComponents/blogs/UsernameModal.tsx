import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../button";
import { createOrUpdateBlogUser } from "../../utils/apiClient";

// Define Google user interface
interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

const UsernameModal = ({ isOpen, onClose, onSubmit }: UsernameModalProps) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInSuccess, setSignInSuccess] = useState(false);
  const [userProfile, setUserProfile] = useState<GoogleUser | null>(null);
  const [countdown, setCountdown] = useState(2);

  // Load Google API script
  useEffect(() => {
    // Load the Google API script if not already loaded
    if (!document.getElementById('google-api-script')) {
      const script = document.createElement('script');
      script.id = 'google-api-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      return () => {
        // Clean up the script when component unmounts
        const scriptElement = document.getElementById('google-api-script');
        if (scriptElement) document.body.removeChild(scriptElement);
      };
    }
  }, []);

  // Countdown timer for success message
  useEffect(() => {
    if (signInSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (signInSuccess && countdown === 0) {
      // When countdown reaches 0, submit the name and close the modal
      if (userProfile) {
        onSubmit(userProfile.name);
      }
      onClose();

      // Store a flag in localStorage to indicate login is complete
      // This prevents the modal from showing again
      localStorage.setItem("google-signin-complete", "true");
    }
  }, [signInSuccess, countdown, userProfile, onSubmit, onClose]);

  // Initialize Google Sign-In when the component mounts
  useEffect(() => {
    if (!isOpen) return;

    // Define callback function for Google Sign-In
    window.handleGoogleSignIn = async (googleResponse: any) => {
      try {
        setIsSigningIn(true);

        // Decode the JWT token from Google
        const base64Url = googleResponse.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const googleUser: GoogleUser = JSON.parse(jsonPayload);
        setUserProfile(googleUser);

        // Generate username from email (remove domain part)
        const username = googleUser.email.split('@')[0];
        console.log(googleUser);
        // Save user data to backend
        const userData = {
          username,
          name: googleUser.name,
          email: googleUser.email,
          avatar: googleUser.picture // Use the avatar URL from Google
        };

        // Store initial user data in localStorage
        localStorage.setItem("blog-user-data", JSON.stringify(userData));

        // Create or update user in backend and get the numeric ID
        const apiResponse = await createOrUpdateBlogUser(userData);

        if (apiResponse.success && apiResponse.data && apiResponse.data.id) {
          // Update user data with the numeric ID from API
          const updatedUserData = {
            ...userData,
            id: apiResponse.data.id,
            user_id: apiResponse.data.id
          };

          // Save the updated user data with ID
          localStorage.setItem("blog-user-data", JSON.stringify(updatedUserData));
        }

        // Show success message and start countdown
        setSignInSuccess(true);
        setCountdown(4);

      } catch (error) {
        console.error('Error processing Google Sign-In:', error);
        setIsSigningIn(false);
      }
    };

    // Initialize Google Sign-In button when the modal is open
    const initializeGoogleSignIn = () => {
      // @ts-ignore - Google Identity Services global object
      if (window.google && document.getElementById('google-sign-in-button')) {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1071811440430-6m4aeudcv4paksmodpfg2nr0eovu4i5j.apps.googleusercontent.com',
          callback: window.handleGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // @ts-ignore
        window.google.accounts.id.renderButton(
          document.getElementById('google-sign-in-button'),
          {
            type: 'standard',
            size: 'large',
            theme: 'outline',
            text: 'continue_with',
            shape: 'pill',
            logo_alignment: 'center',
            border: 'none'
          }
        );
      } else {
        // Retry if Google API is not loaded yet
        setTimeout(initializeGoogleSignIn, 200);
      }
    };

    initializeGoogleSignIn();

    return () => {
      // @ts-ignore
      if (window.google && window.google.accounts) {
        // @ts-ignore
        window.google.accounts.id.cancel();
      }
    };
  }, [isOpen, onSubmit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-20 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {signInSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center py-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign-in Successful!</h3>

              {userProfile && (
                <div className="flex items-center mt-2 bg-gray-50 rounded-full py-2 px-4">
                  <img
                    src={userProfile.picture}
                    alt={userProfile.name}
                    className="w-8 h-8 rounded-full mr-2 border border-gray-200"
                  />
                  <span className="text-gray-800 font-medium">{userProfile.name}</span>
                </div>
              )}

              <div className="text-gray-600 mt-3 flex items-center">
                <span>Redirecting to comment section</span>
                <span className="ml-2 flex">
                  <span className="animate-bounce mx-0.5 delay-100">.</span>
                  <span className="animate-bounce mx-0.5 delay-200">.</span>
                  <span className="animate-bounce mx-0.5 delay-300">.</span>
                </span>
              </div>

              <div className="mt-4 bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-500">
                Closing in {countdown} seconds
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl text-black font-semibold">Sign in to comment</h3>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isSigningIn}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="text-center mb-8">
                <p className="text-gray-600 mb-6">To continue with your comment, please sign in with your Google account.</p>

                {/* Google Sign-In Button */}
                <div className="relative">
                  {isSigningIn && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg z-10">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                        <span className="text-sm text-gray-600 mt-2">Signing in...</span>
                      </div>
                    </div>
                  )}

                  <div className="border border-gray-300 rounded-full p-1 hover:shadow-md transition-shadow">
                    <div id="google-sign-in-button" className="flex justify-center my-2"></div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-6">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
                  disabled={isSigningIn}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default UsernameModal;

// Add type definition for the global window object
declare global {
  interface Window {
    google: any;
    handleGoogleSignIn: (response: any) => void;
  }
}