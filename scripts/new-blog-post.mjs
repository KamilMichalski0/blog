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
	console.log('\n📝 Create New Blog Post\n');

	const title = await question('Title: ');
	const description = await question('Description: ');
	const tags = await question('Tags (comma-separated): ');
	const draft = (await question('Draft? (y/n): ')).toLowerCase() === 'y';

	rl.close();

	const slug = slugify(title);
	const date = new Date().toISOString().split('T')[0];
	const filename = `${slug}.md`;
	const filepath = path.join(__dirname, '../src/content/blog', filename);

	const tagArray = tags
		.split(',')
		.map((t) => t.trim())
		.filter((t) => t.length > 0);

	const content = `---
title: "${title}"
description: "${description}"
pubDate: "${date}"
heroImage: "/blog-placeholder-1.jpg"
tags: [${tagArray.map((t) => `"${t}"`).join(', ')}]
draft: ${draft}
author: "ClaudeCodeLab"
---

## Introduction

Write your introduction here...

## Main Content

Write your main content here...

## Conclusion

Write your conclusion here...
`;

	fs.writeFileSync(filepath, content, 'utf8');

	console.log(`\n✅ Created: ${filepath}`);
	console.log(`📝 File: src/content/blog/${filename}`);
	console.log(`🔗 URL: /blog/${slug}\n`);
}

main().catch(console.error);
