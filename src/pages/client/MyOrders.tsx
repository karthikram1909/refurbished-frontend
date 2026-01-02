import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { Separator } from '@/components/ui/separator';
import { Package, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMyOrders } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const MyOrders = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
        if (user?.mobile) {
            try {
                const data = await getMyOrders(user.mobile);
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };
    fetchOrders();
  }, [user]);

  if (loading) return <div>Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="You haven't placed any orders. Start shopping to see your orders here."
          action={{
            label: 'Browse Phones',
            onClick: () => navigate('/client/phones'),
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const phone = order.phone || {}; // Populated phone
          return (
            <Card key={order._id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">Order #{order._id.slice(-6)}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Placed on{' '}
                      {new Date(order.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <div className="space-y-3 mb-4">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {phone.image ? (
                              <img
                                src={phone.image}
                                alt={phone.name}
                                className="w-full h-full object-cover"
                              />
                          ) : (
                              <div className="w-full h-full bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {phone.name || 'Unknown Phone'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {phone.brand}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">
                            ₹{(phone.price || 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-xl font-bold text-green-600">
                      ₹{(phone.price || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.date).toLocaleDateString(
                      'en-IN',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrder.clientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.clientNumber}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Item</h3>
                <div className="space-y-3">
                    {selectedOrder.phone && (
                      <div className="flex gap-3">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                           {selectedOrder.phone.image && (
                              <img
                                src={selectedOrder.phone.image}
                                alt={selectedOrder.phone.name}
                                className="w-full h-full object-cover"
                              />
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {selectedOrder.phone.name}
                          </p>
                           <p className="text-sm text-muted-foreground">
                            {selectedOrder.phone.brand}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ₹{(selectedOrder.phone.price).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
