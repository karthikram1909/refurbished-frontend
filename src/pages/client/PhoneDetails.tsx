import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { PhoneCard } from '@/components/PhoneCard';
import {
  ShoppingCart,
  ArrowLeft,
  Shield,
  Truck,
  RefreshCw,
  Check,
} from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { getPhones, getPhone } from '@/lib/api';
import { BASE_URL } from '@/lib/config';
import { Phone } from '@/mockData/data';

    // Helper to map backend data to frontend Phone interface
    const mapPhoneData = (p: any): Phone => ({
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
    });

export const PhoneDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [phone, setPhone] = useState<Phone | null>(null);
  const [recommendedPhones, setRecommendedPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            if (!id) return;

            // 1. Fetch current phone details
            const phoneData = await getPhone(id);
            const mappedPhone = mapPhoneData(phoneData);
            setPhone(mappedPhone);

            // 2. Fetch recommendations (fetch a few more to ensure we have enough after filtering)
            const recResponse = await getPhones(1, 8);
            const recData = recResponse.phones ? recResponse.phones : recResponse;
            
            if (Array.isArray(recData)) {
                let recs = recData
                    .map(mapPhoneData)
                    .filter((p) => p.id !== id) // Exclude current phone
                    .slice(0, 4); // Take top 4
                setRecommendedPhones(recs);
            }

        } catch (error) {
            console.error("Failed to fetch phone details", error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchData();
    // Reset selected image when ID changes
    setSelectedImage(0);
    // Scroll to top
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading details...</div>;

  if (!phone) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Phone not found</h2>
        <Button onClick={() => navigate('/client/phones')}>
          Browse All Phones
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(phone);
    toast({
      title: 'Added to cart',
      description: `${phone.brand} ${phone.model} has been added to your cart`,
    });
  };

  const features = [
    {
      icon: Shield,
      title: `${phone.warranty} Warranty`,
      description: 'Full warranty coverage included',
    },
    {
      icon: RefreshCw,
      title: 'Quality Tested',
      description: 'Professionally refurbished',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Free shipping on this item',
    },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        <div className="space-y-4">
          <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
            <CardContent className="p-0">
              <div className="aspect-square bg-white flex items-center justify-center">
                <img
                  src={phone.images[selectedImage]}
                  alt={`${phone.brand} ${phone.model}`}
                  className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-4 gap-4">
            {phone.images.map((image, index) => (
              <Card
                key={index}
                className={`overflow-hidden cursor-pointer transition-all border-2 rounded-xl ${
                  selectedImage === index ? 'border-green-600 ring-2 ring-green-100' : 'border-transparent hover:border-gray-200'
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <CardContent className="p-2">
                  <div className="aspect-square bg-white flex items-center justify-center">
                    <img
                      src={image}
                      alt={`${phone.brand} ${phone.model} - ${index + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 text-gray-900">
                {phone.brand} {phone.model}
              </h1>
              <p className="text-xl text-gray-500">
                {phone.storage} | {phone.ram} RAM
              </p>
            </div>
            <StatusBadge status={phone.condition} />
          </div>

          <div className="mb-8 p-6 bg-green-50/50 rounded-2xl border border-green-100">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-5xl font-bold text-green-700">
                ₹{phone.price.toLocaleString('en-IN')}
              </span>
              <span className="text-2xl text-gray-400 line-through">
                ₹{phone.originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-green-600 font-medium flex items-center gap-2">
               <span className="bg-green-100 px-2 py-1 rounded text-sm font-bold">
                  {Math.round(((phone.originalPrice - phone.price) / phone.originalPrice) * 100)}% OFF
               </span>
               <span className="text-sm">
                  You save ₹{(phone.originalPrice - phone.price).toLocaleString('en-IN')}
               </span>
            </p>
          </div>

          {phone.stock > 0 ? (
            <div className="flex items-center gap-2 mb-8 text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                {phone.stock} units in stock
            </div>
          ) : (
            <p className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium mb-8">Out of Stock</p>
          )}

          <div className="flex gap-4 mb-10">
            <Button
              onClick={handleAddToCart}
              disabled={phone.stock === 0}
              className="flex-1 h-14 text-lg bg-slate-900 hover:bg-slate-800 rounded-xl"
            >
              <ShoppingCart className="w-5 h-5 mr-3" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleAddToCart();
                navigate('/client/cart');
              }}
              disabled={phone.stock === 0}
              className="flex-1 h-14 text-lg border-2 border-slate-200 rounded-xl hover:bg-slate-50"
            >
              Buy Now
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="bg-green-50 p-3 rounded-full w-fit mx-auto mb-3">
                    <feature.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">{feature.title}</p>
                  <p className="text-xs text-gray-500">
                    {feature.description}
                  </p>
              </div>
            ))}
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Technical Specifications</h2>
              <div className="space-y-4">
                {Object.entries(phone.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Quality Promise</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{phone.conditionDetails}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Check className="w-3 h-3 text-green-700" />
                  </div>
                  <span>Fully functional and 52-point quality tested</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="bg-green-100 p-1 rounded-full">
                     <Check className="w-3 h-3 text-green-700" />
                  </div>
                  <span>100% Genuine parts guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                   <div className="bg-green-100 p-1 rounded-full">
                     <Check className="w-3 h-3 text-green-700" />
                   </div>
                  <span>RefurbMart Certified Quality Seal</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {recommendedPhones.length > 0 && (
          <div className="mt-24 pt-10 border-t border-gray-100">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Recommended For You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedPhones.map((recPhone) => (
                    <PhoneCard key={recPhone.id} phone={recPhone} />
                ))}
            </div>
          </div>
      )}
    </div>
  );
};
