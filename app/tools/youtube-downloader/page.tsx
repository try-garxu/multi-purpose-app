'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Download, Youtube, Loader } from 'lucide-react';

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
  downloadUrl: string;
  format: string;
}

export default function YouTubeDownloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setVideoInfo(null);

    try {
      const response = await fetch('/api/youtube/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, format: 'video' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video info');
      }

      setVideoInfo(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing the video');
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
      title="YouTube Video Downloader"
      description="Download YouTube videos quickly and easily. Paste a YouTube URL to get started."
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
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Get Video'
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

        {/* Video Info */}
        {videoInfo && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {videoInfo.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  By {videoInfo.author}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Duration: {formatDuration(videoInfo.duration)}
                </p>
              </div>
            </div>

            <a
              href={videoInfo.downloadUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all text-center flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Video
            </a>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Note: Some videos may not be downloadable due to restrictions or DRM protection.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">How to use:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-300">
            <li>Copy the URL of a YouTube video</li>
            <li>Paste it in the input field above</li>
            <li>Click "Get Video" to process</li>
            <li>Click the download button to save the video</li>
          </ol>
        </div>
      </div>
    </ToolLayout>
  );
}
