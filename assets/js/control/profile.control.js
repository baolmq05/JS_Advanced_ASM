import { User } from "../service/user.service.js";

const user = new User();
let userList = [];
let userCurrent = [];

async function loading() {
    await user.userLoadData();
    userList = user.getUserList();

    renderData();
}

const renderData = () => {
    if (sessionStorage.getItem("client_allow")) {
        let userID = sessionStorage.getItem("client_allow");
        userCurrent = userList.find(userItem => userItem.id == userID);

        renderInfo(userCurrent);
    }
};

loading();

const renderInfo = (userCurrent) => {
    let bigName = document.querySelector("#big_name").innerHTML = userCurrent.name;
    let bigEmail = document.querySelector("#big_email").innerHTML = userCurrent.email;

    console.log(userCurrent);
    let fullname = document.querySelector("#fullname_info");
    fullname.innerHTML = "<strong>Họ và tên: </strong>" + userCurrent.name;
    let email = document.querySelector("#email_info");
    console.log(email);
    email.innerHTML = "<strong>Email: </strong>" + userCurrent.email;
    let phone = document.querySelector("#phone_info").innerHTML = "<strong>Số điện thoại: </strong>" + userCurrent.phone;
    let address = document.querySelector("#address_info").innerHTML = "<strong>Địa chỉ: </strong>" + userCurrent.address;
};