import { Product } from "../../../service/product.service.js";
import { Category } from "../../../service/category.service.js";

const product = new Product();
const category = new Category();
let categoryList;

async function load() {
    await product.productLoadData();
    await category.categoryLoadData();

    categoryList = category.getCategoryList();

    let productHTML = product.productRender(categoryList);
    document.querySelector("#product-list").innerHTML = productHTML;
    product.productReplaceTable();

    findByStatus();
}

const findByStatus = () => {
    statusEventHandle();
};

const statusEventHandle = () => {
    const statusChange = document.querySelector("#status_change");
    statusChange.addEventListener("change", () => {
        let valueChange = statusChange.value;

        let productHTML;

        if (valueChange == "") {
            productHTML = product.productRender(categoryList);
        } else {
            productHTML = product.productRenderByStatus(valueChange, categoryList);
        }

        document.querySelector("#product-list").innerHTML = "";
        document.querySelector("#product-list").innerHTML = productHTML;

        product.productReplaceTable();
    })
};

load();
