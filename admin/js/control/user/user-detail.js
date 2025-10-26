import { User } from "../../../service/user.service.js";
const user = new User();

let userList;
let userData;

// Get URL To Get ID PRODUCT
const query = window.location.search;
let userId = query.substring(1);

// Print Data

const name = document.querySelector("#name");
const image = document.querySelector("#image");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const status = document.querySelector("#status");
const address = document.querySelector("#address");
const role = document.querySelector("#role");


const printData = (userData) => {
    name.value = userData.name;
    image.src = userData.avatar;
    email.value = userData.email;
    phone.value = userData.phone;
    status.value = userData.status == 1 ? "Hoạt động" : "Vô hiệu hóa";
    address.value = userData.address;
    role.value = userData.role == 1 ? "Admin" : "User";
};

async function userLoading() {
    await user.userLoadData();
    userList = user.getUserList();
    userData = userList.find(item => item.id == userId);

    console.log(userData);

    printData(userData);
}

userLoading();