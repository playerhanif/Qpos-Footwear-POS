import Dexie, { type Table } from 'dexie';
import type {
    Product,
    Category,
    Brand,
    Order,
    Customer,
    StockLog
} from '../types';

export class QposDatabase extends Dexie {
    products!: Table<Product>;
    categories!: Table<Category>;
    brands!: Table<Brand>;
    orders!: Table<Order>;
    customers!: Table<Customer>;
    stockLogs!: Table<StockLog>;
    settings!: Table<any>; // For simple key-value settings if needed

    constructor() {
        super('QposDatabase');

        // Define tables and indexes
        this.version(1).stores({
            products: '++id, sku, name, categoryId, brandId, isActive',
            categories: '++id, &slug, name, isActive',
            brands: '++id, &slug, name, isActive',
            orders: '++id, &orderNumber, customerId, orderDate, paymentStatus',
            customers: '++id, name, &phone, email',
            stockLogs: '++id, productId, variantId, reason, timestamp',
            settings: 'id'
        });
    }
}

export const db = new QposDatabase();

export async function seedDatabase() {
    const count = await db.categories.count();
    if (count === 0) {
        await db.categories.bulkAdd([
            { name: 'Men', slug: 'men', displayOrder: 1, isActive: true } as any,
            { name: 'Women', slug: 'women', displayOrder: 2, isActive: true } as any,
            { name: 'Kids', slug: 'kids', displayOrder: 3, isActive: true } as any,
            { name: 'Accessories', slug: 'accessories', displayOrder: 4, isActive: true } as any
        ]);

        await db.brands.add({ name: 'Generic', slug: 'generic', isActive: true } as any);
    }
}
