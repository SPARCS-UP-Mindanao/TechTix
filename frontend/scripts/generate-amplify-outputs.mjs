import fs from 'fs';
import path from 'path';
import url from 'url';
import { parseArgs, validateRequiredPaths, deepScanForUndefinedStrings } from './utils.mjs';
import { SSMClient, GetParametersCommand } from '@aws-sdk/client-ssm';

const args = parseArgs(process.argv);

const STAGE = args._[0] || process.env.SSM_STAGE; // dev | staging | prod
const REGION = args.region || process.env.AWS_REGION || 'ap-southeast-1';
const OUT = args.out || process.env.SSM_OUT || './amplify_outputs.json';

if (!STAGE) {
  console.error('❌ Missing stage. Provide it as first arg (dev, staging, prod) or set SSM_STAGE.');
  console.error('   Example: node scripts/generate-amplify-outputs.js prod');
  process.exit(1);
}
if (!['dev', 'staging', 'prod'].includes(STAGE)) {
  console.error(`❌ Invalid stage "${STAGE}". Allowed values: dev, staging, prod.`);
  process.exit(1);
}

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const OUT_ABS = path.isAbsolute(OUT) ? OUT : path.join(__dirname, '..', OUT);

const ssm = new SSMClient({ region: REGION });

/**
 * Map of logical keys -> array of candidate SSM parameter names (first found wins).
 */
const parameterNames = {
  // REGION is optional (falls back to env/REGION)
  COGNITO_DOMAIN_URL: `/techtix/cognito-domain-url-${STAGE}`,
  COGNITO_REDIRECT_SIGNIN_URI: `/techtix/cognito-signin-redirect-${STAGE}`,
  COGNITO_USER_POOL_ID: `/techtix/cognito-user-pool-id-${STAGE}`,
  COGNITO_CLIENT_ID: `/techtix/cognito-user-pool-client-id-${STAGE}`
};

function toArray(x) {
  return Array.isArray(x) ? x : [x];
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

async function getByNames(map) {
  const allNames = [...new Set(Object.values(map).flatMap(toArray))];
  const nameToValue = {};
  const invalidParams = [];

  for (const names of chunk(allNames, 10)) {
    const resp = await ssm.send(
      new GetParametersCommand({
        Names: names,
        WithDecryption: true
      })
    );
    for (const p of resp.Parameters ?? []) nameToValue[p.Name] = p.Value;
    if (resp.InvalidParameters?.length) invalidParams.push(...resp.InvalidParameters);
  }

  const vars = {};
  const missingByKey = {};
  for (const [key, candidatesRaw] of Object.entries(map)) {
    const candidates = toArray(candidatesRaw);
    const found = candidates.find((n) => nameToValue[n] != null);
    if (found) vars[key] = nameToValue[found];
    else missingByKey[key] = candidates;
  }

  return { vars, invalidParams, missingByKey };
}

function buildAmplifyOutputs(vars) {
  const region = vars.REGION || REGION;

  const config = {
    version: '1.3',
    auth: {
      aws_region: region,
      oauth: {
        identity_providers: ['GOOGLE'],
        domain: vars.COGNITO_DOMAIN_URL,
        scopes: ['email', 'openid', 'phone', 'profile', 'aws.cognito.signin.user.admin'],
        redirect_sign_in_uri: [vars.COGNITO_REDIRECT_SIGNIN_URI],
        response_type: 'token'
      },
      user_pool_id: vars.COGNITO_USER_POOL_ID,
      user_pool_client_id: vars.COGNITO_CLIENT_ID
    }
  };

  const requiredPaths = [
    'version',
    'auth.aws_region',
    'auth.user_pool_id',
    'auth.user_pool_client_id',
    'auth.oauth.domain',
    'auth.oauth.scopes',
    'auth.oauth.redirect_sign_in_uri',
    'auth.oauth.response_type'
  ];

  const missingOrEmpty = validateRequiredPaths(config, requiredPaths);
  const invalidStrings = deepScanForUndefinedStrings(config);
  const allErrors = [...missingOrEmpty, ...invalidStrings];

  if (allErrors.length > 0) {
    const msg = 'Invalid amplify_outputs.json configuration:\n' + allErrors.map((e) => ` - ${e}`).join('\n');
    throw new Error(msg);
  }

  return config;
}

async function main() {
  console.log(`ℹ️  Fetching SSM parameters for stage "${STAGE}" (region: ${REGION})`);
  const { vars, invalidParams, missingByKey } = await getByNames(parameterNames);

  const missingRequiredKeys = Object.keys(missingByKey).filter((k) => k !== 'REGION'); // REGION is optional

  if (invalidParams.length || missingRequiredKeys.length) {
    const lines = [];
    if (missingRequiredKeys.length) {
      lines.push('Missing required SSM parameters:');
      for (const k of missingRequiredKeys) {
        const tried = toArray(parameterNames[k]).join(', ');
        lines.push(`  - ${k}: tried ${tried}`);
      }
    }
    if (invalidParams.length) {
      lines.push('Invalid SSM parameter names (GetParameters reported invalid):');
      for (const n of invalidParams) lines.push(`  - ${n}`);
    }
    throw new Error(lines.join('\n'));
  }

  const amplifyCfg = buildAmplifyOutputs(vars);

  fs.mkdirSync(path.dirname(OUT_ABS), { recursive: true });
  fs.writeFileSync(OUT_ABS, JSON.stringify(amplifyCfg, null, 2));
  console.log(`✅ Wrote ${OUT_ABS}`);
}

main().catch((e) => {
  console.error('❌ Failed to generate amplify_outputs.json:\n' + (e?.stack || e));
  process.exit(1);
});
