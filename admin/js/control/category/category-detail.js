import { Category } from "../../../service/category.service.js";
const category = new Category();

let categoryList;
let categoryData;

// Get URL To Get ID Cate
const query = window.location.search;
let categoryId = query.substring(1);

// Print Data

const getElement = () => {
    const nameE = document.querySelector("#name");
    const parentIdE = document.querySelector("#parent_id");
    const statusE = document.querySelector("#status");

    printData(nameE, parentIdE, statusE);
};

const findParentName = (parentId) => {
    if (parentId == null || parentId == "") {
        return "Không có";
    } else {
        let cate = categoryList.find((item) => item.id == parentId);
        console.log(cate.name);
        return cate.name;
    }
};

const printData = (nameE, parentIdE, statusE) => {
    let parentName = findParentName(categoryData.parent_id);

    parentIdE.value = parentName;
    nameE.value = categoryData.name;
    statusE.innerText = categoryData.status == 1 ? "Hiện" : "Ẩn";
};

async function categoryGetData() {
    await category.categoryLoadData();
    categoryList = category.getCategoryList();

    await category.categoryGetOne(categoryId);
    categoryData = category.getCategoryOne();

    console.log(categoryList);
    console.log(categoryData);

    getElement();
}

categoryGetData();