import { router, createCallerFactory } from "./server";
import userRouter from "./userRouter";
import focusAreaRouter from "./focusAreaRouter";
import coachRouter from "./coachRouter";
import mediaRouter from "./mediaRouter";
import workExperienceRouter from "./workExperienceRouter";
import coachingPackageRouter from "./coachingPackageRouter";
import coachingPackageCategoryRouter from "./coachingPackageCategoryRouter";
import portfolioItemRouter from "./portfolioItemRouter";
import bookingRouter from "./bookingRouter";
import categoryRouter from "./categoryRouter";
import purchaseRouter from "./purchaseRouter";
import stripeRouter from "./stripeRouter";
import { createTRPCContext } from "./context";

export const AppRouter = router({
  user: userRouter,
  coach: coachRouter,
  focusArea: focusAreaRouter,
  category: categoryRouter,
  media: mediaRouter,
  booking: bookingRouter,
  workExperience: workExperienceRouter,
  portfolioItem: portfolioItemRouter,
  coachingPackage: coachingPackageRouter,
  coachingPackageCategory: coachingPackageCategoryRouter,
  purchase: purchaseRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof AppRouter;

// for server-side access to the router
export const getTrpcCaller = async () => {
  const callerFactory = createCallerFactory(AppRouter);
  const ctx = await createTRPCContext();

  return callerFactory(ctx);
};
