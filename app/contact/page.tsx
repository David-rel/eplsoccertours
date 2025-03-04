import Image from "next/image";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Initialize Font Awesome
config.autoAddCss = false; // Tell Font Awesome to skip adding CSS automatically since we imported the CSS file above

const Contact = () => {
  return (
    <>
      <div className="pt-12 pb-12">
        <h1 className="container mx-auto px-4 text-4xl md:text-5xl lg:text-6xl text-center tracking-wider leading-relaxed flex flex-col gap-6 mb-16">
          <span>Get In Touch!</span>
        </h1>
        <h1 className="container mx-auto px-4 text-xl max-w-3xl text-center tracking-wider leading-relaxed flex flex-col gap-6 mb-16">
          <span>
            Have questions or want to learn more about our programs? Contact us
            today to speak with our dedicated team.
          </span>
        </h1>
      </div>

      <div className="min-h-screen flex">
        {/* Left side - Image */}
        <div className="hidden md:block w-1/2 relative">
          <Image
            src="/contact/contact.png"
            alt="Soccer player kicking ball"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 bg-[#E5E5E5] p-8 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-16">
            <div className="flex justify-between items-center">
              <a
                href="mailto:eplsoccertours@outlook.com"
                className="text-black underline text-lg"
              >
                eplsoccertours@outlook.com
              </a>
              <span className="text-black text-lg">706-910-7073</span>
            </div>

            <form className="space-y-16">
              <div className="space-y-16">
                <div className="space-y-2">
                  <label className="block text-black text-lg">First Name</label>
                  <input
                    type="text"
                    className="w-full pb-2 bg-transparent border-b border-black focus:outline-none text-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-black text-lg">Last Name</label>
                  <input
                    type="text"
                    className="w-full pb-2 bg-transparent border-b border-black focus:outline-none text-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-black text-lg">Email *</label>
                  <input
                    type="email"
                    className="w-full pb-2 bg-transparent border-b border-black focus:outline-none text-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-8">
                  <button
                    type="submit"
                    className="w-48 bg-[#607D8B] text-white py-3 text-lg"
                  >
                    Submit
                  </button>
                  <div className="flex gap-4">
                    <a
                      href="https://www.facebook.com/epl.soccer.llc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#607D8B] text-3xl p-2 hover:text-[#4a636e] transition-colors"
                    >
                      <FontAwesomeIcon icon={faFacebookF} className="w-6 h-6" />
                    </a>
                    <a
                      href="https://www.instagram.com/eplsoccerllc/#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#607D8B] text-3xl p-2 hover:text-[#4a636e] transition-colors"
                    >
                      <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
            </form>

            <p className="text-center text-black text-lg">
              If you have not received a reply within 24 hours
              <br />
              please call or text 706-910-7073
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
