import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { rule, shield, or, allow } from "trpc-shield";
import { Context } from "./context";
import { RoleSchema } from "@/TSChema";

export const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
});

const isAuthenticated = rule<Context>()(async (ctx) => {
  return ctx.session?.user !== null;
});

const isOwnProfile = rule<Context>()(async (ctx, _type, _path, input) => {
  return (
    ctx.session?.user?.id === input?.id ||
    ctx.session?.user?.coachId === input?.id
  );
});

const isAdmin = rule<Context>()(async (ctx) => {
  return ctx.session?.user?.role === RoleSchema.Enum.admin;
});

export const permissions = shield<Context>({
  user: {
    query: {
      list: isAdmin,
      get: or(isAdmin, isOwnProfile),
    },
    mutation: {
      create: allow,
      update: or(isAdmin, isOwnProfile),
      delete: or(isAdmin, isOwnProfile),
    },
  },
  coach: {
    query: {
      getInfiniteCoaches: allow,
    },
    mutation: {
      update: or(isAdmin, isOwnProfile),
    },
  },
  focusArea: {
    query: {
      list: isAuthenticated,
    },
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const mergeRouters = t.mergeRouters;
export const createCallerFactory = t.createCallerFactory;

export const permissionsMiddleware = t.middleware(permissions);

export const shieldedProcedure = t.procedure.use(permissionsMiddleware);
