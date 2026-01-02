import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, ArrowLeft, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ClientLogin = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (name.trim() && mobile.trim()) {
        login({ name: name.trim(), mobile: mobile.trim(), type: 'client' });
        toast({
          title: 'Login Successful',
          description: `Welcome, ${name}!`,
        });
        navigate('/client/dashboard');
      } else {
        toast({
          title: 'Login Failed',
          description: 'Please fill in all fields',
          variant: 'destructive',
        });
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">

        <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-8 animate-in zoom-in-95 fade-in slide-in-from-bottom-6 duration-500">
          <div className="text-center mb-8">
            <div className="mx-auto bg-green-50 p-4 rounded-2xl w-20 h-20 flex items-center justify-center mb-6">
              <User className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Client Access
            </h1>
            <p className="text-gray-500 text-sm">
               Enter your details to start shopping for refurbished phones
            </p>
          </div>
          
            <form onSubmit={handleSubmit} className="space-y-5">
               <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500/20 h-11 rounded-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-gray-700 font-medium">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                   className="bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500/20 h-11 rounded-lg"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-11 rounded-lg shadow-sm transition-all"
                disabled={loading}
              >
                {loading ? 'Continuing...' : 'Continue'}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-4">
               <div className="inline-block px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium tracking-wide">
                     Quick Login: <span className="text-green-600">Enter name & mobile</span>
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
            <span>RefurbMart Client Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
