import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const IDS = ['s1', 's2', 's3', 's4'] as const;
// In-memory demo store. It resets on redeploy/cold start. Swap for a database (e.g. Vercel KV/Postgres) when the contest is real.
const votes: Record<string, number> = Object.fromEntries(IDS.map((id) => [id, 0]));

export async function GET() {
  return NextResponse.json({ votes });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { id?: string } | null;
  const id = body?.id;
  if (!id || !(IDS as readonly string[]).includes(id)) {
    return NextResponse.json({ error: 'Unknown story' }, { status: 400 });
  }
  votes[id] += 1;
  return NextResponse.json({ votes });
}
