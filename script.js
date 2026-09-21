/* =========================
   ZADY WEBSITE JAVASCRIPT
========================= */

let cart = [];
let discount = 0;
let currentCategory = "all";


/* =========================
   LOAD CART
========================= */

function loadCart() {

    try {

        const savedCart =
            localStorage.getItem("zadyCart");

        if (savedCart) {
            cart = JSON.parse(savedCart);
        }

    } catch (error) {

        cart = [];

    }

    updateCart();
}


/* =========================
   SAVE CART
========================= */

function saveCart() {

    localStorage.setItem(
        "zadyCart",
        JSON.stringify(cart)
    );
}


/* =========================
   ADD PRODUCT
========================= */

function addProductToCart(
    name,
    price,
    sizeId,
    colorId,
    quantityId
) {

    const sizeElement =
        document.getElementById(sizeId);

    const colorElement =
        document.getElementById(colorId);

    const quantityElement =
        document.getElementById(quantityId);


    if (!sizeElement || !colorElement || !quantityElement) {
        return;
    }


    const size = sizeElement.value;

    const color = colorElement.value;

    let quantity =
        parseInt(quantityElement.value);


    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
    }

    if (quantity > 10) {
        quantity = 10;
    }


    /*
       Same product + same size + same colour
       = increase quantity
    */

    const existingItem = cart.find(function(item) {

        return (
            item.name === name &&
            item.size === size &&
            item.color === color
        );

    });


    if (existingItem) {

        existingItem.quantity += quantity;

        if (existingItem.quantity > 10) {
            existingItem.quantity = 10;
        }

    } else {

        cart.push({

            id: Date.now() +
                Math.random(),

            name: name,

            price: Number(price),

            size: size,

            color: color,

            quantity: quantity

        });

    }


    saveCart();

    updateCart();

    showNotification(
        name + " added to cart!"
    );
}


/* =========================
   UPDATE CART
========================= */

function updateCart() {

    updateCartCount();

    renderCart();

    updateCartTotal();
}


/* =========================
   CART COUNT
========================= */

function updateCartCount() {

    const countElement =
        document.getElementById("cart-count");


    if (!countElement) {
        return;
    }


    let totalItems = 0;


    cart.forEach(function(item) {

        totalItems += item.quantity;

    });


    countElement.textContent =
        totalItems;
}


/* =========================
   RENDER CART
========================= */

function renderCart() {

    const cartContainer =
        document.getElementById("cart-items");


    if (!cartContainer) {
        return;
    }


    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <div class="empty-cart">

                <div>🛒</div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add something from our collection.
                </p>

                <a href="#shop">
                    Continue Shopping
                </a>

            </div>

        `;

        return;
    }


    cartContainer.innerHTML = "";


    cart.forEach(function(item) {

        const itemTotal =
            item.price * item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <div>

                <h3>
                    ${escapeHTML(item.name)}
                </h3>

                <p>
                    Size: ${escapeHTML(item.size)}
                    &nbsp; | &nbsp;
                    Colour: ${escapeHTML(item.color)}
                </p>

            </div>


            <div class="cart-controls">

                <button
                    type="button"
                    onclick="changeQuantity(
                        ${item.id},
                        -1
                    )">

                    −

                </button>


                <span>
                    ${item.quantity}
                </span>


                <button
                    type="button"
                    onclick="changeQuantity(
                        ${item.id},
                        1
                    )">

                    +

                </button>

            </div>


            <div class="cart-item-price">

                ₹${itemTotal.toLocaleString("en-IN")}

            </div>


            <button
                class="remove-button"
                type="button"
                onclick="removeFromCart(${item.id})">

                Remove

            </button>

        `;


        cartContainer.appendChild(cartItem);

    });
}


/* =========================
   CHANGE QUANTITY
========================= */

function changeQuantity(id, amount) {

    const item =
        cart.find(function(product) {

            return product.id === id;

        });


    if (!item) {
        return;
    }


    item.quantity += amount;


    if (item.quantity < 1) {

        removeFromCart(id);

        return;
    }


    if (item.quantity > 10) {
        item.quantity = 10;
    }


    saveCart();

    updateCart();
}


/* =========================
   REMOVE ITEM
========================= */

function removeFromCart(id) {

    cart = cart.filter(function(item) {

        return item.id !== id;

    });


    saveCart();

    updateCart();

    showNotification(
        "Product removed from cart."
    );
}


/* =========================
   CART TOTAL
========================= */

