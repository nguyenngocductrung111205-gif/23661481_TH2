import { create } from 'zustand';
import { STUDENT, examStamp } from '@constants/student';

interface AuthState {
  token: string | null;
  identifier: string;
  login: (value: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  identifier: '',
  login: (value: string) => {
    const fakeToken = `ktxgo-${STUDENT.mssv}-${examStamp()}`;
    set({ token: fakeToken, identifier: value });
  },
  logout: () => {
    set({ token: null, identifier: '' });
  },
}));

export default useAuthStore;
