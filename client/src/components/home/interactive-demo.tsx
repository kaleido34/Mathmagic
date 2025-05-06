import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { areEquivalentFractions } from "@/lib/math-expressions";

type FractionOption = {
  value: string;
  selected: boolean;
};

type FeedbackState = {
  message: string;
  isCorrect: boolean | null;
  explanation: string;
};

export function InteractiveDemo() {
  const [options, setOptions] = useState<FractionOption[]>([
    { value: "2/4", selected: false },
    { value: "1/4", selected: false },
    { value: "3/4", selected: false },
  ]);

  const [feedback, setFeedback] = useState<FeedbackState>({
    message: "",
    isCorrect: null,
    explanation: "",
  });

  const [showFeedback, setShowFeedback] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [celebrate, setCelebrate] = useState(false);

  const correctAnswer = "2/4";

  const handleOptionClick = (index: number) => {
    const newOptions = options.map((option, i) => ({
      ...option,
      selected: i === index,
    }));
    setOptions(newOptions);
  };

  const checkAnswer = () => {
    const selectedOption = options.find((option) => option.selected);

    if (!selectedOption) {
      setFeedback({
        message: "Please select an answer!",
        isCorrect: null,
        explanation: "",
      });
      setShowFeedback(true);
      return;
    }

    const isCorrect = selectedOption.value === correctAnswer;

    setFeedback({
      message: isCorrect ? "Correct! 1/2 = 2/4" : "Not quite. Try again!",
      isCorrect,
      explanation: isCorrect
        ? "Both represent the same portion of a whole."
        : "Hint: Think about equivalent fractions.",
    });

    setShowFeedback(true);

    if (isCorrect) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 600);
    }
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setSliderValue(value);
  };

  // Update visual representation when slider changes
  useEffect(() => {
    const isCorrect = areEquivalentFractions(1, 2, sliderValue, 4);
    if (isCorrect && !feedback.isCorrect) {
      setFeedback({
        message: "Correct! 1/2 = 2/4",
        isCorrect: true,
        explanation: "You found the equivalent fraction using the visual representation!",
      });
      setShowFeedback(true);
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 600);
    }
  }, [sliderValue]);

  const getFeedbackClasses = () => {
    if (!showFeedback) return "hidden";
    if (feedback.isCorrect === null) return "bg-yellow-100 dark:bg-yellow-900/30";
    return feedback.isCorrect
      ? "bg-green-100 dark:bg-green-900/30"
      : "bg-red-100 dark:bg-red-900/30";
  };

  const getFeedbackTextColor = () => {
    if (feedback.isCorrect === null) return "text-yellow-800 dark:text-yellow-300";
    return feedback.isCorrect
      ? "text-green-800 dark:text-green-300"
      : "text-red-800 dark:text-red-300";
  };

  return (
    <section className="py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-2 dark:text-white">
          Try a Quick Lesson
        </h2>
        <p className="text-center text-neutral-dark dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          See how our interactive lessons make math concepts easy to understand
          with visual guides and immediate feedback.
        </p>

        <div className="bg-neutral-light dark:bg-gray-700 rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-heading font-bold mb-4 dark:text-white">
            Equivalent Fractions
          </h3>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <p className="mb-4 dark:text-white">
                Which fraction is equivalent to 1/2?
              </p>

              <div className="space-y-3 mb-6">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={`bg-white dark:bg-gray-800 p-3 rounded-lg border-2 ${
                      option.selected
                        ? "border-primary"
                        : "border-gray-200 dark:border-gray-600"
                    } hover:border-primary cursor-pointer transition flex items-center ${
                      celebrate && option.selected && option.value === correctAnswer
                        ? "celebrate"
                        : ""
                    }`}
                    onClick={() => handleOptionClick(index)}
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-500 flex items-center justify-center mr-3">
                      <div
                        className={`w-4 h-4 rounded-full bg-primary ${
                          option.selected ? "" : "hidden"
                        }`}
                      ></div>
                    </div>
                    <span className="text-lg dark:text-white">{option.value}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                onClick={checkAnswer}
              >
                Check Answer
              </Button>

              <div
                className={`mt-4 p-4 rounded-lg ${getFeedbackClasses()}`}
              >
                {showFeedback && (
                  <>
                    <p className={`font-semibold ${getFeedbackTextColor()}`}>
                      {feedback.message}
                    </p>
                    {feedback.explanation && (
                      <p className="text-neutral-dark dark:text-gray-300 mt-2">
                        {feedback.explanation}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="md:w-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <h4 className="font-heading font-bold mb-3 dark:text-white">
                Visual Representation
              </h4>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full h-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex mb-2">
                  <div className="w-1/2 h-full bg-primary"></div>
                </div>
                <p className="text-center font-semibold dark:text-white">1/2</p>

                <div className="w-full h-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-1/4 h-full ${i < sliderValue ? "bg-secondary" : "bg-gray-300 dark:bg-gray-600"} ${
                        i >= sliderValue ? "opacity-20" : ""
                      }`}
                    ></div>
                  ))}
                </div>
                <p className="text-center dark:text-white">{sliderValue}/4</p>

                <p className="text-neutral-dark dark:text-gray-400 text-center text-sm mt-2">
                  Drag the slider to adjust the fraction and find the equivalent
                  value.
                </p>

                <input
                  type="range"
                  min="0"
                  max="4"
                  value={sliderValue}
                  step="1"
                  className="w-full"
                  onChange={handleSliderChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
