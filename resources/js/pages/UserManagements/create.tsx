// ./resources/js/Pages/UserManagements/create.tsx

import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Lock, Mail, Save, Shield, Undo2, User } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/usermanagements',
    },
    {
        title: 'Create User',
        href: '/usermanagements/create',
    },
];

interface Props {
    roles: string[];
}

export default function Create({ roles }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        roles: [] as string[],
    });

    function handleCheckBox(roleName: string, checked: boolean) {
        if (checked) {
            setData('roles', [...data.roles, roleName]);
        } else {
            setData('roles', data.roles.filter((name) => name !== roleName));
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('usermanagements.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <Heading 
                            title="Create New User" 
                            description="Register a new user and assign their initial roles."
                        />
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <Link href={route('usermanagements.index')}>
                            <Button variant="outline" className="border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <Undo2 className="mr-2 h-4 w-4" />
                                Back to List
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
                    <div className="p-6 md:p-8">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-500" />
                                        Full Name
                                    </Label>
                                    <Input 
                                        id="name"
                                        placeholder="e.g. John Doe" 
                                        value={data.name} 
                                        onChange={(e) => setData('name', e.target.value)} 
                                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                                
                                {/* Email Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        Email Address
                                    </Label>
                                    <Input 
                                        id="email"
                                        type="email" 
                                        placeholder="john@example.com" 
                                        value={data.email} 
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="space-y-2 md:col-span-2 max-w-md">
                                    <Label htmlFor="password" className="flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-gray-500" />
                                        Password
                                    </Label>
                                    <Input 
                                        id="password"
                                        type="password" 
                                        placeholder="••••••••" 
                                        value={data.password} 
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                                <Label className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 block flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-indigo-500" />
                                    Assign Roles
                                </Label>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {roles.map((role) => (
                                        <label 
                                            key={role} 
                                            className={`
                                                relative flex items-center p-3 rounded-lg border transition-all duration-200 cursor-pointer
                                                ${data.roles.includes(role) 
                                                    ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' 
                                                    : 'bg-white border-gray-200 hover:border-indigo-300 dark:bg-gray-900 dark:border-gray-700 dark:hover:border-indigo-700'}
                                            `}
                                        >
                                            <Input 
                                                type="checkbox" 
                                                checked={data.roles.includes(role)}
                                                onChange={(e) => handleCheckBox(role, e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-800"
                                            />
                                            <span className={`ml-3 text-sm font-medium ${data.roles.includes(role) ? 'text-indigo-900 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {role}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <Link href={route('usermanagements.index')}>
                                    <Button variant="ghost" type="button">Cancel</Button>
                                </Link>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm min-w-[120px]"
                                >
                                    {processing ? 'Saving...' : (
                                        <span className="flex items-center gap-2">
                                            <Save className="w-4 h-4" />
                                            Create User
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