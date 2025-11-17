'use client';

import dynamic from 'next/dynamic';
import ToolLayout from '@/components/ToolLayout';

const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  { ssr: false }
);

export default function DrawingBoard() {
  return (
    <ToolLayout
      title="Drawing Board"
      description="Create sketches, diagrams, and illustrations with an intuitive drawing tool."
    >
      <div className="w-full" style={{ height: '700px' }}>
        <Excalidraw theme="light" />
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
