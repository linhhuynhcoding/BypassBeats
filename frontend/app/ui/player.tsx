export default function Player() {
  return (
    <div className="h-16 bg-gray-900:80 px-6 flex items-center justify-between text-sm text-gray-300">
      <div>Now playing: 🎵 No song</div>
      <div className="space-x-4">
        <button>⏮</button>
        <button>▶️</button>
        <button>⏭</button>
      </div>
    </div>
  );
}
