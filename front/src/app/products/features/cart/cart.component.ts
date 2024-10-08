import { Component, OnInit } from '@angular/core';
import { CartService } from '../../data-access/cart.service';
import { Product } from '../../data-access/product.model';
import {RouterModule} from "@angular/router";
import {SplitterModule} from "primeng/splitter";
import {ToolbarModule} from "primeng/toolbar";
import {PanelMenuComponent} from "../../../shared/ui/panel-menu/panel-menu.component";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  imports: [ ButtonModule],
})
export class ProductCartComponent implements OnInit {
  cartItems: (Product & { quantity: number })[] = [];

  constructor(public cartService: CartService) { }

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateCartItemQuantity(productId, quantity);
    } else {
      this.removeFromCart(productId);
    }
  }

  handleQuantityChange(itemId: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const newQuantity = parseInt(target.value, 10);
      if (!isNaN(newQuantity)) {
        this.updateQuantity(itemId, newQuantity);
      }
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  get total(): number {
    return this.cartService.getTotal();
  }
}
