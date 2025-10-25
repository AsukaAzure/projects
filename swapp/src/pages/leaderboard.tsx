import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, TrendingUp, Users, MessageSquare, ThumbsUp } from "lucide-react";

// Mock leaderboard data
const topUsers = [
  {
    id: 1,
    username: "Sarah Chen",
    avatar: "SC",
    reputation: 15420,
    questionsAsked: 89,
    answersGiven: 234,
    upvotes: 1205,
    badges: ["Expert", "Helpful", "Great Question"],
    rank: 1
  },
  {
    id: 2,
    username: "Alex Kumar",
    avatar: "AK", 
    reputation: 12890,
    questionsAsked: 156,
    answersGiven: 189,
    upvotes: 967,
    badges: ["Problem Solver", "Mentor"],
    rank: 2
  },
  {
    id: 3,
    username: "Jordan Smith",
    avatar: "JS",
    reputation: 11250,
    questionsAsked: 67,
    answersGiven: 298,
    upvotes: 823,
    badges: ["Answer Master", "Consistent"],
    rank: 3
  },
  {
    id: 4,
    username: "Maria Rodriguez",
    avatar: "MR",
    reputation: 9870,
    questionsAsked: 134,
    answersGiven: 156,
    upvotes: 654,
    badges: ["Great Question", "Active"],
    rank: 4
  },
  {
    id: 5,
    username: "David Park",
    avatar: "DP",
    reputation: 8456,
    questionsAsked: 98,
    answersGiven: 187,
    upvotes: 589,
    badges: ["Helpful", "Reliable"],
    rank: 5
  }
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />;
    default:
      return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-muted-foreground">#{rank}</span>;
  }
};

export const Leaderboard = () => {
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

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {topUsers.slice(0, 3).map((user, index) => (
          <Card 
            key={user.id} 
            className={`relative overflow-hidden ${
              index === 0 ? 'md:order-2 border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-amber-500/5' :
              index === 1 ? 'md:order-1 border-gray-400/20 bg-gradient-to-br from-gray-400/5 to-slate-400/5' :
              'md:order-3 border-amber-600/20 bg-gradient-to-br from-amber-600/5 to-orange-500/5'
            }`}
          >
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                {getRankIcon(user.rank)}
              </div>
              <Avatar className="w-16 h-16 mx-auto mb-3">
                <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{user.username}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="text-2xl font-bold text-primary">
                {user.reputation.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Reputation Points</div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center justify-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{user.questionsAsked}</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{user.upvotes}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 justify-center">
                {user.badges.slice(0, 2).map((badge) => (
                  <Badge key={badge} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Top Contributors</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topUsers.map((user) => (
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
                    <span>{user.questionsAsked}</span>
                    <span className="hidden sm:inline">questions</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{user.answersGiven}</span>
                    <span className="hidden sm:inline">answers</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{user.upvotes}</span>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Upvotes</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,629</div>
            <p className="text-xs text-muted-foreground">+23% from last month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};