// ImageSlider.tsx
import React from "react";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import getFirstLettersOfName from "@/helpers/getFirstLettersOfName";

interface ImageSliderProps {
  urls: string[];
  coachName?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ urls, coachName }) => {
  return (
    <div className="flex justify-center overflow-hidden">
      <Avatar className="mb-2 w-fit h-fit">
        <div className="flex shrink-0 overflow-hidden rounded-full h-20 w-20 xl:h-28 xl:w-28 relative">
          {urls.length > 0 ? urls.map((url, index) => (
            <Image
              key={index}
              height={100}
              width={100}
              src={url}
              alt={`Image ${index + 1}`}
              loading="lazy"
              className="w-auto h-auto aspect-square object-cover"
            />
          )) : (
            <div className="flex justify-center items-center w-full h-full bg-purple-200">
              {coachName && <p className="text-[24px] xl:text-[36px] text-primary font-bold">{getFirstLettersOfName(coachName)}</p>}
            </div>
          )}
        </div>
      </Avatar>
    </div>
  );
};

export default ImageSlider;
