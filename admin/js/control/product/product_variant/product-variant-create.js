import { Product } from "../../../../service/product.service.js";

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
    let alertElement = document.querySelector("#alert_success");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = "Thêm thành công";

    turnOffAlert(alertElement, "update_success");
}

if (sessionStorage.getItem("update_danger")) {
    let alertElement = document.querySelector("#alert_danger");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = "Thêm thất bại. Lỗi hệ thống";

    turnOffAlert(alertElement, "update_danger");
}

// ---------------------------------------------------------------------------------------------------

const product = new Product();
let productData = [];
let productList = [];

// Get URL To Get ID PRODUCT
const query = window.location.search;
let productId = query.substring(1);

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

// // Create

const openModalCreate = () => {
    const createBtn = document.querySelector("#create_btn_modal");
    createBtn.addEventListener("click", () => {
        document.querySelector("#modal-create-variant").style.display = "block";
    });
};

const closeModalCreate = () => {
    const closeCreateBtn = document.querySelector("#close_modal_create");
    closeCreateBtn.addEventListener("click", () => {
        document.querySelector("#modal-create-variant").style.display = "none";
    });
};
// ERROR CHECK
const checkCanCreate = (nameValue, imageValue, priceValue, quantityValue, colorNameValue, romValue, ramValue) => {
    const nameError = document.querySelector("#variant_name_error");
    const imageError = document.querySelector("#variant_image_error");
    const priceError = document.querySelector("#variant_price_error");
    const quantityError = document.querySelector("#variant_quantity_error");
    const colorError = document.querySelector("#variant_color_error");
    const romError = document.querySelector("#variant_rom_error");
    const ramError = document.querySelector("#variant_ram_error");

    let isError = false;
    const ERRORTEXT = "Không được để trống";

    if (!nameValue || !priceValue || !quantityValue || !colorNameValue || !romValue || !ramValue || !imageValue)
        isError = true;

    if (isError) {
        if (!nameValue) {
            nameError.innerHTML = ERRORTEXT;
        } else {
            nameError.innerHTML = "";
        }

        if (!imageValue) {
            imageError.innerHTML = ERRORTEXT;
        } else {
            imageError.innerHTML = "";
        }

        if (!priceValue) {
            priceError.innerHTML = ERRORTEXT;
        } else {
            priceError.innerHTML = "";
        }

        if (!quantityValue) {
            quantityError.innerHTML = ERRORTEXT;
        } else {
            quantityError.innerHTML = "";
        }

        if (!colorNameValue) {
            colorError.innerHTML = ERRORTEXT;
        } else {
            colorError.innerHTML = "";
        }

        if (!romValue) {
            romError.innerHTML = ERRORTEXT;
        } else {
            romError.innerHTML = "";
        }

        if (!ramValue) {
            ramError.innerHTML = ERRORTEXT;
        } else {
            ramError.innerHTML = "";
        }

        return false;
    }

    return true;
};

const getValue = () => {
    const variantName = document.querySelector("#new_variant_name");
    const variantPrice = document.querySelector("#new_variant_price");
    const variantQuantity = document.querySelector("#new_variant_quantity");
    const variantColorName = document.querySelector("#new_variant_color_name");
    const variantColorCode = document.querySelector("#new_variant_color_code");
    const variantRom = document.querySelector("#new_variant_rom");
    const variantRam = document.querySelector("#new_variant_ram");
    const imageTemp = document.querySelector("#image_file");

    let canCreate = checkCanCreate(variantName.value, imageTemp.value, variantPrice.value, variantQuantity.value,
        variantColorName.value, variantRom.value, variantRam.value);

    if (!canCreate) return null;

    let nameDuplicate = productData.product_variants.find(item => item.variant_name == variantName.value);
    const nameError = document.querySelector("#variant_name_error");
    if (nameDuplicate) {
        nameError.innerText = "Đã tồn tại biến thể với tên này";
        return null;
    } else {
        nameError.innerText = "";
    }

    let objectToCreate = {
        "variant_name": variantName.value,
        "price": variantPrice.value,
        "quantity": variantQuantity.value,
        "image_temp": imageTemp.files[0], //FILE NOT VALUE
        "color": variantColorName.value,
        "ram": variantRam.value,
        "color_code": variantColorCode.value,
        "rom": variantRom.value
    }

    return objectToCreate;
};

async function createAction() {
    let objectToCreateTemp = getValue();

    if (objectToCreateTemp == null) return;

    let imageFile = objectToCreateTemp.image_temp;
    await uploadImage(imageFile);

    let idToCreate = Math.random().toString(36).substring(2, 6);

    let objectVariant = {
        "id": idToCreate,
        "variant_name": objectToCreateTemp.variant_name,
        "price": objectToCreateTemp.price,
        "quantity": objectToCreateTemp.quantity,
        "image": imageToCreate, //URL Image
        "color": objectToCreateTemp.color,
        "ram": objectToCreateTemp.ram,
        "color_code": objectToCreateTemp.color_code,
        "rom": objectToCreateTemp.rom
    }

    // Add In To Product Variant
    productData.product_variants.push(objectVariant);

    let objectToCreate = {
        name: productData.name,
        image: productData.image, //RESULT IMAGE
        description: productData.description,
        category_id: productData.category_id,
        status: productData.status,
        base_price: productData.base_price,
        product_variants: productData.product_variants
    }

    product.productUpdate(productId, objectToCreate);
}

const createEventHandle = () => {
    const btnCreate = document.querySelector("#create_btn_submit");
    btnCreate.addEventListener("click", createAction);
}

// LOADING ----------------------------------
async function productLoading() {
    await product.productLoadData();
    productList = product.getProductList();
    await product.productDetailLoad(productId);
    productData = product.getProductOne();

    openModalCreate();
    closeModalCreate();

    selectImageEventHandle();
    createEventHandle();
}

productLoading();


