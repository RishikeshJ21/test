import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { NavigationSection } from '../../Components/NavigationSection/NavigationSection';
import BlogSection from '../../SubComponents/BlogSection';
import { ReadyToGrow2 } from '../../Components/ReadyToGrow/RTG2';
import { Footer } from '../../Components/Footer/Footer';


export default function BlogPage() {
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (window.innerWidth < 768) {
        setShowNavbar(currentScrollY <= lastScrollY.current || currentScrollY <= 100);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog - Stay Inspired & Ahead | Your Company Name</title>
        <meta
          name="description"
          content="Explore expert insights, creator tips, content strategies, industry trends, and success stories designed to fuel your growth. Stay inspired and ahead with our blog."
        />
        <meta
          name="keywords"
          content="creator tips, content strategy, industry trends, monetization hacks, success stories, blog, insights"
        />
      </Helmet>

      <motion.div
        className={`fixed top-0 left-0 right-0 z-50 md:bg-transparent md:backdrop-blur-md transition-transform duration-300 ${
          showNavbar ? 'translate-y-0' : '-translate-y-full'
        }`}
        initial={{ y: '-100%' }}
        animate={{ y: showNavbar ? '0%' : '-100%' }}
        transition={{ duration: 0.3 }}
      >
        <NavigationSection
          navItems={[
            { title: 'Blog', href: '#', active: true, offset: 0 },
            { title: 'Home', href: '/', active: false, offset: 0 },
            { title: 'Join Us', href: '#ready-to-grow', active: false, offset: -10 },
          ]}
        />
      </motion.div>

      <div className="pt-16 lg:pt-20">
      <section className="text-center py-12 md:py-20 bg-gradient-to-b from-purple-100 to-white">
          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-black px-4 break-words"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Stay <span className="text-purple-600">Inspired,</span> Stay{' '}
            <span className="text-purple-600">Ahead</span>
          </motion.h1>
          <motion.p
            className="max-w-2xl mx-auto text-base md:text-lg text-gray-700 px-4 break-words"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Level up your creator journey with actionable insights, cutting-edge strategies, and real-world success stories. Dive deep into industry trends, expert advice, and monetization secrets tailored just for you!
          </motion.p>
          <motion.a
            href="#blog-section"
            className="inline-block mt-6 bg-purple-600 text-white px-6 py-2 rounded-md shadow hover:bg-purple-700 transition duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Discover Insights
          </motion.a>
        </section>

        <div
          id="blog-section"
          className={` bg-gradient-to-b from-white to-purple-10 sm:max-w-[98%] max-w-[99%] ${window.innerWidth < 1600 ? "lg:max-w-[97%]" : "lg:max-w-[94%] "} mx-auto px-4 sm:px-6 lg:px-16 pt-1 lg:pt-12`}
        >
          <BlogSection />
        </div>

        <div id="ready-to-grow" className="scroll-mt-16 pl-2 max-w-[100%]">
          <ReadyToGrow2 />
        </div>

<div className={`${window.innerWidth < 1750 ? "ml-4" : "ml-15"}`} >
<Footer />

</div>
      </div>
    </>
  );
}












// import { useState, useEffect, useRef } from 'react';
// import { Helmet } from 'react-helmet-async'; // Import Helmet

// import { NavigationSection } from '../../Components/NavigationSection/NavigationSection';
// import Hero from '../../Components/Hero';
// import BlogSection from '../../SubComponents/BlogSection';
// import { ReadyToGrow2 } from '../../Components/ReadyToGrow/RTG2';
// import { Footer } from '../../Components/Footer/Footer';

// export default function BlogPage() {
//   const [showNavbar, setShowNavbar] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const headerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       if (window.innerWidth < 768) {
//         setShowNavbar(currentScrollY <= lastScrollY || currentScrollY <= 100);
//       }
//       setLastScrollY(currentScrollY);
//     };
//     window.addEventListener('scroll', handleScroll);
//     document.documentElement.style.scrollBehavior = 'smooth';
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [lastScrollY]);

//   return (
//     <>
//       <Helmet>
//         <title>Blog - Stay Inspired & Ahead | Your Company Name</title>
//         <meta name="description" content="Explore expert insights, creator tips, content strategies, industry trends, and success stories designed to fuel your growth. Stay inspired and ahead with our blog." />
//         <meta name="keywords" content="creator tips, content strategy, industry trends, monetization hacks, success stories, blog, insights" />
//         {/* Add other relevant meta tags like Open Graph, Twitter Cards etc. if needed */}
//       </Helmet>
//       <div
//         ref={headerRef}
//         className={`fixed top-0 left-0 right-0 z-50 md:bg-gray-50/100 md:backdrop-blur-md transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}
//       >
//         <NavigationSection navItems={[
//           { title: 'Home', href: '/', active: true, offset: 0 },
//           { title: 'Blog', href: '#', active: false, offset: 0 },
//           { title: "Join Us", href: "#ready-to-grow", active: false, offset: -10 },
//         ]} />
//       </div>
//       <div className="pt-10 lg:pt-12">
//         <Hero
//           title={{ t1: 'Stay', t2: 'Inspired,', t3: 'Stay', t4: 'Ahead' }}
//           description="
// Explore expert insights, creator tips, and success stories designed to fuel your growth. Whether you're looking for content strategies, industry trends, or monetization hacks—we've got you covered!"
//           buttonText="Read Latest Posts"
//         />
//         {/* Use a simpler consistent container for the BlogSection */}
//         <div className="w-full">
//           <BlogSection />
//         </div>
//         <div id="ready-to-grow" className="scroll-mt-16">
//           <ReadyToGrow2 />
//         </div>
//         <div className="w-full">
//           <Footer />
//         </div>
//       </div>
//     </>
//   );
// }