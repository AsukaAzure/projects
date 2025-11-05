import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  User,
  Clock,
  Send,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import type { Answer } from "./mock";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

export const QuestionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [newAnswer, setNewAnswer] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answerSortBy, setAnswerSortBy] = useState<"votes" | "recent">("votes");
  const [userVotes, setUserVotes] = useState<Record<string, "up" | "down" | null>>({});
  // const question = mockQuestions.find(q => q.id === id);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchQuestion = useCallback(async () => {
    if (!id) return;
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const token = user?.token;

      const res = await fetch(`/api/question/getquestion/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `Request failed: ${res.status}`);
      }
      const data = await res.json();
      const q = data.question || data;

      // normalize question shape for the UI and include server-provided userVote (1/-1/0)
      const normalized = {
        id: q._id ?? q.id,
        title: q.title,
        content: q.body ?? q.content ?? "",
        tags: Array.isArray(q.tags) ? q.tags : [],
        votes: q.votes ?? ( (Array.isArray(q.upvotes) ? q.upvotes.length : 0) - (Array.isArray(q.downvotes) ? q.downvotes.length : 0) ),
        createdAt: q.createdAt ? new Date(q.createdAt) : new Date(),
        author: q.author?.username ?? q.author ?? "Unknown",
        userVote: typeof q.userVote === "number" ? q.userVote : 0,
        answers: (Array.isArray(q.answers) ? q.answers : q.answers ? [q.answers] : []).map((a: any) => ({
          id: a._id ?? a.id,
          content: a.content,
          author: a.author?.username ?? a.author ?? "Unknown",
          votes: a.votes ?? ((Array.isArray(a.upvotes) ? a.upvotes.length : 0) - (Array.isArray(a.downvotes) ? a.downvotes.length : 0)),
          userVote: typeof a.userVote === "number" ? a.userVote : 0,
          createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
        })),
      };

      setQuestion(normalized);
      setAnswers([]); // Clear locally added answers when re-fetching

      // build userVotes map for UI ('up'|'down'|null)
      const uv: Record<string, "up" | "down" | null> = {};
      uv[normalized.id] = normalized.userVote === 1 ? "up" : normalized.userVote === -1 ? "down" : null;
      normalized.answers.forEach((a: any) => {
        uv[a.id] = a.userVote === 1 ? "up" : a.userVote === -1 ? "down" : null;
      });
      setUserVotes(uv);
    } catch (err) {
      console.error("Failed to fetch question:", err);
      setQuestion(null);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleSubmitAnswer = async () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = user?.token || user?.access_token;

    if (!user || !token) {
      toast.error("Please log in to answer");
      return;
    }

    if (!newAnswer.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/question/getquestion/${id}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newAnswer }),
        // credentials: "include" // uncomment if your backend expects cookies
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to post answer");

      const serverAnswer = data.answer;
      const newAns = {
        id: serverAnswer?._id || Date.now().toString(),
        content: serverAnswer?.content || newAnswer,
        author: serverAnswer?.author?.username || user.username || "You",
        votes: serverAnswer?.votes ?? 0,
        createdAt: serverAnswer?.createdAt
          ? new Date(serverAnswer.createdAt)
          : new Date(),
      };

      setAnswers((prev) => [...prev, newAns]);
      setNewAnswer("");
      toast.success("Answer posted!");
      fetchQuestion(); // Re-fetch to show the new answer from the DB
    } catch (err: any) {
      toast.error(err.message || "Unable to post answer");
      console.error("post answer error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!question) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-2xl font-semibold">Question not found</h2>
        <p className="text-muted-foreground">
          The question you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const sortedAnswers = [...question.answers, ...answers].sort((a, b) => {
    if (answerSortBy === "votes") {
      return (b.votes ?? 0) - (a.votes ?? 0);
    }
    // recent
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const allAnswers = sortedAnswers;

  const handleVote = async (
    targetId: string,
    type: "question" | "answer",
    direction: "upvote" | "downvote"
  ) => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = user?.token || user?.access_token;

    if (!token) {
      toast.error("Please log in to vote");
      return;
    }

    // if user already voted on this target, prevent further votes (one vote per user)
    // if (userVotes[targetId]) {
    //   toast.info("You have already voted on this item");
    //   return;
    // }

    try {
      const res = await fetch(`/api/question/getquestion/${targetId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetType: type,
          voteType: direction, // 'upvote' or 'downvote'
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Vote failed");

      // Update UI with the new vote count from the server
      if (type === "question") {
        setQuestion((prev: any) => ({ ...prev, votes: data.votes }));
      } else {
        const updatedAnswers = question.answers.map((ans: any) =>
          ans.id === targetId ? { ...ans, votes: data.votes } : ans
        );
        setQuestion((prev: any) => ({ ...prev, answers: updatedAnswers }));
      }

      // Persist user's vote locally (and rely on server for persisted state on reload)
      const newVotes: Record<string, "up" | "down" | null> = {
        ...userVotes,
        [targetId]: direction === "upvote" ? "up" : "down",
      };
      setUserVotes(newVotes);

      toast.success(data.message || "Vote recorded!");
    } catch (err: any) {
      toast.error(err.message || "Vote failed");
      console.error("Vote error:", err);
    }
  };



  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/home" className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Questions</span>
          </Link>
        </Button>
        {user ? (
          <Button 
            variant="ghost" 
            className="bg-red-500 hover:bg-red-700"
            onClick={async () => {
              if (window.confirm("Are you sure you want to delete this question?")) {
                const res = await fetch(`/api/question/getquestion/${id}/delete`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  }});
                  if (res.ok) {
                    toast.success("Question deleted!");
                    navigate("/home");
                  }
              }
            }}>
            <Trash2 className="w-4 h-4" />
          </Button>
        ) : (
          <div />
        )}
      </div>
      {/* Question */}

      <Card className="bg-gradient-to-br from-card to-card/80 border-primary/20 shadow-lg">
        <div className="flex">
          {/* Voting section - LEFT SIDE */}
          <div className="flex flex-col items-center space-y-2 px-4 py-6 border-r border-primary/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote(question.id, "question", "upvote")}
              // disabled={userVotes[question.id] === "up"}
              className={userVotes[question.id] === "up" ? "bg-green-100 text-green-700" : "hover:bg-green-300/50 hover:text-success"}
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
            <span className="text-lg font-semibold">
              {question.votes}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote(question.id, "question", "downvote")}
              // disabled={userVotes[question.id] === "down"}
              className={userVotes[question.id] === "down" ? "bg-red-100 text-red-700" : "hover:bg-destructive/30 hover:text-destructive"}
            >
              <ArrowDown className="w-5 h-5" />
            </Button>
          </div>

          {/* Main content - RIGHT SIDE */}
          <div className="flex-1">
            <CardHeader className="space-y-4">
              <h1 className="text-3xl font-bold leading-tight">
                {question.title}
              </h1>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{question.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {formatDistanceToNow(question.createdAt, {
                      addSuffix: true,
                    })}
                  </span>
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
              <div className="prose prose-invert border-t max-w-none mt-2 pt-4">
                <p className="text-foreground leading-relaxed text-lg">
                  {question.content}
                </p>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>

      {/* Answers Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {sortedAnswers.length}{" "}
            {sortedAnswers.length === 1 ? "Answer" : "Answers"}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={answerSortBy === "votes" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setAnswerSortBy("votes")}
            >
              Votes
            </Button>
            <Button
              variant={answerSortBy === "recent" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setAnswerSortBy("recent")}
            >
              Recent
            </Button>
          </div>
        </div>

        {/* Existing Answers */}
        <div className="space-y-4">
          {sortedAnswers.map((answer) => (
            <Card
              key={answer.id}
              className="bg-gradient-to-br from-muted/50 to-muted/30"
            >
              <CardContent className="pt-6">
                <div className="flex space-x-4">
                  {/* Voting */}
                  <div className="flex flex-col items-center space-y-2 min-w-[3rem]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(answer.id, "answer", "upvote")}
                      // disabled={userVotes[answer.id] === "up"}
                      className="hover:bg-green-300/50 hover:text-success"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </Button>
                    <span className="text-lg font-semibold">
                      {answer.votes}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(answer.id, "answer", "downvote")}
                      // disabled={userVotes[answer.id] === "down"}
                      className="hover:bg-destructive/30 hover:text-destructive"
                    >
                      <ArrowDown className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Answer Content */}
                  <div className="flex-1 space-y-3">
                    <div className="prose prose-invert max-w-none">
                      <p className="text-foreground leading-relaxed">
                        {answer.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border/50">
                      {/* Left side */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{answer.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {formatDistanceToNow(answer.createdAt, {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                      {/* Delete button */}
                      { user ? (
                        <div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={async () => {
                              if (window.confirm("Are you sure you want to delete the Answer")) {
                                const res = await fetch (`/api/question/getquestion/${answer.id}/deleteanswer`, {
                                  method: "DELETE",
                                  headers: {
                                    Authorization: `Bearer ${user.token}`,
                                  }
                                });
                                if(res.ok){
                                  toast.success("Answer deleted!");
                                  fetchQuestion(); // Re-fetch question to update the answer list
                                } else {
                                  toast.error("Failed to delete answer");
                                }
                              }
                            }}
                            >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div />
                      )}
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
