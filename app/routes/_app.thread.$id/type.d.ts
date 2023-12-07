import type { Vote } from '@lib/models/Vote';

export interface GetMessResult {
  id: string;
  body: string;
  createdTime: string;
  updatedTime: string;
  name: string;
  user: {
    email: string;
  };
  votes: Vote[];
}

export interface GetVoteResult {
  createdTime: string;
  updatedTime: string;
  // user: {
  //   email: string;
  // };
  weight: number;
}
