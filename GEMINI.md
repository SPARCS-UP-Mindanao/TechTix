# TechTix Project Standards & Context

This file serves as a reference for AI agents to understand the technology stack, structural conventions, and deployment rules of the TechTix project.

## 1. Technology Stack

### Backend (AWS Serverless + Python)
- **Language**: Python 3.11
- **API Framework**: FastAPI (run via Mangum adapter for AWS Lambda)
- **Database ORM**: PynamoDB (for AWS DynamoDB)
- **Infrastructure as Code (IaC)**: Serverless Framework (`serverless.yaml` + `resources/*.yml`)
- **Key Libraries**: Pydantic v1, boto3, ulid, requests, openpyxl, pandas
- **Linting & Formatting**: Ruff, Black, Mypy, Flake8, Pylint
- **Testing**: Pytest, Moto (AWS mocking), Pytest-mock
- **Dependency Management**: `pyproject.toml` (with uv/pipenv compatibility via `Pipfile`/`uv.lock`)

### Frontend (React + Vite)
- **Language**: TypeScript
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **State Management & Data Fetching**: TanStack React Query v5
- **Styling**: Tailwind CSS v4, PostCSS
- **UI Components**: Radix UI (Headless components), Lucide React (Icons)
- **Form Handling & Validation**: React Hook Form, Zod
- **AWS Integration**: AWS Amplify (`aws-amplify`)
- **Rich Text Editor**: Tiptap
- **Linting & Formatting**: ESLint, Prettier
- **Testing**: Vitest

## 2. Structural Conventions

### Backend Architecture
The backend code (`backend/`) follows a clean, layered architectural pattern:
- **`controller/`**: FastAPI routers and endpoints. Responsible for handling HTTP requests and routing them to the appropriate use cases.
- **`usecase/`**: Core business logic layer.
- **`repository/`**: Data access layer (PynamoDB interactions) isolating DB operations.
- **`model/`**: Pydantic schemas, database entity definitions, and shared data models.
- **`functions/`**: AWS Lambda handlers for asynchronous tasks (e.g., SQS processors, S3 uploads).
- **`external_gateway/`**: Integrations with third-party APIs (e.g., KonfHub).
- **`resources/`**: Infrastructure resource definitions (DynamoDB, S3, SQS, API Gateway) that are imported by `serverless.yaml`.
- **`aws/`**: AWS-specific configurations (Cognito auth, security settings).
- **`utils/`**: Shared utilities, formatting, and logging.

### Frontend Architecture
The frontend code (`frontend/`) uses a modular React structure:
- **`src/api/`**: API client configurations and endpoint functions.
- **`src/components/`**: Reusable UI components.
- **`src/context/`**: React Context providers for global state.
- **`src/hooks/`**: Custom React hooks.
- **`src/model/`**: TypeScript interfaces and types.
- **`src/pages/`**: Main page components corresponding to routes.
- **`src/routes/`**: React Router definitions and layout components.
- **`src/styles/`**: Global CSS and Tailwind definitions.
- **Path Aliasing**: `@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig.json`).

## 3. Development & Deployment Rules

### Backend Rules
- **Infrastructure modularity**: Do not bloat `serverless.yaml`. New AWS resources should be defined in their respective files within `backend/resources/` (e.g., `dynamodb.yml`, `s3.yml`, `sqs.yml`).
- **Dependencies**: Serverless Python Requirements plugin is used to package dependencies for Lambda.
- **Commit Standards**: Uses `commitizen` for conventional commits.

### Frontend Rules
- **Amplify Config Generation**: AWS Amplify configuration is dynamic. It expects an `amplify_outputs.json` file, which is generated using the `npm run generate:outputs` script based on the current environment.
- **Asset Optimization**: Uses `vite-plugin-image-optimizer` to handle images effectively.

### CI/CD
- **Workflows**: GitHub Actions are heavily utilized (`.github/workflows/`).
- **Backend Deployment**: Handled automatically via `deploy_backend.yml` which likely triggers `sls deploy`.
- **Frontend Deployment**: Handled via `fe_deploy_to_main.yml` and `fe_pr_and_deploy.yml` using AWS Amplify (`amplify.yml`) or Vercel (`vercel.json`).
- **Code Quality Checks**: `formatting_backend.yml` enforces Ruff, Black, and Mypy standards on pull requests.
