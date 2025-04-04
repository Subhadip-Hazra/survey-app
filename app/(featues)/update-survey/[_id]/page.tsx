"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DynamicFormBuilder } from "@/components/DynamicFormBuilder";
import { toast } from "sonner";

  

export default function EditSurveyPage() {
    const { _id } = useParams();
    const router = useRouter();
    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const res = await fetch(`https://survey-app-backend-h4ap.onrender.com/api/surveys/${_id}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch survey");
                }
                const data = await res.json();
                setSurvey(data);
            } catch (err) {
                console.error("Error fetching survey:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSurvey();
    }, [_id]);


    type UpdatedSurveyData = {
        [key: string]: string | number | boolean | object | null; // Replace with the actual structure of your survey data
    };

    const handleUpdate = async (updatedSurveyData: UpdatedSurveyData): Promise<void> => {
        try {
            const res = await fetch(`https://survey-app-backend-h4ap.onrender.com/api/surveys/${_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedSurveyData),
            });

            if (!res.ok) {
                throw new Error("Failed to update survey");
            }

            toast("Survey updated successfully!");
            router.push("/"); // Redirect
        } catch (err) {
            console.error("Error updating survey:", err);
            toast("Failed to update survey");
        }
    };


    if (loading) return <div>Loading...</div>;
    if (!survey) return <div>Survey not found</div>;

    return (
        <div className="md:p-8">
            <h1 className="text-2xl mb-4">Edit Survey</h1>
            <DynamicFormBuilder survey={survey} onSubmit={handleUpdate} />
        </div>
    );
}
