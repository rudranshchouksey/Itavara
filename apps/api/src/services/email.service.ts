/**
 * EmailService handles dispatching transaction emails.
 * Currently stubbed to log output instead of requiring Resend/SendGrid keys.
 */
export class EmailService {
  static async sendBookingConfirmation(userEmail: string, bookingData: any, pdfBuffer: Buffer): Promise<void> {
    console.log(`[EmailService] Sending Booking Confirmation to ${userEmail}`);
    console.log(`[EmailService] Attachment: receipt_${bookingData.id}.pdf (${pdfBuffer.length} bytes)`);
    
    // In production:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'reservations@itvara.com',
    //   to: userEmail,
    //   subject: `Your Booking is Confirmed! #${bookingData.id}`,
    //   html: `<p>Pack your bags! Your booking is confirmed.</p>`,
    //   attachments: [
    //     {
    //       filename: `receipt_${bookingData.id}.pdf`,
    //       content: pdfBuffer,
    //     }
    //   ]
    // });
    
    console.log(`[EmailService] Email dispatched successfully (STUB).`);
  }
}
