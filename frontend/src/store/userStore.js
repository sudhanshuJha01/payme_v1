import { create } from 'zustand';

export const useUserStore = create((set) => ({
  fullname: "",
  email: "",
  accountNumber:"",
  setUser: (user) =>
    set({
      fullname: user.fullname || "",
      email: user.email || "",
      accountNumber: user.accountNumber || "",
    }),

  clearUser: () =>
    set({
      fullname: "",
      email: "",
      accountNumber :""
    }),
}));
