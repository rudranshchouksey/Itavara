import { PrismaClient, VerificationBadge } from '@itvara/db';
import { VerificationRequestDTO } from '@itvara/types';

const prisma = new PrismaClient();

export class VerificationService {
  
  /**
   * Get or create a verification badge record for a user
   */
  static async getVerificationStatus(userId: string): Promise<VerificationBadge> {
    let badge = await prisma.verificationBadge.findUnique({
      where: { userId },
    });

    if (!badge) {
      badge = await prisma.verificationBadge.create({
        data: { userId },
      });
    }

    return badge;
  }

  /**
   * Handle a mock verification request
   */
  static async processVerification(userId: string, data: VerificationRequestDTO): Promise<VerificationBadge> {
    const badge = await this.getVerificationStatus(userId);
    const updates: Partial<VerificationBadge> = {};

    switch (data.type) {
      case 'GOVT_ID':
        // Mock Aadhaar/Govt ID check
        if (data.data.length > 5) { // Dummy validation
          updates.isGovtIdVerified = true;
        } else {
          throw new Error('Invalid Government ID format');
        }
        break;

      case 'EMAIL':
        // Mock Email OTP Verification
        if (data.otp === '123456') {
          updates.isEmailVerified = true;
        } else {
          throw new Error('Invalid Email OTP');
        }
        break;

      case 'PHONE':
        // Mock Phone OTP Verification
        if (data.otp === '123456') {
          updates.isPhoneVerified = true;
        } else {
          throw new Error('Invalid Phone OTP');
        }
        break;

      default:
        throw new Error('Invalid verification type');
    }

    // Determine if we should grant a global badge based on combinations
    // For instance, if they have Email, Phone, and Govt ID verified, grant "VERIFIED_TRAVELER"
    const isGovtIdVerified = updates.isGovtIdVerified ?? badge.isGovtIdVerified;
    const isEmailVerified = updates.isEmailVerified ?? badge.isEmailVerified;
    const isPhoneVerified = updates.isPhoneVerified ?? badge.isPhoneVerified;

    if (isGovtIdVerified && isEmailVerified && isPhoneVerified) {
      // In a real app, we might query the user's role to grant 'SUPERHOST' vs 'VERIFIED_TRAVELER'
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.role === 'HOST' || user?.role === 'SUPERHOST') {
        updates.badgeType = 'VERIFIED_HOST';
      } else {
        updates.badgeType = 'VERIFIED_TRAVELER';
      }
    }

    // Update DB
    return prisma.verificationBadge.update({
      where: { id: badge.id },
      data: updates,
    });
  }
}
