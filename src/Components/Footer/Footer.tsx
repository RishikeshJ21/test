import { JSX, useState } from "react";
import { toast, ToastContainer } from "react-toastify"; // Make sure you have react-toastify installed
import "react-toastify/dist/ReactToastify.css"; // Import CSS for react-toastify

// Define the Terms and Conditions text

 


export const Footer = (): JSX.Element => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Updated notify function to show the Terms and Conditions
  const notifyTerms = () => toast.info("🚀 Privacy Policy coming soon!", {position: "top-right", autoClose: 5000, theme: "light" });

  const navigationLinks = {
    company: [
      { text: "Home", href: "/" },
      // { text: "Our Team", href: "https://persistventures.com/our-team" },
      // { text: "Our Team", href: "#", onClick: () => toast.info("🚀 Our Team page coming soon!", { autoClose: 5000, theme: "light" }) } ,

      { text: "Contact", href: "mailto:createathon@persistventures.com" },
    ],
    resources: [
      { text: "Startup Accelerator", href: "https://persistventures.com/apply-to-accelerator" },
      { text: "Career Accelerator", href: "https://devscareeraccelerator.com/" },
      { text: "Investor Application", href: "https://persistventures.com/investor-application" },
    ],
    legal: [
      { text: "Terms & Conditions", href: "/terms-and-conditions" },
      // Updated Privacy Policy link to use notifyTerms
      { text: "Privacy Policy", href: "#", onClick: notifyTerms },
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Here you would typically send the email to your backend
    // For now, we'll just simulate a successful submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setEmail("");

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setShowForm(false);
      }, 3000);
    }, 1000);
  };

  return (
    <>
      {/* Add ToastContainer here, preferably at the root of your app or layout */}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <footer id="Footer" className="w-full border-t border-gray-200">
        <div className="max-w-8xl mx-auto md:px-29 px-6 py-12 w-full">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex">
                <div className="relative w-[180px] h-[36px]">
                  <img
                    className="absolute w-8 h-[36px] top-0 left-0"
                    alt="Logo icon"
                    src="/group.png"
                    width={36}
                    height={36}
                  />
                  <img
                    className="absolute w-[140px] h-[18px] top-2.5 left-[36px]"
                    alt="Logo text"
                    src="/group-1.png"
                    width={140}
                    height={18}
                  />
                </div>
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-6 max-w-xs">
                We partner with entrepreneurs and businesses to help scale and
                grow their ideas. With a diverse team skilled in every sector.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="https://x.com/createathon_" className="text-gray-500 hover:text-purple-600" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">X (Twitter)</span>
                  <svg className="h-6 w-6 sm:h-9 sm:w-9" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/creataethon" className="text-gray-500 hover:text-purple-600" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 mt-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/createathon._/" className="text-gray-500 hover:text-purple-600" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6 sm:h-9 sm:w-9" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>

              </div>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8 xl:mt-0 xl:col-span-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-3">
                  {navigationLinks.company.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="text-base text-gray-600 hover:text-purple-600" target="_blank" rel="noopener noreferrer">
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Resources
                </h3>
                <ul className="mt-4 space-y-3">
                  {navigationLinks.resources.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="text-base text-gray-600 hover:text-purple-600" target="_blank" rel="noopener noreferrer">
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-3">
                  {navigationLinks.legal.map((link, index) => (
                    <li key={index}>
                      {link.onClick ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault(); // Prevent default link behavior if href is '#'
                            link.onClick?.(); // Use optional chaining
                          }}
                          className="text-base text-gray-600 hover:text-purple-600 text-left"
                        >
                          {link.text}
                        </button>
                      ) : (
                        <a href={link.href} className="text-base text-gray-600 hover:text-purple-600" target="_blank" rel="noopener noreferrer">
                          {link.text}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <a href="https://dia.wiki/" className="text-purple-600 hover:text-purple-500 text-base font-medium" target="_blank" rel="noopener noreferrer">
                    Decentralized Intelligence Agency
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="md:flex md:items-center md:justify-between">
              <div className="mt-2 md:mt-0">
                <p className="text-sm text-gray-500">
                  &copy; 2025 persistventures.com. All rights reserved.
                </p>
              </div>

              <div className="mt-4 md:mt-0">
                <div className="rounded-md bg-purple-50 px-4 py-2">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                      <p className="text-sm text-purple-700">
                        Want to stay updated? <a href="#" onClick={(e) => { e.preventDefault(); setShowForm(true); }} className="font-medium text-purple-700 underline">Subscribe to our newsletter</a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Newsletter popup form */}
                {showForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Subscribe to our newsletter</h3>
                        <button
                          onClick={() => setShowForm(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {showSuccess ? (
                        <div className="bg-green-50 border border-green-200 rounded-md p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-green-800">
                                Thank you for subscribing!
                              </p>
                              <p className="mt-2 text-sm text-green-700">
                                We'll keep you updated with our latest news and offers.
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-500 mb-4">
                            Join our newsletter to receive updates on our latest projects, events, and opportunities.
                          </p>
                          <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                              </label>
                              <input
                                type="email"
                                id="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                              >
                                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                              </button>
                            </div>
                          </form>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
