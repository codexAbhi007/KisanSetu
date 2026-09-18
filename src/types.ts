export type UserRole = 'farmer' | 'shopkeeper' | 'consumer' | 'fpo' | 'bulk_buyer' | 'logistics_partner' | 'admin';

export type UserStatus = 'active' | 'pending_verification' | 'suspended';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  location: {
    state: string;
    district: string;
    villageOrCity: string;
    pincode: string;
  };
  farmOrBusinessDetails?: {
    farmName?: string;
    farmAreaAcres?: number;
    primaryCrops?: string[];
    businessName?: string;
    businessType?: string;
    vehicleType?: string;
    vehicleCapacityKg?: number;
    fpoRegistrationNumber?: string;
  };
  rating: number;
  verified: boolean;
  createdAt: string;
  enableLogistics?: boolean;
  enableBulkQuantity?: boolean;
  shardId?: string;
  partitionCluster?: number;
}

export type ProductCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Spices'
  | 'Oilseeds'
  | 'Dairy'
  | 'Organic'
  | 'Fresh Produce'
  | 'Staples'
  | 'Seasonal'
  | 'Bulk Produce';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  sellerId: string;
  sellerName: string;
  sellerType: 'farmer' | 'shopkeeper';
  fpoName?: string;
  location: string;
  quantityAvailableKg: number;
  pricePerKg: number;
  minOrderKg: number;
  harvestDate?: string;
  qualityGrade?: 'Grade A' | 'Grade B' | 'Grade C';
  farmingMethod?: 'Organic' | 'Traditional' | 'Good Agricultural Practices (GAP)';
  expectedDeliveryDate?: string;
  image: string;
  rating: number;
  verifiedSeller: boolean;
  aiSuggestedPriceMin: number;
  aiSuggestedPriceMax: number;
  description: string;
  bulkPricing?: { minKg: number; pricePerKg: number }[];
  purchasePrice?: number; // for shopkeepers
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'in_transit'
  | 'near_destination'
  | 'delivered'
  | 'cancelled'
  | 'disputed';

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerType: 'consumer' | 'shopkeeper' | 'bulk_buyer';
  sellerId: string;
  sellerName: string;
  sellerType: 'farmer' | 'shopkeeper';
  productId: string;
  productName: string;
  quantityKg: number;
  pricePerKg: number;
  subtotal: number;
  logisticsFee: number;
  platformFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'escrowed' | 'released' | 'refunded' | 'pending';
  deliveryAddress: string;
  assignedDriver?: {
    name: string;
    phone: string;
    vehicleId: string;
    rating: number;
  };
  tracking: {
    latitude: number;
    longitude: number;
    etaMinutes: number;
    distanceKm: number;
    progressPercent: number;
    simulated: boolean;
  };
  timeline: {
    title: string;
    timestamp: string;
    completed: boolean;
  }[];
  createdAt: string;
}

export interface DemandForecast {
  productId: string;
  productName: string;
  region: string;
  currentDemandKg: number;
  predictedDemandKg: number;
  confidenceScore: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  reason: string;
  historicalData: { date: string; demandKg: number }[];
  forecastData: { date: string; demandKg: number }[];
}

export interface PriceRecommendation {
  productId: string;
  productName: string;
  currentMarketPrice: number;
  recommendedMin: number;
  recommendedMax: number;
  confidence: number;
  reason: string;
  demandLevel: 'High' | 'Medium' | 'Low';
  bestSellingWindow: string;
}

export interface FPOAggregationPool {
  id: string;
  fpoName: string;
  productName: string;
  totalAggregatedKg: number;
  targetBuyerDemandKg: number;
  participatingFarmersCount: number;
  deadline: string;
  status: 'aggregating' | 'ready_for_dispatch' | 'dispatched';
  farmers: { name: string; quantityKg: number; village: string }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'ai' | 'price' | 'logistics' | 'system';
  timestamp: string;
  read: boolean;
}

export interface ReviewItem {
  id: string;
  targetId: string; // productId or sellerId
  targetType: 'product' | 'farmer' | 'shopkeeper';
  authorName: string;
  authorRole: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}
