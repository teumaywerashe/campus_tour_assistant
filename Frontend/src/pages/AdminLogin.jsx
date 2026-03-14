import axios from "axios";
import { useContext, useState } from "react";
import { storeContext } from "../context/StoreContext";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext"; // Imported theme hook
import toast from "react-hot-toast";

function AdminLogin() {
  const { adminLogin } = useContext(storeContext);
  const { darkMode } = useTheme(); // Extracted darkMode state

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const updateData = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const submitLogin = (e) => {
    e.preventDefault();
    adminLogin(data);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 px-6 py-28 selection:bg-[#646cff]/20 ${
      darkMode ? 'bg-slate-950' : 'bg-[#F9FAFB]'
    }`}>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className={`border rounded-[2rem] shadow-xl p-8 md:p-12 overflow-hidden transition-all duration-500 ${
          darkMode 
            ? 'bg-slate-900 border-slate-800 shadow-black/20' 
            : 'bg-white border-slate-200 shadow-slate-200/50'
        }`}>
          
          {/* Header Section */}
          <div className="text-center mb-10 px-2">
            <h1 className={`text-lg md:text-xl font-black tracking-tight mb-1 break-words leading-tight transition-colors ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Campus Tour <span className="text-[#646cff]">Assistant</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
              Your Best Assistant
            </p>
          </div>

          <h2 className={`text-[13px] font-bold mb-8 text-center uppercase tracking-[0.15em] opacity-70 transition-colors ${
            darkMode ? 'text-slate-300' : 'text-slate-800'
          }`}>
            Welcome Back
          </h2>

          <form onSubmit={submitLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={data.email}
                onChange={updateData}
                className={`w-full px-5 py-3.5 rounded-xl outline-none transition-all border ${
                  darkMode 
                    ? 'bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#646cff]' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#646cff] focus:ring-4 focus:ring-[#646cff]/5'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={data.password}
                onChange={updateData}
                className={`w-full px-5 py-3.5 rounded-xl outline-none transition-all border ${
                  darkMode 
                    ? 'bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#646cff]' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#646cff] focus:ring-4 focus:ring-[#646cff]/5'
                }`}
                required
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 bg-[#646cff] hover:bg-[#535bf2] text-white font-bold rounded-xl shadow-lg shadow-[#646cff]/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              Sign In
              <ChevronRight size={18} />
            </motion.button>
          </form>

          <p className="text-sm text-slate-400 text-center mt-8 font-medium">
            New Admin?{" "}
            <span onClick={()=>{
              toast.info('Feature not done for now')
            }} className="text-[#646cff] font-bold hover:underline cursor-pointer transition-all ml-1">
             Contact Admin
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;