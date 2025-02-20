import Quiz from "@/components/Quiz";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-5">
      <h1 className="text-center text-3xl font-bold mt-8">
        Interactive Quiz <span className="block">Platform</span>
      </h1>
      <Quiz />
    </main>
  );
}
