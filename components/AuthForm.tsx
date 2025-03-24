"use client"
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import FormField from '@/components/FormField';
import { Button } from '@/components/ui/button';

interface SignInFormInputs {
    email: string;
    password: string;
}

const AuthForm = () => {
    const methods = useForm<SignInFormInputs>();
    const { handleSubmit, reset } = methods;
    const router = useRouter();

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
            console.error('Error during sign in:', error);
            alert('Something went wrong. Please try again!');
        }
    };

    return (
        <div className="card-border w-full md:w-[566px]">
            <div className="flex flex-col gap-6 card md:py-14 py-4 md:px-10 px-2">
                <h3>Sign In</h3>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        <FormField
                            name="email"
                            label="Email"
                            placeholder="Your email address"
                            type="email"
                            // onChange={(e) => }
                        />
                        <FormField
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                            // onChange={(e) => }

                        />
                        <Button className="btn" type="submit">
                            Sign In
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default AuthForm;
