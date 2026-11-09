# Amul Animated Website

A visually rich, animated product landing page for Amul Kool, built with HTML, CSS, and JavaScript. The project includes a smooth scrolling experience, GSAP-driven animations, a preloader, and a canvas-based image sequence that simulates a premium product reveal.

## Live Demo

[View the live website](https://ani1-tau.vercel.app/)

## Project Overview

This website is designed as a modern marketing landing page for an Amul Kool beverage campaign. It uses:

- HTML5 for page structure
- CSS3 for layout, styling, and responsive design
- JavaScript for animation logic and interactivity
- GSAP + ScrollTrigger for scroll-based motion effects
- Lenis for smooth scroll behavior
- Canvas and preloaded image frames for the hero sequence animation

## Features

- Smooth scrolling experience
- Animated hero section with product reveal sequence
- Scroll-triggered storytelling cards
- Flavour showcase cards
- Premium product-brand styling and layout
- Responsive design for multiple screen sizes
- Preloader with progress bar and percentage indicator

## Project Structure

```text
Amul_Animated_Website/
├── Aimation_Images/          # Preloaded animated image frames
├── app.js                    # Animation and scroll logic
├── cool.png                  # Brand/product image
├── index.html                # Main webpage structure
├── style.css                 # Website styling
├── Amul_video.mp4            # Supporting media asset
├── End.jpeg                  # Asset image
├── Milk_swirl...mp4          # Video asset
├── start.jpeg                # Asset image
├── chatgpt_img.png           # Asset image
├── .gitignore
└── README.md
```

## Requirements

### Minimum

- A modern web browser (Chrome, Edge, Firefox, Safari)
- Internet access for CDN-based libraries (Lenis and GSAP) if they are not already cached locally

### Optional for local serving

- Node.js and npm (recommended if you want to serve the project locally with a static server)

## How to Run the Project

### Option 1: Open directly in browser

1. Open the project folder.
2. Double-click `index.html`.
3. The landing page should open in your default browser.

Note: This method works for most static HTML/CSS/JS projects, but some browsers may behave better when served from a local web server.

### Option 2: Run using a local web server

From the project root, run:

```bash
npx serve . -l 8000
```

Then open:

```text
http://localhost:8000
```

If you are using a local terminal and want to avoid `npx`, you can also use a simple Python HTTP server (if Python is installed):

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Notes

- The project relies on remote CDN scripts for GSAP and Lenis, so an internet connection is required for the animations to load correctly.
- Large media assets and frame images are stored in the project folder and are used by the animation engine in `app.js`.
- If you plan to make changes to the animation timing or styling, edit `app.js` and `style.css` respectively.

## License

This project is for demo and educational purposes. Please check any branding and asset usage rights before using the materials commercially.
