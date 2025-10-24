#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const IMAGES_DIR = path.join(__dirname, '../public/blog/heroes');

// Parse frontmatter from markdown file
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) return { frontmatter: null, restContent: content };

  const frontmatter = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let currentArray = null;

  for (const line of lines) {
    if (line.trim().startsWith('-')) {
      if (currentArray) {
        const value = line.trim().substring(1).trim().replace(/^['"]|['"]$/g, '');
        currentArray.push(value);
      }
      continue;
    }

    const keyMatch = line.match(/^(\w+):\s*(.*)$/);
    if (keyMatch) {
      const [, key, value] = keyMatch;
      currentKey = key;
      const trimmedValue = value.trim();

      if (trimmedValue === '') {
        currentArray = [];
        frontmatter[key] = currentArray;
      } else if (trimmedValue.startsWith('[')) {
        try {
          frontmatter[key] = JSON.parse(trimmedValue);
          currentArray = null;
        } catch (e) {
          frontmatter[key] = trimmedValue.replace(/^['"]|['"]$/g, '');
          currentArray = null;
        }
      } else {
        frontmatter[key] = trimmedValue.replace(/^['"]|['"]$/g, '');
        currentArray = null;
      }
    }
  }

  const restContent = content.substring(match[0].length);
  return { frontmatter, restContent };
}

// Serialize frontmatter back to YAML format
function serializeFrontmatter(frontmatter) {
  const lines = ['---'];

  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else {
      // String values
      const needsQuotes = value.includes(':') || value.includes('#') || value.includes('\n');
      lines.push(`${key}: ${needsQuotes ? `"${value}"` : value}`);
    }
  }

  lines.push('---');
  return lines.join('\n');
}

// Download image from URL
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const fileStream = createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath).catch(() => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

// Process a single blog post
async function processPost(filename, dryRun = false) {
  const filepath = path.join(BLOG_DIR, filename);
  const content = await fs.readFile(filepath, 'utf-8');
  const { frontmatter, restContent } = parseFrontmatter(content);

  if (!frontmatter) {
    console.log(`⏭️  ${filename} - No frontmatter`);
    return { status: 'skipped', reason: 'no-frontmatter' };
  }

  const heroImage = frontmatter.heroImage;

  if (!heroImage) {
    console.log(`⏭️  ${filename} - No hero image`);
    return { status: 'skipped', reason: 'no-image' };
  }

  if (!heroImage.startsWith('http')) {
    console.log(`✅ ${filename} - Already local: ${heroImage}`);
    return { status: 'skipped', reason: 'already-local' };
  }

  // Generate local filename
  const slug = filename.replace(/\.(md|mdx)$/, '');
  const ext = '.jpg'; // Default to jpg
  const localFilename = `${slug}${ext}`;
  const localPath = path.join(IMAGES_DIR, localFilename);
  const relativeImagePath = `/blog/heroes/${localFilename}`;

  console.log(`⬇️  ${filename}`);
  console.log(`   From: ${heroImage}`);
  console.log(`   To: ${relativeImagePath}`);

  if (dryRun) {
    return {
      status: 'would-download',
      from: heroImage,
      to: relativeImagePath
    };
  }

  try {
    // Ensure images directory exists
    await fs.mkdir(IMAGES_DIR, { recursive: true });

    // Download image
    await downloadImage(heroImage, localPath);
    console.log(`   ✅ Downloaded`);

    // Update frontmatter
    frontmatter.heroImage = relativeImagePath;

    // Reconstruct file content
    const newContent = serializeFrontmatter(frontmatter) + '\n' + restContent;

    // Write back to file
    await fs.writeFile(filepath, newContent, 'utf-8');
    console.log(`   ✅ Updated frontmatter`);

    return {
      status: 'success',
      from: heroImage,
      to: relativeImagePath
    };

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return {
      status: 'error',
      error: error.message,
      from: heroImage
    };
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }

  console.log('🖼️  Downloading hero images...\n');

  // Read all blog posts
  const files = await fs.readdir(BLOG_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  console.log(`Found ${mdFiles.length} blog posts\n`);

  const results = {
    success: 0,
    skipped: 0,
    errors: 0,
    wouldDownload: 0
  };

  // Process each post
  for (const file of mdFiles) {
    const result = await processPost(file, dryRun);

    if (result.status === 'success') {
      results.success++;
    } else if (result.status === 'would-download') {
      results.wouldDownload++;
    } else if (result.status === 'error') {
      results.errors++;
    } else {
      results.skipped++;
    }

    console.log(''); // Empty line between posts
  }

  // Summary
  console.log('\n📊 SUMMARY');
  console.log('═'.repeat(60));

  if (dryRun) {
    console.log(`Would download: ${results.wouldDownload} images`);
    console.log(`Would skip: ${results.skipped} posts`);
    console.log('\n💡 Run without --dry-run to actually download images');
  } else {
    console.log(`✅ Successfully downloaded: ${results.success} images`);
    console.log(`⏭️  Skipped: ${results.skipped} posts`);
    console.log(`❌ Errors: ${results.errors} posts`);

    if (results.success > 0) {
      console.log(`\n✅ Images saved to: ${IMAGES_DIR}`);
      console.log('✅ Frontmatter updated in all posts');
    }
  }
}

// Run
main().catch(console.error);
