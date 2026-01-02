import { Phone } from '@/mockData/data';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

interface PhoneCardProps {
  phone: Phone;
}

export const PhoneCard = ({ phone }: PhoneCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(phone);
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/client/phone/${phone.id}`)}
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={phone.image}
          alt={`${phone.brand} ${phone.model}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-1">
              {phone.brand} {phone.model}
            </h3>
            <p className="text-sm text-muted-foreground">
              {phone.storage} | {phone.ram} RAM
            </p>
          </div>
          <StatusBadge status={phone.condition} />
        </div>
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-2xl font-bold text-green-600">
            ₹{phone.price.toLocaleString('en-IN')}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            ₹{phone.originalPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {phone.warranty} Warranty
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={phone.stock === 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {phone.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};
