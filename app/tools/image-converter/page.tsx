'use client';

import { useState, useRef } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';

type ImageFormat = 'png' | 'jpeg' | 'webp';

export default function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState(0.9);
  const [converting, setConverting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const convertImage = async () => {
    if (!selectedFile || !canvasRef.current) return;

    setConverting(true);

    try {
      const img = new Image();
      img.src = previewUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const originalName = selectedFile.name.split('.')[0];
            link.download = `${originalName}.${outputFormat}`;
            link.click();
            URL.revokeObjectURL(url);
          }
          setConverting(false);
        },
        `image/${outputFormat}`,
        quality
      );
    } catch (err) {
      console.error(err);
      setConverting(false);
    }
  };

  return (
    <ToolLayout
      title="Image Converter"
      description="Convert images between PNG, JPEG, and WebP formats with quality control."
    >
      <div className="space-y-6">
        <canvas ref={canvasRef} className="hidden" />

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Click to upload an image
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports PNG, JPEG, WebP, GIF, and more
            </p>
          </label>
        </div>

        {/* Preview and Options */}
        {selectedFile && (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="flex justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-96 rounded-lg shadow-lg"
              />
            </div>

            {/* File Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {/* Conversion Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Output Format
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['png', 'jpeg', 'webp'] as ImageFormat[]).map((format) => (
                    <button
                      key={format}
                      onClick={() => setOutputFormat(format)}
                      className={`py-2 px-4 rounded-lg font-medium transition-all ${
                        outputFormat === format
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {(outputFormat === 'jpeg' || outputFormat === 'webp') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quality: {Math.round(quality * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              )}
            </div>

            {/* Convert Button */}
            <button
              onClick={convertImage}
              disabled={converting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {converting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Converting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Convert & Download
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
