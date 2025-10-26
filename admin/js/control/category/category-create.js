import { Category } from "../../../service/category.service.js";

// Session (Alert)
const turnOffAlert = (alertElement, sessionName) => {
    sessionStorage.removeItem(sessionName);
    setTimeout(() => {
        alertElement.style.display = "none";
    }, 3000);
};

if (sessionStorage.getItem("alert_success")) {
    let alertSuccessValue = sessionStorage.getItem("alert_success");
    let alertElement = document.querySelector("#alert_success");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertSuccessValue;

    turnOffAlert(alertElement, "alert_success");
}

if (sessionStorage.getItem("alert_danger")) {
    let alertDangerValue = sessionStorage.getItem("alert_danger");
    let alertElement = document.querySelector("#alert_danger");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertDangerValue;

    turnOffAlert(alertElement, "alert_danger");
}

// ---------------------------------------------------------------------------------------------------

const category = new Category();
let categoryList = [];

const renderParentIDSelect = () => {
    const parentID = document.querySelector("#parent_id");

    categoryList.forEach(item => {
        if (item.parent_id == null || item.parent_id == "") {
            let newOption = document.createElement("option");
            newOption.value = item.id;
            newOption.innerText = item.name;

            parentID.appendChild(newOption);
        }
    });
};

// Create

const checkCanCreate = nameValue => {
    let isError = false;
    const nameError = document.querySelector("#name_error");

    const ERRORTEXT = "Không được bỏ trống";

    if (!nameValue) {
        isError = true;
    }

    if (isError) {
        if (!nameValue) {
            nameError.innerText = ERRORTEXT;
        }

        return false;
    }

    return true;
};

const getData = () => {
    let name = document.querySelector("#name").value;
    let parentID = document.querySelector("#parent_id").value;

    let canCreate = checkCanCreate(name, parentID);

    if (!canCreate) {
        return null;
    }

    let nameDuplicate = categoryList.find(item => item.name == name);

    if (nameDuplicate) {
        const nameError = document.querySelector("#name_error");
        nameError.innerText = "Danh mục đã trùng";
        return null;
    }

    if (parentID == "") {
        parentID = null;
    }

    let categoryObj = {
        name: name,
        parent_id: parentID,
        status: 1,
    }

    return categoryObj;
};

const createAction = () => {
    let objectToCreate = getData();
    if (objectToCreate == null) return;
    console.log(objectToCreate);
    category.categoryCreate(...Object.values(objectToCreate));
};
// ACTION ----------------------------------
async function categoryLoad() {
    await category.categoryLoadData();
    categoryList = category.getCategoryList();
    renderParentIDSelect();

    const createBtn = document.querySelector("#create_btn");
    createBtn.addEventListener("click", createAction);
}

categoryLoad();