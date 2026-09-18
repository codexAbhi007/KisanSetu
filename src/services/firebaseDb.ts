import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import {
  Product,
  Order,
  UserProfile,
  FPOAggregationPool,
  NotificationItem,
  ReviewItem,
} from '../types';
import {
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_USERS,
  MOCK_FPO_POOLS,
  MOCK_NOTIFICATIONS,
  MOCK_REVIEWS,
} from '../data/mockData';

export interface MandiPriceRecord {
  id: string;
  commodity: string;
  mandi: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceDate: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export const INITIAL_MANDI_PRICES: MandiPriceRecord[] = [
  {
    id: 'mandi-1',
    commodity: 'Tomato (Grade A)',
    mandi: 'Nashik APMC',
    state: 'Maharashtra',
    minPrice: 22,
    maxPrice: 30,
    modalPrice: 26,
    priceDate: 'Today, 06:00 AM',
    trend: 'up',
    changePercent: 8.5,
  },
  {
    id: 'mandi-2',
    commodity: 'Nashik Red Onion',
    mandi: 'Lasalgaon Mandi',
    state: 'Maharashtra',
    minPrice: 28,
    maxPrice: 38,
    modalPrice: 32,
    priceDate: 'Today, 06:15 AM',
    trend: 'up',
    changePercent: 12.0,
  },
  {
    id: 'mandi-3',
    commodity: 'Sharbati Wheat',
    mandi: 'Indore Mandi',
    state: 'Madhya Pradesh',
    minPrice: 34,
    maxPrice: 42,
    modalPrice: 38,
    priceDate: 'Today, 05:45 AM',
    trend: 'stable',
    changePercent: 0.0,
  },
  {
    id: 'mandi-4',
    commodity: 'Nagpur Oranges',
    mandi: 'Nagpur APMC',
    state: 'Maharashtra',
    minPrice: 50,
    maxPrice: 75,
    modalPrice: 62,
    priceDate: 'Today, 07:00 AM',
    trend: 'down',
    changePercent: -4.2,
  },
  {
    id: 'mandi-5',
    commodity: 'Organic Ghee & Dairy',
    mandi: 'Pune APMC',
    state: 'Maharashtra',
    minPrice: 580,
    maxPrice: 720,
    modalPrice: 650,
    priceDate: 'Today, 07:30 AM',
    trend: 'stable',
    changePercent: 1.1,
  },
];

// ==========================================
// 1. PRODUCTS COLLECTION
// ==========================================

export const subscribeToProducts = (
  callback: (products: Product[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const productsCol = collection(db, 'products');

  return onSnapshot(
    productsCol,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial agricultural catalog to Firestore
        try {
          const batch = writeBatch(db);
          MOCK_PRODUCTS.forEach((prod) => {
            const docRef = doc(db, 'products', prod.id);
            batch.set(docRef, prod);
          });
          await batch.commit();
          callback(MOCK_PRODUCTS);
        } catch (e) {
          console.warn('Firestore products seeding error (using mock fallback):', e);
          callback(MOCK_PRODUCTS);
        }
      } else {
        const loaded: Product[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ ...docSnap.data(), id: docSnap.id } as Product);
        });
        callback(loaded);
      }
    },
    (error) => {
      console.error('Firestore products listener error:', error);
      if (onError) onError(error);
      callback(MOCK_PRODUCTS);
    }
  );
};

export const addProductToFirestore = async (product: Product): Promise<void> => {
  const docRef = doc(db, 'products', product.id);
  await setDoc(docRef, product);
};

export const updateProductInFirestore = async (product: Product): Promise<void> => {
  const docRef = doc(db, 'products', product.id);
  await setDoc(docRef, product, { merge: true });
};

export const deleteProductFromFirestore = async (productId: string): Promise<void> => {
  const docRef = doc(db, 'products', productId);
  await deleteDoc(docRef);
};

// ==========================================
// 2. ORDERS & ESCROW COLLECTION
// ==========================================

