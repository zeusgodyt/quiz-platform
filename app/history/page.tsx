"use client";

import { useEffect, useState } from "react";
import { getAttempts } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Attempt = {
  id: number;
  score: number;
  total: number;
  date: string;
};

export default function HistoryPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    async function fetchAttempts() {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay before fetching data
      const storedAttempts = await getAttempts();
      setAttempts(storedAttempts);
    }
    fetchAttempts();
  }, []);
  

  return (
    <main className="flex flex-col items-center min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-4">📜 Quiz History</h1>

      {attempts.length > 0 ? (
        attempts.map((attempt, index) => (
          <Card key={attempt.id || index} className="w-full max-w-lg mb-2">
            <CardHeader>
              <CardTitle>Attempt {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>📊 Score: <strong>{attempt.score} / {attempt.total}</strong></p>
              <p>📅 Date: {new Date(attempt.date).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-600 text-lg">No quiz history available. Start a quiz!</p>
      )}
    </main>
  );
}
