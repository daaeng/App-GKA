// ./resources/js/Pages/Roles/Show.tsx

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Pencil, Shield, Undo2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Details',
        href: window.location.pathname,
    },
];

interface Props {
    role: { id: number; name: string };
    permissions: string[];
}

export default function Show({ role, permissions }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Role Details: ${role.name}`} />

            <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <Heading 
                            title="Role Details" 
                            description="View role information and assigned permissions."
                        />
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-2">
                        <Link href={route('roles.index')}>
                            <Button variant="outline" className="border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <Undo2 className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                        <Link href={route('roles.edit', role.id)}>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Role
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
                    <div className="p-6 md:p-8 space-y-8">
                        {/* Name Section */}
                        <div className="max-w-2xl">
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                                Role Name
                            </Label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                    <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {role.name}
                                </span>
                            </div>
                        </div>

                        {/* Permissions Section */}
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 block">
                                Assigned Permissions ({permissions.length})
                            </Label>
                            
                            <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-6 border border-gray-100 dark:border-gray-700/50">
                                <div className="flex flex-wrap gap-2">
                                    {permissions.length > 0 ? (
                                        permissions.map((permission) => (
                                            <span 
                                                key={permission} 
                                                className="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 shadow-sm"
                                            >
                                                {permission}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic text-sm">
                                            No permissions assigned to this role.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}