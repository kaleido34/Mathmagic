import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Helmet } from "react-helmet";
import { Loader2, ArrowLeft, Play, Book, Gamepad, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { formatFraction } from "@/lib/math-expressions";

interface Activity {
  id: number;
  title: string;
  type: "lesson" | "exercise" | "game" | "quiz";
  description: string;
  completed: boolean;
  duration: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  image: string;
  grade: number;
  difficulty: string;
  category: string;
  activities: Activity[];
  progress: number;
  slug: string;
}

interface Question {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctOption: string;
  explanation: string;
}

export default function ModuleDetail() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentActivityIndex, setCurrentActivityIndex] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  const { data: module, isLoading } = useQuery<Module>({
    queryKey: [`/api/modules/${slug}`],
  });

  const { data: questions } = useQuery<Question[]>({
    queryKey: [`/api/modules/${slug}/questions`],
    enabled: activeTab === "practice",
  });

  const defaultModule: Module = {
    id: 1,
    title: "Fractions Made Fun",
    description: "Learn how to add, subtract, and compare fractions using visual models. This module covers the basics of fractions and provides interactive exercises to help you master the concepts.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    grade: 6,
    difficulty: "Easy",
    category: "Fractions",
    activities: [
      {
        id: 1,
        title: "Understanding Fractions",
        type: "lesson",
        description: "Learn the basics of what fractions are and how they represent parts of a whole.",
        completed: true,
        duration: 10
      },
      {
        id: 2,
        title: "Equivalent Fractions",
        type: "lesson",
        description: "Discover how different fractions can represent the same value.",
        completed: false,
        duration: 15
      },
      {
        id: 3,
        title: "Adding Fractions",
        type: "exercise",
        description: "Practice adding fractions with the same denominator.",
        completed: false,
        duration: 12
      },
      {
        id: 4,
        title: "Fraction Match Game",
        type: "game",
        description: "Match equivalent fractions in this fun memory game.",
        completed: false,
        duration: 8
      },
      {
        id: 5,
        title: "Fractions Quiz",
        type: "quiz",
        description: "Test your knowledge of fractions with this quiz.",
        completed: false,
        duration: 15
      }
    ],
    progress: 20,
    slug: "fractions-made-fun"
  };

  const defaultQuestions: Question[] = [
    {
      id: 1,
      question: "Which of these fractions is equivalent to 1/2?",
      options: [
        { id: "a", text: "2/4" },
        { id: "b", text: "1/4" },
        { id: "c", text: "3/4" },
        { id: "d", text: "1/3" }
      ],
      correctOption: "a",
      explanation: "1/2 = 2/4 because if you multiply both the numerator and denominator of 1/2 by 2, you get 2/4."
    },
    {
      id: 2,
      question: "What is 1/3 + 1/3?",
      options: [
        { id: "a", text: "1/3" },
        { id: "b", text: "2/3" },
        { id: "c", text: "1/6" },
        { id: "d", text: "3/3" }
      ],
      correctOption: "b",
      explanation: "When adding fractions with the same denominator, you add the numerators and keep the denominator the same. So 1/3 + 1/3 = 2/3."
    },
    {
      id: 3,
      question: "Which fraction is greater: 3/4 or 2/3?",
      options: [
        { id: "a", text: "3/4" },
        { id: "b", text: "2/3" },
        { id: "c", text: "They are equal" },
        { id: "d", text: "It depends" }
      ],
      correctOption: "a",
      explanation: "To compare fractions with different denominators, you can convert them to a common denominator. 3/4 = 9/12 and 2/3 = 8/12, so 3/4 is greater."
    }
  ];

  const data = module || defaultModule;
  const practiceQuestions = questions || defaultQuestions;
  const currentQuestion = practiceQuestions[currentQuestionIndex];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return <Book className="h-5 w-5" />;
      case "exercise":
        return <CheckCircle className="h-5 w-5" />;
      case "game":
        return <Gamepad className="h-5 w-5" />;
      case "quiz":
        return <Play className="h-5 w-5" />;
      default:
        return <Book className="h-5 w-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "lesson":
        return "bg-primary text-primary-foreground";
      case "exercise":
        return "bg-secondary text-secondary-foreground";
      case "game":
        return "bg-accent text-accent-foreground";
      case "quiz":
        return "bg-purple-600 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "challenging":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  const startActivity = (index: number) => {
    setCurrentActivityIndex(index);
    if (data.activities[index].type === "quiz") {
      setActiveTab("practice");
      setCurrentQuestionIndex(0);
      setShowFeedback(false);
      setSelectedOption(null);
      setUserAnswers({});
    }
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const checkAnswer = () => {
    if (selectedOption) {
      setUserAnswers({
        ...userAnswers,
        [currentQuestionIndex]: selectedOption,
      });
      setShowFeedback(true);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed logic here
      setCurrentQuestionIndex(0);
      setActiveTab("overview");
    }
  };

  const isCorrect = selectedOption === currentQuestion?.correctOption;

  const getFeedbackClasses = () => {
    if (!showFeedback) return "hidden";
    return isCorrect
      ? "bg-green-100 dark:bg-green-900/30"
      : "bg-red-100 dark:bg-red-900/30";
  };

  const getFeedbackTextColor = () => {
    return isCorrect
      ? "text-green-800 dark:text-green-300"
      : "text-red-800 dark:text-red-300";
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{data.title}</title>
        <meta
          name="description"
          content={data.description}
        />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/topics">
              <a className="flex items-center text-primary hover:underline mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Topics
              </a>
            </Link>
            
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-none">
                Grade {data.grade}
              </Badge>
              <Badge
                variant="outline"
                className={`${getDifficultyColor(data.difficulty)} border-none`}
              >
                {data.difficulty}
              </Badge>
              <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-none">
                {data.category}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 dark:text-white">
              {data.title}
            </h1>
            
            <div className="flex items-center mb-6">
              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium">{data.progress}%</span>
                </div>
                <Progress value={data.progress} className="h-2" />
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      <img 
                        src={data.image} 
                        alt={data.title} 
                        className="w-full h-60 object-cover rounded-lg mb-6"
                      />
                      <h2 className="text-2xl font-heading font-bold mb-4 dark:text-white">
                        About This Module
                      </h2>
                      <p className="text-neutral-dark dark:text-gray-300 mb-6">
                        {data.description}
                      </p>
                      
                      <h3 className="text-xl font-heading font-bold mb-3 dark:text-white">
                        What You'll Learn
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-neutral-dark dark:text-gray-300 mb-6">
                        <li>Understand the concept of fractions as parts of a whole</li>
                        <li>Identify equivalent fractions using visual models</li>
                        <li>Add and subtract fractions with the same denominators</li>
                        <li>Compare fractions using different strategies</li>
                        <li>Apply fraction concepts to solve real-world problems</li>
                      </ul>
                      
                      <h3 className="text-xl font-heading font-bold mb-3 dark:text-white">
                        Prerequisites
                      </h3>
                      <p className="text-neutral-dark dark:text-gray-300">
                        Basic understanding of whole numbers and division.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-heading font-bold mb-4 dark:text-white">
                        Module Activities
                      </h3>
                      <div className="space-y-4">
                        {data.activities.slice(0, 3).map((activity, index) => (
                          <div key={activity.id} className="flex items-start">
                            <Badge className={`mr-3 ${getActivityColor(activity.type)}`}>
                              {getActivityIcon(activity.type)}
                            </Badge>
                            <div>
                              <p className="font-medium dark:text-white">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {activity.duration} min
                              </p>
                            </div>
                          </div>
                        ))}
                        {data.activities.length > 3 && (
                          <Button 
                            variant="ghost" 
                            className="w-full text-primary"
                            onClick={() => setActiveTab("activities")}
                          >
                            View All Activities
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-heading font-bold mb-4 dark:text-white">
                        Start Learning
                      </h3>
                      <p className="text-neutral-dark dark:text-gray-300 mb-4">
                        Begin your learning journey with the first activity.
                      </p>
                      <Button 
                        className="w-full"
                        onClick={() => startActivity(0)}
                      >
                        Start First Activity
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activities">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-heading font-bold mb-6 dark:text-white">
                    Module Activities
                  </h2>
                  
                  <div className="space-y-6">
                    {data.activities.map((activity, index) => (
                      <div 
                        key={activity.id} 
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start mb-4 md:mb-0">
                          <Badge className={`mr-4 ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </Badge>
                          <div>
                            <h3 className="font-heading font-bold mb-1 dark:text-white">
                              {activity.title}
                            </h3>
                            <p className="text-sm text-neutral-dark dark:text-gray-300 mb-2">
                              {activity.description}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span className="mr-3">{activity.duration} minutes</span>
                              {activity.completed && (
                                <span className="flex items-center text-green-600 dark:text-green-400">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Completed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => startActivity(index)}
                          variant={activity.completed ? "outline" : "default"}
                          className="md:w-auto w-full"
                        >
                          {activity.completed ? "Review" : "Start"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="practice">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-heading font-bold mb-6 dark:text-white">
                    Practice Quiz
                  </h2>
                  
                  <div className="mb-4 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestionIndex + 1} of {practiceQuestions.length}
                    </span>
                    <Progress 
                      value={(currentQuestionIndex + 1) / practiceQuestions.length * 100} 
                      className="w-1/2 h-2"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-heading font-bold mb-4 dark:text-white">
                      {currentQuestion.question}
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                      {currentQuestion.options.map((option) => (
                        <div
                          key={option.id}
                          className={`bg-white dark:bg-gray-800 p-3 rounded-lg border-2 ${
                            selectedOption === option.id
                              ? "border-primary"
                              : "border-gray-200 dark:border-gray-600"
                          } hover:border-primary cursor-pointer transition flex items-center`}
                          onClick={() => handleOptionSelect(option.id)}
                        >
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-500 flex items-center justify-center mr-3">
                            <div
                              className={`w-4 h-4 rounded-full bg-primary ${
                                selectedOption === option.id ? "" : "hidden"
                              }`}
                            ></div>
                          </div>
                          <span className="text-lg dark:text-white">{option.text}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div
                      className={`mt-4 p-4 rounded-lg ${getFeedbackClasses()}`}
                    >
                      {showFeedback && (
                        <>
                          <p className={`font-semibold ${getFeedbackTextColor()}`}>
                            {isCorrect ? "Correct!" : "Incorrect. Try again!"}
                          </p>
                          <p className="text-neutral-dark dark:text-gray-300 mt-2">
                            {currentQuestion.explanation}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    {!showFeedback ? (
                      <Button
                        onClick={checkAnswer}
                        disabled={!selectedOption}
                        className="w-full md:w-auto"
                      >
                        Check Answer
                      </Button>
                    ) : (
                      <Button
                        onClick={nextQuestion}
                        className="w-full md:w-auto"
                      >
                        {currentQuestionIndex < practiceQuestions.length - 1
                          ? "Next Question"
                          : "Finish Quiz"}
                      </Button>
                    )}
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
