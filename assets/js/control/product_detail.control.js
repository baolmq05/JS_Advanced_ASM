import { Product } from "../service/product.service.js";

const product = new Product();
let productList = [];
let productData = [];
let productVariant = [];

// Get URL To Get ID PRODUCT
const query = window.location.search;
let productId = query.substring(1);

const productName = document.querySelector("#product_name");
const productPrice = document.querySelector("#product_price");
const productDescription = document.querySelector("#product_description");
const productImage = document.querySelector("#main-image-detail");
const quantityContainer = document.querySelector("#quantity_container");
const gallaryContainer = document.querySelector("#gallary-container");

async function productLoading() {
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
        quantityContainer.innerHTML = '<span class="badge bg-danger">Hết hàng</span>';
    } else {
        quantityContainer.innerHTML = "<strong>Số lượng: </strong>" + quantity;
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

            // Quantity
            quantityEnable(item.getAttribute("data-quantity"));

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
    console.log(variants);

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

// Call main function
productLoading();