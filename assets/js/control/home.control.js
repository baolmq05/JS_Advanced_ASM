import { User } from "../service/user.service.js";

// Session (Alert)
const turnOffAlert = (alertElement, sessionName) => {
    sessionStorage.removeItem(sessionName);
    setTimeout(() => {
        alertElement.style.display = "none";
    }, 3000);
};

if (sessionStorage.getItem("login_success")) {
    let alertSuccessValue = sessionStorage.getItem("login_success");
    let alertElement = document.querySelector("#alert_success");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertSuccessValue;

    turnOffAlert(alertElement, "login_success");
}

if (sessionStorage.getItem("logout_success")) {
    let alertSuccessValue = sessionStorage.getItem("logout_success");
    let alertElement = document.querySelector("#alert_success");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertSuccessValue;

    turnOffAlert(alertElement, "logout_success");
}

const user = new User();
let userList = [];
let userCurrent = [];

async function userLoading() {
    await user.userLoadData();
    userList = user.getUserList();

    renderData();
}

const renderData = () => {
    if (sessionStorage.getItem("client_allow")) {
        let userID = sessionStorage.getItem("client_allow");
        userCurrent = userList.find(userItem => userItem.id == userID);

        renderProfileToggle();
    } else {
        let profileSelect = document.querySelector("#profile_select").style.display = "none";
        document.querySelector(".fullname").innerText = "";
        let logoutSelect = document.querySelector("#logout_select").style.display = "none";

        document.querySelector("#register_select").style.display = "block";
        document.querySelector("#login_select").style.display = "block";
    }
};

const renderProfileToggle = () => {
    let profileSelect = document.querySelector("#profile_select").style.display = "block";
    document.querySelector(".fullname").innerText = userCurrent.name;
    let logoutSelect = document.querySelector("#logout_select").style.display = "block";

    document.querySelector("#register_select").style.display = "none";
    document.querySelector("#login_select").style.display = "none";
}

userLoading();