import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Calendar, 
  MessageSquare, 
  HelpCircle, 
  Trophy,
  Award
} from "lucide-react";
// import { useAuth } from "./AuthContext";
import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";

export const ProfilePage = () => {
  const stored = localStorage.getItem("user");
  const localUser = stored ? JSON.parse(stored) : null;
  const userId = localUser?.id || localUser?._id;
  const token = localUser?.token;

  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/auth/${userId}/profile`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to load profile");
        }
        setProfile(data);
      } catch (err: any) {
        console.error("Profile fetch error:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  if (!localUser && !profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Please log in to view your profile</h2>
      </div>
    );
  }

  // server returns profileData shape in controller: username, email, joinedDate, reputation, questionsAsked, answersGiven, recentQuestions, recentAnswers
  const src = profile ?? {};
  const displayUser = {
    username: src.username ?? localUser?.username,
    email: src.email ?? localUser?.email,
    reputation: src.reputation ?? localUser?.reputation ?? 0,
    questionsAsked: src.questionsAsked ?? 0,
    answersGiven: src.answersGiven ?? 0,
    joinedDate: src.joinedDate ?? localUser?.joinedDate,
  };

  const userQuestions = src.recentQuestions ?? [];
  const userAnswers = src.recentAnswers ?? [];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getReputationLevel = (reputation: number) => {
    if (reputation >= 2000) return { level: "Expert", color: "text-primary" };
    if (reputation >= 1000) return { level: "Advanced", color: "text-success" };
    if (reputation >= 500) return { level: "Intermediate", color: "text-warning" };
    return { level: "Beginner", color: "text-muted-foreground" };
  };

  const repLevel = getReputationLevel(displayUser.reputation);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card className="bg-gradient-to-br from-card to-card/80 border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <Avatar className="w-20 h-20 border-2 border-primary/20">
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                  {getInitials(displayUser.username)}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <div>
                  <h1 className="text-3xl font-bold">{displayUser.username}</h1>
                  <p className="text-muted-foreground">{displayUser.email}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge 
                    variant="secondary" 
                    className={`${repLevel.color} bg-primary/10 hover:bg-primary/20`}
                  >
                    <Award className="w-3 h-3 mr-1" />
                    {repLevel.level}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDistanceToNow(displayUser.joinedDate, { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div> */}
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{displayUser.reputation.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Reputation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{displayUser.questionsAsked}</p>
                <p className="text-sm text-muted-foreground">Questions Asked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{displayUser.answersGiven}</p>
                <p className="text-sm text-muted-foreground">Answers Given</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {displayUser.answersGiven > 0 ? Math.round((displayUser.reputation / displayUser.answersGiven) * 10) / 10 : 0}
                </p>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Activity Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Questions */}
        <Card className="bg-gradient-to-br from-card to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              <span>Recent Questions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userQuestions.length > 0 ? (
              userQuestions.slice(0, 3).map((question) => (
                <div key={question.id} className="space-y-2">
                  <h4 className="font-medium line-clamp-2 hover:text-primary cursor-pointer transition-colors">
                    {question.title}
                  </h4>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <span>{question.votes} votes</span>
                      <span>•</span>
                      <span>{question.answers.length} answers</span>
                    </div>
                    <span>{formatDistanceToNow(question.createdAt, { addSuffix: true })}</span>
                  </div>
                  {userQuestions.indexOf(question) < userQuestions.slice(0, 3).length - 1 && (
                    <Separator className="mt-3" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No questions asked yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Answers */}
        <Card className="bg-gradient-to-br from-card to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-success" />
              <span>Recent Answers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userAnswers.length > 0 ? (
              userAnswers.slice(0, 3).map((answer) => (
                <div key={answer.id} className="space-y-2">
                  <p className="text-sm line-clamp-3">{answer.content}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{answer.votes} votes</span>
                    <span>{formatDistanceToNow(answer.createdAt, { addSuffix: true })}</span>
                  </div>
                  {userAnswers.indexOf(answer) < userAnswers.slice(0, 3).length - 1 && (
                    <Separator className="mt-3" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No answers given yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};