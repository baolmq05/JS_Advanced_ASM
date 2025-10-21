import { Category } from "../../../service/category.service.js";
import { Product } from "../../../service/product.service.js";
const category = new Category();
const product = new Product();

let categoryList;
let productList;
let productData;

// Get URL To Get ID PRODUCT
const query = window.location.search;
let productId = query.substring(1);

// Print Data

const getElement = () => {
    const nameE = document.querySelector("#name");
    const imageE = document.querySelector("#image");
    const descriptionE = document.querySelector("#description");
    const categoryE = document.querySelector("#category");
    const statusE = document.querySelector("#status");
    const basePriceE = document.querySelector("#base_price");

    printData(nameE, imageE, descriptionE, categoryE, statusE, basePriceE);
};

const findCategoryName = (categoryId) => {
    let cate = categoryList.find((item) => item.id == categoryId);
    if (cate) {
        return cate.name;
    } else {
        return "Chưa phân loại";
    }
};

const printData = (nameE, imageE, descriptionE, categoryE, statusE, basePriceE) => {
    let categoryName = findCategoryName(productData.category_id);

    nameE.value = productData.name;
    imageE.src = productData.image;
    descriptionE.innerHTML = productData.description;
    categoryE.value = categoryName;
    basePriceE.value = productData.base_price;

    statusE.value = productData.status == 1 ? "Hiện" : "Ẩn";
};

async function productLoading() {
    await category.categoryLoadData();
    categoryList = category.getCategoryList();

    await product.productLoadData();
    productList = product.getProductList();

    await product.productDetailLoad(productId);
    productData = product.getProductOne();

    product.productRenderVariant(productData);

    getElement();
}

productLoading();