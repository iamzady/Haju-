let cart = [];


/* =========================
   ADD TO CART
========================= */

function addToCart(productName, price) {

    cart.push({
        name: productName,
        price: price
    });

    updateCartCount();

    alert(productName + " added to cart!");
}


/* =========================
   UPDATE CART COUNT
========================= */

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (cartCount) {
        cartCount.innerText = cart.length;
    }
}


/* =========================
   SHOW CART
========================= */

function showCart() {

    if (cart.length === 0) {

        alert("Your ZADY cart is empty.");

        return;
    }


    let message = "ZADY CART\n\n";

    let total = 0;


    cart.forEach(function(item, index) {

        message +=
            (index + 1) +
            ". " +
            item.name +
            " - ₹" +
            item.price +
            "\n";

        total += item.price;

    });


    message +=
        "\n--------------------\n";

    message +=
        "TOTAL: ₹" +
        total;


    alert(message);
}


/* =========================
   CONTACT MESSAGE
========================= */

function sendMessage() {

    alert(
        "Thank you for contacting ZADY!"
    );

}
