import { notFound } from "next/navigation";
import { EditUserForm } from "./components/EditUserForm";
import { getCurrentUser } from "@/actions/getCurrentUser";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function UserProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return notFound();
  }

  return (
    <MaxWidthWrapper>
      <Card className="max-w-[500px] mx-auto mt-6">
        <CardContent>
          <CardHeader className="flex justify-between items-center flex-row ">
            <CardTitle>Account Settings</CardTitle>
            <Button>
              <Link href="/user/change-password">Change Password</Link>
            </Button>
          </CardHeader>
          <EditUserForm currentUser={currentUser} />
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
}
