# Project Directory Structure

This document outlines the main directory structure of the project and highlights key configuration files.

## Root Level

- `packages/`: Monorepo directory containing all individual project packages.
- `.github/`: Contains GitHub Actions workflows for CI/CD and other GitHub-specific configurations.
  - `workflows/`: Stores CI/CD workflow files (e.g., `ci.yml`).
  - `dependabot.yml`: Configuration for Dependabot automated dependency updates.
- `README.md`: Main project overview, setup instructions, and contribution guidelines.
- `.gitignore`: Specifies intentionally untracked files that Git should ignore.
- `package.json`: Root project manifest for managing workspaces and global scripts.
- `tsconfig.base.json`: Base TypeScript configuration shared across all packages.
- `.eslintrc.js`: ESLint configuration for code linting.
- `.prettierrc`: Prettier configuration for code formatting.
- `CODEOWNERS`: Defines individuals or teams responsible for code in the repository.
- `SECURITY.md`: Outlines security policies and procedures.
- `CONTRIBUTING.md`: Guidelines for contributing to the project.

## `packages/`

The `packages/` directory houses the individual modules of the application:

- `cli/`: Contains the Command Line Interface (CLI) generator, built with TypeScript.
  - `package.json`: Package-specific manifest.
  - `tsconfig.json`: TypeScript configuration for the CLI package.
  - `src/`: Source code for the CLI.
- `core/`: Houses shared AI utilities, TypeScript types, and core functionalities.
  - `package.json`: Package-specific manifest.
  - `tsconfig.json`: TypeScript configuration for the core package.
  - `src/`: Source code for shared utilities (e.g., logger, environment loader, core interfaces).
- `mobile-sdk/`: Contains the React Native SDK starter.
  - `package.json`: Package-specific manifest.
  - `tsconfig.json`: TypeScript configuration for the mobile SDK.
  - `src/`: Source code for the React Native SDK.
- `embed-script/`: Contains a Python script for embedding functionalities.
  - `requirements.txt` or `Pipfile`: Python dependencies.
  - `src/`: Source code for the Python embedding script.
- `infrastructure/`: Manages the cloud infrastructure using CDKTF (Cloud Development Kit for Terraform).
  - `package.json`: Package-specific manifest for infrastructure.
  - `tsconfig.json`: TypeScript configuration for CDKTF.
  - `cdktf.json`: CDKTF configuration file, including context for environment-specific parameters.
  - `main.ts`: Main CDKTF application entry point.
  - `stacks/`: Directory for modularized CDKTF stacks (e.g., `NetworkStack.ts`, `AuthStack.ts`).
- `server/`: Provides an example backend implementation (e.g., using NestJS or Express).
  - `package.json`: Package-specific manifest.
  - `tsconfig.json`: TypeScript configuration for the server package.
  - `src/`: Source code for the backend server.

## Core Configuration Files (Examples)

- **Root `package.json`**: Manages workspaces, scripts (lint, test, build), and root dependencies.
- **Root `tsconfig.base.json`**: Provides base TypeScript compiler options for all packages, ensuring consistency.
- **`packages/infrastructure/cdktf.json`**: Configures the CDKTF application, including providers, backend, and context for different environments.
- **`packages/core/src/config.ts` (example)**: Module for loading and validating environment variables (e.g., using `dotenv` and `Zod`).
- **`.github/workflows/ci.yml`**: Defines the continuous integration pipeline (setup, lint, test, build, security scans).
- **`.eslintrc.js` & `.prettierrc`**: Ensure consistent code style and quality across the project.
