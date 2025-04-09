 
import   { JSX } from "react";
import { Separator } from "../../SubComponents/separator";
 

export const Footer = (): JSX.Element => {
  const navigationLinks = {
    column1: [
      { text: "Home" },
      { text: "Investor Application" },
      { text: "Job Application" },
      { text: "Apply To Startup Accelerator" },
      { text: "Career Accelerator Program" },
      { text: "Our team" },
    ],
    column2: [
      { text: "Terms & Conditions" },
      { text: "Privacy Policy" },
      { text: "Decentralized intellengence Agency" },
    ],
  };

  const socialIcons = [
    { src: "/group-2.png", alt: "Social media icon" },
    { src: "/group-4.png", alt: "Social media icon" },
    { src: "/group-3.png", alt: "Social media icon", isBackground: true },
  ];

  return (
    <footer className="flex flex-col w-full items-start mx-auto py-10 md:py-16 px-5 sm:px-8 md:px-12">
      <div className="flex flex-col md:flex-row items-start justify-between w-full max-w-[94%] md:max-w-[88%] mx-auto gap-8 md:gap-12">
        {/* Logo and description section */}
        <div className="flex flex-col w-full md:w-[423px] items-start gap-4 md:gap-6">
          <div className="relative w-[200px] sm:w-[244.23px] h-[40px] sm:h-[47px]">
            <img
              className="absolute w-9 sm:w-11 h-[40px] sm:h-[47px] top-0 left-0"
              alt="Group"
              src="/Logotype.svg"
              width={244.23}
              height={47}
            />
            {/* <img
              className="absolute w-[160px] sm:w-[190px] h-[20px] sm:h-[23px] top-2.5 sm:top-3 left-[44px] sm:left-[54px]"
              alt="Group"
              src="/Logotype.svg"
              width={190}
              height={23}
            /> */}
          </div>

          <div className="flex flex-col items-start gap-3 w-full">
            <p className="w-full font-medium text-[#222222] text-sm sm:text-base leading-5 sm:leading-6 font-sans">
              We partner with entrepreneurs and businesses to help scale and
              grow their ideas. With a diverse team skilled in every sector
              there is no business we can not help get a leg up.
            </p>
          </div>

          {/* Only show these links on small screens */}
          <div className="flex flex-col w-full sm:hidden items-start gap-3 mt-2">
            <ul className="w-full">
              {navigationLinks.column2.map((link, index) => (
                <li key={index} className="w-full">
                  <a
                    href="#"
                    className="flex items-center gap-2 px-0 py-1.5 w-full font-normal text-[#111111] text-sm leading-5 hover:text-gray-700"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Navigation links - hidden on mobile */}
        <nav className="hidden sm:flex flex-row w-full md:w-[617px] items-start justify-between gap-8 sm:gap-[35px]">
          <div className="flex flex-col w-1/2 md:w-auto items-start gap-1">
            <ul className="w-full">
              {navigationLinks.column1.map((link, index) => (
                <li key={index} className="w-full">
                  <a
                    href="#"
                    className="flex items-center gap-2 px-0 py-1 w-full font-normal text-[#111111] text-sm sm:text-base leading-[22px] hover:text-gray-700"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col w-1/2 md:w-auto items-start gap-1">
            <ul className="w-full">
              {navigationLinks.column2.map((link, index) => (
                <li key={index} className="w-full">
                  <a
                    href="#"
                    className="flex items-center gap-2 px-0 py-1 w-full font-normal text-[#111111] text-sm sm:text-base leading-[22px] hover:text-gray-700"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Bottom section with divider, copyright and social icons */}
      <div className="flex flex-col items-center justify-between w-full max-w-[1184px] mx-auto mt-8 md:mt-[66px]">
        <Separator className="w-full h-px bg-[#E0E0E0]" />

        <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-6">
          <p className="font-normal text-[#575757] text-sm sm:text-base text-center sm:text-left">
            © 2025 persistventures.com. All rights reserved.
          </p>

          <div className="flex items-center gap-4 mt-6 sm:mt-0">
            {socialIcons.map((icon, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center justify-center w-10 h-10 bg-white rounded-full border-2 border-solid shadow-[0px_5px_8px_#4b4b4b1a]"
              >
                {icon.isBackground ? (
                  <div className="w-3 h-3 bg-[url(/group-3.png)] bg-[100%_100%]" />
                ) : (
                  <img
                    className={index === 0 ? "w-3 h-3" : "w-4 h-2.5"}
                    alt={icon.alt}
                    src={icon.src}
                    width={40}
                    height={40}
                  />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
