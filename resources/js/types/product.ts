import { Category } from "./category";

export type Product = {
    id: string;
    category_id: string;
    barcode: string | null;
    name: string;
    description: string | null;
    cost_price: number;
    selling_price: number;
    stock: number;
    is_active: boolean;
    category: Category; // Berasal dari relasi with('category')
};