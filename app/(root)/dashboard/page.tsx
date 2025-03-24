"use client"
import FeatureCard from '@/components/FeatureCard'
import SurveyCard from '@/components/SurveyCard'
import { Button } from '@/components/ui/button'
import { features, socialLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Survey {
    _id: string;
    surveyName: string;
    surveyImg: string;
    surveyPurpose?: string;
    showPurpose?: boolean;
    postedBy: string;
    postedDate: string;
}

interface UserData {
    name: string;
    email: string;
    god_access:boolean;
}

const Dashboard = () => {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isUser, setIsUser] = useState(false);
    const [userLoading, setUserLoading] = useState(true); // NEW
    
    const [userData, setUserData] = useState<UserData | null>(null);


    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await fetch('https://survey-app-backend-h4ap.onrender.com/api/surveys');
                if (!response.ok) {
                    throw new Error('Failed to fetch surveys');
                }
                const data = await response.json();
                setSurveys(data);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchSurveys();
    }, []);


    useEffect(() => {
        const checkUser = async () => {
            try {
                const storedEmail = localStorage.getItem("userEmail");
    
                if (storedEmail) {
                    const res = await fetch(`https://survey-app-backend-h4ap.onrender.com/api/users?email=${storedEmail}`);
                    const data = await res.json();
    
                    if (data.exists) {
                        setUserData(data.data);
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
            } finally {
                setUserLoading(false); // IMPORTANT
            }
        };
    
        checkUser();
    }, []);
    

    if (!userLoading && !isUser) {
        <h3>Welcome {userData?.name?.split(" ")[0] || "Buddy"}👋 </h3>
    }
    

    return (
        <>
        <h3>Welcome {userData?.name?.split(" ")[0] || "Buddy" || ""}👋 </h3>
        { userData?.god_access &&
            <section className='card-cta'>
                <div className='flex flex-col gap-6 max-w-lg'>
                    <h2>Add a friend to your app </h2>
                    <p className='text-lg'>
                        <span className='text-xl font-bold'>+</span> By adding people you can do your task easily
                    </p>
                    <Button asChild className='btn-primary max-sm:w-full' >
                        <Link href="/add-people">Add people</Link>
                    </Button>
                </div>
                <Image src="/profile-dummy.png" alt="profile-dummy" width={400} height={400} className='max-sm:hidden' />
            </section>
            }
            <section className='flex flex-col gap-6 mt-8'>
                <h2>All Surveys</h2>

                    <div className='interviews-section'>
                    {loading ? (
                        <p>Loading surveys...</p>
                    ) : surveys.length > 0 ? (
                        surveys.map((survey) => (
                            <SurveyCard
                                key={survey._id}
                                {...survey}
                                postedDate={new Date(survey.postedDate)}
                            />
                        ))
                    ) : (
                        <p>No surveys available.</p>
                    )}
                </div>
            </section>
            <section className='flex flex-col gap-6 mt-8'>
                <h2>All Features</h2>
                <div className='interviews-section'>
                    {features.map((feature) => (
                        <FeatureCard {...feature} key={feature.id} />
                    ))}
                </div>
            </section>
            <footer>
                <hr className='min-w-full border text-white'/>
                <div className='flex flex-col md:flex-row justify-between'>

                <div className='flex flex-row gap-5 mt-2 md:my-4'>
                    {
                        socialLinks.map((social,key) => (
                            <Link href={social.link} key={key} className="w-10 h-10 rounded-full">
                                <Image src={social.iconUrl} alt={social.name} width={30} height={30} className='bg-white rounded-full w-10 h-10 border-white border-2'/>
                            </Link>
                        ))
                    }
                </div>
                <p className='md:mt-6 mt-2'>@2025 all copyrights reserved by Subhadip</p>
                </div>
            </footer>
        </>
    )
}

export default Dashboard