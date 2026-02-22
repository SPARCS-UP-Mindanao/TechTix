#!/bin/bash

echo "Creating requirements file"
uv export --format requirements-txt --no-hashes --output-file requirements.txt --no-dev
echo "Deploying with serverless framework"
npx sls deploy --stage dev --verbose $1
