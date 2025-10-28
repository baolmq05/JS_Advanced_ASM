import { Cart } from "../service/cart.service.js";
import { Product } from "../service/product.service.js";
import { Order } from "../service/order.service.js";

const cart = new Cart();
let cartList;
let cartCurrent;

const product = new Product();
let productList;

const order = new Order();

let userId;
if (sessionStorage.getItem("client_allow")) {
    userId = sessionStorage.getItem("client_allow");
}

if (userId == "") {
    alert("Lỗi hệ thống");
}

// CART SHOW

const cartCheckoutE = document.querySelector("#cart_checkout");
const totalTempText = document.querySelector("#total_temp");
const totalPriceText = document.querySelector("#total_price");

async function cartLoading() {
    await product.productLoadData();
    productList = product.getProductList();
    await cart.cartLoadData();
    cartList = cart.getCartList();

    cartCurrent = cartList.find(item => item.user_id == userId);
    let cartResult = cart.cartRenderCheckout(cartCurrent, productList);
    cartCheckoutE.innerHTML = cartResult.html;

    totalTempText.innerText = cart.formatPrice(cartResult.total);

    let shippingFee = 30000;


    totalPriceText.innerText = cart.formatPrice(cartResult.total + shippingFee);

    createOrder();
}

// CHECK INFOR AND CREATE ORDER
const fullName = document.querySelector("#fullname");
const phone = document.querySelector("#phone");
const address = document.querySelector("#address");
const payments = document.querySelector("#payments");
const province = document.querySelector("#province");
const district = document.querySelector("#district");
const ward = document.querySelector("#ward");

function validateVietnamesePhoneNumber(phoneNumber) {
    // Regex này kiểm tra 10 chữ số, bắt đầu bằng 0 và theo sau là 
    // các đầu số hợp lệ (3, 5, 7, 8, 9)
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})\b$/;

    // Dùng .test() để kiểm tra
    return regex.test(phoneNumber);
}

const checkCanCreate = () => {
    let isError = false;

    if (!fullName.value || !phone.value || !address.value || !payments.value || !province.value || !district.value || !ward.value || !validateVietnamesePhoneNumber(phone.value)) {
        isError = true;
    }

    if (isError) {
        if (!fullName.value) {
            document.querySelector("#fullname_error").innerText = "Không được để trống";
        } else {
            document.querySelector("#fullname_error").innerText = "";
        }

        if (!phone.value) {
            document.querySelector("#phone_error").innerText = "Không được để trống";
        } else {
            document.querySelector("#phone_error").innerText = "";
        }

        if (!validateVietnamesePhoneNumber(phone.value)) {
            document.querySelector("#phone_error").innerText = "Vui lòng nhập đúng số điện thoại";
        } else {
            document.querySelector("#phone_error").innerText = "";
        }

        if (!address.value) {
            document.querySelector("#address_error").innerText = "Không được để trống";
        } else {
            document.querySelector("#address_error").innerText = "";
        }

        if (!payments.value) {
            document.querySelector("#payments_error").innerText = "Không được để trống";
        } else {
            document.querySelector("#payments_error").innerText = "";
        }

        if (!province.value) {
            document.querySelector("#province_error").innerText = "Vui lòng chọn tỉnh thành";
        } else {
            document.querySelector("#province_error").innerText = "";
        }

        if (!district.value) {
            document.querySelector("#district_error").innerText = "Vui lòng chọn quận huyện";
        } else {
            document.querySelector("#district_error").innerText = "";
        }

        if (!ward.value) {
            document.querySelector("#ward_error").innerText = "Vui lòng chọn phường xã";
        } else {
            document.querySelector("#ward_error").innerText = "";
        }

        return false;
    } else {
        document.querySelector("#fullname_error").innerText = "";
        document.querySelector("#phone_error").innerText = "";
        document.querySelector("#address_error").innerText = "";
        document.querySelector("#payments_error").innerText = "";
        document.querySelector("#province_error").innerText = "";
        document.querySelector("#district_error").innerText = "";
        document.querySelector("#ward_error").innerText = "";
    }

    return true;
};

const createOrder = () => {
    const btnCreate = document.querySelector("#create");
    btnCreate.addEventListener("click", () => {
        if (!checkCanCreate()) {
            console.log("Lỗi rồi");
            return;
        } else {
            let orderCode = new Date();
            let createAt = new Date();
            let createAtText = createAt.getFullYear() + "-" + (createAt.getMonth() + 1) + "-" + createAt.getDate();

            const provinceOption = province.options[province.selectedIndex];
            const provinceText = provinceOption.innerText;

            const districtOption = district.options[district.selectedIndex];
            const districtText = districtOption.innerText;

            const wardOption = ward.options[ward.selectedIndex];
            const wardText = wardOption.innerText;


            orderCode = String(orderCode.getTime());

            orderCode = orderCode.slice(5);

            let order_details = [];
            cartCurrent.cart_details.forEach(detailItem => {
                let idToCreate = Math.random().toString(36).substring(2, 6);

                let orderDetailObject = {
                    "id": idToCreate,
                    "product_id": detailItem.product_id,
                    "variant_id": detailItem.variant_id,
                    "quantity": detailItem.quantity,
                    "total_price": Number(detailItem.unit_price) * Number(detailItem.quantity)
                }

                order_details.push(orderDetailObject);
            });

            let objectToCreate = {
                "order_code": orderCode,
                "user_id": userId,
                "fullname": fullName.value,
                "phone": phone.value,
                "province": provinceText,
                "district": districtText,
                "ward": wardText,
                "address": address.value,
                "payments": payments.value,
                "status": 0,
                "payment_status": 1,
                "created_at": createAtText,
                "order_details": order_details
            }

            order.create(objectToCreate);
            cart.deleteAllProduct(cartCurrent.id);
        }
    });
};
// CALL LOADING
cartLoading();

