// app/api/convert/route.ts
export async function POST(req: Request) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return new Response("Missing API URL", { status: 500 });

    const body = await req.json();

    const res = await fetch(`${apiUrl}/api/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const json = await res.json();
    return new Response(JSON.stringify(json), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
}
