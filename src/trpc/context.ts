import * as trpc from "@trpc/server";
import { Session } from "next-auth";
import { auth } from "@/auth";
interface CreateContextOptions {
  headers?: Headers;
  req?: Request;
  session: Session | null;
}

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    ...opts,
  };
};
export async function createTRPCContext(opts?: { req?: Request }) {
  const { req } = opts || {};
  const headers = req?.headers;
  const session = await auth();

  return createInnerTRPCContext({
    req,
    headers,
    session,
  });
}

export type Context = trpc.inferAsyncReturnType<typeof createTRPCContext>;
