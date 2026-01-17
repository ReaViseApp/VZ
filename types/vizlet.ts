// Type definitions for Viz.Let e-commerce platform

export interface VizLetShop {
  id: string
  userId: string
  vizBizId: string
  shopName: string
  description?: string | null
  isActive: boolean
  trialEndsAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface VizLetProduct {
  id: string
  shopId: string
  contentId: string
  quotableRegionId?: string | null
  productName: string
  productDescription: string
  productPhotos: string[]
  price: number
  acceptedPaymentMethods: string[]
  deliveryTime: string
  deliveryMethods: string[]
  customizationGuidelines?: string | null
  giftWrappingGuidelines?: string | null
  isActive: boolean
  viewCount: number
  purchaseCount: number
  createdAt: Date
  updatedAt: Date
  shop?: Partial<VizLetShop> & { id: string; shopName: string; vizBizId: string }
  content?: {
    id: string
    mediaUrl: string
    caption?: string | null
  }
}

export interface ShippingAddress {
  id: string
  userId: string
  fullName: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface PaymentMethod {
  id: string
  userId: string
  type: string
  lastFourDigits?: string
  expiryMonth?: number
  expiryYear?: number
  cardholderName?: string
  isDefault: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface VizLetOrder {
  id: string
  buyerId: string
  productId: string
  quantity: number
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
  shippingAddressId: string
  paymentMethodId: string
  createdAt: Date
  updatedAt: Date
}

export interface ProductFormData {
  contentId: string
  quotableRegionId?: string
  productName: string
  productDescription: string
  productPhotos: File[]
  price: number
  acceptedPaymentMethods: string[]
  deliveryTime: string
  deliveryMethods: string[]
  customizationGuidelines?: string
  giftWrappingGuidelines?: string
}

export interface SearchResult {
  products: VizLetProduct[]
  shops: VizLetShop[]
}
