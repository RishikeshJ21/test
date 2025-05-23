import { useState, FormEvent, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import config from '../config';
import { handleRecaptchaError } from '../lib/recaptchaUtils';

type FormState = {
  name: string;
  email: string;
  message: string;
};

export const ContactForm = () => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [captchaLoaded, setCaptchaLoaded] = useState(true);

  // Listen for reCAPTCHA load errors from window
  useEffect(() => {
    const handleWindowRecaptchaError = () => {
      handleRecaptchaError(setSubmitError, setCaptchaLoaded);
    };

    // Listen for the custom event we set up in index.html
    window.addEventListener('recaptcha-load-error', handleWindowRecaptchaError);

    return () => {
      window.removeEventListener('recaptcha-load-error', handleWindowRecaptchaError);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token || '');
    if (token) {
      setSubmitError(''); // Clear captcha errors when completed
    }
  };

  // Handle captcha load error
  const handleCaptchaError = () => {
    handleRecaptchaError(setSubmitError, setCaptchaLoaded);
  };

  // Handle retrying captcha load
  const retryCaptcha = () => {
    setCaptchaLoaded(true);
    setSubmitError('');
    
    // The simplest and most reliable solution is to reload the page
    window.location.reload();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!recaptchaToken) {
      setSubmitError('Please complete the reCAPTCHA verification');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Example of using config to access API endpoints
      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitError('Failed to send your message. Please try again later.');
      console.error('Contact form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
      
      {submitSuccess ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Thank you for your message! We'll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            {captchaLoaded ? (
              <ReCAPTCHA
                sitekey={config.recaptcha.siteKey}
                onChange={handleRecaptchaChange}
                onErrored={handleCaptchaError}
                onExpired={() => {
                  setRecaptchaToken('');
                }}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 p-4 border border-red-200 rounded-md bg-red-50">
                <p className="text-red-600 text-sm">Captcha failed to load.</p>
                <button 
                  type="button"
                  onClick={retryCaptcha}
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                >
                  Retry Captcha
                </button>
              </div>
            )}
          </div>
          
          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {submitError}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm; 