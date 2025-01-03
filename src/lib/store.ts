import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

interface MeetingState {
  meetingId: string | null;
  participants: string[];
  setMeetingId: (id: string | null) => void;
  addParticipant: (id: string) => void;
  removeParticipant: (id: string) => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  meetingId: null,
  participants: [],
  setMeetingId: (id) => set({ meetingId: id }),
  addParticipant: (id) => set((state) => ({ 
    participants: [...state.participants, id] 
  })),
  removeParticipant: (id) => set((state) => ({ 
    participants: state.participants.filter(p => p !== id) 
  })),
}));