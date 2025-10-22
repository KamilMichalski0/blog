#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function question(query) {
	return new Promise((resolve) => rl.question(query, resolve));
}

function slugify(text) {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w\-]+/g, '')
		.replace(/\-\-+/g, '-');
}

async function main() {
	console.log('\n📋 Create New Changelog Entry\n');

	const title = await question('Title: ');
	const version = await question('Version (optional): ');
	console.log('\nType: feat, fix, docs, perf, other');
	const type = await question('Type: ');
	console.log('\nEnter highlights (one per line, empty line to finish):');

	const highlights = [];
	while (true) {
		const highlight = await question('  - ');
		if (!highlight.trim()) break;
		highlights.push(highlight.trim());
	}

	rl.close();

	const date = new Date().toISOString().split('T')[0];
	const slug = slugify(title);
	const filename = `${date}-${slug}.md`;
	const filepath = path.join(__dirname, '../src/content/changelog', filename);

	const content = `---
title: "${title}"
date: "${date}"
type: "${type}"
highlights:
${highlights.map((h) => `  - "${h}"`).join('\n')}${version ? `\nversion: "${version}"` : ''}
---

## ${title}

Write detailed description here...

### Key Changes

- Change 1
- Change 2
- Change 3

## What's Next?

Future plans and upcoming features...
`;

	fs.writeFileSync(filepath, content, 'utf8');

	console.log(`\n✅ Created: ${filepath}`);
	console.log(`📝 File: src/content/changelog/${filename}\n`);
}

main().catch(console.error);