function updateCartTotal() {

    const subtotalElement =
        document.getElementById(
            "cart-subtotal"
        );

    const shippingElement =
        document.getElementById(
            "shipping-cost"
        );

    const totalElement =
        document.getElementById(
            "cart-total"
        );

    const checkoutTotalElement =
        document.getElementById(
            "checkout-total"
        );

    const checkoutButton =
        document.getElementById(
            "checkout-button"
        );


    let subtotal = 0;


    cart.forEach(function(item) {

        subtotal +=
            item.price * item.quantity;

    });


    /*
       Free shipping above ₹1,999
    */

    let shipping = 0;

    if (subtotal > 0 && subtotal < 1999) {
        shipping = 99;
    }


    const discountAmount =
        subtotal * discount;


    const total =
        subtotal +
        shipping -
        discountAmount;


    if (subtotalElement) {

        subtotalElement.textContent =
            formatMoney(subtotal);

    }


    if (shippingElement) {

        shippingElement.textContent =
            shipping === 0 && subtotal > 0
                ? "FREE"
                : formatMoney(shipping);

    }


    if (totalElement) {

        totalElement.textContent =
            formatMoney(
                Math.max(total, 0)
            );

    }


    if (checkoutTotalElement) {

        checkoutTotalElement.textContent =
            formatMoney(
                Math.max(total, 0)
            );

    }


    if (checkoutButton) {

        checkoutButton.disabled =
            cart.length === 0;

    }
}


/* =========================
   FORMAT MONEY
========================= */

function formatMoney(amount) {

    return (
        "₹" +
        Math.round(amount)
            .toLocaleString("en-IN")
    );
}


/* =========================
   OPEN CART
========================= */

