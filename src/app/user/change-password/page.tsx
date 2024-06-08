import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { notFound } from "next/navigation";

export default async function ChangePasswordPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return notFound();
  }

  return (
    <Card className="max-w-[500px] mx-auto mt-6">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm currentUser={currentUser} />
      </CardContent>
    </Card>
  );
}
