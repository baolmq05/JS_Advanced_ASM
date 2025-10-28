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
let productId = query.substring(1);

const category = new Category();
const product = new Product();
let productList = [];
let productData = [];
let categoryList = [];

const renderData = () => {
    let isFeatured = document.querySelector("#is_featured");
    let name = document.querySelector("#name");
    let basePrice = document.querySelector("#base_price");
    let status = document.querySelector("#status").children;

    name.value = productData.name;
    basePrice.value = productData.base_price;
    CKEDITOR.instances.editor.setData(productData.description);

    Array.from(isFeatured.children).forEach(item => {
        console.log(item);
        if (item.value == productData.is_featured) {
            item.selected = true;
        }
    });

    Array.from(status).forEach(item => {
        console.log(item);
        if (item.value == productData.status) {
            item.selected = true;
        }
    });
};

const renderCategorySelect = () => {
    const categorySelectE = document.querySelector("#category");

    categoryList.forEach(item => {
        if (item.parent_id == null || item.parent_id == "") {
            console.log("Nothing");
        } else {
            let newOption = document.createElement("option");
            newOption.value = item.id;
            newOption.innerText = item.name;

            if (item.id == productData.category_id) {
                newOption.selected = true;
            }

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

// // Update

const checkCanUpdate = (nameValue, imageValue, basePriceValue, categoryValue) => {
    let isError = false;
    const nameError = document.querySelector("#name_error");
    const basePriceError = document.querySelector("#base_price_error");
    const categoryError = document.querySelector("#category_error");

    const ERRORTEXT = "Không được bỏ trống";

    if (!nameValue) {
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
    let isFeatured = document.querySelector("#is_featured");
    let name = document.querySelector("#name");
    let basePrice = document.querySelector("#base_price");
    let descriptionValue = CKEDITOR.instances.editor.getData();;
    let category = document.querySelector("#category");
    let imageTemp = document.querySelector("#image_file");
    let status = document.querySelector("#status");

    let canUpdate = checkCanUpdate(name.value, imageTemp.value, basePrice.value, category.value);

    if (!canUpdate) {
        return null;
    }

    let nameDuplicate = productList.find(item => item.name == name.value && item.id != productId);

    if (nameDuplicate) {
        const nameError = document.querySelector("#name_error");
        nameError.innerText = "Sản phẩm đã trùng";
        return null;
    }

    let imageValue;

    if (!imageTemp.value) {
        imageValue = "";
    } else {
        imageValue = imageTemp.files[0]; //FILE NOT VALUE
    }

    let productObj = {
        name: name.value,
        image_temp: imageValue, //FILE NOT VALUE
        description: descriptionValue,
        category_id: category.value,
        is_featured: isFeatured.value,
        status: status.value,
        base_price: basePrice.value,
        product_variants: productData.product_variants
    }

    return productObj;
};

async function updateAction() {
    let objectToCreateTemp = getData();
    if (objectToCreateTemp == null) return;

    let imageFile = objectToCreateTemp.image_temp;

    console.log(imageFile);

    if (imageFile != "" && imageFile != null) {
        await uploadImage(imageFile);
    } else {
        imageToCreate = productData.image;
    }

    let objectToCreate = {
        name: objectToCreateTemp.name,
        image: imageToCreate, //RESULT IMAGE
        description: objectToCreateTemp.description,
        category_id: objectToCreateTemp.category_id,
        status: objectToCreateTemp.status,
        is_featured: objectToCreateTemp.is_featured,
        base_price: Number(objectToCreateTemp.base_price),
        product_variants: objectToCreateTemp.product_variants
    }

    product.productUpdate(productId, objectToCreate);
};

// ACTION ----------------------------------
async function productLoading() {
    await category.categoryLoadData();
    categoryList = category.getCategoryList();
    await product.productLoadData();
    productList = product.getProductList();
    await product.productDetailLoad(productId);
    productData = product.getProductOne();

    renderCategorySelect();

    renderData();

    selectImageEventHandle();

    const updateBtn = document.querySelector("#create_btn");
    updateBtn.addEventListener("click", updateAction);
}

productLoading();