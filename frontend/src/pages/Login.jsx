import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Zap, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Radio, 
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

export const Login = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Cyber Lights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Subtle Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />

      <div className="w-full max-w-5xl bg-slate-950/80 border border-slate-800/90 rounded-3xl shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Side: Cyber-Industrial Hero Banner (7 cols) */}
        <div className="lg:col-span-7 p-8 lg:p-12 bg-gradient-to-br from-slate-950 via-slate-900/90 to-cyan-950/30 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
          
          <div className="relative z-10">
            {/* Logo Brand Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-xl shadow-cyan-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                  <Zap className="w-6 h-6 fill-current animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-wider text-white font-mono">
                  NEXUS<span className="text-cyan-400">FLOW</span>
                </h1>
                <p className="text-[10px] text-cyan-400/80 font-mono tracking-widest uppercase">
                  Visual IoT Telemetry & Rule Engine
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" /> INDUSTRIAL IOT CONTROL PLATFORM
              </span>

              <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Connect. Visualize. <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Automate Telemetry Rules.
                </span>
              </h2>

              <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                Drag-and-drop no-code rule builder powered by reactive RxJS streams, real-time Time-Series analytics, and instant WebSocket alerts.
              </p>
            </div>
          </div>

          {/* Interactive Live Telemetry Preview Card */}
          <div className="my-8 p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md shadow-xl relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  LIVE STREAM: TRB-001 (TURBINE)
                </span>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-800 font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                86.4°C CRITICAL
              </span>
            </div>

            {/* Glowing Telemetry Bars */}
            <div className="h-16 flex items-end gap-1.5 pt-2">
              {[42, 58, 52, 74, 82, 86, 78, 70, 84, 88, 76, 82, 86, 80].map((val, idx) => (
                <div key={idx} className="flex-1 bg-slate-950 rounded-t overflow-hidden flex items-end h-full">
                  <div
                    className={`w-full transition-all duration-500 ${
                      val > 80 ? 'bg-gradient-to-t from-rose-600 to-rose-400 shadow-sm shadow-rose-500' : 'bg-gradient-to-t from-cyan-600 to-cyan-400'
                    }`}
                    style={{ height: `${val}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="flex items-center gap-1 text-cyan-400">
                <Radio className="w-3 h-3" /> 5,240 Msg/Sec Stream
              </span>
              <span className="text-rose-400 font-bold">Rule Limit: 80.0°C</span>
            </div>
          </div>

          {/* Security Features */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 relative z-10">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>JWT Authentication</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Cpu className="w-4 h-4" />
              <span>RxJS Reactive Compiler</span>
            </div>
          </div>
        </div>

        {/* Right Side: High-Tech Login Form (5 cols) */}
        <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between bg-slate-950/60">
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-extrabold text-white tracking-tight">Welcome back</h3>
              <p className="text-xs text-slate-400 mt-1">Sign in to access your IoT control dashboard.</p>
            </div>

            {successMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-medium flex items-start gap-2 shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-medium flex items-start gap-2 shadow-lg">
                <Zap className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500/70" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300">PASSWORD</label>
                  <a href="#forgot" className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500/70" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs py-1">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-950"
                  />
                  Remember session (30 days)
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/45 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to Command Center'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-cyan-400 font-bold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
