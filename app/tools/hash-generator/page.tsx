'use client';

import { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Copy, Hash } from 'lucide-react';
import CryptoJS from 'crypto-js';

type HashType = 'MD5' | 'SHA1' | 'SHA256' | 'SHA512' | 'SHA3';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    MD5: '',
    SHA1: '',
    SHA256: '',
    SHA512: '',
    SHA3: '',
  });
  const [copied, setCopied] = useState<string>('');

  useEffect(() => {
    if (!input) {
      setHashes({
        MD5: '',
        SHA1: '',
        SHA256: '',
        SHA512: '',
        SHA3: '',
      });
      return;
    }

    setHashes({
      MD5: CryptoJS.MD5(input).toString(),
      SHA1: CryptoJS.SHA1(input).toString(),
      SHA256: CryptoJS.SHA256(input).toString(),
      SHA512: CryptoJS.SHA512(input).toString(),
      SHA3: CryptoJS.SHA3(input).toString(),
    });
  }, [input]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate MD5, SHA-1, SHA-256, SHA-512, and SHA-3 hashes from any text."
    >
      <div className="space-y-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Input Text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to generate hashes..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Hash Results */}
        {input && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Generated Hashes
            </h3>

            {Object.entries(hashes).map(([type, hash]) => (
              <div key={type} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {type}
                  </span>
                  <button
                    onClick={() => copyToClipboard(hash, type)}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Copy className="w-3 h-3" />
                    {copied === type ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded p-3 overflow-x-auto">
                  <code className="text-sm text-gray-900 dark:text-white font-mono break-all">
                    {hash}
                  </code>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Hash Information</h4>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
            <li><strong>MD5:</strong> 128-bit hash (32 hex characters) - Not recommended for security</li>
            <li><strong>SHA-1:</strong> 160-bit hash (40 hex characters) - Deprecated for security</li>
            <li><strong>SHA-256:</strong> 256-bit hash (64 hex characters) - Secure and widely used</li>
            <li><strong>SHA-512:</strong> 512-bit hash (128 hex characters) - Very secure</li>
            <li><strong>SHA-3:</strong> Latest SHA standard - Highly secure</li>
          </ul>
        </div>

        {/* Use Cases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
              File Verification
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-300">
              Verify file integrity by comparing hashes
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">
              Password Storage
            </h4>
            <p className="text-sm text-green-800 dark:text-green-300">
              Store password hashes instead of plain text
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-2">
              Data Integrity
            </h4>
            <p className="text-sm text-orange-800 dark:text-orange-300">
              Ensure data hasn't been tampered with
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
