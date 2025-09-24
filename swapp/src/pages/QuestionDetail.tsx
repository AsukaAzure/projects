import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, ArrowDown, MessageSquare, User, Clock, Send, ArrowLeft } from "lucide-react";
import { mockQuestions } from "./mock";
import type { Answer } from "./mock";
import { formatDistanceToNow } from "date-fns";

export const QuestionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [newAnswer, setNewAnswer] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});

  const question = mockQuestions.find(q => q.id === id);

  if (!question) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-2xl font-semibold">Question not found</h2>
        <p className="text-muted-foreground">The question you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const allAnswers = [...question.answers, ...answers];

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) return;

    const answer: Answer = {
      id: `new-${Date.now()}`,
      content: newAnswer,
      author: "CurrentUser",
      votes: 0,
      createdAt: new Date()
    };

    setAnswers([...answers, answer]);
    setNewAnswer("");
  };

  const handleVote = (answerId: string, direction: "up" | "down") => {
    setVotes(prev => ({
      ...prev,
      [answerId]: (prev[answerId] || 0) + (direction === "up" ? 1 : -1)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Navigation */}
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/home" className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Questions</span>
        </Link>
      </Button>

      {/* Question */}
      <Card className="bg-gradient-to-br from-card to-card/80 border-primary/20 shadow-lg">
        <CardHeader className="space-y-4">
          <h1 className="text-3xl font-bold leading-tight">{question.title}</h1>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="font-medium">{question.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{formatDistanceToNow(question.createdAt, { addSuffix: true })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowUp className="w-4 h-4" />
              <span className="font-medium">{question.votes} votes</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>{allAnswers.length} answers</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose prose-invert max-w-none">
            <p className="text-foreground leading-relaxed text-lg">{question.content}</p>
          </div>
        </CardContent>
      </Card>

      {/* Answers Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {allAnswers.length} {allAnswers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
        </div>

        {/* Existing Answers */}
        <div className="space-y-4">
          {allAnswers.map((answer) => (
            <Card key={answer.id} className="bg-gradient-to-br from-muted/50 to-muted/30">
              <CardContent className="pt-6">
                <div className="flex space-x-4">
                  {/* Voting */}
                  <div className="flex flex-col items-center space-y-2 min-w-[3rem]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(answer.id, "up")}
                      className="hover:bg-green-300/50 hover:text-success"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </Button>
                    <span className="text-lg font-semibold">
                      {answer.votes + (votes[answer.id] || 0)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(answer.id, "down")}
                      className="hover:bg-destructive/30 hover:text-destructive"
                    >
                      <ArrowDown className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Answer Content */}
                  <div className="flex-1 space-y-3">
                    <div className="prose prose-invert max-w-none">
                      <p className="text-foreground leading-relaxed">{answer.content}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border/50">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{answer.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatDistanceToNow(answer.createdAt, { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Answer Form */}
        <Card className="bg-gradient-to-br from-card to-muted/20 border-primary/20">
          <CardHeader>
            <h3 className="text-xl font-semibold">Your Answer</h3>
            <p className="text-muted-foreground">
              Help the community by sharing your knowledge and experience.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Write your answer here... Be specific, helpful, and include examples if possible."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              rows={6}
              className="resize-none bg-background/50 border-border/50 focus:border-primary/50"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {newAnswer.length > 0 && `${newAnswer.length} characters`}
              </p>
              <Button
                onClick={handleSubmitAnswer}
                disabled={!newAnswer.trim()}
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-dark hover:to-primary disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                Post Answer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};