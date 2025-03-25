"use client"

import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { toast } from 'sonner';

interface UserFormInputs {
    name: string;
    email: string;
    password: string;
    profileImg: string;
    god_access: boolean;
}

const CreateUserForm = () => {
    const { control, handleSubmit, reset } = useForm<UserFormInputs>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            profileImg: '',
            god_access: false,
        }
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: UserFormInputs) => {
        setLoading(true);
        try {
            const res = await fetch('https://survey-app-backend-h4ap.onrender.com/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                toast.success('User created successfully!');
                reset();
            } else {
                toast.error(result.message || 'Failed to create user');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-2xl md:p-8 p-1 shadow-lg">
                <CardHeader>
                    <h2 className="text-3xl font-bold text-center mb-6">Create New User</h2>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Name" className="p-4 text-lg" />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input type="email" {...field} placeholder="Email" className="p-4 text-lg" />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input type="password" {...field} placeholder="Password" className="p-4 text-lg" />
                            )}
                        />
                        <Controller
                            name="profileImg"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Profile Image URL" className="p-4 text-lg" />
                            )}
                        />
                        <div className="flex items-center gap-4">
                            <Controller
                                name="god_access"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <label className="text-lg">God Access</label>
                        </div>
                        <Button type="submit" className="w-full p-4 text-lg" disabled={loading}>
                            {loading ? 'Creating...' : 'Create User'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateUserForm;
