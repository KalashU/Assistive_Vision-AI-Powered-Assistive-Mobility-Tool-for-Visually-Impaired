import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Eye, Brain, Heart, Shield, Zap } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';

export function AboutPage() {
  const navigate = useNavigate();
  const { speak } = useVoiceFeedback();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-200">
      <nav className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-md border-b border-white/20 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/home')}
              onMouseEnter={() => speak('Back to Home')}
              className="flex items-center gap-2 text-white hover:text-blue-200 dark:hover:text-blue-300 transition"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <Camera className="w-6 h-6 text-white" />
              <h1 className="text-xl font-bold text-white">About Vision Assist</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-12 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Vision Assist</h1>
            <p className="text-xl text-blue-100">Empowering Independence Through AI</p>
          </div>

          <div className="p-8">
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Vision Assist is dedicated to empowering visually impaired individuals with cutting-edge AI technology.
                Our mission is to enhance mobility, independence, and quality of life through real-time object detection
                and intelligent audio feedback systems.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Detection</h3>
                    <p className="text-gray-700">
                      Advanced YOLO object detection identifies objects, obstacles, and hazards in real-time
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-green-50 rounded-xl">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Processing</h3>
                    <p className="text-gray-700">
                      Instant analysis with audio feedback to keep you informed about your surroundings
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-orange-50 rounded-xl">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety First</h3>
                    <p className="text-gray-700">
                      Designed with safety as the top priority to help prevent accidents and enhance mobility
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-rose-50 rounded-xl">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-rose-600 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">User-Centered Design</h3>
                    <p className="text-gray-700">
                      Intuitive interface with accessibility features built from the ground up
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Technology</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Vision Assist leverages state-of-the-art YOLO (You Only Look Once) deep learning models for
                accurate and fast object detection. Our system processes video streams in real-time, providing
                immediate feedback about detected objects and their confidence levels.
              </p>
              <div className="bg-gray-100 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Technical Stack</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span><strong>Frontend:</strong> React with TypeScript for a robust, type-safe interface</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span><strong>Backend:</strong> Python Flask API for efficient model serving</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span><strong>AI Model:</strong> YOLO for real-time object detection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span><strong>Database:</strong> Supabase for secure user authentication and data management</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We are committed to continuous improvement and innovation. Vision Assist is more than just an app—it's
                a step towards a more inclusive world where technology serves everyone. We actively seek feedback from
                our users to ensure our solution meets real-world needs and makes a meaningful impact in daily life.
              </p>
            </section>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/home')}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition shadow-lg hover:shadow-xl"
          >
            Get Started with Vision Assist
          </button>
        </div>
      </main>
    </div>
  );
}
