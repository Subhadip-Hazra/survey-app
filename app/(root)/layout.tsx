"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const RootLayout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [data, setData] = useState<{ profileImg?: string; name: string } | null>(null);

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
                        setData(data.data);
                        console.log(data.data);
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

    // 🟢 Log out function
    const handleLogout = () => {
        localStorage.removeItem("userEmail"); // Remove user data
        setIsUser(false);
        setDropdownOpen(false);
        router.push("/sign-in"); // Redirect to sign-in page
    };

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
                <div className="hidden md:flex flex-row items-center gap-6">
                    <Link href="/" className={`text-primary-100 hover:text-[#1E1EF6] ${pathname === "/" ? "text-[#1E1EF6]" : "text-primary-100"}`}>Attend a survey</Link>
                    {isUser ? (
                        <Link href="/dashboard" className={`text-primary-100 hover:text-[#1E1EF6] ${pathname === "/dashboard" ? "text-[#1E1EF6]" : "text-primary-100"}`}>Dashboard</Link>
                    ) : (
                        <Link href="/sign-in" className="text-primary-100 hover:text-[#1E1EF6]">Sign In</Link>
                    )}

                    {/* Profile Image & Dropdown */}
                    {isUser && data && (
                        <div className="relative">
                            <button onClick={() => { setDropdownOpen(!dropdownOpen); router.push("/"); }} className="flex items-center gap-2 rounded-full">
                                {data.profileImg ? (
                                    <div className="w-10 h-10 overflow-hidden rounded-full">
                                        <img src={data.profileImg} alt="profile-pic" className="rounded-full w-13 h-13" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center">
                                        <p className="uppercase text-lg font-bold text-blue-200">{data?.name.charAt(0)}</p>
                                    </div>
                                )}
                                <ChevronDown size={18} />
                            </button>
                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-black bg-opacity-30 text-center rounded-xl border-3 border-white shadow-lg z-10">
                                    <p onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-xl border-black border-3">Log out</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Hamburger Icon for Mobile */}
                <div className="md:hidden">
                    <Button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </Button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden flex flex-col gap-4 mt-2">
                    <Link href="/" className="text-primary-100 hover:text-[#1E1EF6]">Take a survey</Link>
                    {isUser ? (
                        <>
                            <Link href="/dashboard" className="text-primary-100 hover:text-[#1E1EF6]">Dashboard</Link>
                            <p onClick={handleLogout} className="w-full text-left py-2 text-red-600 hover:bg-gray-100">Log out</p>
                        </>
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
