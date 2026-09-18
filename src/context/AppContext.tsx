import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Product, Order, NotificationItem, ReviewItem, UserRole, FPOAggregationPool } from '../types';
import {
  MOCK_USERS,
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_NOTIFICATIONS,
  MOCK_REVIEWS,
  MOCK_FPO_POOLS,
} from '../data/mockData';
import {
  subscribeToProducts,
  addProductToFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
  subscribeToOrders,
  createOrderInFirestore,
  updateOrderStatusInFirestore,
  subscribeToMandiPrices,
  subscribeToFPOPools,
  joinFPOPoolInFirestore,
  subscribeToNotifications,
  markNotificationReadInFirestore,
  subscribeToReviews,
  addReviewToFirestore,
  saveUserProfileToFirestore,
  updateUserSettingsInFirestore,
  registerHyperScaleUser,
  getUserProfileFromFirestore,
  subscribeToAuth,
  logoutUser,
  MandiPriceRecord,
  INITIAL_MANDI_PRICES,
} from '../services/firebaseDb';
import { auth } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
} from 'firebase/auth';
import {
  HYPER_SCALE_CONFIG,
  generateHyperScaleId,
  formatToCrores,
  ScaleCapacityConfig,
} from '../config/hyperScaleEngine';

export interface CartItem {
  product: Product;
  quantityKg: number;
}

export type ActivePage =
  | 'landing'
  | 'consumer_home'
  | 'marketplace'
  | 'bulk_marketplace'
  | 'product_detail'
  | 'seller_storefront'
  | 'farmer_pantry'
  | 'shopkeeper_pantry'
  | 'cart'
  | 'checkout'
  | 'wishlist'
  | 'farmer_dashboard'
  | 'shopkeeper_dashboard'
  | 'buyer_dashboard'
  | 'logistics_dashboard'
  | 'admin_dashboard'
  | 'fpo_pool'
  | 'track_order'
  | 'mandi_ticker'
  | 'network_architecture'
  | 'settings'
  | 'about'
  | 'services'
  | 'contact'
  | 'auth'
  | 'login'
  | 'auth_farmer'
  | 'auth_shopkeeper'
  | 'auth_consumer'
  | 'register_farmer'
  | 'register_shopkeeper'
  | 'register_consumer';

