import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "../components/ui/QuestionCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Code,
  Database, 
  Globe, 
  Smartphone, 
  Terminal, 
  Cpu, 
  TrendingUp,
  Users,
  MessageSquare
} from "lucide-react";

interface Question {
  id: string;
  _id: string;
  title: string;
  content: string;
  tags: string[];
  votes: number;
  answers: any[];
  createdAt: Date;
  author: {
    username: string;
  };
}


const topicCategories = [
  {
    title: "Web Development",
    icon: Globe,
    tags: ["javascript", "react", "html", "css", "nodejs", "vue", "angular"],
    color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20"
  },
  {
    title: "Mobile Development", 
    icon: Smartphone,
    tags: ["react-native", "flutter", "ios", "android", "swift", "kotlin"],
    color: "bg-green-500/10 hover:bg-green-500/20 border-green-500/20"
  },
  {
    title: "Backend & DevOps",
    icon: Database,
    tags: ["python", "java", "golang", "docker", "kubernetes", "aws", "postgresql"],
    color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20"
  },
  {
    title: "Systems & Linux",
    icon: Terminal,
    tags: ["linux", "bash", "ubuntu", "networking", "security", "devops"],
    color: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20"
  },
  {
    title: "Data Science & AI",
    icon: Cpu,
    tags: ["machine-learning", "ai", "tensorflow", "pytorch", "data-analysis"],
    color: "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20"
  },
  {
    title: "Programming Languages",
    icon: Code,
    tags: ["typescript", "python", "java", "c++", "rust", "go", "php"],
    color: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/20"
  }
];

export const Discover = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/question/getquestion");
        const data = await res.json();
        if (data.success) {
          // Normalize questions to have a consistent shape
          const normalizedQuestions = data.questions.map((q: any) => ({
            ...q,
            id: q._id,
            content: q.body || "",
            answers: q.answers || [],
            createdAt: new Date(q.createdAt),
          }));
          setQuestions(normalizedQuestions);
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


  // Get all unique tags and their question counts
  const tagStats = questions.reduce((acc, question) => {
    question.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const filteredQuestions = questions.filter(question => {
    if (selectedTags.length === 0) return true;
    return selectedTags.some(tag => question.tags.includes(tag));
  });

  const handleCategorySelect = (category: typeof topicCategories[0]) => {
    setSelectedCategory(category.title);
    setSelectedTags(category.tags);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  if (loading) {
    return <p className="text-center py-12">Loading questions...</p>;
  }
  if (error) return <p className="text-center py-12 text-destructive">{error}</p>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary-glow to-primary bg-clip-text text-transparent">
          Discover Topics
        </h1>
        <p className="text-muted-foreground text-lg">
          Explore questions by technology, programming language, or topic area
        </p>
      </div>

      {/* Topic Categories */}
      {!selectedCategory && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topicCategories.map((category) => {
              const categoryQuestionCount = questions.filter(q => 
                q.tags.some(tag => category.tags.includes(tag))
              ).length;
              
              return (
                <Card 
                  key={category.title}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${category.color}`}
                  onClick={() => handleCategorySelect(category)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <category.icon className="w-8 h-8 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4" />
                          <span>{categoryQuestionCount} questions</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {category.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {category.tags.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{category.tags.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Category View */}
      {selectedCategory && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{selectedCategory}</h2>
            <Button variant="outline" onClick={clearFilters}>
              ← Back to Categories
            </Button>
          </div>

          {/* Tag Filter */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Filter by specific technology:</h3>
            <div className="flex flex-wrap gap-2">
              {topicCategories
                .find(cat => cat.title === selectedCategory)
                ?.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag} ({tagStats[tag] || 0})
                  </Badge>
                ))}
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Questions ({filteredQuestions.length})
              </h3>
            </div>
            
            {filteredQuestions.length > 0 ? (
              <div className="grid gap-6">
                {filteredQuestions.map((question: any) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No questions found</h3>
                <p className="text-muted-foreground">
                  No questions match the selected tags. Try selecting different technologies.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popular Tags (shown when no category selected) */}
      {!selectedCategory && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Popular Tags</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(tagStats)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 20)
              .map(([tag, count]) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/20 transition-colors py-2 px-3"
                  onClick={() => {
                    setSelectedTags([tag]);
                    setSelectedCategory("Custom Selection");
                  }}
                >
                  <span className="font-medium">{tag}</span>
                  <span className="ml-2 text-muted-foreground">({count})</span>
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};