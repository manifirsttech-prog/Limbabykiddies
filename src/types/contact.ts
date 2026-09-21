export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'replied';
  createdAt?: any;
}
