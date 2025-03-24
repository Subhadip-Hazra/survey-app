"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DynamicForm({ questions }: { questions: any[] }) {
    const { handleSubmit, control} = useForm();
    const { _id } = useParams();
    const router = useRouter();

    const onSubmit = async (data: any) => {
        console.log("User Answers:", data);
    
        try {
            const response = await fetch("https://survey-app-backend-h4ap.onrender.com/api/survey-responses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    surveyId:_id,
                    answers: data
                })
            });
    
            if (response.ok) {
                toast("Survey Submitted Successfully!");
                router.push(`/take-survey/${_id}`);
            } else {
                const errorData = await response.json();
                toast(`Failed to submit survey: ${errorData.error || "Unknown error"}`);
                console.error("Error:", errorData);
            }
        } catch (error) {
            toast("Failed to submit survey. Server not reachable.");
            console.error("Fetch Error:", error);
        }
    };
    

    // Default Questions:
    const defaultQuestions = [
        { id: "username", question: "User Name", type: "text", placeholder: "Enter your name" },
        { id: "usertype", question: "Type of User (e.g., dealer)", type: "text", placeholder: "Dealer" },
        { id: "businessname", question: "Business Name", type: "text" },
        { id: "location", question: "Location of Business", type: "text" },
        { id: "dob", question: "Date of Birth", type: "date" },
        { id: "status", question: "Status", type: "options", options: ["Married", "Unmarried"] },
        {
            id: "experience", question: "Years of Experience in Cement Business", type: "options",
            options: ["Less than 1 year", "1-3 years", "4-7 years", "8+ years"]
        },
        {
            id: "businesstype", question: "Business Type", type: "options",
            options: ["Wholesale Dealer", "Retail Dealer", "Both Wholesale & Retail"]
        },
        {
            id: "registered", question: "Is your dealership registered with a cement brand?", type: "options",
            options: ["Yes", "No"]
        },
        {
            id: "othermaterials", question: "Do you deal with other construction materials apart from cement?", type: "options",
            options: ["Yes", "No"]
        }
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {defaultQuestions.map((q) => (
                <div key={q.id} className="space-y-2 mb-2 border p-4 rounded-lg">
                    <label className="font-medium my-3">{q.question}</label>
                    {q.type === "text" && (
                        <Controller
                            name={q.id}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <Input {...field} placeholder={q.placeholder || ""} />}
                        />
                    )}
                    {q.type === "date" && (
                        <Controller
                            name={q.id}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <Input type="date" {...field} />}
                        />
                    )}
                    {q.type === "options" && (
                        <Controller
                            name={q.id}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {q.options?.map((opt: string, id: number) => (
                                            <SelectItem key={id} value={opt}>{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    )}
                </div>
            ))}

            {/* Dynamic Questions */}
            {questions.map((q, idx) => (
                <div key={q.id} className="space-y-2 mb-2 border p-4 rounded-lg">
                    <label className="font-medium mb-3">{q.question}</label>
                    {q.type === "text" && (
                        <Controller
                            name={`question_${idx}`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <Input {...field} />}
                        />
                    )}
                    {q.type === "date" && (
                        <Controller
                            name={`question_${idx}`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <Input type="date" {...field} />}
                        />
                    )}
                    {q.type === "image" && (
                        <Controller
                            name={`question_${idx}`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <Input type="file" accept="image/*" {...field} />}
                        />
                    )}
                    {q.type === "pdf" && (
                        <Controller
                            name={`question_${idx}`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <Input type="file" accept="application/pdf" {...field} />}
                        />
                    )}
                    {q.type === "options" && (
                        <Controller
                            name={`question_${idx}`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {q.options.map((opt: string, id: number) => (
                                            <SelectItem key={id} value={opt}>{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    )}
                </div>
            ))}

            <Button type="submit">Submit Survey</Button>
        </form>
    );
}
