import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@/trpc/context";
import { AppRouter } from "@/trpc";

const createContext = async (req: Request) => {
  return createTRPCContext({
    req,
  });
};

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    router: AppRouter,
    req: req,
    createContext: () => createContext(req),
  });

export { handler as GET, handler as POST };
