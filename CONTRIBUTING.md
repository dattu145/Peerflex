# Contributing to Peerflex

Thank you for your interest in contributing to Peerflex! We welcome contributions from developers of all skill levels. This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [UI/UX Contributions](#uiux-contributions)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18.x or higher)
- npm (v9.x or higher) or yarn
- Git
- A code editor (VS Code recommended)
- A Supabase account

### Fork and Clone the Repository

1. Fork the repository by clicking the "Fork" button at the top right of the repository page
2. Clone your fork to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/Peerflex.git
cd Peerflex
```

3. Add the upstream repository as a remote:

```bash
git remote add upstream https://github.com/dattu145/Peerflex.git
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment Variables

1. Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

2. Fill in your Supabase credentials in the `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run the Development Server

```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

## How to Contribute

There are many ways to contribute to Peerflex:

- Fix bugs
- Add new features
- Improve documentation
- Enhance UI/UX design
- Write tests
- Review pull requests
- Report issues

## Development Workflow

### 1. Find or Create an Issue

Before starting work, check if there's an existing issue for what you want to do. If not, create one to discuss your proposed changes.

Look for issues labeled:
- `good first issue` - Great for newcomers
- `help wanted` - Contributions welcome
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `design` - UI/UX improvements

### 2. Create a Branch

All branches must follow this naming convention:

```
issue-NUMBER-brief-description
```

Examples:
```bash
git checkout -b issue-42-fix-login-button
git checkout -b issue-15-add-dark-mode
git checkout -b issue-23-improve-mobile-layout
```

**Important**: The branch name must start with `issue-` followed by the issue number, then a brief description using hyphens.

### 3. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Keep changes focused on the issue you're addressing
- Test your changes thoroughly

### 4. Keep Your Branch Updated

Regularly sync your branch with the upstream repository:

```bash
git fetch upstream
git rebase upstream/main
```

### 5. Run Tests

Before submitting your changes, ensure everything works:

```bash
# Run the development server and test manually
npm run dev

# Build the project to check for errors
npm run build

# If tests are available, run them
npm run test
```

## Coding Standards

### General Principles

- Write clear, self-documenting code
- Follow the DRY (Don't Repeat Yourself) principle
- Keep functions small and focused
- Use meaningful variable and function names
- Add comments for complex logic only

### TypeScript Guidelines

- Use TypeScript for type safety
- Define interfaces for component props
- Avoid using `any` type unless absolutely necessary
- Use proper type annotations for function parameters and return values

Example:
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  // Implementation
};
```

### React Guidelines

- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Use custom hooks for reusable logic
- Properly handle component lifecycle and cleanup

Example:
```typescript
import { useState, useEffect } from 'react';

const ExampleComponent = () => {
  const [data, setData] = useState<DataType | null>(null);

  useEffect(() => {
    // Fetch data
    return () => {
      // Cleanup
    };
  }, []);

  return <div>{/* JSX */}</div>;
};
```

### CSS and Styling

- Use TailwindCSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing using Tailwind's spacing scale
- Avoid inline styles unless necessary for dynamic values

Example:
```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  Click Me
</button>
```

### File Organization

- Place components in appropriate directories
- Keep related files together
- Use index files for cleaner imports
- Separate business logic from UI components

### Code Formatting

We recommend using Prettier and ESLint for consistent code formatting.

#### Setting Up Prettier

1. Install Prettier:

```bash
npm install --save-dev prettier
```

2. Create a `.prettierrc` file in the root directory:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "avoid"
}
```

3. Add a format script to `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\""
  }
}
```

#### Setting Up ESLint

1. Install ESLint:

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

2. Create an `.eslintrc.json` file:

```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

3. Add a lint script to `package.json`:

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix"
  }
}
```

#### Running Format and Lint

```bash
# Format code
npm run format

# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix
```

## Commit Guidelines

### Commit Message Format

Follow this format for commit messages:

```
<type>: <subject> (#issue-number)

<body>

<footer>
```

#### Types

- **Feat**: A new feature
- **Fix**: A bug fix
- **Docs**: Documentation changes
- **Style**: Code style changes (formatting, missing semicolons, etc.)
- **Refactor**: Code refactoring without changing functionality
- **Test**: Adding or updating tests
- **Chore**: Maintenance tasks, dependency updates

#### Examples

```
Feat: Add dark mode toggle to settings page (#42)

Implemented a dark mode toggle in the settings page that persists
user preference in local storage and updates the theme globally.

- Added toggle component
- Integrated with theme context
- Persisted preference in localStorage
```

```
Fix: Resolve login button not responding on mobile (#15)

Fixed an issue where the login button was not clickable on mobile
devices due to incorrect z-index layering.
```

```
Docs: Update installation instructions in README (#23)

Added more detailed steps for setting up Supabase credentials
and clarified environment variable requirements.
```

### Commit Best Practices

- Make small, focused commits
- Write clear, descriptive commit messages
- Reference the issue number in commits
- Avoid committing unrelated changes together
- Test your changes before committing

## Pull Request Process

### Before Submitting

1. Ensure your code follows the coding standards
2. Test your changes thoroughly
3. Update documentation if necessary
4. Rebase your branch with the latest upstream main
5. Resolve any merge conflicts

### Creating a Pull Request

1. Push your branch to your fork:

```bash
git push origin issue-42-fix-login-button
```

2. Go to the original repository on GitHub
3. Click "New Pull Request"
4. Select your fork and branch
5. Fill out the pull request template

### Pull Request Template

When creating a pull request, include:

**Description**
- Brief description of changes
- Related issue number (e.g., "Closes #42")

**Type of Change**
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] UI/UX improvement
- [ ] Refactoring
- [ ] Other (please describe)

