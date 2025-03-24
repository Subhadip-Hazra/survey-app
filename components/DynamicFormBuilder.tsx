"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

export default function UpdateSurveyPage() {
    const { _id } = useParams();
    const router = useRouter();

    interface Question {
        id: number;
        question: string;
        type: string;
        options: string[];
    }

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/surveys/${_id}`);
                const data = await res.json();
                if (data.questions) {
                    setQuestions(data.questions);
                }
            } catch (err) {
                console.error("Error fetching survey:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSurvey();
    }, [_id]);

    const handleQuestionChange = (index: number, key: keyof Question, value: string) => {
        const updated: Question[] = [...questions];
        updated[index][key] = value;
        setQuestions(updated);
    };

    const handleOptionChange = (qIdx: number, oIdx: number, value: string) => {
        const updated: Question[] = [...questions];
        updated[qIdx].options[oIdx] = value;
        setQuestions(updated);
    };

    const addOption = (index: number): void => {
        const updated: Question[] = [...questions];
        updated[index].options.push("");
        setQuestions(updated);
    };

    const addNewQuestion = () => {
        setQuestions(prev => [...prev, { id: Date.now(), question: "", type: "text", options: [] }]);
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/surveys/${_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ questions }),
            });

            if (res.ok) {
                toast("Survey updated!");
                router.push("/"); // Redirect to home or surveys list
            } else {
                toast("Failed to update survey");
            }
        } catch (err) {
            console.error("Error updating survey:", err);
            toast("Error updating survey");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-4">Update Survey</h1>

            {questions.map((q, idx) => (
                <div key={q.id} className="space-y-2 mb-4 border p-4 rounded-lg">
                    <Input
                        value={q.question}
                        placeholder="Enter question"
                        onChange={(e) => handleQuestionChange(idx, "question", e.target.value)}
                    />

                    <Select
                        onValueChange={(value) => handleQuestionChange(idx, "type", value)}
                        value={q.type}
                    >
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="options">Options</SelectItem>
                        </SelectContent>
                    </Select>

                    {q.type === "options" && (
                        <div className="space-y-2">
                            {q.options.map((opt, oIdx) => (
                                <Input
                                    key={oIdx}
                                    value={opt}
                                    placeholder={`Option ${oIdx + 1}`}
                                    onChange={(e) => handleOptionChange(idx, oIdx, e.target.value)}
                                />
                            ))}
                            <Button variant="outline" onClick={() => addOption(idx)}>Add Option</Button>
                        </div>
                    )}
                </div>
            ))}

            <Button onClick={addNewQuestion} className="mr-2">➕ Add Question</Button>
            <Button variant="outline" onClick={handleUpdate}>✅ Update Survey</Button>
        </div>
    );
}
