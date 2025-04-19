module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["Playfair Display", "Playfair", "serif"],
      },
      screens: {
        "3xl": "1600px", // Add custom breakpoint for 3xl
      },
      animation: {
        "gradient-shift": "gradient-shift 8s ease infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "float-cards": "float-cards 4s ease-in-out infinite",
        pulse: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
        "float-cards": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        pulse: {
          "0%, 100%": {
            opacity: 0.2,
          },
          "50%": {
            opacity: 0.15,
          },
        },
      },
      perspective: {
        1000: "1000px",
      },
      maxWidth: {
        "7xl": "80rem",
      },
    },
  },
  plugins: [],
};
