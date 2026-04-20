/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#130a22',
        plum: '#241238',
        iris: '#8e4dff',
        violet: '#c06cff',
        blush: '#ff7ecf',
        moon: '#f5ecff',
        mist: '#c5b2e7',
        sky: '#69a3ff',
        ember: '#ff9a62'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        glow: '0 22px 70px rgba(142, 77, 255, 0.28)',
        panel: '0 28px 80px rgba(8, 3, 20, 0.48)'
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};
