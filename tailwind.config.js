// tailwind.config.js
// This code is a configuration file for the Tailwind CSS library. It specifies the content paths, screens sizes, background images, color palette, and plugins to be used.
// 
// The `content` property specifies the file paths in which Tailwind CSS should look for classes to be included in the generated CSS file.
// 
// The `theme` property defines the customization options for the generated CSS. It includes the screen breakpoints and extends the default styles for background images and colors.
// 
// The `screens` property defines the screen sizes for responsive design. Each key represents a screen size and its corresponding value is a CSS pixel value.
// 
// The `extend` property allows for extending the default styles provided by Tailwind CSS. Here, it extends the background images by adding two custom gradients and extends the colors by adding a custom primary color palette.
// 
// The `plugins` property allows for adding additional plugins to Tailwind CSS.
// 
// The commented out `darkMode` property can be used to enable dark mode for the generated CSS.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '350px',
      sm: '480px',
      semism: '540px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"}
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}
