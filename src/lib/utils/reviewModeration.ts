// Simple spam detection and content moderation utilities

interface ModerationResult {
  isSpam: boolean;
  isInappropriate: boolean;
  confidence: number;
  reasons: string[];
}

// Common spam indicators
const SPAM_KEYWORDS = [
  'viagra', 'casino', 'lottery', 'winner', 'congratulations',
  'click here', 'free money', 'make money fast', 'work from home',
  'buy now', 'limited time', 'act now', 'urgent', 'guaranteed',
];

// Inappropriate content keywords
const INAPPROPRIATE_KEYWORDS = [
  'hate', 'racist', 'discrimination', 'violence', 'threat',
  // Add more as needed
];

// Excessive repetition patterns
const REPETITION_PATTERNS = [
  /(.)\1{4,}/g, // Same character repeated 5+ times
  /(\w+)\s+\1\s+\1/gi, // Same word repeated 3+ times
];

export function moderateReviewContent(comment: string): ModerationResult {
  const result: ModerationResult = {
    isSpam: false,
    isInappropriate: false,
    confidence: 0,
    reasons: [],
  };

  const lowerComment = comment.toLowerCase();
  let spamScore = 0;
  let inappropriateScore = 0;

  // Check for spam keywords
  const spamMatches = SPAM_KEYWORDS.filter(keyword => 
    lowerComment.includes(keyword.toLowerCase())
  );
  if (spamMatches.length > 0) {
    spamScore += spamMatches.length * 20;
    result.reasons.push(`Contains spam keywords: ${spamMatches.join(', ')}`);
  }

  // Check for inappropriate content
  const inappropriateMatches = INAPPROPRIATE_KEYWORDS.filter(keyword => 
    lowerComment.includes(keyword.toLowerCase())
  );
  if (inappropriateMatches.length > 0) {
    inappropriateScore += inappropriateMatches.length * 30;
    result.reasons.push(`Contains inappropriate content: ${inappropriateMatches.join(', ')}`);
  }

  // Check for excessive repetition
  for (const pattern of REPETITION_PATTERNS) {
    if (pattern.test(comment)) {
      spamScore += 15;
      result.reasons.push('Contains excessive repetition');
      break;
    }
  }

  // Check for excessive capitalization
  const capsRatio = (comment.match(/[A-Z]/g) || []).length / comment.length;
  if (capsRatio > 0.7 && comment.length > 20) {
    spamScore += 10;
    result.reasons.push('Excessive use of capital letters');
  }

  // Check for excessive punctuation
  const punctuationRatio = (comment.match(/[!?]{2,}/g) || []).length;
  if (punctuationRatio > 3) {
    spamScore += 10;
    result.reasons.push('Excessive punctuation');
  }

  // Check comment length (very short or very long can be suspicious)
  if (comment.trim().length < 10) {
    spamScore += 5;
    result.reasons.push('Comment too short');
  } else if (comment.length > 800) {
    spamScore += 5;
    result.reasons.push('Comment unusually long');
  }

  // Determine final scores
  result.isSpam = spamScore >= 25;
  result.isInappropriate = inappropriateScore >= 30;
  result.confidence = Math.min(Math.max(spamScore + inappropriateScore, 0), 100) / 100;

  return result;
}

export function shouldAutoReject(moderationResult: ModerationResult): boolean {
  return moderationResult.isInappropriate || 
         (moderationResult.isSpam && moderationResult.confidence > 0.8);
}

export function shouldRequireManualReview(moderationResult: ModerationResult): boolean {
  return (moderationResult.isSpam && moderationResult.confidence > 0.5) ||
         (moderationResult.confidence > 0.3 && moderationResult.reasons.length > 2);
}

// Rate limiting utilities
export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  resetTime: Date;
}

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: Date }>();

export function checkRateLimit(
  identifier: string, 
  maxAttempts: number = 3, 
  windowMinutes: number = 60
): RateLimitResult {
  const now = new Date();
  const key = identifier;
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetTime) {
    // Reset or create new entry
    const resetTime = new Date(now.getTime() + windowMinutes * 60 * 1000);
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      allowed: true,
      remainingAttempts: maxAttempts - 1,
      resetTime,
    };
  }

  if (existing.count >= maxAttempts) {
    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime: existing.resetTime,
    };
  }

  // Increment count
  existing.count++;
  rateLimitStore.set(key, existing);

  return {
    allowed: true,
    remainingAttempts: maxAttempts - existing.count,
    resetTime: existing.resetTime,
  };
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = new Date();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes