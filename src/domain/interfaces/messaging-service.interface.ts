export interface MessagingService {
  sendMessage(to: string, message: string): Promise<void>;
}
