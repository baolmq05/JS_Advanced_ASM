import { Product } from "../service/product.service.js";

const product = new Product();
let productList;

async function productLoading() {
    await product.productLoadData();
    productList = product.getProductList();

    let productListHTML = document.querySelector("#product_list");

    productListHTML.innerHTML = product.productRenderIndex();
}

productLoading();