#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const OUTPUT_DIR = path.join(__dirname, '../seo-reports');

// SEO thresholds
const THRESHOLDS = {
  title: { min: 30, ideal: 50, max: 60 },
  description: { min: 120, ideal: 150, max: 160 },
  tags: { min: 3, ideal: 5, max: 8 },
  readingTime: { min: 2, max: 15 }
};

// Parse frontmatter from markdown file
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let currentArray = null;

  for (const line of lines) {
    // Array items
    if (line.trim().startsWith('-')) {
      if (currentArray) {
        const value = line.trim().substring(1).trim().replace(/^['"]|['"]$/g, '');
        currentArray.push(value);
      }
      continue;
    }

    // Key-value pairs
    const keyMatch = line.match(/^(\w+):\s*(.*)$/);
    if (keyMatch) {
      const [, key, value] = keyMatch;
      currentKey = key;

      const trimmedValue = value.trim();

      // Check if starting an array
      if (trimmedValue === '') {
        currentArray = [];
        frontmatter[key] = currentArray;
      } else if (trimmedValue.startsWith('[')) {
        // Inline array format: tags: ["a", "b", "c"]
        try {
          frontmatter[key] = JSON.parse(trimmedValue);
          currentArray = null;
        } catch (e) {
          // Fallback to string if JSON parse fails
          frontmatter[key] = trimmedValue.replace(/^['"]|['"]$/g, '');
          currentArray = null;
        }
      } else {
        // Single value
        frontmatter[key] = trimmedValue.replace(/^['"]|['"]$/g, '');
        currentArray = null;
      }
    }
  }

  return frontmatter;
}

// Calculate reading time from content
function calculateReadingTime(content) {
  // Remove frontmatter
  const contentWithoutFrontmatter = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');

  // Remove code blocks
  const withoutCode = contentWithoutFrontmatter.replace(/```[\s\S]*?```/g, '');

  // Count words
  const words = withoutCode.trim().split(/\s+/).length;

  // 200 words per minute
  return Math.ceil(words / 200);
}

// Analyze a single blog post
async function analyzePost(filename) {
  const filepath = path.join(BLOG_DIR, filename);
  const content = await fs.readFile(filepath, 'utf-8');
  const frontmatter = parseFrontmatter(content);

  if (!frontmatter) {
    return {
      filename,
      error: 'No frontmatter found'
    };
  }

  const issues = [];
  const warnings = [];
  const suggestions = [];

  // Title validation
  const title = frontmatter.title || '';
  const titleLength = title.length;

  if (!title) {
    issues.push('Missing title');
  } else if (titleLength < THRESHOLDS.title.min) {
    warnings.push(`Title too short (${titleLength} chars, min ${THRESHOLDS.title.min})`);
  } else if (titleLength > THRESHOLDS.title.max) {
    warnings.push(`Title too long (${titleLength} chars, max ${THRESHOLDS.title.max})`);
  } else if (titleLength > THRESHOLDS.title.ideal) {
    suggestions.push(`Title slightly long (${titleLength} chars, ideal ${THRESHOLDS.title.ideal})`);
  }

  // Description validation
  const description = frontmatter.description || '';
  const descLength = description.length;

  if (!description) {
    issues.push('Missing description');
  } else if (descLength < THRESHOLDS.description.min) {
    warnings.push(`Description too short (${descLength} chars, min ${THRESHOLDS.description.min})`);
  } else if (descLength > THRESHOLDS.description.max) {
    warnings.push(`Description too long (${descLength} chars, max ${THRESHOLDS.description.max})`);
  } else if (descLength < THRESHOLDS.description.ideal) {
    suggestions.push(`Description could be longer (${descLength} chars, ideal ${THRESHOLDS.description.ideal}-${THRESHOLDS.description.max})`);
  }

  // Tags validation
  const tags = frontmatter.tags || [];
  const tagCount = Array.isArray(tags) ? tags.length : 0;

  if (tagCount === 0) {
    warnings.push('No tags found');
  } else if (tagCount < THRESHOLDS.tags.min) {
    suggestions.push(`Few tags (${tagCount}, ideal ${THRESHOLDS.tags.ideal})`);
  } else if (tagCount > THRESHOLDS.tags.max) {
    suggestions.push(`Many tags (${tagCount}, ideal ${THRESHOLDS.tags.ideal})`);
  }

  // Image validation
  if (!frontmatter.heroImage) {
    warnings.push('Missing hero image');
  } else if (frontmatter.heroImage.startsWith('http')) {
    warnings.push('Hero image is external URL (should be local)');
  }

  // Alt text validation
  if (!frontmatter.heroImageAlt && frontmatter.heroImage) {
    issues.push('Missing heroImageAlt field');
  }

  // Reading time
  const calculatedReadingTime = calculateReadingTime(content);
  if (!frontmatter.readingTime) {
    suggestions.push(`Add readingTime: ${calculatedReadingTime} to frontmatter`);
  }

  // Date validation
  if (!frontmatter.pubDate) {
    issues.push('Missing pubDate');
  }

  // Draft status
  const isDraft = frontmatter.draft === true || frontmatter.draft === 'true';

  // SEO score calculation
  let score = 100;
  score -= issues.length * 15;
  score -= warnings.length * 8;
  score -= suggestions.length * 3;
  score = Math.max(0, score);

  return {
    filename,
    slug: filename.replace(/\.(md|mdx)$/, ''),
    title,
    titleLength,
    description,
    descriptionLength: descLength,
    tags,
    tagCount,
    heroImage: frontmatter.heroImage,
    heroImageAlt: frontmatter.heroImageAlt,
    readingTime: frontmatter.readingTime,
    calculatedReadingTime,
    pubDate: frontmatter.pubDate,
    updatedDate: frontmatter.updatedDate,
    author: frontmatter.author || 'ClaudeCodeLab',
    draft: isDraft,
    issues,
    warnings,
    suggestions,
    seoScore: score
  };
}

// Generate report
async function generateReport() {
  console.log('🔍 Starting SEO audit...\n');

  // Read all blog posts
  const files = await fs.readdir(BLOG_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  console.log(`Found ${mdFiles.length} blog posts\n`);

  // Analyze each post
  const results = [];
  for (const file of mdFiles) {
    const result = await analyzePost(file);
    results.push(result);

    // Console output
    const status = result.error ? '❌' :
                   result.issues.length > 0 ? '⚠️ ' :
                   result.warnings.length > 0 ? '⚡' :
                   '✅';

    console.log(`${status} ${result.filename} (Score: ${result.seoScore}/100)`);

    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    if (result.issues.length > 0) {
      result.issues.forEach(issue => console.log(`   ❌ ${issue}`));
    }
    if (result.warnings.length > 0) {
      result.warnings.forEach(warning => console.log(`   ⚠️  ${warning}`));
    }
  }

  // Calculate statistics
  const published = results.filter(r => !r.draft && !r.error);
  const avgScore = published.reduce((sum, r) => sum + r.seoScore, 0) / published.length;

  const criticalIssues = results.filter(r => r.issues.length > 0);
  const needsWork = results.filter(r => r.warnings.length > 0);
  const shortDescriptions = published.filter(r => r.descriptionLength < THRESHOLDS.description.min);
  const longTitles = published.filter(r => r.titleLength > THRESHOLDS.title.max);
  const externalImages = published.filter(r => r.heroImage && r.heroImage.startsWith('http'));
  const missingAltText = published.filter(r => !r.heroImageAlt);

  // Summary
  const summary = {
    totalPosts: mdFiles.length,
    publishedPosts: published.length,
    draftPosts: results.filter(r => r.draft).length,
    averageSeoScore: Math.round(avgScore),
    criticalIssues: criticalIssues.length,
    postsNeedingWork: needsWork.length,
    issues: {
      shortDescriptions: shortDescriptions.length,
      longTitles: longTitles.length,
      externalImages: externalImages.length,
      missingAltText: missingAltText.length
    }
  };

  // Console summary
  console.log('\n📊 SUMMARY');
  console.log('═'.repeat(60));
  console.log(`Total Posts: ${summary.totalPosts} (${summary.publishedPosts} published, ${summary.draftPosts} drafts)`);
  console.log(`Average SEO Score: ${summary.averageSeoScore}/100`);
  console.log(`\nPosts with Critical Issues: ${summary.criticalIssues}`);
  console.log(`Posts Needing Work: ${summary.postsNeedingWork}`);
  console.log(`\nSpecific Issues:`);
  console.log(`  - Short descriptions (<120 chars): ${summary.issues.shortDescriptions}`);
  console.log(`  - Long titles (>60 chars): ${summary.issues.longTitles}`);
  console.log(`  - External images: ${summary.issues.externalImages}`);
  console.log(`  - Missing alt text: ${summary.issues.missingAltText}`);

  // Top issues to fix
  console.log('\n🎯 TOP PRIORITY FIXES:');
  console.log('═'.repeat(60));

  if (shortDescriptions.length > 0) {
    console.log('\n📝 Posts with short descriptions:');
    shortDescriptions
      .sort((a, b) => a.descriptionLength - b.descriptionLength)
      .slice(0, 10)
      .forEach(post => {
        console.log(`   - ${post.filename} (${post.descriptionLength} chars)`);
      });
  }

  if (longTitles.length > 0) {
    console.log('\n✂️  Posts with long titles:');
    longTitles
      .sort((a, b) => b.titleLength - a.titleLength)
      .slice(0, 5)
      .forEach(post => {
        console.log(`   - ${post.filename} (${post.titleLength} chars)`);
        console.log(`     "${post.title}"`);
      });
  }

  // Save JSON report
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const jsonReport = {
    generated: new Date().toISOString(),
    summary,
    posts: results
  };

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'seo-audit.json'),
    JSON.stringify(jsonReport, null, 2)
  );

  // Save Markdown report
  const mdReport = generateMarkdownReport(summary, results, shortDescriptions, longTitles);
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'seo-audit.md'),
    mdReport
  );

  console.log(`\n✅ Reports saved to ${OUTPUT_DIR}/`);
}

function generateMarkdownReport(summary, results, shortDescriptions, longTitles) {
  const published = results.filter(r => !r.draft && !r.error);

  return `# SEO Audit Report
Generated: ${new Date().toISOString()}

## Summary

- **Total Posts:** ${summary.totalPosts} (${summary.publishedPosts} published, ${summary.draftPosts} drafts)
- **Average SEO Score:** ${summary.averageSeoScore}/100
- **Posts with Critical Issues:** ${summary.criticalIssues}
- **Posts Needing Work:** ${summary.postsNeedingWork}

### Issue Breakdown

- Short descriptions (<120 chars): **${summary.issues.shortDescriptions}**
- Long titles (>60 chars): **${summary.issues.longTitles}**
- External images: **${summary.issues.externalImages}**
- Missing alt text: **${summary.issues.missingAltText}**

## Priority Fixes

### 1. Short Descriptions (${shortDescriptions.length} posts)

${shortDescriptions.map(post => `- **${post.filename}** (${post.descriptionLength} chars)
  - Current: "${post.description}"
  - Target: 150-160 characters`).join('\n\n')}

### 2. Long Titles (${longTitles.length} posts)

${longTitles.map(post => `- **${post.filename}** (${post.titleLength} chars)
  - Current: "${post.title}"
  - Target: <60 characters`).join('\n\n')}

## All Posts

${published.sort((a, b) => a.seoScore - b.seoScore).map(post => `### ${post.filename} - Score: ${post.seoScore}/100

- **Title:** ${post.title} (${post.titleLength} chars)
- **Description:** ${post.description ? `${post.descriptionLength} chars` : 'MISSING'}
- **Tags:** ${post.tagCount} tags
- **Hero Image:** ${post.heroImage ? (post.heroImage.startsWith('http') ? '⚠️ External' : '✅ Local') : '❌ Missing'}
- **Alt Text:** ${post.heroImageAlt ? '✅' : '❌'}
- **Reading Time:** ${post.readingTime || `❌ (suggested: ${post.calculatedReadingTime})`}

${post.issues.length > 0 ? `**Issues:**\n${post.issues.map(i => `- ❌ ${i}`).join('\n')}` : ''}
${post.warnings.length > 0 ? `**Warnings:**\n${post.warnings.map(w => `- ⚠️ ${w}`).join('\n')}` : ''}
${post.suggestions.length > 0 ? `**Suggestions:**\n${post.suggestions.map(s => `- 💡 ${s}`).join('\n')}` : ''}
`).join('\n---\n\n')}
`;
}

// Run the audit
generateReport().catch(console.error);
