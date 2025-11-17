'use client';

import { useState, useRef, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Download, QrCode } from 'lucide-react';
import QRCodeLib from 'qrcode';

export default function QRGenerator() {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [size, setSize] = useState(300);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateQRCode();
  }, [text, size]);

  const generateQRCode = async () => {
    if (!text.trim() || !canvasRef.current) {
      setQrCodeUrl('');
      return;
    }

    try {
      await QRCodeLib.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      const url = canvasRef.current.toDataURL();
      setQrCodeUrl(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    link.click();
  };

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Generate QR codes for URLs, text, contact info, and more."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text or URL
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text, URL, or any data to encode..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Size: {size}x{size}px
              </label>
              <input
                type="range"
                min="200"
                max="600"
                step="50"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Quick Examples */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Quick Examples:
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => setText('https://example.com')}
                  className="block w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                >
                  Website URL
                </button>
                <button
                  onClick={() => setText('mailto:example@email.com')}
                  className="block w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                >
                  Email Address
                </button>
                <button
                  onClick={() => setText('tel:+1234567890')}
                  className="block w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                >
                  Phone Number
                </button>
                <button
                  onClick={() => setText('WIFI:T:WPA;S:NetworkName;P:Password;;')}
                  className="block w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                >
                  WiFi Network
                </button>
              </div>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="flex flex-col items-center justify-center">
            {qrCodeUrl ? (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <canvas ref={canvasRef} className="mx-auto" />
                </div>
                <button
                  onClick={downloadQRCode}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download QR Code
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-400 dark:text-gray-500">
                <QrCode className="w-24 h-24 mx-auto mb-4" />
                <p>Enter text to generate QR code</p>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
