import React from "react";
import Image from "next/image";
import Link from "next/link";

const About = () => {
  return (
    <>
      {/* Cover Image with Overlay */}
      <div className="w-screen aspect-video relative -mx-[calc((100vw-100%)/2)]">
        <div className="w-full h-full absolute inset-0">
          <Image
            src="/about/test.png"
            alt="About EPL International Pro Player Experience"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40">
          <h1 className="container mx-auto text-white px-4 text-4xl md:text-5xl lg:text-6xl text-center tracking-wider leading-relaxed flex flex-col gap-6 mb-16 font-bold">
            <span>ABOUT</span>
            <span>
              {" "}
              <span className="font-bold text-red-500">EPL</span> INTERNATIONAL
              PRO
            </span>
            <span>PLAYER EXPERIENCE </span>
          </h1>
        </div>
      </div>

      {/* Video Section with Clear Header */}
      <div className="container mx-auto px-4 mb-16">
        {/* Full-width Video - First try with video element */}
        <div className="w-screen aspect-video mb-12 relative -mx-[calc((100vw-100%)/2)] bg-black">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/about/test.png"
          >
            <source src="/about/show.mov" type="video/quicktime" />
            <source src="/about/show.mov" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Alternative approach - Using iframe as fallback */}
        <div className="w-screen aspect-video mb-12 relative -mx-[calc((100vw-100%)/2)] hidden">
          <iframe
            src="/about/show.mov"
            className="w-full h-full absolute inset-0 border-none"
            allow="autoplay; fullscreen"
            title="EPL International Pro Player Experience Video"
          ></iframe>
        </div>
      </div>

      {/* About Content */}
      <div className="container mx-auto px-4 max-w-4xl mb-16">
        <div className="flex flex-col gap-6 text-lg text-center">
          <p>
            Different to other soccer tours, the EPL IPPE allows persons to
            fully immerse themselves on how it feels to be a part of the English
            football culture.
          </p>

          <p>
            We train within the academies and with the players, rather than
            playing against someone and feeling the culture from the outside.
            Our players and coaches get to feel the culture from within. To
            become a part of culture, not a tourist.
          </p>

          <p>
            You, as a dedicated player or coach, travel to the UK and see what
            its like to train or coach like a pro.
          </p>

          <p>
            Based in Manchester, England, the hotbed of soccer talent in the UK,
            EPL Pro Soccer utilizes a 20 year history of connections with
            Manchester United and Manchester City scouts and coaches to create
            an unforgettable experience for all.
          </p>
        </div>
      </div>

      {/* Who Are You Grid */}
      <div className="container mx-auto px-4 mb-16 max-w-5xl">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8">
          {/* Player Column */}
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-2xl font-bold tracking-wider">
              Individual Player
            </h3>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/front/player.png"
                alt="Soccer Player"
                fill
                className="object-cover"
                priority
              />
            </div>

            <Link
              href="/player-info"
              className="w-full border-2 border-black px-6 py-3 text-center text-lg tracking-wider hover:bg-black hover:text-white transition-all duration-300"
            >
              Learn More
            </Link>
            <Link
              href="/player-experience"
              className="w-full border-2 border-black bg-black text-white px-6 py-3 text-center text-lg tracking-wider hover:bg-white hover:text-black transition-all duration-300"
            >
              Start Now
            </Link>
          </div>

          {/* Coach Column */}
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-2xl font-bold tracking-wider">Team</h3>

            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/contact/team.png"
                alt="Soccer Coach"
                fill
                className="object-cover"
                priority
              />
            </div>
            <Link
              href="/coach-info"
              className="w-full border-2 border-black px-6 py-3 text-center text-lg tracking-wider hover:bg-black hover:text-white transition-all duration-300"
            >
              Learn More
            </Link>
            <Link
              href="/coach-experience"
              className="w-full border-2 border-black bg-black text-white px-6 py-3 text-center text-lg tracking-wider hover:bg-white hover:text-black transition-all duration-300"
            >
              Start Now
            </Link>
          </div>

          {/* Team Column */}
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-2xl font-bold tracking-wider">Coach</h3>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/about/coach.png"
                alt="Soccer Team"
                fill
                className="object-cover"
                priority
              />
            </div>

            <Link
              href="/team-info"
              className="w-full border-2 border-black px-6 py-3 text-center text-lg tracking-wider hover:bg-black hover:text-white transition-all duration-300"
            >
              Learn More
            </Link>
            <Link
              href="/team-experience"
              className="w-full border-2 border-black bg-black text-white px-6 py-3 text-center text-lg tracking-wider hover:bg-white hover:text-black transition-all duration-300"
            >
              Start Now
            </Link>
          </div>
        </div>
      </div>

      {/* An Experience Like No Other Section */}
      <div className="container mx-auto px-4 max-w-4xl mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-center font-bold mb-16">
          An Experience Like No Other
        </h2>

        <div className="mb-12">
          <h3 className="text-3xl md:text-5xl text-center font-medium mb-8 text-red-500">
            Individual Player
          </h3>

          <p className="text-3xl text-center mb-6 tracking-wider leading-loose">
            Individual families can register and a tailor made trip will be
            created for you. Trips will be designed around player resumes and
            availability of opportunities during the timeframe selected. All
            tours will include experiences with at least one of these
            organizations: Man City, Man United, and Liverpool plus other
            partner oraganizations such as Bolton, Stoke, Burnley, etc..
          </p>

          {/* Individual Package Pricing Box */}
          <div className="border-2 border-black p-8 mt-12 mb-12 max-w-4xl mx-auto">
            <h3 className="text-4xl text-center font-bold mb-10">
              Individual Package:
            </h3>

            <div className="grid grid-cols-2 text-center mb-10">
              <div>
                <h4 className="text-2xl font-bold mb-2">6 Night Stay:</h4>
                <p className="text-3xl text-red-500 font-medium">$2,299</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-2">9 Night Stay:</h4>
                <p className="text-3xl text-red-500 font-medium">$2,899</p>
              </div>
            </div>

            <h4 className="text-3xl text-center font-bold mb-8">
              Each Stay Includes:
            </h4>

            <ul className="text-xl space-y-4 max-w-3xl mx-auto">
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Accommodation at places like Bolton Stadium Hotel</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Two meals per day</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>2 or 3 games integrated with English players</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Training delivered by top academy coaches</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>
                  Train with grass roots, development, and academy level players
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Player evaluations from academy coaches</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>
                  Transport provided from beginning meeting point to end of
                  itinerary [usually Manchester Airport]
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>EPL lead Chaperone day and evening.</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>
                  All stadium tours, training sessions, presentations, included
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>View live games and experience game day activities</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Parents involved throughout the experience</span>
              </li>
            </ul>
            <h4 className="text-3xl text-center font-bold mb-8">
              Each Does not Include:
            </h4>
            <ul className="text-xl space-y-4 max-w-3xl mx-auto">
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Flights</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Professional Match Tickets</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>1 Meal Per Day</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Any logistics before and after the trip itinerary</span>
              </li>
            </ul>
          </div>

          {/* Red button with black hover */}
          <div className="flex justify-center mt-16 mb-12">
            <Link
              href="/player-experience"
              className="bg-red-500 hover:bg-black text-white text-2xl font-medium py-4 px-10 transition-all duration-300 tracking-wider"
            >
              Next Step to Experiencing Life as a Professional
            </Link>
          </div>
        </div>
        <div className="mb-12">
          <h3 className="text-3xl md:text-5xl text-center font-medium mb-8 text-red-500">
            Team Package
          </h3>

          <p className="text-3xl text-center mb-6 tracking-wider leading-loose">
            Teams will register and specify their desires for their tailor made
            tour. The opposition will be selected due to your preference for the
            desired playing level and experience. All tours will include
            experiences with at least one of these organizations: Man City, Man
            United, and Liverpool plus other partner organizations such as
            Bolton, Stoke, Burnley, etc.. Any specifications outside of the
            Manchester area will incur a minimal fee for travel.
          </p>

          {/* Individual Package Pricing Box */}
          <div className="border-2 border-black p-8 mt-12 mb-12 max-w-4xl mx-auto">
            <h3 className="text-4xl text-center font-bold mb-10">
              Individual Package:
            </h3>

            <div className="grid grid-cols-2 text-center mb-10">
              <div>
                <h4 className="text-2xl font-bold mb-2">6 Night Stay:</h4>
                <p className="text-3xl text-red-500 font-medium">$3,599</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-2">9 Night Stay:</h4>
                <p className="text-3xl text-red-500 font-medium">$4,199</p>
              </div>
            </div>

            <h4 className="text-3xl text-center font-bold mb-8">
              Each Stay Includes:
            </h4>

            <ul className="text-xl space-y-4 max-w-3xl mx-auto">
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Accommodation at places like Bolton Stadium Hotel</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Two meals per day</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>2 or 3 games against English players</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Training delivered by top academy coaches</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>
                  Train with grass roots, development, and academy level
                  players, or independently
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Player evaluations from academy coaches</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>
                  Transport provided from beginning meeting point to end of
                  itinerary [usually Manchester Airport]
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>EPL lead Chaperone day and evening.</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>
                  All stadium tours, training sessions, presentations, included
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>View live games and experience game day activities</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Parents involved throughout the experience</span>
              </li>
            </ul>
            <h4 className="text-3xl text-center font-bold mb-8">
              Each Does not Include:
            </h4>
            <ul className="text-xl space-y-4 max-w-3xl mx-auto">
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Flights</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Professional Match Tickets</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>1 Meal Per Day</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Any logistics before and after the trip itinerary</span>
              </li>
            </ul>
          </div>

          {/* Red button with black hover */}
          <div className="flex justify-center mt-16 mb-12">
            <Link
              href="/team-experience"
              className="bg-red-500 hover:bg-black text-white text-2xl font-medium py-4 px-10 transition-all duration-300 tracking-wider"
            >
              Next Step to Experiencing Life as a Professional
            </Link>
          </div>
        </div>
        <div className="mb-12">
          <h3 className="text-3xl md:text-5xl text-center font-medium mb-8 text-red-500">
            Coaches
          </h3>

          {/* Individual Package Pricing Box */}
          <div className="border-2 border-black p-8 mt-12 mb-12 max-w-4xl mx-auto">
            <ul className="text-xl space-y-4 max-w-3xl mx-auto">
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Accommodation at places like Bolton Stadium Hotel</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Two meals per day</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Gain English FA coaching qualifications</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>Access to Premier League coaches</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>
                  Visits to academy sessions at Man United, Man City, Liverpool,
                  Bolton, Stoke, Burnley etc..
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>View academy sessions and QA with coaches after.</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>
                  Multiple age groups and genders viewed for varied experience.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>
                  Transport provided from beginning meeting point to end of
                  itinerary [usually Manchester Airport]
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>EPL lead Chaperone day and evening.</span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>
                  All stadium tours, training sessions, presentations, included
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-xl mr-2">•</span>
                <span>
                  View games from premier league, championship, lower league
                  games, under 21s, and youth levels
                </span>
              </li>
            </ul>
          </div>

          {/* Red button with black hover */}
          <div className="flex justify-center mt-16 mb-12">
            <Link
              href="/coach-experience"
              className="bg-red-500 hover:bg-black text-white text-2xl font-medium py-4 px-10 transition-all duration-300 tracking-wider"
            >
              Next Step to Experiencing Life as a World Class Coach
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
