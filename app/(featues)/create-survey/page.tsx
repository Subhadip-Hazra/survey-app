"use client";
import QuestionBuilder from "@/components/QuestionBuilder";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SurveyDetails {
    surveyName : string | "";
    surveyPurpose?:string | "";
    showPurpose?:boolean | false;
    postedBy:string | "annonymous@gmail.com";
    postedDate:Date;
    postedName : string | "annonymous";
}

interface UserData {
    name: string;
    email: string;
    god_access: boolean;
}


export default function CreateSurvey() {
    const router = useRouter();
    const [saveSurveyDetails, setSaveSurveyDetails ] = useState<SurveyDetails>();
    const [surveyName, setSurveyName] = useState("");
    const [surveyPurpose, setSurveyPurpose] = useState("");
    const [showPurpose, setShowPurpose] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    
    useEffect(() => {
        const checkUser = async () => {
            try {
                const storedEmail = localStorage.getItem("userEmail");
    
                if (storedEmail) {
                    const res = await fetch(`https://survey-app-backend-h4ap.onrender.com/api/users?email=${storedEmail}`);
                    const data = await res.json();
    
                    if (data.exists) {
                        setUserData(data.data);
                    } else {
                        router.push("/sign-up");
                    }
                } else {
                    router.push("/sign-up");
                }
            } catch (error) {
                console.error("Error checking user:", error);
                router.push("/sign-up");
            }
        };
        checkUser();
    },[router]);

    // Open modal on page load
    useEffect(() => {
        setOpenDialog(true);
    }, []);

    const addSurveyDetails = () => {
        if (!surveyName) return toast("Please enter survey name!");
        setOpenDialog(false);
        const newSurvey: SurveyDetails = {
            surveyName: surveyName,
            surveyPurpose:surveyPurpose,
            showPurpose:showPurpose,
            postedBy:userData?.email || "annomyous@gmail.com",
            postedName:userData?.name || "annonymous",
            postedDate: new Date(),
            // TODO:Add user
        }
        setSaveSurveyDetails(newSurvey);
        toast("Survey Info Saved!");
    }

    const handleSave = async (questions: Question[]) => {
        try {
            const response = await fetch("https://survey-app-backend-h4ap.onrender.com/api/surveys", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    surveyName: saveSurveyDetails?.surveyName,
                    surveyPurpose: saveSurveyDetails?.surveyPurpose,
                    showPurpose: saveSurveyDetails?.showPurpose,
                    postedBy:userData?.email,
                    postedName:userData?.name,
                    postedDate:saveSurveyDetails?.postedDate,
                    questions: questions.map((q) => ({
                        id: q.id,
                        question: q.question,
                        type: q.type,
                        options: q.options,
                        
                    }))
                }),
            });
    
            if (response.ok) {
                toast("Survey saved to DB");
                router.push("/dashboard");
            } else {
                toast("Failed to save survey");
            }
        } catch {
            toast("Error saving survey");
        }
    };
    

    return (
        <div className="md:p-8 p-2">
            <Dialog
                open={openDialog}
                onOpenChange={(value) => {
                    if (!surveyName ) {
                        toast("Please fill the survey details first!");
                        return;
                    }
                    setOpenDialog(value);
                }}
                modal={true}
            >
                <DialogContent
                    onInteractOutside={(e) => {
                        if (!surveyName) {
                            e.preventDefault();
                            toast("Complete the survey details to continue!");
                        }
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>Create Survey Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Survey Name</Label>
                            <Input value={surveyName} onChange={(e) => setSurveyName(e.target.value)} placeholder="Enter survey name" />
                        </div>
                        <div>
                            <Label>Survey Purpose</Label>
                            <Input value={surveyPurpose} onChange={(e) => setSurveyPurpose(e.target.value)} placeholder="Enter purpose" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch checked={showPurpose} onCheckedChange={setShowPurpose} />
                            <Label>Show purpose in survey?</Label>
                        </div>
                        <Button
                            onClick={addSurveyDetails}
                        >
                            Save & Start Adding Questions
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <h1 className="text-2xl mb-4">Create Survey</h1>
            <div className="mt-4 p-4 border rounded text-sm">
                <p><strong>Survey Name:</strong> {surveyName}</p>
                {showPurpose && <p><strong>Purpose:</strong> {surveyPurpose}</p>}
            </div>
            <QuestionBuilder onSave={handleSave} />
        </div>
    );
}
