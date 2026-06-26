import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
        <span className="text-xl font-bold text-indigo-600 tracking-tight">📄 ResumeAI</span>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-slate-600 hover:text-slate-900 font-medium text-sm">Login</button>
          <button onClick={() => navigate('/register')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Get Started Free</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          ✨ AI-powered ATS analysis
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
          Get Expert Feedback on<br />
          your <span className="text-indigo-600">Resume</span>, instantly.
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
          Our AI scores your resume on key criteria recruiters look for. Get actionable steps to land more interviews.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition text-base shadow-lg shadow-indigo-200"
          >
            Analyze My Resume →
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-slate-600 hover:text-slate-900 font-medium px-6 py-3.5"
          >
            Sign in
          </button>
        </div>
      </section>

      {/* Mock Score Card */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm font-medium">ATS Analysis Result</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">Completed</span>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'ATS Score', value: '78', color: 'text-emerald-400' },
              { label: 'Keywords', value: '65', color: 'text-amber-400' },
              { label: 'Structure', value: '90', color: 'text-emerald-400' },
              { label: 'Skills', value: '55', color: 'text-rose-400' },
            ].map((item) => (
              <div key={item.label} className="bg-slate-800 rounded-xl p-4 text-center">
                <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-slate-400 text-xs mt-1">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-slate-300 text-sm font-medium mb-2">Top Suggestions</p>
            {['Add measurable achievements to work experience', 'Include React.js and Node.js keywords', 'Improve summary section with role-specific language'].map((s, i) => (
              <div key={i} className="flex items-start gap-2 mt-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span className="text-slate-400 text-sm">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Everything you need to get hired</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'ATS Score', desc: 'See exactly how your resume scores against applicant tracking systems used by top companies.' },
              { icon: '🔍', title: 'Keyword Analysis', desc: 'Find missing keywords recruiters search for and know exactly what to add.' },
              { icon: '💡', title: 'AI Suggestions', desc: 'Get specific, actionable improvements tailored to your target role.' },
            ].map((f) => (
              <div key={f.title} className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to improve your resume?</h2>
        <p className="text-slate-500 mb-8">Join thousands of job seekers getting more interviews.</p>
        <button
          onClick={() => navigate('/register')}
          className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
        >
          Get Started Free →
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 text-center text-slate-400 text-sm">
        © 2026 ResumeAI. Built with MERN + Groq AI.
      </footer>
    </div>
  );
}