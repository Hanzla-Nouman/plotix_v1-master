export default function LoadingDashBoard({ isCoach }: { isCoach?: boolean }) {
  if (isCoach) {
    return (
      <div className="p-6 lg:px-16 lg:py-8 xl:px-36 xl:py-10">
        <div className="w-full h-40 bg-secondary rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-12 items-center mt-10">
          <div className="col-span-1 bg-secondary h-80 rounded-lg" />
          <div className="col-span-1 bg-secondary h-80 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-12 items-center mt-10">
          <div className="col-span-1 bg-secondary h-80 rounded-lg" />
          <div className="col-span-1 bg-secondary h-80 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:px-16 lg:py-8 xl:px-36 xl:py-10">
      <div className="w-full h-40 bg-secondary rounded-lg" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-12 items-center mt-10">
        <div className="col-span-1 bg-secondary h-80 rounded-lg" />
        <div className="col-span-1 bg-secondary h-80 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 items-center mt-10">
        <div className="col-span-1 bg-secondary h-80 rounded-lg" />
      </div>
    </div>
  );
}
