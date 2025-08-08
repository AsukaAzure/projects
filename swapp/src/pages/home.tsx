import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen text-lg">
      {/* === Top Bar with Brand and Login === */}
      <header className="flex justify-between items-center p-8">
        {/* Brand Name */}
        <div className="text-3xl font-bold text-purple-400">SkillSwap</div>
        <Link to="/login">
          {/* Login Button */}
          <button className="text-white border border-purple-500 hover:bg-purple-600 hover:text-white font-medium px-4 py-2 rounded transition">
            Login
          </button>
        </Link>
      </header>

      {/* === Hero Section === */}
      <section className="h-[calc(100vh-96px)] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-6xl font-bold mb-6">
          Swap what you know.
          <br />
          <span className="text-purple-500">Learn what you love.</span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl">
          Connect with people around the world to exchange skills, knowledge,
          and experiences in a seamless digital environment.
        </p>
        <Link to="/login">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition">
            Start Swapping
          </button>
        </Link>
      </section>

      {/* === How It Works Section === */}
      <section className="bg-[#1c1c1e] py-32 px-8 flex flex-col items-center min-h-screen">
        <h2 className="text-6xl font-bold text-white mb-20">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[90rem] w-full px-10 mx-auto">
          {/* Card 1 */}
          <div className="bg-[#2c2c2e] p-12 rounded-3xl text-center text-white shadow-2xl hover:scale-105 transition-transform duration-300">
            <div className="text-7xl mb-8">📖</div>
            <h3 className="text-3xl font-bold mb-6">Share Your Skills</h3>
            <p className="text-xl text-gray-300">
              “Showcase your talents and discover new passions — from code to
              cuisine, language to melody.”
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-[#2c2c2e] p-12 rounded-3xl text-center text-white shadow-2xl hover:scale-105 transition-transform duration-300">
            <div className="text-7xl mb-8">👥</div>
            <h3 className="text-3xl font-bold mb-6">Find Matches</h3>
            <p className="text-xl text-gray-300">
              “Discover your ideal match: someone eager to learn what you know
              and ready to teach what you don’t.”
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-[#2c2c2e] p-12 rounded-3xl text-center text-white shadow-2xl hover:scale-105 transition-transform duration-300">
            <div className="text-7xl mb-8">💬</div>
            <h3 className="text-3xl font-bold mb-6">Start Learning</h3>
            <p className="text-xl text-gray-300">
              "Chat, video call, or meet up. Exchange knowledge in whatever way
              works best for both of you."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
