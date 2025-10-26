import { User } from "../../../service/user.service.js";

const CLOUD_NAME = "dztcimwoe";
const UPLOAD_PRESET = "quocbaoimage";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

let imageToUpdate = ``;
let fileImageTarget;

// Session(Alert)
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

if (sessionStorage.getItem("update_danger")) {
    let alertDangerValue = sessionStorage.getItem("update_danger");
    let alertElement = document.querySelector("#alert_danger");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertDangerValue;

    turnOffAlert(alertElement, "update_danger");
}

// ---------------------------------------------------------------------------------------------------

// Get URL To Get ID Cate
const query = window.location.search;
let userId = query.substring(1);

const user = new User();
let userList = [];

let name = document.querySelector("#name");
let email = document.querySelector("#email");
let phone = document.querySelector("#phone");
let address = document.querySelector("#address");
let image = document.querySelector("#image");
let status = document.querySelector("#status");
let role = document.querySelector("#role");
// Render
const renderData = (userCurrent) => {
    name.value = userCurrent.name;
    email.value = userCurrent.email;
    phone.value = userCurrent.phone;
    address.value = userCurrent.address;

    Array.from(status.children).forEach(item => {
        if (item.value == userCurrent.status) {
            item.selected = true;
        }
    })

    Array.from(role.children).forEach(item => {
        if (item.value == userCurrent.role) {
            item.selected = true;
        }
    })
}

// UI Spinner Loading

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
    previewContainer.style.display = "block";

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
        if (file.type.startsWith('image/')) {
            fileImageTarget = file;
            previewImage(file);
        }
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

const checkCanUpdate = () => {
    let isError = false;
    const ERRORTEXT = "Không được để trống";
    if (!name.value || !email.value) {
        isError = true;
    }

    if (isError) {
        if (!name.value) {
            document.querySelector("#name_error").innerHTML = ERRORTEXT;
        }
        if (!email.value) {
            document.querySelector("#email_error").innerHTML = ERRORTEXT;
        }

        return false;
    }

    let userCurrent = userList.find(item => item.id == userId);

    if (userCurrent.role == 1) {
        if (role.value == 0) {
            let roleError = document.querySelector("#role_error");
            roleError.innerText = "Không được chuyển vai từ quản trị viên về người dùng";
            return false;
        }
    }

    return true;
}

async function updateAction() {
    if (!checkCanUpdate()) return;

    let avatarUrl;
    let userCurrent = userList.find(item => item.id == userId);

    if (image.value == "") {
        avatarUrl = userCurrent.avatar;
    } else {
        await uploadImage(fileImageTarget);
        avatarUrl = imageToUpdate;
    }

    let objectToUpdate = {
        name: name.value,
        email: email.value,
        avatar: avatarUrl,
        phone: phone.value,
        address: address.value,
        password: userCurrent.password,
        role: role.value,
        status: status.value
    };
    // 

    user.userUpdate(userId, objectToUpdate);
};

// ACTION ----------------------------------
async function userLoading() {
    await user.userLoadData();
    userList = user.getUserList();
    selectImageEventHandle();

    let userCurrent = userList.find(item => item.id == userId);
    console.log(userCurrent);
    renderData(userCurrent);
    const updateBtn = document.querySelector("#update_btn");
    updateBtn.addEventListener("click", updateAction);
}

userLoading();