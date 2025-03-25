"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface Question {
    id: string;
    question: string;
    type: "text" | "date" | "image" | "pdf" | "options";
    placeholder?: string;
    options?: string[];
}

export default function DynamicForm({ questions }: { questions: Question[] }) {
    const { handleSubmit, control, reset} = useForm();
    const { _id } = useParams();
    const router = useRouter();

    interface FormData {
        [key: string]: string | File | undefined;
    }

    const onSubmit = async (data: FormData) => {
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
                reset();
                router.push(`/`);
            } else {
                const errorData = await response.json();
                toast(`Failed to submit survey: ${errorData.error || "Unknown error"}`);
                console.error("Error:", errorData);
            }
        } catch {
            toast("Failed to submit survey. Server not reachable.");
            console.error("Fetch Error:");
        }
    };
    

    // Default Questions:
    const defaultQuestions = [
        { id: "username", question: "User Name", type: "text", placeholder: "Enter your name" },
        { id: "location", question: "Location of Business", type: "text" },
        { id: "dob", question: "Date of Birth", type: "date" },
        { id: "status", question: "Status", type: "options", options: ["Married", "Unmarried"] },
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {defaultQuestions.map((q) => (
                <div key={q.id} className="space-y-4 mb-2 border p-4 rounded-lg">
                    <label className="font-medium mb-3">{q.question}</label>
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
            {questions.map((q) => (
                <div key={q.id} className="space-y-6 mb-2 border p-4 rounded-lg">
                    <label className="font-medium mb-3">{q.question}</label>
                    {q.type === "text" && (
                        <Controller
                            name={q.question}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <Input {...field} />}
                        />
                    )}
                    {q.type === "date" && (
                        <Controller
                            name={q.question}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <Input type="date" {...field} />}
                        />
                    )}
                    {q.type === "image" && (
                        <Controller
                            name={q.question}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <Input type="file" accept="image/*" {...field} />}
                        />
                    )}
                    {q.type === "pdf" && (
                        <Controller
                            name={q.question}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <Input type="file" accept="application/pdf" {...field} />}
                        />
                    )}
                    {q.type === "options" && (
                        <Controller
                            name={q.question}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(q.options ?? []).map((opt: string, id: number) => (
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
