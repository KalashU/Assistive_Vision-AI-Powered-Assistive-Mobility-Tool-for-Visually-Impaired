import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History as HistoryIcon, Trash2, Calendar, Languages } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ThemeToggle } from '../components/ThemeToggle';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';

interface DetectionHistory {
  id: string;
  video_url: string;
  detections: Array<{
    class: string;
    confidence: number;
    bbox: number[];
  }>;
  transcription: string;
  language: string;
  created_at: string;
}

export function HistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState<DetectionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { speak } = useVoiceFeedback();

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('detection_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setHistory(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load detection history');
    } finally {
      setLoading(false);
    }
  };

  const deleteHistory = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('detection_history')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setHistory(history.filter((item) => item.id !== id));
      speak('History item deleted');
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete history item');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
              <HistoryIcon className="w-6 h-6 text-white" />
              <h1 className="text-xl font-bold text-white">Detection History</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div
            className="mb-6 p-4 bg-red-500/20 dark:bg-red-900/30 border border-red-500/50 dark:border-red-800 rounded-lg text-red-100 dark:text-red-300"
            onMouseEnter={() => speak(`Error: ${error}`)}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-2xl p-12 text-center">
            <HistoryIcon className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Detection History</h2>
            <p className="text-blue-100 dark:text-gray-300 mb-6">
              Start detecting objects to build your history
            </p>
            <button
              onClick={() => navigate('/detection')}
              onMouseEnter={() => speak('Go to Detection')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Go to Detection
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-[1.01]"
                onMouseEnter={() => speak(`Detection from ${formatDate(item.created_at)}`)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{formatDate(item.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Languages className="w-4 h-4" />
                          <span className="text-sm capitalize">{item.language}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Source: {item.video_url === 'camera-stream' ? 'Live Camera' : 'Uploaded Video'}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteHistory(item.id)}
                      onMouseEnter={() => speak('Delete this history item')}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-blue-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Detected Objects ({item.detections.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {item.detections.map((detection, index) => (
                        <div
                          key={index}
                          onMouseEnter={() =>
                            speak(`${detection.class}, ${(detection.confidence * 100).toFixed(1)} percent`)
                          }
                          className="bg-white dark:bg-gray-600 rounded-lg p-2 flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {detection.class}
                          </span>
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                            {(detection.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Audio Transcription</h4>
                    <p
                      className="text-gray-700 dark:text-gray-300 text-sm"
                      onMouseEnter={() => speak(item.transcription)}
                    >
                      {item.transcription}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
