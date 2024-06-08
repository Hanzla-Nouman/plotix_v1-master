// Use the correct relative path for the import
import React from "react";

const WhyDoICoach = ({ whyICoach }: { whyICoach?: string | null }) => {
  if (!whyICoach) {
    return null;
  }

  return (
    <div className="font-semibold mt-7 mb-6 text-lg">
      Coaching: My Simple Why
      <p className="text-gray-500 mt-4 w-full font-normal text-sm md:w-[600px] lg:w-[801px] xl:w-[834px]">
        {whyICoach}
      </p>
      <hr className="mt-6" />
    </div>
  );
};

export default WhyDoICoach;
