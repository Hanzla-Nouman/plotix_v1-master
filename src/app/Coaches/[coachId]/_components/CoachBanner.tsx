import { CoachWithRelations } from "@/TSChema";
import { BannerPicker, UserBanner } from "./CoachBannerPicker";

export default function CoachBanner({ coach, isEditable }: { coach: CoachWithRelations, isEditable?: boolean }) {
  
  return (
    <div className="relative mb-6 group/item">
      {isEditable ? (
        <BannerPicker
          media={coach.backgroundPicture}
          name={coach.name}
          userId={coach.userId}
        />
      ): (
        <UserBanner media={coach.backgroundPicture} name={coach.name} />
      )}
    </div>
  );
}
