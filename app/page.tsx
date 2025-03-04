import React from "react";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  const CheckIcon = () => (
    <svg
      className="w-8 h-8 text-green-500 mx-auto"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );

  const XIcon = () => (
    <svg
      className="w-8 h-8 text-red-500 mx-auto"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <>
      <h1 className="container mx-auto px-4 text-4xl md:text-5xl lg:text-7xl text-center tracking-wider leading-relaxed flex flex-col gap-6 mb-16">
        <span>EPL INTERNATIONAL</span>
        <span>PRO PLAYER</span>
        <span>EXPERIENCE (IPPE)</span>
      </h1>

      {/* Video Container with Overlay */}
      <div className="w-screen aspect-video mb-12 relative -mx-[calc((100vw-100%)/2)]">
        <iframe
          className="w-full h-full absolute inset-0"
          src="https://www.youtube.com/embed/Ee6GKar2eb0?si=SIzr_V6IjJDBMeyH&autoplay=1&mute=1&controls=0&loop=1&playlist=Ee6GKar2eb0"
          title="EPL International Pro Player Experience"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40">
          <button className="bg-white bg-opacity-80 hover:bg-opacity-100 text-black px-12 py-4 text-xl tracking-widest transition-all duration-300 mb-8 hover:transform hover:scale-105">
            Learn More About EPL International Pro Player Experience
          </button>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl text-white font-light tracking-wider text-center"
            style={{
              textShadow: `
                  2px 2px 0 #000,
                  -2px -2px 0 #000,
                  2px -2px 0 #000,
                  -2px 2px 0 #000,
                  0 2px 0 #000,
                  2px 0 0 #000,
                  0 -2px 0 #000,
                  -2px 0 0 #000,
                  2px 4px 5px rgba(0,0,0,0.5)
                `,
            }}
          >
            Experience Life as a Pro
          </h2>
        </div>
      </div>

      {/* Bottom Content */}
      <h2 className="container mx-auto px-4 text-xl md:text-3xl lg:text-5xl text-center tracking-wider leading-relaxed flex flex-col gap-6 mb-16 font-bold">
        <span>BEST DATES FOR 2025</span>
        <span>August 1st-10th</span>
        <span>August 8th-17th</span>
      </h2>
      <div className="flex justify-center mb-16">
        <button className="relative px-12 py-6 text-2xl tracking-widest text-white overflow-hidden transition-all duration-300 transform hover:scale-105 group border-2 border-transparent hover:border-black">
          <span className="relative z-10 group-hover:text-black transition-colors duration-300">
            START YOUR EXPERIENCE
          </span>
          <div
            className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
            style={{
              background: "linear-gradient(to bottom, #000000, #4a4a4a)",
            }}
          />
          <div className="absolute inset-0 opacity-0 bg-white transition-opacity duration-300 group-hover:opacity-100" />
        </button>
      </div>
      <h2 className="container mx-auto px-4 text-xl md:text-3xl lg:text-5xl text-center tracking-wider leading-relaxed flex flex-col gap-6 mb-8 font-bold">
        <span>Why EPL IPPE vs Competitors</span>
      </h2>

      {/* Comparison Table */}
      <div className="container mx-auto px-4 mb-16">
        <div className="max-w-5xl mx-auto overflow-hidden rounded-lg shadow-lg">
          {/* Table Header */}
          <div className="grid grid-cols-3 text-white">
            <div
              className="p-6 text-left"
              style={{
                background: "linear-gradient(to bottom, #000000, #4a4a4a)",
              }}
            >
              <span className="text-xl font-semibold"></span>
            </div>
            <div
              className="p-6 text-center border-l border-gray-600"
              style={{
                background: "linear-gradient(to bottom, #000000, #4a4a4a)",
              }}
            >
              <span className="text-xl font-semibold">
                EPL International Pro Player Experience
              </span>
            </div>
            <div
              className="p-6 text-center border-l border-gray-600"
              style={{
                background: "linear-gradient(to bottom, #000000, #4a4a4a)",
              }}
            >
              <span className="text-xl font-semibold">
                Competitor Experience
              </span>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {[
              {
                feature: "High-level Coaching from Academy Coaches",
                eplHas: true,
                competitorHas: true,
              },
              {
                feature: "Watch Live EPL Games",
                eplHas: true,
                competitorHas: true,
              },
              {
                feature: "Train WITH Professional Academy Players",
                eplHas: true,
                competitorHas: false,
              },
              {
                feature: "Parents Room With Their Players",
                eplHas: true,
                competitorHas: false,
              },
              {
                feature: "Parents Travel With Team",
                eplHas: true,
                competitorHas: false,
              },
              {
                feature: "Single Family Registration Available",
                eplHas: true,
                competitorHas: false,
              },
            ].map((row, index) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <div className="p-6 text-left">
                  <span className="text-lg font-medium text-gray-900">
                    {row.feature}
                  </span>
                </div>
                <div className="p-6 flex items-center justify-center border-l border-gray-200">
                  {row.eplHas ? <CheckIcon /> : <XIcon />}
                </div>
                <div className="p-6 flex items-center justify-center border-l border-gray-200">
                  {row.competitorHas ? <CheckIcon /> : <XIcon />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <h2 className="container mx-auto px-4 text-xl md:text-3xl lg:text-5xl text-center tracking-wider leading-relaxed flex flex-col gap-6 mb-16 font-bold">
        <span>Experience The Culture From Within</span>
      </h2>

      {/* Image Grid */}
      <div className="container mx-auto px-4 mb-16">
        <div className="max-w-5xl mx-auto flex justify-center gap-8">
          {/* First Image */}
          <div
            className="relative rounded-lg overflow-hidden shadow-xl w-[500px]"
            style={{ height: "400px" }}
          >
            <Image
              src="/front/image1.jpg"
              alt="Manchester United Stadium Experience"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Second Image */}
          <div
            className="relative rounded-lg overflow-hidden shadow-xl w-[500px]"
            style={{ height: "400px" }}
          >
            <Image
              src="/front/image2.jpg"
              alt="Manchester City Locker Room"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
      <h2 className="container mx-auto px-4 text-xl md:text-3xl lg:text-5xl text-center tracking-wider leading-relaxed flex flex-col gap-6 mb-16 font-bold">
        <span>Who Are You?</span>
      </h2>

      {/* Who Are You Grid */}
      <div className="container mx-auto px-4 mb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8">
          {/* Player Column */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/front/player.png"
                alt="Soccer Player"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h3 className="text-2xl font-bold tracking-wider">
              I am a Player!
            </h3>
            <Link
              href="/player-info"
              className="w-full border-2 border-black px-6 py-3 text-center text-lg tracking-wider hover:bg-black hover:text-white transition-all duration-300"
            >
              More Information
            </Link>
            <Link
              href="/player-experience"
              className="w-full border-2 border-black px-6 py-3 text-center text-lg tracking-wider hover:bg-black hover:text-white transition-all duration-300"
            >
              Start Your Experience
            </Link>
          </div>

          {/* Coach Column */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/front/coach.png"
                alt="Soccer Coach"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h3 className="text-2xl font-bold tracking-wider">I am a Coach!</h3>
            <Link
              href="/coach-info"
              className="w-full border-2 border-black px-6 py-3 text-center text-lg tracking-wider hover:bg-black hover:text-white transition-all duration-300"
            >
              More Information
            </Link>
            <Link
              href="/coach-experience"
              className="w-full border-2 border-black px-6 py-3 text-center text-lg tracking-wider hover:bg-black hover:text-white transition-all duration-300"
            >
              Start Your Experience
            </Link>
          </div>

          {/* Team Column */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/front/team.png"
                alt="Soccer Team"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h3 className="text-2xl font-bold tracking-wider">
              I have a Team!
            </h3>
            <Link
              href="/team-info"
              className="w-full border-2 border-black px-6 py-3 text-center text-lg tracking-wider hover:bg-black hover:text-white transition-all duration-300"
            >
              More Information
            </Link>
            <Link
              href="/team-experience"
              className="w-full border-2 border-black px-6 py-3 text-center text-lg tracking-wider hover:bg-black hover:text-white transition-all duration-300"
            >
              Start Your Experience
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mb-16 max-w-4xl">
        <h2 className="container mx-auto px-4 text-xl md:text-3xl lg:text-4xl text-center tracking-wider leading-relaxed flex flex-col gap-6 mb-8">
          <span>
            Fully integrate with English players and the English culture
          </span>
        </h2>
        <h3 className="container mx-auto px-4 text-xl md:text-2xl lg:text-3xl text-center tracking-wider leading-relaxed flex flex-col gap-6 mb-8 font-thin">
          <span>Learn. Apply. Dominate.</span>
        </h3>
        <h4 className="container mx-auto px-4 text-lg md:text-xl lg:text-2xl text-center tracking-wider leading-relaxed flex flex-col gap-6 mb-8 font-thin">
          <span>
            Players will train and play in matches with English players. Parents
            will enjoy the experience alongside their player throughout the
            entirety of the trip.
          </span>
        </h4>
      </div>

      {/* Contact Section */}
      <div className="w-full bg-gray-100 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-4xl lg:text-5xl text-center tracking-wider mb-12">
            GET IN TOUCH
          </h2>
          <div className="flex flex-col items-center gap-4 text-xl md:text-2xl">
            <a
              href="mailto:EPLSoccerTours@outlook.com"
              className="hover:underline"
            >
              EPLSoccerTours@outlook.com
            </a>
            <a href="tel:706-910-7073" className="hover:underline">
              706-910-7073
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
