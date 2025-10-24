#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../src/content/blog');

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
      // String values - always quote certain fields to prevent YAML issues
      const alwaysQuote = ['heroImageAlt', 'description', 'title'];
      const needsQuotes = alwaysQuote.includes(key) ||
                          value.includes(':') ||
                          value.includes('#') ||
                          value.includes('\n') ||
                          value.includes('[') ||
                          value.includes(']');
      lines.push(`${key}: ${needsQuotes ? `"${value.replace(/"/g, '\\"')}"` : value}`);
    }
  }

  lines.push('---');
  return lines.join('\n');
}

// Generate alt text from title and description
function generateAltText(title, description, tags) {
  // Strategy: Create descriptive, keyword-rich alt text
  // Format: "Main topic visualization - brief description"

  // Clean title - remove special chars that could break YAML
  const cleanTitle = title
    .replace(/[:\-–—\[\]\{\}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Extract key concepts from title
  const titleConcepts = cleanTitle
    .split(' ')
    .filter(word => word.length > 2) // Changed from >3 to >2 to include numbers like "7"
    .slice(0, 5)
    .join(' ');

  // Extract action words from description if available
  let context = '';
  if (description) {
    const actionWords = description
      .toLowerCase()
      .match(/\b(jak|czym|dlaczego|kiedy|gdzie|który|co|tworzenie|budowanie|implementacja|optymalizacja|tutorial|przewodnik|guide)\b/g);

    if (actionWords && actionWords.length > 0) {
      const firstAction = actionWords[0];
      if (firstAction === 'jak' || firstAction === 'czym') {
        context = 'Przewodnik';
      } else if (firstAction === 'tutorial' || firstAction === 'przewodnik') {
        context = 'Tutorial';
      } else {
        context = 'Artykuł';
      }
    }
  }

  // Use first tag if available for context (cleaned)
  let topicContext = '';
  if (tags && tags.length > 0) {
    topicContext = tags[0].replace(/[\[\]\{\}]/g, '').trim();
  }

  // Construct alt text (always quoted to prevent YAML issues)
  let altText = '';

  if (topicContext && titleConcepts) {
    altText = `${topicContext} - ${titleConcepts}`;
  } else if (titleConcepts) {
    altText = titleConcepts;
  } else {
    altText = cleanTitle.substring(0, 80);
  }

  if (context && altText) {
    altText = `${context}: ${altText}`;
  }

  // Ensure it's not too long (max 125 chars for good practices)
  if (altText.length > 125) {
    altText = altText.substring(0, 122) + '...';
  }

  // Fallback if alt text is empty or too short
  if (!altText || altText.trim().length < 10) {
    altText = `Grafika ilustrująca: ${cleanTitle.substring(0, 100)}`;
  }

  // Return quoted to prevent YAML parsing issues
  return altText;
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

  if (!frontmatter.heroImage) {
    console.log(`⏭️  ${filename} - No hero image`);
    return { status: 'skipped', reason: 'no-image' };
  }

  const currentAlt = frontmatter.heroImageAlt;
  const generatedAlt = generateAltText(
    frontmatter.title || '',
    frontmatter.description || '',
    frontmatter.tags || []
  );

  if (currentAlt && currentAlt.trim().length > 0) {
    console.log(`ℹ️  ${filename} - Already has alt text`);
    console.log(`   Current: "${currentAlt}"`);
    console.log(`   Suggested: "${generatedAlt}"`);
    return { status: 'has-alt', current: currentAlt, suggested: generatedAlt };
  }

  console.log(`📝 ${filename}`);
  console.log(`   Generated: "${generatedAlt}"`);

  if (dryRun) {
    return {
      status: 'would-add',
      altText: generatedAlt
    };
  }

  try {
    // Add alt text to frontmatter
    frontmatter.heroImageAlt = generatedAlt;

    // Reconstruct file content
    const newContent = serializeFrontmatter(frontmatter) + '\n' + restContent;

    // Write back to file
    await fs.writeFile(filepath, newContent, 'utf-8');
    console.log(`   ✅ Alt text added`);

    return {
      status: 'success',
      altText: generatedAlt
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

  console.log('🖼️  Generating alt text for hero images...\n');

  // Read all blog posts
  const files = await fs.readdir(BLOG_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  console.log(`Found ${mdFiles.length} blog posts\n`);

  const results = {
    success: 0,
    hasAlt: 0,
    skipped: 0,
    errors: 0,
    wouldAdd: 0
  };

  // Process each post
  for (const file of mdFiles) {
    const result = await processPost(file, dryRun);

    if (result.status === 'success') {
      results.success++;
    } else if (result.status === 'would-add') {
      results.wouldAdd++;
    } else if (result.status === 'has-alt') {
      results.hasAlt++;
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
    console.log(`Would add alt text: ${results.wouldAdd} posts`);
    console.log(`Already has alt text: ${results.hasAlt} posts`);
    console.log(`Skipped (no image): ${results.skipped} posts`);
    console.log('\n💡 Run without --dry-run to actually add alt text');
  } else {
    console.log(`✅ Successfully added: ${results.success} alt texts`);
    console.log(`ℹ️  Already has alt text: ${results.hasAlt} posts`);
    console.log(`⏭️  Skipped (no image): ${results.skipped} posts`);
    console.log(`❌ Errors: ${results.errors} posts`);

    if (results.success > 0) {
      console.log('\n✅ Alt text added to frontmatter');
      console.log('💡 Review the suggestions and adjust if needed');
    }
  }
}

// Run
main().catch(console.error);
