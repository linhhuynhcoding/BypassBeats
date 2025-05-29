"use server";

import youtubeSearch from "youtube-search";

export async function searchSongs(query: string) {
    const API_KEY = process.env.YOUTUBE_V3_API_KEY;
    var opts: youtubeSearch.YouTubeSearchOptions = {
        maxResults: 10,
        key: API_KEY,
    };

    const res = await youtubeSearch(query, opts);
    return res.results;
}
