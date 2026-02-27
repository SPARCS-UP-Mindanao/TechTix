# TechTix Frontend (React)

This folder contains the TechTix web frontend.

## Development Setup (DevContainer)

For this sprint, development uses **VS Code Dev Containers** (containerized VS Code). This means you do **not** need to manually install project runtimes/dependencies (like Node) on your host machine—everything runs inside the container.

### DevContainer dependencies (host machine)

To use DevContainers, install:

- VS Code
- VS Code Extension: **Dev Containers**
- Docker (Docker Desktop on Windows/macOS, Docker Engine on Linux)


### Run the frontend (inside the DevContainer)

Once the DevContainer is running, use the DevContainer terminal:

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal.

### Alternative: Local (without DevContainer)

If you are not using DevContainers, ensure you have:

- `node 22.15+`

Then:

1. Clone the repository to your machine.
2. Open the repository in your IDE.
3. Open a terminal at the repository root and switch to the frontend folder:

```bash
cd frontend
```

![image](https://github.com/SPARCS-UP-Mindanao/SPARCS-Event-Platform/assets/85269524/adcdd520-d032-4380-8a85-81bbf39805c2)

4. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

![image](https://github.com/SPARCS-UP-Mindanao/SPARCS-Event-Platform/assets/85269524/c44ea864-f1da-4d78-bb0c-980345125b3f)

## AWS CLI / AWS SSO (Frontend)

Some frontend workflows require AWS access (e.g., generating local configuration files).

- Ensure you have authenticated via **AWS SSO**.
- Ensure the **AWS CLI** is available in your environment (the DevContainer should provide it; see root [`README.md`](../README.md) for the canonical setup).

If you use a named AWS profile, ensure it is selected in your terminal session:

```bash
export AWS_PROFILE=<your-profile>
```

### Generating `amplify_outputs.json` and `.env`

Use these scripts to generate files required to run the frontend locally:

- `amplify_outputs.json`
- `.env`

Run:

```bash
# $stage = dev | staging
npm run generate:env $stage
npm run generate:outputs $stage
```

## Directory guide

We will mostly work in the `frontend/src` folder.

![image](https://github.com/SPARCS-UP-Mindanao/SPARCS-Event-Platform/assets/85269524/f6cb7718-3817-4c12-9574-ff5c7a09f033)

We have these folders, and here's what they're for:

- `api` — API calls and API utilities (e.g., `createApi`)
- `assets` — images, fonts, gifs, and other static assets
- `components` — reusable UI components
- `context` — React contexts used by the app
- `hooks` — custom hooks
- `model` — TypeScript interfaces/types used by the app and API layer
- `pages` — page-level components
- `routes` — app routing and route layouts
- `styles` — CSS and styling files used by the project
- `utils` — helper functions used throughout the project

### Path aliases

With the help of `tsconfig.json`, we can use aliases for our directories:

- `@/{folderInSRC}`

This avoids long relative imports like `../../../../someFolder`.

## Components

This project uses **shadcn/ui** for components.

You can read the docs here: https://ui.shadcn.com/

### Naming conventions

- Components: **PascalCase** (example: `PascalCase.tsx`)
- Hooks: camel case starting with `use` (example: `useCamelCase`)

Reminder: We use a different directory than what is written in the shadcn/ui docs. Use:

- `@/components/{componentName.tsx}`

### Using the Form component

The form component is customized so that FE devs can easily set up a form.

Example usage:

```tsx
const form = useForm();

return (
  <FormProvider {...form}>
    <FormItem name="email">
      {({ field, fieldState, formState }) => (
        <div>
          <FormLabel>{Label}</FormLabel>
          <Input type={inputType} {...field} />
          <FormDescription>{description}</FormDescription>
          <FormError />
        </div>
      )}
    </FormItem>
  </FormProvider>
);
```

Where:

- `FormProvider` provides the form context to its children
- `FormLabel` — label (if any)
- `FormDescription` — description (if any)
- `FormError` — errors (if any)

For anything about `field`, `fieldState`, and `formState`, read up on:
- [`react-hook-form`](https://react-hook-form.com/)
- [Controllers](https://react-hook-form.com/docs/usecontroller/controller)

## Hooks

Hooks contain the logic for pages (e.g., handling forms). This helps separate UI/design from logic.

- Location: `src/hooks/`
- Naming: `useSomething`
- Prefer returning a clear API (data + loading/error state, and action functions)

## Contexts

Contexts live in `src/context/` and are used for app-wide state and providers.

- Prefer exposing a `useSomething()` hook as the public API for consuming context values.

## Git Hooks (Pre-commit)

This project uses git hooks to prevent committing secrets and to enforce commit message conventions.

### Hooks used

- **gitleaks** (pre-commit): scans staged changes for secrets (API keys, tokens, passwords).
- **commitizen** (commit-msg): validates commit message format.

### Install hooks locally

Run inside the DevContainer terminal:

```bash
npm i --save-dev prek
npx prek install --hook-type commit-msg --hook-type pre-commit
```

If a commit is rejected:
- **gitleaks**: remove the secret from the change (and rotate the credential if it was exposed).
- **commitizen**: rewrite the commit message to match the required format.

## Code formatting

Use **Prettier** for formatting code.

Format the code with:

```bash
npm run pretty
```

## Useful Commands

Run inside the DevContainer terminal:

```bash
npm run lint
npm run test:unit
npm run build
npm run start
npm run pretty
npm run generate
```

- `npm run start` runs the Vite preview server (built app).
- `npm run generate` runs both env + outputs generation (see `package.json`).
