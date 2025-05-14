export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 p-8 text-white">
      <div className="text-center max-w-2xl bg-slate-800 p-10 rounded-xl shadow-2xl">
        <h1 className="text-5xl font-bold mb-6 tracking-tight">
          Collaborative Tree Editor
        </h1>
        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
          Welcome to the interactive tree editor! Organize your ideas, code
          snippets, project structures, or any hierarchical data with ease.
          Drag, drop, edit, and save your creations.
        </p>
        <p className="text-lg text-slate-300 mb-10">
          Click the button below to start a new tree. Your work will be
          &quot;saved&quot; with a unique ID, allowing you to revisit it
          (conceptually, for this demo).
        </p>
      </div>
      <footer className="absolute bottom-8 text-slate-400 text-sm">
        Powered by Next.js & Tailwind CSS
      </footer>
    </main>
  );
}
