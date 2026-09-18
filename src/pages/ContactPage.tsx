import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Sprout } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useApp();

  useEffect(() => {
    document.title = "Contact KisanSetu | Support & Agricultural Partnerships";
    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute("content", "Get in touch with the KisanSetu team for agricultural partnerships, FPO onboarding, bulk buyer support, or technical inquiries.");
    }
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (emailStr: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Full name is required.';
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address format.';
    }
    if (!subject.trim()) newErrors.subject = 'Subject is required.';
    if (!message.trim()) newErrors.message = 'Message is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // Simulate sending data to specified email address (support@kisansetu.in)
    const payload = {
      to: 'support@kisansetu.in',
      name,
      email,
      subject,
      message,
      submittedAt: new Date().toISOString(),
    };
    console.log('Contact form submitted and sent to support@kisansetu.in:', payload);

    setSubmitted(true);
    showToast('Your message has been successfully sent to support@kisansetu.in!');
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setSubmitted(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-center max-w-3xl mx-auto transition-colors">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-3.5 py-1 rounded-sm text-xs font-mono font-bold uppercase tracking-widest border border-indigo-200 dark:border-indigo-800">
            <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Get in Touch With Us</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Contact KisanSetu Support Desk
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Have questions about FPO aggregation, bulk procurement, or joining our AI marketplace? Send a message directly to our support team at <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">support@kisansetu.in</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <div className="bg-slate-900 dark:bg-slate-900 text-white p-8 rounded-3xl space-y-8 shadow-xl flex flex-col justify-between border dark:border-slate-800">
            <div className="space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-sm bg-indigo-600 flex items-center justify-center text-white font-bold">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xl tracking-tight">KisanSetu HQ</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Empowering smallholder farmers and FPOs with direct digital market access, AI price forecasting, and cold chain logistics.
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-800 text-xs font-mono">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Agricultural Technology Park, Nashik Corridor, Maharashtra 422306, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>support@kisansetu.in</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>+91 (0253) 2984-700</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-sm border border-slate-700 text-xs font-mono text-slate-300">
              <span className="text-indigo-400 font-bold block mb-1">OPERATING HOURS</span>
              Monday – Saturday: 8:00 AM – 7:00 PM IST
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            {submitted ? (
              <div className="py-12 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Message Sent Successfully!</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-bold text-slate-900 dark:text-white">{name}</span>. Your message has been successfully routed to <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">support@kisansetu.in</span>. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Send Us a Direct Inquiry</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-mono">All fields marked with an asterisk (*) are required.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rajesh Patil"
                      className={`w-full p-3.5 rounded-sm border ${
                        errors.name ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white'
                      } text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none`}
                    />
                    {errors.name && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ramesh@example.com"
                      className={`w-full p-3.5 rounded-sm border ${
                        errors.email ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white'
                      } text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none`}
                    />
                    {errors.email && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.email}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. FPO Bulk Aggregation Inquiry / Marketplace Support"
                    className={`w-full p-3.5 rounded-sm border ${
                      errors.subject ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white'
                    } text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none`}
                  />
                  {errors.subject && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry or partnership request in detail..."
                    className={`w-full p-3.5 rounded-sm border ${
                      errors.message ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white'
                    } text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:outline-none`}
                  />
                  {errors.message && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to support@kisansetu.in</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
