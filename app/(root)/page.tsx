"use client";

import SurveyCard from '@/components/SurveyCard';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';


interface Survey {
    _id: string;
    surveyName: string;
    surveyImg: string;
    surveyPurpose?: string;
    showPurpose?: boolean;
    postedBy: string;
    postedDate: string;
}

const Page = () => {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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


    return (
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
    )
}

export default Page
