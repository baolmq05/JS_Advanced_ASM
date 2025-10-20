import { Product } from "../../../service/product.service.js";
import { Category } from "../../../service/category.service.js";

const CLOUD_NAME = "dztcimwoe";
const UPLOAD_PRESET = "quocbaoimage";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

let imageToCreate = ``;

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

const category = new Category();
const product = new Product();
let productList = [];
let categoryList = [];

const renderCategorySelect = () => {
    const categorySelectE = document.querySelector("#category");

    categoryList.forEach(item => {
        if (item.parent_id == null || item.parent_id == "") {
            console.log("Nothing");
        } else {
            let newOption = document.createElement("option");
            newOption.value = item.id;
            newOption.innerText = item.name;

            categorySelectE.appendChild(newOption);
        }
    });
};

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
    let imageFile = document.querySelector("#image_file");
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
    let imageFile = document.querySelector("#image_file");
    imageFile.addEventListener("change", (e) => {
        previewImage(e.target.files[0]);
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

// // Create

const checkCanCreate = (nameValue, imageValue, basePriceValue, categoryValue) => {
    let isError = false;
    const nameError = document.querySelector("#name_error");
    const imageError = document.querySelector("#image_error");
    const basePriceError = document.querySelector("#base_price_error");
    const categoryError = document.querySelector("#category_error");

    const ERRORTEXT = "Không được bỏ trống";

    if (!nameValue) {
        isError = true;
    }

    if (!imageValue) {
        isError = true;
    }

    if (!basePriceValue) {
        isError = true;
    }

    if (!categoryValue) {
        isError = true;
    }

    if (isError) {
        if (!nameValue) {
            nameError.innerText = ERRORTEXT;
        } else {
            nameError.innerText = "";
        }

        if (!imageValue) {
            imageError.innerText = ERRORTEXT;
        } else {
            imageError.innerText = "";
        }

        if (!basePriceValue) {
            basePriceError.innerText = ERRORTEXT;
        } else {
            basePriceError.innerText = "";
        }

        if (!categoryValue) {
            categoryError.innerText = ERRORTEXT;
        } else {
            categoryError.innerText = "";
        }

        return false;
    }

    return true;
};

const getData = () => {
    let name = document.querySelector("#name");
    let basePrice = document.querySelector("#base_price");
    let descriptionValue = CKEDITOR.instances.editor.getData();;
    let category = document.querySelector("#category");
    let imageTemp = document.querySelector("#image_file");

    let canCreate = checkCanCreate(name.value, imageTemp.value, basePrice.value, category.value);

    if (!canCreate) {
        return null;
    }

    let nameDuplicate = productList.find(item => item.name == name.value);

    if (nameDuplicate) {
        const nameError = document.querySelector("#name_error");
        nameError.innerText = "Sản phẩm đã trùng";
        return null;
    }

    let productObj = {
        name: name.value,
        image_temp: imageTemp.files[0], //FILE NOT VALUE
        description: descriptionValue,
        category_id: category.value,
        base_price: basePrice.value,
    }

    return productObj;
};

async function createAction() {
    let objectToCreateTemp = getData();
    if (objectToCreateTemp == null) return;

    let imageFile = objectToCreateTemp.image_temp;

    await uploadImage(imageFile);

    let objectToCreate = {
        name: objectToCreateTemp.name,
        image: imageToCreate, //RESULT IMAGE
        description: objectToCreateTemp.description,
        category_id: objectToCreateTemp.category_id,
        base_price: objectToCreateTemp.base_price,
    }
    product.productCreate(...Object.values(objectToCreate));
};

// ACTION ----------------------------------
async function productLoading() {
    await category.categoryLoadData();
    categoryList = category.getCategoryList();
    await product.productLoadData();
    productList = product.getProductList();

    renderCategorySelect();

    selectImageEventHandle();

    const createBtn = document.querySelector("#create_btn");
    createBtn.addEventListener("click", createAction);
}

productLoading();