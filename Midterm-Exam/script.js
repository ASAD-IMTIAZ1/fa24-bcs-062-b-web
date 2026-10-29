
document.addEventListener("DOMContentLoaded", function () {

    const cart = [];
    const N = 62;
    const LIMIT = (N % 4) + 2;
    let nextId = 1;

    const cartToggle = document.getElementById("cart-toggle");
    const miniCart = document.getElementById("mini-cart");
    const cartItems = document.getElementById("cart-items");
    const cartBadge = document.getElementById("cart-badge");
    const cartTotal = document.getElementById("cart-total");

    const products = Array.from(document.querySelectorAll(".info")).map(function (info) {
        return {
            info: info,
            addButton: info.querySelector(".add-to-cart")
        };
    });

    // Check whether JavaScript can find the HTML elements.
    if (
        !cartToggle ||
        !miniCart ||
        !cartItems ||
        !cartBadge ||
        !cartTotal ||
        products.length === 0 ||
        products.some(function (product) {
            return !product.addButton;
        })
    ) {
        console.error("Cart error: One or more HTML elements are missing.");
        return;
    }

    // Count how many times a product has been added.
    function getProductCount(name) {
        return cart.filter(function (item) {
            return item.name === name;
        }).length;
    }

    // Update the cart list, badge, total and button.
    function updateCart() {
        cartItems.innerHTML = "";

        cart.forEach(function (item) {
            const li = document.createElement("li");

            const details = document.createElement("span");
            details.textContent =
                item.name + " - $" + item.price.toFixed(2);

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.textContent = "Remove";

            removeButton.addEventListener("click", function () {
                const index = cart.findIndex(function (product) {
                    return product.id === item.id;
                });

                if (index !== -1) {
                    cart.splice(index, 1);
                }

                updateCart();
            });

            li.appendChild(details);
            li.appendChild(removeButton);
            cartItems.appendChild(li);
        });

        // Update number of items.
        cartBadge.textContent = cart.length;

        // Calculate total using reduce().
        const total = cart.reduce(function (sum, item) {
            return sum + item.price;
        }, 0);

        cartTotal.textContent = total.toFixed(2);

        // Enforce the per-product quantity limit.
        products.forEach(function (product) {
            const name = product.info.dataset.name;
            const limitReached = getProductCount(name) >= LIMIT;

            product.addButton.textContent = limitReached
                ? "Limit reached"
                : "Add to Cart";
            product.addButton.disabled = limitReached;
        });
    }

    // Add each product to the cart from its own product card.
    products.forEach(function (product) {
        product.addButton.addEventListener("click", function () {
            const name = product.info.dataset.name;
            const price = Number(product.info.dataset.price);

            if (!name || !Number.isFinite(price) || price <= 0) {
                console.error("Cart error: Product name or price is missing.");
                return;
            }

            if (getProductCount(name) < LIMIT) {
                cart.push({
                    id: nextId++,
                    name: name,
                    price: price
                });

                updateCart();

                console.log("Product added:", name, price);
            }
        });
    });

    // Open or close the mini-cart.
    cartToggle.addEventListener("click", function () {
        miniCart.hidden = !miniCart.hidden;

        cartToggle.setAttribute(
            "aria-expanded",
            String(!miniCart.hidden)
        );
    });

    // Initial cart display.
    updateCart();

});
