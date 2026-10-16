type HealthResponse = {
  status: string;
  message: string;
};

async function getHealth(): Promise<HealthResponse> {
  const response = await fetch("http://localhost:4000/api/health", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to connect to backend");
  }

  return response.json();
}

export default async function HomePage() {
  let health: HealthResponse | null = null;

  try {
    health = await getHealth();
  } catch (error) {
    console.error("Backend connection failed:", error);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-10 text-slate-900">
      <h1 className="text-3xl font-bold">
        Sri Lanka Destination Explorer
      </h1>

      <p className="mt-4">Testing our first full-stack connection.</p>

      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">Backend Status</h2>

        {health ? (
          <div className="mt-3">
            <p className="text-green-600">
              Status: {health.status}
            </p>
            <p>{health.message}</p>
          </div>
        ) : (
          <p className="mt-3 text-red-600">
            Backend connection failed.
          </p>
        )}
      </div>
    </main>
  );
}