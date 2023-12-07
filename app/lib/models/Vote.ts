export interface Vote {
  id: string;
  createdTime: string;
  updatedTime: string;
  user: {
    email: string;
  };
  weight: number;
}
