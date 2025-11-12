import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import User from "../models/user.model.js";
import Question from "../models/question.model.js";
import Answer from "../models/answer.model.js";
import Voteing from "../models/vote.model.js";

const MONGO_URI =
  "mongodb+srv://anushkumar128_db_user:Gtg3D528pFWTMB4q@cluster0.gu4xexw.mongodb.net/?appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("connected to MongoDB");
  } catch (err) {
    console.error("db not connected:", err);
    process.exit(1);
  }
};

// Random date between 2023–2025
const randomDate = () =>
  faker.date.between({ from: "2023-01-01", to: "2025-11-01" });

// Shuffle helper
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

const seedData = async () => {
  await connectDB();

  try {
    // 🧹 Clear old data
    await Promise.all([
      User.deleteMany(),
      Question.deleteMany(),
      Answer.deleteMany(),
      Voteing.deleteMany(),
    ]);
    console.log("clean old data");

    // Create Users
    const users = Array.from({ length: 20 }).map(() => ({
      username: faker.internet.displayName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      reputation: faker.number.int({ min: 0, max: 500 }),
      createdAt: randomDate(),
    }));
    const createdUsers = await User.insertMany(users);
    console.log("Users inserted:", createdUsers.length);

    // Topics and Question Templates
    const techTopics = [
      "javascript", "react", "nodejs", "python", "mongodb", "docker",
      "linux", "networking", "flutter", "git", "sql", "api", "aws",
      "machine-learning", "ai", "express", "html", "css", "typescript"
    ];

    const sampleQuestions = [
      (topic) => `How do I fix a ${topic} error when my app crashes unexpectedly?`,
      (topic) => `What’s the best way to optimize performance in a ${topic} project?`,
      (topic) => `How can I integrate ${topic} with a backend API securely?`,
      (topic) => `Why am I getting CORS issues while working with ${topic}?`,
      (topic) => `How do I deploy a ${topic} project using Docker and Nginx?`,
      (topic) => `What are the best practices for authentication in ${topic}?`,
      (topic) => `How do I debug async/await problems in ${topic}?`,
      (topic) => `How can I handle file uploads in ${topic}?`,
      (topic) => `How to connect ${topic} with MongoDB and display data?`,
      (topic) => `What’s the difference between REST and GraphQL in ${topic}?`,
    ];

    // Create Questions
    const questions = Array.from({ length: 80 }).map(() => {
      const topic = faker.helpers.arrayElement(techTopics);
      const author = faker.helpers.arrayElement(createdUsers);
      const questionTemplate = faker.helpers.arrayElement(sampleQuestions);
      return {
        title: questionTemplate(topic),
        body: `I'm working on a ${topic} project and facing some issues. ${faker.lorem.sentences(3)} Can someone guide me how to fix or improve it?`,
        tags: Array.from(new Set([topic, ...faker.helpers.arrayElements(techTopics, 2)])),
        author: author._id,
        upvotes: [],
        downvotes: [],
        votes: 0,
        createdAt: randomDate(),
      };
    });

    const createdQuestions = await Question.insertMany(questions);
    console.log("Questions inserted:", createdQuestions.length);

    // Create Answers
    const answers = [];
    for (const q of createdQuestions) {
      const answerCount = faker.number.int({ min: 2, max: 6 });
      const possibleAuthors = createdUsers.filter(
        (u) => u._id.toString() !== q.author.toString()
      );

      for (let i = 0; i < answerCount; i++) {
        const author = faker.helpers.arrayElement(possibleAuthors);
        answers.push({
          question: q._id,
          content: faker.helpers.arrayElement([
            "Try checking your environment variables — sometimes the issue is in the path setup.",
            "You might be missing an import or dependency. Run `npm install` again and restart the server.",
            "In most cases, the problem is due to async handling. Use `await` or `Promise.all` properly.",
            "Consider updating your library version — older versions may have a known bug.",
            "Make sure your backend CORS policy allows requests from your frontend URL.",
            "I had a similar issue — clearing cache and rebuilding the project solved it.",
            "Double-check your JSON structure or API endpoint response type.",
            "Using `console.log()` and breakpoints should help identify the issue step by step.",
          ]),
          author: author._id,
          upvotes: [],
          downvotes: [],
          createdAt: randomDate(),
        });
      }
    }

    const createdAnswers = await Answer.insertMany(answers);
    console.log("Answers inserted:", createdAnswers.length);

    // Link answers to questions
    for (const a of createdAnswers) {
      await Question.findByIdAndUpdate(a.question, { $push: { answers: a._id } });
    }

    // Create Votes
    const votes = [];

    // Votes for questions
    for (const q of createdQuestions) {
      const voters = faker.helpers.arrayElements(createdUsers, 10);
      voters.forEach((u) => {
        const type = faker.helpers.arrayElement([-1, 1]);
        votes.push({
          userId: u._id,
          targetId: q._id,
          targetType: "Question",
          voteType: type,
          createdAt: randomDate(),
        });
        if (type === 1) q.upvotes.push(u._id);
        else q.downvotes.push(u._id);
      });
      q.votes = q.upvotes.length - q.downvotes.length;
      await q.save();
    }

    // Votes for answers
    for (const a of createdAnswers) {
      const voters = faker.helpers.arrayElements(createdUsers, 8);
      voters.forEach((u) => {
        const type = faker.helpers.arrayElement([-1, 1]);
        votes.push({
          userId: u._id,
          targetId: a._id,
          targetType: "Answer",
          voteType: type,
          createdAt: randomDate(),
        });
        if (type === 1) a.upvotes.push(u._id);
        else a.downvotes.push(u._id);
      });
      await a.save();
    }

    await Voteing.insertMany(votes);
    console.log("Votes inserted:", votes.length);

    // Update User Reputation Based on Votes
    for (const user of createdUsers) {
      const userQuestions = createdQuestions.filter(
        (q) => q.author.toString() === user._id.toString()
      );
      const userAnswers = createdAnswers.filter(
        (a) => a.author.toString() === user._id.toString()
      );

      let totalVotes = 0;
      userQuestions.forEach((q) => (totalVotes += q.votes));
      userAnswers.forEach(
        (a) => (totalVotes += a.upvotes.length - a.downvotes.length)
      );

      user.reputation = Math.max(0, totalVotes + faker.number.int({ min: 0, max: 100 }));
      await user.save();
    }

    console.log("Users reputation updated based on total votes");

    console.log("Database successfully seeded with realistic user interactions!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedData();
