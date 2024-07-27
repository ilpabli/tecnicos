import { create } from "zustand";

export const useTicketStore = create((set) => ({
  assignedTicketsCount: 0,
  setAssignedTicketsCount: (count: any) => set({ assignedTicketsCount: count }),
}));
