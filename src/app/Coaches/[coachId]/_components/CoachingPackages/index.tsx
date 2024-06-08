import { useSearchParams } from "next/navigation";
import { CoachWithRelations } from "@/TSChema";
import CoachingPackageForm from "./CoachingPackageForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardTitle } from "@/components/ui/card";
import CoachingPackage from "./CoachingPackage";

export default function CoachPackageTab({
  coach,
  isEditable,
}: {
  coach: CoachWithRelations;
  isEditable?: boolean;
}) {
  const { coachingPackages } = coach;
  const packagesLength = coachingPackages.length;

  if (!coachingPackages || packagesLength === 0) {
    return (
      <TabsContent value="package">
        {isEditable && (
          <Card className="w-full flex items-center justify-between p-4 mb-4">
            <CardTitle className="block w-max text-xl sm:text-2xl">Create new package</CardTitle>
            <CoachingPackageForm
              existingPackagesLength={packagesLength}
              userId={coach.userId}
              coachId={coach.id}
            >
              <Button className="px-10">
                <Plus className="w-4 h-4" />
              </Button>
            </CoachingPackageForm>
          </Card>
        )}

        <span>No Coaching Packages</span>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="package">
      {isEditable && (
        <Card className="w-full flex items-center justify-between p-4 mb-4">
          <CardTitle className="block w-max text-xl sm:text-2xl">Create new package</CardTitle>
          <CoachingPackageForm
            existingPackagesLength={packagesLength}
            userId={coach.userId}
            coachId={coach.id}
          >
            <Button className="px-10">
              <Plus className="w-4 h-4" />
            </Button>
          </CoachingPackageForm>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-3 xl:gap-8">
        {coach.coachingPackages.map(coachPackage => (
          <CoachingPackage
            coachPackage={coachPackage}
            key={coachPackage.title}
            isEditable={isEditable}
            packagesLength={packagesLength}
            coach={coach}
          />
        ))}
      </div>
    </TabsContent>
  );
}
