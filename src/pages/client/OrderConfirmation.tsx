import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Package, Home, ArrowRight } from 'lucide-react';

export const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, phones } = useApp();

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Button onClick={() => navigate('/client/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  const orderItems = order.items.map((item) => ({
    ...item,
    phone: phones.find((p) => p.id === item.phoneId),
  }));

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-2 border-green-200 mb-6">
        <CardContent className="p-8 text-center">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground text-lg mb-4">
            Thank you for your purchase. Your order has been received.
          </p>
          <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-sm text-muted-foreground">Order ID:</span>
            <span className="text-lg font-bold">{order.id}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Customer Name</p>
              <p className="font-medium">{order.clientName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mobile Number</p>
              <p className="font-medium">{order.clientMobile}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">
                {new Date(order.date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium text-yellow-600">{order.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Ordered Items</h2>
          <div className="space-y-4">
            {orderItems.map((item, index) => {
              if (!item.phone) return null;
              return (
                <div key={index}>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.phone.image}
                        alt={`${item.phone.brand} ${item.phone.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {item.phone.brand} {item.phone.model}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.phone.storage} | {item.phone.ram} RAM
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  {index < orderItems.length - 1 && <Separator className="mt-4" />}
                </div>
              );
            })}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-green-600">
              ₹{order.total.toLocaleString('en-IN')}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="bg-blue-100 p-2 rounded-lg h-fit">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Order Confirmation</p>
                <p className="text-sm text-muted-foreground">
                  You'll receive an email confirmation shortly
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-blue-100 p-2 rounded-lg h-fit">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Processing</p>
                <p className="text-sm text-muted-foreground">
                  We'll prepare your order for shipping
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-blue-100 p-2 rounded-lg h-fit">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Delivery</p>
                <p className="text-sm text-muted-foreground">
                  Your order will be delivered within 5-7 business days
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={() => navigate('/client/orders')}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <Package className="w-4 h-4 mr-2" />
          Track Order
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/client/dashboard')}
          className="flex-1"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
