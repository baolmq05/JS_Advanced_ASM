import { Product } from "../../../../service/product.service.js";

const turnOffAlert = (alertElement, sessionName) => {
    sessionStorage.removeItem(sessionName);
    setTimeout(() => {
        alertElement.style.display = "none";
    }, 3000);
};

if (sessionStorage.getItem("delete_success")) {
    let alertElement = document.querySelector("#alert_success");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = "Xóa thành công";

    turnOffAlert(alertElement, "delete_success");
}

if (sessionStorage.getItem("delete_danger")) {
    let alertElement = document.querySelector("#alert_danger");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = "Lỗi hệ thống không thể xóa";

    turnOffAlert(alertElement, "delete_danger");
}
// -----------------------------------------------------------------------------------------------

const product = new Product();
let productCurrent;

// Get URL To Get ID PRODUCT
const query = window.location.search;
let productId = query.substring(1);

const deleteAction = (variant_id) => {
    let newVariants = productCurrent.product_variants.filter(variant => {
        return variant.id != variant_id
    });

    productCurrent.product_variants = newVariants;

    let objectToUpdate = {
        name: productCurrent.name,
        image: productCurrent.image,
        description: productCurrent.description,
        category_id: productCurrent.category_id,
        status: productCurrent.status,
        base_price: productCurrent.base_price,
        product_variants: productCurrent.product_variants // Mảng đã được xóa variant
    };

    product.productUpdate(productId, objectToUpdate, true);
};

const turnOnModal = () => {
    document.body.classList.add("show");
    const deleteModal = document.querySelector("#modal-delete");
    deleteModal.style.display = "block";

};

const checkDelete = (id) => {
    const modalTitle = document.querySelector("#modal_title");
    const deleteAcceptBtn = document.querySelector("#delete-accept-btn");

    modalTitle.innerText = "Chắc chắn xóa?";

    deleteAcceptBtn.addEventListener("click", () => {
        deleteAction(id);
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

window.deleteVariant = (variant_id) => {
    turnOnModal();
    checkDelete(variant_id);
}

async function productLoading() {
    await product.productDetailLoad(productId);
    productCurrent = product.getProductOne();
}

productLoading();

