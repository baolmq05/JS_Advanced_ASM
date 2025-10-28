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

if (sessionStorage.getItem("admin_cant_buy")) {
    let alertDangerValue = sessionStorage.getItem("admin_cant_buy");
    let alertElement = document.querySelector("#alert_danger");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertDangerValue;

    turnOffAlert(alertElement, "admin_cant_buy");
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

        let isAdmin = userCurrent.role == 1 ? true : false;
        renderProfileToggle();
        renderLinkToAdmin(isAdmin);
        renderAvatar(true);
    } else {
        let profileSelect = document.querySelector("#profile_select").style.display = "none";
        document.querySelector(".fullname").innerText = "";
        let logoutSelect = document.querySelector("#logout_select").style.display = "none";
        renderLinkToAdmin(false);
        renderAvatar();

        document.querySelector("#register_select").style.display = "block";
        document.querySelector("#login_select").style.display = "block";
    }
};

const renderLinkToAdmin = (canShow) => {
    if (canShow)
        document.querySelector("#admin_link").style.display = "block";
    else
        document.querySelector("#admin_link").style.display = "none";
}

const renderAvatar = () => {
    const avatarImage = document.querySelector("#main_avatar");
    if (sessionStorage.getItem("avatar_login")) {
        avatarImage.src = sessionStorage.getItem("avatar_login");
    } else {
        avatarImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAACUCAMAAAAqEXLeAAAAMFBMVEXFxcX////CwsL6+vrLy8v29vbc3Nzx8fHr6+vW1tbu7u7m5ubT09POzs7f39+/v7/xvw11AAADqUlEQVR4nO2cyZKsIBBFBady/v+/bdFnlFpDk3Bv0i+Cs+pFL24k5EhaRZHJZDKZTCaTyWQymf8Va21hn3/br/+chFXS2DRDX5crdTvMTVcVxZ8SulTdoy3NlbpvpuXvyBx784HW2TM9tprbTxId5TCmtqZdxvqbxE3mnPjQf5e4MadzIVsMXhJX+mpJpHHyM+N+5k0SW9rxHnN+O/IEGhuZRmMe+iJnoUSnslI+8gCNzn00JdouRKMxg6Ip7RimcfUePZWVIPbc6NRUPoI1mnLSkWiDnOag1RFZSQPkFZXUYyMO21FrxCFhNnxlUBD5sQr3paSbMjxEnkzJLtuWyBu5mZKssSjiNdIdPC5GHvRUjQC3cZDTTkTWPtNQRTYQjebBvJSYK7meN1Uk5rSNIWosLEijmYimhIlk9hETSmTPE2lBzr2WvkSRIOem1ucLJN+wRQJKIL7IbEkQQMchejegd9ghxklMXb6JJLY5sLTIbCBsbM99wJO4ivz6riSA2omBkndNFdlhzps7SwU1Yh1TY2G938C+0XKnQZhwzp7vL4hLyR6chz6OnGnpj6GRw2gHfyAd7zpkt9mIjUIlN/7sxBaV1CrtqTIuges81Upf469ovS7GzAjYQ96TymAPbzXf5UOvJXOa9kJgHNJ7SHbYEJX6azeSpaB/cMf577DSp/k6zWKdaDJUK60MvCBIkEOyPUo7eYaiukm0T7epLDoPmeWsvVp1Ezl6uE87plyfnBrPOFQ3UxqdSzUIqqFySLHmWYmLDG0HtyIrnqypd+Z28b2Ld9ZQpFXzjhH9Q6uTHBfxnuyFUiGu2yr6mYS+NRvXhB3G5B65fCX6vUrqXB/22ERsbCET1B3a6h/sZdHBWY2vYE+0O5Slc6gdHQRbAu/jAfxeEjSiVeJizxVkJEJM89+Dm7vYCfU4+0KJm2CBg88Z1LwStx7yjgekcuNdyB3IteRdyB3Igi/1sB3xmYd92I74AycftiN6g5+SDu/EpUdiGD8TGdLpXrMT4zu43bTfiOkfifnwSnh21Ag/B+FhCLX05UHo1qemIYNNGfvtn4zAD0sqTY3GBHW4rL7mE2H9DuqzFk/qEEOquo0jxHVU3cYRkBtBm5IC5F8C475q8Uc8WsV95uCPePkctlEuQWhJfd92CP0bs7srRbpGq1gAPRGWQjq9zR3hnCBBAHLINoeUi4sD2W8KJYiSDlmrk+RKSmcZaTSKvtPR67fvCPpv7aL8yfvy/AfCZjGrPiz8MwAAAABJRU5ErkJggg==";
    }
}

const renderProfileToggle = () => {
    let profileSelect = document.querySelector("#profile_select").style.display = "block";
    document.querySelector(".fullname").innerText = userCurrent.name;
    let logoutSelect = document.querySelector("#logout_select").style.display = "block";

    document.querySelector("#register_select").style.display = "none";
    document.querySelector("#login_select").style.display = "none";
}

userLoading();