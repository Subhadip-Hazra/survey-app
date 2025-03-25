"use client";
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import FormField from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-select';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from 'next-auth/react';

interface SignInFormInputs {
    email: string;
    password: string;
}

const AuthForm = () => {
    const methods = useForm<SignInFormInputs>();
    const { handleSubmit, reset } = methods;
    const router = useRouter();
    const [pending, setPending] = useState(false);

    const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
        try {
            const res = await fetch('https://survey-app-backend-h4ap.onrender.com/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                localStorage.setItem('userEmail', data.email);
                router.push('/dashboard');
            } else {
                alert(result.message || 'Invalid credentials');
                reset();
            }
        } catch (error) {
            console.error('Error during sign-in:', error);
            alert('Something went wrong. Please try again!');
        }
    };

    const onProviderSignIn = async (provider: "github" | "google") => {
        setPending(true);
        try {
            const result = await signIn(provider, { redirect: false });

            if (result?.error) {
                alert('Authentication failed. Please try again.');
                setPending(false);
                return;
            }

            // Fetch user details from the provider
            const session = await fetch('/api/auth/session').then(res => res.json());

            if (session?.user) {
                const { email, name, image } = session.user;

                // Send user data to backend for storage
                const response = await fetch('https://survey-app-backend-h4ap.onrender.com/api/users/oauth-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, name, profileImage: image }),
                });

                const userData = await response.json();

                if (response.ok) {
                    localStorage.setItem('userEmail', email);
                    router.push('/dashboard');
                } else {
                    alert(userData.message || 'Failed to authenticate with provider');
                }
            }
        } catch (error) {
            console.error('Error during OAuth sign-in:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="card-border w-full md:w-[566px]">
            <div className="flex flex-col gap-6 card md:py-14 py-4 md:px-10 px-2">
                <h3>Sign In</h3>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        <FormField name="email" label="Email" placeholder="Your email address" type="email" />
                        <FormField name="password" label="Password" placeholder="Enter your password" type="password" />
                        <Button className="btn" type="submit">
                            Sign In
                        </Button>
                    </form>
                    <Separator />
                    <div className="flex flex-col gap-y-2.5">
                        <Button
                            disabled={pending}
                            size="lg"
                            onClick={() => onProviderSignIn("google")}
                            variant="outline"
                            className="w-full relative"
                        >
                            <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
                            Continue with Google
                        </Button>
                        <Button
                            disabled={pending}
                            size="lg"
                            onClick={() => onProviderSignIn("github")}
                            variant="outline"
                            className="w-full relative"
                        >
                            <FaGithub className="size-5 absolute top-2.5 left-2.5" />
                            Continue with Github
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Don&apos;t have an Account?{' '}
                        <span onClick={() => router.push("/sign-up")} className="text-sky-700 hover:underline cursor-pointer">
                            Sign Up
                        </span>
                    </p>
                </FormProvider>
            </div>
        </div>
    );
};

export default AuthForm;
