// import { Category } from "../../../service/category.service.js";
import { Product } from "../../../service/product.service.js";

// Session (Alert)
const turnOffAlert = (alertElement, sessionName) => {
    sessionStorage.removeItem(sessionName);
    setTimeout(() => {
        alertElement.style.display = "none";
    }, 3000);
};

if (sessionStorage.getItem("delete_success")) {
    let alertSuccessValue = sessionStorage.getItem("delete_success");
    let alertElement = document.querySelector("#alert_success");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertSuccessValue;

    turnOffAlert(alertElement, "delete_success");
}

if (sessionStorage.getItem("delete_danger")) {
    let alertDangerValue = sessionStorage.getItem("delete_danger");
    let alertElement = document.querySelector("#alert_danger");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertDangerValue;

    turnOffAlert(alertElement, "delete_danger");
}
// -----------------------------------------------------------------------------------------------
const product = new Product();
let productList;


const deleteAction = (productId) => {
    product.productDelete(productId);
};

const turnOnModal = () => {
    document.body.classList.add("show");
    const deleteModal = document.querySelector("#modal-delete");
    deleteModal.style.display = "block";
};

const checkDelete = (productId) => {
    const modalTitle = document.querySelector("#modal_title");
    const deleteAcceptBtn = document.querySelector("#delete-accept-btn");
    let productItem = productList.find((item) => item.id == productId);

    if (productItem.product_variants.length > 0) {
        turnOnModal();
        modalTitle.innerText = "Có biến thể. Chắc chắn xóa";
    } else {
        turnOnModal();
        modalTitle.innerText = "Chắc chắn xóa?";
    }

    deleteAcceptBtn.addEventListener("click", () => {
        deleteAction(productId);
    });
};

const turnOffModal = () => {
    const closeDeleteButton = document.querySelector("#close_modal_delete");
    closeDeleteButton.addEventListener("click", () => {
        document.body.classList.remove("show");
        const deleteModal = document.querySelector("#modal-delete");
        deleteModal.style.display = "none";
    });
};

turnOffModal();

window.deleteProductHandle = (productId) => {
    checkDelete(productId);
    turnOnModal();
}

async function productLoading() {
    await product.productLoadData();
    productList = product.getProductList();

    console.log(productList);
}

productLoading();