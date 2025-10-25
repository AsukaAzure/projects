import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowUp, Clock, User } from "lucide-react";
// import type { Questions } from "@/pages/mock";
import { formatDistanceToNow } from "date-fns";
import type { Question } from "@/question";

interface QuestionCardProps {
  question: Question;
}


export const QuestionCard = ({ question }: QuestionCardProps) => {
  return (
    <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-3">
        <Link 
          to={`/question/${question._id}`}
          className="block group-hover:text-primary transition-colors"
        >
          <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary-glow transition-colors">
            {question.title}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{question.author?.username||"Unknown"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatDistanceToNow(question.createdAt, { addSuffix: true })}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-muted-foreground line-clamp-3 leading-relaxed">
          {question.body}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {question.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <ArrowUp className="w-4 h-4 mr-1" />
            {question.votes}
          </Button>
          
          {/* <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <MessageSquare className="w-4 h-4 mr-1" />
            {question.answers.length} {question.answers.length === 1 ? 'answer' : 'answers'}
          </Button> */}
        </div>

        <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary">
          <Link to={`/question/${question._id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};