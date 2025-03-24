"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const RootLayout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isUser, setIsUser] = useState(false);

    // 🟢 Fetch user from localStorage & verify in backend
    useEffect(() => {
        const checkUser = async () => {
            try {
                const storedEmail = localStorage.getItem("userEmail");

                if (storedEmail) {
                    const res = await fetch(`https://survey-app-backend-h4ap.onrender.com/api/users?email=${storedEmail}`);
                    const data = await res.json();

                    if (data.exists) {
                        setIsUser(true);
                    } else {
                        setIsUser(false);
                    }
                } else {
                    setIsUser(false);
                }
            } catch (error) {
                console.error("Error checking user:", error);
                setIsUser(false);
            }
        };

        checkUser();
    }, []);

    return (
        <div className="root-layout p-4">
            <nav className="flex justify-between items-center">
                {/* Logo Section */}
                <div>
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="Shree Cement Logo" width={38} height={32} />
                        <h2 className="text-primary-100 text-lg md:text-3xl">Shree Cement Ltd.</h2>
                    </Link>
                </div>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex flex-row justify-between gap-6">
                    <Link href="/" className={`text-primary-100 hover:text-[#1E1EF6] ${pathname === "/" ? "text-[#1E1EF6]" : "text-primary-100"}`}>Attend a survey</Link>
                    {isUser ? (
                        <Link href="/dashboard" className={`text-primary-100 hover:text-[#1E1EF6] ${pathname === "/dashboard" ? "text-[#1E1EF6]" : "text-primary-100"}`}>Dashboard</Link>
                    ) : (
                        <Link href="/sign-in" className="text-primary-100 hover:text-[#1E1EF6]">Sign In</Link>
                    )}
                </div>

                {/* Hamburger Icon for Mobile */}
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden flex flex-col gap-4 mt-2">
                    <Link href="/" className="text-primary-100 hover:text-[#1E1EF6]">Take a survey</Link>
                    {isUser ? (
                        <Link href="/dashboard" className="text-primary-100 hover:text-[#1E1EF6]">Dashboard</Link>
                    ) : (
                        <Link href="/sign-in" className="text-primary-100 hover:text-[#1E1EF6]">Sign In</Link>
                    )}
                </div>
            )}

            {children}
        </div>
    );
};

export default RootLayout;
