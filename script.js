let cart = [];

function addToCart(productName, price) {

    cart.push({
        name: productName,
        price: price
    });

    document.getElementById("cart-count").innerText = cart.length;

    alert(productName + " added to cart!");
}


function showCart() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = "YOUR ZADY CART\n\n";

    let total = 0;

    cart.forEach(function(item, index) {

        message += (index + 1) + ". "
                + item.name
                + " - ₹"
                + item.price
                + "\n";

        total += item.price;
    });

    message += "\n----------------\n";
    message += "Total: ₹" + total;

    alert(message);
}


function sendMessage() {

    alert("Thank you for contacting ZADY!");

}
