"use client";

import  { JSX } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../SubComponents/accordion";
import { faqItems } from "../../data/FAQData";
 
 

export const FAQSection = (): JSX.Element => {
  return (
    <section className="flex flex-col gap-6 sm:gap-8 py-10 sm:py-12 md:py-10 w-full max-w-[94%] md:max-w-[88%] mx-auto px-4 sm:px-6 md:px-8">
      {/* Heading - Full width on small screens */}
      <div className="flex w-full max-w-[90%]">
        <h2 className="font-['Instrument_Sans',Helvetica] font-semibold text-black text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight sm:leading-snug md:leading-[84px]">
          Frequently Asked Questions
        </h2>
      </div>

      {/* FAQ content - Always use accordion */}
      <div className="w-full">
        <div className="flex flex-col w-full gap-4">
          <Accordion type="single" collapsible>
            {faqItems.map((item, index) => (
              <AccordionItem
                key={`item-${index}`}
                value={`item-${index}`}
                className="bg-white rounded-xl border border-solid border-[#22222240] mb-3 sm:mb-4 overflow-hidden"
              >
                <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-6 hover:no-underline">
                  <span className="font-['Instrument_Sans',Helvetica] font-medium text-black text-lg sm:text-xl md:text-2xl leading-tight sm:leading-[30px] text-left">
                    {item.question}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <hr className="my-4 border-t border-gray-300" />
                  <p className="font-['Instrument_Sans',Helvetica] font-medium text-[#222222] text-sm sm:text-base leading-relaxed sm:leading-6">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
