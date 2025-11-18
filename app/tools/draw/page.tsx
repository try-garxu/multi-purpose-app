'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import ToolLayout from '@/components/ToolLayout';

type Tool = 'selection' | 'rectangle' | 'circle' | 'arrow' | 'line' | 'pen' | 'text' | 'eraser';

interface Point {
  x: number;
  y: number;
}

interface DrawElement {
  id: string;
  type: Tool;
  points: Point[];
  color: string;
  strokeWidth: number;
  fill?: string;
  text?: string;
}

export default function DrawingBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [elements, setElements] = useState<DrawElement[]>([]);
  const [currentElement, setCurrentElement] = useState<DrawElement | null>(null);
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fillColor, setFillColor] = useState('transparent');

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        redraw();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Redraw canvas whenever elements change
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all elements
    [...elements, currentElement].filter(Boolean).forEach((element) => {
      if (!element || element.points.length === 0) return;

      ctx.strokeStyle = element.color;
      ctx.lineWidth = element.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (element.type === 'pen') {
        ctx.beginPath();
        element.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      } else if (element.type === 'eraser') {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = element.strokeWidth * 3;
        ctx.beginPath();
        element.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        ctx.restore();
      } else if (element.type === 'line' && element.points.length >= 2) {
        const start = element.points[0];
        const end = element.points[element.points.length - 1];
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      } else if (element.type === 'arrow' && element.points.length >= 2) {
        const start = element.points[0];
        const end = element.points[element.points.length - 1];

        // Draw line
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        // Draw arrowhead
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const arrowLength = 15;
        const arrowAngle = Math.PI / 6;

        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - arrowLength * Math.cos(angle - arrowAngle),
          end.y - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - arrowLength * Math.cos(angle + arrowAngle),
          end.y - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.stroke();
      } else if (element.type === 'rectangle' && element.points.length >= 2) {
        const start = element.points[0];
        const end = element.points[element.points.length - 1];
        const width = end.x - start.x;
        const height = end.y - start.y;

        if (element.fill && element.fill !== 'transparent') {
          ctx.fillStyle = element.fill;
          ctx.fillRect(start.x, start.y, width, height);
        }
        ctx.strokeRect(start.x, start.y, width, height);
      } else if (element.type === 'circle' && element.points.length >= 2) {
        const start = element.points[0];
        const end = element.points[element.points.length - 1];
        const radius = Math.sqrt(
          Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        );

        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
        if (element.fill && element.fill !== 'transparent') {
          ctx.fillStyle = element.fill;
          ctx.fill();
        }
        ctx.stroke();
      }
    });
  }, [elements, currentElement]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'selection') return;

    setIsDrawing(true);
    const point = getMousePos(e);

    const newElement: DrawElement = {
      id: Date.now().toString(),
      type: tool,
      points: [point],
      color: color,
      strokeWidth: strokeWidth,
      fill: fillColor,
    };

    setCurrentElement(newElement);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentElement) return;

    const point = getMousePos(e);

    if (tool === 'pen' || tool === 'eraser') {
      setCurrentElement({
        ...currentElement,
        points: [...currentElement.points, point],
      });
    } else {
      setCurrentElement({
        ...currentElement,
        points: [currentElement.points[0], point],
      });
    }
  };

  const handleMouseUp = () => {
    if (currentElement && currentElement.points.length > 0) {
      setElements([...elements, currentElement]);
    }
    setCurrentElement(null);
    setIsDrawing(false);
  };

  const handleClear = () => {
    setElements([]);
    setCurrentElement(null);
  };

  const handleUndo = () => {
    setElements(elements.slice(0, -1));
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const ToolButton = ({
    toolType,
    icon,
    label
  }: {
    toolType: Tool;
    icon: string;
    label: string;
  }) => (
    <button
      onClick={() => setTool(toolType)}
      className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-all ${
        tool === toolType
          ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
          : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
      }`}
      title={label}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">{label}</span>
    </button>
  );

  return (
    <ToolLayout
      title="Drawing Board"
      description="Create sketches, diagrams, and illustrations with simple drawing tools."
    >
      <div className="flex gap-4 h-[calc(100vh-300px)] min-h-[600px]">
        {/* Left Toolbar - Excalidraw Style */}
        <div className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 overflow-y-auto max-h-full">
          <ToolButton toolType="selection" icon="🔲" label="Select" />
          <ToolButton toolType="rectangle" icon="▭" label="Rectangle" />
          <ToolButton toolType="circle" icon="○" label="Circle" />
          <ToolButton toolType="arrow" icon="→" label="Arrow" />
          <ToolButton toolType="line" icon="/" label="Line" />
          <ToolButton toolType="pen" icon="✏️" label="Draw" />
          <ToolButton toolType="eraser" icon="🧹" label="Eraser" />

          <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>

          {/* Color Picker */}
          <div className="flex flex-col items-center gap-2 py-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Stroke</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Fill Color */}
          <div className="flex flex-col items-center gap-2 py-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Fill</label>
            <div className="relative">
              <input
                type="color"
                value={fillColor === 'transparent' ? '#ffffff' : fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300 dark:border-gray-600"
                disabled={fillColor === 'transparent'}
              />
              <button
                onClick={() => setFillColor(fillColor === 'transparent' ? '#ffffff' : 'transparent')}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center"
                title={fillColor === 'transparent' ? 'Enable fill' : 'Disable fill'}
              >
                {fillColor === 'transparent' ? '+' : '×'}
              </button>
            </div>
          </div>

          {/* Stroke Width */}
          <div className="flex flex-col items-center gap-2 py-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Size</label>
            <div className="flex flex-col gap-1">
              {[1, 2, 4, 8].map((width) => (
                <button
                  key={width}
                  onClick={() => setStrokeWidth(width)}
                  className={`w-12 h-8 rounded flex items-center justify-center ${
                    strokeWidth === width
                      ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                      : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <div
                    className="bg-gray-800 dark:bg-gray-200 rounded-full"
                    style={{ width: '100%', height: `${width}px` }}
                  ></div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Top Toolbar */}
          <div className="flex gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
            <button
              onClick={handleUndo}
              disabled={elements.length === 0}
              className="px-4 py-2 rounded-lg font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ↶ Undo
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-lg font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              🗑️ Clear
            </button>
            <div className="flex-1"></div>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              💾 Export as PNG
            </button>
          </div>

          {/* Canvas */}
          <div className="flex-1 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white shadow-lg">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`w-full h-full ${
                tool === 'pen' || tool === 'eraser' ? 'cursor-crosshair' : 'cursor-default'
              }`}
              style={{ touchAction: 'none' }}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
