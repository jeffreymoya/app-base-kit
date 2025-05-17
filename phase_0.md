# Phase 0: Project Initialization & Monorepo Scaffold

## 1. Bootstrap Repository

- [ ] Add root `README.md` (purpose, roadmap, contribution guidelines)
- [ ] Define `.gitignore` (Node, Python, IDEs)

## 2. Monorepo Tooling

- [ ] Choose workspace manager (Yarn v3 or pnpm)
- [ ] Init root `package.json` with `"private": true` and `"workspaces": ["packages/*"]`
- [ ] Create `tsconfig.base.json` with shared compiler options (strict, path aliases)

## 3. Directory Structure

- [ ] `packages/cli` – CLI generator (TypeScript)
- [ ] `packages/core` – shared AI utilities & types
- [ ] `packages/mobile-sdk` – React Native SDK starter
- [ ] `packages/embed-script` – Python embedding script
- [ ] `packages/infrastructure` – CDKTF app (TypeScript)
- [ ] `packages/server` – example backend (TypeScript/NestJS or Express)

## 4. Linting, Formatting & Dependency Rules

- [ ] Install ESLint, Prettier, `@typescript-eslint`
- [ ] Root `.eslintrc.js` & `.prettierrc` with standard rules
- [ ] Add `lint` & `format` scripts to root `package.json`
- [ ] Configure Husky + lint-staged for pre-commit
- [ ] Enforce dependency rules with dependency-cruiser to block unwanted imports

## 5. Testing Framework & Coverage

- [ ] Install Jest & types
- [ ] Add sample test in each package (`__tests__/sanity.spec.ts`)
- [ ] Root `test` script to run all workspaces
- [ ] Integrate jest-coverage and enforce minimum 70% coverage threshold

## 6. CI/CD Skeleton & Security

- [ ] Create `.github/workflows/ci.yml`:
  - Checkout
  - Setup Node.js & Python
  - Install deps (workspaces)
  - Run `lint`, `test`, `build`
  - Integrate CodeQL for security analysis
- [ ] Add `.github/dependabot.yml` for automated dependency updates
- [ ] Define matrix builds for Node 16+ and Python 3.9+

## 7. CDKTF Bootstrap & Modular Stacks

- [ ] Globally install CDKTF CLI:  
       `bash
npm install -g cdktf-cli
`
- [ ] In `packages/infrastructure`:
  - `cdktf init --template="typescript" --project-name="infra"`
  - Configure Terraform backend (e.g. S3 + DynamoDB locking)
  - Add AWS provider, OpenSearch, Cognito, etc.
- [ ] Create stub resources using CDKTF constructs:
  - Cognito User Pool
  - API Gateway (via `aws_apigatewayv2`)
  - OpenSearch domain
  - “Hello world” Lambda (`aws_lambda_function`) + API integration
- [ ] Modularize CDKTF stacks (e.g., NetworkStack, AuthStack)
- [ ] Use CDKTF context (in `cdktf.json`) for environment-specific parameters
- [ ] Add scripts in `packages/infrastructure/package.json`:
  - `"synth": "cdktf synth"`
  - `"deploy": "cdktf deploy --auto-approve"`

## 8. Shared Core Utilities & Documentation

- [ ] In `packages/core`:
  - `package.json`, `tsconfig.json`
  - Environment loader (dotenv + Zod validation)
  - Config module with validation for 10+ environment variables
  - Shared logger (Winston wrapper)
  - Define 5+ TypeScript interfaces for critical utilities (e.g., AIService, Logger)
  - Use TSDoc to document public APIs
  - Add JSDoc to 100% of core’s exported functions
  - Publish core as a private npm package for external reuse

## 9. Sample Mobile SDK Setup

- [ ] `packages/mobile-sdk`:
  - Scaffold React Native lib (e.g. `react-native-builder-bob`)
  - Stub “Hello AI” component
  - Link TS paths to `packages/core`

## 10. Documentation & Standards

- [ ] Update root `README.md`:
  - Install all workspaces
  - Run lint/test/build
  - Bootstrap CDKTF infra
- [ ] Define branch naming & commit conventions (Conventional Commits)
- [ ] Add `CODEOWNERS`, `SECURITY.md`, and `CONTRIBUTING.md` template for reusable modules

## 11. Dry Run & Validation

- [ ] Fresh clone:
  ```bash
  yarn install   # or pnpm install
  yarn lint
  yarn test
  yarn build
  cd packages/infrastructure
  yarn synth
  yarn deploy
  ```
