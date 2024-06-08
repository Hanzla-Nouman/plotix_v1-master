import getCategoryIcon, { CoachCategoryName } from "@/helpers/getCategoryIcon";

export default function CategoryIcon({ name }: { name: string }) {
  const Icon = getCategoryIcon(name as CoachCategoryName);

  if (Icon) {
    return <Icon />;
  }

  return <></>;
}