**Testing**
- Describe how you tested your changes
- List any manual testing steps

**Screenshots**
- Add screenshots for UI changes

**Checklist**
- [ ] My code follows the project's coding standards
- [ ] I have tested my changes
- [ ] I have updated the documentation
- [ ] My commits follow the commit guidelines
- [ ] I have rebased with the latest main branch

### Review Process

1. A maintainer will review your pull request
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited in the release notes

### Pull Request Guidelines

- PRs should target the `main` branch
- Keep PRs focused on a single issue or feature
- Provide a clear description of changes
- Include screenshots for UI changes
- Be responsive to feedback and requested changes
- Be patient - reviews may take a few days

## Reporting Bugs

### Before Reporting

- Check if the bug has already been reported
- Try to reproduce the bug in the latest version
- Collect relevant information about your environment

### Bug Report Template

When reporting a bug, include:

**Description**
Clear and concise description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g., Windows 10, macOS 12, Ubuntu 20.04]
- Browser: [e.g., Chrome 120, Firefox 121]
- Node version: [e.g., 18.17.0]
- npm version: [e.g., 9.6.7]

**Additional Context**
Any other relevant information

## Suggesting Features

We welcome feature suggestions! When suggesting a new feature:

### Feature Request Template

**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of what you want to happen

**Describe alternatives you've considered**
Other solutions or features you've considered

**Additional context**
Mockups, examples, or other context

**Implementation ideas**
If you have ideas about how to implement this

### Feature Evaluation Criteria

We evaluate features based on:
- Alignment with project goals
- Value to users
- Implementation complexity
- Maintenance burden
- Community interest

## UI/UX Contributions

We highly value UI/UX contributions and welcome design improvements!

### Design Contribution Process

1. **Identify an area for improvement**
   - Browse existing issues labeled `design`
   - Suggest new design improvements

2. **Create design mockups**
   - Use tools like Figma, Adobe XD, or Sketch
   - Follow the existing design language
   - Consider mobile responsiveness
   - Ensure accessibility

3. **Submit your design**
   - Open a new issue with the `design` label
   - Include mockups or wireframes
   - Explain the problem your design solves
   - Describe the user experience improvements

4. **Discuss and iterate**
   - Be open to feedback
   - Refine designs based on discussion
   - Consider technical feasibility

5. **Implementation**
   - Implement the approved design yourself, or
   - Collaborate with a developer to implement it

### Design Guidelines

**Color Palette**
- Primary: Purple and blue gradients
- Background: Dark theme (#0f0f10)
- Text: High contrast for readability
- Accents: Use sparingly for emphasis

**Typography**
- Font family: Poppins
- Hierarchy: Clear distinction between headings and body text
- Line height: Comfortable reading experience

**Spacing**
- Use 8px grid system
- Consistent padding and margins
- Adequate white space

**Accessibility**
- WCAG 2.1 Level AA compliance
- Color contrast ratios
- Keyboard navigation support
- Screen reader compatibility

**Responsiveness**
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch-friendly tap targets (minimum 44x44px)

### What We're Looking For

- Improved user flows
- Better visual hierarchy
- Enhanced mobile experience
- Accessibility improvements
- Modern UI patterns
- Micro-interactions and animations
- Consistent design language

## Community

### Communication Channels

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussions
- **Email**: dattavignesh001@gmail.com for direct communication

### Getting Help

If you need help:
1. Check the README and documentation
2. Search existing issues
3. Ask in GitHub Discussions
4. Contact the maintainers

### Recognition

Contributors are recognized in:
- README contributors section
- Release notes
- Project documentation
- Special mentions for significant contributions

## Questions?

If you have any questions about contributing, feel free to:
- Open an issue with the `question` label
- Start a discussion on GitHub
- Contact the maintainers directly

## Thank You

Thank you for contributing to Peerflex! Your efforts help make this platform better for students everywhere.

---

**Happy Contributing!**

For more information, visit our [GitHub repository](https://github.com/dattu145/Peerflex).