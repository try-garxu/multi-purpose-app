# Multi-Purpose Tools Hub 🛠️

A comprehensive web application featuring 14+ powerful tools for productivity, content creation, and development. Built with Next.js, TypeScript, and Tailwind CSS.

![Multi-Purpose Tools Hub](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-06B6D4?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 📄 PDF Tools
- **PDF Merger** - Combine multiple PDF files into one document with drag-and-drop reordering

### 🖼️ Image Tools
- **Image Format Converter** - Convert between PNG, JPEG, and WebP formats
- **Image Resizer** - Resize images with aspect ratio lock and preset dimensions

### 🔒 Security & Privacy
- **Protected Text Share** - Share encrypted text with AES-256 encryption (no login required)
- All encryption happens client-side - your data never leaves your browser

### 📝 Productivity
- **Note Taking** - Rich text editor with formatting, lists, and local storage
- **Drawing Board** - Powerful sketching tool powered by Excalidraw
- **Calculator** - Advanced calculator with keyboard shortcuts
- **Lorem Ipsum Generator** - Generate placeholder text for designs

### 🛠️ Developer Tools
- **QR Code Generator** - Create QR codes for URLs, WiFi, contacts, and more
- **JSON Formatter** - Format, validate, and minify JSON data
- **Base64 Encoder/Decoder** - Encode and decode Base64 strings
- **Hash Generator** - Generate MD5, SHA-1, SHA-256, SHA-512, and SHA-3 hashes
- **Color Picker** - Pick colors and get values in HEX, RGB, HSL formats
- **URL Shortener** - Create short, memorable URLs (demo version)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd multi-purpose-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🏗️ Tech Stack

- **Framework**: Next.js 16.0 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **Rich Text Editor**: Tiptap
- **Drawing**: Excalidraw
- **PDF Processing**: pdf-lib
- **QR Codes**: qrcode
- **Encryption**: crypto-js

## 📁 Project Structure

```
multi-purpose-app/
├── app/
│   ├── tools/
│   │   ├── pdf-merger/
│   │   ├── image-converter/
│   │   ├── image-resizer/
│   │   ├── text-share/
│   │   ├── notes/
│   │   ├── draw/
│   │   ├── qr-generator/
│   │   ├── json-formatter/
│   │   ├── base64/
│   │   ├── hash-generator/
│   │   ├── calculator/
│   │   ├── lorem-ipsum/
│   │   ├── color-picker/
│   │   └── url-shortener/
│   ├── layout.tsx
│   ├── page.tsx                   # Homepage with tool cards
│   └── globals.css
├── components/
│   └── ToolLayout.tsx             # Shared layout for tools
├── public/
├── package.json
└── README.md
```

## 🎨 Features in Detail

### PDF Merger
- Upload multiple PDF files
- Drag to reorder before merging
- Client-side processing (no server upload)
- Download merged PDF

### Image Tools
- **Converter**: Support for PNG, JPEG, WebP
- **Resizer**: Custom dimensions or preset sizes
- Aspect ratio lock option
- Quality control for lossy formats

### Protected Text Share
- End-to-end AES-256 encryption
- Password-protected sharing
- No server storage
- Shareable encrypted links

### Note Taking
- Rich text formatting (bold, italic, strikethrough, code)
- Lists (bullet and numbered)
- Blockquotes
- Local storage persistence
- Export to HTML

### Drawing Board
- Full Excalidraw integration
- Multiple shapes and tools
- Text annotations
- Export capabilities

### Developer Tools
- **QR Generator**: Multiple data types (URL, email, phone, WiFi)
- **JSON Formatter**: Syntax validation, formatting, minification
- **Base64**: Two-way encoding/decoding
- **Hash Generator**: Multiple algorithms
- **Color Picker**: Multiple format outputs

## 🔐 Privacy & Security

- **Client-Side Processing**: Most tools process data entirely in your browser
- **No Data Collection**: We don't collect or store your data
- **Encryption**: Text sharing uses AES-256 encryption
- **Open Source**: Full transparency in how your data is handled

## 🌟 Key Highlights

- ✅ 14+ Professional tools in one app
- ✅ Modern, responsive UI with dark mode support
- ✅ Client-side processing for privacy
- ✅ No login required for any feature
- ✅ Free and open source
- ✅ Works offline for most tools
- ✅ Mobile-friendly design

## 🛣️ Roadmap

Future feature ideas:
- [ ] Video format converter
- [ ] Audio file editor
- [ ] CSV to JSON converter
- [ ] Markdown editor
- [ ] Code snippet sharing
- [ ] OCR text extraction
- [ ] File compression tool
- [ ] Background removal tool

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Drawing tool by [Excalidraw](https://excalidraw.com/)
- Rich text editor by [Tiptap](https://tiptap.dev/)
- PDF processing by [pdf-lib](https://pdf-lib.js.org/)

## 📧 Contact

For questions, suggestions, or issues, please open an issue on GitHub.

---

**Made with ❤️ using Next.js and TypeScript**
