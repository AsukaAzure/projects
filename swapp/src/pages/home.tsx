import { useState, useEffect } from "react";
import { QuestionCard } from "@/components/ui/QuestionCard";

export const Home = () => {
  interface Question {
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
    answers?: any[];
  }

  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "votes">("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Fetch data from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/question/getquestion");
        const data = await res.json();
        if (data.success) {
          setQuestions(data.questions);
        } else {
          setError("Failed to load questions");
        }
      } catch (err) {
        setError("Error fetching questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Filter + Sort
  const filteredQuestions = questions
    .filter(
      (question) =>
        question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.body?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .sort((a, b) => {
      if (sortBy === "votes") {
        return (b.votes || 0) - (a.votes || 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Loading state
  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-6 pb-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground via-primary-glow to-primary bg-clip-text text-transparent">
            Welcome {user ? user.username : "Guest"}
          </h1>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Latest Questions</h2>
        </div>

        <div className="grid gap-6">
          {filteredQuestions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))}
        </div>
      </div>
    </div>
  );
};
