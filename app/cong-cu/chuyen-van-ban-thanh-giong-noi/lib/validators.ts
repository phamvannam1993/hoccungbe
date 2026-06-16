/**
 * Text validation utilities for TTS input
 */

export interface ValidationError {
  code: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  charCount: number;
}

// Vietnamese diacritics and allowed characters
const VIETNAMESE_PATTERN =
  /^[\p{L}\p{N}\s.,!?;:\-—()\[\]'"\"\/\\àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]*$/u;

// Profanity patterns (basic list - can be extended)
const PROFANITY_PATTERNS = [
  /\b(đĩ|đĩ\s*ba|chó|chó\s*đẻ|thằng|ngu|óc|tạo|vãi)\b/gi,
  /[^\p{L}\p{N}\s.,!?;:\-—()\[\]'"\/\\]/gu, // Special characters not in whitelist
];

export const MAX_CHARACTERS = 500;
export const MIN_CHARACTERS = 1;
export const WARNING_THRESHOLD = 400;

/**
 * Validate text length
 */
export function validateLength(text: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const length = text.length;

  if (length < MIN_CHARACTERS) {
    errors.push({
      code: 'TEXT_EMPTY',
      message: 'Vui lòng nhập ít nhất một ký tự',
    });
  }

  if (length > MAX_CHARACTERS) {
    errors.push({
      code: 'TEXT_TOO_LONG',
      message: `Vượt quá giới hạn ${MAX_CHARACTERS} ký tự (hiện có ${length} ký tự)`,
    });
  }

  return errors;
}

/**
 * Validate character types
 */
export function validateCharacters(text: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for invalid characters
  const invalidChars = text.match(/[^\p{L}\p{N}\s.,!?;:\-—()\[\]'"\/\\]/gu);
  if (invalidChars && invalidChars.length > 0) {
    const uniqueChars = [...new Set(invalidChars)].join('');
    errors.push({
      code: 'INVALID_CHARACTERS',
      message: `Ký tự không hợp lệ: ${uniqueChars}. Chỉ sử dụng chữ cái, số, và dấu câu cơ bản.`,
    });
  }

  return errors;
}

/**
 * Validate for profanity or inappropriate content
 */
export function validateProfanity(text: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check against profanity patterns
  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(text)) {
      errors.push({
        code: 'INAPPROPRIATE_CONTENT',
        message: 'Nội dung chứa từ không phù hợp. Vui lòng kiểm tra lại.',
      });
      break; // Only report once
    }
  }

  return errors;
}

/**
 * Get validation warnings
 */
export function getWarnings(charCount: number): ValidationError[] {
  const warnings: ValidationError[] = [];

  if (charCount >= WARNING_THRESHOLD && charCount < MAX_CHARACTERS) {
    warnings.push({
      code: 'APPROACHING_LIMIT',
      message: `Sắp đạt giới hạn (${charCount}/${MAX_CHARACTERS} ký tự)`,
    });
  }

  return warnings;
}

/**
 * Complete validation function
 */
export function validateText(text: string): ValidationResult {
  const charCount = text.length;
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Check length
  errors.push(...validateLength(text));

  // Only check character validity if length is OK
  if (text.trim().length > 0 && charCount <= MAX_CHARACTERS) {
    errors.push(...validateCharacters(text));
    errors.push(...validateProfanity(text));
  }

  // Get warnings
  warnings.push(...getWarnings(charCount));

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    charCount,
  };
}

/**
 * Sanitize text by removing invalid characters
 */
export function sanitizeText(text: string): string {
  // Remove characters outside whitelist
  return text
    .replace(/[^\p{L}\p{N}\s.,!?;:\-—()\[\]'"\/\\]/gu, '')
    .trim();
}

/**
 * Truncate text to max length
 */
export function truncateText(text: string, maxLength: number = MAX_CHARACTERS): string {
  return text.substring(0, maxLength);
}

/**
 * Check if text contains only whitespace
 */
export function isWhitespaceOnly(text: string): boolean {
  return text.trim().length === 0;
}

/**
 * Normalize text (trim and collapse multiple spaces)
 */
export function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}
