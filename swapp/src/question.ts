export interface Question {
  _id: string;
  title: string;
  body?: string;
  tags: string[];
  votes: number;
  createdAt: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
  answers?: any[]; // optional for now (can type later)
}
