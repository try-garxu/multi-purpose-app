'use client';

import { useRef, useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';

type Tool = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'line';
type DrawingElement = {
  type: Tool;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  size: number;
  points?: { x: number; y: number }[];
};

export default function DrawingBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Save current drawing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Resize canvas
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = 600;
      }

      // Restore drawing
      ctx.putImageData(imageData, 0, 0);
      redrawCanvas();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    elements.forEach(element => {
      ctx.strokeStyle = element.color;
      ctx.lineWidth = element.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (element.type === 'pen' && element.points) {
        ctx.beginPath();
        element.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      } else if (element.type === 'eraser' && element.points) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        element.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } else if (element.type === 'line') {
        ctx.beginPath();
        ctx.moveTo(element.startX, element.startY);
        ctx.lineTo(element.endX, element.endY);
        ctx.stroke();
      } else if (element.type === 'rectangle') {
        ctx.strokeRect(
          element.startX,
          element.startY,
          element.endX - element.startX,
          element.endY - element.startY
        );
      } else if (element.type === 'circle') {
        const radius = Math.sqrt(
          Math.pow(element.endX - element.startX, 2) +
          Math.pow(element.endY - element.startY, 2)
        );
        ctx.beginPath();
        ctx.arc(element.startX, element.startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
  };

  useEffect(() => {
    redrawCanvas();
  }, [elements]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    const newElement: DrawingElement = {
      type: tool,
      startX: x,
      startY: y,
      endX: x,
      endY: y,
      color: color,
      size: brushSize,
      points: tool === 'pen' || tool === 'eraser' ? [{ x, y }] : undefined,
    };

    setCurrentElement(newElement);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'pen' || tool === 'eraser') {
      const updatedElement = {
        ...currentElement,
        points: [...(currentElement.points || []), { x, y }],
      };
      setCurrentElement(updatedElement);

      // Draw in real-time
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      }

      const points = currentElement.points || [];
      const lastPoint = points[points.length - 1];

      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'source-over';
      }
    } else {
      const updatedElement = {
        ...currentElement,
        endX: x,
        endY: y,
      };
      setCurrentElement(updatedElement);

      // Redraw to show preview
      redrawCanvas();

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(currentElement.startX, currentElement.startY);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (tool === 'rectangle') {
        ctx.strokeRect(
          currentElement.startX,
          currentElement.startY,
          x - currentElement.startX,
          y - currentElement.startY
        );
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(x - currentElement.startX, 2) +
          Math.pow(y - currentElement.startY, 2)
        );
        ctx.beginPath();
        ctx.arc(currentElement.startX, currentElement.startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (currentElement) {
      setElements([...elements, currentElement]);
      setCurrentElement(null);
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setElements([]);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const undo = () => {
    if (elements.length > 0) {
      setElements(elements.slice(0, -1));
    }
  };

  return (
    <ToolLayout
      title="Drawing Board"
      description="Create sketches, diagrams, and illustrations with simple drawing tools."
    >
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
          {/* Tools */}
          <div className="flex gap-2">
            <button
              onClick={() => setTool('pen')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tool === 'pen'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              ✏️ Pen
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tool === 'eraser'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              🧹 Eraser
            </button>
            <button
              onClick={() => setTool('line')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tool === 'line'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              📏 Line
            </button>
            <button
              onClick={() => setTool('rectangle')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tool === 'rectangle'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              ⬜ Rectangle
            </button>
            <button
              onClick={() => setTool('circle')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tool === 'circle'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              ⭕ Circle
            </button>
          </div>

          {/* Color Picker */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Size:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{brushSize}px</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={undo}
              disabled={elements.length === 0}
              className="px-4 py-2 rounded-lg font-medium bg-yellow-500 text-white hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              ↶ Undo
            </button>
            <button
              onClick={clearCanvas}
              className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              🗑️ Clear
            </button>
            <button
              onClick={downloadImage}
              className="px-4 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              💾 Download
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="cursor-crosshair w-full"
            style={{ touchAction: 'none' }}
          />
        </div>

        {/* Tips */}
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
          <p className="mb-2 font-semibold">Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Select a tool from the toolbar to start drawing</li>
            <li>Use the color picker to change the drawing color</li>
            <li>Adjust the brush size using the slider</li>
            <li>Click "Undo" to remove the last drawing</li>
            <li>Click "Clear" to erase everything and start fresh</li>
            <li>Click "Download" to save your drawing as a PNG image</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
