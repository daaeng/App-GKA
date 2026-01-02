// ./resources/js/Pages/UserManagements/show.tsx

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Mail, Pencil, Shield, Undo2, User as UserIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/usermanagements',
    },
    {
        title: 'User Details',
        href: window.location.pathname,
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

interface Props {
    user: User;
    userRoles: string[];
}

export default function Show({ user, userRoles }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User Details: ${user.name}`} />

            <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <Heading 
                            title="User Details" 
                            description="View complete user profile and access privileges."
                        />
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-2">
                        <Link href={route('usermanagements.index')}>
                            <Button variant="outline" className="border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <Undo2 className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                        <Link href={route('usermanagements.edit', user.id)}>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit User
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
                    <div className="p-6 md:p-8 space-y-8">
                        {/* Basic Info Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                                    Full Name
                                </Label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                        <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        {user.name}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                                    Email Address
                                </Label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                        <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Roles Section */}
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 block flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Assigned Roles ({userRoles.length})
                            </Label>
                            
                            <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-6 border border-gray-100 dark:border-gray-700/50">
                                <div className="flex flex-wrap gap-2">
                                    {userRoles.length > 0 ? (
                                        userRoles.map((roleName, index) => (
                                            <span 
                                                key={index} 
                                                className="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 shadow-sm"
                                            > 
                                                {roleName} 
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic text-sm">
                                            No roles assigned to this user.
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