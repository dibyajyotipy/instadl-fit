# 📐 InstaDL Fit — Fit Photos without Cropping

[![Astro](https://img.shields.io/badge/Astro-v5.0.0-%23FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0.0-%2338B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-v5.0-%23646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.4-%23007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**InstaDL Fit** is a premium, open-source web application that lets you prepare and resize your landscape, portrait, and DSLR photos to fit perfectly within Instagram, Reels, TikTok, YouTube, and other social media aspect ratios—without cropping a single pixel.

Featuring a Vercel-inspired dark/light minimalist aesthetic, it is built for speed, responsiveness, and absolute privacy.

> [!IMPORTANT]  
> **100% Client-Side Processing:** Your images are processed entirely within your browser using HTML5 Canvas. No data is ever uploaded to a server, ensuring complete privacy.

---

## 🌟 Key Features

*   **✨ Smart Background Modes**
    *   **Blur Mode:** Automatically extracts your photo, expands the container to your selected aspect ratio, and adds a beautifully-blurred version of your photo in the background.
    *   **Solid Colors:** Choose from a sleek color palette (white, canvas, black) or use a custom hex color picker to create borders that match your feed.
*   **📐 Aspect Ratio Presets**
    *   Instagram Square (`1:1`)
    *   Instagram Portrait (`4:5`)
    *   Instagram Landscape (`1.91:1`)
    *   Reels / TikTok / Shorts (`9:16`)
    *   YouTube / Landscape (`16:9`)
    *   Custom ratio calculator with auto-bounding.
*   **🔍 Interactive Workspace Controls**
    *   **Compare Button:** Hold down the `Compare` button to instantly see a side-by-side reference with your original photo.
    *   **Split View Slider:** Toggle an interactive slider overlay to inspect original and adjusted canvas pixels in real-time.
    *   **Fine-Tune controls:** Adjust blur amount, padding, scale, background opacity, and horizontal/vertical centering alignment.
*   **⚡ Pro Performance**
    *   **High-Resolution Canvas Export:** Exports up to full raw image resolution.
    *   **Quick Export:** One-click instant download.
    *   **Keyboard Shortcuts:** Navigate layouts, ratios, and quick tasks with hotkeys.

---

## 🛠️ Tech Stack

*   **Framework:** [Astro v5.0](https://astro.build) (Static-Site Generation with selective client-side hydration)
*   **Styling:** [Tailwind CSS v4.0](https://tailwindcss.com) (Modern CSS utility framework with next-generation compiler)
*   **Bundler:** [Vite](https://vitejs.dev)
*   **Language:** [TypeScript](https://www.typescriptlang.org)
*   **Canvas Engine:** Vanilla JavaScript HTML5 2D Context Engine for lightning-fast local image rendering.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v18.x or higher is recommended) along with `npm` or `pnpm`.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dibyajyotipy/instadl-fit.git
   cd instadl-fit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:4321`.

### Build for Production

To build a optimized production bundle:
```bash
npm run build
```
You can preview the built static pages locally:
```bash
npm run preview
```

---

## 📁 Project Structure

```text
├── src/
│   ├── components/        # UI components (Canvas, Selectors, Panels, Faqs, etc.)
│   │   ├── EditorApp.astro          # Core editor shell
│   │   ├── PreviewCanvas.astro      # Main drawing canvas & rendering loop
│   │   ├── RatioSelector.astro      # Aspect ratio selection list
│   │   └── ...
│   ├── layouts/           # Page wrapper layouts
│   │   └── Layout.astro             # Global layout containing SEO headers & Nav
│   ├── pages/             # Astro file-system pages & routing
│   │   ├── index.astro              # Homepage containing the Editor App
│   │   ├── blog/                    # Content blog directory
│   │   └── ...
│   └── styles/            # Global custom stylesheets
│       └── global.css
├── public/                # Static assets (favicons, manifest, service worker)
├── astro.config.mjs       # Astro configuration file
├── package.json           # Dependencies and project scripts
└── tsconfig.json          # TypeScript configurations
```

---

## 🎨 Design System

InstaDL Fit adheres to a stark, clean, black-and-white minimalist design system:
*   **Canvas (`#ffffff`):** Soft, clean content cards.
*   **Canvas Soft (`#fafafa`):** Default page background.
*   **Ink (`#171717`):** Primary text and primary CTA buttons.
*   **Borders (`#ebebeb`):** 1px hairline separators for panels.
*   **Accents:** Sleek gradients used sparingly for buttons and hover micro-animations to create a premium feel.

Detailed specifications can be found in the [DESIGN.md](file:///C:/Users/Administrator/OneDrive/Desktop/instadl-app/DESIGN.md) file.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

*Crafted with 🖤 by [dibyajyotipy](https://github.com/dibyajyotipy) and contributors.*
