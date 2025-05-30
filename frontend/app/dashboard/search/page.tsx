'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import DashboardLayout from '@/app/ui/dashboardLayout';
import { searchSongs } from '@/app/actions/search';
import { YouTubeSearchResults } from 'youtube-search';
import he from 'he';
import { usePlayer } from '@/app/context/PlayerContext';
import axios from 'axios';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState<{ [id: string]: boolean }>({});

  const { setCurrentSong } = usePlayer();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const data = await searchSongs(query);
    setResults(data || []);
    setLoading(false);
  };

    const handlePlay = async (videoId: string) => {
    if (converting[videoId]) return;

    try {
        const res = await axios.get(`/api/play/${videoId}`, {
        responseType: 'blob',
        });
        if (res.status === 200) {
        setCurrentSong(videoId);
        return;
        }
    } catch (err: any) {
        if (err?.response?.status !== 404) return;
    }

    setConverting((prev) => ({ ...prev, [videoId]: true }));

    try {
        await axios.post(`/api/convert`, {
        url: `https://www.youtube.com/watch?v=${videoId}`,
        });
        setCurrentSong(videoId);
    } catch (err) {
        console.error('Convert failed', err);
    } finally {
        setConverting((prev) => ({ ...prev, [videoId]: false }));
    }
    };


  return (
    <DashboardLayout>
      <div className="flex flex-col items-center mt-2 px-4">
        <div className="flex items-center w-full max-w-xl border rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-4 py-3 outline-none bg-transparent text-gray-900 dark:text-gray-100"
            placeholder="Search for a song..."
          />
          <button
            onClick={handleSearch}
            className="px-4 text-gray-500 hover:text-blue-500 transition"
          >
            <Search />
          </button>
        </div>

        <div className="mt-8 w-full max-w-3xl space-y-4">
          {results.map((item: YouTubeSearchResults, i) => {
            const videoId = item.id;
            return (
              <div
                key={i}
                className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                onClick={() => handlePlay(videoId)}
              >
                <img
                  src={item.thumbnails.default?.url}
                  alt={item.title}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="text-gray-900 dark:text-gray-100 font-medium">
                  {he.decode(item.title)}
                </div>
                {converting[videoId] && <div className="ml-auto animate-pulse">Converting...</div>}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
