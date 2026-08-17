import { prisma } from '@itvara/db';

export class PrivacyService {
  /**
   * Sanitizes text by replacing hidden keywords of the target user with ***
   * @param targetUserId The ID of the user whose profile/post is being commented on
   * @param text The comment text
   * @returns Sanitized text
   */
  static async sanitizeComment(targetUserId: string, text: string): Promise<string> {
    try {
      const settings = await prisma.userPrivacySetting.findUnique({
        where: { userId: targetUserId }
      });

      if (!settings || !settings.hiddenKeywords || settings.hiddenKeywords.length === 0) {
        return text;
      }

      let sanitizedText = text;
      settings.hiddenKeywords.forEach(keyword => {
        // Case insensitive global replacement
        const regex = new RegExp(`\\b${this.escapeRegExp(keyword)}\\b`, 'gi');
        sanitizedText = sanitizedText.replace(regex, '***');
      });

      return sanitizedText;
    } catch (error) {
      console.error('Error in sanitizeComment:', error);
      return text; // fallback to original text if fails
    }
  }

  /**
   * Checks if an interaction should be blocked (e.g. if actor is blocked by target)
   */
  static async isInteractionBlocked(targetUserId: string, actorUserId: string): Promise<boolean> {
    try {
      const settings = await prisma.userPrivacySetting.findUnique({
        where: { userId: targetUserId }
      });

      if (!settings) return false;

      return settings.blockedUserIds.includes(actorUserId);
    } catch (error) {
      console.error('Error in isInteractionBlocked:', error);
      return false;
    }
  }

  private static escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
}
