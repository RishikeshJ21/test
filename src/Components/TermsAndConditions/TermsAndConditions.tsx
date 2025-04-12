import React from 'react';
import termsAndConditionsData from '../../data/TermsAndConditionsData';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 pb-12 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {termsAndConditionsData.title}
        </h1>
 
      </div>

      <div className="space-y-8">
        {termsAndConditionsData.sections.map((section, index) => (
          <div key={index} className="border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {section.title}
            </h2>
            {Array.isArray(section.content) ? (
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {section.content.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              section.title === "14. Contact Information" ? (
                <p className="text-gray-700 leading-relaxed">
                  For questions or concerns regarding these Terms or Privacy Policy, please contact us at{' '}
                  <a href="mailto:createathon@persistventures.com" className="text-purple-600 hover:text-purple-800 underline">
                    createathon@persistventures.com
                  </a>.
                </p>
              ) : (
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              )
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-8 mt-8 text-center">
        <p className="text-gray-600">
          By using Createathon, you acknowledge that you have read and understood these Terms and Conditions
          and agree to be bound by them.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;