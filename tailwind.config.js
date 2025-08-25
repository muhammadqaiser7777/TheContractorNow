module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        typing: {
          '0%': { width: '0%' },
          '50%': { width: '100%' },
          '100%': { width: '0%' },
        },
        blink: {
          '50%': { borderColor: 'transparent' },
        },
      },
      animation: {
        typing: 'typing 6s steps(40, end) infinite, blink 0.7s step-end infinite',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        myTheme: {
          primary: "#ffb000",
          secondary: "#1f2020",
          accent: "#9C27B0",
          neutral: "#F5F5F5",
          "base-100": "#FFFFFF",
          info: "#209CEE",
          success: "#22C55E",
          warning: "#FACC15",
          error: "#FF5733",
        },
      },
    ],
  },
};
