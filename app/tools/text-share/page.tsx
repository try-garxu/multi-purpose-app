'use client';

import { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Lock, Copy, Eye, EyeOff, Share2, Shield } from 'lucide-react';
import CryptoJS from 'crypto-js';

export default function TextShare() {
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [encryptedData, setEncryptedData] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [decryptPassword, setDecryptPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'create' | 'view'>('create');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if there's encrypted data in URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const data = params.get('data');
      if (data) {
        setMode('view');
        setEncryptedData(data);
      }
    }
  }, []);

  const handleEncrypt = () => {
    if (!text.trim()) {
      setError('Please enter some text to encrypt');
      return;
    }
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    setError('');
    const encrypted = CryptoJS.AES.encrypt(text, password).toString();
    setEncryptedData(encrypted);

    const url = `${window.location.origin}${window.location.pathname}?data=${encodeURIComponent(encrypted)}`;
    setShareLink(url);
  };

  const handleDecrypt = () => {
    if (!decryptPassword.trim()) {
      setError('Please enter the password');
      return;
    }

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, decryptPassword);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        setError('Incorrect password or corrupted data');
        return;
      }

      setDecryptedText(decrypted);
      setError('');
    } catch (err) {
      setError('Incorrect password or corrupted data');
    }
  };

  const copyToClipboard = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const resetForm = () => {
    setText('');
    setPassword('');
    setEncryptedData('');
    setShareLink('');
    setDecryptedText('');
    setDecryptPassword('');
    setError('');
    setMode('create');
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <ToolLayout
      title="Protected Text Share"
      description="Share encrypted text securely without login. Your text is encrypted in your browser."
    >
      <div className="space-y-6">
        {/* Mode Selector */}
        {!encryptedData && (
          <div className="flex gap-3 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => setMode('create')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'create'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Lock className="w-4 h-4 inline mr-2" />
              Create Encrypted Text
            </button>
            <button
              onClick={() => setMode('view')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'view'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              View Encrypted Text
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Create Mode */}
        {mode === 'create' && !shareLink && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Secret Message
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the text you want to encrypt and share..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Remember this password - you'll need it to decrypt the message
              </p>
            </div>

            <button
              onClick={handleEncrypt}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Encrypt & Generate Link
            </button>
          </div>
        )}

        {/* Share Link Display */}
        {shareLink && (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-200">
                  Encrypted Successfully!
                </h3>
              </div>
              <p className="text-sm text-green-800 dark:text-green-300 mb-4">
                Share this link with anyone who needs to read your message. They'll need the password to decrypt it.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-green-300 dark:border-green-700 rounded-lg text-sm"
                />
                <button
                  onClick={() => copyToClipboard(shareLink)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="w-full py-3 px-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Create Another
            </button>
          </div>
        )}

        {/* View/Decrypt Mode */}
        {mode === 'view' && encryptedData && !decryptedText && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                This message is encrypted. Enter the password to view it.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={decryptPassword}
                  onChange={(e) => setDecryptPassword(e.target.value)}
                  placeholder="Enter the password"
                  onKeyPress={(e) => e.key === 'Enter' && handleDecrypt()}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleDecrypt}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Decrypt Message
            </button>
          </div>
        )}

        {/* Decrypted Message Display */}
        {decryptedText && (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-200">
                  Decrypted Message
                </h3>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-3">
                <p className="whitespace-pre-wrap text-gray-900 dark:text-white">{decryptedText}</p>
              </div>
              <button
                onClick={() => copyToClipboard(decryptedText)}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>

            <button
              onClick={resetForm}
              className="w-full py-3 px-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Create New Encrypted Text
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Security Features
          </h4>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>• End-to-end encryption using AES-256</li>
            <li>• All encryption happens in your browser</li>
            <li>• No data is stored on our servers</li>
            <li>• Password is never transmitted or stored</li>
            <li>• Perfect for sharing sensitive information</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
