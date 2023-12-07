import type { Message } from './Message';
import type { Tag } from './Tag';
import type { View } from './View';

export interface Post {
  id: string;
  createdTime: string;
  updatedTime: string;
  subject: string;
  initialMessage: Message;
  tags: Tag[];
  views: View[];
}
