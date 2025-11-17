'use client';

import { useState, useRef } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Upload, Download, Image as ImageIcon, Lock, Unlock } from 'lucide-react';

export default function ImageResizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resizing, setResizing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const img = new Image();
      img.src = url;
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
    }
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const resizeImage = async () => {
    if (!selectedFile || !canvasRef.current) return;

    setResizing(true);

    try {
      const img = new Image();
      img.src = previewUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const originalName = selectedFile.name.split('.')[0];
            const extension = selectedFile.name.split('.').pop();
            link.download = `${originalName}_resized.${extension}`;
            link.click();
            URL.revokeObjectURL(url);
          }
          setResizing(false);
        },
        selectedFile.type
      );
    } catch (err) {
      console.error(err);
      setResizing(false);
    }
  };

  const resetToOriginal = () => {
    setWidth(originalDimensions.width);
    setHeight(originalDimensions.height);
  };

  const setPresetSize = (presetWidth: number, presetHeight: number) => {
    setWidth(presetWidth);
    setHeight(presetHeight);
  };

  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize images to any dimensions with optional aspect ratio lock."
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
              Supports all common image formats
            </p>
          </label>
        </div>

        {/* Image Editor */}
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
                Original: {originalDimensions.width} × {originalDimensions.height} px
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {/* Dimension Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dimensions</h3>
                <button
                  onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  {maintainAspectRatio ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">Locked</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span className="text-sm">Unlocked</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Preset Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quick Presets
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button
                    onClick={resetToOriginal}
                    className="px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    Original
                  </button>
                  <button
                    onClick={() => setPresetSize(1920, 1080)}
                    className="px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    1920×1080
                  </button>
                  <button
                    onClick={() => setPresetSize(1280, 720)}
                    className="px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    1280×720
                  </button>
                  <button
                    onClick={() => setPresetSize(800, 600)}
                    className="px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    800×600
                  </button>
                </div>
              </div>
            </div>

            {/* Resize Button */}
            <button
              onClick={resizeImage}
              disabled={resizing || width <= 0 || height <= 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {resizing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Resizing...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Resize & Download
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
