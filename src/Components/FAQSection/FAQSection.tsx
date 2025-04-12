import { JSX, useState } from "react";
import { motion } from "framer-motion";
import { faqItems } from "../../data/FAQData";
import { ChevronDownIcon, Mail, MinusCircle  } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  }
};

export const FAQSection = (): JSX.Element => {
  // Track which FAQ item is currently open
  const [openItem, setOpenItem] = useState<string | null>("");

  // Handle accordion state
  const handleAccordionChange = (value: string) => {
    // If the same item is clicked, close it
    if (value === openItem) {
      setOpenItem(null);
    } else {
      // Otherwise, open the clicked item and close others
      setOpenItem(value);
    }
  };

  return (
    <section id="FAQs" className="w-full overflow-hidden">
      <div className={`max-w-8xl mx-auto md:px-27 ${window.innerWidth > 1500 && 'px-29'} px-6 md:py-10 w-full`}>
        {/* Header - Same structure as TrustByCreatorSection */}
        <div className={`mb-1 ${window.innerWidth > 1500 && 'pl-2'} md:mb-8`}>
          <h2 className="group font-[&apos;Instrument_Sans&apos;,Helvetica] font-bold text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight inline-block">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Questions</span>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500"></span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-full text-lg">
            Everything you need to know about Createathon
          </p>
        </div>

        {/* FAQ Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 mt-8 md:mt-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {faqItems.map((faq, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className={`bg-white rounded-xl ${
                openItem === `faq-${index}`
                  ? 'ring-2 ring-purple-300 border border-purple-300 shadow-md'
                  : 'border border-gray-200 hover:border-gray-300'
              } transition-all duration-200`}
              style={{ height: "fit-content" }} 
            >
              <div className="w-full overflow-hidden rounded-xl">
                <div className="border-none">
                  <button 
                    onClick={() => handleAccordionChange(`faq-${index}`)}
                    className={`px-6 py-5 hover:no-underline focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-inset w-full text-left transition-colors duration-200 ${
                      openItem === `faq-${index}` ? 'bg-purple-50/30 rounded-t-xl' : 'hover:bg-gray-50 rounded-xl'
                    }`}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-600 font-medium">
                        {index + 1}
                      </div>
                      <span className="font-['Instrument_Sans',Helvetica] font-medium text-gray-900 text-lg sm:text-xl leading-tight text-left">
                        {faq.question}
                      </span>
                      {faq.defaultOpen && (
                        <span className="ml-auto mr-6 px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full whitespace-nowrap">
                          Popular
                        </span>
                      )}
                      <div className="ml-auto flex-shrink-0">
                        {openItem === `faq-${index}` ? (
                          <MinusCircle className="h-5 w-5 text-purple-600 shrink-0" />
                        ) : (
                          <ChevronDownIcon
                            className="h-5 w-5 text-purple-600 transition-transform duration-200"
                          />
                        )}
                      </div>
                    </div>
                  </button>

                  {openItem === `faq-${index}` && (
                    <motion.div 
                      className="px-6 pb-6"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="pl-14">
                        <div className="h-px bg-gray-200 my-4" />
                        <p className="font-['Instrument_Sans',Helvetica] text-gray-700 text-base leading-relaxed">
                          {faq.answer}
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <span className="text-sm text-gray-500">Was this helpful?</span>
                          <button 
                            className="p-1.5 rounded-full hover:bg-gray-100" 
                            aria-label="Yes, this was helpful"
                          >
                            👍
                          </button>
                          <button 
                            className="p-1.5 rounded-full hover:bg-gray-100" 
                            aria-label="No, this was not helpful"
                          >
                            👎
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact CTA */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-20 rounded-full transform translate-x-1/2 -translate-y-1/2" />
          <div className="text-center sm:text-left relative z-10">
            <h3 className="text-white text-2xl font-bold mb-3">Still have questions?</h3>
            <p className="text-gray-300 text-lg">
              We're here to help you with any questions you might have
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="mailto:createathon@persistventures.com"
              className="relative z-10 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-400 text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2"
            >
              <Mail className="h-5 w-5" />
              Contact Us
            </a>
          </motion.div>
        </div>

       
      </div>
    </section>
  );
};











// import { JSX, useState } from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../../SubComponents/accordion";
// import { faqItems } from "../../data/FAQData";
// import { ChevronDownIcon } from "lucide-react";

// export const FAQSection = (): JSX.Element => {
//   // Set first FAQ open by default
//   const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
//     'item-0': true
//   });

//   // Handle accordion state
//   const handleAccordionChange = (value: string, index: number) => {
//     setExpandedItems(prev => {
//       const newState = { ...prev };
//       // Close all other items
//       Object.keys(newState).forEach(key => {
//         newState[key] = false;
//       });
//       // Toggle the clicked item
//       newState[`item-${index}`] = value === `item-${index}`;
//       return newState;
//     });
//   };

//   return (
//     <section id="#FAQs" className="w-full overflow-hidden">
//       <div className="max-w-8xl mx-auto md:px-29 px-6 md:py-10 w-full">
//         {/* Header - Same structure as TrustByCreatorSection */}
//         <div className="mb-1 md:mb-8">
//           <h2 className="group font-[&apos;Instrument_Sans&apos;,Helvetica] font-bold text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight inline-block">
//             Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Questions</span>
//             <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500"></span>
//           </h2>
//           <p className="mt-4 text-gray-600 max-w-full text-lg">
//             Everything you need to know about Createathon
//           </p>
//         </div>

//         {/* FAQ Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 mt-8 md:mt-4">
//           {faqItems.map((item, index) => (
//             <div
//               key={`faq-${index}`}
//               className={`bg-white rounded-xl ${
//                 expandedItems[`item-${index}`]
//                   ? 'border border-purple-300'
//                   : 'border border-gray-200'
//               }`}
//             >
//               <Accordion
//                 type="single"
//                 collapsible
//                 className="w-full"
//                 value={expandedItems[`item-${index}`] ? `item-${index}` : undefined}
//                 onValueChange={(value) => handleAccordionChange(value, index)}
//               >
//                 <AccordionItem value={`item-${index}`} className="border-none">
//                   <AccordionTrigger 
//                     className="px-6 py-5 hover:no-underline focus:outline-none rounded-t-xl"
//                   >
//                     <div className="flex items-center gap-4 w-full">
//                       <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-600">
//                         {index + 1}
//                       </div>
//                       <span className="font-['Instrument_Sans',Helvetica] font-medium text-gray-900 text-lg sm:text-xl leading-tight text-left">
//                         {item.question}
//                       </span>
//                       {item.defaultOpen && (
//                         <span className="ml-auto mr-6 px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full whitespace-nowrap">
//                           Popular
//                         </span>
//                       )}
//                       <ChevronDownIcon
//                         className={`h-5 w-5 text-purple-600 transition-transform duration-200 ${
//                           expandedItems[`item-${index}`] ? 'rotate-180' : ''
//                         }`}
//                       />
//                     </div>
//                   </AccordionTrigger>

//                   <AccordionContent className="px-6 pb-6">
//                     <div className="pl-14">
//                       <div className="h-px bg-gray-200 my-4" />
//                       <p className="font-['Instrument_Sans',Helvetica] text-gray-700 text-base leading-relaxed">
//                         {item.answer}
//                       </p>
//                       <div className="mt-4 flex items-center gap-2">
//                         <span className="text-sm text-gray-500">Was this helpful?</span>
//                         <button 
//                           className="p-1.5 rounded-full hover:bg-gray-100" 
//                           aria-label="Yes, this was helpful"
//                         >
//                           👍
//                         </button>
//                         <button 
//                           className="p-1.5 rounded-full hover:bg-gray-100" 
//                           aria-label="No, this was not helpful"
//                         >
//                           👎
//                         </button>
//                       </div>
//                     </div>
//                   </AccordionContent>
//                 </AccordionItem>
//               </Accordion>
//             </div>
//           ))}
//         </div>

//         {/* Contact CTA */}
//         <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-lg relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-20 rounded-full transform translate-x-1/2 -translate-y-1/2" />
//           <div className="text-center sm:text-left relative z-10">
//             <h3 className="text-white text-2xl font-bold mb-3">Still have questions?</h3>
//             <p className="text-gray-300 text-lg">
//               We're here to help you with any questions you might have
//             </p>
//           </div>
//           <a
//             href="#contact"
//             className="relative z-10 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-400 text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-all duration-200 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900"
//           >
//             Contact Us
//           </a>
//         </div>

//         {/* Back to top button */}
//         <div className="flex justify-center mt-10">
//           <button
//             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//             className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
//             aria-label="Scroll to top"
//           >
//             <ChevronDownIcon className="h-4 w-4 transform rotate-180" />
//             Back to top
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };


















