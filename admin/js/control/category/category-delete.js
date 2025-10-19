import { Category } from "../../../service/category.service.js";

// Session (Alert)
const turnOffAlert = (alertElement, sessionName) => {
    sessionStorage.removeItem(sessionName);
    setTimeout(() => {
        alertElement.style.display = "none";
    }, 3000);
};

if (sessionStorage.getItem("alert_delete_success")) {
    let alertSuccessValue = sessionStorage.getItem("alert_delete_success");
    let alertElement = document.querySelector("#alert_success");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertSuccessValue;

    turnOffAlert(alertElement, "alert_delete_success");
}

if (sessionStorage.getItem("alert_delete_danger")) {
    let alertDangerValue = sessionStorage.getItem("alert_delete_danger");
    let alertElement = document.querySelector("#alert_danger");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertDangerValue;

    turnOffAlert(alertElement, "alert_delete_danger");
}
// -----------------------------------------------------------------------------------------------
const category = new Category();
let categoryList;


const deleteAction = (category_id, hasChild) => {
    if (hasChild) {
        categoryList.forEach(item => {
            if (item.parent_id == category_id) {
                let objectToUpdate = {
                    name: item.name,
                    parent_id: null,
                    status: item.status,
                }
                category.categoryUpdate(item.id, objectToUpdate);
            }
        });

        category.categoryDelete(category_id);
    } else {
        category.categoryDelete(category_id);
    }
};

const turnOnModal = () => {
    document.body.classList.add("overlay");
    const deleteModal = document.querySelector("#modal-delete");
    deleteModal.style.display = "block";

};

const checkDelete = (id) => {
    const modalTitle = document.querySelector("#modal_title");
    const deleteAcceptBtn = document.querySelector("#delete-accept-btn");
    let hasChild = categoryList.find((item) => item.parent_id == id);

    console.log(hasChild);

    if (hasChild) {
        turnOnModal();
        modalTitle.innerText = "Có danh mục con. Chắc chắn xóa?";
    } else {
        turnOnModal();
        modalTitle.innerText = "Chắc chắn xóa?";
    }

    deleteAcceptBtn.addEventListener("click", () => {
        deleteAction(id, hasChild);
    });
};

const turnOffModal = () => {
    const closeDeleteButton = document.querySelector("#close_modal_delete");
    closeDeleteButton.addEventListener("click", () => {
        document.body.classList.remove("overlay");
        const deleteModal = document.querySelector("#modal-delete");
        deleteModal.style.display = "none";
    });
};

turnOffModal();

window.deleteCategoryHandle = (category_id) => {
    checkDelete(category_id);
    turnOnModal();
}

async function categoryLoading() {
    await category.categoryLoadData();
    categoryList = category.getCategoryList();
}

categoryLoading();