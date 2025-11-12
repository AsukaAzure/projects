import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Users,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";

interface LeaderboardUser {
  userId: string;
  id?: string;
  username: string;
  reputation: number;
  totalUpvotes: number;
  rank: number;
  avatar: string;
  questionsAsked: number;
  answersGiven: number;
  badges: string[];
}

const getInitials = (name: string) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getReputationLevel = (reputation: number) => {
  if (reputation >= 10000) return ["Legend", "Expert", "Pro"];
  if (reputation >= 5000) return ["Expert", "Pro"];
  if (reputation >= 1000) return ["Pro"];
  if (reputation >= 100) return ["Contributor"];
  return ["Newcomer"];
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />;
    default:
      return (
        <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-muted-foreground">
          #{rank}
        </span>
      );
  }
};

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/auth/leaderboard");
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch leaderboard");
        }

        // Mamapping baakend data to frontend structure
        const formattedData: LeaderboardUser[] = data.leaderboard.map(
          (user: any, index: number) => ({
            ...user,
            id: user.userId,
            rank: index + 1,
            avatar: getInitials(user.username),
            badges: getReputationLevel(user.reputation),
            questionsAsked: user.questionsAsked || 0,
            answersGiven: user.answerGiven || 0,
          })
        );

        setLeaderboard(formattedData);
      } catch (err: any) {
        setError(err.message);
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary-glow to-primary bg-clip-text text-transparent">
          Community Leaderboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Recognizing our most active and helpful community members
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">Loading leaderboard...</div>
      )}
      {error && (
        <div className="text-center py-12 text-destructive">{error}</div>
      )}

      {/* Top 3 Podium */}
      {!loading && !error && leaderboard.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {leaderboard
            
            .slice(0, 3)
            .map((user, index) => (
              <Card
                key={user.id}
                className={`relative overflow-hidden ${
                  index === 0
                    ? "md:order-2 border-yellow-500/20 from-yellow-500/5 to-amber-500/5"
                    : index === 1
                    ? "md:order-1 border-gray-400/20 from-gray-400/5 to-slate-400/5"
                    : "md:order-3 border-amber-600/20 from-amber-600/5 to-orange-500/5"
                }`}
              >
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-2">
                    {getRankIcon(user.rank)}
                  </div>
                  <Avatar className="w-16 h-16 mx-auto mb-3">
                    <AvatarFallback className="text-lg font-semibold from-primary to-primary-glow text-primary-foreground">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{user.username}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <div className="text-2xl font-bold text-primary">
                    {user.reputation.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Reputation Points
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>
                        {user.reputation > 100 ? "-" : user.questionsAsked}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{user.totalUpvotes}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-center">
                    {user.badges.slice(0, 2).map((badge) => (
                      <Badge
                        key={badge}
                        variant="secondary"
                        className="text-xs"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Full Leaderboard */}
      {!loading && !error && leaderboard.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Top Contributors</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(user.rank)}
                    </div>

                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="font-semibold">{user.username}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.reputation.toLocaleString()} reputation
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>
                        {user.reputation > 100 ? "-" : user.questionsAsked}
                      </span>
                      <span className="hidden sm:inline">questions</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>
                        {user.reputation > 100 ? "-" : user.answersGiven}
                      </span>
                      <span className="hidden sm:inline">answers</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{user.totalUpvotes}</span>
                      <span className="hidden sm:inline">upvotes</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {user.badges.slice(0, 2).map((badge) => (
                      <Badge key={badge} variant="outline" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                    {user.badges.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.badges.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
