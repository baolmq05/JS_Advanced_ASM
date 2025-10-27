import { Product } from "../service/product.service.js";
import { Category } from "../service/category.service.js";

const product = new Product();
const category = new Category();

let productList = [];
let productCurrentList = [];

let categoryList = [];

let productListHTML = document.querySelector("#product_shop_list");

async function productLoading() {
    await category.categoryLoadData();
    categoryList = category.getCategoryList();
    await product.productLoadData();
    productList = product.getProductList();
    productCurrentList = productList;

    renderProductAll();
    renderByCategory();
    setBreadCrumb();
    searchAction();
}

async function categoryLoading() {
    await category.categoryLoadData();
    document.querySelector("#category-list").innerHTML = category.categoryRenderInShop();
}

// ID category
const query = window.location.search;
let categoryIdUrl = query.substring(1);

const setBreadCrumb = () => {
    if (categoryIdUrl != "") {
        let categoryItem = categoryList.find(item => item.id == categoryIdUrl);
        let categoryParentItem = categoryList.find(item => item.id == categoryItem.parent_id);
        const breadCrumb1E = document.querySelector("#breadcrumb1");
        const breadCrumb2E = document.querySelector("#breadcrumb2");
        breadCrumb2E.style.display = "block";
        breadCrumb1E.innerHTML = categoryParentItem.name;
        breadCrumb2E.innerHTML = categoryItem.name;
    } else {
        const breadCrumb2E = document.querySelector("#breadcrumb2").style.display = "none";
    }
};

// Render
const renderProductAll = () => {
    productListHTML.innerHTML = product.productRenderShop();
}

const renderByCategory = () => {
    if (categoryIdUrl != "") {
        productCurrentList = productList.filter(item => item.category_id == categoryIdUrl);
        let htmlProductByCate = product.productRenderByCategory(categoryIdUrl);
        productListHTML.innerHTML = htmlProductByCate;
    }
};

// ------ Sort
// Event Handle
const renderBySort = () => {
    let htmlSorted = product.productRenderBySort(productCurrentList, sortE.value);
    productListHTML.innerHTML = htmlSorted;
};

const sortE = document.querySelector("#sort");

sortE.addEventListener("change", renderBySort);

// --Search 
const searchE = document.querySelector("#search");
const searchAction = () => {
    if (searchE.value == "") {
        productListHTML.innerHTML = product.productRenderByCurrentList(productCurrentList);
    }

    searchE.addEventListener("input", () => {
        if (searchE.value == "") {
            productListHTML.innerHTML = product.productRenderByCurrentList(productCurrentList);
        } else {
            let htmlSearched = product.productRenderBySearch(productCurrentList, searchE.value);
            productListHTML.innerHTML = htmlSearched;
        }
    })
}



// Call Function Load
categoryLoading();
productLoading();