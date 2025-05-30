import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return new Response("Missing API URL", { status: 500 });

    const res = await fetch(`${apiUrl}/api/play/${id}`, {
        method: "GET",
        headers: {
            Range: req.headers.get("Range") || "",
        },
    });

    const headers = new Headers();
    res.headers.forEach((value, key) => {
        headers.set(key, value);
    });

    return new Response(res.body, {
        status: res.status,
        headers,
    });
}
