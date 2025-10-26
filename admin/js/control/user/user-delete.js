import { User } from "../../../service/user.service.js";

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
const user = new User();

const deleteAction = (userId) => {
    user.userDelete(userId)
};

const turnOnModal = () => {
    const deleteModal = document.querySelector("#modal-delete");
    deleteModal.style.display = "block";
};

const checkDelete = (userId) => {
    const modalTitle = document.querySelector("#modal_title");
    const deleteAcceptBtn = document.querySelector("#delete-accept-btn");

    deleteAcceptBtn.addEventListener("click", () => {
        deleteAction(userId);
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

window.deleteUserHandle = (userId) => {
    checkDelete(userId);
    turnOnModal();
    console.log("Dô");
}