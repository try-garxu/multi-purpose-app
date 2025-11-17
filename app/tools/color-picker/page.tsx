'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Copy, Palette } from 'lucide-react';

export default function ColorPicker() {
  const [color, setColor] = useState('#3B82F6');
  const [copied, setCopied] = useState('');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const rgb = hexToRgb(color);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const formats = {
    HEX: color.toUpperCase(),
    RGB: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '',
    RGBA: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` : '',
    HSL: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '',
    HSLA: hsl ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)` : '',
  };

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(format);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const presetColors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
    '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E',
    '#607D8B', '#000000', '#FFFFFF'
  ];

  return (
    <ToolLayout
      title="Color Picker"
      description="Pick colors and get their values in multiple formats (HEX, RGB, HSL)."
    >
      <div className="space-y-6">
        {/* Color Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Color
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-32 rounded-lg cursor-pointer border-4 border-gray-200 dark:border-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                HEX Input
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="#000000"
              />
            </div>
          </div>

          <div
            className="rounded-xl border-4 border-gray-200 dark:border-gray-600 min-h-[200px] flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <div className="text-center">
              <Palette
                className="w-16 h-16 mx-auto mb-2"
                style={{ color: rgb && (rgb.r + rgb.g + rgb.b) / 3 > 128 ? '#000' : '#fff' }}
              />
              <p
                className="text-2xl font-bold"
                style={{ color: rgb && (rgb.r + rgb.g + rgb.b) / 3 > 128 ? '#000' : '#fff' }}
              >
                {color.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Color Formats */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Color Formats</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(formats).map(([format, value]) => (
              <div
                key={format}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {format}
                  </p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white">
                    {value}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(value, format)}
                  className="ml-3 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  title="Copy"
                >
                  {copied === format ? (
                    <span className="text-xs">✓</span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preset Colors */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preset Colors</h3>
          <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 gap-2">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => setColor(presetColor)}
                className={`w-10 h-10 rounded-lg transition-transform hover:scale-110 ${
                  color.toUpperCase() === presetColor
                    ? 'ring-4 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800'
                    : 'border-2 border-gray-200 dark:border-gray-600'
                }`}
                style={{ backgroundColor: presetColor }}
                title={presetColor}
              />
            ))}
          </div>
        </div>

        {/* Color Info */}
        {rgb && hsl && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2">RGB Values</h4>
              <div className="space-y-1 text-sm">
                <p className="text-red-800 dark:text-red-300">Red: {rgb.r}</p>
                <p className="text-red-800 dark:text-red-300">Green: {rgb.g}</p>
                <p className="text-red-800 dark:text-red-300">Blue: {rgb.b}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">HSL Values</h4>
              <div className="space-y-1 text-sm">
                <p className="text-blue-800 dark:text-blue-300">Hue: {hsl.h}°</p>
                <p className="text-blue-800 dark:text-blue-300">Saturation: {hsl.s}%</p>
                <p className="text-blue-800 dark:text-blue-300">Lightness: {hsl.l}%</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">Brightness</h4>
              <div className="space-y-1 text-sm">
                <p className="text-purple-800 dark:text-purple-300">
                  Perceived: {Math.round((rgb.r + rgb.g + rgb.b) / 3)}
                </p>
                <p className="text-purple-800 dark:text-purple-300">
                  Type: {(rgb.r + rgb.g + rgb.b) / 3 > 128 ? 'Light' : 'Dark'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
