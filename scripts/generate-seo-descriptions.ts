#!/usr/bin/env node

/**
 * CLI Script để generate SEO descriptions cho tất cả bài học
 *
 * Chạy: npx ts-node scripts/generate-seo-descriptions.ts
 * Hoặc: npm run generate-seo:all
 */

import { generateSeoDescription } from '../lib/seo-description-generator';
import * as fs from 'fs';
import * as path from 'path';

interface Lesson {
  id: number;
  title: string;
  courseTitle?: string;
  goals?: string[];
  seoDescription?: string;
}

async function getAllLessons(): Promise<Lesson[]> {
  // Option 1: Fetch từ API
  const apiUrl = process.env.API_URL || 'http://localhost:3000';

  try {
    console.log('📡 Fetching lessons from API...');
    const response = await fetch(`${apiUrl}/api/lessons`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.lessons || [];
  } catch (error) {
    console.error('❌ Failed to fetch from API:', error);
    console.log('💡 Make sure API is running at', apiUrl);
    process.exit(1);
  }
}

async function generateAllDescriptions(lessons: Lesson[]) {
  console.log(`\n🚀 Generating SEO descriptions for ${lessons.length} lessons...\n`);

  const results: Array<{
    id: number;
    title: string;
    description: string;
  }> = [];

  let count = 0;

  for (const lesson of lessons) {
    try {
      const description = generateSeoDescription({
        id: lesson.id,
        title: lesson.title,
        courseTitle: lesson.courseTitle,
        goals: lesson.goals,
      });

      results.push({
        id: lesson.id,
        title: lesson.title,
        description,
      });

      count++;
      if (count % 10 === 0 || count === lessons.length) {
        console.log(`✅ ${count}/${lessons.length} generated`);
      }
    } catch (err) {
      console.error(`❌ Error for lesson ${lesson.id}:`, err);
    }
  }

  return results;
}

async function saveToDatabase(results: any[]) {
  console.log(`\n💾 Saving ${results.length} descriptions to database...\n`);

  const apiUrl = process.env.API_URL || 'http://localhost:3000';
  let successCount = 0;
  const errors: any[] = [];

  for (const result of results) {
    try {
      const response = await fetch(
        `${apiUrl}/api/lessons/${result.id}/seo`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seoDescription: result.description }),
        }
      );

      if (response.ok) {
        successCount++;
      } else {
        errors.push({
          id: result.id,
          title: result.title,
          status: response.status,
        });
      }

      if (successCount % 10 === 0 || successCount === results.length) {
        console.log(`✅ ${successCount}/${results.length} saved`);
      }
    } catch (err) {
      errors.push({
        id: result.id,
        title: result.title,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  return { successCount, errors };
}

async function exportToJson(results: any[]) {
  const filename = path.join(
    process.cwd(),
    'seo-descriptions-export.json'
  );

  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  console.log(`\n📄 Exported to ${filename}`);
  console.log(`   You can import this to your database manually`);

  return filename;
}

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  SEO Description Generator             ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    // 1. Fetch all lessons
    const lessons = await getAllLessons();
    if (lessons.length === 0) {
      console.error('❌ No lessons found!');
      process.exit(1);
    }

    console.log(`✅ Fetched ${lessons.length} lessons\n`);

    // 2. Generate descriptions
    const results = await generateAllDescriptions(lessons);

    if (results.length === 0) {
      console.error('❌ Failed to generate descriptions!');
      process.exit(1);
    }

    console.log(`✅ Generated ${results.length} descriptions\n`);

    // 3. Try to save to database
    console.log('🔄 Attempting to save to database...\n');
    const { successCount, errors } = await saveToDatabase(results);

    console.log(`\n✅ Saved ${successCount}/${results.length} to database`);

    if (errors.length > 0) {
      console.log(`⚠️  ${errors.length} failed:`);
      errors.slice(0, 5).forEach((e: any) => {
        console.log(`   - Lesson ${e.id}: ${e.title}`);
      });
      if (errors.length > 5) {
        console.log(`   ... and ${errors.length - 5} more`);
      }

      // Export failed ones for manual review
      const failedFile = await exportToJson(
        results.filter((r: any) => errors.some((e: any) => e.id === r.id))
      );
      console.log(`\n   Export failed results to: ${failedFile}`);
    }

    // 4. Export complete list for reference
    const exportFile = await exportToJson(results);

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║  ✅ Generation Complete!               ║');
    console.log('╚════════════════════════════════════════╝\n');

    console.log(`Summary:`);
    console.log(`  • Total lessons: ${results.length}`);
    console.log(`  • Saved to DB: ${successCount}`);
    console.log(`  • Failed: ${errors.length}`);
    console.log(`  • Export file: ${exportFile}`);

    process.exit(successCount === results.length ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
