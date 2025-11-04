import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Search,
  Users,
  Trophy,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Globe,
} from "lucide-react";
import logo from "../assets/byteflow_no_bg_refined1.png"

export default function Welcome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageSquare,
      title: "Ask & Answer",
      description:
        "Post your programming questions and get expert answers from our community",
      color: "text-primary",
    },
    {
      icon: Search,
      title: "Smart Search",
      description:
        "Find solutions quickly with our advanced search and filtering system",
      color: "text-primary",
    },
    {
      icon: Globe,
      title: "Topic Discovery",
      description:
        "Explore questions by technology - React, JavaScript, Python, Linux and more",
      color: "text-primary",
    },
    {
      icon: Trophy,
      title: "Leaderboard",
      description:
        "Compete with fellow developers and climb the reputation rankings",
      color: "text-primary",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Connect with developers worldwide and build your professional network",
      color: "text-primary",
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description:
        "Build a comprehensive library of programming solutions together",
      color: "text-primary",
    },
  ];

  const stats = [
    { number: "10K+", label: "Questions Asked", icon: MessageSquare },
    { number: "25K+", label: "Answers Given", icon: CheckCircle },
    { number: "5K+", label: "Active Users", icon: Users },
  ];

  return (
    <div className="min-h-screen space-y-16 pb-8">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div
          className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent cursor-pointer"
          onClick={() => navigate("/")}
        >
          
        <img src={logo} className="w-[12rem]"/>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-primary/30 hover:bg-primary/10 hover:border-primary/50"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </header>
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-br from-foreground via-primary-glow to-primary bg-clip-text text-transparent leading-tight">
            ByteFlow
          </h1>

          <p className="text-2xl md:text-3xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            The premier{" "}
            <span className="text-primary font-semibold">destination</span> for
            developers to ask
            <span className="text-primary font-semibold"> questions </span>,
            share
            <span className="text-primary font-semibold"> knowledge</span>, and
            grow
            <span className="text-primary font-semibold"> together</span>
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-dark hover:to-primary text-primary-foreground shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 group"
            onClick={() => navigate("/home")}
          >
            Browse Questions
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="text-center border-border/50 bg-card/50 backdrop-blur-sm"
          >
            <CardContent className="pt-6">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-foreground mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground">
            Everything You Need to
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {" "}
              Succeed
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform provides all the tools and community support you need
            to solve problems, learn new technologies, and advance your career.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300 group"
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-base leading-relaxed group-hover:text-muted-foreground/80 transition-colors">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-8 py-12">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-foreground">
            Ready to Join the Community?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're a beginner seeking guidance or an expert ready to
            share knowledge, there's a place for you in our growing community.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Button
            variant="outline"
            size="lg"
            className="border-primary/30 hover:bg-primary/10 hover:border-primary/50"
            onClick={() => navigate("/question")}
          >
            Start Asking Questions
          </Button>
        </div>
      </div>
    </div>
  );
}
