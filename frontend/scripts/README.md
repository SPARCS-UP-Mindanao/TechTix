# Scripts Documentation

## generate-all.mjs

A convenience script that runs both `generate-amplify-outputs.mjs` and `generate-env.mjs` sequentially.

### Usage

```bash
npm run generate [stage] [options]
```

### Arguments

- `stage`: The deployment stage (dev, staging, prod)
- `--region <region>`: AWS region (defaults to ap-southeast-1)
- `--outputs-out <path>`: Output path for amplify outputs (defaults to ./amplify_outputs.json)
- `--env-out <path>`: Output path for environment file (defaults to .env)

### Examples

```bash
# Basic usage with stage
npm run generate:all dev

# With custom region
npm run generate:all staging --region us-east-1

# With custom output paths
npm run generate:all prod --outputs-out ./custom-outputs.json --env-out ./custom.env

# With custom region and output paths
npm run generate:all dev --region ap-southeast-1 --outputs-out ./dev-outputs.json --env-out ./dev.env
```

### What it does

1. Runs `generate-amplify-outputs.mjs` with the specified arguments
2. Runs `generate-env.mjs` with the specified arguments
3. Both scripts use the same stage and region
4. Each script can have its own output path using `--outputs-out` and `--env-out`

### Default values

- **generate-amplify-outputs**: `./amplify_outputs.json`
- **generate-env**: `.env`
- **region**: `ap-southeast-1`