export const subscribeToOrders = (
  callback: (orders: Order[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const ordersCol = collection(db, 'orders');

  return onSnapshot(
    ordersCol,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          MOCK_ORDERS.forEach((ord) => {
            const docRef = doc(db, 'orders', ord.id);
            batch.set(docRef, ord);
          });
          await batch.commit();
          callback(MOCK_ORDERS);
        } catch (e) {
          console.warn('Firestore orders seeding error:', e);
          callback(MOCK_ORDERS);
        }
      } else {
        const loaded: Order[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ ...docSnap.data(), id: docSnap.id } as Order);
        });
        callback(loaded);
      }
    },
    (error) => {
      console.error('Firestore orders listener error:', error);
      if (onError) onError(error);
      callback(MOCK_ORDERS);
    }
  );
};

export const createOrderInFirestore = async (order: Order): Promise<void> => {
  const docRef = doc(db, 'orders', order.id);
  await setDoc(docRef, order);

  // Add real-time notification
  const notifId = `notif-${Date.now()}`;
  const notifRef = doc(db, 'notifications', notifId);
  await setDoc(notifRef, {
    id: notifId,
    title: 'New Order Placed & Escrow Funded',
    message: `Order #${order.id} for ${order.quantityKg} kg of ${order.productName} has been confirmed.`,
    type: 'order',
    timestamp: 'Just now',
    read: false,
  });
};

export const updateOrderStatusInFirestore = async (
  orderId: string,
  status: Order['status'],
  additionalData?: Partial<Order>
): Promise<void> => {
  const docRef = doc(db, 'orders', orderId);
  const updatePayload: Record<string, any> = { status, ...additionalData };

  if (status === 'delivered') {
    updatePayload.paymentStatus = 'released';
  }

  await updateDoc(docRef, updatePayload);
};

// ==========================================
// 3. LIVE APMC MANDI PRICES
// ==========================================

export const subscribeToMandiPrices = (
  callback: (prices: MandiPriceRecord[]) => void
): Unsubscribe => {
  const mandiCol = collection(db, 'mandi_prices');

  return onSnapshot(
    mandiCol,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_MANDI_PRICES.forEach((m) => {
            const docRef = doc(db, 'mandi_prices', m.id);
            batch.set(docRef, m);
          });
          await batch.commit();
          callback(INITIAL_MANDI_PRICES);
        } catch (e) {
          callback(INITIAL_MANDI_PRICES);
        }
      } else {
        const loaded: MandiPriceRecord[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ ...docSnap.data(), id: docSnap.id } as MandiPriceRecord);
        });
        callback(loaded);
      }
    },
    () => {
      callback(INITIAL_MANDI_PRICES);
    }
  );
};

// ==========================================
// 4. FPO AGGREGATION POOLS
// ==========================================

export const subscribeToFPOPools = (
  callback: (pools: FPOAggregationPool[]) => void
): Unsubscribe => {
  const fpoCol = collection(db, 'fpo_pools');

  return onSnapshot(
    fpoCol,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          MOCK_FPO_POOLS.forEach((p) => {
            const docRef = doc(db, 'fpo_pools', p.id);
            batch.set(docRef, p);
          });
          await batch.commit();
          callback(MOCK_FPO_POOLS);
        } catch (e) {
          callback(MOCK_FPO_POOLS);
        }
      } else {
        const loaded: FPOAggregationPool[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ ...docSnap.data(), id: docSnap.id } as FPOAggregationPool);
        });
        callback(loaded);
      }
    },
    () => {
      callback(MOCK_FPO_POOLS);
    }
  );
};

