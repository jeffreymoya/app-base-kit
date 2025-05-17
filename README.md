# App Base Kit

## Project Overview

This project aims to provide a comprehensive starter kit for building AI-powered applications. It includes a monorepo setup with various packages for CLI, core utilities, mobile SDK, embedding scripts, infrastructure, and a sample server.

## Roadmap

The project development will follow these phases:

- **Phase 0: Project Initialization & Monorepo Scaffold** - Setting up the basic structure, tooling, and CI/CD.
- **(Future Phases)** - Detailed in separate documents.

## Contribution Guidelines

(To be defined)

## Development Setup

### Prerequisites

- Node.js (v18+ recommended)
- Yarn (v3+)
- Terraform CLI
- CDKTF CLI (`npm install -g cdktf-cli`)

### Installation

1.  Clone the repository.
2.  Install dependencies for all workspaces:
    ```bash
    yarn install
    ```

### Common Scripts

- Lint all packages:
  ```bash
  yarn lint
  ```
- Run tests for all packages:
  ```bash
  yarn test
  ```
- Build relevant packages (e.g., `core`, `cli` - specific build scripts are per-package):
  ```bash
  yarn workspace @app-base-kit/core build
  # Add other build commands as needed
  ```

### Infrastructure (CDKTF)

1.  Navigate to the infrastructure package:
    ```bash
    cd packages/infrastructure
    ```
2.  Synthesize the Terraform code (generates `cdktf.out`):
    ```bash
    yarn synth  # or cdktf synth
    ```
3.  Deploy the infrastructure (ensure your AWS credentials are configured):
    ```bash
    yarn deploy # or cdktf deploy --auto-approve
    ```
    **Note**: The S3 backend bucket and DynamoDB table for state locking must exist before the first deploy that uses them. These are currently placeholders in `main.ts`.
