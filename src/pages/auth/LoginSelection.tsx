import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Shield, User, Smartphone } from 'lucide-react';

export const LoginSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-pulse transition-all duration-[5000ms]"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-100/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 animate-pulse transition-all duration-[5000ms] delay-1000"></div>

      <div className="w-full max-w-5xl relative z-10">
        
        {/* Header Section with Animation */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center bg-white p-5 rounded-2xl mb-6 shadow-xl shadow-blue-900/5 ring-1 ring-black/5 transform transition-transform hover:scale-110 duration-300">
            <Smartphone className="w-12 h-12 text-blue-900" />
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Refurb<span className="text-blue-600">Mart</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            The premium destination for certified, quality-tested refurbished smartphones. Experience technology anew.
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-8 px-4">
          
          {/* Admin Card */}
          <div 
            className="group relative bg-white rounded-3xl p-1 shadow-2xl shadow-blue-900/5 hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-1 cursor-pointer animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-backwards"
            onClick={() => navigate('/admin/login')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="bg-white rounded-[20px] p-10 h-full border border-slate-100 group-hover:border-blue-100 transition-colors">
              <div className="flex flex-col h-full items-center text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">Admin Portal</h2>
                <p className="text-slate-500 mb-10 leading-relaxed">
                  Manage inventory, oversee orders, and control platform settings with enterprise-grade tools.
                </p>
                <div className="mt-auto w-full">
                    <Button 
                        className="w-full bg-slate-900 hover:bg-blue-600 text-white h-14 rounded-xl text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 group-hover:translate-y-0"
                    >
                        Access Dashboard
                    </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Client Card */}
          <div 
            className="group relative bg-white rounded-3xl p-1 shadow-2xl shadow-green-900/5 hover:shadow-green-900/10 transition-all duration-500 hover:-translate-y-1 cursor-pointer animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-backwards"
            onClick={() => navigate('/client/login')}
          >
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="bg-white rounded-[20px] p-10 h-full border border-slate-100 group-hover:border-green-100 transition-colors">
              <div className="flex flex-col h-full items-center text-center">
                <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <User className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-green-700 transition-colors">Client Experience</h2>
                <p className="text-slate-500 mb-10 leading-relaxed">
                   Explore our curated collection of premium refurbished devices at unbeatable value.
                </p>
                <div className="mt-auto w-full">
                    <Button 
                        className="w-full bg-white text-slate-900 border-2 border-slate-200 hover:border-green-600 hover:text-green-600 h-14 rounded-xl text-lg font-medium transition-all duration-300 shadow-sm hover:shadow-green-500/10"
                    >
                        Start Shopping
                    </Button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-16 animate-in fade-in duration-1000 delay-500">
            <p className="text-sm text-slate-400 font-medium">© 2026 RefurbMart. Excellence in every device.</p>
        </div>
      </div>
    </div>
  );
};
