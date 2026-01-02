import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'Pending' | 'Accepted' | 'Dispatched' | 'Delivered' | 'Excellent' | 'Good' | 'Fair';
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getVariantAndColor = () => {
    switch (status) {
      case 'Pending':
        return { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' };
      case 'Accepted':
        return { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' };
      case 'Dispatched':
        return { variant: 'secondary' as const, className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' };
      case 'Delivered':
        return { variant: 'secondary' as const, className: 'bg-green-100 text-green-800 hover:bg-green-100' };
      case 'Excellent':
        return { variant: 'secondary' as const, className: 'bg-green-100 text-green-800 hover:bg-green-100' };
      case 'Good':
        return { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' };
      case 'Fair':
        return { variant: 'secondary' as const, className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' };
      default:
        return { variant: 'secondary' as const, className: '' };
    }
  };

  const { variant, className } = getVariantAndColor();

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
};
