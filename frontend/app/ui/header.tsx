export default function Header() {
  return (
    <header className="h-16 px-6 flex items-center justify-between bg-gray-900:80 border-b border-gray-800">
      <div className="text-lg font-semibold">Dashboard</div>
      <div className="text-sm">Welcome back, User!</div>
    </header>
  );
}