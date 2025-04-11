
import  { JSX } from "react";
 

export const Footer = (): JSX.Element => {
  const navigationLinks = {
    company: [
      { text: "Home", href: "/" },
      { text: "Our Team", href: "https://persistventures.com/our-team" },
      { text: "About Us", href: "#about" },
      { text: "Contact", href: "mailto:createathon@persistventures.com" },
    ],
    resources: [
      { text: "Startup Accelerator", href: "https://persistventures.com/apply-to-accelerator" },
      { text: "Career Accelerator", href: "https://devscareeraccelerator.com/" },
      { text: "Investor Application", href: "https://persistventures.com/investor-application" },
      { text: "Job Application", href: "https://persistventures.com/apply-for-a-full-time-position" },
    ],
    legal: [
      { text: "Terms & Conditions", href: "https://persistventures.com/terms-of-service" },
      { text: "Privacy Policy", href: "https://persistventures.com/privacy-policy" },
      { text: "Cookie Policy", href: "https://dia.wiki/" },
    ],
    };

  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <a href="https://x.com/Startupthon_" className="text-gray-500 hover:text-purple-600">
                <span className="sr-only">X (Twitter)</span>
                <svg className="h-6 w-6 sm:h-9 sm:w-9" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/creataethon" className="text-gray-500 hover:text-purple-600">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6 sm:h-8 sm:w-8 mt-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/createathon._/" className="text-gray-500 hover:text-purple-600">
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
                    <a href={link.href} className="text-base text-gray-600 hover:text-purple-600">
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
                    <a href={link.href} className="text-base text-gray-600 hover:text-purple-600">
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
                    <a href={link.href} className="text-base text-gray-600 hover:text-purple-600">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a href="https://dia.wiki/" className="text-purple-600 hover:text-purple-500 text-base font-medium">
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
                      Want to stay updated? <a href="#newsletter" className="font-medium text-purple-700 underline">Subscribe to our newsletter</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};























// import   { JSX } from "react";
// import { Separator } from "../../SubComponents/separator";
 

// export const Footer = (): JSX.Element => {
//   const navigationLinks = {
//     column1: [
//       { text: "Home" },
//       { text: "Investor Application" },
//       { text: "Job Application" },
//       { text: "Apply To Startup Accelerator" },
//       { text: "Career Accelerator Program" },
//       { text: "Our team" },
//     ],
//     column2: [
//       { text: "Terms & Conditions" },
//       { text: "Privacy Policy" },
//       { text: "Decentralized intellengence Agency" },
//     ],
//   };

//   const socialIcons = [
//     { src: "/group-2.png", alt: "Social media icon" },
//     { src: "/group-4.png", alt: "Social media icon" },
//     { src: "/group-3.png", alt: "Social media icon", isBackground: true },
//   ];

//   return (
//     <footer className="flex flex-col w-full items-start mx-auto py-10 md:py-16 px-5 sm:px-8 md:px-12">
//       <div className="flex flex-col md:flex-row items-start justify-between w-full max-w-[94%] md:max-w-[88%] mx-auto gap-8 md:gap-12">
//         {/* Logo and description section */}
//         <div className="flex flex-col w-full md:w-[423px] items-start gap-4 md:gap-6">
//           <div className="relative w-[200px] sm:w-[244.23px] h-[40px] sm:h-[47px]">
//             <img
//               className="absolute w-9 sm:w-11 h-[40px] sm:h-[47px] top-0 left-0"
//               alt="Group"
//               src="/Logotype.svg"
//               width={244.23}
//               height={47}
//             />
//             {/* <img
//               className="absolute w-[160px] sm:w-[190px] h-[20px] sm:h-[23px] top-2.5 sm:top-3 left-[44px] sm:left-[54px]"
//               alt="Group"
//               src="/Logotype.svg"
//               width={190}
//               height={23}
//             /> */}
//           </div>

//           <div className="flex flex-col items-start gap-3 w-full">
//             <p className="w-full font-medium text-[#222222] text-sm sm:text-base leading-5 sm:leading-6 font-sans">
//               We partner with entrepreneurs and businesses to help scale and
//               grow their ideas. With a diverse team skilled in every sector
//               there is no business we can not help get a leg up.
//             </p>
//           </div>

//           {/* Only show these links on small screens */}
//           <div className="flex flex-col w-full sm:hidden items-start gap-3 mt-2">
//             <ul className="w-full">
//               {navigationLinks.column2.map((link, index) => (
//                 <li key={index} className="w-full">
//                   <a
//                     href="#"
//                     className="flex items-center gap-2 px-0 py-1.5 w-full font-normal text-[#111111] text-sm leading-5 hover:text-gray-700"
//                   >
//                     {link.text}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Navigation links - hidden on mobile */}
//         <nav className="hidden sm:flex flex-row w-full md:w-[617px] items-start justify-between gap-8 sm:gap-[35px]">
//           <div className="flex flex-col w-1/2 md:w-auto items-start gap-1">
//             <ul className="w-full">
//               {navigationLinks.column1.map((link, index) => (
//                 <li key={index} className="w-full">
//                   <a
//                     href="#"
//                     className="flex items-center gap-2 px-0 py-1 w-full font-normal text-[#111111] text-sm sm:text-base leading-[22px] hover:text-gray-700"
//                   >
//                     {link.text}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="flex flex-col w-1/2 md:w-auto items-start gap-1">
//             <ul className="w-full">
//               {navigationLinks.column2.map((link, index) => (
//                 <li key={index} className="w-full">
//                   <a
//                     href="#"
//                     className="flex items-center gap-2 px-0 py-1 w-full font-normal text-[#111111] text-sm sm:text-base leading-[22px] hover:text-gray-700"
//                   >
//                     {link.text}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </nav>
//       </div>

//       {/* Bottom section with divider, copyright and social icons */}
//       <div className="flex flex-col items-center justify-between w-full max-w-[1184px] mx-auto mt-8 md:mt-[66px]">
//         <Separator className="w-full h-px bg-[#E0E0E0]" />

//         <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-6">
//           <p className="font-normal text-[#575757] text-sm sm:text-base text-center sm:text-left">
//             © 2025 persistventures.com. All rights reserved.
//           </p>

//           <div className="flex items-center gap-4 mt-6 sm:mt-0">
//             {socialIcons.map((icon, index) => (
//               <a
//                 key={index}
//                 href="#"
//                 className="flex items-center justify-center w-10 h-10 bg-white rounded-full border-2 border-solid shadow-[0px_5px_8px_#4b4b4b1a]"
//               >
//                 {icon.isBackground ? (
//                   <div className="w-3 h-3 bg-[url(/group-3.png)] bg-[100%_100%]" />
//                 ) : (
//                   <img
//                     className={index === 0 ? "w-3 h-3" : "w-4 h-2.5"}
//                     alt={icon.alt}
//                     src={icon.src}
//                     width={40}
//                     height={40}
//                   />
//                 )}
//               </a>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };
