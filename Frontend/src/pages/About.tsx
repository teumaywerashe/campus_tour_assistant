import { Users, Zap, Compass, Target, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function About() {
  const { darkMode } = useTheme();

  const team = [
    { name: 'Campus Services', role: 'Information Provider' },
    { name: 'Student Affairs', role: 'Content Verification' },
    { name: 'IT Department', role: 'Technical Support' },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as any } },
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
      <section className="relative pt-16 md:pt-20 pb-8 md:pb-10 overflow-hidden text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} variants={fadeInUp} className="max-w-7xl mx-auto px-6 relative z-10">
          <h1 className={`text-3xl md:text-6xl font-black tracking-tight mb-4 md:mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            About Campus <span className="text-[#646cff]">Tour Assistant</span>
          </h1>
          <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed opacity-80 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Your comprehensive guide to navigating and exploring our campus.
          </p>
        </motion.div>
      </section>

      <section className="py-8 md:py-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.7 }} className="text-center md:text-left">
              <h2 className={`text-3xl md:text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Our Mission</h2>
              <div className="h-1.5 w-16 bg-[#646cff] rounded-full mb-6 mx-auto md:mx-0" />
              <div className="space-y-4 text-sm md:text-base font-medium">
                <p className={darkMode ? 'text-slate-200' : 'text-slate-700'}>
                  We believe that every student and visitor should navigate campus with confidence.
                </p>
                <p className={`opacity-70 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Campus Tour Assistant bridges the gap between navigation and exploration.
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50, rotate: 2 }} whileInView={{ opacity: 1, x: 0, rotate: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.7 }} className="relative group">
              <div className={`relative rounded-3xl overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl border ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
                <img src="gate.jpg" alt="Campus" className="w-full h-[250px] md:h-[320px] object-cover" />
                <div className="absolute bottom-4 left-4">
                  <div className={`backdrop-blur-xl p-3 md:p-4 rounded-xl border ${darkMode ? 'bg-slate-900/80 border-white/20' : 'bg-white/90 border-slate-200 shadow-lg'}`}>
                    <div className="text-2xl md:text-3xl font-black text-[#646cff]">15+</div>
                    <div className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Campus Locations</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} variants={fadeInUp} className="text-center mb-8 md:mb-10">
            <h2 className={`text-2xl md:text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Platform Utility</h2>
            <p className={`text-sm md:text-base opacity-70 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Designed for the 5 Kilo Campus community</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: 'Efficiency', desc: 'Reduces time spent locating specific rooms or offices.', icon: <Zap className="text-amber-400" size={28} /> },
              { title: 'Orientation', desc: 'Eliminates navigational confusion via visual cues.', icon: <Compass className="text-rose-500" size={28} /> },
              { title: 'Precision', desc: 'Verified data ensures high-accuracy routing.', icon: <Target className="text-blue-500" size={28} /> },
            ].map((benefit, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}
                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center ${darkMode ? 'bg-slate-900/40 border-white/10 hover:border-[#646cff]/50' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}>
                <div className={`mb-4 p-3 rounded-full ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>{benefit.icon}</div>
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{benefit.title}</h3>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} variants={fadeInUp} className="text-center mb-8 md:mb-10">
            <h2 className={`text-2xl md:text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Our Partners</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false }} transition={{ delay: index * 0.1 }}
                className={`rounded-xl p-6 transition-all duration-300 border text-center ${darkMode ? 'bg-slate-900/20 border-white/5' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-md'}`}>
                <Users className="h-6 w-6 text-[#646cff] mx-auto mb-4" />
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{member.name}</h3>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-4 pb-16 md:pb-24">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.5 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto px-4 md:px-6">
          <div className={`relative group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border transition-all duration-500 overflow-hidden ${darkMode ? 'bg-slate-900/30 border-white/10 hover:border-[#646cff]/40 shadow-xl' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className={`text-xl md:text-2xl font-black tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Have a <span className="text-[#646cff]">suggestion?</span>
                </h2>
                <p className={`text-xs md:text-sm max-w-full md:max-w-[280px] leading-relaxed opacity-70 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Help us optimize the campus experience.
                </p>
              </div>
              <Link to="/feedback" className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${darkMode ? 'bg-white text-slate-950 hover:bg-[#646cff] hover:text-white' : 'bg-slate-950 text-white hover:bg-[#646cff]'}`}>
                <span>Give Feedback</span>
                <Mail size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
