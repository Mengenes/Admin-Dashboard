import { create } from "zustand"

type User = {
  username: string
  role: string
}

type UserState = {
  user: User | null
  hydrated: boolean
  setUser: (user: User | null) => void
  setHydrated: (value: boolean) => void
  logoutUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  hydrated: false,

  setUser: (user) => set({ user }),

  setHydrated: (hydrated) => set({ hydrated }),

  logoutUser: () => set({ user: null })
}))