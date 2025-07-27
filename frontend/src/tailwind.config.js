module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#1D4ED8', // Blue for buttons and accents
          secondary: '#6B7280', // Gray for secondary elements
          background: '#F3F4F6', // Light gray background
          card: '#FFFFFF', // White for cards
          accent: '#10B981', // Green for success states
          danger: '#EF4444', // Red for errors
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };