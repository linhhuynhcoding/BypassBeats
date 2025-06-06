'use client';

import { PlayerProvider } from '@/app/context/PlayerContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      {children}
    </PlayerProvider>
  );
}
