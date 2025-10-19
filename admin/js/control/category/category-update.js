import { Category } from "../../../service/category.service.js";

// Alert
const turnOffAlert = (alertElement, sessionName) => {
    sessionStorage.removeItem(sessionName);
    setTimeout(() => {
        alertElement.style.display = "none";
    }, 3000);
};

if (sessionStorage.getItem("update_success")) {
    let alertSuccessValue = sessionStorage.getItem("update_success");
    let alertElement = document.querySelector("#alert_success");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertSuccessValue;

    turnOffAlert(alertElement, "update_success");
}

if (sessionStorage.getItem("update_danger")) {
    let alertDangerValue = sessionStorage.getItem("update_danger");
    let alertElement = document.querySelector("#alert_danger");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertDangerValue;

    turnOffAlert(alertElement, "update_danger");
}
// -------------------------------------------------------------------------------------------
const category = new Category();

let categoryList;
let categoryData;

// Get URL To Get ID Cate
const query = window.location.search;
let categoryId = query.substring(1);

console.log(categoryId);

// Print Data
const getElement = () => {
    const nameE = document.querySelector("#name");
    const parentIdE = document.querySelector("#parent_id");
    const statusE = document.querySelector("#status").children;

    printData(nameE, statusE);
};

// Phức tạp
const printParentId = () => {
    const parentIdE = document.querySelector("#parent_id");

    let hasChild = false;
    for (let i = 0; i < categoryList.length; i++) {
        if (categoryData.parent_id == null && categoryList[i].parent_id == categoryData.id) {
            hasChild = true;
            break;
        } else if (categoryList[i].parent_id == null || categoryList[i].parent_id == "") {
            let newOption = document.createElement("option");
            console.log("Điều kiện 2");
            newOption.value = categoryList[i].id;
            newOption.innerHTML = categoryList[i].name;

            console.log(newOption);

            if (newOption.value == categoryData.parent_id) {
                newOption.selected = true;
            }

            parentIdE.appendChild(newOption);
        }
    }

    if (hasChild) {
        console.log("Điều kiện 1");

        let option = document.createElement("option");
        option.selected = true;
        option.innerHTML = "Không có";

        console.log(option);

        parentIdE.innerHTML = "";
        parentIdE.appendChild(option);
    }
}

const printData = (nameE, statusE) => {
    nameE.value = categoryData.name;

    printParentId();

    let statusArrays = Array.from(statusE);
    statusArrays.forEach(item => {
        if (item.value == categoryData.status) {
            item.selected = true;
        }
    });
};

// Update
const checkError = (name) => {
    if (!name.value) {
        showError(name.value);
        return false;
    }

    return true;
};

const showError = (name) => {
    const nameError = document.querySelector("#name_error");
    const parentIdError = document.querySelector("#parent_id_error");
    const statusError = document.querySelector("#status_error");

    const ERRORTEXT = "Không được để trống";

    if (!name) {
        nameError.innerText = ERRORTEXT;
    }
};

const updateAction = (objectToUpdate) => {
    category.categoryUpdate(categoryId, objectToUpdate);
}

const updateHandle = () => {
    const name = document.querySelector("#name");
    const parentId = document.querySelector("#parent_id");
    const status = document.querySelector("#status");

    const updateBtn = document.querySelector("#update_btn");
    updateBtn.addEventListener("click", () => {
        if (!checkError(name)) return;

        let objectToUpdate = {
            name: name.value,
            parent_id: parentId.value,
            status: status.value
        }

        updateAction(objectToUpdate)
    })
};

// Action
async function categoryGetData() {
    await category.categoryLoadData();
    categoryList = category.getCategoryList();

    await category.categoryGetOne(categoryId);
    categoryData = category.getCategoryOne();

    console.log(categoryList);
    console.log(categoryData);

    getElement();
    updateHandle();
}

categoryGetData();