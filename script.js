let cart = [];
let cartCount = 0;

function addToCart(productName, price) {
    cart.push({
        name: productName,
        price: price
    });

    cartCount++;

    alert(productName + " added to cart!");

    const cartButton = document.getElementById("cart-count");

    if (cartButton) {
        cartButton.innerText = cartCount;
    }
}

function showCart() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = "Your Cart:\n\n";

    cart.forEach((item, index) => {
        message += (index + 1) + ". " + item.name + " - ₹" + item.price + "\n";
    });

    alert(message);
}
