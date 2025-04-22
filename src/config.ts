/**
 * Application configuration
 * This file centralizes access to environment variables
<<<<<<< HEAD
 * 
=======
 *
>>>>>>> e5e19c510f9e5754f29a70d82f406e422fe4379f
 * Environment variables are loaded from:
 * 1. .env file during development
 * 2. Built into the application during the build process
 * 3. From web.config via IIS environment variables in production
 *
 * Usage:
 * import config from './config';
<<<<<<< HEAD
 * 
 * // Access API endpoint
 * fetch(`${config.api.baseUrl}${config.api.endpoints.email}`);
 * 
=======
 *
 * // Access API endpoint
 * fetch(`${config.api.baseUrl}${config.api.endpoints.email}`);
 *
>>>>>>> e5e19c510f9e5754f29a70d82f406e422fe4379f
 * // Access reCAPTCHA key
 * <ReCAPTCHA sitekey={config.recaptcha.siteKey} />
 */

/**
 * Application configuration interface
 */
export interface AppConfig {
  api: {
    baseUrl: string;
    endpoints: {
      newsletterSubscribe: string;
      newsletterUnsubscribe: string;
      email: string;
<<<<<<< HEAD
    }
=======
    };
>>>>>>> e5e19c510f9e5754f29a70d82f406e422fe4379f
  };
  recaptcha: {
    siteKey: string;
    secretKey: string;
  };
<<<<<<< HEAD
=======
  analytics: {
    measurementId: string;
    disabled?: boolean;
  };
>>>>>>> e5e19c510f9e5754f29a70d82f406e422fe4379f
}

export const config: AppConfig = {
  api: {
<<<<<<< HEAD
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.createathon.co',
    endpoints: {
      newsletterSubscribe: import.meta.env.VITE_NEWSLETTER_SUBSCRIBE_ENDPOINT || '/newsletter/subscribe',
      newsletterUnsubscribe: import.meta.env.VITE_NEWSLETTER_UNSUBSCRIBE_ENDPOINT || '/newsletter/unsubscribe',
      email: import.meta.env.VITE_EMAIL_ENDPOINT || '/v0/api/mail/send-email',
    }
  },
  recaptcha: {
    siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LcdGRgrAAAAAIU-zzCAQN2GrwPnqS6mrVtjUb6v',
    secretKey: import.meta.env.VITE_RECAPTCHA_SECRET_KEY || '6LcdGRgrAAAAACrE4X0QWkAWCKr2dI70Lka_KiYk',
=======
    baseUrl: import.meta.env.VITE_API_BASE_URL || "https://api.createathon.co",
    endpoints: {
      newsletterSubscribe:
        import.meta.env.VITE_NEWSLETTER_SUBSCRIBE_ENDPOINT ||
        "/newsletter/subscribe",
      newsletterUnsubscribe:
        import.meta.env.VITE_NEWSLETTER_UNSUBSCRIBE_ENDPOINT ||
        "/newsletter/unsubscribe",
      email: import.meta.env.VITE_EMAIL_ENDPOINT || "/v0/api/mail/send-email",
    },
  },
  recaptcha: {
    siteKey:
      import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
      "6LcdGRgrAAAAAIU-zzCAQN2GrwPnqS6mrVtjUb6v",
    secretKey:
      import.meta.env.VITE_RECAPTCHA_SECRET_KEY ||
      "6LcdGRgrAAAAACrE4X0QWkAWCKr2dI70Lka_KiYk",
  },
  analytics: {
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || "G-KJ6R7GQLGJ",
    disabled: import.meta.env.VITE_DISABLE_ANALYTICS === "true" || false,
>>>>>>> e5e19c510f9e5754f29a70d82f406e422fe4379f
  },
  // Add any other configuration categories as needed
};

<<<<<<< HEAD
// For debugging in development
if (import.meta.env.DEV) {
  console.log('App config:', config);
}

export default config; 
=======
// Export the configuration
export default config;
>>>>>>> e5e19c510f9e5754f29a70d82f406e422fe4379f
