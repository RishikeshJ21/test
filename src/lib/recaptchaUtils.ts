/**
 * Checks if reCAPTCHA is loaded and available
 */
export const isRecaptchaAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.grecaptcha !== 'undefined' && 
         window.grecaptcha !== null;
};

/**
 * Ensures reCAPTCHA is loaded before calling the callback
 * @param callback Function to call when reCAPTCHA is ready
 * @param timeout Maximum time to wait in milliseconds
 * @returns Promise that resolves when reCAPTCHA is ready
 */
export const ensureRecaptchaLoaded = (
  callback: () => void,
  timeout = 5000
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If grecaptcha is already available and has ready method
    if (isRecaptchaAvailable() && typeof (window as any).grecaptcha.ready === 'function') {
      (window as any).grecaptcha.ready(() => {
        callback();
        resolve();
      });
      return;
    }

    // Set a timeout for loading
    const timeoutId = setTimeout(() => {
      window.removeEventListener('recaptcha-load-error', onError);
      reject(new Error('reCAPTCHA loading timed out'));
    }, timeout);

    // Error handler
    const onError = () => {
      clearTimeout(timeoutId);
      reject(new Error('reCAPTCHA failed to load'));
    };

    // Listen for the custom error event we set up in index.html
    window.addEventListener('recaptcha-load-error', onError, { once: true });

    // Check periodically if grecaptcha is loaded
    const checkRecaptchaLoaded = () => {
      if (isRecaptchaAvailable() && typeof (window as any).grecaptcha.ready === 'function') {
        clearTimeout(timeoutId);
        window.removeEventListener('recaptcha-load-error', onError);

        (window as any).grecaptcha.ready(() => {
          callback();
          resolve();
        });
      } else {
        // Check again in 100ms
        setTimeout(checkRecaptchaLoaded, 100);
      }
    };

    // Start checking
    checkRecaptchaLoaded();
  });
};

/**
 * Get the reCAPTCHA site key from environment variables
 */
export const getRecaptchaSiteKey = (): string => {
  const envKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim();
  const fallbackKey = '6LcdGRgrAAAAAIU-zzCAQN2GrwPnqS6mrVtjUb6v';
  
  if (!envKey) {
    console.warn('No reCAPTCHA site key found in environment variables. Using fallback key.');
  }
  
  return envKey || fallbackKey;
};

/**
 * Safely attempt to reset reCAPTCHA
 * Uses type assertion to avoid TypeScript errors with the grecaptcha global
 */
export const safeResetRecaptcha = (): void => {
  try {
    if (typeof window !== 'undefined' && 
        typeof window.grecaptcha !== 'undefined' && 
        window.grecaptcha !== null) {
      // We need to use type assertion here because the grecaptcha interface
      // varies between different components that might have defined it
      const grecaptcha = window.grecaptcha as unknown as { reset: () => void };
      if (typeof grecaptcha.reset === 'function') {
        grecaptcha.reset();
      }
    }
  } catch (error) {
    console.error('Error resetting reCAPTCHA:', error);
  }
};

/**
 * Helper function to handle reCAPTCHA errors in components
 */
export const handleRecaptchaError = (
  setError: (msg: string) => void,
  setCaptchaLoaded: (loaded: boolean) => void
): void => {
  console.error('reCAPTCHA error occurred');
  setError('Error loading captcha. Please refresh and try again.');
  setCaptchaLoaded(false);
}; 