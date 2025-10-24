#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const WORDS_PER_MINUTE = 200; // Average reading speed

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

// Calculate reading time from content
function calculateReadingTime(content) {
  // Remove frontmatter
  const contentWithoutFrontmatter = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');

  // Remove code blocks (they're read slower, so we discount them)
  const withoutCode = contentWithoutFrontmatter.replace(/```[\s\S]*?```/g, '');

  // Remove inline code
  const withoutInlineCode = withoutCode.replace(/`[^`]+`/g, '');

  // Remove HTML tags
  const withoutHtml = withoutInlineCode.replace(/<[^>]+>/g, '');

  // Remove markdown formatting
  const withoutFormatting = withoutHtml
    .replace(/[#*_~`\[\]()]/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image tags
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Keep link text only

  // Count words
  const words = withoutFormatting
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);

  const wordCount = words.length;

  // Calculate minutes (round up)
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

  // Minimum 1 minute
  return Math.max(1, minutes);
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

  const calculatedTime = calculateReadingTime(content);
  const currentTime = frontmatter.readingTime;

  if (currentTime === calculatedTime) {
    console.log(`✅ ${filename} - Already correct (${currentTime} min)`);
    return { status: 'skipped', reason: 'already-correct', time: currentTime };
  }

  console.log(`📝 ${filename}`);
  console.log(`   Current: ${currentTime || 'none'} min`);
  console.log(`   Calculated: ${calculatedTime} min`);

  if (dryRun) {
    return {
      status: 'would-update',
      from: currentTime,
      to: calculatedTime
    };
  }

  try {
    // Update frontmatter
    frontmatter.readingTime = calculatedTime;

    // Reconstruct file content
    const newContent = serializeFrontmatter(frontmatter) + '\n' + restContent;

    // Write back to file
    await fs.writeFile(filepath, newContent, 'utf-8');
    console.log(`   ✅ Updated to ${calculatedTime} min`);

    return {
      status: 'success',
      from: currentTime,
      to: calculatedTime
    };

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return {
      status: 'error',
      error: error.message
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

  console.log('⏱️  Calculating reading times...\n');

  // Read all blog posts
  const files = await fs.readdir(BLOG_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  console.log(`Found ${mdFiles.length} blog posts\n`);

  const results = {
    success: 0,
    skipped: 0,
    errors: 0,
    wouldUpdate: 0
  };

  const readingTimes = [];

  // Process each post
  for (const file of mdFiles) {
    const result = await processPost(file, dryRun);

    if (result.status === 'success') {
      results.success++;
      readingTimes.push(result.to);
    } else if (result.status === 'would-update') {
      results.wouldUpdate++;
      readingTimes.push(result.to);
    } else if (result.status === 'error') {
      results.errors++;
    } else {
      results.skipped++;
      if (result.time) {
        readingTimes.push(result.time);
      }
    }

    console.log(''); // Empty line between posts
  }

  // Calculate statistics
  if (readingTimes.length > 0) {
    const avgTime = readingTimes.reduce((a, b) => a + b, 0) / readingTimes.length;
    const minTime = Math.min(...readingTimes);
    const maxTime = Math.max(...readingTimes);

    console.log('\n📊 READING TIME STATISTICS');
    console.log('═'.repeat(60));
    console.log(`Average: ${avgTime.toFixed(1)} min`);
    console.log(`Range: ${minTime}-${maxTime} min`);
    console.log(`Total posts: ${readingTimes.length}`);
  }

  // Summary
  console.log('\n📊 SUMMARY');
  console.log('═'.repeat(60));

  if (dryRun) {
    console.log(`Would update: ${results.wouldUpdate} posts`);
    console.log(`Already correct: ${results.skipped} posts`);
    console.log('\n💡 Run without --dry-run to actually update frontmatter');
  } else {
    console.log(`✅ Successfully updated: ${results.success} posts`);
    console.log(`⏭️  Skipped (already correct): ${results.skipped} posts`);
    console.log(`❌ Errors: ${results.errors} posts`);

    if (results.success > 0) {
      console.log('\n✅ Reading times added to frontmatter');
    }
  }
}

// Run
main().catch(console.error);
