import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Check, KeyRound, ArrowLeft, ArrowRight, Sparkles, AlertCircle, CheckCircle2, Camera, Upload, Trash2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const SIGNUP_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  // Mode: 'signin' | 'signup' | 'forgot_email' | 'forgot_otp'
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot_email' | 'forgot_otp'>('signin');

  // Form Fields
  const [fullName, setFullName] = useState('Student Learner');
  const [email, setEmail] = useState('sagarn6363@gmail.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Forgot Password / OTP Fields
  const [forgotEmail, setForgotEmail] = useState('sagarn6363@gmail.com');
  const [otpCode, setOtpCode] = useState('');
  const [receivedOtp, setReceivedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status & Error
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Email validator
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle Sign In or Sign Up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (authMode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = authMode === 'signup' ? '/api/auth/register' : '/api/auth/login';
      const payload = authMode === 'signup' 
        ? { name: fullName, email, password, avatarUrl: avatarUrl || undefined } 
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      // Store token and user
      localStorage.setItem('coursestudio_token', data.token);
      localStorage.setItem('coursestudio_user', JSON.stringify(data.user));

      onLogin(data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password - Request OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!isValidEmail(forgotEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP.');
      }

      if (data.devOtp) {
        setReceivedOtp(data.devOtp);
      }

      setSuccessMsg(data.message || `A 6-digit verification code has been dispatched to ${forgotEmail}`);
      setAuthMode('forgot_otp');
    } catch (err: any) {
      setError(err.message || 'Error sending password reset OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify OTP & Reset Password
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit OTP code received.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          otp: otpCode.trim(),
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }

      setSuccessMsg('Password reset successful! You can now sign in with your new password.');
      setEmail(forgotEmail);
      setPassword(newPassword);
      setAuthMode('signin');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAFAFC]">
      {/* Left side: Hero Image with Dark Overlay Matching Screenshot 2 */}
      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen bg-slate-950 overflow-hidden items-end p-12 lg:p-16">
        <img
          src="/src/assets/images/auth_hero_studio_1794057965531.jpg"
          alt="Course Studio Learning Workspace"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />

        <div className="relative z-10 text-white max-w-lg">
          <div className="mb-6">
            <Logo size="lg" linkTo="/" />
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            Welcome to Course Studio 🚀
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-md mb-8">
            Generate customized courses, high-yield university exam summaries, and interactive video lessons with handwritten note evaluations.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full curriculum layout</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Integrated video lessons</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Handwritten answer evaluation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Email Authentication Card Matching Screenshot 2 */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 sm:p-10">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {authMode === 'signup'
                ? 'Sign Up to Course Studio'
                : authMode === 'forgot_email' || authMode === 'forgot_otp'
                ? 'Reset Password'
                : 'Sign In to Course Studio'}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5">
              {authMode === 'signup'
                ? 'Create your account to start generating courses'
                : authMode === 'forgot_email'
                ? 'Enter your registered email to receive a 6-digit verification code'
                : authMode === 'forgot_otp'
                ? `Enter the 6-digit code sent to ${forgotEmail}`
                : 'Welcome back! Please enter your credentials'}
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="p-3.5 mb-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 mb-4 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="font-semibold">{successMsg}</p>
            </div>
          )}

          {/* MODE 1 & 2: SIGN IN OR SIGN UP */}
          {(authMode === 'signin' || authMode === 'signup') && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <>
                  {/* Optional Profile Photo Upload */}
                  <div className="flex flex-col items-center justify-center pb-2 text-center">
                    <div className="relative group mb-2">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-[#8150E8] shadow-sm"
                        />
                      ) : (
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-sm bg-[#8150E8]"
                        >
                          {fullName.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-1.5 bg-[#8150E8] text-white rounded-full shadow-md hover:bg-[#6f3fd4] transition-colors"
                        title="Upload Photo"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#8150E8] bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Photo</span>
                      </button>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setAvatarUrl('')}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Or pick:</span>
                      {SIGNUP_AVATARS.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatarUrl(av)}
                          className={`rounded-full border transition-transform hover:scale-105 ${
                            avatarUrl === av ? 'border-[#8150E8] ring-2 ring-purple-200' : 'border-transparent'
                          }`}
                        >
                          <img src={av} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
                        </button>
                      ))}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFile}
                      className="hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="Full Name"
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#8150E8] transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#8150E8] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    PASSWORD
                  </label>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setSuccessMsg('');
                        setForgotEmail(email);
                        setAuthMode('forgot_email');
                      }}
                      className="text-xs font-semibold text-[#8150E8] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••"
                    className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#8150E8] transition-colors"
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#8150E8] transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3.5 px-4 text-sm font-bold text-white rounded-xl shadow-md transition-all hover:opacity-95 hover:shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: '#8150E8' }}
              >
                <span>{isLoading ? 'Processing...' : authMode === 'signup' ? 'Sign Up' : 'Sign In'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="mt-6 text-center text-xs text-slate-500">
                {authMode === 'signup' ? (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setAuthMode('signin');
                      }}
                      className="font-semibold text-[#8150E8] hover:underline ml-1"
                    >
                      Sign In
                    </button>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setAuthMode('signup');
                      }}
                      className="font-semibold text-[#8150E8] hover:underline ml-1"
                    >
                      Sign Up
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}

          {/* MODE 3: FORGOT PASSWORD - REQUEST OTP */}
          {authMode === 'forgot_email' && (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Enter Your Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#8150E8] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 text-xs font-semibold text-white rounded-xl shadow-sm transition-all hover:opacity-95 active:scale-95 disabled:opacity-50"
                style={{ backgroundColor: '#8150E8' }}
              >
                {isLoading ? 'Sending OTP...' : 'Send 6-Digit OTP'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setError('');
                  setAuthMode('signin');
                }}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </form>
          )}

          {/* MODE 4: FORGOT PASSWORD - VERIFY OTP & ENTER NEW PASSWORD */}
          {authMode === 'forgot_otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200/80 text-xs text-purple-900 leading-relaxed">
                <p className="font-semibold flex items-center gap-1.5 mb-1 text-[#8150E8]">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>OTP Dispatched</span>
                </p>
                <p className="text-[11px] text-slate-600">
                  A 6-digit verification code was dispatched to <strong>{forgotEmail}</strong>. Please check your inbox and spam folder.
                </p>
              </div>

              {/* Delivery Assist / Instant Auto-Fill for Testing & Resilience */}
              {receivedOtp && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dispatched Code: <strong className="font-mono tracking-widest">{receivedOtp}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCode(receivedOtp);
                      setError('');
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold text-white rounded-lg shadow-2xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                    style={{ backgroundColor: '#8150E8' }}
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  6-Digit OTP Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    required
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-2.5 text-base tracking-widest font-mono font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#8150E8] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#8150E8] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 text-xs font-semibold text-white rounded-xl shadow-sm transition-all hover:opacity-95 active:scale-95 disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: '#8150E8' }}
              >
                {isLoading ? 'Resetting Password...' : 'Verify OTP & Reset Password'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setError('');
                  setAuthMode('forgot_email');
                }}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mt-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Resend OTP / Change Email</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
