export interface Notification {
  id: string;
  type: 'answer' | 'comment' | 'vote';
  message: string;
  questionId: string;
  questionTitle: string;
  triggeredBy: string;
  read: boolean;
  createdAt: Date;
}

export interface Answer {
  id: string;
  content: string;
  author: string;
  votes: number;
  createdAt: Date;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  votes: number;
  answers: Answer[];
  createdAt: Date;
}

export const mockQuestions: Question[] = [
  {
    id: "1",
    title: "How to implement React hooks effectively?",
    content: "I'm struggling with understanding when to use useState vs useReducer. Can someone explain the best practices and provide examples of when each hook is most appropriate?",
    author: "ReactNewbie",
    tags: ["React", "Hooks", "JavaScript"],
    votes: 42,
    createdAt: new Date("2024-01-15"),
    answers: [
      {
        id: "a1",
        content: "useState is perfect for simple state management. Use it when you have independent state variables. useReducer is better for complex state logic that involves multiple sub-values or when the next state depends on the previous one.",
        author: "ReactExpert",
        votes: 28,
        createdAt: new Date("2024-01-15")
      },
      {
        id: "a2",
        content: "Here's a simple rule: if your state is a primitive value (string, number, boolean) or a simple object, use useState. If you need complex state transitions or multiple actions, useReducer is your friend.",
        author: "HookMaster",
        votes: 15,
        createdAt: new Date("2024-01-16")
      }
    ]
  },
  {
    id: "2",
    title: "Best practices for API error handling in TypeScript?",
    content: "What's the recommended approach for handling API errors in TypeScript applications? Should I use try-catch blocks everywhere or implement a global error handler?",
    author: "TypeScriptDev",
    tags: ["TypeScript", "API", "Error Handling"],
    votes: 35,
    createdAt: new Date("2024-01-14"),
    answers: [
      {
        id: "a3",
        content: "I recommend creating custom error classes and using a combination of try-catch blocks for specific error handling and a global error boundary for unexpected errors. This gives you both granular control and a safety net.",
        author: "ErrorHandler",
        votes: 22,
        createdAt: new Date("2024-01-14")
      }
    ]
  },
  {
    id: "3",
    title: "PostgreSQL vs MongoDB: Which database to choose?",
    content: "I'm starting a new project and can't decide between PostgreSQL and MongoDB. The application will handle user data, posts, and real-time messaging. What are the pros and cons of each?",
    author: "DatabaseNewbie",
    tags: ["PostgreSQL", "MongoDB", "Database Design"],
    votes: 58,
    createdAt: new Date("2024-01-13"),
    answers: [
      {
        id: "a4",
        content: "For your use case with structured user data and posts, I'd recommend PostgreSQL. It has excellent ACID compliance, mature ecosystem, and great performance. MongoDB is better for rapidly changing schemas and document-heavy applications.",
        author: "DBArchitect",
        votes: 31,
        createdAt: new Date("2024-01-13")
      },
      {
        id: "a5",
        content: "Consider your team's expertise too. PostgreSQL has SQL which most developers know, while MongoDB requires learning its query language. For real-time messaging, both can work well with appropriate tools.",
        author: "FullStackDev",
        votes: 19,
        createdAt: new Date("2024-01-14")
      }
    ]
  },
  {
    id: "4",
    title: "Docker containerization best practices for Node.js?",
    content: "I'm new to Docker and want to containerize my Node.js application. What are the essential best practices I should follow for security, performance, and maintainability?",
    author: "NodeDeveloper",
    tags: ["Docker", "Node.js", "DevOps"],
    votes: 27,
    createdAt: new Date("2024-01-12"),
    answers: [
      {
        id: "a6",
        content: "Key practices: use multi-stage builds, run as non-root user, use .dockerignore, keep images small with alpine base, and don't install dev dependencies in production.",
        author: "DockerPro",
        votes: 24,
        createdAt: new Date("2024-01-12")
      }
    ]
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "answer",
    message: "ReactExpert answered your question",
    questionId: "1",
    questionTitle: "How to implement React hooks effectively?",
    triggeredBy: "ReactExpert",
    read: false,
    createdAt: new Date("2024-01-15")
  },
  {
    id: "n2",
    type: "answer",
    message: "HookMaster answered your question",
    questionId: "1",
    questionTitle: "How to implement React hooks effectively?",
    triggeredBy: "HookMaster",
    read: false,
    createdAt: new Date("2024-01-16")
  },
  {
    id: "n3",
    type: "answer",
    message: "ErrorHandler answered your question",
    questionId: "2",
    questionTitle: "Best practices for API error handling in TypeScript?",
    triggeredBy: "ErrorHandler",
    read: true,
    createdAt: new Date("2024-01-14")
  },
  {
    id: "n4",
    type: "vote",
    message: "Your answer received 5 upvotes",
    questionId: "3",
    questionTitle: "PostgreSQL vs MongoDB: Which database to choose?",
    triggeredBy: "Multiple users",
    read: true,
    createdAt: new Date("2024-01-13")
  }
];