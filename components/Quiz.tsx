"use client";

import { useState, useEffect, useCallback } from "react";
import { quizData } from "@/lib/quizData";
import { saveAttempt, getAttempts } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

// ✅ Define a type for attempts to avoid `any`
type Attempt = {
  score: number;
  total: number;
  date: string;
};

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [integerAnswer, setIntegerAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]); // ✅ Fixed `any` type
  const { toast } = useToast();

  // ✅ Load past attempts when component mounts
  useEffect(() => {
    async function fetchAttempts() {
      const storedAttempts = await getAttempts();
      setAttempts(storedAttempts);
    }
    fetchAttempts();
  }, []);

  // ✅ Move `handleNextQuestion` to the top level to avoid React hook errors
  const handleNextQuestion = useCallback(async () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIntegerAnswer("");
      setTimer(30);
    } else {
      await saveAttempt(score, quizData.length);
      setQuizCompleted(true);
      toast({ title: "Quiz Completed!", description: `Score: ${score}/${quizData.length}` });

      // ✅ Refresh attempts after saving score
      setTimeout(async () => {
        const updatedAttempts = await getAttempts();
        setAttempts(updatedAttempts);
      }, 500);
    }
  }, [currentQuestion, score, toast]);

  // ✅ Ensure `handleNextQuestion` is in `useEffect` dependencies
  useEffect(() => {
    if (timer === 0) handleNextQuestion();
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, handleNextQuestion]);

  // ✅ Prevents crashing if `quizData` is missing
  if (!quizData || quizData.length === 0) {
    return <h1 className="text-center text-2xl font-bold mt-10">No Quiz Data Available</h1>;
  }

  const question = quizData[currentQuestion] ?? null;

  function handleAnswer(option: string) {
    setSelectedAnswer(option);
    if (option === question?.answer) {
      setScore((prev) => prev + 1);
      toast({ title: "Correct!", description: "Well done!" });
    } else {
      toast({ title: "Wrong!", description: "Try again!" });
    }
    setTimeout(handleNextQuestion, 1000);
  }

  // ✅ Handles integer type questions
  function handleIntegerSubmit() {
    if (parseInt(integerAnswer) === question?.answer) {
      setScore((prev) => prev + 1);
      toast({ title: "Correct!", description: "Well done!" });
    } else {
      toast({ title: "Wrong!", description: `Correct answer: ${question?.answer}` });
    }
    setTimeout(handleNextQuestion, 1000);
  }

  // ✅ Displays the final Scoreboard
  if (quizCompleted) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">Quiz Completed! 🎉</h1>
        <h2 className="text-xl mt-2">Your Score: {score} / {quizData.length}</h2>
        
        {/* ✅ Show previous scores */}
        {attempts.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Previous Scores</h2>
            <ul className="mt-2">
              {attempts.map((attempt, index) => (
                <li key={index} className="text-md">
                  🔹 Attempt {index + 1}: {attempt.score}/{attempt.total} ({new Date(attempt.date).toLocaleString()})
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button className="mt-4" onClick={() => window.location.reload()}>Restart Quiz</Button>
      </div>
    );
  }
// ✅ Display the current question
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


