import { useEffect, useState,useRef } from 'react';
 
import Hero from './Components/Hero';

import { FAQSection } from './Components/FAQSection/FAQSection';
import ImageCollage from './Components/ImageCollage';
import { HowItWorkSection3 } from './Components/HowItWorkSection/HowItWork3';
import HowItWorks from './Components/HowItWorkSection/HowItWorks';
 
import { Footer } from './Components/Footer/Footer';
import { NavigationSection } from './Components/NavigationSection/NavigationSection';
import { WhyChooseUsSection } from './Components/WhyChooseUsSection/WhyChooseUsSection';
import { TrustByCreatorSection } from './Components/TrustByCreatorSection/TrustByCreatorSection';
import { ReadyToGrow2 } from './Components/ReadyToGrow/RTG2';
import { motion } from 'framer-motion';


export default function Home() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [howItWorksVisible, setHowItWorksVisible] = useState(false);
  const howItWorksRef = useRef<HTMLDivElement>(null);

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

      // Check if how-it-works section is in viewport for large devices
      if (window.innerWidth >= 1024 && howItWorksRef.current) {
        const rect = howItWorksRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0) {
          setHowItWorksVisible(true);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    // Setup smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <main className="overflow-x-hidden">
      {/* Navigation */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 md:bg-gray-50/100 md:backdrop-blur-md transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <NavigationSection />
      </div>

      {/* Main content with proper spacing for fixed header */}
      <div className={`pt-10 lg:pt-12 ${typeof window !== 'undefined' && window.innerWidth > 710 && window.innerWidth < 900 ? "pt-0" : ""}`}>
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
        <div className="w-full mx-auto px-1 max-h-[320px] md:max-h-[450px] sm:px-3 lg:px-23">
          <ImageCollage />
        </div>

        <div 
          ref={howItWorksRef}
          id="how-it-works" 
          className="hidden lg:block w-full max-w-8xl mx-auto px-4 max-h-[810px] sm:px-6 md:mt-1 lg:px-23 scroll-mt-24"
        >
          <motion.section
            initial={{ x: 100, y: 20, opacity: 0 }}
            animate={howItWorksVisible ? { x: 0, y: 0, opacity: 1 } : { x: 100, y: 40, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <HowItWorkSection3 />
          </motion.section>
        </div>

        <section id="how-it-works-mobile" className="w-full lg:hidden max-w-8xl mx-auto px-1 max-h-[480px] mb-20 sm:px-2 md:mt-18 lg:px-23 lg:py-29 scroll-mt-16">
          <HowItWorks />
        </section>

        {/* Why Choose Us Section with Card Hover Effect */}
        <section
          className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-28 mt-12 mb-16 scroll-mt-24"
          id="why-choose-us"
        >
          <WhyChooseUsSection />
        </section>

        <section id="Testimonials" className="w-full max-w-8xl overflow-hidden md:mx-auto md:px-3 mb-2 md:mb-1 scroll-mt-20">
          <TrustByCreatorSection />
        </section>

        {/* Ready to Grow Section */}
        <div id="ready-to-grow" className="scroll-mt-16">
          <ReadyToGrow2 />
        </div>

        {/* FAQ Section */}
        <div id="FAQs" className="w-full mt-10 md:mt-0 scroll-mt-28">
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
