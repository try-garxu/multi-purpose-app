'use client';

import { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Link2, Copy, ExternalLink, Trash2 } from 'lucide-react';

interface ShortUrl {
  id: string;
  original: string;
  short: string;
  clicks: number;
  created: string;
}

export default function URLShortener() {
  const [url, setUrl] = useState('');
  const [shortUrls, setShortUrls] = useState<ShortUrl[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    // Load saved URLs from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shortUrls');
      if (saved) {
        setShortUrls(JSON.parse(saved));
      }
    }
  }, []);

  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch (err) {
      return false;
    }
  };

  const createShortUrl = () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (including http:// or https://)');
      return;
    }

    const shortCode = generateShortCode();
    const shortUrl: ShortUrl = {
      id: Date.now().toString(),
      original: url,
      short: `${window.location.origin}/s/${shortCode}`,
      clicks: 0,
      created: new Date().toISOString(),
    };

    const updated = [shortUrl, ...shortUrls];
    setShortUrls(updated);
    localStorage.setItem('shortUrls', JSON.stringify(updated));
    setUrl('');
    setError('');
  };

  const deleteUrl = (id: string) => {
    const updated = shortUrls.filter((u) => u.id !== id);
    setShortUrls(updated);
    localStorage.setItem('shortUrls', JSON.stringify(updated));
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <ToolLayout
      title="URL Shortener"
      description="Create short, memorable URLs from long links. Perfect for sharing."
    >
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> This is a demo URL shortener. Short URLs are stored locally in your browser
            and won't redirect to the original URL. For a production URL shortener, you would need a backend service.
          </p>
        </div>

        {/* Create Short URL */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter URL to Shorten
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/very-long-url-that-needs-shortening"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && createShortUrl()}
                />
              </div>
              <button
                onClick={createShortUrl}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all whitespace-nowrap"
              >
                Shorten URL
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Short URLs List */}
        {shortUrls.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Short URLs ({shortUrls.length})
            </h3>

            <div className="space-y-3">
              {shortUrls.map((shortUrl) => (
                <div
                  key={shortUrl.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3"
                >
                  {/* Short URL */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg px-4 py-3 border-2 border-blue-200 dark:border-blue-700">
                      <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-blue-500" />
                        <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                          {shortUrl.short}
                        </code>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(shortUrl.short, shortUrl.id)}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      {copied === shortUrl.id ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={() => deleteUrl(shortUrl.id)}
                      className="p-3 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Original URL */}
                  <div className="flex items-start gap-2 text-sm">
                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <a
                      href={shortUrl.original}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 break-all"
                    >
                      {shortUrl.original}
                    </a>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Created: {new Date(shortUrl.created).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Clicks: {shortUrl.clicks}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {shortUrls.length === 0 && (
          <div className="text-center py-12">
            <Link2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Short URLs Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a URL above to create your first short link
            </p>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Easy Sharing
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Share short, memorable URLs instead of long links
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
              Track Links
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-300">
              Keep track of all your shortened URLs in one place
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">
              Local Storage
            </h4>
            <p className="text-sm text-green-800 dark:text-green-300">
              Your URLs are stored securely in your browser
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
