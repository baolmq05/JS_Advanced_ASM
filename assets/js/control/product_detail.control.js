import { Product } from "../service/product.service.js";
import { Cart } from "../service/cart.service.js";

// Session (Alert)
const turnOffAlert = (alertElement) => {
    setTimeout(() => {
        alertElement.style.display = "none";
    }, 3000);
};

const turnOnAlert = (type, stringValue) => {
    let alertElement = document.querySelector(type);
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = stringValue;

    turnOffAlert(alertElement);
}

if (sessionStorage.getItem("add_success")) {
    turnOnAlert("#alert_success", "Thêm thành cônng");
    sessionStorage.removeItem("add_success");
}

if (sessionStorage.getItem("admin_cant_buy")) {
    let alertElement = document.querySelector("#alert_danger");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = sessionStorage.getItem("admin_cant_buy");

    sessionStorage.removeItem("admin_cant_buy");
    turnOffAlert(alertElement);
}
// ----------------------------------------------------

const product = new Product();
let productList = [];
let productData = [];
let productVariant = [];

// Get URL To Get ID PRODUCT
const query = window.location.search;
let productId = query.substring(1);

if (productId == "") {
    window.location.href = "./product.html";
}

const productName = document.querySelector("#product_name");
const productPrice = document.querySelector("#product_price");
const productDescription = document.querySelector("#product_description");
const productImage = document.querySelector("#main-image-detail");
const quantityContainer = document.querySelector("#quantity_container");

// User ID By Session
let userId = '';
if (sessionStorage.getItem("client_allow")) {
    userId = sessionStorage.getItem("client_allow");
}

// Variable For Cart
const cart = new Cart();
let cartList = [];
let variantIdCurrent = ``;
let unitPriceCurrent = 0;

async function productLoading() {
    await cart.cartLoadData();
    cartList = cart.getCartList();
    await product.productLoadData();
    productList = product.getProductList();
    await product.productDetailLoad(productId);
    productData = product.getProductOne();

    renderData();
    variantEventClick();
    printRelationProduct(getProductRelation());
}

const renderData = () => {
    productName.innerText = productData.name;
    productPrice.innerText = product.formatPrice(productData.base_price);
    productDescription.innerHTML = productData.description;
    productImage.src = productData.image;

    renderVariant();
};

// Render function
const renderVariant = () => {
    let variantContainer = document.querySelector("#variant_container");
    productVariant = productData.product_variants;
    productVariant.forEach(item => {
        let newVariantBtn = document.createElement("button");

        newVariantBtn.setAttribute("data-id", item.id);
        newVariantBtn.setAttribute("data-name", item.variant_name);
        newVariantBtn.setAttribute("data-image", item.image);
        newVariantBtn.setAttribute("data-price", item.price);
        newVariantBtn.setAttribute("data-quantity", item.quantity);

        newVariantBtn.classList.add("btn", "btn-outline-dark", "me-2", "my-2", "variant");

        newVariantBtn.innerHTML = item.color + ((item.rom && item.ram) ? " - (" + item.rom + " + " + item.ram + ")" : "");


        variantContainer.appendChild(newVariantBtn);
    });
    let brElement = document.createElement("br");
    let errorElement = document.createElement("span");
    errorElement.classList.add("badge");
    errorElement.classList.add("bg-danger");
    errorElement.classList.add("variant_error");
    errorElement.innerText = "Vui lòng chọn loại";
    errorElement.style.display = "none";
    variantContainer.appendChild(brElement);
    variantContainer.appendChild(errorElement);
}

// ChangeData function
// const imageDefaultBeforeChange = (imageSrc) => {
//     productImage.src = imageSrc;
// };

// Change gallary
// window.imageChangeByClick = (imageSrc) => {
//     productImage.src = imageSrc;
// };

// const createImageGallary = (images) => {
//     // Clear container
//     document.querySelector("#gallary-container").innerHTML = "";

//     images.forEach(imageItem => {
//         let imageBox = document.createElement("div");
//         imageBox.classList.add("image-detail");
//         let image = `<img src="${imageItem}" onclick="imageChangeByClick('${imageItem}')">`

//         imageBox.innerHTML = image;

//         gallaryContainer.appendChild(imageBox);
//     });

//     imageDefaultBeforeChange(images[0]);
// };

const changeName = (nameAttribute) => {
    productName.innerHTML = nameAttribute;
}

const changePrice = (priceAttribute) => {
    productPrice.innerHTML = product.formatPrice(Number(priceAttribute));
}

