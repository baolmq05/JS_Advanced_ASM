import { User } from "../service/user.service.js";

// Session (Alert)
const turnOffAlert = (alertElement, sessionName) => {
    // sessionStorage.removeItem(sessionName);
    setTimeout(() => {
        alertElement.style.display = "none";
    }, 3000);
};

const turnOnAlert = () => {
    let alertElement = document.querySelector("#alert_danger");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = "Email hoặc mật khẩu sai!";

    turnOffAlert(alertElement, "login_error");
}

const user = new User();
let userId;
let userCurrent = [];

let userList = [];

async function userLoading() {
    await user.userLoadData();
    userList = user.getUserList();

    console.log(userList);
    loginEventHandle();
}

const checkError = (emailValue, passwordValue) => {
    console.log(emailValue);
    console.log(passwordValue);

    let checkEmail = userList.find(userItem => userItem.email == emailValue);
    let checkPassword = userList.find(userItem => userItem.password == passwordValue);

    let isError = false;

    if (!checkEmail || !checkPassword) {
        isError = true;
    } else {
        isError = false;
        userId = checkEmail.id;
        userCurrent = checkEmail;
    }

    return isError;
};

const showError = (email, password) => {
    if (email.value == "") {
        document.querySelector("#email_error").innerText = "Không được để trống email";
    } else {
        document.querySelector("#email_error").innerText = "";
    }

    if (password.value == "") {
        document.querySelector("#password_error").innerText = "Không được để trống mật khẩu";
    } else {
        document.querySelector("#password_error").innerText = "";
    }
};

const loginAction = () => {
    let email = document.querySelector("#email");
    let password = document.querySelector("#password");


    let isEmpty = false;

    if (email.value == "") {
        isEmpty = true;
    }

    if (password.value == "") {
        isEmpty = true;
    }

    if (isEmpty) {
        showError(email, password);
        return;
    } else {
        document.querySelector("#email_error").innerText = "";
        document.querySelector("#password_error").innerText = "";
    }

    if (!checkError(email.value, password.value)) {

        let userRoleCheck = userCurrent.role;

        if (userRoleCheck == 1) {
            sessionStorage.setItem("admin_allow", userId);
            sessionStorage.setItem("client_allow", userId);

            window.location.href = "http://127.0.0.1:5501/admin/page/dashboard-day.html";
        } else {
            sessionStorage.setItem("client_allow", userId);
            sessionStorage.setItem("login_success", "Đăng nhập thành công");
            window.location.href = "http://127.0.0.1:5501/index.html";
        }
    } else {
        turnOnAlert();
    }
};

const loginEventHandle = () => {
    const loginBtn = document.querySelector("#login_btn");
    loginBtn.addEventListener("click", loginAction)
};

userLoading();