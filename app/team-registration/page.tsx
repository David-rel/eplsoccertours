import Image from "next/image";
import React from "react";

const TeamRegistration = () => {
  return (
    <>
      <div className="bg-white pt-12 pb-12">
        <h1 className="container mx-auto px-4 text-4xl md:text-5xl lg:text-6xl text-center tracking-wider leading-relaxed flex flex-col gap-6 mb-16">
          <span>Welcome Team!</span>
        </h1>
        <h1 className="container mx-auto px-4 text-lg text-center tracking-wider leading-relaxed flex flex-col gap-6 mb-16">
          <span>Here's your third step.</span>
        </h1>
      </div>
      <div className="pt-12 pb-12">
        <h1 className="container mx-auto px-4 text-lg text-red-500 text-center tracking-wider leading-relaxed flex flex-col gap-6">
          <span>Notice</span>
        </h1>
        <h1 className="container mx-auto px-4 text-md text-center tracking-wider leading-relaxed flex flex-col gap-6 mb-16">
          <span>
            This registration is simply to receive emails, updates, and more
            information about the process.
          </span>
        </h1>
      </div>
      <div className="min-h-screen flex">
        {/* Left side - Image */}
        <div className="hidden md:block w-1/2 relative">
          <Image
            src="/contact/team.png"
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
                <button
                  type="submit"
                  className="w-48 bg-[#607D8B] text-white py-3 text-lg"
                >
                  Submit
                </button>
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

export default TeamRegistration;
