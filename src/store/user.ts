import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserState {
  userId: string;
  username: string;
  roles: string[];
  permissions: string[];
  token: string | null;
}

interface UserStore extends UserState {
  setUserInfo: (info: Partial<UserState>) => void;
  reset: () => void;
}

const initialState: UserState = {
  userId: '',
  username: '',
  roles: [],
  permissions: [],
  token: null,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUserInfo: (info) => set((state) => ({ ...state, ...info })),
      reset: () => {
        localStorage.removeItem('token'); // 清理 Token
        set(initialState);
      },
    }),
    {
      name: 'user-storage', // persist key
    }
  )
);
