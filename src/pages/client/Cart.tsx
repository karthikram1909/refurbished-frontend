import { useNavigate } from 'react-router-dom';
import { placeOrder } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';

export const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, user, clearCart } = useApp();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.phone.price * item.quantity,
    0
  );
  const shipping = subtotal > 50000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleQuantityChange = (phoneId: string, newQuantity: number) => {
    const item = cart.find((i) => i.phone.id === phoneId);
    if (!item) return;

    if (newQuantity <= 0) {
      removeFromCart(phoneId);
    } else if (newQuantity <= item.phone.stock) {
      updateCartQuantity(phoneId, newQuantity);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) return;

    try {
        // Place an order for each item in the cart
        for (const item of cart) {
             if (!item.phone.id) {
                 continue;
             }
             
             // Check for mock IDs (which are short strings like "1", "2")
             // Real MongoIDs are 24 chars
             if (item.phone.id.length < 24) {
                 console.warn(`Skipping item with invalid/mock ID: ${item.phone.id}`);
                 // Optionally remove it from cart automatically or just skip
                 continue;
             }

             const mobile = user.mobile || 'N/A'; // Ensure mobile is string, though it should be required
             
             // Check if mobile is really missing
             if (!user.mobile) {
                  console.warn("User mobile is missing, using 'N/A' or prompting user might be better");
                  // You might want to show a toast here?
             }

             // We can loop for quantity if needed
             for(let i=0; i < item.quantity; i++) {
                 await placeOrder({
                    clientName: user.name,
                    clientNumber: mobile,
                    phoneId: item.phone.id
                 });
             }
        }
        
        clearCart();
        navigate('/client/orders');
    } catch (error) {
        console.error("Failed to place order", error);
    }
  };

  if (cart.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Add some phones to your cart to get started"
        action={{
          label: 'Browse Phones',
          onClick: () => navigate('/client/phones'),
        }}
      />
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.phone.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.phone.image}
                      alt={`${item.phone.brand} ${item.phone.model}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {item.phone.brand} {item.phone.model}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.phone.storage} | {item.phone.ram} RAM
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Condition: {item.phone.condition}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          ₹{item.phone.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() =>
                            handleQuantityChange(item.phone.id, item.quantity - 1)
                          }
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.phone.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-16 h-8 text-center"
                          min="1"
                          max={item.phone.stock}
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() =>
                            handleQuantityChange(item.phone.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.phone.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.phone.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                  <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs h-8">
                     Clear Cart
                  </Button>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)}{' '}
                    items)
                  </span>
                  <span className="font-medium">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shipping.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Free shipping on orders above ₹50,000
                  </p>
                )}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
              <Button
                onClick={handlePlaceOrder}
                className="w-full h-12 text-base bg-green-600 hover:bg-green-700"
              >
                Place Order
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/client/phones')}
                className="w-full mt-3"
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
