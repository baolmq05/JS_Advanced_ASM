import { Category } from "../../../service/category.service.js";

const category = new Category();

async function load() {
    await category.categoryLoadData();
    let categoryHTML = category.categoryRender();
    document.querySelector("#category-list").innerHTML = categoryHTML;

    findByName();
    findByStatus();
}

const findByName = () => {
    searchEventHandle();
};

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
    })
};

const searchEventHandle = () => {
    let searchInput = document.querySelector("#search_input");

    searchInput.addEventListener("keyup", (event) => {
        if (searchInput.value == "") {
            let categoryHTML = category.categoryRender();
            document.querySelector("#category-list").innerHTML = categoryHTML;
            return;
        }

        let categoryHTML = category.categoryRenderByName(searchInput.value);
        document.querySelector("#category-list").innerHTML = "";
        document.querySelector("#category-list").innerHTML = categoryHTML;
    });
};

load();