const quantityEnable = (quantityAttribute) => {
    let quantity = Number(quantityAttribute);
    if (quantity <= 0) {
        quantityContainer.innerHTML = '<h4><span class="badge bg-danger">Hết hàng</span></h4>';
        document.querySelector("#add_to_cart_text").style.display = 'none';
        document.querySelector("#action_container").style.display = 'none';
        document.querySelector("#price_container").style.display = "none";
    } else {
        quantityContainer.innerHTML = `<h5>Tồn kho: ${quantity}</h5>`;
        document.querySelector("#add_to_cart_text").style.display = 'block';
        document.querySelector("#action_container").style.display = 'block';
        document.querySelector("#price_container").style.display = "block";
    }
}

// Event handle
const variantEventClick = () => {
    const variants = document.getElementsByClassName("variant");

    Array.from(variants).forEach(item => {
        item.addEventListener("click", () => {
            clearStyleVariant();

            item.style.backgroundColor = "black";
            item.style.color = "white";

            // Print data
            changeName(item.getAttribute("data-name"));
            changePrice(item.getAttribute("data-price"));
            productImage.src = item.getAttribute("data-image");

            // Set to add cart
            variantIdCurrent = item.getAttribute("data-id");
            unitPriceCurrent = Number(item.getAttribute("data-price"));

            // Quantity
            quantityEnable(item.getAttribute("data-quantity"));


            document.querySelector(".variant_error").style.display = "none";

            //Image Gallary
            // let id = item.getAttribute("data-id");
            // let variantCurrent = productVariant.find(variant_id => variant_id.id == id);
            // let images = variantCurrent.image;

            // createImageGallary(images);
        })
    });
}

const clearStyleVariant = () => {
    const variants = document.getElementsByClassName("variant");

    Array.from(variants).forEach(item => {
        item.style.backgroundColor = "white";
        item.style.color = "black";
    });
}

// Product Relation
const getProductRelation = () => {
    let productRelation = productList.filter(item => item.category_id == productData.category_id);

    if (productRelation.length >= 4) {
        productRelation = productRelation.slice(0, 4);
    }

    return productRelation;
};

const printRelationProduct = (productRelationData) => {
    let htmlListRelation = '';

    productRelationData.forEach(item => {
        let newItemHtml = `
            <div class="col-lg-3 mb-5">
                <div class="product-item card">
                    <div class="product-image-box h-240">
                        <img src="${item.image}"
                            class="card-img-top product-image" alt="...">
                    </div>
                    <div class="card-body">
                        <h5 class="product-title card-title">
                            <a href="../page/product-detail.html?${item.id}" class="text-decoration-none text-dark">
                                ${item.name}
                            </a>
                        </h5>
                        <p class="">Giá: <span class="fw-bold">${product.formatPrice(item.base_price)}</span></p>
                        <a href="../page/product-detail.html?${item.id}" class="btn btn-outline-secondary">Xem chi tiết</a>
                    </div>
                </div>
            </div>
        `;

        htmlListRelation += newItemHtml;
    });

    document.querySelector("#relation_list").innerHTML = htmlListRelation;
};

// Cart action
const addToCartAction = () => {
    if (userId == "" || !sessionStorage.getItem("client_allow")) {
        sessionStorage.setItem("must_cart", "Vui lòng đăng nhập");
        window.location.href = "http://127.0.0.1:5501/page/login.html";
    }

    if (sessionStorage.getItem("admin_allow")) {
        sessionStorage.setItem("admin_cant_buy", "Quản trị viên không thể mua hàng");
        window.location.reload();
        return;
    }

    if (variantIdCurrent == "") {
        document.querySelector(".variant_error").style.display = "inline";
        return;
    }

    let cartCurrent = cartList.find(item => item.user_id == userId);

    document.querySelector(".variant_error").style.display = "none";
    let productIdCurrent = productId;
    let quantityToAdd = document.querySelector("#input-quantity").value;

    // check quantity
    let productCurrent = productList.find(item => item.id == productIdCurrent);
    let variantCurrent = productCurrent.product_variants.find(item => item.id == variantIdCurrent);
    let quantityLimit = variantCurrent.quantity;

    if (quantityToAdd > quantityLimit) {
        turnOnAlert("#alert_danger", "Vượt quá số lượng kho");
        return;
    }

    // Add action
    cart.update(cartCurrent.id, productIdCurrent, variantIdCurrent, unitPriceCurrent, Number(quantityToAdd));
}

const addToCartBtn = document.querySelector("#add_to_card");
addToCartBtn.addEventListener("click", addToCartAction);


// Call main function
productLoading();