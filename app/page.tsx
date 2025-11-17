import Link from "next/link";
import {
  FileText, Image as ImageIcon, Maximize,
  Lock, StickyNote, Pencil, QrCode, Link2, Code,
  Calculator, Hash, FileJson, Type, Palette
} from "lucide-react";

interface Tool {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const tools: Tool[] = [
  {
    title: "PDF Merger",
    description: "Merge multiple PDF files into one",
    icon: <FileText className="w-6 h-6" />,
    href: "/tools/pdf-merger",
    color: "bg-red-500"
  },
  {
    title: "Image Converter",
    description: "Convert between image formats",
    icon: <ImageIcon className="w-6 h-6" />,
    href: "/tools/image-converter",
    color: "bg-green-500"
  },
  {
    title: "Image Resizer",
    description: "Resize images to any dimension",
    icon: <Maximize className="w-6 h-6" />,
    href: "/tools/image-resizer",
    color: "bg-yellow-500"
  },
  {
    title: "Protected Text Share",
    description: "Share encrypted text securely",
    icon: <Lock className="w-6 h-6" />,
    href: "/tools/text-share",
    color: "bg-indigo-500"
  },
  {
    title: "Note Taking",
    description: "Rich text notes like Notion",
    icon: <StickyNote className="w-6 h-6" />,
    href: "/tools/notes",
    color: "bg-pink-500"
  },
  {
    title: "Drawing Board",
    description: "Draw and sketch like Excalidraw",
    icon: <Pencil className="w-6 h-6" />,
    href: "/tools/draw",
    color: "bg-orange-500"
  },
  {
    title: "QR Code Generator",
    description: "Generate QR codes instantly",
    icon: <QrCode className="w-6 h-6" />,
    href: "/tools/qr-generator",
    color: "bg-teal-500"
  },
  {
    title: "URL Shortener",
    description: "Create short URLs",
    icon: <Link2 className="w-6 h-6" />,
    href: "/tools/url-shortener",
    color: "bg-cyan-500"
  },
  {
    title: "JSON Formatter",
    description: "Format and validate JSON",
    icon: <FileJson className="w-6 h-6" />,
    href: "/tools/json-formatter",
    color: "bg-violet-500"
  },
  {
    title: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64",
    icon: <Code className="w-6 h-6" />,
    href: "/tools/base64",
    color: "bg-fuchsia-500"
  },
  {
    title: "Hash Generator",
    description: "Generate MD5, SHA hashes",
    icon: <Hash className="w-6 h-6" />,
    href: "/tools/hash-generator",
    color: "bg-rose-500"
  },
  {
    title: "Calculator",
    description: "Advanced calculator",
    icon: <Calculator className="w-6 h-6" />,
    href: "/tools/calculator",
    color: "bg-amber-500"
  },
  {
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text",
    icon: <Type className="w-6 h-6" />,
    href: "/tools/lorem-ipsum",
    color: "bg-lime-500"
  },
  {
    title: "Color Picker",
    description: "Pick and convert colors",
    icon: <Palette className="w-6 h-6" />,
    href: "/tools/color-picker",
    color: "bg-emerald-500"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Multi-Purpose Tools Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your all-in-one toolkit for productivity. Free, fast, and works right in your browser.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <Link
              key={index}
              href={tool.href}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6"
            >
              <div className="flex flex-col items-start space-y-4">
                <div className={`${tool.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform duration-300`}>
                  {tool.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-600 dark:text-gray-400">
          <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
          <p className="mt-2 text-sm">All processing happens in your browser. Your data never leaves your device.</p>
        </div>
      </div>
    </div>
  );
}