export const joinFPOPoolInFirestore = async (
  poolId: string,
  farmerName: string,
  quantityKg: number,
  village: string
): Promise<void> => {
  const poolRef = doc(db, 'fpo_pools', poolId);
  const snap = await getDoc(poolRef);
  if (snap.exists()) {
    const data = snap.data() as FPOAggregationPool;
    const updatedFarmers = [...data.farmers, { name: farmerName, quantityKg, village }];
    const newTotal = data.totalAggregatedKg + quantityKg;
    const isCompleted = newTotal >= data.targetBuyerDemandKg;

    await updateDoc(poolRef, {
      totalAggregatedKg: newTotal,
      participatingFarmersCount: data.participatingFarmersCount + 1,
      farmers: updatedFarmers,
      status: isCompleted ? 'ready_for_dispatch' : 'aggregating',
    });
  }
};

// ==========================================
// 5. NOTIFICATIONS & REVIEWS
// ==========================================

export const subscribeToNotifications = (
  callback: (notifs: NotificationItem[]) => void
): Unsubscribe => {
  const notifsCol = collection(db, 'notifications');
  return onSnapshot(
    notifsCol,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          MOCK_NOTIFICATIONS.forEach((n) => {
            const docRef = doc(db, 'notifications', n.id);
            batch.set(docRef, n);
          });
          await batch.commit();
          callback(MOCK_NOTIFICATIONS);
        } catch {
          callback(MOCK_NOTIFICATIONS);
        }
      } else {
        const loaded: NotificationItem[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ ...docSnap.data(), id: docSnap.id } as NotificationItem);
        });
        callback(loaded);
      }
    },
    () => {
      callback(MOCK_NOTIFICATIONS);
    }
  );
};

export const markNotificationReadInFirestore = async (notifId: string): Promise<void> => {
  const docRef = doc(db, 'notifications', notifId);
  await updateDoc(docRef, { read: true });
};

export const subscribeToReviews = (callback: (reviews: ReviewItem[]) => void): Unsubscribe => {
  const reviewsCol = collection(db, 'reviews');
  return onSnapshot(
    reviewsCol,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          MOCK_REVIEWS.forEach((r) => {
            const docRef = doc(db, 'reviews', r.id);
            batch.set(docRef, r);
          });
          await batch.commit();
          callback(MOCK_REVIEWS);
        } catch {
          callback(MOCK_REVIEWS);
        }
      } else {
        const loaded: ReviewItem[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ ...docSnap.data(), id: docSnap.id } as ReviewItem);
        });
        callback(loaded);
      }
    },
    () => {
      callback(MOCK_REVIEWS);
    }
  );
};

export const addReviewToFirestore = async (review: ReviewItem): Promise<void> => {
  const docRef = doc(db, 'reviews', review.id);
  await setDoc(docRef, review);
};

// ==========================================
// 6. USER PROFILES & AUTH
// ==========================================

export const saveUserProfileToFirestore = async (userProfile: UserProfile): Promise<void> => {
  const docRef = doc(db, 'users', userProfile.uid);
  await setDoc(docRef, userProfile, { merge: true });
};

export const updateUserSettingsInFirestore = async (
  uid: string,
  settings: Partial<UserProfile>
): Promise<void> => {
  const docRef = doc(db, 'users', uid);
  await setDoc(docRef, settings, { merge: true });
};

export const registerHyperScaleUser = async (userProfile: UserProfile): Promise<void> => {
  const docRef = doc(db, 'users', userProfile.uid);
  await setDoc(docRef, {
    ...userProfile,
    hyperScaleMeta: {
      capacityTier: '500_CRORE_DISTRIBUTED',
      partitionCluster: userProfile.partitionCluster || 108,
      shardId: userProfile.shardId || 'SHARD-GLOBAL-01',
      registeredAt: new Date().toISOString(),
      idEntropy: '128-bit-UUIDv4',
    },
  }, { merge: true });
};

export const getUserProfileFromFirestore = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', uid);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
};

export const subscribeToAuth = (
  callback: (user: FirebaseUser | null) => void
): Unsubscribe => {
  return onAuthStateChanged(auth, callback);
};

export const logoutUser = async (): Promise<void> => {
  await fbSignOut(auth);
};
