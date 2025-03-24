"use client"

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { downloadExcelFile } from '@/lib/excelUtils';

interface SurveyResponse {
    _id: string;
    surveyId: string;
    answers: {
        username: string;
        location: string;
        dob: string;
        [key: string]: string | number | boolean | null
    };
    submittedAt: string;
}

const SurveyResponsesPage = () => {
    const params = useParams();
    const { _id } = params;
    const surveyId = _id;
    const [responses, setResponses] = useState<SurveyResponse[]>([]);

    useEffect(() => {
        if (surveyId) {
            fetch(`https://survey-app-backend-h4ap.onrender.com/api/survey-responses/${surveyId}`)
                .then((res) => res.json())
                .then((data) => setResponses(data))
                .catch(() => console.error('Error fetching survey responses:'));
        }
    }, [surveyId]);

    const handleDownload = () => {
        downloadExcelFile(responses);
    };

    return (
        <div className="md:p-8 p-1">
            <div className='flex flex-col md:flex-row justify-between'>
            <h1 className="text-2xl mb-4">Survey Responses</h1>
            <Button className='btn-primary' onClick={handleDownload}>Export as Excel</Button>
            </div>
            {responses.length > 0 ? (
                <div className="space-y-4">
                    {responses.map((response) => (
                        <Link key={response._id} href={`/view-customer-review/${response._id}`}>
                            <div className="block p-4 border rounded hover:bg-gray-900">
                                <h2 className="text-xl font-semibold">{response.answers.username}</h2>
                                <div className='flex flex-row gap-3'>
                                <Image src="/location.png" alt='location' width={22} height={22} />
                                    
                                <p>{response.answers.location}</p>
                                </div>
                                <div className='flex flex-row gap-3'>
                                <Image src="/calendar.svg" alt='calendar' width={22} height={22} />
                                <p>{new Date(response.submittedAt).toLocaleDateString()}</p>
                                </div>
                                <span className="text-blue-500">View Details →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p>No responses found for this survey.</p>
            )}
        </div>
    );
};

export default SurveyResponsesPage;
