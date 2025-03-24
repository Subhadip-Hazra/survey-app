import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';

const FeatureCard = ({ imgSrc, heading, subHeading, buttonTitle, buttonUrl }: Feature) => {
    return (
        <div className='card-border w-[360px] max-sm:w-full min-h-96'>
            <div className='card-interview'>
                <div>
                    <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
                        <p className='badge-text'>Beta</p>
                    </div>
                    <Image src={imgSrc} alt='cover-image' width={90} height={60} className='rounded-full object-fit size-[90px]'/>
                    <h3 className='mt-5 capitalize'>{heading}</h3>
                    <p className='line-clamp-2 mt-5'>
                        {subHeading}
                    </p>
                </div>
                <Link href={buttonUrl} className='flex flex-row justify-between'>
                    <Button className='btn-primary'>
                        { buttonTitle }
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default FeatureCard