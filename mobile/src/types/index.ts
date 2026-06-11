// ─── Navigation ───────────────────────────────────────────────
export type RootStackParamList = {
  index: undefined;
  '(tabs)': undefined;
};

// ─── Domain ──────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason?: string;
  performedBy?: string;
  createdAt: Date;
}
