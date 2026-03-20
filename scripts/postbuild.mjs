#!/usr/bin/env node

import { writeFileSync, readFileSync, existsSync, readdirSync, statSync } from "fs";
import { resolve, dirname, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function writeMarker(dir, type) {
    if (!existsSync(dir)) {
        console.error(`✗ directory not found: ${dir}`);
        process.exit(1);
    }
    const target = resolve(dir, "package.json");
    writeFileSync(target, JSON.stringify({ type }, null, 2) + "\n", "utf8");
    console.log(`✓ ${target}  →  { "type": "${type}" }`);
}

writeMarker(resolve(root, "build/cjs"), "commonjs");
writeMarker(resolve(root, "build/esm"), "module");

const RELATIVE_IMPORT_RE =
    /((?:import|export)[^'"]*['"])(\.{1,2}\/[^'"]+?)(['"])/g;

const DYNAMIC_IMPORT_RE = /(import\s*\(\s*['"])(\.{1,2}\/[^'"]+?)(['"]\s*\))/g;

const CJS_NAMED_EXPORT_REWRITES = [
    {
        re: /(import\s*\{[^}]*\bEventEmitter\b[^}]*\}\s*from\s*['"])stream(['"])/g,
        replacement: "$1events$2",
    },
];

function hasExtension(p) {
    return extname(p) !== "";
}

function fixImports(content) {
    let changed = false;

    let result = content
        .replace(RELATIVE_IMPORT_RE, (match, pre, specifier, post) => {
            if (hasExtension(specifier)) return match;
            changed = true;
            return `${pre}${specifier}.js${post}`;
        })
        .replace(DYNAMIC_IMPORT_RE, (match, pre, specifier, post) => {
            if (hasExtension(specifier)) return match;
            changed = true;
            return `${pre}${specifier}.js${post}`;
        });

    for (const { re, replacement } of CJS_NAMED_EXPORT_REWRITES) {
        const rewritten = result.replace(re, replacement);
        if (rewritten !== result) {
            changed = true;
            result = rewritten;
        }
    }
    return { result, changed };
}

function walkAndFix(dir) {
    for (const entry of readdirSync(dir)) {
        if (entry === "package.json") continue;

        const full = resolve(dir, entry);
        const stat = statSync(full);

        if (stat.isDirectory()) {
            walkAndFix(full);
        } else if (entry.endsWith(".js") || entry.endsWith(".d.ts")) {
            const original = readFileSync(full, "utf8");
            const { result, changed } = fixImports(original);
            if (changed) {
                writeFileSync(full, result, "utf8");
                console.log(`  fixed imports: ${full}`);
            }
        }
    }
}

const esmDir = resolve(root, "build/esm");
walkAndFix(esmDir);
