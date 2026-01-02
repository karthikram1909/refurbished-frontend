import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, ArrowLeft, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminLogin } from '@/lib/api';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (username && password) {
         // Call API
         const data = await adminLogin({ username, password });
         if (data.success) {
             localStorage.setItem('adminToken', data.token);
             login({ name: 'Admin', type: 'admin' });
             toast({
              title: 'Login Successful',
              description: 'Welcome back, Admin!',
            });
            navigate('/admin/dashboard');
         }
      }
    } catch (error) {
        toast({
          title: 'Login Failed',
          description: 'Invalid credentials',
          variant: 'destructive',
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">


        <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-8 animate-in zoom-in-95 fade-in slide-in-from-bottom-6 duration-500">
          <div className="text-center mb-8">
            <div className="mx-auto bg-blue-50 p-4 rounded-2xl w-20 h-20 flex items-center justify-center mb-6">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Admin Portal
            </h1>
            <p className="text-gray-500 text-sm">
              Please enter your credentials to continue
            </p>
          </div>
          
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20 h-11 rounded-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20 h-11 rounded-lg"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 rounded-lg shadow-sm transition-all"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-4">
               <div className="inline-block px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-mono tracking-wide">
                    DEMO: <span className="text-blue-600 font-medium">admin</span> / <span className="text-blue-600 font-medium">admin123</span>
                  </p>
               </div>
               
               <Button
                variant="ghost"
                className="w-full text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => navigate('/')}
               >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Selection
               </Button>
            </div>
        </div>

        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400 font-medium">
            <Smartphone className="w-4 h-4" />
            <span>RefurbMart Secure Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};
