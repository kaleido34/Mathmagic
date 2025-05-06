import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Trophy, Award, Star, Clock, BookOpen, Calculator } from "lucide-react";

interface ProgressData {
  overall: number;
  streak: number;
  totalPoints: number;
  activitiesCompleted: number;
  timeSpent: number;
  gradeProgress: {
    grade: number;
    progress: number;
  }[];
  categoryProgress: {
    name: string;
    progress: number;
    value: number;
  }[];
  weeklyActivity: {
    name: string;
    completed: number;
  }[];
  achievements: {
    id: number;
    title: string;
    description: string;
    icon: string;
    earnedAt: string | null;
  }[];
  recentActivities: {
    id: number;
    title: string;
    type: string;
    score: number;
    date: string;
    moduleTitle: string;
  }[];
}

export default function Progress() {
  const { data: progressData, isLoading } = useQuery<ProgressData>({
    queryKey: ["/api/user/progress"],
  });

  // Default data if API hasn't returned yet
  const defaultData: ProgressData = {
    overall: 42,
    streak: 5,
    totalPoints: 1250,
    activitiesCompleted: 34,
    timeSpent: 12.5,
    gradeProgress: [
      { grade: 6, progress: 68 },
      { grade: 7, progress: 32 },
      { grade: 8, progress: 12 },
    ],
    categoryProgress: [
      { name: "Algebra", progress: 65, value: 65 },
      { name: "Geometry", progress: 40, value: 40 },
      { name: "Fractions", progress: 80, value: 80 },
      { name: "Statistics", progress: 25, value: 25 },
      { name: "Decimals", progress: 55, value: 55 },
    ],
    weeklyActivity: [
      { name: "Mon", completed: 4 },
      { name: "Tue", completed: 2 },
      { name: "Wed", completed: 5 },
      { name: "Thu", completed: 3 },
      { name: "Fri", completed: 6 },
      { name: "Sat", completed: 1 },
      { name: "Sun", completed: 0 },
    ],
    achievements: [
      {
        id: 1,
        title: "First Steps",
        description: "Complete your first lesson",
        icon: "star",
        earnedAt: "2023-05-10T14:30:00Z",
      },
      {
        id: 2,
        title: "Math Wizard",
        description: "Complete 10 exercises with 100% score",
        icon: "trophy",
        earnedAt: "2023-05-15T10:12:00Z",
      },
      {
        id: 3,
        title: "Geometry Master",
        description: "Complete all geometry modules",
        icon: "shapes",
        earnedAt: null,
      },
      {
        id: 4,
        title: "Persistent Learner",
        description: "Maintain a 7-day streak",
        icon: "calendar",
        earnedAt: null,
      },
    ],
    recentActivities: [
      {
        id: 1,
        title: "Equivalent Fractions Quiz",
        type: "quiz",
        score: 90,
        date: "2023-05-20T15:30:00Z",
        moduleTitle: "Fractions Made Fun",
      },
      {
        id: 2,
        title: "Solving Linear Equations",
        type: "exercise",
        score: 75,
        date: "2023-05-19T11:45:00Z",
        moduleTitle: "Algebra Adventure",
      },
      {
        id: 3,
        title: "Geometry Shapes Game",
        type: "game",
        score: 85,
        date: "2023-05-18T14:20:00Z",
        moduleTitle: "Geometry Explorer",
      },
      {
        id: 4,
        title: "Decimal Operations",
        type: "exercise",
        score: 95,
        date: "2023-05-17T10:15:00Z",
        moduleTitle: "Decimal Detectives",
      },
    ],
  };

  const data = progressData || defaultData;

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const getActivityTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "quiz":
        return "bg-primary text-primary-foreground";
      case "exercise":
        return "bg-secondary text-secondary-foreground";
      case "game":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getAchievementIcon = (icon: string) => {
    switch (icon.toLowerCase()) {
      case "trophy":
        return <Trophy className="h-6 w-6" />;
      case "star":
        return <Star className="h-6 w-6" />;
      case "calendar":
        return <Clock className="h-6 w-6" />;
      case "shapes":
        return <Calculator className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <>
      <Helmet>
        <title>Your Progress | MathJoy</title>
        <meta
          name="description"
          content="Track your math learning progress, view achievements, and see your strengths and areas for improvement."
        />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8 dark:text-white">
            Your Learning Progress
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-muted-foreground">
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-primary" />
                  <div className="text-2xl font-bold">{data.overall}%</div>
                </div>
                <ProgressBar value={data.overall} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-muted-foreground">
                  Learning Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-secondary" />
                  <div className="text-2xl font-bold">{data.streak} days</div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Keep it up! 2 more days to earn a badge
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-muted-foreground">
                  Activities Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-accent" />
                  <div className="text-2xl font-bold">{data.activitiesCompleted}</div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Across {data.categoryProgress.length} categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-muted-foreground">
                  Time Spent Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-purple-600" />
                  <div className="text-2xl font-bold">{data.timeSpent} hours</div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="progress" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="progress">Progress by Category</TabsTrigger>
              <TabsTrigger value="activity">Weekly Activity</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="recent">Recent Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="progress">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Progress by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.categoryProgress}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis unit="%" />
                          <Tooltip 
                            formatter={(value) => [`${value}%`, "Progress"]}
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              borderColor: "hsl(var(--border))",
                              color: "hsl(var(--foreground))",
                            }}
                          />
                          <Bar dataKey="value" fill="hsl(var(--primary))">
                            {data.categoryProgress.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Grade Level Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {data.gradeProgress.map((grade) => (
                        <div key={grade.grade}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">Grade {grade.grade}</span>
                            <span>{grade.progress}%</span>
                          </div>
                          <ProgressBar value={grade.progress} />
                        </div>
                      ))}
                    </div>

                    <div className="h-60 mt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.gradeProgress}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="progress"
                            nameKey="grade"
                            label={({ grade, progress }) => `Grade ${grade}: ${progress}%`}
                          >
                            {data.gradeProgress.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value, name) => [`${value}%`, `Grade ${name}`]}
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              borderColor: "hsl(var(--border))",
                              color: "hsl(var(--foreground))",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.weeklyActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip 
                          formatter={(value) => [value, "Activities Completed"]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Bar dataKey="completed" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.achievements.map((achievement) => (
                  <Card key={achievement.id} className={`${!achievement.earnedAt ? "opacity-60" : ""}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.earnedAt 
                            ? "bg-primary/20 text-primary" 
                            : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                        }`}>
                          {getAchievementIcon(achievement.icon)}
                        </div>
                        <div className="ml-4">
                          <h3 className="font-heading font-bold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      {achievement.earnedAt ? (
                        <p className="text-xs text-muted-foreground">
                          Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Not earned yet</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {data.recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start">
                        <Badge className={`mr-4 mt-1 ${getActivityTypeColor(activity.type)}`}>
                          {activity.type}
                        </Badge>
                        <div className="flex-1">
                          <h3 className="font-medium">{activity.title}</h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            Module: {activity.moduleTitle}
                          </p>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {formatDate(activity.date)}
                            </span>
                            <span className={`font-medium ${getScoreColor(activity.score)}`}>
                              Score: {activity.score}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
