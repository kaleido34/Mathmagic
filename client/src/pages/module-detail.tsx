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
import { Helmet } from "react-helmet-async";
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
    // Check if the activity at the specified index exists
    if (data.activities && data.activities.length > index) {
      const activity = data.activities[index];
      if (activity.type === "quiz") {
        setActiveTab("practice");
        setCurrentQuestionIndex(0);
        setShowFeedback(false);
        setSelectedOption(null);
        setUserAnswers({});
      } else {
        // For other activity types, provide more interactive content
        getActivityContent(activity);
      }
    } else {
      // Handle the case where the activity doesn't exist
      window.alert("This activity is not available yet. Check back soon!");
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

  // Safe guards for undefined currentQuestion
  const isCorrect = currentQuestion ? selectedOption === currentQuestion.correctOption : false;
  
  const getLearningObjectives = (title: string): string[] => {
    // Default objectives if no specific ones are found
    const defaultObjectives = [
      "Master essential math concepts through interactive exercises",
      "Apply mathematical thinking to solve real-world problems",
      "Build confidence in approaching complex math topics",
      "Develop critical thinking and analytical skills",
      "Learn to communicate mathematical ideas effectively"
    ];
    
    // Topic-specific learning objectives
    const topicObjectives: Record<string, string[]> = {
      "Fractions": [
        "Understand the concept of fractions as parts of a whole",
        "Identify equivalent fractions using visual models",
        "Add and subtract fractions with the same denominators",
        "Compare fractions using different strategies",
        "Apply fraction concepts to solve real-world problems"
      ],
      "Decimals": [
        "Convert between fractions and decimals accurately",
        "Add, subtract, multiply, and divide decimal numbers",
        "Round decimal numbers to specified place values",
        "Compare and order decimal numbers",
        "Solve word problems involving money and measurements"
      ],
      "Percentages": [
        "Understand percentages as special decimals and fractions",
        "Convert between percentages, decimals, and fractions",
        "Calculate percentage increases and decreases",
        "Solve real-world problems involving discounts, tips, and taxes",
        "Analyze and interpret data represented as percentages"
      ],
      "Algebra": [
        "Understand variables and algebraic expressions",
        "Solve linear equations and inequalities",
        "Interpret and create graphs of linear functions",
        "Apply algebraic techniques to word problems",
        "Use algebra to model real-world situations"
      ],
      "Geometry": [
        "Identify and classify 2D and 3D geometric shapes",
        "Calculate area, perimeter, and volume of common shapes",
        "Understand and apply the properties of angles",
        "Use coordinate geometry to solve problems",
        "Apply geometric principles to practical situations"
      ],
      "Statistics": [
        "Collect, organize, and interpret data effectively",
        "Calculate and interpret measures of central tendency",
        "Create and analyze various types of graphs",
        "Understand probability concepts and calculate simple probabilities",
        "Make predictions based on statistical data"
      ],
      "Ratios": [
        "Understand ratios as relationships between quantities",
        "Use ratio tables and double number lines",
        "Solve problems involving proportional relationships",
        "Apply ratios to scale drawings and maps",
        "Connect ratios to fractions and percentages"
      ],
      "Square": [
        "Understand the concept of square roots and perfect squares",
        "Estimate the value of square roots of non-perfect squares",
        "Use square roots in the Pythagorean theorem",
        "Solve equations involving square roots",
        "Apply square roots to real-world scenarios"
      ]
    };
    
    // Check if title contains any of the topic keywords
    for (const topic in topicObjectives) {
      if (title.toLowerCase().includes(topic.toLowerCase())) {
        return topicObjectives[topic];
      }
    }
    
    return defaultObjectives;
  };
  
  const getPrerequisites = (title: string): string => {
    // Default prerequisites
    const defaultPrerequisites = "Basic understanding of arithmetic operations (addition, subtraction, multiplication, division).";
    
    // Topic-specific prerequisites
    const topicPrerequisites: Record<string, string> = {
      "Fractions": "Understanding of whole numbers and basic division concepts.",
      "Decimals": "Familiarity with place value and fractions.",
      "Percentages": "Understanding of fractions and decimals; ability to multiply and divide.",
      "Algebra": "Comfort with arithmetic operations and understanding of the equals sign as balance.",
      "Geometry": "Basic understanding of shapes, angles, and measurement.",
      "Statistics": "Ability to work with numbers and basic graphing skills.",
      "Ratios": "Understanding of multiplication, division, and basic fractions.",
      "Square": "Familiarity with multiplication, exponents, and basic algebra."
    };
    
    // Check if title contains any of the topic keywords
    for (const topic in topicPrerequisites) {
      if (title.toLowerCase().includes(topic.toLowerCase())) {
        return topicPrerequisites[topic];
      }
    }
    
    return defaultPrerequisites;
  };
  
  const getActivityContent = (activity: Activity) => {
    // Display different content based on activity type and title
    if (activity.type === "lesson") {
      // Show interactive lesson with diagrams, explanations, and examples
      const lessonContent = `
        <div class="lesson-content">
          <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">${activity.title}</h3>
          <p style="margin-bottom: 1rem;">${activity.description}</p>
          <div class="lesson-example" style="margin-bottom: 1.5rem; padding: 1rem; background-color: #f3f4f6; border-radius: 0.5rem;">
            <h4 style="font-weight: bold; margin-bottom: 0.5rem;">Example:</h4>
            <p>${getExampleContent(activity.title)}</p>
          </div>
          <div class="lesson-explanation" style="margin-bottom: 1.5rem;">
            <h4 style="font-weight: bold; margin-bottom: 0.5rem;">Key Concepts:</h4>
            <ul style="list-style-type: disc; padding-left: 1.5rem;">
              ${getKeyConcepts(activity.title).map(concept => `<li style="margin-bottom: 0.5rem;">${concept}</li>`).join('')}
            </ul>
          </div>
          <button id="next-lesson-btn" style="background-color: #4f46e5; color: white; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">Continue</button>
        </div>
      `;
      
      // Create a modal to display the lesson
      const modal = document.createElement("div");
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
      modal.style.display = "flex";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";
      modal.style.zIndex = "1000";
      
      const modalContent = document.createElement("div");
      modalContent.style.backgroundColor = "white";
      modalContent.style.borderRadius = "0.5rem";
      modalContent.style.padding = "1.5rem";
      modalContent.style.width = "90%";
      modalContent.style.maxWidth = "800px";
      modalContent.style.maxHeight = "90vh";
      modalContent.style.overflowY = "auto";
      modalContent.innerHTML = lessonContent;
      
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
      
      // Add event listener to close the modal
      const nextButton = document.getElementById("next-lesson-btn");
      if (nextButton) {
        nextButton.addEventListener("click", () => {
          document.body.removeChild(modal);
        });
      }
      
    } else if (activity.type === "exercise") {
      // Show interactive exercise with problems to solve
      let exerciseContent = `
        <div class="exercise-content">
          <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">${activity.title}</h3>
          <p style="margin-bottom: 1.5rem;">${activity.description}</p>
          <div class="exercise-problems">
      `;
      
      // Generate problems based on activity title
      const problems = getExerciseProblems(activity.title);
      problems.forEach((problem, index) => {
        exerciseContent += `
          <div class="problem" style="margin-bottom: 1.5rem; padding: 1rem; background-color: #f3f4f6; border-radius: 0.5rem;">
            <h4 style="font-weight: bold; margin-bottom: 0.5rem;">Problem ${index + 1}:</h4>
            <p style="margin-bottom: 1rem;">${problem.question}</p>
            <div class="options" style="margin-bottom: 1rem;">
              ${problem.options.map(option => `
                <div class="option" style="margin-bottom: 0.5rem;">
                  <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="radio" name="problem-${index}" value="${option}" style="margin-right: 0.5rem;">
                    <span>${option}</span>
                  </label>
                </div>
              `).join('')}
            </div>
            <button class="check-answer-btn" data-problem="${index}" data-answer="${problem.answer}" style="background-color: #4f46e5; color: white; padding: 0.25rem 0.75rem; border-radius: 0.25rem; font-size: 0.875rem; cursor: pointer;">Check Answer</button>
            <div class="feedback" id="feedback-${index}" style="margin-top: 0.5rem; font-weight: 500; display: none;"></div>
          </div>
        `;
      });
      
      exerciseContent += `
        </div>
        <button id="finish-exercise-btn" style="background-color: #4f46e5; color: white; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">Finish Exercise</button>
      </div>
      `;
      
      // Create a modal to display the exercise
      const modal = document.createElement("div");
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
      modal.style.display = "flex";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";
      modal.style.zIndex = "1000";
      
      const modalContent = document.createElement("div");
      modalContent.style.backgroundColor = "white";
      modalContent.style.borderRadius = "0.5rem";
      modalContent.style.padding = "1.5rem";
      modalContent.style.width = "90%";
      modalContent.style.maxWidth = "800px";
      modalContent.style.maxHeight = "90vh";
      modalContent.style.overflowY = "auto";
      modalContent.innerHTML = exerciseContent;
      
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
      
      // Add event listeners for checking answers
      const checkButtons = document.querySelectorAll(".check-answer-btn");
      checkButtons.forEach(button => {
        const btn = button as HTMLButtonElement;
        btn.addEventListener("click", () => {
          const problemIndex = btn.getAttribute("data-problem");
          const correctAnswer = btn.getAttribute("data-answer");
          const selectedOption = document.querySelector(`input[name="problem-${problemIndex}"]:checked`) as HTMLInputElement;
          const feedback = document.getElementById(`feedback-${problemIndex}`);
          
          if (feedback) {
            if (selectedOption && selectedOption.value === correctAnswer) {
              feedback.textContent = "Correct! Well done.";
              feedback.style.color = "#059669"; // green
            } else {
              feedback.textContent = "Incorrect. Try again.";
              feedback.style.color = "#dc2626"; // red
            }
            feedback.style.display = "block";
          }
        });
      });
      
      // Add event listener to close the modal
      const finishButton = document.getElementById("finish-exercise-btn");
      if (finishButton) {
        finishButton.addEventListener("click", () => {
          document.body.removeChild(modal);
        });
      }
      
    } else if (activity.type === "game") {
      // Open the game in a new route
      const gameType = getGameType(activity.title);
      if (gameType) {
        window.location.href = `/games/${gameType}?title=${encodeURIComponent(activity.title)}`;
      } else {
        window.alert(`Coming soon: ${activity.title} will be available in a future update!`);
      }
    } else {
      // For other activity types, show an alert
      window.alert(`Coming soon: ${activity.title} will be available in a future update!`);
    }
  };
  
  const getExampleContent = (title: string): string => {
    // Return example content based on activity title
    if (title.toLowerCase().includes("fraction")) {
      return `
        <p>To add fractions with the same denominator, add the numerators while keeping the denominator the same.</p>
        <div style="display: flex; align-items: center; margin: 1rem 0;">
          <div style="text-align: center; margin-right: 1rem;">
            <div style="border-bottom: 2px solid black; padding-bottom: 0.25rem;">3</div>
            <div>8</div>
          </div>
          <span style="margin-right: 1rem;">+</span>
          <div style="text-align: center; margin-right: 1rem;">
            <div style="border-bottom: 2px solid black; padding-bottom: 0.25rem;">2</div>
            <div>8</div>
          </div>
          <span style="margin-right: 1rem;">=</span>
          <div style="text-align: center;">
            <div style="border-bottom: 2px solid black; padding-bottom: 0.25rem;">5</div>
            <div>8</div>
          </div>
        </div>
      `;
    } else if (title.toLowerCase().includes("decimal")) {
      return `
        <p>When adding decimals, line up the decimal points and add the numbers column by column.</p>
        <div style="font-family: monospace; white-space: pre; margin: 1rem 0;">
          &nbsp;12.45<br>
          +&nbsp;7.83<br>
          ------<br>
          &nbsp;20.28
        </div>
      `;
    } else if (title.toLowerCase().includes("algebra")) {
      return `
        <p>To solve a simple equation like 2x + 3 = 9, isolate the variable x by doing the same operations to both sides.</p>
        <div style="margin: 1rem 0;">
          2x + 3 = 9<br>
          2x = 6 (subtract 3 from both sides)<br>
          x = 3 (divide both sides by 2)
        </div>
      `;
    } else if (title.toLowerCase().includes("geometry")) {
      return `
        <p>To find the area of a rectangle, multiply its length by its width.</p>
        <div style="margin: 1rem 0;">
          <p>For a rectangle with length 8 cm and width 5 cm:</p>
          <p>Area = length × width = 8 cm × 5 cm = 40 cm²</p>
        </div>
      `;
    }
    
    return "Examples and explanations will be provided for this activity.";
  };
  
  const getKeyConcepts = (title: string): string[] => {
    // Return key concepts based on activity title
    if (title.toLowerCase().includes("fraction")) {
      return [
        "A fraction represents a part of a whole",
        "The numerator (top number) tells how many parts we have",
        "The denominator (bottom number) tells the total number of equal parts the whole is divided into",
        "Equivalent fractions represent the same value but use different numbers"
      ];
    } else if (title.toLowerCase().includes("decimal")) {
      return [
        "Decimals are another way to represent fractions with denominators of 10, 100, 1000, etc.",
        "The decimal point separates the whole number part from the fractional part",
        "Each place to the right of the decimal point has a specific value (tenths, hundredths, etc.)",
        "Decimals can be ordered by comparing digits from left to right"
      ];
    } else if (title.toLowerCase().includes("algebra")) {
      return [
        "Variables are symbols (usually letters) that represent unknown values",
        "Expressions combine numbers, variables, and operations",
        "Equations state that two expressions are equal",
        "Solving an equation means finding the value of the variable that makes the equation true"
      ];
    } else if (title.toLowerCase().includes("geometry")) {
      return [
        "Geometry studies the properties and relationships of points, lines, angles, and shapes",
        "Perimeter is the distance around a shape",
        "Area is the amount of space inside a 2D shape",
        "Volume is the amount of space inside a 3D shape"
      ];
    }
    
    return [
      "This activity will cover important mathematical concepts",
      "You'll learn key skills and strategies for problem-solving",
      "Practice exercises will help reinforce your understanding",
      "Real-world applications will show how these concepts are used"
    ];
  };
  
  const getExerciseProblems = (title: string): {question: string, options: string[], answer: string}[] => {
    // Return exercise problems based on activity title
    if (title.toLowerCase().includes("fraction")) {
      return [
        {
          question: "What is 3/8 + 2/8?",
          options: ["1/8", "5/8", "5/16", "6/16"],
          answer: "5/8"
        },
        {
          question: "Which fraction is equivalent to 1/2?",
          options: ["1/4", "2/6", "3/6", "5/8"],
          answer: "3/6"
        },
        {
          question: "What is 5/6 - 1/6?",
          options: ["4/6", "4/12", "2/3", "6/5"],
          answer: "4/6"
        }
      ];
    } else if (title.toLowerCase().includes("decimal")) {
      return [
        {
          question: "What is 3.75 + 2.25?",
          options: ["5.00", "6.00", "5.90", "6.10"],
          answer: "6.00"
        },
        {
          question: "Which decimal is equal to 3/4?",
          options: ["0.25", "0.5", "0.75", "0.80"],
          answer: "0.75"
        },
        {
          question: "What is 5.8 - 3.2?",
          options: ["2.4", "2.6", "3.6", "2.8"],
          answer: "2.6"
        }
      ];
    } else if (title.toLowerCase().includes("algebra")) {
      return [
        {
          question: "Solve for x: 3x - 5 = 10",
          options: ["3", "5", "4", "15"],
          answer: "5"
        },
        {
          question: "If 2y + 3 = 9, what is y?",
          options: ["2", "3", "6", "12"],
          answer: "3"
        },
        {
          question: "Solve: 5x = 25",
          options: ["5", "20", "0", "125"],
          answer: "5"
        }
      ];
    } else if (title.toLowerCase().includes("geometry")) {
      return [
        {
          question: "What is the area of a rectangle with length 8 m and width 6 m?",
          options: ["14 m²", "28 m²", "48 m²", "64 m²"],
          answer: "48 m²"
        },
        {
          question: "What is the perimeter of a square with sides of length 5 cm?",
          options: ["10 cm", "15 cm", "20 cm", "25 cm"],
          answer: "20 cm"
        },
        {
          question: "A triangle has a base of 8 cm and a height of 6 cm. What is its area?",
          options: ["14 cm²", "24 cm²", "48 cm²", "16 cm²"],
          answer: "24 cm²"
        }
      ];
    }
    
    return [
      {
        question: "Solve the problem: 25 + 18",
        options: ["33", "43", "53", "63"],
        answer: "43"
      },
      {
        question: "What is 72 ÷ 9?",
        options: ["6", "7", "8", "9"],
        answer: "8"
      },
      {
        question: "Calculate: 13 × 4",
        options: ["52", "56", "48", "64"],
        answer: "52"
      }
    ];
  };
  
  const getGameType = (title: string): string | null => {
    if (title.toLowerCase().includes("match")) {
      return "memory";
    } else if (title.toLowerCase().includes("crossword")) {
      return "crossword";
    } else if (title.toLowerCase().includes("puzzle")) {
      return "puzzle";
    }
    return null;
  };

  const getFeedbackClasses = () => {
    if (!showFeedback || !currentQuestion) return "hidden";
    return isCorrect
      ? "bg-green-100 dark:bg-green-900/30"
      : "bg-red-100 dark:bg-red-900/30";
  };

  const getFeedbackTextColor = () => {
    if (!currentQuestion) return "";
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
              <span className="flex items-center text-primary hover:underline mb-4 cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Topics
              </span>
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
                {typeof data.category === 'string' ? data.category : ''}
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
                        {getLearningObjectives(data.title).map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                      
                      <h3 className="text-xl font-heading font-bold mb-3 dark:text-white">
                        Prerequisites
                      </h3>
                      <p className="text-neutral-dark dark:text-gray-300">
                        {getPrerequisites(data.title)}
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
                  
                  {practiceQuestions.length > 0 && currentQuestion ? (
                    <>
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
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <img 
                        src="https://img.freepik.com/free-vector/quiz-neon-sign_1262-19629.jpg?w=826&t=st=1704542110~exp=1704542710~hmac=be033b17dbb0a9987f2099e419842b6fe6829a0ffbbc8b2df2f3242b28c5ed68" 
                        alt="Quiz Coming Soon"
                        className="w-40 h-40 mx-auto mb-4 rounded-full object-cover"
                      />
                      <h3 className="text-xl font-heading font-bold mb-2 dark:text-white">
                        Quiz Coming Soon
                      </h3>
                      <p className="text-neutral-dark dark:text-gray-300 mb-6">
                        We're currently creating exciting practice questions for this module. 
                        Check back soon for interactive quizzes to test your knowledge!
                      </p>
                      <Button
                        onClick={() => setActiveTab("overview")}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Back to Overview
                      </Button>
                    </div>
                  )}
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
