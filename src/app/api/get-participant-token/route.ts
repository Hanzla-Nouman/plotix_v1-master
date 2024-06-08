import { getTrpcCaller } from "@/trpc";
import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const roomId = req.nextUrl.searchParams.get("roomName");
  const username = req.nextUrl.searchParams.get("name");
  if (!roomId) {
    return NextResponse.json(
      { error: 'Missing "room" query parameter' },
      { status: 400 }
    );
  } else if (!username) {
    return NextResponse.json(
      { error: 'Missing "username" query parameter' },
      { status: 400 }
    );
  }

  const trpcCaller = await getTrpcCaller();
  const booking = await trpcCaller.booking.get({
    where: {
      roomId,
    },
  });
  // booking exists, and haven't expired - end date is in the future (with a buffer of 1 day)
  if (
    !booking ||
    Date.now() > booking.endDate.getTime() + 8.64 * Math.pow(10, 7)
  ) {
    return NextResponse.json(
      { error: "Room not found or expired" },
      { status: 404 }
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  const at = new AccessToken(apiKey, apiSecret, { identity: username });

  at.addGrant({
    room: roomId,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  return NextResponse.json({ accessToken: await at.toJwt() });
}
