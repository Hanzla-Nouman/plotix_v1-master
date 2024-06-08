import { CoachWithRelations } from "@/TSChema";
import { InstagramIcon, LinkIcon, TwitterIcon } from "lucide-react";

import Link from "next/link";

export default function CoachLinks({ coach }: { coach: CoachWithRelations }) {
  const { instagramUrl, twitterUrl, twitchUrl } = coach;

  return (
    <div className="flex w-full gap-4 items-center justify-between">
      {instagramUrl && (
        <Link
          href={instagramUrl}
          className="bg-card border border-slate-200 bg-white flex items-center justify-center p-6 h-full"
          style={{ boxShadow: '0 4px 4px 0 rgba(0,0,0,.25)' }}
        >
          <InstagramIcon className="w-10 h-10 sm:w-6 sm:h-6 md:w-8 md:h-8 xl:w-10 xl:h-10" />

        </Link>
      )}

      {twitchUrl && (
        <Link
          href={twitchUrl as string}
          className="bg-card border border-slate-200 bg-white flex items-center justify-center p-6 h-full"
          style={{ boxShadow: '0 4px 4px 0 rgba(0,0,0,.25)' }}
        >
          <LinkIcon className="w-10 h-10 sm:w-6 sm:h-6 md:w-8 md:h-8 xl:w-10 xl:h-10" />

        </Link>
      )}

      {twitterUrl && (
        <Link
          href={twitterUrl as string}
          className="bg-card border border-slate-200 bg-white flex items-center justify-center p-6 h-full"
          style={{ boxShadow: '0 4px 4px 0 rgba(0,0,0,.25)' }}
        >
          <TwitterIcon className="w-10 h-10 sm:w-6 sm:h-6 md:w-8 md:h-8 xl:w-10 xl:h-10" />

        </Link>
      )}
    </div>
  );
}
