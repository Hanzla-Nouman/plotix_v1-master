import { headers } from "next/headers";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const headersList = headers();
  const authHeader = headersList.get("authorization");

  const accessToken = authHeader?.split("Bearer ")[1];

  if (accessToken) {
    const localUser = await prisma.user.findFirst({
      include: {
        accounts: true,
      },
      where: {
        accounts: {
          some: {
            access_token: accessToken as string,
          },
        },
      },
    });

    if (!localUser) {
      return NextResponse.json(
        {
          accessToken: "",
        },
        { status: 404 }
      );
    }

    const calcomProviderAccount = localUser?.accounts?.find(
      (account) => account.provider === "calcom"
    );

    if (calcomProviderAccount?.refresh_token) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CAL_URL ?? ""}/oauth/${
          process.env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID ?? ""
        }/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-cal-secret-key": process.env.CAL_OAUTH_SECRET_KEY ?? "",
          },
          body: JSON.stringify({
            refreshToken: calcomProviderAccount.refresh_token,
          }),
        }
      );
      if (response.status !== 200) {
        return NextResponse.json(
          {
            accessToken: "",
          },
          { status: 400 }
        );
      }
      const resp = await response.json();
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        resp.data;

      await prisma.account.update({
        data: {
          refresh_token: (newRefreshToken as string) ?? "",
          access_token: (newAccessToken as string) ?? "",
        },
        where: { id: calcomProviderAccount.id },
      });

      return NextResponse.json({ accessToken: newAccessToken });
    }
  }

  return NextResponse.json(
    {
      accessToken: "",
    },
    { status: 404 }
  );
}
