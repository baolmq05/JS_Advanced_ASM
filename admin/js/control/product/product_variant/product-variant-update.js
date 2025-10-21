import { Product } from "../../../../service/product.service.js";

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

if (sessionStorage.getItem("update_success")) {
    let alertElement = document.querySelector("#alert_success");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = "Cập nhật thành công";

    turnOffAlert(alertElement, "update_success");
}

if (sessionStorage.getItem("update_danger")) {
    let alertElement = document.querySelector("#alert_danger");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = "Cập nhật thất bại. Lỗi hệ thống";

    turnOffAlert(alertElement, "update_danger");
}

// ---------------------------------------------------------------------------------------------------

// Get URL To Get ID PRODUCT
const query = window.location.search;
let productId = query.substring(1);
let isUpload = false;

const product = new Product();
let productData = [];
let variantIdGlobal;
let productVariantGlobal;
let imageToCreate;

const renderingData = (variant_id) => {
    let productVariant = productData.product_variants.find(item => item.id == variant_id);
    productVariantGlobal = productVariant;

    console.log(productVariantGlobal);

    const variantName = document.querySelector("#variant_name_edit");
    const variantPrice = document.querySelector("#variant_price_edit");
    const variantQuantity = document.querySelector("#variant_quantity_edit");
    const variantColorName = document.querySelector("#variant_color_name_edit");
    const variantColorCode = document.querySelector("#variant_color_code_edit");
    const variantRom = document.querySelector("#variant_rom_edit");
    const variantRam = document.querySelector("#variant_ram_edit");
    const imageTemp = document.querySelector("#image_file2");
    const imageCurrentRender = document.querySelector("#image_current");

    variantName.value = productVariant.variant_name;
    variantPrice.value = productVariant.price;
    variantQuantity.value = productVariant.quantity;
    variantColorName.value = productVariant.color;
    variantColorCode.value = productVariant.color_code;
    imageCurrentRender.src = productVariant.image;

    Array.from(variantRom).forEach(item => {
        if (item.value == productVariant.rom) {
            item.selected = true;
        }
    })

    Array.from(variantRam).forEach(item => {
        if (item.value == productVariant.ram) {
            item.selected = true;
        }
    })
};

const openModalUpdate = () => {
    const modalUpdate = document.querySelector("#modal-update-variant");
    modalUpdate.style.display = "block";
};

const closeModalUpdate = () => {
    const closeBtn = document.querySelector("#close_modal_update");
    closeBtn.addEventListener("click", () => {
        const modalUpdate = document.querySelector("#modal-update-variant");
        modalUpdate.style.display = "none";
    })
};

window.getVariantId = (variant_id) => {
    variantIdGlobal = variant_id;
    console.log(variant_id);
    renderingData(variant_id);
    openModalUpdate();
};

async function productLoading() {
    await product.productDetailLoad(productId);
    productData = product.getProductOne();
    createEventHandle();
    selectImageEventHandle();
}

productLoading();
closeModalUpdate();

// -----------------------------------------------------


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
    let imageFile = document.querySelector("#image_file2");
    imageFile.value = '';
};

const previewImage = (file) => {
    console.log(file);

    let previewContainer = document.querySelector(".preview_container2");
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
    let imageFile = document.querySelector("#image_file2");
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

    let previewContainer = document.querySelector(".preview_container2");
    previewContainer.innerHTML = '';
    previewContainer.style.display = 'none';
}

const checkCanUpdate = (nameValue, priceValue, quantityValue, colorNameValue, romValue, ramValue) => {
    const nameError = document.querySelector("#variant_name_error");
    const priceError = document.querySelector("#variant_price_error");
    const quantityError = document.querySelector("#variant_quantity_error");
    const colorError = document.querySelector("#variant_color_error");
    const romError = document.querySelector("#variant_rom_error");
    const ramError = document.querySelector("#variant_ram_error");

    let isError = false;
    const ERRORTEXT = "Không được để trống";

    if (!nameValue || !priceValue || !quantityValue || !colorNameValue || !romValue || !ramValue)
        isError = true;

    if (isError) {
        if (!nameValue) {
            nameError.innerHTML = ERRORTEXT;
        } else {
            nameError.innerHTML = "";
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
    const variantName = document.querySelector("#variant_name_edit");
    const variantPrice = document.querySelector("#variant_price_edit");
    const variantQuantity = document.querySelector("#variant_quantity_edit");
    const variantColorName = document.querySelector("#variant_color_name_edit");
    const variantColorCode = document.querySelector("#variant_color_code_edit");
    const variantRom = document.querySelector("#variant_rom_edit");
    const variantRam = document.querySelector("#variant_ram_edit");
    const imageTemp = document.querySelector("#image_file2");

    let canCreate = checkCanUpdate(variantName.value, variantPrice.value, variantQuantity.value,
        variantColorName.value, variantRom.value, variantRam.value);

    if (!canCreate) return null;

    let nameDuplicate = productData.product_variants.find(item => item.variant_name == variantName.value && item.id != variantIdGlobal);
    const nameError = document.querySelector("#variant_name_error");
    if (nameDuplicate) {
        nameError.innerText = "Đã tồn tại biến thể với tên này";
        return null;
    } else {
        nameError.innerText = "";
    }

    let imageFile;

    if (imageTemp.value == "") {
        isUpload = false;
    } else {
        isUpload = true;
        imageFile = imageTemp.files[0];
    }

    let objectToUpdate = {
        "variant_name": variantName.value,
        "price": variantPrice.value,
        "quantity": variantQuantity.value,
        "image_temp": imageFile,
        "color": variantColorName.value,
        "ram": variantRam.value,
        "color_code": variantColorCode.value,
        "rom": variantRom.value
    }

    return objectToUpdate;
};

async function updateAction() {
    let objectToUpdateTemp = getValue();

    if (objectToUpdateTemp == null) return;

    let imageFile = objectToUpdateTemp.image_temp;
    if (isUpload) {
        await uploadImage(imageFile);
    } else {
        imageToCreate = productVariantGlobal.image;
    }

    let objectVariant = {
        "id": variantIdGlobal,
        "variant_name": objectToUpdateTemp.variant_name,
        "price": objectToUpdateTemp.price,
        "quantity": objectToUpdateTemp.quantity,
        "image": imageToCreate, //URL Image
        "color": objectToUpdateTemp.color,
        "ram": objectToUpdateTemp.ram,
        "color_code": objectToUpdateTemp.color_code,
        "rom": objectToUpdateTemp.rom
    }

    let productVariantFilted = productData.product_variants.filter(item => {
        return item.id != variantIdGlobal;
    })

    productVariantFilted.push(objectVariant);

    productData.product_variants = productVariantFilted;

    let objectToUpdate = {
        name: productData.name,
        image: productData.image,
        description: productData.description,
        category_id: productData.category_id,
        status: productData.status,
        base_price: productData.base_price,
        product_variants: productData.product_variants // Mảng đã được xóa variant
    };

    product.productUpdate(productId, objectToUpdate);
}

const createEventHandle = () => {
    const btnCreate = document.querySelector("#update_btn_submit");
    btnCreate.addEventListener("click", updateAction);
}