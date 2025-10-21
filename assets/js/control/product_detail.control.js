import { Product } from "../service/product.service.js";

const product = new Product();
let productList = [];
let productData = [];

// Get URL To Get ID PRODUCT
const query = window.location.search;
let productId = query.substring(1);

const productName = document.querySelector("#product_name");
const productPrice = document.querySelector("#product_price");
const productDescription = document.querySelector("#product_description");
const productImage = document.querySelector("#main-image-detail");


async function productLoading() {
    await product.productLoadData();
    productList = product.getProductList();
    await product.productDetailLoad(productId);
    productData = product.getProductOne();

    console.log(productData);
    console.log(productList);

    renderData();
}

const renderData = () => {
    productName.innerText = productData.name;
    productPrice.innerText = productData.base_price + "đ";
    productDescription.innerHTML = productData.description;
    productImage.src = productData.image;
};

productLoading();