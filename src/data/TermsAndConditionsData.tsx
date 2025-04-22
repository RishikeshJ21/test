interface Section {
  title: string;
  content: string | string[];
}

interface TermsAndConditionsData {
  title: string;
  sections: Section[];
  lastUpdated: string;
}

const termsAndConditionsData: TermsAndConditionsData = {
  title: "Terms and Conditions",
  lastUpdated: "April 15, 2025",
  sections: [
    {
      title: "1. Introduction",
      content: "Welcome to Createathon (\"the App\"). By using our platform, you agree to abide by these Terms and Conditions. Please read them carefully before accessing or using our services."
    },
    {
      title: "2. Eligibility",
      content: [
        "You must be at least 13 years old to use the App. If you are under 18, you must have parental or guardian consent.",
        "By using the App, you confirm that you meet these requirements."
      ]
    },
    {
      title: "3. Account Registration",
      content: [
        "You must provide accurate and complete information during registration.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "Any unauthorized use of your account must be reported immediately."
      ]
    },
    {
      title: "4. Content Ownership & Usage",
      content: [
        "You retain ownership of any content you create and upload to the App.",
        "By posting content, you grant us a non-exclusive, royalty-free license to use, modify, distribute, and display your content within the App for promotional and operational purposes.",
        "You must not post content that is offensive, illegal, or violates intellectual property rights."
      ]
    },
    {
      title: "5. Prohibited Activities",
      content: [
        "Users may not:",
        "Use the App for illegal purposes or activities.",
        "Upload or distribute harmful, misleading, or inappropriate content.",
        "Violate any applicable laws or regulations.",
        "Engage in harassment, hate speech, or abuse of other users.",
        "Attempt to hack, disrupt, or compromise the security of the App."
      ]
    },
    {
      title: "6. Content Moderation",
      content: "We reserve the right to monitor, remove, or restrict content that violates our policies without prior notice. Users who repeatedly violate policies may face account suspension or termination."
    },
    {
      title: "7. Intellectual Property Rights",
      content: [
        "All trademarks, logos, and other proprietary content within the App are the property of Createathon or its licensors.",
        "Unauthorized reproduction, modification, or distribution of our intellectual property is strictly prohibited."
      ]
    },
    {
      title: "8. Termination of Account",
      content: [
        "We reserve the right to terminate or suspend accounts that violate these Terms and Conditions, without prior notice or liability.",
        "Users can request account deletion at any time by contacting support."
      ]
    },
    {
      title: "9. Limitation of Liability",
      content: [
        "We are not responsible for any damages, losses, or liabilities resulting from your use of the App.",
        "The App is provided \"as is\" without warranties of any kind, express or implied."
      ]
    },

    {
      title: "10. Telegram Mini App Integration",
      content: [
        "The App will also function as a Mini App on Telegram, allowing users to access features directly through the Telegram platform.",
        "Users accessing the App via Telegram agree to abide by both these Terms and Telegram's Terms of Service.",
        "Some features may require linking your Telegram account for authentication and personalized experience.",
        "Telegram data, such as username and profile picture, may be used within the App to enhance functionality."
      ]
    },
    // {
    //   title: "11. Changes to Terms and Privacy Policy",
    //   content: "We may update these Terms and Conditions or the Privacy Policy at any time. Continued use of the App after updates constitutes acceptance of the new terms."
    // },
    {
      title: "11. Governing Law",
      content: "These Terms shall be governed by and interpreted in accordance with the laws of Respective country."
    },
    {
      title: "12. Contact Information",
      content: "For questions or concerns regarding these Terms or Privacy Policy, please contact us at createathon@persistventures.com."
    }
  ]
};

export default termsAndConditionsData;