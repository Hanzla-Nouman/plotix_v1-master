import { getCurrentUser } from "@/actions/getCurrentUser";
import { getTrpcCaller } from "@/trpc";
import CoachPage from "./_components/CoachPage";

interface PageProps {
  params: {
    coachId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const trpcCaller = await getTrpcCaller();
  const { coachId } = params;

  const user = await getCurrentUser();
  const coach = await trpcCaller.coach.get({
    include: {
      workHistory: {
        include: {
          image: true,
        },
      },
      user: {
        include: {
          avatar: true,
        },
      },
      coachFAQs: true,
      introVideo: {
        include: {
          thumbnail: true,
        },
      },
      portfolioItems: {
        include: {
          img: true,
        },
      },
      focusAreas: true,
      coachingPackages: {
        include: {
          image: true,
          explainerVideo: true,
          focusAreas: true,
        },
      },
    },
    where: {
      id: coachId,
    },
  });

  return <CoachPage user={user} staticCoachData={coach} />;
};

export default Page;
