import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuestionCard } from "../components/ui/QuestionCard";
import { mockQuestions } from "./mock";
import { Search, Filter, TrendingUp, Clock, Users, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "votes" | "answers">("recent");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags from questions
  const allTags = Array.from(new Set(mockQuestions.flatMap(q => q.tags)));

  const filteredQuestions = mockQuestions
    .filter(question => {
      const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => question.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      if (sortBy === "votes") {
        return b.votes - a.votes;
      }
      if (sortBy === "answers") {
        return b.answers.length - a.answers.length;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary-glow to-primary bg-clip-text text-transparent">
          Search Questions
        </h1>
        <p className="text-muted-foreground text-lg">
          Find the answers you're looking for across our community
        </p>
      </div>

      {/* Advanced Search */}
      <div className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search questions, tags, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 text-lg bg-muted/50 border-border/50 focus:border-primary/50"
          />
        </div>

        {/* Sort and Filter Options */}
        <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Sort by:</span>
            <Button
              variant={sortBy === "recent" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy("recent")}
              className="text-sm"
            >
              <Clock className="w-4 h-4 mr-1" />
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
            <Button
              variant={sortBy === "answers" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy("answers")}
              className="text-sm"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Most Answers
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredQuestions.length} result{filteredQuestions.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Tag Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Filter by tags:</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTags([])}
              className="text-xs"
            >
              Clear all filters
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
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
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchTerm || selectedTags.length > 0
                ? "Try adjusting your search terms or filters."
                : "Start typing to search for questions."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};