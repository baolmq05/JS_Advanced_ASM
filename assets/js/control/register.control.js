import { User } from "../service/user.service.js";

const user = new User();

// Session (Alert)
const turnOffAlert = (alertElement, sessionName) => {
    sessionStorage.removeItem(sessionName);
    setTimeout(() => {
        alertElement.style.display = "none";
    }, 3000);
};

if (sessionStorage.getItem("create_success")) {
    let alertElement = document.querySelector("#alert_success");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = "Đăng ký thành công";

    turnOffAlert(alertElement, "create_success");
}

const fullname = document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const passwordConfirm = document.querySelector("#password_confirm");

const checkCanCreate = () => {
    let isError = false;
    const ERRORTEXT = "Không được để trống";

    if (!fullname.value || !email.value || !password.value || !passwordConfirm.value) {
        isError = true;
    }

    if (isError) {
        if (!fullname.value) {
            document.querySelector("#name_error").innerHTML = ERRORTEXT;
        } else {
            document.querySelector("#name_error").innerHTML = "";
        }

        if (!email.value) {
            document.querySelector("#email_error").innerHTML = ERRORTEXT;
        } else {
            document.querySelector("#email_error").innerHTML = "";
        }

        if (!password.value) {
            document.querySelector("#password_error").innerHTML = ERRORTEXT;
        } else {
            document.querySelector("#password_error").innerHTML = "";
        }

        if (!passwordConfirm.value) {
            document.querySelector("#password_confirm_error").innerHTML = ERRORTEXT;
        } else {
            document.querySelector("#password_confirm_error").innerHTML = "";
        }

        return false;
    }

    return true;
};

const createAction = () => {
    if (!checkCanCreate()) return;

    if (password.value != passwordConfirm.value) {
        document.querySelector("#password_confirm_error").innerHTML = "Vui lòng xác nhận đúng mật khẩu";
        return;
    } else {
        document.querySelector("#password_confirm_error").innerHTML = "Vui lòng xác nhận đúng mật khẩu";
    }

    let objectToCreate = {
        "name": fullname.value,
        "email": email.value,
        "avatar": "",
        "phone": "",
        "address": "",
        "password": password.value,
        "role": 0,
        "status": 1
    };

    user.userCreate(objectToCreate);
};

const createEventHandle = () => {
    const registerBtn = document.querySelector("#register_btn");
    registerBtn.addEventListener("click", createAction);
};

createEventHandle();