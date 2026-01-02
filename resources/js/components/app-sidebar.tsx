import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, ChartArea, UserCog2, PackageIcon, ReceiptText, Notebook, HandCoins, UsersRound, PackageOpen, BookUser, Banknote, Archive, Clock, BookUp2, Users } from 'lucide-react'; // [BARU] Import Users icon
import AppLogo from './app-logo';

// 1. Definisikan tipe NavItem dengan field tambahan 'permission'
interface NavItem {
    title: string;
    href: string;
    icon: any;
    permission?: string; // Optional: jika kosong berarti menu tampil untuk semua
}

// 2. Definisikan tipe Props dari Inertia agar TypeScript mengenali auth.permissions
// Ini sesuai dengan data yang dikirim dari HandleInertiaRequests.php Anda
interface PageProps {
    auth: {
        user: any;
        permissions: string[];
    };
    [key: string]: any;
}

// 3. Konfigurasi Menu Utama (Mapping sesuai web.php)
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        // Tidak ada permission = Tampil untuk semua user
    },

    {
        title: 'Role Management',
        href: '/roles',
        icon: Notebook,
        permission: 'roles.view', //
    },

    {
        title: 'User Management',
        href: '/usermanagements',
        icon: UserCog2,
        permission: 'usermanagements.view', //
    },

    {
        title: 'Employee',
        href: '/pegawai',
        icon: BookUser,
        permission: 'pegawai.view', //
    },

    // [BARU] Tambahkan menu Customer
    {
        title: 'Customer / Client',
        href: '/customers',
        icon: Users,
        permission: 'products.view', // Sementara gunakan permission yang ada agar aman
    },

    {
        title: 'Incisor',
        href: '/incisors',
        icon: UsersRound,
        permission: 'incisor.view', // (Perhatikan: Singular 'incisor')
    },

    {
        title: 'Incised Data',
        href: '/inciseds',
        icon: PackageOpen,
        permission: 'incised.view', // (Perhatikan: Singular 'incised')
    },

    {
        title: 'Product',
        href: '/products',
        icon: PackageIcon,
        permission: 'products.view', // (Plural 'products')
    },

    {
        title: 'Inventory',
        href: '/inventories',
        icon: Archive,
        // permission: 'inventories.view',
        // NOTE: Di web.php Anda, route 'inventories' belum ada middleware permission.
        // Jadi saya biarkan kosong agar tetap muncul.
    },

    {
        title: 'PPB',
        href: '/ppb',
        icon: BookUp2 ,
        permission: 'requests.view', // (Route PPB menggunakan middleware requests.*)
    },

    {
        title: 'Invoice',
        href: '/notas',
        icon: ReceiptText ,
        permission: 'notas.view', //
    },

    {
        title: 'Cash Receipt',
        href: '/kasbons',
        icon: HandCoins,
        permission: 'kasbons.view', //
    },

    {
        title: 'Administration',
        href: '/administrasis',
        icon: ChartArea,
        permission: 'administrasis.view', //
    },

    {
        title: 'Payroll',
        href: '/payroll',
        icon: Banknote,
        permission: 'payroll.view',
        // NOTE: Di web.php Anda, route 'payroll' belum ada middleware permission.
    },

    {
        title: 'Absensi',
        href: '/attendances',
        icon: Clock,
        // NOTE: Di web.php Anda, route 'attendances' belum ada middleware permission.
    },
];

const footerNavItems: NavItem[] = [
    // ... your footer items
];

export function AppSidebar() {
    // 4. Ambil Permissions User dari Shared Props Inertia
    const { props } = usePage<PageProps>();
    const userPermissions = props.auth.permissions || []; // Mengambil dari HandleInertiaRequests.php

    // 5. Logic Filtering: Hanya tampilkan menu jika user punya permission atau menu bersifat public
    const filteredNavItems = mainNavItems.filter((item) => {
        // Jika menu tidak butuh permission (misal: Dashboard, Payroll, Inventory), tampilkan.
        if (!item.permission) return true;

        // Cek apakah user memiliki permission yang dibutuhkan
        return userPermissions.includes(item.permission);
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* 6. Render menu yang sudah difilter */}
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
