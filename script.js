let cart = [];


/* =========================
   ADD PRODUCT TO CART
========================= */

function addProductToCart(
    productName,
    price,
    sizeId,
    colorId,
    quantityId
) {

    const size =
        document.getElementById(sizeId).value;

    const color =
        document.getElementById(colorId).value;

    let quantity =
        parseInt(
            document.getElementById(quantityId).value
        );


    // Make sure quantity is valid

    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
    }

    if (quantity > 10) {
        quantity = 10;
    }


    // Add product

    cart.push({

        name: productName,

        price: price,

        size: size,

        color: color,

        quantity: quantity

    });


    updateCartCount();


    alert(
        productName +
        "\n\nSize: " +
        size +
        "\nColour: " +
        color +
        "\nQuantity: " +
        quantity +
        "\n\nAdded to your cart!"
    );
}


/* =========================
   UPDATE CART COUNT
========================= */

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");


    if (cartCount) {

        let totalItems = 0;


        cart.forEach(function(item) {

            totalItems += item.quantity;

        });


        cartCount.innerText =
            totalItems;
    }
}


/* =========================
   SHOW CART
========================= */

function showCart() {

    if (cart.length === 0) {

        alert(
            "Your ZADY cart is empty."
        );

        return;
    }


    let message =
        "🛍️ ZADY CART\n\n";


    let total = 0;


    cart.forEach(function(item, index) {

        const itemTotal =
            item.price * item.quantity;


        message +=
            (index + 1) +
            ". " +
            item.name +
            "\n";

        message +=
            "Size: " +
            item.size +
            "\n";

        message +=
            "Colour: " +
            item.color +
            "\n";

        message +=
            "Quantity: " +
            item.quantity +
            "\n";

        message +=
            "Price: ₹" +
            itemTotal +
            "\n\n";


        total += itemTotal;

    });


    message +=
        "----------------------\n";

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
        "Thank you for contacting ZADY! ❤️"
    );

}
