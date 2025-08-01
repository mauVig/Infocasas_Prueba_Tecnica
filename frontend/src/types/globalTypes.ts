
export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export interface Exercise {
  id: number;
  name: string;
  completed: boolean;
}

