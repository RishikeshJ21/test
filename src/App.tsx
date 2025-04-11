 

import { useEffect, useState } from 'react';
import Hero from './Components/Hero';

import { FAQSection } from './Components/FAQSection/FAQSection';
import ImageCollage from './Components/ImageCollage';
import { HowItWorkSection3 } from './Components/HowItWorkSection/HowItWork3';
import HowItWorks from './Components/HowItWorkSection/HowItWorks';
import { ReadyToGrow } from './Components/ReadyToGrow/ReadyToGrow';
import { Footer } from './Components/Footer/Footer';
import { NavigationSection } from './Components/NavigationSection/NavigationSection';
import { WhyChooseUsSection } from './Components/WhyChooseUsSection/WhyChooseUsSection';
import { TrustByCreatorSection } from './Components/TrustByCreatorSection/TrustByCreatorSection';

export default function Home() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (window.innerWidth < 768) { // Only for mobile devices
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setShowNavbar(false); // Hide navbar on scroll down
        } else {
          setShowNavbar(true); // Show navbar on scroll up
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <main className="overflow-x-hidden">
      {/* Navigation */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 md:bg-gray-50/100 backdrop-blur-md transition-transform duration-300 ${
          showNavbar ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <NavigationSection />
      </div>

      {/* Main content with proper spacing for fixed header */}
      <div className="pt-10 md:pt-12">
        <Hero
          title={{
            t1: "Unleash Your",
            t2: "Creative",
            t3: "Potential with",
            t4: "Createathon",
          }}
          description="Level up your content creation journey with tools, tutorials, and collaboration opportunities—all for free!"
          buttonText="Join Createathon Now"
        />

        {/* Image Collage with explicit height */}
        <div className="w-full mx-auto px-1 max-h-[320px] md:max-h-[360px] sm:px-3 lg:px-23">
          <ImageCollage />
        </div>

        <section className="hidden lg:block w-full max-w-8xl mx-auto px-4 max-h-[810px] sm:px-6 md:mt-15 lg:px-23 lg:pt-10">
          <HowItWorkSection3 />
        </section>

        <section className="w-full lg:hidden max-w-8xl mx-auto px-1 max-h-[480px] sm:px-2 md:mt-18 lg:px-23 lg:py-29">
          <HowItWorks />
        </section>

        {/* Why Choose Us Section with Card Hover Effect */}
        <section
          className="w-full  max-w-8xl mx-auto px-4 sm:px-6 lg:px-28 mt-12 mb-16"
          id="why-choose-us"
        >
          <WhyChooseUsSection />
        </section>

        <section className="w-full  max-w-8xl overflow-hidden md:mx-auto md:px-3 mb-2 md:mb-1">
          <TrustByCreatorSection />
        </section>

        <ReadyToGrow />

        {/* FAQ Section with debug styling */}
        <div className="w-full">
          <FAQSection />
        </div>

        <div className="w-full">
          <Footer />
        </div>
      </div>
    </main>
  );
}









// import Hero from './SubComponents/Hero'
// import ImageCollage from './SubComponents/ImageCollage'


// import { NavigationSection } from './screens/NavigationSection'
// import { HowItWorkSection } from './screens/HowItWorkSection'
// import { WhyChooseUsSection } from './screens/WhyChooseUsSection'
// import { DivWrapperByAnima } from './screens/DivWrapperByAnima'
// import { TrustByCreatorSection } from './screens/TrustByCreatorSection'

// import { Footer } from './screens/Footer'
// import { FAQSection } from './screens/FAQSection/FAQSection'




// export default function Home() {
//   return (
//     <main className="overflow-x-hidden bg-gray-100 ">
//       {/* Navigation */}
//       <div className="fixed top-0 left-0 right-0 z-50 bg-gray-50/100 backdrop-blur-md  ">

//         <NavigationSection />
//       </div>

//       {/* Main content with proper spacing for fixed header */}
//       <div className="pt-12">
//         <Hero
//           title={{
//             t1: "Unleash Your",
//             t2: "Creative",
//             t3: "Potential with",
//             t4: "Createathon"
//           }}
//           description="Level up your content creation journey with tools, tutorials, and collaboration opportunities—all for free!"
//           buttonText="Join Createathon Now"
//         />

//         {/* Image Collage with explicit height */}
//         <div className="w-full ">
//           <ImageCollage />
//         </div>

//         <section className="w-full max-w-8xl mx-auto px-4 max-h-[500px] sm:px-6  md:pt-18 lg:px-23 ">
//           <HowItWorkSection />
//         </section>

//         {/* Why Choose Us Section with Card Hover Effect */}
//         <section className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-28 mt-8 mb-16" id="why-choose-us">
//           <WhyChooseUsSection />
//         </section>

//         <section className="w-full mx-auto px-3  mb-2 md:mb-1 ">
//           <TrustByCreatorSection />
//         </section>

//         <DivWrapperByAnima />

//         {/* FAQ Section with debug styling */}
//         <div className="w-full    ">
//           <FAQSection />
//         </div>

//         {/* <TestimonialsSection /> */}
//         {/* <CTASection /> */}
//         <Footer />
//       </div>
//     </main>
//   )
// }
