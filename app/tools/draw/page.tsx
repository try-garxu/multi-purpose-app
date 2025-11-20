'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';

const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  {
    ssr: false,
    loading: () => (
      <div className="w-full flex items-center justify-center" style={{ height: '700px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading drawing board...</p>
        </div>
      </div>
    )
  }
);

export default function DrawingBoard() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Check system theme preference
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'light');

      // Listen for theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  if (!isMounted) {
    return (
      <ToolLayout
        title="Drawing Board"
        description="Create sketches, diagrams, and illustrations with an intuitive drawing tool."
      >
        <div className="w-full flex items-center justify-center" style={{ height: '700px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading drawing board...</p>
          </div>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title="Drawing Board"
      description="Create sketches, diagrams, and illustrations with an intuitive drawing tool."
    >
      <div className="w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden" style={{ height: '700px' }}>
        <Excalidraw
          theme={theme}
          initialData={{
            appState: {
              viewBackgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            },
          }}
          UIOptions={{
            canvasActions: {
              loadScene: false,
            },
          }}
        />
      </div>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p className="mb-2"><strong>Tips:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Use the toolbar to select different drawing tools</li>
          <li>Double-click shapes to add text</li>
          <li>Hold Shift while drawing for straight lines</li>
          <li>Export your drawing using the menu in the top-right</li>
        </ul>
      </div>
    </ToolLayout>
  );
}
