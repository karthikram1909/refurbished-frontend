import React, { createContext, useContext, useState } from 'react';
import { Phone, Order, phones as initialPhones, orders as initialOrders } from '@/mockData/data';

interface CartItem {
  phone: Phone;
  quantity: number;
}

interface User {
  name: string;
  mobile?: string;
  type: 'admin' | 'client';
}

interface AppContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  phones: Phone[];
  orders: Order[];
  cart: CartItem[];
  addToCart: (phone: Phone) => void;
  removeFromCart: (phoneId: string) => void;
  updateCartQuantity: (phoneId: string, quantity: number) => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addPhone: (phone: Phone) => void;
  updatePhone: (phone: Phone) => void;
  deletePhone: (phoneId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [phones, setPhones] = useState<Phone[]>(initialPhones);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    if (user?.type === 'client') {
      setCart([]);
      localStorage.removeItem('cart');
    }
  };

  const addToCart = (phone: Phone) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.phone.id === phone.id);
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.phone.id === phone.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prevCart, { phone, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (phoneId: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.phone.id !== phoneId);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateCartQuantity = (phoneId: string, quantity: number) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item.phone.id === phoneId ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const addOrder = (order: Order) => {
    setOrders((prevOrders) => [order, ...prevOrders]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const addPhone = (phone: Phone) => {
    setPhones((prevPhones) => [...prevPhones, phone]);
  };

  const updatePhone = (updatedPhone: Phone) => {
    setPhones((prevPhones) =>
      prevPhones.map((phone) =>
        phone.id === updatedPhone.id ? updatedPhone : phone
      )
    );
  };

  const deletePhone = (phoneId: string) => {
    setPhones((prevPhones) => prevPhones.filter((phone) => phone.id !== phoneId));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        phones,
        orders,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addOrder,
        updateOrderStatus,
        addPhone,
        updatePhone,
        deletePhone,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
