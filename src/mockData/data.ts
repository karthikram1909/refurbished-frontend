export interface Phone {
  id: string;
  brand: string;
  model: string;
  storage: string;
  ram: string;
  condition: 'Excellent' | 'Good' | 'Fair';
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  stock: number;
  warranty: string;
  specifications: {
    display: string;
    processor: string;
    camera: string;
    battery: string;
    os: string;
  };
  conditionDetails: string;
}

export interface OrderItem {
  phoneId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  clientName: string;
  clientMobile: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Accepted' | 'Dispatched' | 'Delivered';
  date: string;
}

export const phones: Phone[] = [
  {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 13 Pro',
    storage: '256GB',
    ram: '6GB',
    condition: 'Excellent',
    price: 65999,
    originalPrice: 119900,
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
    ],
    stock: 5,
    warranty: '6 Months',
    specifications: {
      display: '6.1" Super Retina XDR',
      processor: 'A15 Bionic',
      camera: '12MP Triple Camera',
      battery: '3095 mAh',
      os: 'iOS 16',
    },
    conditionDetails: 'Minor scratches on the back. Screen is pristine. Battery health 92%.',
  },
  {
    id: '2',
    brand: 'Samsung',
    model: 'Galaxy S22 Ultra',
    storage: '512GB',
    ram: '12GB',
    condition: 'Excellent',
    price: 72999,
    originalPrice: 109999,
    image: 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg',
    images: [
      'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
    ],
    stock: 3,
    warranty: '6 Months',
    specifications: {
      display: '6.8" Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 1',
      camera: '108MP Quad Camera',
      battery: '5000 mAh',
      os: 'Android 13',
    },
    conditionDetails: 'Excellent condition. No visible wear. Battery health 95%.',
  },
  {
    id: '3',
    brand: 'Apple',
    model: 'iPhone 12',
    storage: '128GB',
    ram: '4GB',
    condition: 'Good',
    price: 42999,
    originalPrice: 79900,
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
    images: [
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
    ],
    stock: 8,
    warranty: '3 Months',
    specifications: {
      display: '6.1" Super Retina XDR',
      processor: 'A14 Bionic',
      camera: '12MP Dual Camera',
      battery: '2815 mAh',
      os: 'iOS 16',
    },
    conditionDetails: 'Some scratches on sides and back. Screen is good. Battery health 87%.',
  },
  {
    id: '4',
    brand: 'OnePlus',
    model: '9 Pro',
    storage: '256GB',
    ram: '12GB',
    condition: 'Excellent',
    price: 38999,
    originalPrice: 64999,
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
    images: [
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
    ],
    stock: 4,
    warranty: '6 Months',
    specifications: {
      display: '6.7" Fluid AMOLED',
      processor: 'Snapdragon 888',
      camera: '48MP Quad Camera',
      battery: '4500 mAh',
      os: 'OxygenOS 13',
    },
    conditionDetails: 'Like new condition. Minimal usage signs. Battery health 94%.',
  },
  {
    id: '5',
    brand: 'Samsung',
    model: 'Galaxy S21',
    storage: '128GB',
    ram: '8GB',
    condition: 'Good',
    price: 35999,
    originalPrice: 69999,
    image: 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg',
    images: [
      'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
    ],
    stock: 6,
    warranty: '3 Months',
    specifications: {
      display: '6.2" Dynamic AMOLED 2X',
      processor: 'Exynos 2100',
      camera: '64MP Triple Camera',
      battery: '4000 mAh',
      os: 'Android 13',
    },
    conditionDetails: 'Normal wear and tear. Some scratches. Battery health 88%.',
  },
  {
    id: '6',
    brand: 'Apple',
    model: 'iPhone 11',
    storage: '64GB',
    ram: '4GB',
    condition: 'Fair',
    price: 28999,
    originalPrice: 54900,
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
    ],
    stock: 10,
    warranty: '1 Month',
    specifications: {
      display: '6.1" Liquid Retina HD',
      processor: 'A13 Bionic',
      camera: '12MP Dual Camera',
      battery: '3110 mAh',
      os: 'iOS 16',
    },
    conditionDetails: 'Visible scratches on body and screen. Fully functional. Battery health 82%.',
  },
  {
    id: '7',
    brand: 'Google',
    model: 'Pixel 6 Pro',
    storage: '256GB',
    ram: '12GB',
    condition: 'Excellent',
    price: 44999,
    originalPrice: 84999,
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
    images: [
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
    ],
    stock: 3,
    warranty: '6 Months',
    specifications: {
      display: '6.7" LTPO OLED',
      processor: 'Google Tensor',
      camera: '50MP Triple Camera',
      battery: '5003 mAh',
      os: 'Android 14',
    },
    conditionDetails: 'Pristine condition. No visible defects. Battery health 96%.',
  },
  {
    id: '8',
    brand: 'Xiaomi',
    model: 'Mi 11 Ultra',
    storage: '256GB',
    ram: '12GB',
    condition: 'Good',
    price: 39999,
    originalPrice: 69999,
    image: 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg',
    images: [
      'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
    ],
    stock: 5,
    warranty: '3 Months',
    specifications: {
      display: '6.81" AMOLED',
      processor: 'Snapdragon 888',
      camera: '50MP Triple Camera',
      battery: '5000 mAh',
      os: 'MIUI 14',
    },
    conditionDetails: 'Good working condition. Minor scratches. Battery health 90%.',
  },
];

export const orders: Order[] = [
  {
    id: 'ORD-001',
    clientName: 'Rahul Sharma',
    clientMobile: '+91 98765 43210',
    items: [
      {
        phoneId: '1',
        quantity: 1,
        price: 65999,
      },
    ],
    total: 65999,
    status: 'Delivered',
    date: '2024-01-15',
  },
  {
    id: 'ORD-002',
    clientName: 'Priya Patel',
    clientMobile: '+91 98765 43211',
    items: [
      {
        phoneId: '3',
        quantity: 1,
        price: 42999,
      },
      {
        phoneId: '6',
        quantity: 1,
        price: 28999,
      },
    ],
    total: 71998,
    status: 'Dispatched',
    date: '2024-01-18',
  },
  {
    id: 'ORD-003',
    clientName: 'Amit Kumar',
    clientMobile: '+91 98765 43212',
    items: [
      {
        phoneId: '2',
        quantity: 1,
        price: 72999,
      },
    ],
    total: 72999,
    status: 'Accepted',
    date: '2024-01-20',
  },
  {
    id: 'ORD-004',
    clientName: 'Sneha Reddy',
    clientMobile: '+91 98765 43213',
    items: [
      {
        phoneId: '4',
        quantity: 1,
        price: 38999,
      },
    ],
    total: 38999,
    status: 'Pending',
    date: '2024-01-22',
  },
];