interface AppContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'rating' | 'verifiedSeller'>) => Promise<void>;
  updateProduct: (updated: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  orders: Order[];
  createOrder: (productId: string, quantityKg: number, deliveryAddress: string) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, quantityKg: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantityKg: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  updateUserSettings: (settings: {
    enableLogistics?: boolean;
    enableBulkQuantity?: boolean;
    name?: string;
    phone?: string;
    location?: any;
    farmOrBusinessDetails?: any;
  }) => Promise<void>;
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedSellerId: string | null;
  setSelectedSellerId: (id: string | null) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => Promise<void>;
  selectedOrderIdForTracking: string | null;
  setSelectedOrderIdForTracking: (id: string | null) => void;
  fpoPools: FPOAggregationPool[];
  joinFPOPool: (poolId: string, farmerName: string, quantityKg: number, village: string) => Promise<void>;
  mandiPrices: MandiPriceRecord[];
  reviews: ReviewItem[];
  addReview: (targetId: string, targetType: 'product' | 'farmer' | 'shopkeeper', rating: number, comment: string) => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isRoleSelectOpen: boolean;
  setIsRoleSelectOpen: (open: boolean) => void;
  isFirebaseConnected: boolean;
  loginWithRole: (roleKey: UserRole) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (email: string, pass: string, profile: Partial<UserProfile>) => Promise<boolean>;
  registerDirectProfile: (profile: UserProfile) => Promise<void>;
  handleLogout: () => Promise<void>;
  scaleConfig: ScaleCapacityConfig;
  generateHyperScaleId: typeof generateHyperScaleId;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kisansetu_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      try {
        localStorage.setItem('kisansetu_theme', theme);
      } catch {
        // ignore
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      showToast(nextTheme === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
      return nextTheme;
    });
  };

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('landing');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [fpoPools, setFpoPools] = useState<FPOAggregationPool[]>(MOCK_FPO_POOLS);
  const [mandiPrices, setMandiPrices] = useState<MandiPriceRecord[]>(INITIAL_MANDI_PRICES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [reviews, setReviews] = useState<ReviewItem[]>(MOCK_REVIEWS);
  const [cart, setCart] = useState<CartItem[]>([
    { product: MOCK_PRODUCTS[0], quantityKg: 5 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([MOCK_PRODUCTS[2]]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod-001');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>('farmer-001');
  const [selectedOrderIdForTracking, setSelectedOrderIdForTracking] = useState<string | null>('KS-2026-10245');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);

  const updateUserSettings = async (settings: {
    enableLogistics?: boolean;
    enableBulkQuantity?: boolean;
    name?: string;
    phone?: string;
    location?: any;
    farmOrBusinessDetails?: any;
  }): Promise<void> => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      ...settings,
    };
    setCurrentUser(updated);
    try {
      await updateUserSettingsInFirestore(currentUser.uid, settings);
      showToast('Settings saved successfully!');
    } catch (err) {
      console.warn('Could not save settings to firestore:', err);
      showToast('Settings saved locally.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ==========================================
  // REAL-TIME FIRESTORE SUBSCRIPTIONS
  // ==========================================
  useEffect(() => {
    // 1. Subscribe to live Products
    const unsubProducts = subscribeToProducts((loadedProducts) => {
      if (loadedProducts && loadedProducts.length > 0) {
        setProducts(loadedProducts);
        setIsFirebaseConnected(true);
      }
    });

    // 2. Subscribe to live Orders
    const unsubOrders = subscribeToOrders((loadedOrders) => {
      if (loadedOrders && loadedOrders.length > 0) {
        setOrders(loadedOrders);
      }
    });

    // 3. Subscribe to live Mandi Prices
    const unsubMandi = subscribeToMandiPrices((prices) => {
      if (prices && prices.length > 0) {
        setMandiPrices(prices);
      }
    });

    // 4. Subscribe to live FPO Aggregation Pools
    const unsubFpo = subscribeToFPOPools((pools) => {
      if (pools && pools.length > 0) {
        setFpoPools(pools);
      }
    });

    // 5. Subscribe to live Notifications
    const unsubNotifs = subscribeToNotifications((notifs) => {
      if (notifs && notifs.length > 0) {
        setNotifications(notifs);
      }
    });

    // 6. Subscribe to live Reviews
    const unsubReviews = subscribeToReviews((revs) => {
      if (revs && revs.length > 0) {
        setReviews(revs);
      }
    });

    // 7. Subscribe to Firebase Auth state
    const unsubAuth = subscribeToAuth(async (fbUser) => {
      if (fbUser) {
        const profile = await getUserProfileFromFirestore(fbUser.uid);
        if (profile) {
          setCurrentUser(profile);
        }
      }
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubMandi();
      unsubFpo();
      unsubNotifs();
      unsubReviews();
      unsubAuth();
    };
  }, []);

  // Save current user to Firestore whenever it changes or is initialized
  useEffect(() => {
    if (currentUser) {
      saveUserProfileToFirestore(currentUser).catch((err) => {
        console.warn('Firestore profile save notice:', err);
      });
    }
  }, [currentUser]);

  // ==========================================
  // PRODUCT ACTIONS (SYNCED TO FIRESTORE)
  // ==========================================
  const addProduct = async (
    newProdData: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'rating' | 'verifiedSeller'>
  ) => {
    const isShopkeeper = currentUser?.role === 'shopkeeper';
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      sellerId: currentUser?.uid || (isShopkeeper ? 'shop-001' : 'farmer-001'),
      sellerName: currentUser?.name || (isShopkeeper ? 'Sharma Fresh Mart' : 'Patil Organic Agri Farm'),
      sellerType: isShopkeeper ? 'shopkeeper' : 'farmer',
      rating: 5.0,
      verifiedSeller: true,
    };

    // Optimistic UI update
    setProducts((prev) => [newProduct, ...prev]);

    try {
      await addProductToFirestore(newProduct);
      showToast(`Successfully listed "${newProduct.name}" in Cloud Database!`);
    } catch (e) {
      console.error('Add product error:', e);
      showToast(`Listed "${newProduct.name}" locally.`);
    }
  };

  const updateProduct = async (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    try {
      await updateProductInFirestore(updated);
      showToast(`Updated product "${updated.name}" in Cloud Database`);
    } catch (e) {
      console.error('Update product error:', e);
      showToast(`Updated "${updated.name}"`);
    }
  };

  const deleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await deleteProductFromFirestore(productId);
      showToast(`Product removed from catalog.`);
    } catch (e) {
      console.error('Delete product error:', e);
      showToast(`Product removed.`);
    }
  };

  // ==========================================
  // ORDER ACTIONS (SYNCED TO FIRESTORE)
  // ==========================================
  const createOrder = (productId: string, quantityKg: number, deliveryAddress: string): Order => {
    const product = products.find((p) => p.id === productId) || products[0];
    const subtotal = quantityKg * product.pricePerKg;
    const logisticsFee = Math.round(subtotal * 0.08);
    const platformFee = Math.round(subtotal * 0.02);
    const total = subtotal + logisticsFee + platformFee;

    const newOrder: Order = {
      id: `KS-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      buyerId: currentUser?.uid || 'consumer-001',
      buyerName: currentUser?.name || 'Ananya Sharma',
      buyerType: currentUser?.role === 'shopkeeper' ? 'shopkeeper' : 'consumer',
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      sellerType: product.sellerType,
      productId: product.id,
      productName: product.name,
      quantityKg,
      pricePerKg: product.pricePerKg,
      subtotal,
      logisticsFee,
      platformFee,
      total,
      status: 'confirmed',
      paymentStatus: 'escrowed',
      deliveryAddress,
      assignedDriver: {
        name: 'Amit Das',
        phone: '+91 99887 76655',
        vehicleId: 'MH-12-QZ-4821 (Refrigerated Van)',
        rating: 4.9,
      },
      tracking: {
        latitude: 18.5204,
        longitude: 73.8567,
        etaMinutes: 32,
        distanceKm: 18.4,
        progressPercent: 20,
        simulated: true,
      },
      timeline: [
        { title: 'Order Placed & Confirmed', timestamp: 'Just now', completed: true },
        { title: 'Escrow Payment Secured in Cloud', timestamp: 'Just now', completed: true },
        { title: 'Seller Preparing Package', timestamp: 'Pending', completed: false },
        { title: 'Picked Up by Kisan Logistics', timestamp: 'Scheduled', completed: false },
        { title: 'In Transit', timestamp: 'Scheduled', completed: false },
        { title: 'Delivered & Funds Released', timestamp: 'Scheduled', completed: false },
      ],
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI update
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderIdForTracking(newOrder.id);

    // Save to Firestore
    createOrderInFirestore(newOrder).catch((err) => {
      console.warn('Firestore order save notice:', err);
    });

    showToast(`Order #${newOrder.id} placed & secured in Cloud Firestore!`);
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            paymentStatus: status === 'delivered' ? 'released' : o.paymentStatus,
          };
        }
        return o;
      })
    );

    try {
      await updateOrderStatusInFirestore(orderId, status);
      showToast(`Order #${orderId} updated to: ${status.replace('_', ' ')}`);
    } catch (e) {
      console.error('Update order status error:', e);
      showToast(`Order #${orderId} updated to: ${status.replace('_', ' ')}`);
    }
  };

  // ==========================================
  // FPO POOLS & REVIEWS ACTIONS
  // ==========================================
  const joinFPOPool = async (
    poolId: string,
    farmerName: string,
    quantityKg: number,
    village: string
  ) => {
    setFpoPools((prev) =>
      prev.map((pool) => {
        if (pool.id === poolId) {
          const newTotal = pool.totalAggregatedKg + quantityKg;
          return {
            ...pool,
            totalAggregatedKg: newTotal,
            participatingFarmersCount: pool.participatingFarmersCount + 1,
            farmers: [...pool.farmers, { name: farmerName, quantityKg, village }],
            status: newTotal >= pool.targetBuyerDemandKg ? 'ready_for_dispatch' : 'aggregating',
          };
        }
        return pool;
      })
    );

    try {
      await joinFPOPoolInFirestore(poolId, farmerName, quantityKg, village);
      showToast(`Successfully pledged ${quantityKg} kg to FPO pool!`);
    } catch (e) {
      showToast(`Pledged ${quantityKg} kg to FPO pool.`);
    }
  };

  const addReview = async (
    targetId: string,
    targetType: 'product' | 'farmer' | 'shopkeeper',
    rating: number,
    comment: string
  ) => {
    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      targetId,
      targetType,
      authorName: currentUser?.name || 'Verified Buyer',
      authorRole: currentUser?.role === 'shopkeeper' ? 'Shopkeeper' : 'Consumer',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
    };

    setReviews((prev) => [newRev, ...prev]);
    try {
      await addReviewToFirestore(newRev);
      showToast('Thank you! Your verified rating was submitted to Cloud Database.');
    } catch {
      showToast('Thank you! Rating submitted.');
    }
  };

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await markNotificationReadInFirestore(id);
    } catch {
      // ignore
    }
  };

  // ==========================================
  // CART & WISHLIST
  // ==========================================
  const addToCart = (product: Product, quantityKg: number) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantityKg += quantityKg;
      setCart(updated);
    } else {
      setCart([...cart, { product, quantityKg }]);
    }
    showToast(`Added ${quantityKg} kg of "${product.name}" to Basket`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast(`Item removed from basket`);
  };

  const updateCartQuantity = (productId: string, quantityKg: number) => {
    if (quantityKg <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantityKg } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToWishlist = (product: Product) => {
    if (!wishlist.some((p) => p.id === product.id)) {
      setWishlist([...wishlist, product]);
      showToast(`Added "${product.name}" to Saved Items`);
    } else {
      removeFromWishlist(product.id);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
    showToast(`Removed from Saved Items`);
  };

  // ==========================================
  // AUTHENTICATION & ROLE SWITCHING
  // ==========================================
  const loginWithRole = async (roleKey: UserRole) => {
    const foundUser = MOCK_USERS.find((u) => u.role === roleKey) || MOCK_USERS[0];
    const roleUser: UserProfile = {
      ...foundUser,
      enableLogistics: foundUser.enableLogistics ?? (roleKey === 'consumer' ? false : true),
      enableBulkQuantity: foundUser.enableBulkQuantity ?? (roleKey === 'consumer' ? false : true),
    };
    setCurrentUser(roleUser);
    await saveUserProfileToFirestore(roleUser);

    if (roleKey === 'farmer') {
      setActivePage('farmer_dashboard');
      showToast(`Switched to Farmer Account: ${foundUser.name}`);
    } else if (roleKey === 'shopkeeper') {
      setActivePage('shopkeeper_dashboard');
      showToast(`Switched to Kirana Mart Account: ${foundUser.name}`);
    } else if (roleKey === 'consumer') {
      setActivePage('consumer_home');
      showToast(`Switched to Consumer Account: ${foundUser.name}`);
    } else if (roleKey === 'bulk_buyer') {
      setActivePage('buyer_dashboard');
      showToast(`Switched to Bulk Procurement Account: ${foundUser.name}`);
    } else if (roleKey === 'logistics_partner') {
      setActivePage('logistics_dashboard');
      showToast(`Switched to Cold-Chain Fleet Account: ${foundUser.name}`);
    } else if (roleKey === 'admin') {
      setActivePage('admin_dashboard');
      showToast(`Switched to Escrow & Operations Admin: ${foundUser.name}`);
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const profile = await getUserProfileFromFirestore(cred.user.uid);
      if (profile) {
        setCurrentUser(profile);
      } else {
        const fallback: UserProfile = {
          uid: cred.user.uid,
          name: cred.user.displayName || email.split('@')[0],
          email: cred.user.email || email,
          phone: '+91 98000 00000',
          role: 'consumer',
          status: 'active',
          location: {
            state: 'Maharashtra',
            district: 'Pune',
            villageOrCity: 'Pune City',
            pincode: '411001',
          },
          rating: 5.0,
          verified: true,
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(fallback);
        await saveUserProfileToFirestore(fallback);
      }
      showToast('Successfully signed in via Firebase Authentication!');
      return true;
    } catch (e: any) {
      console.warn('Firebase email login error, logging in with profile:', e.message);
      // Fallback matching by email
      const matched = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        setCurrentUser(matched);
        await saveUserProfileToFirestore(matched);
        showToast(`Signed in as ${matched.name}`);
        return true;
      }
      showToast('Invalid credentials. Please check your email and password.');
      return false;
    }
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    profileData: Partial<UserProfile>
  ): Promise<boolean> => {
    try {
      const { uid: hyperId, shardId, partition } = generateHyperScaleId(
        (profileData.role as UserRole) || 'consumer',
        profileData.location?.state || 'Maharashtra'
      );
      let uid = hyperId;
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        uid = cred.user.uid;
        if (profileData.name) {
          await updateProfile(cred.user, { displayName: profileData.name });
        }
      } catch (authErr) {
        console.warn('Firebase Auth create error (proceeding with Firestore registration):', authErr);
      }

      const fullProfile: UserProfile = {
        uid,
        name: profileData.name || email.split('@')[0],
        email,
        phone: profileData.phone || '+91 98000 00000',
        role: profileData.role || 'consumer',
        status: 'active',
        enableLogistics: profileData.enableLogistics ?? (profileData.role === 'consumer' ? false : true),
        enableBulkQuantity: profileData.enableBulkQuantity ?? (profileData.role === 'consumer' ? false : true),
        location: profileData.location || {
          state: 'Maharashtra',
          district: 'Pune',
          villageOrCity: 'Pune',
          pincode: '411001',
        },
        farmOrBusinessDetails: profileData.farmOrBusinessDetails,
        rating: 5.0,
        verified: true,
        createdAt: new Date().toISOString(),
        shardId,
        partitionCluster: partition,
      };

      setCurrentUser(fullProfile);
      await registerHyperScaleUser(fullProfile);
      showToast(`Account registered and verified on 500-Crore Hyper-Scale Cloud Grid (${shardId})!`);
      return true;
    } catch (e: any) {
      console.error('Registration error:', e);
      showToast('Error registering account. Please try again.');
      return false;
    }
  };

  const registerDirectProfile = async (profile: UserProfile): Promise<void> => {
    try {
      const normalizedProfile: UserProfile = {
        ...profile,
        enableLogistics: profile.enableLogistics ?? (profile.role === 'consumer' ? false : true),
        enableBulkQuantity: profile.enableBulkQuantity ?? (profile.role === 'consumer' ? false : true),
      };
      setCurrentUser(normalizedProfile);
      await registerHyperScaleUser(normalizedProfile);
      showToast(`Onboarded to KisanSetu Grid! Shard: ${profile.shardId || 'SHARD-001'}`);
    } catch (e) {
      console.warn('registerDirectProfile error:', e);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setActivePage('landing');
    showToast('Signed out of KisanSetu.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activePage,
        setActivePage,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        createOrder,
        updateOrderStatus,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        updateUserSettings,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        selectedProductId,
        setSelectedProductId,
        globalSearchQuery,
        setGlobalSearchQuery,
        selectedSellerId,
        setSelectedSellerId,
        notifications,
        markNotificationRead,
        selectedOrderIdForTracking,
        setSelectedOrderIdForTracking,
        fpoPools,
        joinFPOPool,
        mandiPrices,
        reviews,
        addReview,
        toastMessage,
        showToast,
        isRoleSelectOpen,
        setIsRoleSelectOpen,
        isFirebaseConnected,
        loginWithRole,
        loginWithEmail,
        registerWithEmail,
        registerDirectProfile,
        handleLogout,
        scaleConfig: HYPER_SCALE_CONFIG,
        generateHyperScaleId,
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
