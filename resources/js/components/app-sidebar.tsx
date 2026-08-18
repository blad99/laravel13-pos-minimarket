import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Store, ShoppingCart } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as storesIndex } from '@/routes/stores';
import { index as categoriesIndex } from '@/routes/categories';
import { index as productsIndex } from '@/routes/products';
import type { NavItem } from '@/types';

// Tambahkan roles yang diizinkan untuk setiap menu
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        roles: ['admin', 'cashier'], // Bisa dilihat keduanya
    },
    {
        title: 'Kelola Toko',
        href: storesIndex().url,
        icon: Store,
        roles: ['admin'], // Hanya admin
    },
    {
        title: 'Kategori',
        href: categoriesIndex().url,
        icon: Store,
        roles: ['admin'], // Hanya admin
    },
    {
        title: 'Produk',
        href: productsIndex().url,
        icon: Store,
        roles: ['admin'], // Hanya admin
    },
    // Contoh menu khusus kasir (bisa disesuaikan nanti)
    /*
    {
        title: 'Kasir (POS)',
        href: '/pos', 
        icon: ShoppingCart,
        roles: ['cashier', 'admin'],
    },
    */
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    // Ambil data auth dari page props
    const { auth } = usePage<any>().props;
    const userRole = auth.user.role; // Asumsi 'admin' atau 'cashier'

    // Filter menu berdasarkan role user aktif
    const filteredNavItems = mainNavItems.filter((item) => {
        // Jika tidak didefinisikan roles-nya, tampilkan untuk semua.
        // Jika didefinisikan, periksa apakah role user termasuk di dalamnya.
        if (!item.roles) return true;
        return item.roles.includes(userRole);
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Gunakan menu yang sudah di-filter */}
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
