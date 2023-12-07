import type { Vote } from './Vote';

export interface Message {
  id: string;
  createdTime: string;
  updatedTime: string;
  body: string;
  user: {
    email: string;
  };
  votes: Vote[];
}
