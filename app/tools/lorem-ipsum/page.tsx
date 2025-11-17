'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Copy, Type } from 'lucide-react';

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const generateParagraph = (isFirst: boolean) => {
    const sentenceCount = Math.floor(Math.random() * 3) + 4; // 4-6 sentences
    let paragraph = [];

    for (let i = 0; i < sentenceCount; i++) {
      const wordCount = Math.floor(Math.random() * 8) + 8; // 8-15 words
      let sentence = [];

      for (let j = 0; j < wordCount; j++) {
        const word = loremWords[Math.floor(Math.random() * loremWords.length)];
        sentence.push(word);
      }

      let sentenceText = sentence.join(' ');
      sentenceText = sentenceText.charAt(0).toUpperCase() + sentenceText.slice(1) + '.';
      paragraph.push(sentenceText);
    }

    let paragraphText = paragraph.join(' ');

    // First paragraph starts with "Lorem ipsum" if option is selected
    if (isFirst && startWithLorem) {
      paragraphText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paragraphText;
    }

    return paragraphText;
  };

  const generateText = () => {
    const result = [];
    for (let i = 0; i < paragraphs; i++) {
      result.push(generateParagraph(i === 0));
    }
    setOutput(result.join('\n\n'));
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
      title="Lorem Ipsum Generator"
      description="Generate placeholder text for your designs and mockups."
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Paragraphs: {paragraphs}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={paragraphs}
              onChange={(e) => setParagraphs(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="startWithLorem"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="startWithLorem"
              className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Start with "Lorem ipsum dolor sit amet..."
            </label>
          </div>

          <button
            onClick={generateText}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
          >
            <Type className="w-5 h-5" />
            Generate Lorem Ipsum
          </button>
        </div>

        {/* Output */}
        {output && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Generated Text
              </label>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-6 max-h-[500px] overflow-y-auto">
              {output.split('\n\n').map((para, index) => (
                <p key={index} className="text-gray-900 dark:text-white mb-4 last:mb-0 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {output.split(' ').length} words, {output.length} characters
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">What is Lorem Ipsum?</h4>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Lorem Ipsum is placeholder text commonly used in the graphic, print, and publishing industries
            for previewing layouts and visual mockups. It's derived from a Latin text by Cicero and has
            been the industry standard since the 1500s.
          </p>
        </div>

        {/* Use Cases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
              Design Mockups
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-300">
              Fill design layouts with placeholder content
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">
              Testing
            </h4>
            <p className="text-sm text-green-800 dark:text-green-300">
              Test how text content flows in your layouts
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-2">
              Prototyping
            </h4>
            <p className="text-sm text-orange-800 dark:text-orange-300">
              Create realistic prototypes without final content
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