// "use client";

// import  { JSX } from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../../SubComponents/accordion";
// import { faqItems } from "../../data/FAQData";
 
 

// export const FAQSection = (): JSX.Element => {
//   return (
//     <section className="flex flex-col gap-6 sm:gap-8 py-10 sm:py-12 md:py-10 w-full max-w-[94%] md:max-w-[88%] mx-auto px-4 sm:px-6 md:px-8">
//       {/* Heading - Full width on small screens */}
//       <div className="flex w-full max-w-[90%]">
//         <h2 className="font-['Instrument_Sans',Helvetica] font-semibold text-black text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight sm:leading-snug md:leading-[84px]">
//           Frequently Asked Questions
//         </h2>
//       </div>

//       {/* FAQ content - Always use accordion */}
//       <div className="w-full">
//         <div className="flex flex-col w-full gap-4">
//           <Accordion type="single" collapsible>
//             {faqItems.map((item, index) => (
//               <AccordionItem
//                 key={`item-${index}`}
//                 value={`item-${index}`}
//                 className="bg-white rounded-xl border border-solid border-[#22222240] mb-3 sm:mb-4 overflow-hidden"
//               >
//                 <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-6 hover:no-underline">
//                   <span className="font-['Instrument_Sans',Helvetica] font-medium text-black text-lg sm:text-xl md:text-2xl leading-tight sm:leading-[30px] text-left">
//                     {item.question}
//                   </span>
//                 </AccordionTrigger>

//                 <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
//                   <hr className="my-4 border-t border-gray-300" />
//                   <p className="font-['Instrument_Sans',Helvetica] font-medium text-[#222222] text-sm sm:text-base leading-relaxed sm:leading-6">
//                     {item.answer}
//                   </p>
//                 </AccordionContent>
//               </AccordionItem>
//             ))}
//           </Accordion>
//         </div>
//       </div>
//     </section>
//   );
// };
