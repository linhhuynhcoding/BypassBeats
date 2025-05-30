import Sidebar from "./sidebar";
import Header from "./header";
import Player from "./player";
import { PlayerProvider } from '@/app/context/PlayerContext';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      <div className="flex h-screen bg-gray-950:80 text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
          <Player />
        </div>
      </div>
    </PlayerProvider>
  );
}
