import { Order } from "../../../service/order.service.js"
import { Product } from "../../../service/product.service.js"

const order = new Order();
let orderList = [];
let orderCurrent = [];

const product = new Product();
let productList = [];

// Get URL To Get ID PRODUCT
const query = window.location.search;
let orderId = query.substring(1);

if (orderId == "") {
    window.location.href = "./order-index.html";
}

async function loading() {
    await order.orderLoadData();
    orderList = order.getOrderList();
    await product.productLoadData();
    productList = product.getProductList();

    orderCurrent = orderList.find(item => item.id == orderId);

    renderOrderCode();
    renderOrderDetailsProduct();
    renderStatus();
    renderUserInfor();

    updateEventHandle();
    renderStatusInModal();
}

const renderOrderCode = () => {
    const orderCode = document.querySelector(".order_code");
    orderCode.innerText = "#" + orderCurrent.order_code;
}

const renderOrderDetailsProduct = () => {
    let detailsHtml = ``;
    let totalPrice = 0;
    orderCurrent.order_details.forEach(item => {
        let productCurrent = productList.find(productItem => productItem.id == item.product_id);
        let variant = productCurrent.product_variants.find(variantItem => variantItem.id == item.variant_id);

        totalPrice += (variant.price * item.quantity);

        let detailItemHtml = `
            <li class="list-group-item d-flex gap-3 py-3">
                <img src="${variant.image}"
                    class="rounded product-item-img" alt="Product Image">

                <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold">${variant.variant_name}</h6>
                    <small class="text-muted d-block">Phân loại: ${variant.color} / ${variant.rom}</small>
                </div>

                <div class="text-end" style="min-width: 120px;">
                    <strong class="text-dark d-block">${order.formatPrice(variant.price)}</strong>
                    <span class="text-muted d-block">SL: x${item.quantity}</span>
                </div>
            </li>
        `;

        detailsHtml += detailItemHtml;
    });

    document.querySelector("#order_details_list").innerHTML = detailsHtml;
    document.querySelector("#total_temp").innerHTML = order.formatPrice(totalPrice);
    document.querySelector("#total_price").innerHTML = order.formatPrice(totalPrice + 30000);
};

const removeClass = (status) => {
    status.classList.remove("bg-warning");
    status.classList.remove("bg-success");
    status.classList.remove("bg-danger");
    status.classList.remove("bg-primary");
}

const renderStatus = () => {
    let paymentStatus = document.querySelector("#payment_status");
    let status = document.querySelector("#status");

    if (orderCurrent.payment_status == 1) {
        paymentStatus.classList.remove("bg-danger");
        paymentStatus.classList.add("bg-success");
        paymentStatus.innerText = "Đã thanh toán";
    } else {
        paymentStatus.classList.remove("bg-success");
        paymentStatus.classList.add("bg-danger");
        paymentStatus.innerText = "Chưa thanh toán";
    }

    if (orderCurrent.status == 0) {
        removeClass(status);

        status.classList.add("bg-primary");
        status.innerText = "Chờ xử lí";
    } else if (orderCurrent.status == 1) {
        removeClass(status);

        status.classList.add("bg-warning");
        status.innerText = "Đang giao";
    } else if (orderCurrent.status == 2) {
        removeClass(status);

        status.classList.add("bg-success");
        status.innerText = "Đã giao";
    } else {
        removeClass(status);

        status.classList.add("bg-danger");
        status.innerText = "Đã hủy";
    }
}

const renderUserInfor = () => {
    let fullname = document.querySelector("#fullname");
    let phone = document.querySelector("#phone");
    let address = document.querySelector("#address");

    fullname.innerText = "Họ và tên: " + orderCurrent.fullname;
    phone.innerText = "Số điện thoại: " + orderCurrent.phone;
    address.innerText = orderCurrent.address;
};

// UPDATE

let statusModal = document.querySelector("#status_modal");
let paymentStatusModal = document.querySelector("#payment_status_modal");

const renderStatusInModal = () => {
    Array.from(statusModal.children).forEach(item => {
        if (item.value == orderCurrent.status) {
            item.selected = true;
        }
    })

    Array.from(paymentStatusModal.children).forEach(item => {
        if (item.value == orderCurrent.payment_status) {
            item.selected = true;
        }
    })
}

const update = () => {
    orderCurrent.status = statusModal.value;
    orderCurrent.payment_status = paymentStatusModal.value;

    let newObjectUpdate = {
        "order_code": orderCurrent.order_code,
        "user_id": orderCurrent.user_id,
        "fullname": orderCurrent.fullname,
        "phone": orderCurrent.phone,
        "province": orderCurrent.province,
        "district": orderCurrent.district,
        "ward": orderCurrent.ward,
        "address": orderCurrent.address,
        "payments": "0",
        "status": orderCurrent.status,
        "payment_status": orderCurrent.payment_status,
        "created_at": orderCurrent.created_at,
        "order_details": orderCurrent.order_details
    };

    console.log(newObjectUpdate);

    order.orderUpdate(orderId, newObjectUpdate);
}

const updateEventHandle = () => {
    const btnUpdate = document.querySelector("#update_btn");
    btnUpdate.addEventListener("click", update);
}

loading();