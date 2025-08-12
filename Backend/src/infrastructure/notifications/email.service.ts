export class EmailService {
  async sendInvitation(email: string, token: string): Promise<void> {
    console.log(`Sending invitation to ${email} with token ${token}`);
  }

  async sendAlert(email: string, message: string): Promise<void> {
    console.log(`Sending alert to ${email}: ${message}`);
  }
}
