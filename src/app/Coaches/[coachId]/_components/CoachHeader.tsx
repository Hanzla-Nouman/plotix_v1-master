import { CoachWithRelations } from "@/TSChema";
import { AvatarPicker, UserAvatar } from "@/components/AvatarPicker";
import CoachDetailsForm from "./CoachDetailsForm";

interface TCoachHeaderProps {
  coach: CoachWithRelations;
  isEditable: boolean;
}

const CoachHeader = (props: TCoachHeaderProps) => {
  const { coach, isEditable } = props;

  return (
    <>
      <div className=" hidden md:block w-full h-[40px] bg-gradient-to-r from-purple-500 to-purple-200 rounded-md" />
      <div className="flex flex-wrap justify-center md:justify-start mt-4">
        {isEditable ? (
          <AvatarPicker
            media={coach.user?.avatar}
            name={coach.name}
            userId={coach.userId}
          />
        ) : (
          <UserAvatar media={coach.user.avatar} name={coach.name} />
        )}
        <div className="text-center items-center justify-center ml-0 mt-6 w-full md:w-auto md:ml-8 md:mt-0 md:items-start md:text-left">
          {/* Name */}
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-gray-900 flex gap-2 items-center flex-col-reverse md:flex-row">
            <span>{coach.name}</span>
            {isEditable && <CoachDetailsForm coach={coach} />}
          </h1>
          {/* Headline */}
          <div className="mt-4 inline-flex items-center justify-center text-neutral-900   px-2.5 py-1.5 text-xl font-medium">
            <h2>{coach.headline}</h2>
          </div>
        </div>
        {/* <div className="hidden md:block">hey</div> */}
        <section className=" hidden lg:block mt-4 md:w-[450px] lg:w-[800px]">
          <h2 className="mb-2 font-semibold text-lg">About Me</h2>

          <p className="flex items-center w-full text-gray-500">
            {coach.aboutMe}
          </p>
        </section>
      </div>
    </>
  );
};
export default CoachHeader;
