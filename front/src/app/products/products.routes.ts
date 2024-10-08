import { Routes } from "@angular/router";
import { ProductListComponent } from "./features/product-list/product-list.component";
import { ProductCartComponent } from "./features/cart/cart.component";

export const PRODUCTS_ROUTES: Routes = [
	{
		path: "list",
		component: ProductListComponent,
	},
  {
    path: "cart",
    component: ProductCartComponent,
  },
	{
    path: "**", redirectTo: "list"
  },
];
