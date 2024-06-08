import { notFound } from "next/navigation";
import { getCurrentUser } from "@/actions/getCurrentUser";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { PurchasesList } from "./_components/PurchasesList";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return (
    <MaxWidthWrapper>
      <h1 className="my-4 text-2xl font-semibold">Purchases</h1>
      <p className="text-slate-500 text-[14px]">See your Purchases here</p>
      <PurchasesList currentUser={user} />
    </MaxWidthWrapper>
  );
}
