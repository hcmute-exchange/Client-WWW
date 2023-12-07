import type { Message } from '@lib/models/Message';
import type { GetTagResult } from '../_app.newthread/type';
import type { View } from '@lib/models/View';

export interface GetPostResult {
  id: string;
  createdTime: string;
  updatedTime: string;
  subject: string;
  initialMessage: Message;
  tags: GetTagResult[];
  views: View[];
}
