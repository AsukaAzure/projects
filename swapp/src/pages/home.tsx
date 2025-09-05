import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { mockQuestions } from "./mock";
import { Search, Filter, TrendingUp } from "lucide-react";

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "votes">("recent");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const filteredQuestions = mockQuestions
    .filter(question => 
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "votes") {
        return b.votes - a.votes;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-6 pb-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground via-primary-glow to-primary bg-clip-text text-transparent">
            Welcome {user? user.username : "Guest"}
          </h1>
        </div>
      </div>

      {/* Search and Filter */}
      {/* <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Button
            variant={sortBy === "recent" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSortBy("recent")}
            className="text-sm"
          >
            Recent
          </Button>
          <Button
            variant={sortBy === "votes" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSortBy("votes")}
            className="text-sm"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Most Voted
          </Button>
        </div>
      </div> */}

      {/* Questions List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {searchTerm ? `Search Results (${filteredQuestions.length})` : 'Latest Questions'}
          </h2>
          {filteredQuestions.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {filteredQuestions.length > 0 ? (
          <div className="grid gap-6">
            {filteredQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} />
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
                : "Be the first to ask a question!"
              }
            </p>
            <Button 
              className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-dark hover:to-primary"
              onClick={() => window.location.href = '/ask'}
            >
              Ask a Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};