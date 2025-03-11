document.addEventListener("DOMContentLoaded", function () {  //This ensures that the script runs only after the entire HTML document has been fully loaded.
    //If you placed this script in the <head> without this event listener, it might try to access elements before they exist, causing errors.
    //Theme Toggle
    const toggleButton = document.getElementById("theme-toggle");
    //This selects the button or element with the ID "theme-toggle" and it stores it in the toggleButton variable.
    //If no element with this ID exists, toggleButton will be null.
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
    //localStorage.getItem("theme") checks if a theme preference has been saved in the browser's local storage.
    //If "dark" is stored, it add the "dark-mode" class to the <body>, enabling dark mode immediately on the page load.

    if (toggleButton) {
        //this runs the entire code and ensures if the toggle button exists.
        toggleButton.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
             //Adds a click event listener to the toggle button.
             //When clicked, it toggles the "dark-mode" class on the <body>.
            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.setItem("theme", "light");
            }
        });
    }

    //Cart Functionality
    const cartButtons = document.querySelectorAll(".cart-button");
    //Selects all the buttons that can add items to the cart.
    const cartSection = document.getElementById("cart-section");
    //The section where cart items are displayed.
    const cartItems = document.getElementById("cart-items");
    //The list where cart items will be shown.
    const cartLink = document.getElementById("cart-link");
    //The clickable button to show or hide the cart.
    const cartCount = document.getElementById("cart-count");
    //The cart displays the total number of items in the cart.

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    //Load cart from localStorage or initialize an empty array.
    //localStorage.getItem("cart") retrieves the cart data if any.
    //JSON.parse(...) converts the stored JSON string back into a JS array.
    //So, if no cart is found, it defaults to an empty array []. 

    // Function to add items to the cart
    //loops through all buttons that can add items to the cart.
    cartButtons.forEach(button => {
        button.addEventListener("click", function () {
            //listens for clicks on each button.
            let itemName = this.getAttribute("data-name");
            //retrives the name of the items and their prices.
            let itemPrice = parseFloat(this.getAttribute("data-price"));

            let existingItem = cart.find(item => item.name === itemName);
            //checks if the item exists in the cart
            if (existingItem) {
                existingItem.quantity++;  //increment the quantity
            } else {
                cart.push({ name: itemName, price: itemPrice, quantity: 1 });
                //if it doesn't exist in the cart, then add it as a default (1)
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart(); //cart update to refresh the UI
        });
    });

    // Function to update the cart UI
    function updateCart() {
        //clears all previous records and set it to 0
        cartItems.innerHTML = ""; // Clear previous items
        let total = 0;
        let itemCount = 0;

        if (cart.length === 0) {  //if cart length is 0, then display these.
            cartItems.innerHTML = "<li>Cart is empty</li>";
            cartCount.textContent = "0";
            return;
        }

        cart.forEach(item => {  //loop through cart array
            total += item.price * item.quantity; //total += item.price * item*quantity
            itemCount += item.quantity; //total item count

            let li = document.createElement("li");  //display all items as a list
            li.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;
            //display them in this format
            let removeButton = document.createElement("button");
            //new remove button
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", function () {
                removeFromCart(item.name);
            });

            li.appendChild(removeButton);
            cartItems.appendChild(li);
        });

        cartCount.textContent = itemCount; //updates the count display and update it to localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Function to remove an item from the cart
    function removeFromCart(itemName) {
        let item = cart.find(i => i.name === itemName);  //if there is any item in the cart, drop them
        if (item) {
            item.quantity--;  //quantity will drop 1 by 1.
            if (item.quantity <= 0) { //if it is less than 0 or equal to 0, filter it
                cart = cart.filter(i => i.name !== itemName);
            }
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();  //update the UI and local storage.
    }

    // Toggle cart visibility when clicking the "Cart" link
    if (cartLink) {  //listens for a click on the cart link
        cartLink.addEventListener("click", function (event) {
            event.preventDefault();  //prevents the default behavior
            cartSection.style.display = cartSection.style.display === "block" ? "none" : "block";
        });  //toggles the visibility of the cart
        //if it's visible (block), hide it (none)
        //if it's hidden (none), show it (block)
    }

    // Load cart on page refresh
    updateCart();
});
