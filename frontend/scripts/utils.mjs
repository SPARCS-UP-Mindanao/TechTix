export function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      const key = k.trim();
      out[key] = v !== undefined ? v : argv[i + 1] && !argv[i + 1].startsWith('-') ? argv[++i] : true;
    } else {
      out._.push(a);
    }
  }
  return out;
}

function isBadScalar(val) {
  if (val === undefined || val === null) return 'is missing';
  if (typeof val === 'string') {
    const t = val.trim();
    if (t.length === 0) return 'is empty string';
    const bad = ['undefined', 'null'];
    if (bad.includes(t.toLowerCase())) return `is invalid ('${val}')`;
  }
  return null;
}

function getByPath(obj, path) {
  return path.split('.').reduce((o, k) => (o != null ? o[k] : undefined), obj);
}

export function validateRequiredPaths(obj, paths) {
  const errs = [];
  for (const p of paths) {
    const v = getByPath(obj, p);
    if (Array.isArray(v)) {
      if (v.length === 0) errs.push(`${p} is empty array`);
      v.forEach((item, i) => {
        const bad = isBadScalar(item);
        if (bad) errs.push(`${p}[${i}] ${bad}`);
      });
    } else if (typeof v === 'object' && v !== null) {
      // object present is fine; deeper keys should be listed explicitly in paths
    } else {
      const bad = isBadScalar(v);
      if (bad) errs.push(`${p} ${bad}`);
    }
  }
  return errs;
}

export function deepScanForUndefinedStrings(obj, base = 'config') {
  const errs = [];
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      if (typeof v === 'object' && v !== null) {
        errs.push(...deepScanForUndefinedStrings(v, `${base}[${i}]`));
      } else {
        const bad = isBadScalar(v);
        if (bad && /invalid/.test(bad)) errs.push(`${base}[${i}] ${bad}`);
      }
    });
    return errs;
  }

  for (const [k, v] of Object.entries(obj || {})) {
    const path = `${base}.${k}`;
    if (typeof v === 'object' && v !== null) {
      errs.push(...deepScanForUndefinedStrings(v, path));
    } else {
      const bad = isBadScalar(v);
      if (bad && /invalid/.test(bad)) errs.push(`${path} ${bad}`);
    }
  }
  return errs;
}
