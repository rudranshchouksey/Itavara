export interface VerificationRequestDTO {
  type: 'GOVT_ID' | 'EMAIL' | 'PHONE';
  data: string; // Document ID, email address, or phone number
  otp?: string; // Optional for submission of OTP
}

export interface VerificationStatusResponse {
  isGovtIdVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  badgeType: string | null;
}
