import { useContext, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { storeContext } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface FeedbackData {
  email: string;
  subject: string;
  comment: string;
}

export default function Feedback() {
  const { url } = useContext(storeContext)!;
  const { darkMode } = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<FeedbackData>({ email: '', subject: '', comment: '' });

  const updateData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/feedback`, data);
      if (response.data.success) {
        setSubmitted(true);
      } else {
        toast.error('Feedback not sent');
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  const inputClass = `w-full px-4 py-3 text-sm rounded-xl border transition-all outline-none font-medium ${
    darkMode ? 'bg-white/5 border-white/10 focus:border-[#646cff]/50' : 'bg-slate-50 border-slate-200 focus:border-[#646cff]'
  }`;

  return (
    <div className={`min-h-screen flex items-center justify-center px-6 py-20 transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 ${darkMode ? 'bg-[#646cff]' : 'bg-[#646cff]/30'}`} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className={`backdrop-blur-xl rounded-[2rem] border p-8 md:p-9 shadow-2xl transition-all duration-500 ${darkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black tracking-tight mb-1">Campus <span className="text-[#646cff]">Feedback</span></h1>
            <p className={`text-[13px] font-medium opacity-60 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Help us improve your experience.</p>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <h2 className="text-2xl font-black mb-2 text-[#646cff]">Thank you!</h2>
                <p className="text-sm opacity-70 font-medium">Your feedback has been submitted.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-[#646cff] font-bold hover:underline transition-all">
                  Send another report
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase opacity-40 px-1">Subject</label>
                  <input value={data.subject} name="subject" onChange={updateData} type="text" placeholder="Short summary..." className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase opacity-40 px-1">Details</label>
                  <textarea required name="comment" value={data.comment} onChange={updateData} rows={3} placeholder="Describe your observations..."
                    className={`${inputClass} resize-none`} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase opacity-40 px-1">Email <span className="lowercase font-normal opacity-50">(optional)</span></label>
                  <input value={data.email} name="email" onChange={updateData} type="email" placeholder="you@campus.com" className={inputClass} />
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit"
                  className="w-full bg-[#646cff] text-white py-4 rounded-xl font-black text-sm shadow-lg shadow-[#646cff]/20 hover:bg-[#535bf2] transition-colors uppercase tracking-[0.15em]">
                  Submit Feedback
                </motion.button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
