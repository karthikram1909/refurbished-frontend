import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCard } from '@/components/PhoneCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Smartphone, Shield, Truck, RefreshCw } from 'lucide-react';
import { getPhones } from '@/lib/api';
import { BASE_URL } from '@/lib/config';
import { Phone } from '@/mockData/data';

export const ClientDashboard = () => {
  const navigate = useNavigate();
  const [latestPhones, setLatestPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPhones = async () => {
        try {
            // Fetch 8 phones (user requested 4-8)
            const response = await getPhones(1, 8);
            const data = response.phones ? response.phones : response;

             const mappedPhones: Phone[] = Array.isArray(data) ? data.map((p: any) => ({
                id: p._id,
                brand: p.brand || 'Unknown',
                model: p.name,
                storage: p.name.match(/\d+GB|\d+TB/i)?.[0] || '',
                ram: '',
                condition: 'Good',
                price: p.price,
                originalPrice: p.price,
                image: (p.image && !p.image.startsWith('http') && !p.image.startsWith('data:')) ? `${BASE_URL}${p.image}` : (p.image || '/placeholder.png'),
                images: [(p.image && !p.image.startsWith('http') && !p.image.startsWith('data:')) ? `${BASE_URL}${p.image}` : (p.image || '/placeholder.png')],
                stock: p.isSold ? 0 : 1,
                warranty: p.warranty || '',
                specifications: {
                    display: '',
                    processor: '',
                    camera: '',
                    battery: p.battery || '',
                    os: '',
                },
                conditionDetails: p.description || '',
            })) : [];
            // Slice to ensure we strictly show max 8 even if backend returns full list (if not restarted)
            setLatestPhones(mappedPhones.slice(0, 8));
        } catch (error) {
            console.error("Failed to fetch dashboard phones", error);
        } finally {
            setLoading(false);
        }
    };
    fetchLatestPhones();
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Warranty Included',
      description: 'Every phone comes with warranty protection',
    },
    {
      icon: RefreshCw,
      title: 'Quality Tested',
      description: 'Thoroughly inspected and refurbished',
    },
    {
      icon: Smartphone,
      title: 'Latest Models',
      description: 'Wide range of premium smartphones',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and secure shipping nationwide',
    },
  ];

  return (
    <div className="space-y-16 pb-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 mx-auto max-w-6xl px-6 py-12 md:py-20 rounded-3xl text-white shadow-2xl animate-in fade-in zoom-in-95 duration-700">
         {/* Abstract Decoration */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
         
         <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-green-300 backdrop-blur-md animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100 fill-mode-backwards">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Inventory Updated
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight animate-in slide-in-from-bottom-4 fade-in duration-700 delay-200 fill-mode-backwards">
                Premium Tech. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                    Smart Price.
                </span>
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300 fill-mode-backwards">
                Experience flagship performance for a fraction of the cost. Certified refurbished, warranty protected, and ready for you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-500 fill-mode-backwards">
                <Button
                    size="lg"
                    onClick={() => navigate('/client/phones')}
                    className="h-12 px-8 text-base bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-green-500/25 transition-all hover:scale-105"
                >
                    Browse Collection
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                 <Button
                    variant="outline"
                    size="lg"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                    className="h-12 px-8 text-base bg-white text-slate-900 border-white hover:bg-gray-100 rounded-full transition-all"
                >
                    Our Promise
                </Button>
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
              <feature.icon className="w-6 h-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* New Arrivals Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Fresh Arrivals</h2>
            <p className="text-slate-500 mt-2 text-lg">Just in: Hand-picked premium devices</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/client/phones')} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 group">
            View Full Inventory
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-[400px] bg-slate-100 rounded-3xl animate-pulse"></div>
                ))}
             </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestPhones.map((phone, i) => (
                <div key={phone.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards" style={{ animationDelay: `${i * 100}ms` }}>
                    <PhoneCard phone={phone} />
                </div>
            ))}
            </div>
        )}
      </section>

      {/* CTA Bottom Section */}
      <section className="relative overflow-hidden bg-slate-50 border border-slate-200 -mx-4 px-6 py-20 rounded-3xl text-center">
         <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Wait, there's more.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Join thousands of satisfied customers who made the smart switch to refurbished. Sustainable, affordable, and reliable.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/client/phones')}
              className="mt-4 h-12 px-8 bg-slate-900 text-white hover:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Start Shopping Now
            </Button>
         </div>
      </section>
    </div>
  );
};
