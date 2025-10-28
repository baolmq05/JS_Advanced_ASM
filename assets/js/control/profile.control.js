import { User } from "../service/user.service.js";
import { Order } from "../service/order.service.js";

const user = new User();
let userList = [];
let userCurrent = [];

const order = new Order();
let orderCurrent = [];
let orderList = [];

async function loading() {
    await user.userLoadData();
    userList = user.getUserList();
    userCurrent = userList.find(item => item.id == sessionStorage.getItem("client_allow"));
    await order.orderLoadData();
    orderList = order.getOrderList();

    renderOrder();
    renderInfor();
}

const renderOrder = () => {
    orderCurrent = orderList.filter(item => item.user_id == userCurrent.id);
    let orderHtmlToRender = order.orderRender(orderCurrent);

    document.querySelector("#order_list").innerHTML = orderHtmlToRender;
}

const renderInfor = () => {
    if (sessionStorage.getItem("client_allow")) {
        let userID = sessionStorage.getItem("client_allow");
        let userCurrent = userList.find(userItem => userItem.id == userID);

        renderInfo(userCurrent);
    }
};

loading();

const renderInfo = (userCurrent) => {
    renderAvatar(userCurrent);
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

const renderAvatar = (userCurrent) => {
    const avatarImage = document.querySelector("#avatar_profile");
    avatarImage.src = userCurrent.avatar;
}


