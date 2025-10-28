import { User } from "../service/user.service.js";

const CLOUD_NAME = "dztcimwoe";
const UPLOAD_PRESET = "quocbaoimage";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// Session (Alert)
const turnOffAlert = (alertElement, sessionName) => {
    sessionStorage.removeItem(sessionName);
    setTimeout(() => {
        alertElement.style.display = "none";
    }, 3000);
};

if (sessionStorage.getItem("update_success")) {
    let alertSuccessValue = sessionStorage.getItem("update_success");
    let alertElement = document.querySelector("#alert_success");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertSuccessValue;

    turnOffAlert(alertElement, "update_success");
}

let fullname = document.querySelector("#fullname");
let email = document.querySelector("#email");
let phone = document.querySelector("#phone");
let address = document.querySelector("#address");
let image = document.querySelector("#image");
let imageShow = document.querySelector("#image_show_current");

const user = new User();
let userId = sessionStorage.getItem("client_allow");
let userList = [];
let userCurrent = [];

console.log(userId);

let imageToUpdate;

async function userLoading() {
    await user.userLoadData();
    userList = user.getUserList();

    userCurrent = userList.find(item => item.id == userId);
    renderData();
    selectImageEventHandle();
    updateEventHandle();
}

// RENDER
const renderData = () => {
    fullname.value = userCurrent.name;
    email.value = userCurrent.email;
    phone.value = userCurrent.phone;
    address.value = userCurrent.address;
    imageShow.src = userCurrent.avatar;
}

// UPDATE ====================================================================================================

const toogleSpinerLoad = (turnOn) => {
    if (turnOn) {
        document.body.classList.add('show');
        document.querySelector(".spinner_container").style.display = "flex";
    } else {
        document.body.classList.remove('show');
        document.querySelector(".spinner_container").style.display = "none";
    }
}
// Image Get And Event

const removeImageFile = () => {
    let imageFile = document.querySelector("#image");
    imageFile.value = '';
};

const previewImage = (file) => {
    console.log(file);

    let previewContainer = document.querySelector(".preview_container");
    previewContainer.style.display = "flex";

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
        const colDiv = document.createElement('div');
        colDiv.classList.add('col-6', 'col-md-3', 'mt-3');

        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('position-relative', 'mb-3', 'image-box');
        imgWrapper.dataset.filename = file.name;

        const img = document.createElement('img');
        img.src = reader.result;
        img.style.width = "100%";
        img.classList.add('preview-img');

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('bi', 'bi-x-circle-fill', 'text-danger', 'position-absolute', 'top-0', 'start-100', 'translate-middle');
        deleteIcon.style.fontSize = "24px";
        deleteIcon.style.cursor = "pointer";
        deleteIcon.addEventListener('click', () => {
            // Remove Image Here
            colDiv.remove();
            removeImageFile();
            previewContainer.style.display = "none";
            console.log(`Đã xóa ảnh: ${file.name}`);
        });

        imgWrapper.appendChild(img);
        imgWrapper.appendChild(deleteIcon);
        colDiv.appendChild(imgWrapper);
        previewContainer.appendChild(colDiv);
    }
};

const selectImageEventHandle = () => {
    let imageFile = document.querySelector("#image");
    imageFile.addEventListener("change", (e) => {
        let file = e.target.files[0];
        if (file.type.startsWith('image/'))
            previewImage(file);
        else {
            alert("Vui lòng chọn file ảnh định dạng png hoặc jpg");
            imageFile.value = "";
        }
    });
};

async function uploadImage(imageFile) {
    toogleSpinerLoad(true);

    console.log("Start Upload...");
    // Loading page

    // uploadAllButton.disabled = true;

    let uploadedUrl;

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'QuocBaoImage');

    try {
        console.log(`Đang tải lên: ${imageFile.name}`);
        const response = await axios.post(CLOUDINARY_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        uploadedUrl = { name: imageFile.name, url: response.data.secure_url };
        console.log(`Tải lên thành công (${imageFile.name}): ${response.data.secure_url}`);

        // URL GETTED =================================
        imageToUpdate = uploadedUrl.url;
        console.log("IMAGE LẤY ĐƯỢC LÀ: " + imageToUpdate);
    } catch (error) {
        console.error(`Lỗi khi tải lên file ${imageFile.name}:`, error.response ? error.response.data : error.message);
        alert(`Tải lên file ${imageFile.name} thất bại! Vui lòng kiểm tra console.`);
        // uploadAllButton.disabled = false;
        return;
    }

    // uploadAllButton.disabled = false;
    toogleSpinerLoad(false);
    console.log("Tất cả URL đã tải lên:", uploadedUrl);

    removeImageFile();

    let previewContainer = document.querySelector(".preview_container");
    previewContainer.innerHTML = '';
    previewContainer.style.display = 'none';
}

// // Update

function validateVietnamesePhoneNumber(phoneNumber) {
    // Regex này kiểm tra 10 chữ số, bắt đầu bằng 0 và theo sau là 
    // các đầu số hợp lệ (3, 5, 7, 8, 9)
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})\b$/;

    // Dùng .test() để kiểm tra
    return regex.test(phoneNumber);
}

const checkCanUpdate = () => {
    let isError = false;

    const ERRORTEXT = "Không được bỏ trống";

    if (!fullname) {
        isError = true;
    }

    if (!email.value) {
        isError = true;
    }

    if (!address.value) {
        isError = true;
    }

    if (!phone.value) {
        isError = true;
    }

    if (!validateVietnamesePhoneNumber(phone.value)) {
        isError = true;
    }

    if (isError) {
        if (!fullname) {
            document.querySelector("#fullname_error").innerText = ERRORTEXT;
        } else {
            document.querySelector("#fullname_error").innerText = "";
        }

        if (!email.value) {
            document.querySelector("#email_error").innerText = ERRORTEXT;
        } else {
            document.querySelector("#email_error").innerText = "";
        }

        if (!address.value) {
            document.querySelector("#address_error").innerText = ERRORTEXT;
        } else {
            document.querySelector("#address_error").innerText = "";
        }

        if (!phone.value) {
            document.querySelector("#phone_error").innerText = ERRORTEXT;
        } else {
            document.querySelector("#phone_error").innerText = "";
        }

        if (!validateVietnamesePhoneNumber(phone.value)) {
            document.querySelector("#phone_error").innerText = "Vui lòng nhập đúng số điện thoại";
        } else {
            document.querySelector("#phone_error").innerText = "";
        }

        return false;
    }

    document.querySelector("#fullname_error").innerText = "";
    document.querySelector("#image_error").innerText = "";
    document.querySelector("#email_error").innerText = "";
    document.querySelector("#address_error").innerText = "";
    document.querySelector("#phone_error").innerText = "";

    return true;
};

async function update() {
    if (!checkCanUpdate()) {
        return;
    }

    let imageFile = image.files[0];

    if (!image.value == "") {
        await uploadImage(imageFile);
        imageFile = imageToUpdate;
    } else {
        imageFile = userCurrent.avatar;
    }

    let objectToUpdate = {
        "name": fullname.value,
        "email": email.value,
        "avatar": imageFile,
        "phone": phone.value,
        "address": address.value,
        "password": userCurrent.password,
        "role": userCurrent.role,
        "status": 1
    }
    console.log(objectToUpdate);

    user.userUpdate(userId, objectToUpdate);
};

const updateEventHandle = () => {
    const updateBtn = document.querySelector("#update_btn");
    updateBtn.addEventListener("click", () => {
        update();
    });
}


// CALL LOADING
userLoading();