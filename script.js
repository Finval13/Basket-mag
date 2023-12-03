"use strict";

class ShoppingCart {
  constructor() {
    this.cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    this.cartContainer = document.getElementById("cart-items");
    this.totalPriceContainer = document.getElementById("total-price");
    this.orderBtn = document.getElementById("order-btn");
    this.emptyCartMessage = document.getElementById("empty-cart-message");

    this.orderBtn.addEventListener("click", this.placeOrder.bind(this));
    this.updateCart();
  }

  updateEmptyCartMessage() {
    this.emptyCartMessage.style.display = this.cartItems.length > 0 ? "none" : "block";
  }

  updateCart() {
    this.cartContainer.innerHTML = "";
    this.totalPriceContainer.textContent = `Загальна сума: ${this.calculateTotalPrice()} грн`;

    this.cartItems.forEach((item) => {
      const li = document.createElement("li");

      const nameQuantityContainer = document.createElement("div");
      nameQuantityContainer.classList.add("name-quantity-container");

      const name = document.createElement("span");
      name.textContent = item.name;

      const quantityContainer = document.createElement("div");
      quantityContainer.classList.add("quantity-controls");

      const decreaseBtn = document.createElement("button");
      decreaseBtn.textContent = "-";
      decreaseBtn.addEventListener("click", () => this.updateQuantity(item.id, -1));

      const quantityDisplay = document.createElement("span");
      quantityDisplay.textContent = item.quantity;

      const increaseBtn = document.createElement("button");
      increaseBtn.textContent = "+";
      increaseBtn.addEventListener("click", () => this.updateQuantity(item.id, 1));

      quantityContainer.appendChild(decreaseBtn);
      quantityContainer.appendChild(quantityDisplay);
      quantityContainer.appendChild(increaseBtn);

      nameQuantityContainer.appendChild(name);
      nameQuantityContainer.appendChild(quantityContainer);

      li.appendChild(nameQuantityContainer);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.addEventListener("click", () => this.removeFromCart(item.id));

      li.appendChild(deleteBtn);
      this.cartContainer.appendChild(li);
    });

    this.updateEmptyCartMessage();

    this.orderBtn.style.display = this.cartItems.length > 0 ? "block" : "none";

    localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
  }

  addToCart(id, name, price) {
    const existingItem = this.cartItems.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({ id, name, price, quantity: 1 });
    }

    this.updateCart();
  }

  removeFromCart(id) {
    this.cartItems = this.cartItems.filter((item) => item.id !== id);
    this.updateCart();
  }

  updateQuantity(id, change) {
    const item = this.cartItems.find((item) => item.id === id);

    if (item) {
      item.quantity += change;

      if (item.quantity < 1) {
        this.removeFromCart(id);
      }

      this.updateCart();
    }
  }

  calculateTotalPrice() {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  placeOrder() {
    alert("Замовлення успішно розміщено!");
    this.cartItems = [];
    this.updateCart();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const shoppingCart = new ShoppingCart();

  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const product = button.closest(".product");
      const id = product.dataset.id;
      const name = product.dataset.name;
      const price = parseInt(product.dataset.price);
      shoppingCart.addToCart(id, name, price);
    });
  });
});
