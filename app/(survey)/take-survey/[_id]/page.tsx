"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DynamicForm from "@/components/DynamicForm";

export default function FillSurvey() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [ data, setData ] = useState([]);

    const params = useParams();
    const { _id } = params;
    console.log(_id);

    useEffect(() => {
        async function fetchSurvey() {
            try {
                const res = await fetch(`https://survey-app-backend-h4ap.onrender.com/api/surveys/${_id}`);
                if (!res.ok) {
                    throw new Error("Survey not found!");
                }
                const data = await res.json();
                setData(data);
                setQuestions(data.questions || []);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred.");
                }
            } finally {
                setLoading(false);
            }
        }

        if (_id) fetchSurvey();
    }, [_id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-8">
            <h3 className="text-2xl mb-7">Fill Survey</h3>
            <h1 className="my-1">Survey Name: {data.surveyName || ""}</h1>
            { data.showPurpose && <p className="my-1 mb-6">Purpous: {data.surveyPurpose || ""}</p>}
                {questions.length > 0 ? (
                    <DynamicForm questions={questions} />
                ) : (
                    <p>No questions found for this survey!</p>
                )}
        </div>
    );
}
