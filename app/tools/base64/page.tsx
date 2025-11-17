'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Copy, ArrowDownUp } from 'lucide-react';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    if (!input.trim()) {
      setError('Please enter text to encode');
      setOutput('');
      return;
    }

    try {
      const encoded = btoa(input);
      setOutput(encoded);
      setError('');
    } catch (err) {
      setError('Failed to encode. Please check your input.');
      setOutput('');
    }
  };

  const handleDecode = () => {
    if (!input.trim()) {
      setError('Please enter Base64 to decode');
      setOutput('');
      return;
    }

    try {
      const decoded = atob(input);
      setOutput(decoded);
      setError('');
    } catch (err) {
      setError('Invalid Base64 string');
      setOutput('');
    }
  };

  const handleSubmit = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const swapInputOutput = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <ToolLayout
      title="Base64 Encoder/Decoder"
      description="Encode and decode Base64 strings quickly and easily."
    >
      <div className="space-y-6">
        {/* Mode Selector */}
        <div className="flex gap-3 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <button
            onClick={() => setMode('encode')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              mode === 'encode'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              mode === 'decode'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Decode
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text...' : 'Enter Base64 string...'}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
          </button>
          {output && (
            <button
              onClick={swapInputOutput}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
              title="Swap input and output"
            >
              <ArrowDownUp className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {mode === 'encode' ? 'Encoded Base64' : 'Decoded Text'}
              </label>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none font-mono text-sm"
            />
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">About Base64</h4>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format.
            It's commonly used to encode data that needs to be stored or transferred over media designed to handle text.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
