'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Music, Youtube, Loader, Download } from 'lucide-react';

interface AudioInfo {
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
  downloadUrl: string;
}

export default function YouTubeToAudio() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioInfo, setAudioInfo] = useState<AudioInfo | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setAudioInfo(null);

    try {
      const response = await fetch('/api/youtube/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, format: 'audio' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch audio info');
      }

      setAudioInfo(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing the audio');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: string) => {
    const sec = parseInt(seconds);
    const minutes = Math.floor(sec / 60);
    const remainingSeconds = sec % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <ToolLayout
      title="YouTube to Audio Converter"
      description="Extract audio from YouTube videos and download as MP3. Perfect for music, podcasts, and more."
    >
      <div className="space-y-6">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              YouTube URL
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Music className="w-5 h-5" />
                    Extract Audio
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Audio Info */}
        {audioInfo && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg overflow-hidden border border-purple-200 dark:border-purple-800">
              <div className="relative">
                <img
                  src={audioInfo.thumbnail}
                  alt={audioInfo.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <Music className="w-8 h-8 mb-2" />
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {audioInfo.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  By {audioInfo.author}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Duration: {formatDuration(audioInfo.duration)}
                </p>
              </div>
            </div>

            <a
              href={audioInfo.downloadUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all text-center flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Audio
            </a>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Audio will be downloaded in the highest quality available.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">How to use:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-purple-800 dark:text-purple-300">
            <li>Copy the URL of a YouTube video</li>
            <li>Paste it in the input field above</li>
            <li>Click "Extract Audio" to process</li>
            <li>Click the download button to save the audio file</li>
          </ol>
          <div className="mt-3 text-xs text-purple-700 dark:text-purple-400">
            <strong>Note:</strong> Please respect copyright laws and only download content you have permission to use.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
