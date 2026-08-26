import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Called by the admin API after a product/blog/content mutation (see
// hekathon-api's src/admin/revalidate.service.ts). Body-based secret rather
// than a query param so it never ends up in server logs/URLs.
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { revalidated: false, message: "REVALIDATE_SECRET not configured." },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    path?: string;
    secret?: string;
  } | null;
  if (!body?.secret || body.secret !== secret) {
    return NextResponse.json(
      { revalidated: false, message: "Invalid secret." },
      { status: 401 },
    );
  }
  if (!body.path) {
    return NextResponse.json(
      { revalidated: false, message: "Missing path." },
      { status: 400 },
    );
  }

  revalidatePath(body.path);
  return NextResponse.json({ revalidated: true, path: body.path });
}
