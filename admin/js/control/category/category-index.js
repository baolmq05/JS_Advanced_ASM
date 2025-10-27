import { Category } from "../../../service/category.service.js";

const category = new Category();

async function load() {
    await category.categoryLoadData();
    let categoryHTML = category.categoryRender();
    document.querySelector("#category-list").innerHTML = categoryHTML;
    category.categoryReplaceTable();

    findByStatus();
}

const findByStatus = () => {
    statusEventHandle();
};

const statusEventHandle = () => {
    const statusChange = document.querySelector("#status_change");
    statusChange.addEventListener("change", () => {
        let valueChange = statusChange.value;

        let categoryHTML;

        if (valueChange == "") {
            categoryHTML = category.categoryRender();
        } else {
            categoryHTML = category.categoryRenderByStatus(valueChange);
        }

        document.querySelector("#category-list").innerHTML = "";
        document.querySelector("#category-list").innerHTML = categoryHTML;
        category.categoryReplaceTable();
    })
};

load();
