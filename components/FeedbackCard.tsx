import Image from 'next/image';

const FeedbackCard = ({ profileImg,postedBy,postedDate,feedback,ratings,topic,isTechnicalIssue }: Feedback) => {
    const formattedDate = new Date(postedDate).toLocaleDateString();
    
    return (
        <div className='card-border w-[360px] max-sm:w-full min-h-96'>
            <div className='card-interview'>
                <div>
                    <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
                        <p className='badge-text'>{isTechnicalIssue ? "Technical" : "Others"}</p>
                    </div>
                    <Image src={profileImg ? '/default-profile.png' :  profileImg || '/default-profile.img'} alt='cover-image' width={90} height={60} className='rounded-full object-fit size-[90px]'/>
                    <h3 className='mt-5 capitalize'>{topic}</h3>
                    <p className='line-clamp-2 mt-5'>
                        {feedback}
                    </p>
                </div>
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
                <div className='flex flex-row justify-between'>
                    {
                        Array.from({ length: ratings || 0 }).map((_, index) => (
                            <Image src='/star.png' alt='star' width={20} height={20} key={index} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default FeedbackCard