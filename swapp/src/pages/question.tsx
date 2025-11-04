import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X, Send, HelpCircle } from "lucide-react";
import { toast } from "react-toastify";

export const Question = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setloading] = useState(false);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const predefinedTags = [
    "javascript", "react", "typescript", "nodejs", "python", "java",
    "html", "css", "sql", "mongodb", "docker", "git", "api", "aws"
  ];

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      removeTag(tag);
    } else if (tags.length < 5) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    setloading(true);
    if(!user) {
      toast.error("login");
      setloading(false);
      return;
    }
    try{
      const res = await fetch("/api/question/postquestion", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title,
          body: content,
          tags,
          author: "user.id",
        }),
      });
      const data = await res.json();

      if(!res.ok){
        throw new Error(data.message||"Failed to post");
      }
      toast.success("Question posted successfully!");
      navigate(`/question/${data.question._id}`);
  }catch (error: any){
    toast.error(error.message);
    setloading(false);
  } 
  };

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
          Ask a Question
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get help from the community by asking a clear, detailed question about programming or technology.
        </p>
      </div>

      {/* Tips Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-primary">
            <HelpCircle className="w-5 h-5" />
            <span>Tips for a Great Question</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Be specific and descriptive in your title</li>
            <li>• Include relevant code examples or error messages</li>
            <li>• Explain what you've already tried</li>
            <li>• Add relevant tags to help others find your question</li>
            <li>• Use proper formatting and grammar</li>
          </ul>
        </CardContent>
      </Card>

      {/* Question Form */}
      <Card className="bg-gradient-to-br from-card to-card/80 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle>Your Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Question Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g., How to implement authentication in React with TypeScript?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary/50"
            />
            <p className="text-xs text-muted-foreground">
              Be specific and imagine you're asking another person directly.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Question Details *
            </Label>
            <Textarea
              id="content"
              placeholder="Provide all the details someone would need to understand your problem and help you solve it..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="resize-none bg-background/50 border-border/50 focus:border-primary/50"
            />
            <p className="text-xs text-muted-foreground">
              Include what you've tried, any error messages, and your expected outcome.
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Tags (up to 5)
            </Label>

            {/* Current Tags */}
            {tags.length > 0 && (
              <div className="p-3 rounded-md border border-border/50 bg-background/30">
                <Label className="text-xs text-muted-foreground">Selected Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20 pr-1 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Predefined Tags */}
            <CardDescription>Select from the tags below:</CardDescription>
            <div className="flex flex-wrap gap-2">
              {predefinedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={tags.includes(tag) ? "default" : "outline"}
                  onClick={() => toggleTag(tag)}
                  className="cursor-pointer hover:bg-primary/20 transition-colors"
                  aria-disabled={tags.length >= 5 && !tags.includes(tag)}
                >
                  {tag}
                </Badge>
            ))}
              </div>
            
            <p className="text-xs text-muted-foreground">
              Tags help others find and answer your question. Use relevant technology names.
            </p>
          </div>

          {/* Character Count */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div>
              Title: {title.length} characters
              {title.length > 0 && title.length < 15 && (
                <span className="text-warning ml-2">Consider making your title more descriptive</span>
              )}
            </div>
            <div>
              Details: {content.length} characters
              {content.length > 0 && content.length < 50 && (
                <span className="text-warning ml-2">Add more details to help others understand</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center pt-4 border-t border-border/50">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || loading }
              className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-dark hover:to-primary disabled:opacity-50 shadow-lg hover:shadow-[var(--shadow-glow)] transition-all duration-300"
            >
              {loading ? "Posting..." : <><Send className="w-4 h-4 mr-2" />
              Post Question</>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};