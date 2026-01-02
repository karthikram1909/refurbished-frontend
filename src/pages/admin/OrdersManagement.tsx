import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { Eye, CheckCircle, Truck, Package as PackageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { getAdminBookings, updateBookingStatus } from '@/lib/api';

export const OrdersManagement = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
        const data = await getAdminBookings();
        setOrders(data);
    } catch (error) {
        console.error("Failed to fetch orders", error);
        toast({ title: 'Error', description: 'Failed to fetch orders', variant: 'destructive' });
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
        await updateBookingStatus(orderId, newStatus);
        toast({
          title: 'Status Updated',
          description: `Order ${orderId.slice(-6)} has been marked as ${newStatus}`,
        });
        fetchOrders();
        // If updating the currently viewed order's status
        if (selectedOrder && selectedOrder._id === orderId) {
             setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
    } catch (error) {
        console.error("Failed to update status", error);
        toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const getStatusActions = (status: string) => {
    switch (status) {
      case 'Pending':
        return ['Accepted', 'Delivered']; // Simplified for now as backend enum is Pending, Accepted, Delivered
      case 'Accepted':
        return ['Delivered'];
      case 'Delivered':
        return [];
      default:
        return [];
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Accepted">Accepted</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{order._id.slice(-6)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.clientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.clientNumber}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{order.phone?.brand} {order.phone?.name}</TableCell>
                  <TableCell className="font-semibold">
                    ₹{(order.phone?.price || 0).toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell>
                    {new Date(order.date).toLocaleDateString('en-IN')}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {order.status === 'Pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(order._id, 'Accepted')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                      )}
                      {order.status === 'Accepted' && (
                           <Button
                              size="sm"
                              onClick={() => handleStatusChange(order._id, 'Delivered')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <PackageIcon className="w-4 h-4 mr-1" />
                              Deliver
                            </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No orders found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                  <p className="font-semibold text-lg">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Customer Name
                  </p>
                  <p className="font-medium">{selectedOrder.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Mobile Number
                  </p>
                  <p className="font-medium">{selectedOrder.clientNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Order Date
                  </p>
                  <p className="font-medium">
                    {new Date(selectedOrder.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Amount
                  </p>
                  <p className="font-bold text-xl text-green-600">
                    ₹{(selectedOrder.phone?.price || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Ordered Item</h3>
                 {selectedOrder.phone && (
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {selectedOrder.phone.image && (
                              <img
                                src={selectedOrder.phone.image}
                                alt={selectedOrder.phone.name}
                                className="w-full h-full object-cover"
                              />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">
                            {selectedOrder.phone.brand} {selectedOrder.phone.name}
                          </h4>
                        </div>
                      </div>
                 )}
              </div>

              {getStatusActions(selectedOrder.status).length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">Update Order Status</h3>
                  <div className="flex gap-2">
                    {getStatusActions(selectedOrder.status).map((action) => {
                      let icon;
                      let className = '';
                      switch (action) {
                        case 'Accepted':
                          icon = <CheckCircle className="w-4 h-4 mr-2" />;
                          className = 'bg-blue-600 hover:bg-blue-700';
                          break;
                        case 'Delivered':
                          icon = <PackageIcon className="w-4 h-4 mr-2" />;
                          className = 'bg-green-600 hover:bg-green-700';
                          break;
                      }
                      return (
                        <Button
                          key={action}
                          onClick={() => {
                            handleStatusChange(
                              selectedOrder._id,
                              action
                            );
                            setSelectedOrder(null);
                          }}
                          className={className}
                        >
                          {icon}
                          Mark as {action}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
