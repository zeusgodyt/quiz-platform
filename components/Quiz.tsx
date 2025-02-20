"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation"; 
import { quizData } from "@/lib/quizData";
import { saveAttempt } from "@/lib/db"; // ✅ Removed `getAttempts`
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [integerAnswer, setIntegerAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // ✅ Function to handle quiz completion
  const handleQuizCompletion = useCallback(async () => {
    await saveAttempt(score, quizData.length);
    setQuizCompleted(true);
    toast({ title: "Quiz Completed!", description: `Score: ${score}/${quizData.length}` });

    setTimeout(() => {
      router.push("/history");
    }, 3000);
  }, [score, toast, router]); // ✅ Added dependencies inside useCallback

  // ✅ Function to handle next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIntegerAnswer("");
      setTimer(30);
    } else {
      handleQuizCompletion(); 
    }
  }, [currentQuestion, handleQuizCompletion]); // ✅ Added `handleQuizCompletion` as dependency

  useEffect(() => {
    if (timer === 0) {
      handleNextQuestion();
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, handleNextQuestion, currentQuestion, handleQuizCompletion]); // ✅ Added dependencies

  if (!quizData || quizData.length === 0) {
    return <h1 className="text-center text-2xl font-bold mt-10">No Quiz Data Available</h1>;
  }

  const question = quizData[currentQuestion];

  function handleAnswer(option: string) {
    setSelectedAnswer(option);
    if (option === question.answer) {
      setScore((prev) => prev + 1);
      toast({ title: "Correct!", description: "Well done!" });
    } else {
      toast({ title: "Wrong!", description: "Try again!" });
    }
    setTimeout(handleNextQuestion, 1000);
  }

  function handleIntegerSubmit() {
    if (parseInt(integerAnswer) === question.answer) {
      setScore((prev) => prev + 1);
      toast({ title: "Correct!", description: "Well done!" });
    } else {
      toast({ title: "Wrong!", description: `Correct answer: ${question.answer}` });
    }
    setTimeout(handleNextQuestion, 1000);
  }

  if (quizCompleted) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-3xl font-bold text-green-600">🎉 Congratulations! 🎉</h1>
        <h2 className="text-xl mt-2">You completed the quiz!</h2>
        <h2 className="text-xl mt-2 font-semibold">Your Score: {score} / {quizData.length}</h2>
        <p className="text-gray-600 mt-4">Redirecting to quiz history in 3 seconds...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <Card className="w-full max-w-lg mx-auto mt-5 mb-auto min-h-[300px] overflow-auto">
        <CardHeader>
          <CardTitle>{question.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={(timer / 30) * 100} className="mb-3" />

          {question.options &&
            question.options.map((option) => (
              <Button key={option} className="w-full mt-2" onClick={() => handleAnswer(option)} disabled={selectedAnswer !== null}>
                {option}
              </Button>
            ))}

          {question.type === "integer" && (
            <div className="mt-4">
              <Input type="number" value={integerAnswer} onChange={(e) => setIntegerAnswer(e.target.value)} placeholder="Enter answer" />
              <Button className="mt-3" onClick={handleIntegerSubmit} disabled={!integerAnswer}>
                Submit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>  
  );
}
