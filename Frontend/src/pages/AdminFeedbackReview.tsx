import { useContext, useEffect, useState } from 'react';
import { CheckCircle, Eye, MessageSquare, Trash2 } from 'lucide-react';
import axios from 'axios';
import { storeContext } from '../context/StoreContext';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

interface Feedback {
  id: number | string;
  email?: string;
  comment: string;
  created_at: string;
  status: string;
}

export default function AdminFeedbackReview() {
  const { url } = useContext(storeContext)!;
  const { darkMode } = useTheme();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const deleteFeedback = async (id: number | string) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/feedback/${id}`);
      if (response.data.success) {
        toast.success('deleted');
        getFeedbacks();
      } else {
        toast.error('Error upon deleting');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error');
    }
  };

  const getFeedbacks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/feedback`);
      if (response.data.success) {
        setFeedbacks(response.data.data);
      } else {
        toast.error('Error fetching the Feedback');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error');
    }
  };

  useEffect(() => { getFeedbacks(); }, []);

  const handleStatusChange = (id: number | string, newStatus: string) => {
    setFeedbacks(feedbacks.map((fb) => (fb.id === id ? { ...fb, status: newStatus } : fb)));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800';
      case 'resolved': return darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800';
      default: return darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 p-8 ${darkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Feedback Review</h1>

        <div className={`rounded-xl shadow-sm border overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className={`p-6 border-b ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>All Feedback Submissions</h2>
            <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'} mt-1`}>Review and manage user feedback</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-slate-800/50' : 'bg-gray-50'}>
                <tr>
                  {['User', 'Message', 'Date', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-gray-200'}`}>
                {feedbacks.map((feedback) => (
                  <tr key={feedback.id} className={`transition-colors ${darkMode ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{feedback.email || 'Anonymous'}</td>
                    <td className="px-6 py-4">
                      <div className={`text-sm max-w-xs truncate ${darkMode ? 'text-slate-300' : 'text-gray-900'}`}>{feedback.comment}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(feedback.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(feedback.status)}`}>{feedback.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-4">
                        <button onClick={() => handleStatusChange(feedback.id, 'reviewed')} className="text-blue-500 hover:text-blue-400 flex items-center gap-1 disabled:opacity-30"
                          disabled={feedback.status === 'reviewed' || feedback.status === 'resolved'}>
                          <Eye size={16} /> Review
                        </button>
                        <button onClick={() => handleStatusChange(feedback.id, 'resolved')} className="text-green-500 hover:text-green-400 flex items-center gap-1 disabled:opacity-30"
                          disabled={feedback.status === 'resolved'}>
                          <CheckCircle size={16} /> Resolve
                        </button>
                        <button onClick={() => deleteFeedback(feedback.id)} className="text-red-500 hover:text-red-400 flex items-center gap-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <MessageSquare className="h-8 w-8 text-blue-500" />, label: 'Total Feedback', value: feedbacks.length },
            { icon: <Eye className="h-8 w-8 text-yellow-500" />, label: 'Pending Review', value: feedbacks.filter((f) => f.status === 'pending').length },
            { icon: <CheckCircle className="h-8 w-8 text-green-500" />, label: 'Resolved', value: feedbacks.filter((f) => f.status === 'resolved').length },
          ].map((stat, i) => (
            <div key={i} className={`p-6 rounded-xl shadow-sm border transition-colors duration-500 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center">
                {stat.icon}
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{stat.label}</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
