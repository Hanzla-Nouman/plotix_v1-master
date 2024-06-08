import { Booking, PurchaseWithRelations, Coach, User } from "@/TSChema";

export type BookingWithUserAndCoach = (Booking & { coach: Coach, user: User });

export interface CurrentUser {
  id: string;
  role: string;
  email: string;
  name: string;
  avatar: string;
  coachId?: string | undefined;
}

export interface DashBoardProps {
  user: CurrentUser | null;
  purchases: PurchaseWithRelations[];
  isLoading: boolean;
  bookings: BookingWithUserAndCoach[]
}
