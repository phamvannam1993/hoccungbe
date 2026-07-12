/**
 * SEO Description Generator Utility
 * Tạo mô tả SEO duy nhất cho mỗi bài học
 * Có thể dùng để batch-generate cho tất cả bài học
 */

export interface LessonForSeoGen {
  id: number;
  title: string;
  courseTitle?: string;
  goals?: string[];
}

export function generateSeoDescription(lesson: LessonForSeoGen): string {
  const goals = lesson.goals || [];
  const courseTitle = lesson.courseTitle?.toLowerCase() || '';
  const lessonTitle = lesson.title.toLowerCase();

  // Extract keywords từ lesson title
  const titleKeywords = lessonTitle
    .split(/[\s\-:,]/)
    .filter(w => w.length > 2 && !['của', 'và', 'các', 'là', 'để', 'với', 'từ', 'bài', 'những'].includes(w));

  // Detect lesson type - more intelligent detection
  // Priority: courseTitle > lessonTitle keywords
  const isMath = courseTitle.includes('toán') ||
                 (lessonTitle.includes('đếm') && courseTitle.includes('toán')) ||
                 (lessonTitle.includes('phép') && courseTitle.includes('toán')) ||
                 (lessonTitle.includes('tính') && courseTitle.includes('toán')) ||
                 (lessonTitle.includes('hình') && courseTitle.includes('toán')) ||
                 (lessonTitle.includes('số') && courseTitle.includes('toán'));

  const isLanguage = courseTitle.includes('việt') || courseTitle.includes('anh') ||
                     (lessonTitle.includes('chữ') && courseTitle.includes('việt')) ||
                     (lessonTitle.includes('từ') && courseTitle.includes('việt')) ||
                     (lessonTitle.includes('âm') && courseTitle.includes('việt'));

  const isScience = courseTitle.includes('khoa học') || courseTitle.includes('tự nhiên') ||
                    (lessonTitle.includes('động vật') && courseTitle.includes('khoa')) ||
                    (lessonTitle.includes('thực vật') && courseTitle.includes('khoa'));

  const skillsList = goals.length > 0 ? goals.slice(0, 3) : [];
  const mainKeyword = titleKeywords.length > 0 ? titleKeywords[0] : 'nội dung học tập';

  // Variation arrays
  const openings = [
    `Bài học "${lesson.title}" giúp bé `,
    `Trong bài "${lesson.title}", bé sẽ `,
    `Bài học về ${mainKeyword} này giúp bé `,
    `Với bài "${lesson.title}", bé có cơ hội `,
  ];

  const closes = [
    `được thiết kế vui vẻ và khắc sâu kiến thức.`,
    `phù hợp với độ tuổi và khuyến khích tò mò học tập.`,
    `được luyện tập toàn diện qua hình thức đa cảm.`,
    `có cơ hội ôn tập và làm quen từ từ.`,
  ];

  // Hash lesson ID để select variation consistent
  const lessonIdHash = (lesson.id || 0) % 4;

  let description = '';

  if (isMath) {
    const variations = [
      `rèn kỹ năng tư duy ${mainKeyword} một cách vui vẻ. Thông qua video hình ảnh sinh động, bài tập tương tác cho phép bé thử sai an toàn, và bài kiểm tra kiểm chứng kiến thức. ${closes[lessonIdHash]}`,
      `làm quen với ${mainKeyword} thông qua hoạt động luyện tập toán học. Bé sẽ áp dụng kỹ năng tính toán và giải quyết vấn đề. Kết hợp video bài giảng, bài tập thực hành, và bài kiểm tra để xây dựng nền tảng toán vững chắc. Được thiết kế để trẻ yêu thích toán học.`,
      `phát triển tư duy toán học với ${mainKeyword} qua bài học bài bản. Luyện tập kỹ năng từng bước. Video sinh động, bài tập đa dạng, và kiểm tra giúp bé nắm vững khái niệm. ${closes[lessonIdHash]}`,
    ];
    description = openings[lessonIdHash] + variations[lessonIdHash % variations.length];
  } else if (isLanguage) {
    const subtitle = courseTitle.includes('anh') ? 'Tiếng Anh' : 'Tiếng Việt';
    const variations = [
      `nắm vững kỹ năng ${mainKeyword} trong chương trình ${subtitle}. Bé sẽ luyện tập phát âm, nhận biết, và viết chữ thông qua các hoạt động học tập. Video bài giảng rõ ràng, bài tập tương tác, và bài kiểm tra giúp bé kiểm chứng kiến thức. ${closes[lessonIdHash]}`,
      `tiến bộ trong ${subtitle} với bài học về ${mainKeyword}. Phát triển kỹ năng ngôn ngữ cơ bản một cách tự nhiên. Hình thức giảng dạy kết hợp video, bài tập, kiểm tra giúp bé vừa học vừa nhớ lâu. Được thiết kế để khuyến khích tự tin giao tiếp.`,
      `phát triển khả năng ${mainKeyword} thông qua các bài tập đa dạng. Bé sẽ khám phá quy tắc ngôn ngữ và áp dụng vào thực tế. Qua video sinh động, bài tập tương tác, và bài kiểm tra ngắn, bé sẽ thấy tiến bộ rõ rệt. ${closes[lessonIdHash]}`,
    ];
    description = openings[lessonIdHash] + variations[lessonIdHash % variations.length];
  } else if (isScience) {
    const variations = [
      `khám phá bí mật của ${mainKeyword} qua bài học khoa học. Bé sẽ phát triển kỹ năng quan sát và tìm hiểu thế giới tự nhiên. Video hình ảnh sinh động, bài tập tương tác kích thích tò mò, và bài kiểm tra giúp bé hiểu sâu hơn. ${closes[lessonIdHash]}`,
      `tìm hiểu về ${mainKeyword} qua hoạt động khám phá thực tế. Bé sẽ học cách quan sát, phân tích, và suy luận. Hình thức giảng dạy kết hợp video, bài tập, kiểm tra giúp bé không quên kiến thức. Được thiết kế để phát triển tình yêu khoa học và khám phá.`,
      `hiểu rõ hơn về ${mainKeyword} qua bài học khoa học vui vẻ. Luyện tập kỹ năng quan sát và suy luận logic. Video sinh động, bài tập tương tác thực hành, và kiểm tra toàn diện giúp bé tự tin khám phá thế giới. ${closes[lessonIdHash]}`,
    ];
    description = openings[lessonIdHash] + variations[lessonIdHash % variations.length];
  } else {
    const variations = [
      `phát triển kỹ năng ${mainKeyword} một cách toàn diện. Thông qua video bài giảng chi tiết, bài tập tương tác, và kiểm tra, bé sẽ nắm vững nội dung bài học. ${closes[lessonIdHash]}`,
      `tiến bộ thông qua bài học về ${mainKeyword} với phương pháp giảng dạy bài bản. Kết hợp video hấp dẫn, bài tập đa dạng, và kiểm tra toàn diện. Được thiết kế phù hợp với chương trình giáo dục chuẩn và phát triển toàn diện cho trẻ.`,
      `làm quen với ${mainKeyword} qua các hoạt động luyện tập sáng tạo. Bé sẽ phát triển từng bước thông qua video sinh động, bài tập thực hành, và kiểm tra ngắn. Mỗi bài học được thiết kế để giữ sự tò mò và hứng thú học tập của bé. ${closes[lessonIdHash]}`,
    ];
    description = openings[lessonIdHash] + variations[lessonIdHash % variations.length];
  }

  return description;
}

/**
 * Batch generate SEO descriptions cho tất cả bài học
 * Dùng trong migration hoặc cron job
 */
export async function generateAndSaveAllSeoDescriptions(
  fetchAllLessons: () => Promise<LessonForSeoGen[]>,
  saveSeoDescription: (lessonId: number, description: string) => Promise<void>
) {
  try {
    const lessons = await fetchAllLessons();
    console.log(`Generating SEO descriptions for ${lessons.length} lessons...`);

    let successCount = 0;
    for (const lesson of lessons) {
      const description = generateSeoDescription(lesson);
      await saveSeoDescription(lesson.id, description);
      successCount++;

      if (successCount % 10 === 0) {
        console.log(`✓ Generated ${successCount}/${lessons.length}`);
      }
    }

    console.log(`✓ Successfully generated ${successCount} SEO descriptions`);
    return { success: true, generated: successCount };
  } catch (error) {
    console.error('Error generating SEO descriptions:', error);
    throw error;
  }
}
