import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Camera, LogOut, User, Scan, Shield, Info, Menu, X, History } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';

export function HomePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { speak } = useVoiceFeedback();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDetectionClick = () => {
    navigate('/detection');
  };

  const handleAboutClick = () => {
    navigate('/about');
    setMenuOpen(false);
  };

  const handleHistoryClick = () => {
    navigate('/history');
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-200">
      <nav className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-md border-b border-white/20 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Vision Assist</h1>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={handleDetectionClick}
                onMouseEnter={() => speak('Object Detection')}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 dark:hover:bg-gray-700/50 rounded-lg transition"
                aria-label="Object Detection"
              >
                <Scan className="w-4 h-4" />
                <span>Detection</span>
              </button>
              <button
                onClick={handleHistoryClick}
                onMouseEnter={() => speak('Detection History')}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 dark:hover:bg-gray-700/50 rounded-lg transition"
                aria-label="History"
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </button>
              <button
                onClick={handleAboutClick}
                onMouseEnter={() => speak('About')}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 dark:hover:bg-gray-700/50 rounded-lg transition"
                aria-label="About"
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </button>
              <button
                onClick={handleSignOut}
                onMouseEnter={() => speak('Sign Out')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 dark:bg-gray-700/50 dark:hover:bg-gray-600/50 text-white rounded-lg transition"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden py-4 border-t border-white/20 dark:border-gray-700">
              <div className="flex flex-col gap-2">
                <div className="px-4 py-2">
                  <ThemeToggle />
                </div>
                <button
                  onClick={handleDetectionClick}
                  onMouseEnter={() => speak('Object Detection')}
                  className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/10 dark:hover:bg-gray-700/50 rounded-lg transition text-left"
                >
                  <Scan className="w-5 h-5" />
                  <span>Object Detection</span>
                </button>
                <button
                  onClick={handleHistoryClick}
                  onMouseEnter={() => speak('Detection History')}
                  className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/10 dark:hover:bg-gray-700/50 rounded-lg transition text-left"
                >
                  <History className="w-5 h-5" />
                  <span>History</span>
                </button>
                <button
                  onClick={handleAboutClick}
                  onMouseEnter={() => speak('About')}
                  className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/10 dark:hover:bg-gray-700/50 rounded-lg transition text-left"
                >
                  <Info className="w-5 h-5" />
                  <span>About</span>
                </button>
                <button
                  onClick={handleSignOut}
                  onMouseEnter={() => speak('Sign Out')}
                  className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/10 dark:hover:bg-gray-700/50 rounded-lg transition text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full mb-6">
            <User className="w-5 h-5 text-blue-300" />
            <span className="text-blue-100">{user?.email}</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to Vision Assist
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Your AI-powered companion for enhanced mobility and independence
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <button
            onClick={handleDetectionClick}
            className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left"
            aria-label="Start Object Detection"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Scan className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Object Detection</h3>
            <p className="text-gray-600 leading-relaxed">
              Use AI to identify objects, obstacles, and surroundings in real-time through your camera
            </p>
            <div className="mt-4 text-blue-600 font-semibold flex items-center gap-2">
              Start Detection
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Safety First</h3>
            <p className="text-gray-600 leading-relaxed">
              Our AI technology helps you navigate safely by identifying potential hazards and providing audio feedback
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">
                1
              </div>
              <p className="text-blue-100">Activate the camera detection mode</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">
                2
              </div>
              <p className="text-blue-100">Point your camera at your surroundings</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">
                3
              </div>
              <p className="text-blue-100">Receive instant AI-powered feedback</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
