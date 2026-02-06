import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { Eye, EyeOff, AlertCircle, Moon, Sun } from 'lucide-react';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { speak } = useVoiceFeedback();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          navigate('/home');
        }
      } else {
        if (!fullName.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error.message);
        } else {
          navigate('/home');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => {
              toggleTheme();
              speak(isDarkMode ? 'Light mode activated' : 'Dark mode activated');
            }}
            onMouseEnter={() => speak(isDarkMode ? 'Switch to light mode' : 'Switch to dark mode')}
            className="p-3 bg-white/10 hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-white rounded-full transition"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4"
              onMouseEnter={() => speak('Vision Assist Logo')}
            >
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
              onMouseEnter={() => speak('Vision Assist')}
            >
              Vision Assist
            </h1>
            <p
              className="text-gray-600 dark:text-gray-300"
              onMouseEnter={() => speak('AI-Powered Mobility for the Visually Impaired')}
            >
              AI-Powered Mobility for the Visually Impaired
            </p>
          </div>

          {error && (
            <div
              className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2"
              role="alert"
              onMouseEnter={() => speak(`Error: ${error}`)}
            >
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  onMouseEnter={() => speak('Full Name input field')}
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onFocus={() => speak('Full Name input field')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your full name"
                  required={!isLogin}
                  aria-label="Full Name"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                onMouseEnter={() => speak('Email Address input field')}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => speak('Email Address input field')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Enter your email"
                required
                aria-label="Email Address"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                onMouseEnter={() => speak('Password input field')}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => speak('Password input field')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(!showPassword);
                    speak(showPassword ? 'Hide password' : 'Show password');
                  }}
                  onMouseEnter={() => speak(showPassword ? 'Hide password button' : 'Show password button')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => speak(isLogin ? 'Sign In button' : 'Sign Up button')}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={isLogin ? 'Sign In' : 'Sign Up'}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFullName('');
                speak(isLogin ? 'Switched to Sign Up form' : 'Switched to Sign In form');
              }}
              onMouseEnter={() => speak(isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition"
              aria-label={isLogin ? 'Switch to Sign Up' : 'Switch to Sign In'}
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>

        <p className="text-center text-white text-sm mt-6">
          Empowering independence through AI technology
        </p>
      </div>
    </div>
  );
}
