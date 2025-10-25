import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { Search } from "lucide-react";

export const Home = () => {
  // Explicit Question type to avoid 'never' inference and provide proper typing throughout the component
  interface Question {
    _id: string;
    title: string;
    content?: string;
    tags?: string[];
    votes?: number;
    createdAt: string;
    // add other fields returned by your API as needed
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
        question.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

      {/* Search Bar */}
      <div className="flex gap-3 items-center">
        <Input
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button variant="outline" onClick={() => setSortBy("recent")}>
          Recent
        </Button>
        <Button variant="outline" onClick={() => setSortBy("votes")}>
          Most Voted
        </Button>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {searchTerm
              ? `Search Results (${filteredQuestions.length})`
              : "Latest Questions"}
          </h2>
          {filteredQuestions.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {filteredQuestions.length} question
              {filteredQuestions.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {filteredQuestions.length > 0 ? (
          <div className="grid gap-6">
            {filteredQuestions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No questions found</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? `No questions match "${searchTerm}". Try different keywords.`
                : "Be the first to ask a question!"}
            </p>
            <Button
              className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-dark hover:to-primary"
              onClick={() => (window.location.href = "/ask")}
            >
              Ask a Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
