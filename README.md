# Createathon React Application

A modern React application built with TypeScript, Vite, and TailwindCSS. This project provides a robust foundation for building scalable web applications with modern best practices.

## 🚀 Features

- ⚡️ **Lightning Fast** - Built with Vite for rapid development and optimized builds
- 🎯 **Type Safe** - Written in TypeScript for better developer experience
- 🎨 **Modern UI** - Styled with TailwindCSS and Radix UI components
- 📱 **Responsive** - Mobile-first design approach
- ♿️ **Accessible** - ARIA-compliant components and keyboard navigation
- 🔒 **Secure** - Built-in security best practices
- 🧪 **Testable** - Set up for unit and integration testing
- 📦 **Optimized** - Code splitting and performance optimizations

## 📚 Documentation

- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [Development Guide](./docs/DEVELOPMENT.md)
- [API Reference](./docs/API.md)
- [IIS Deployment Guide](./IIS-DEPLOYMENT.md)
- [CI/CD Setup Guide](./CICD-SETUP.md)

## 🛠 Getting Started

### Prerequisites

- Node.js (version 18.0.0 or higher)
- npm (comes with Node.js)
- Git

### Quick Start

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd createathon-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173` to see your application.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (when configured)

## 🏗 Project Structure

```
createathon-react/
├── src/
│   ├── Components/     # Reusable UI components
│   ├── SubComponents/ # Smaller component pieces
│   ├── assets/       # Static assets
│   ├── data/        # Static data and constants
│   ├── lib/         # Utility functions and hooks
│   ├── pages/       # Page components
│   ├── utils/       # Utility functions
│   ├── App.tsx      # Main application component
│   └── main.tsx     # Application entry point
├── public/          # Static files
├── docs/           # Documentation
├── tests/         # Test files
└── [config files] # Various configuration files
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=your_api_url
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_key
```

### TailwindCSS

Customize the theme in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...}
      }
    }
  }
}
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deployment Options

- **IIS**: Follow the [IIS Deployment Guide](./IIS-DEPLOYMENT.md)
- **CI/CD**: Configure using [CI/CD Setup Guide](./CICD-SETUP.md)
- **Static Hosting**: Deploy the `dist/` directory to any static hosting service

## 🧪 Testing

```bash
npm run test        # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email [support@example.com](mailto:support@example.com) or join our Slack channel.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
