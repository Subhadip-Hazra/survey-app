"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { socialLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import FeedbackCard from '@/components/FeedbackCard'

// Interfaces
interface Feedback {
  _id?: string;
  postedBy: string;
  profileImg?: string;
  ratings: number;
  feedback: string;
  postedDate: Date;
  isTechnicalIssue: boolean;
  topic: string;
}

interface UserData {
  name: string;
  email: string;
  profileImg: string;
  god_access: boolean;
}

const ContactUsPage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const storedEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Form Fields
  const [userFeedback, setUserFeedback] = useState<string>("");
  const [rating, setRating] = useState<number>(1);
  const [technicalIssue, setTechnicalIssue] = useState<boolean>(false);
  const [feedbackTopic, setFeedbackTopic] = useState<string>("");

  // Fetch Feedbacks
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('https://survey-app-backend-h4ap.onrender.com/api/feedback');
      if (!response.ok) {
        throw new Error('Failed to fetch feedbacks');
      }
      const data = await response.json();
      setFeedbacks(data.feedbacks);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch User Details
  const checkUser = async () => {
    try {
      if (storedEmail) {
        const res = await fetch(`https://survey-app-backend-h4ap.onrender.com/api/users?email=${storedEmail}`);
        const data = await res.json();

        if (data.exists) {
          setUserData(data.data);
        }
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  const submitFeedback = async () => {
    if (!storedEmail) {
      toast.error("Please log in to submit feedback");
      return;
    }
  
    if (!feedbackTopic || !userFeedback) {
      toast.error("Please fill in all fields");
      return;
    }
  
    const newFeedback: Feedback = {
      postedBy: userData?.name || 'Anonymous',
      profileImg: userData?.profileImg || 'https://placeholder.jpg',
      ratings: rating,
      feedback: userFeedback,
      postedDate: new Date(),
      isTechnicalIssue: technicalIssue,
      topic: feedbackTopic,
    };
  
    try {
      const res = await fetch('https://survey-app-backend-h4ap.onrender.com/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFeedback),
      });
  
      if (!res.ok) {
        throw new Error("Failed to submit feedback");
      }
  
      // Re-fetch all feedbacks
      await fetchFeedbacks();
  
      toast.success("Feedback submitted successfully!");
      setOpenDialog(false);
  
      // Reset form
      setUserFeedback("");
      setFeedbackTopic("");
      setRating(1);
      setTechnicalIssue(false);
  
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error submitting feedback");
    }
  };
  


  return (
    <>
      {/* Feedback Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog} modal={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Topic</Label>
              <Input value={feedbackTopic} onChange={(e) => setFeedbackTopic(e.target.value)} placeholder="Feedback topic" />
            </div>
            <div>
              <Label>Your Feedback</Label>
              <Input value={userFeedback} onChange={(e) => setUserFeedback(e.target.value)} placeholder="Your feedback" />
            </div>
            <div>
              <Label>Rate Us</Label>
              <Select value={rating.toString()} onValueChange={(value) => setRating(Number(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Rating" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={technicalIssue} onCheckedChange={setTechnicalIssue} />
              <Label>Facing any technical issues?</Label>
            </div>
            <Button onClick={submitFeedback}>
              Save Feedback
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Section */}
      <section className='flex flex-col gap-6 mt-8 min-h-screen'>
        <div className='flex flex-col md:flex-row justify-between'>
          <h2>All Feedbacks</h2>
          <Button onClick={() => {
            setOpenDialog(true);
            if (storedEmail) { checkUser(); }
          }
          } className='btn-primary'>Add Your Feedback</Button>
        </div>

        <div className='interviews-section'>
          {loading ? (
            <p>Loading feedbacks...</p>
          ) : feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <FeedbackCard
                key={feedback._id}
                {...feedback}
                postedDate={new Date(feedback.postedDate)}
              />
            ))
          ) : (
            <p>No feedbacks available.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <hr className='min-w-full border text-white' />
        <div className='flex flex-col md:flex-row justify-between'>
          <div className='flex flex-row gap-5 mt-2 md:my-4'>
            {socialLinks.map((social, key) => (
              <Link href={social.link} key={key} className="w-10 h-10 rounded-full">
                <Image src={social.iconUrl} alt={social.name} width={30} height={30} className='bg-white rounded-full w-10 h-10 border-white border-2' />
              </Link>
            ))}
          </div>
          <p className='md:mt-6 mt-2'>@2025 all copyrights reserved by Subhadip</p>
        </div>
      </footer>
    </>
  )
}

export default ContactUsPage;
