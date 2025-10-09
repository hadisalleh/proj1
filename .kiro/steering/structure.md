# Project Structure

## Organization Principles
- Keep related files grouped together
- Separate concerns clearly (business logic, UI, configuration)
- Use consistent naming conventions
- Maintain a flat structure when possible, avoid deep nesting

## Common Directory Structure
```
/
├── src/                 # Source code
│   ├── components/      # Reusable components
│   ├── utils/          # Utility functions
│   ├── types/          # Type definitions
│   └── config/         # Configuration files
├── tests/              # Test files
├── docs/               # Documentation
├── public/             # Static assets (if web project)
├── .kiro/              # Kiro configuration and steering
└── README.md           # Project documentation
```

## File Naming Conventions
- Use kebab-case for directories: `user-profile/`
- Use camelCase for JavaScript/TypeScript files: `userService.js`
- Use PascalCase for components: `UserProfile.jsx`
- Use UPPER_CASE for constants: `API_ENDPOINTS.js`

## Guidelines
- Keep files focused on a single responsibility
- Group related functionality in modules
- Use index files to create clean import paths
- Place configuration files at appropriate levels
- Keep the root directory clean and organized