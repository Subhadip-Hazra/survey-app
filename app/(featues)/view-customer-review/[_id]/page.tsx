"use client"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SurveyResponse {
    _id: string;
    surveyId: string;
    answers: {
        [key: string]: any;
    };
    submittedAt: string;
}

const CustomerReviewPage = () => {
    const params = useParams();
    const { _id } = params;
    console.log(_id);
    const [response, setResponse] = useState<SurveyResponse | null>(null);

    useEffect(() => {
        if (_id) {
            fetch(`http://localhost:8000/api/survey-responses/response/${_id}`)
                .then((res) => res.json())
                .then((data) => setResponse(data))
                .catch((error) => console.error('Error fetching survey response:', error));
        }
    }, [_id]);

    if (!response) {
        console.log(response);
        return <p>Loading...</p>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-4">Customer Review</h1>
            <div className="space-y-2">
                {Object.entries(response.answers).map(([question, answer]) => (
                    <div key={question}>
                        <strong>{question.replace(/_/g, ' ')}:</strong> {answer}
                    </div>
                ))}
            </div>
            <p className="mt-4 text-gray-500">
                Submitted on: {new Date(response.submittedAt).toLocaleDateString()}
            </p>
        </div>
    );
};

export default CustomerReviewPage;
