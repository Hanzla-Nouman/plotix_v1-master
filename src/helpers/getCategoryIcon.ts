import { Crown, Gamepad2, Newspaper, Podcast, Sword } from "lucide-react"

export type CoachCategoryName = "Top expert" | "Comic" | "Journalist" | "Games" | "Podcast"

export default function getCategoryIcon(category: CoachCategoryName) {
  switch (category) {
    case "Top expert":
      return Crown;

    case "Comic":
      return Sword;
    
    case "Games":
      return Gamepad2;

    case "Journalist":
      return Newspaper;

    case "Podcast":
      return Podcast;

    default:
      return null;
  }
}
