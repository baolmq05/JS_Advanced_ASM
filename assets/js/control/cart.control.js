import { Cart } from "../service/cart.service.js";
import { Product } from "../service/product.service.js";

if (!sessionStorage.getItem("client_allow")) {
    sessionStorage.setItem("must_cart", "Vui lòng đăng nhập");
    window.location.href = "http://127.0.0.1:5501/page/login.html";
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
    console.log(cartCurrent);
};

const renderCart = () => {
    let cartResult = cart.cartRender(cartCurrent.cart_details, productList);
    cartListHtml.innerHTML = cartResult.html;
    let totalPrice = cartResult.total_price;

    let quantity = cartResult.quantity;
    renderQuantiyTotalText(quantity)
    renderTempTotal(cartResult.total_price);
    renderTotalPrice(cartResult.total_price);
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

cartLoading();