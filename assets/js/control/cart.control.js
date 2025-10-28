import { Cart } from "../service/cart.service.js";
import { Product } from "../service/product.service.js";

if (!sessionStorage.getItem("client_allow")) {
    sessionStorage.setItem("must_cart", "Vui lòng đăng nhập");
    window.location.href = "http://127.0.0.1:5501/page/login.html";
}

if (sessionStorage.getItem("admin_allow")) {
    sessionStorage.setItem("admin_cant_buy", "Quản trị viên không thể mua hàng");
    window.location.href = "http://127.0.0.1:5501/index.html";
}

function turnOnAlert() {
    let alertDanger = document.querySelector("#alert_danger");
    alertDanger.style.display = "flex";
    setTimeout(function () {
        alertDanger.style.display = "none";
    }, 3000)
}

let userId = sessionStorage.getItem("client_allow");

const cart = new Cart();
const product = new Product();

let productList = [];
let cartList = [];
let cartCurrent = [];

const cartListHtml = document.querySelector("#cart_list");
const quantityText = document.querySelector("#quantity_text");
const totalTempText = document.querySelector("#total_temp");
const totalText = document.querySelector("#total_price");
const cartContainer = document.querySelector("#cart-container");

async function cartLoading() {
    await product.productLoadData();
    productList = product.getProductList();
    await cart.cartLoadData();

    cartList = cart.getCartList();
    cartCurrentLoad();
    renderCart();
}

const cartCurrentLoad = () => {
    cartCurrent = cartList.find(item => item.user_id == userId);
};

const renderCart = () => {
    let cartResult = cart.cartRender(cartCurrent.cart_details, productList);

    if (cartResult.html == "") {
        cartContainer.innerHTML = "<strong>Không có sản phẩm nào</strong>";
    } else {
        cartListHtml.innerHTML = cartResult.html;
    }

    let totalPrice = cartResult.total_price;

    let quantity = cartResult.quantity;
    renderQuantiyTotalText(quantity)
    renderTempTotal(totalPrice);
    renderTotalPrice(totalPrice);
}

const renderQuantiyTotalText = (quantity) => {
    quantityText.innerHTML = `(${quantity} sản phẩm)`
};

const renderTempTotal = (totalPrice) => {
    totalTempText.innerHTML = cart.formatPrice(totalPrice);
};

const renderTotalPrice = (totalPrice) => {
    totalText.innerHTML = cart.formatPrice(totalPrice);
};

// Incre And Decre Quantity
window.incre = (variantId, productId, quantity, quantityLimit) => {
    cart.updateIncreQuantity(cartCurrent.id, variantId, productId, quantity, quantityLimit);
}

window.decre = (variantId, productId, quantity, quantityLimit) => {
    if (quantity < 2) return;
    cart.updateDecreQuantity(cartCurrent.id, variantId, productId, quantity, quantityLimit);
}

// Delete product
window.deleteProduct = (variantId, productId) => {
    console.log(productId);
    openDeleteModal(variantId, productId);
}

const openDeleteModal = (variantId, productId) => {
    document.querySelector("#modal_delete").style.display = "block";
    confirmDeleteProduct(variantId, productId);
}

const closeDeleteModal = () => {
    const btnClose = document.querySelector("#close_modal_delete");
    btnClose.addEventListener("click", () => {
        document.querySelector("#modal_delete").style.display = "none";
    });
}

const confirmDeleteProduct = (variantId, productId) => {
    const btnConfirm = document.querySelector("#delete_confirm_btn");
    btnConfirm.addEventListener("click", () => {
        let cartId = cartCurrent.id;
        cart.deleteProduct(cartId, variantId, productId);
    });
};

// DELETE PRODUCT ALL
const btnDeleteAll = document.querySelector("#delete_all_btn");
btnDeleteAll.addEventListener("click", () => {
    let cartId = cartCurrent.id;
    openDeleteModalAll();
});

const openDeleteModalAll = () => {
    document.querySelector("#modal_delete_all").style.display = "block";
    confirmDeleteProductAll();
}

const closeDeleteModalAll = () => {
    const btnClose = document.querySelector("#close_modal_delete_all");
    btnClose.addEventListener("click", () => {
        document.querySelector("#modal_delete_all").style.display = "none";
    });
}

closeDeleteModalAll();

const confirmDeleteProductAll = () => {
    const btnConfirm = document.querySelector("#delete_confirm_btn_all");
    btnConfirm.addEventListener("click", () => {
        let cartId = cartCurrent.id;
        cart.deleteAllProduct(cartId);
    });
};

// Click to next checkout
const checkOutBtn = document.querySelector("#checkout_btn");
checkOutBtn.addEventListener("click", () => {
    if (cartCurrent.cart_details == "") {
        turnOnAlert();
    } else {
        window.location.href = "./checkout.html";
    }
})


closeDeleteModal();

cartLoading();