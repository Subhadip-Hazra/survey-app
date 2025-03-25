"use client";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

interface SignUpFormInputs {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const AuthSignUpForm = () => {
    const methods = useForm<SignUpFormInputs>();
    const { handleSubmit, reset } = methods;
    const router = useRouter();
    const [pending, setPending] = useState(false);

    const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
        if (data.password !== data.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const res = await fetch(
                "https://survey-app-backend-h4ap.onrender.com/api/users/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: data.name,
                        email: data.email,
                        password: data.password,
                    }),
                }
            );

            const result = await res.json();

            if (res.ok && result.success) {
                alert("Registration successful. Please sign in.");
                router.push("/sign-in");
            } else {
                alert(result.message || "Registration failed");
                reset();
            }
        } catch (error) {
            console.error("Error during sign-up:", error);
            alert("Something went wrong. Please try again!");
        }
    };

    const onProviderSignIn = async (provider: "github" | "google") => {
        setPending(true);
        try {
            const result = await signIn(provider, { redirect: false });
            if (result?.error) {
                alert("Authentication failed. Please try again.");
            } else {
                const user = await fetch("https://survey-app-backend-h4ap.onrender.com/api/auth/user");
                const userData = await user.json();

                if (userData) {
                    await fetch("https://survey-app-backend-h4ap.onrender.com/api/users/register-provider", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: userData.name,
                            email: userData.email,
                            profileImg: userData.imageSrc,
                        }),
                    });
                }
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Error during provider sign-in:", error);
            alert("Something went wrong. Please try again!");
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="card-border w-full md:w-[566px]">
            <div className="flex flex-col gap-6 card md:py-14 py-4 md:px-10 px-2">
                <h3>Sign Up</h3>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        <FormField name="name" label="Full Name" placeholder="Your full name" type="text" />
                        <FormField name="email" label="Email" placeholder="Your email address" type="email" />
                        <FormField name="password" label="Password" placeholder="Enter your password" type="password" />
                        <FormField name="confirmPassword" label="Confirm Password" placeholder="Re-enter your password" type="password" />
                        <Button className="btn" type="submit">
                            Sign Up
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
                            Continue with GitHub
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Already have an account?{' '}
                        <span onClick={() => router.push("/sign-in")} className="text-sky-700 hover:underline cursor-pointer">
                            Sign In
                        </span>
                    </p>
                </FormProvider>
            </div>
        </div>
    );
};

export default AuthSignUpForm;
