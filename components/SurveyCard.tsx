import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface SurveyCardProps {
    _id: string;
    surveyName: string;
    surveyImg?: string | "";
    surveyPurpose?: string | "";
    showPurpose?: boolean | false;
    postedBy: string;
    postedDate: Date;
}

const SurveyCard: React.FC<SurveyCardProps> = ({
    _id,
    surveyName,
    surveyPurpose,
    surveyImg,
    postedBy,
    postedDate
}) => {
    const formattedDate = new Date(postedDate).toLocaleDateString();
    const pathname = usePathname();

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
                            <p className='capitalize'>{postedBy?.split(" ")[0] || "Anonymous"}</p>
                        </div>
                    </div>

                    {/* Purpose */}
                    <p className='mt-2'>{surveyPurpose?.substring(0, 50) || ""}</p>
                </div>

                {/* Buttons */}
                <div className='flex flex-row justify-between mt-5'>
                    {pathname === '/' ? (
                        <Link href={`/take-survey/${_id}`}>
                            <Button className='btn-primary'>
                                📝 Take a survey
                            </Button>
                        </Link>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SurveyCard;
