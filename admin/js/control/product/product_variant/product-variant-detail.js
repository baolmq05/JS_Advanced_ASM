import { Product } from "../../../../service/product.service.js";

const product = new Product();

// GET URL TO GET ID PRODUCT
const query = window.location.search;
let productId = query.substring(1);

let productList = [];
let productData = [];
let productVariantData = [];

const renderVariantData = (variantCurrent) => {
    let variantName = document.querySelector("#variant_name");
    let variantPrice = document.querySelector("#variant_price");
    let variantQuantity = document.querySelector("#variant_quantity");
    let variantImage = document.querySelector("#variant_image");
    let variantColor = document.querySelector("#variant_color");
    let variantColorCode = document.querySelector("#variant_color_code");
    let variantRom = document.querySelector("#variant_rom");
    let variantRam = document.querySelector("#variant_ram");

    variantName.value = variantCurrent.variant_name;
    variantPrice.value = variantCurrent.price;
    variantQuantity.value = variantCurrent.quantity;
    variantImage.src = variantCurrent.image;
    variantColor.innerText = variantCurrent.color;
    variantColorCode.style.backgroundColor = variantCurrent.color_code;
    variantRom.innerText = variantCurrent.rom;
    variantRam.innerText = variantCurrent.ram;
};

const openModalVariant = () => {
    const modalDetail = document.querySelector("#variant_detail_modal");
    modalDetail.style.display = "block";
};

const closeModalVariant = () => {
    let closeBtn = document.querySelector("#close_modal_detail");

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            const modalDetail = document.querySelector("#variant_detail_modal");
            modalDetail.style.display = "none";
            console.log("Click");
        });
    } else {
        console.log("Not thing");
    }
}

window.findVariant = (variantId) => {
    let variantCurrent = productVariantData.find(item => item.id == variantId);
    renderVariantData(variantCurrent);
    openModalVariant();
};

async function productLoading() {
    await product.productLoadData();
    productList = product.getProductList();
    await product.productDetailLoad(productId);
    productData = product.getProductOne();
    productVariantData = productData.product_variants;

    console.log(productVariantData);
    closeModalVariant();
}

productLoading();

