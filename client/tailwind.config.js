/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New Light Blue Theme
        'primary': '#E8F4FD',      // Lightest blue background
        'secondary': '#B8D8F0',    // Medium light blue
        'accent': '#4A9BC7',       // Accent blue
        'dark': '#1A3A5C',         // Dark blue for text
        
        // Brand Colors (keeping the cyan for consistency)
        'cyan': '#00B4D8',         // Bright cyan (changed from #00D4FF)
        'blue': '#0077B6',         // Deep blue (changed from #0066FF)
        
        // Text Colors
        'text-light': '#1A3A5C',   // Dark text on light backgrounds
        'text-dark': '#FFFFFF',    // Light text on dark backgrounds
        
        // UI Elements
        'card-bg': '#FFFFFF',      // White cards
        'card-border': '#B8D8F0',  // Light border
        'hover-bg': '#D4E8F5',     // Hover background
        
        // Keep these for dark sections
        'navy': '#0A1628',
        'dark-navy': '#0A1628',
        'light-navy': '#0F1F3A',
        'card-bg-dark': '#1A2D4A',
        'text-gray': '#B0C4DE',
      },
    },
  },
  plugins: [],
}