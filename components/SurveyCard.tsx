import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaShareAlt } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { LuClipboardCopy } from "react-icons/lu";
import { toast } from 'sonner';

interface SurveyCardProps {
    _id: string;
    surveyName: string;
    surveyImg?: string | "";
    surveyPurpose?: string | "";
    showPurpose?: boolean | false;
    postedBy: string;
    postedDate: Date;
    postedName?: string | "Anonymous";
}

const SurveyCard: React.FC<SurveyCardProps> = ({
    _id,
    surveyName,
    surveyPurpose,
    surveyImg,
    postedDate,
    postedName
}) => {
    const formattedDate = new Date(postedDate).toLocaleDateString();
    const pathname = usePathname();
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [shareDialog, setShareDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const surveyLink = `https://survey-app-h4ap.vercel.app/take-survey/${_id}`;

    // Copy survey link to clipboard
    const copyOnClipboard = async () => {
        try {
            await navigator.clipboard.writeText(surveyLink);
            toast.success("Survey link copied to clipboard!");
        } catch {
            toast.error("Failed to copy link!");
        }
    };

    // Delete survey function
    const deleteSurvey = async () => {
        try {
            setIsDeleting(true);
            const response = await fetch(`https://survey-app-backend-h4ap.onrender.com/api/surveys/${_id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete survey");
            }

            toast.success("Survey deleted successfully!");
            setDeleteDialog(false);
            // Optionally, refresh the page or update the state to remove the deleted survey
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className='card-border w-[360px] max-sm:w-full min-h-96'>
            <div className='card-interview'>
                <div>
                    {/* Badge */}
                    <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
                        <p className='badge-text'>Marketing</p>
                    </div>

                    {/* Survey Image */}
                    <Image
                        src={surveyImg || "/survey.png"}
                        alt='cover-image'
                        width={90}
                        height={60}
                        className='rounded-full object-fit size-[90px]'
                    />

                    {/* Survey Name */}
                    <h3 className='mt-5 capitalize'>{surveyName}</h3>

                    {/* Date & Posted By */}
                    <div className='flex flex-row gap-5 mt-3'>
                        <div className='flex flex-row gap-2'>
                            <Image src="/calendar.svg" alt='calendar' width={22} height={22} />
                            <p>{formattedDate}</p>
                        </div>
                        <div className='flex flex-row gap-2 items-center'>
                            <Image src="/profile-icon.png" alt='profile-icon' width={22} height={22} />
                            <p className='capitalize'>{postedName?.split(" ")[0] || "Anonymous"}</p>
                        </div>
                    </div>

                    {/* Purpose */}
                    <p className='mt-2'>{surveyPurpose?.substring(0, 50) || ""}</p>
                </div>

                {/* Buttons */}
                <div className='flex flex-row justify-between mt-5'>
                    {pathname === '/' ? (
                        <>
                            <Link href={`/take-survey/${_id}`}>
                                <Button className='btn-primary'>
                                    📝 Take a survey
                                </Button>
                            </Link>
                            <FaShareAlt onClick={() => setShareDialog(true)} className='w-5 h-5 mt-2 cursor-pointer' />
                        </>
                    ) : (
                        <>
                            <Link href={`/update-survey/${_id}`}>
                                <Button className='btn-primary'>
                                    ✏️ Edit survey
                                </Button>
                            </Link>
                            <Link href={`/show-result/${_id}`}>
                                <Button className='btn-primary'>
                                    👁️ View result
                                </Button>
                            </Link>
                            <MdOutlineDelete onClick={() => setDeleteDialog(true)} className='w-7 h-7 cursor-pointer' />
                        </>
                    )}
                </div>
            </div>

            {/* Share Dialog */}
            <Dialog open={shareDialog} onOpenChange={setShareDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Share Survey</DialogTitle>
                        <p>Share the link below for others to take the survey.</p>
                    </DialogHeader>
                    <div className='flex flex-row gap-2 justify-between'>
                        <Input defaultValue={surveyLink} readOnly />
                        <LuClipboardCopy className='w-8 h-8 cursor-pointer' onClick={copyOnClipboard} />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this survey?</DialogTitle>
                        <p>Please collect all results before deleting, as this action is irreversible.</p>
                    </DialogHeader>
                    <div className='flex flex-row gap-4 justify-center items-center'>
                        <Button className='btn-primary' onClick={deleteSurvey} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Yes, Delete"}
                        </Button>
                        <Button className='btn-secondary' onClick={() => setDeleteDialog(false)}>No, Cancel</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SurveyCard;
