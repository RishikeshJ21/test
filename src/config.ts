/**
 * Application configuration
 * This file centralizes access to environment variables
 *
 * Environment variables are loaded from:
 * 1. .env file during development
 * 2. Built into the application during the build process
 * 3. From web.config via IIS environment variables in production
 *
 * Usage:
 * import config from './config';
 *
 * // Access API endpoint
 * fetch(`${config.api.baseUrl}${config.api.endpoints.email}`);
 *
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
    };
  };
  recaptcha: {
    siteKey: string;
    secretKey: string;
  };
}

export const config: AppConfig = {
  api: {
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
  // Add any other configuration categories as needed
};

// Export the configuration
export default config;
