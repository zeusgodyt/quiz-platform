import Quiz from "@/components/Quiz";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-5">
      <h1 className="text-3xl font-bold mb-6">Interactive Quiz Platform</h1>
      <Quiz />
    </main>
  );
}