function openCart() {

    const cartSection =
        document.getElementById(
            "cart-section"
        );


    if (!cartSection) {
        return;
    }


    cartSection.scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================
   COUPON
========================= */

function applyCoupon() {

    const input =
        document.getElementById(
            "coupon-input"
        );

    const message =
        document.getElementById(
            "coupon-message"
        );


    if (!input || !message) {
        return;
    }


    const code =
        input.value
            .trim()
            .toUpperCase();


    if (code === "ZADY10") {

        discount = 0.10;

        message.textContent =
            "✓ 10% discount applied.";

        updateCartTotal();

        return;
    }


    if (code === "") {

        discount = 0;

        message.textContent =
            "Enter a coupon code.";

        updateCartTotal();

        return;
    }


    discount = 0;

    message.textContent =
        "Invalid coupon code.";

    updateCartTotal();
}


/* =========================
   SEARCH
========================= */

function searchProducts() {

    const input =
        document.getElementById(
            "search-input"
        );

    if (!input) {
        return;
    }


    const searchTerm =
        input.value
            .trim()
            .toLowerCase();


    filterProductDisplay(
        currentCategory,
        searchTerm
    );
}


/* =========================
   CATEGORY FILTER
========================= */

function filterProducts(
    category,
    button
) {

    currentCategory =
        category;


    const buttons =
        document.querySelectorAll(
            ".category-button"
        );


    buttons.forEach(function(item) {

        item.classList.remove(
            "active"
        );

    });


    if (button) {

        button.classList.add(
            "active"
        );

    }


    const input =
        document.getElementById(
            "search-input"
        );


    const searchTerm =
        input
            ? input.value
                .trim()
                .toLowerCase()
            : "";


    filterProductDisplay(
        category,
        searchTerm
    );
}


/* =========================
   DISPLAY FILTER
========================= */

function filterProductDisplay(
    category,
    searchTerm
) {

    const products =
        document.querySelectorAll(
            ".product"
        );

    const noProducts =
        document.getElementById(
            "no-products"
        );


    let visibleCount = 0;


    products.forEach(function(product) {

        const productCategory =
            product.dataset.category ||
            "";

        const productName =
            (
                product.dataset.name ||
                ""
            ).toLowerCase();


        const categoryMatch =
            category === "all" ||
            productCategory === category;


        const searchMatch =
            searchTerm === "" ||
            productName.includes(
                searchTerm
            );


        if (
            categoryMatch &&
            searchMatch
        ) {

            product.style.display =
                "";

            visibleCount++;

        } else {

            product.style.display =
                "none";

        }

    });


    if (noProducts) {

        noProducts.style.display =
            visibleCount === 0
                ? "block"
                : "none";

    }
}


/* =========================
   WISHLIST
========================= */

function toggleWishlist(button) {

    if (!button) {
        return;
    }


    button.classList.toggle(
        "active"
    );


    if (
        button.classList.contains(
            "active"
        )
    ) {

        button.textContent = "♥";

        showNotification(
            "Added to wishlist."
        );

    } else {

        button.textContent = "♡";

        showNotification(
            "Removed from wishlist."
        );
    }
}


/* =========================
   MOBILE MENU
========================= */

function toggleMenu() {

    const nav =
        document.querySelector(
            ".nav-links"
        );


    if (!nav) {
        return;
    }


    nav.classList.toggle(
        "open"
    );
}


/* =========================
   CHECKOUT
========================= */

function openCheckout() {

    if (cart.length === 0) {

        showNotification(
            "Your cart is empty."
        );

        return;
    }


    const modal =
        document.getElementById(
            "checkout-modal"
        );


    if (!modal) {
        return;
    }


    updateCartTotal();

    modal.classList.add(
        "show"
    );

    document.body.style.overflow =
        "hidden";
}


function closeCheckout() {

    const modal =
        document.getElementById(
            "checkout-modal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";
}


/* =========================
   PLACE ORDER
========================= */

function placeOrder(event) {

    event.preventDefault();


    if (cart.length === 0) {
        return;
    }


    const name =
        document.getElementById(
            "customer-name"
        ).value.trim();


    const phone =
        document.getElementById(
            "customer-phone"
        ).value.trim();


    const email =
        document.getElementById(
            "customer-email"
        ).value.trim();


    const address =
        document.getElementById(
            "customer-address"
        ).value.trim();


    const payment =
        document.getElementById(
            "payment-method"
        ).value;


    if (
        !name ||
        !phone ||
        !email ||
        !address ||
        !payment
    ) {

        showNotification(
            "Please complete all details."
        );

        return;
    }


    /*
       Basic phone validation
    */

    const cleanPhone =
        phone.replace(
            /[\s\-+]/g,
            ""
        );


    if (
        cleanPhone.length < 10
    ) {

        showNotification(
            "Please enter a valid phone number."
        );

        return;
    }


    const orderNumber =
        "ZADY" +
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    const orderElement =
        document.getElementById(
            "order-number"
        );


    if (orderElement) {

        orderElement.textContent =
            "Order #" +
            orderNumber;

    }


    closeCheckout();


    const successModal =
        document.getElementById(
            "success-modal"
        );


    if (successModal) {

        successModal.classList.add(
            "show"
        );

    }


    /*
       Clear cart after order
    */

    cart = [];

    discount = 0;

    saveCart();

    updateCart();


    const checkoutForm =
        document.getElementById(
            "checkout-form"
        );


    if (checkoutForm) {

        checkoutForm.reset();

    }
}


/* =========================
   CLOSE SUCCESS
========================= */

function closeSuccess() {

    const modal =
        document.getElementById(
            "success-modal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";


    window.location.hash =
        "shop";
}


/* =========================
   CONTACT FORM
========================= */

function sendMessage(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "contact-name"
        ).value.trim();


    if (!name) {
        return;
    }


    showNotification(
        "Thanks " +
        name +
        "! Your message has been received."
    );


    const form =
        document.getElementById(
            "contact-form"
        );


    if (form) {
        form.reset();
    }
}


/* =========================
   NOTIFICATION
========================= */

function showNotification(message) {

    let notification =
        document.getElementById(
            "zady-notification"
        );


    if (!notification) {

        notification =
            document.createElement(
                "div"
            );

        notification.id =
            "zady-notification";


        notification.style.position =
            "fixed";

        notification.style.right =
            "20px";

        notification.style.bottom =
            "20px";

        notification.style.zIndex =
            "9999";

        notification.style.padding =
            "14px 20px";

        notification.style.background =
            "#ffffff";

        notification.style.color =
            "#000000";

        notification.style.borderRadius =
            "30px";

        notification.style.fontWeight =
            "700";

        notification.style.fontSize =
            "14px";

        notification.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.4)";


        document.body.appendChild(
            notification
        );
    }


    notification.textContent =
        message;


    notification.style.display =
        "block";


    clearTimeout(
        window.zadyNotificationTimer
    );


    window.zadyNotificationTimer =
        setTimeout(function() {

            notification.style.display =
                "none";

        }, 2500);
}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================
   MODAL BACKGROUND CLICK
========================= */

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {

            event.target.classList.remove(
                "show"
            );

            document.body.style.overflow =
                "";

        }

    }
);


/* =========================
   ESC KEY
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeCheckout();

            const successModal =
                document.getElementById(
                    "success-modal"
                );


            if (successModal) {

                successModal.classList.remove(
                    "show"
                );

            }


            document.body.style.overflow =
                "";

        }

    }
);


/* =========================
   CLOSE MOBILE MENU
========================= */

document.addEventListener(
    "click",
    function(event) {

        const nav =
            document.querySelector(
                ".nav-links"
            );

        const menu =
            document.querySelector(
                ".menu-button"
            );


        if (
            nav &&
            menu &&
            nav.classList.contains(
                "open"
            ) &&
            !nav.contains(event.target) &&
            !menu.contains(event.target)
        ) {

            nav.classList.remove(
                "open"
            );

        }

    }
);


/* =========================
   INITIALIZE WEBSITE
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadCart();

        filterProductDisplay(
            "all",
            ""
        );

    }
);
