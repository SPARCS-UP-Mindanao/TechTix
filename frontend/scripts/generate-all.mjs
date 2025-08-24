import { runScript } from './runScript.js';

function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = {
    _: [],
    region: null,
    'env-out': null,
    'outputs-out': null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--region' && i + 1 < args.length) {
      parsed.region = args[++i];
    } else if (arg === '--env-out' && i + 1 < args.length) {
      parsed['env-out'] = args[++i];
    } else if (arg === '--outputs-out' && i + 1 < args.length) {
      parsed['outputs-out'] = args[++i];
    } else if (arg.startsWith('--')) {
      // Skip other unknown flags
      if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        i++; // Skip the value
      }
    } else {
      parsed._.push(arg);
    }
  }

  return parsed;
}

async function main() {
  try {
    // Parse command line arguments
    const args = parseArgs(process.argv);

    console.log('🔄 Starting generation of both outputs and environment files...');
    console.log(`📝 Stage: ${args._[0] || 'default'}`);
    if (args.region) console.log(`🌍 Region: ${args.region}`);

    // Build arguments for each script
    const baseArgs = args._.filter((arg) => arg !== '--help');
    if (args.region) baseArgs.push('--region', args.region);

    // Arguments for generate-amplify-outputs
    const outputsArgs = [...baseArgs];
    if (args['outputs-out']) {
      outputsArgs.push('--out', args['outputs-out']);
    }

    // Arguments for generate-env
    const envArgs = [...baseArgs];
    if (args['env-out']) {
      envArgs.push('--out', args['env-out']);
    }

    console.log(`📤 Outputs args: ${outputsArgs.join(' ')}`);
    console.log(`📤 Env args: ${envArgs.join(' ')}`);

    // Run generate-amplify-outputs first
    await runScript('generate-amplify-outputs.mjs', outputsArgs);

    // Then run generate-env
    await runScript('generate-env.mjs', envArgs);

    console.log('🎉 All generation scripts completed successfully!');
  } catch (error) {
    console.error('💥 Generation failed:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();
