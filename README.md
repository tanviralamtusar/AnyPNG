# AnyPNG 🚀

<p align="center">
  <a href="https://github.com/tanviralamtusar/AnyPNG">
    <img src="extension/icons/Anypng.png" alt="AnyPNG Project Logo - Professional AI Image Toolset" width="128" height="128" loading="lazy">
  </a>
</p>

**AnyPNG** is a professional Chrome Extension that gives you a powerful image toolset directly in your browser's right-click menu. Convert, upscale, and remove backgrounds using your own self-hosted AI backend.

**Try it out today!** 🚀

## ✨ Features

- **AI Upscaling**: Choice between **2x Dynamic** (Balanced) and **4x Ultra** (HD Quality) scaling.
- **Background Removal**: Cleanly extract subjects from any background with one click.
- **Local Format Conversion**: Convert any web image to **PNG**, **WebP**, or **AVIF** locally — no upload, no server.
  PNG and WebP use the browser's canvas encoder; AVIF uses a bundled libavif (WASM) build, since Chrome's canvas cannot encode AVIF.
  Transparency is preserved in all three. Quality for the lossy formats is configurable in Settings.
- **Google Drive Folder Downloads**: On a Google Drive folder page, use the AnyPNG panel to scan for common image and video formats and download each file separately to `Downloads/Drive media`, with progress, stop controls, and large-file confirmation support.
- **Loading Overlay**: A beautiful glass-morphism loading screen appears during AI processing to keep you informed.
- **API Connection Tester**: Easily verify your server connection directly from the settings page.
- **Modern UI**: A premium, glassmorphism-inspired settings page for easy configuration.
- **Self-Hosted Privacy**: Routes all AI requests to our own VPS instance, ensuring data stays private and costs stay low.

## 🛠️ Installation

1. **Download the latest release**:
   Go to the [Releases](https://github.com/tanviralamtusar/AnyPNG/releases) page and download the `AnyPNG.V1.0.zip` file.
2. **Extract the file**:
   Extract the downloaded zip file to a folder on your computer.
3. **Open Chrome Extensions**:
   Navigate to `chrome://extensions/` in your browser.
4. **Load Unpacked**:
   Enable "Developer mode" in the top right, then click "Load unpacked" and select the extracted `anypng` folder.
5. **Configure**:
   Right-click the AnyPNG icon in your toolbar, select **Options**, and set your default Upscale Engine.
   
---

*Built with ❤️ for professional image workflows.*
