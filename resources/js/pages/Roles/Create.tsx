// ./resources/js/Pages/Roles/Create.tsx

import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Save, Shield, Undo2 } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Create',
        href: '/roles/create',
    },
];

interface Props {
    permissions: string[];
}

export default function Create({ permissions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as string[],
    });

    const handleCheckBox = (permissionName: string, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData('permissions', data.permissions.filter((name) => name !== permissionName));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('roles.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New Role" />

            <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header Section */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <Heading 
                            title="Create New Role" 
                            description="Establish a new role identity and configure its initial access privileges."
                        />
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <Link href={route('roles.index')}>
                            <Button variant="outline" className="border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <Undo2 className="mr-2 h-4 w-4" />
                                Back to List
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
                    <div className="p-6 md:p-8">
                        {/* Error Alert */}
                        {Object.keys(errors).length > 0 && (
                            <Alert className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
                                <CircleAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <AlertTitle>Validation Error</AlertTitle>
                                <AlertDescription>
                                    <ul className="list-disc list-inside text-sm opacity-90">
                                        {Object.entries(errors).map(([key, message]) => (
                                            <li key={key}>{message as string}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Role Name Input */}
                            <div className="space-y-4 max-w-2xl">
                                <Label htmlFor="name" className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-indigo-500" />
                                    Role Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., 'Super Admin' or 'Content Editor'"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="max-w-md bg-gray-50 border-gray-200 focus:bg-white focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-900"
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    The display name for this role. Make it descriptive and unique.
                                </p>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                                <Label className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 block">
                                    Permissions Configuration
                                </Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    Select the capabilities to grant to users with this role.
                                </p>
                                
                                {/* Permissions Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {permissions.map((permission) => (
                                        <label 
                                            key={permission} 
                                            className={`
                                                relative flex items-start p-3 rounded-lg border transition-all duration-200 cursor-pointer
                                                ${data.permissions.includes(permission) 
                                                    ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' 
                                                    : 'bg-white border-gray-200 hover:border-indigo-300 dark:bg-gray-900 dark:border-gray-700 dark:hover:border-indigo-700'}
                                            `}
                                        >
                                            <div className="flex items-center h-5">
                                                <input
                                                    type="checkbox"
                                                    id={permission}
                                                    checked={data.permissions.includes(permission)}
                                                    onChange={(e) => handleCheckBox(permission, e.target.checked)}
                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:checked:bg-indigo-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <span className={`font-medium ${data.permissions.includes(permission) ? 'text-indigo-900 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {permission}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <Link href={route('roles.index')}>
                                    <Button variant="ghost" type="button">Cancel</Button>
                                </Link>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm min-w-[120px]"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">Processing...</span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Save className="w-4 h-4" />
                                            Save Role
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}