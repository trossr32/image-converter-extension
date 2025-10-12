# Image Converter - Chrome Extension

> **Published Chrome Extension for Instant Image Format Conversion**

A lightweight Chrome extension that converts images to PNG or JPG formats directly from your browser's context menu. Eliminates the need for external tools or websites to handle common image format conversions.

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Published-brightgreen?logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/image-converter/ggmgkgljhkmhflbacicgdnkeonanmpfe)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.2-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## Key Features

**Right-Click Context Menu Integration**

- Convert any image to PNG or JPG with a simple right-click
- Seamless browser integration without disrupting workflow
- Instant downloads with preserved image quality

**Smart Format Handling**

- Converts WebP, AVIF, and other modern formats to universal PNG/JPG
- Maintains original image dimensions and quality
- Automatic filename preservation with format extension updates

**Zero Dependencies**

- Pure TypeScript implementation for reliability
- No external APIs or third-party services required
- Privacy-focused: all processing happens locally in your browser

---

## Installation & Usage

### Chrome Web Store

**[Install from Chrome Web Store →](https://chromewebstore.google.com/detail/image-converter/ggmgkgljhkmhflbacicgdnkeonanmpfe)**

### Manual Installation

```bash
git clone https://github.com/your-username/image-converter-extension.git
cd image-converter-extension
npm install
npm run build
```

Load the `dist` folder as an unpacked extension in Chrome Developer Mode.

### How to Use

1. **Right-click** on any image in your browser
2. **Select "Convert Image"** from the context menu
3. **Choose format**: PNG for transparency/quality, JPG for smaller file size
4. **Download starts automatically** with the converted image

---

## Technical Implementation

### Core Technologies

- **TypeScript 5.0.4**: Type-safe development with modern language features
- **Chrome Extension Manifest V3**: Latest extension platform with enhanced security
- **Canvas API**: Client-side image processing and format conversion
- **Tailwind CSS**: Utility-first styling for clean UI components

### Architecture Overview

```
Background Script → Context Menu Creation → Content Script Message Passing →
Canvas Processing → Format Conversion → Automatic Download
```

### Key Components

- **`background.ts`**: Context menu registration and message routing
- **`content.ts`**: Image processing logic with Canvas API integration
- **`popup.html`**: User interface with usage instructions and support links

---

## Development

### Available Scripts

```bash
npm install     # Install development dependencies
npm run dev     # Development build with watch mode
npm run build   # Production build for Chrome Web Store
npm run lint    # TypeScript and code quality checks
npm run format  # Prettier code formatting
```

### Project Structure

```
image-converter-extension/
├── src/
│   ├── background.ts    # Service worker and context menu logic
│   ├── content.ts       # Image processing and conversion
│   ├── popup.html       # Extension popup interface
│   └── index.css        # Tailwind CSS styles
├── public/
│   ├── manifest.json    # Extension configuration
│   └── icons/           # Extension icons (16px, 48px, 128px)
└── dist/                # Built extension files
```

---

## Browser Compatibility

**Supported Formats:**

- **Input**: WebP, AVIF, PNG, JPG, GIF, BMP, SVG
- **Output**: PNG (lossless), JPG (optimized quality)

**Chrome Requirements:**

- Chrome 88+ (Manifest V3 support)
- Canvas API support (available in all modern browsers)

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/improvement`
3. Make changes and test thoroughly
4. Commit with clear messages: `git commit -m 'Add feature description'`
5. Push and create a Pull Request

**Development Guidelines:**

- Maintain TypeScript strict mode compliance
- Follow existing code style and formatting
- Test conversions with various image formats
- Ensure compatibility with Manifest V3 requirements

---

## Support & Feedback

**Chrome Web Store**: [Leave a review](https://chromewebstore.google.com/detail/image-converter/ggmgkgljhkmhflbacicgdnkeonanmpfe) to help other users discover the extension

**Development Support**: [Buy me a coffee](https://ko-fi.com/mundanesunrise) to support continued development and improvements

**Issues & Features**: Use GitHub Issues for bug reports and feature requests

---

## License

MIT License - see [LICENSE](./LICENSE) file for details.
