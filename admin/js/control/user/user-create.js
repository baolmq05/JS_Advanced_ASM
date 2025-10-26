import { User } from "../../../service/user.service.js";

const CLOUD_NAME = "dztcimwoe";
const UPLOAD_PRESET = "quocbaoimage";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// Session(Alert)
const turnOffAlert = (alertElement, sessionName) => {
    sessionStorage.removeItem(sessionName);
    setTimeout(() => {
        alertElement.style.display = "none";
    }, 3000);
};

if (sessionStorage.getItem("create_success")) {
    let alertSuccessValue = sessionStorage.getItem("create_success");
    let alertElement = document.querySelector("#alert_success");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertSuccessValue;

    turnOffAlert(alertElement, "create_success");
}

if (sessionStorage.getItem("create_danger")) {
    let alertDangerValue = sessionStorage.getItem("create_danger");
    let alertElement = document.querySelector("#alert_danger");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertDangerValue;

    turnOffAlert(alertElement, "create_danger");
}

// ---------------------------------------------------------------------------------------------------

const user = new User();
let imageToCreate;

const name = document.querySelector("#name");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const address = document.querySelector("#address");
const image = document.querySelector("#image");
const password = document.querySelector("#password");

let fileImageTarget;

async function userLoading() {
    await user.userLoadData();
    createEventHandle();
    selectImageEventHandle();
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

// IMAGE UPLOAD METHOD======================================================
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
    removeImageFile();

    let imageFile = document.querySelector("#image");
    imageFile.addEventListener("change", (e) => {
        let file = e.target.files[0];
        fileImageTarget = file;
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
        imageToCreate = uploadedUrl.url;
        console.log("IMAGE LẤY ĐƯỢC LÀ: " + imageToCreate);
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
// =======================================================================

const checkCanCreate = () => {
    let isError = false;
    const ERRORTEXT = "Không được để trống";
    if (!name.value || !email.value || !password.value) {
        isError = true;
    }

    if (isError) {
        if (!name.value) {
            document.querySelector("#name_error").innerHTML = ERRORTEXT;
        }
        if (!email.value) {
            document.querySelector("#email_error").innerHTML = ERRORTEXT;
        }
        if (!password.value) {
            document.querySelector("#password_error").innerHTML = ERRORTEXT;
        }

        return false;
    }

    return true;
}

async function create() {
    if (!checkCanCreate()) return;

    let avatarUrl;

    if (image.value == "") {
        avatarUrl = "";
    } else {
        await uploadImage(fileImageTarget);
        avatarUrl = imageToCreate;
    }

    let objectToCreate = {
        name: name.value,
        email: email.value,
        avatar: avatarUrl,
        phone: phone.value,
        address: address.value,
        password: password.value,
        role: 0,
        status: 1
    }

    user.userCreate(objectToCreate);
}

const createEventHandle = () => {
    const createBtn = document.querySelector("#create_btn");
    createBtn.addEventListener("click", create);
}

userLoading();
