# Createathon React Application

This is the frontend for the Createathon platform, built with React, TypeScript, and Vite.

## Getting Started

### Prerequisites

- Node.js (version 18.x or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/createathon-react.git
cd createathon-react

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

### Building for Production

```bash
# Create production build
npm run build
```

## Deployment Options

### IIS Deployment

This application can be deployed to IIS. See the [IIS-DEPLOYMENT.md](./IIS-DEPLOYMENT.md) file for detailed instructions.

### CI/CD Pipelines

This project includes GitHub Actions workflows for continuous integration and deployment:

- **CI Pipeline**: Builds and tests the application on every push and pull request
- **CD Pipeline**: Automatically deploys to production when changes are pushed to the main branch
- **Staging Pipeline**: Deploys to staging environments for testing

For detailed setup instructions, see the [CICD-SETUP.md](./CICD-SETUP.md) file.

## Environment Configuration

Environment variables are used for configuration and can be set in the following files:

- `.env` - Development environment
- `.env.production` - Production environment

Key environment variables:

```
VITE_API_BASE_URL=https://api.createathon.co
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

## Project Structure

```
/src
  /Components       # Reusable UI components
  /SubComponents    # Smaller component units
  /assets           # Static assets
  /lib              # Utility functions and helpers
  /data             # Static data and constants
  App.tsx           # Main application component
  main.tsx          # Application entry point
  config.ts         # Configuration and environment variables
```

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit your changes: `git commit -m 'Add some feature'`
3. Push to the branch: `git push origin feature/my-feature`
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

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
