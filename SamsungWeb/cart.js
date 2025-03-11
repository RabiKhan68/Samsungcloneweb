// Load cart from localStorage or initialize an empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];
//this line tries to load the cart from localStorage.
//If there is no stored cart (if the user is visiting the site for the first time), it initializes the array as empty array


document.addEventListener("DOMContentLoaded", function () {
    //this ensures the script runs after the page is fully loaded.
    updateCartDisplay();
    //calls this function to show curent cart items.

    // Ensure "Add to Cart" buttons exist before adding event listeners
    document.querySelectorAll(".cart-button").forEach(button => {
        //finds all buttons with the class .cart-button
        button.addEventListener("click", function () {
            //when clicked, it gets the product name, price to add the item.
            let name = this.getAttribute("data-name");
            let price = parseFloat(this.getAttribute("data-price"));
            addToCart(name, price);
        });
    });

    // Ensure cart button exists before adding event listener
    let cartButton = document.getElementById("cart-button");
    //it helps to view the cart items when clicked
    if (cartButton) {
        cartButton.addEventListener("click", function () {
            let cartSection = document.getElementById("cart");
            if (cartSection) {
                cartSection.style.display = (cartSection.style.display === "none" || cartSection.style.display === "") ? "block" : "none";
            }
        });
    }

    // Ensure clear cart button exists before adding event listener
    let clearCartButton = document.getElementById("clear-cart");
    if (clearCartButton) {  //clear cart ensures that it updates the UI, removes the cart from local storage, and empties the cart array.
        clearCartButton.addEventListener("click", function () {
            cart = [];
            localStorage.removeItem("cart");
            updateCartDisplay();
        });
    }

    // Ensure checkout button exists before adding event listener
    let checkoutButton = document.getElementById("checkout-btn");
    if (checkoutButton) {  //this checkout btn ensures that if the cart is empty, it prevents to go to checkout page and shows an alert
        //if there are items, then it redirects to checkout page
        checkoutButton.addEventListener("click", function (event) {
            if (cart.length === 0) {
                event.preventDefault(); // Stop the default link action
                alert("Your cart is empty! Add items before proceeding to checkout.");
            } else {
                window.location.href = "checkout.html"; // Redirect if cart has items
            }
        });
    }
});

// Function to add items to the cart
function addToCart(name, price) {
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {  //it updates the cart quantity (if there is), else set it to (1).
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    //and then updates the cart UI
    updateCartDisplay();
}

// Function to update the cart display
function updateCartDisplay() {
    let cartItemsContainer = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");
    let cartCount = document.getElementById("cart-count");

    // Prevent errors if elements are missing
    if (!cartItemsContainer || !cartTotal || !cartCount) return;

    cartItemsContainer.innerHTML = "";
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<li>Cart is empty</li>";
        cartTotal.textContent = "Total: $0.00";
        cartCount.textContent = "0";  // Ensure count is reset when empty
        updateCartButton(count);
        return;
    }
    //clears the previous items from the array
    //adds new list items for each cart product
    //if cart is empty, it shows (cart is empty)
    //displays the total price and item count 

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        let li = document.createElement("li");
        li.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;

        let removeButton = document.createElement("button");
        removeButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        removeButton.style.border = "none"; // Remove border
        removeButton.style.background = "transparent"; // Remove background
        removeButton.style.color = "cornflowerblue"; // Make the icon cornflowerblue
        removeButton.style.cursor = "pointer"; // Make it look clickable
        removeButton.style.fontSize = "18px";
        removeButton.classList.add("remove-btn");
        removeButton.addEventListener("click", function () {
            removeFromCart(item.name);
        });

        li.appendChild(removeButton);
        cartItemsContainer.appendChild(li);
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = count;  // Update cart count in the navigation
    updateCartButton(count);  // Update "View Cart" button count
}

// Function to update "View Cart" button
function updateCartButton(count) {
    let cartButton = document.querySelector("#cart-button");
    if (cartButton) {
        cartButton.innerHTML = `View Cart (${count})`;
        //updates the "view cart" button to show the number of items in the cart
    }
}

// Function to remove an item (decrease quantity or remove completely)
function removeFromCart(itemName) {
    let item = cart.find(i => i.name === itemName);
    if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== itemName);
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
    //decreases the quantity 1 by 1
}

document.addEventListener("DOMContentLoaded", function () {
    let confirmOrderButton = document.getElementById("confirm-order");

    if (confirmOrderButton) {
        confirmOrderButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default form submission (if applicable)

            // Check if cart is empty before proceeding
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (cart.length === 0) {
                alert("Your cart is empty! Add items before placing an order.");
                return;
            }
            //displays an error if the cart is empty

            // Simulate order processing
            alert("Your order has been placed successfully!");
             //displays an alert if the order has been placed
            // Clear cart after placing order
            localStorage.removeItem("cart");
            updateCartDisplay(); // Update UI

            // Reload the page to reflect changes
            window.location.href = "checkout.html"; // Change to your homepage or order confirmation page
        });
    }
});
