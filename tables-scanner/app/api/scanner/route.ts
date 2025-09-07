import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const upstream = 'https://api-rs.dexcelerate.com/scanner';
    const url = new URL(req.url);
    const queryString = url.searchParams.toString();
    const response = await fetch(`${upstream}?${queryString}`, { next: { revalidate: 0 } });
    const body = await response.arrayBuffer();
    const ct = response.headers.get('content-type') ?? 'application/json';
    return new Response(body, { status: response.status, headers: { 'content-type': ct } });
}