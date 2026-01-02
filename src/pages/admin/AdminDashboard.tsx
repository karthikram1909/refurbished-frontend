import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Package, Clock, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';

export const AdminDashboard = () => {
  const { phones, orders } = useApp();

  const totalPhones = phones.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

  const stats = [
    {
      title: 'Total Phones',
      value: totalPhones,
      icon: Smartphone,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: Package,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Delivered Orders',
      value: deliveredOrders,
      icon: CheckCircle2,
      color: 'bg-purple-500',
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your store.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.clientName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} item(s)
                    </p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-semibold">
                      ₹{order.total.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No orders yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">In Stock</span>
                <span className="font-semibold">
                  {phones.filter((p) => p.stock > 0).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Out of Stock</span>
                <span className="font-semibold">
                  {phones.filter((p) => p.stock === 0).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Low Stock ({"<"}5)</span>
                <span className="font-semibold">
                  {phones.filter((p) => p.stock > 0 && p.stock < 5).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-semibold">{pendingOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Accepted</span>
                <span className="font-semibold">
                  {orders.filter((o) => o.status === 'Accepted').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Dispatched</span>
                <span className="font-semibold">
                  {orders.filter((o) => o.status === 'Dispatched').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Delivered</span>
                <span className="font-semibold">{deliveredOrders}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
