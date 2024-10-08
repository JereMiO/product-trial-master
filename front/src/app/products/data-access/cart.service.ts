import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.model';

interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'local_cart';
  private cartItemsSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const cartJson = localStorage.getItem(this.cartKey);
    if (cartJson) {
      this.cartItemsSubject.next(JSON.parse(cartJson));
    }
  }

  private saveCart(cart: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.cartItemsSubject.next(cart);
  }

  addToCart(product: Product): void {
    const currentCart = this.cartItemsSubject.value;
    const existingItem = currentCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.saveCart([...currentCart]);
    } else {
      this.saveCart([...currentCart, { ...product, quantity: 1 }]);
    }
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartItemsSubject.value;
    const updatedCart = currentCart.filter(item => item.id !== productId);
    this.saveCart(updatedCart);
  }

  updateCartItemQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartItemsSubject.value;
    const updatedCart = currentCart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    this.saveCart(updatedCart);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getCartItemsCount(): number {
    return this.cartItemsSubject.value.reduce((count, item) => count + item.quantity, 0);
  }
}
