"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

interface Question {
    id: number;
    question: string;
    type: string;
    options: string[];
}

export default function QuestionBuilder({ onSave }: { onSave: (questions: Question[]) => void }) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [currentType, setCurrentType] = useState("text");
    const [currentOptions, setCurrentOptions] = useState<string[]>([]);
    const [optionCount, setOptionCount] = useState(0);

    // Add new question
    const addQuestion = () => {
        if (!currentQuestion.trim()) {
            return toast("Please enter a question!");
        }

        const newQuestion: Question = {
            id: Date.now(),
            question: currentQuestion,
            type: currentType,
            options: currentType === "options" ? currentOptions : [],
        };

        setQuestions((prev) => [...prev, newQuestion]);

        // Reset
        setCurrentQuestion("");
        setCurrentType("text");
        setCurrentOptions([]);
        setOptionCount(0);

        toast("Question Added!");
    };

    return (
        <div className="space-y-4 mb-4 border p-4 rounded-lg">
            {/* === Main Question Form === */}
            <Input
                placeholder="Enter your question"
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
            />

            <Select
                onValueChange={(value) => setCurrentType(value)}
                value={currentType}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="options">Options</SelectItem>
                </SelectContent>
            </Select>

            {currentType === "options" && (
                <div className="space-y-2">
                    <Input
                        placeholder="Number of options"
                        type="number"
                        value={optionCount || ""}
                        onChange={(e) => {
                            const count = parseInt(e.target.value) || 0;
                            setOptionCount(count);
                            setCurrentOptions(new Array(count).fill(""));
                        }}
                    />
                    {Array.from({ length: optionCount }).map((_, idx) => (
                        <Input
                            key={idx}
                            placeholder={`Option ${idx + 1}`}
                            value={currentOptions[idx] || ""}
                            onChange={(e) => {
                                const updated = [...currentOptions];
                                updated[idx] = e.target.value;
                                setCurrentOptions(updated);
                            }}
                        />
                    ))}
                </div>
            )}

            <Button onClick={addQuestion}>➕ Add Another Question</Button>

            <Button
                onClick={() => {
                    if (questions.length === 0) return toast("Add at least one question!");
                    onSave(questions);
                }}
                variant="outline"
            >
                ✅ Save Survey
            </Button>

            {/* === Preview Added Questions === */}
            {questions.length > 0 && (
                <div className="mt-6 space-y-4">
                    <h2 className="text-lg font-semibold">Preview Questions:</h2>
                    {questions.map((q, idx) => (
                        <div key={q.id} className="border p-4 rounded-md">
                            <p className="font-medium">{idx + 1}. {q.question}</p>
                            <p className="text-sm text-gray-600">Type: {q.type}</p>
                            {q.type === "options" && (
                                <ul className="list-disc pl-5 mt-2 text-sm">
                                    {q.options.map((opt, oIdx) => (
                                        <li key={oIdx}>{opt}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
