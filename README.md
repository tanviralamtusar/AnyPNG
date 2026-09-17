# AnyPNG 🚀

<p align="center">
  <a href="https://github.com/tanviralamtusar/AnyPNG">
    <img src="extension/icons/Anypng.png" alt="AnyPNG Project Logo - Professional AI Image Toolset" width="128" height="128" loading="lazy">
  </a>
</p>

**AnyPNG** is a professional Chrome Extension that gives you a powerful AI-driven image toolset directly in your browser's right-click menu. Upscale images, remove backgrounds, or erase watermarks instantly using your own self-hosted AI backend.

**Try it out today!** 🚀

## ✨ Features

- **AI Upscaling**: Choice between **2x Dynamic** (Balanced) and **4x Ultra** (HD Quality) scaling.
- **Background Removal**: Cleanly extract subjects from any background with one click.
- **Watermark Removal**: Seamlessly erase watermarks from images. Supports **Gemini 1.5 Flash** for advanced AI-driven removal.
- **Local Format Conversion**: Convert any web image to **PNG**, **WebP**, or **AVIF** locally — no upload, no server.
  PNG and WebP use the browser's canvas encoder; AVIF uses a bundled libavif (WASM) build, since Chrome's canvas cannot encode AVIF.
  Transparency is preserved in all three. Quality for the lossy formats is configurable in Settings.
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

## One-click watermark removal

Right-click an image and choose **AnyPNG → Remove Watermark & Download**. The extension sends the image to the existing server AI endpoint, verifies the signed-in Supabase account, charges one inpainting credit, downloads the repaired PNG, and shows an error notification if processing fails. No local AI/editor page is opened.

The Vite/WebGPU editor files remain in the repository for development experiments, but they are no longer used by the extension context-menu workflow.

### Production credits

Local inference is gated by `POST /inpaint/authorize`. The extension sends only the signed-in Supabase access token; it never uploads the image or mask. The API validates the token with Supabase Auth, atomically consumes one credit from the existing `profiles.credits` balance, and returns a short-lived permit.

Configure the API with `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and a private random `INPAINT_PERMIT_SECRET`. Never ship the service-role key or permit secret in the extension. If authorization is unavailable or the user has no credits, local inference does not start.

*Built with ❤️ for professional image workflows.*
