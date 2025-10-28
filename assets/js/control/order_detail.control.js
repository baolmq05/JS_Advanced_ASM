import { Order } from "../service/order.service.js";
import { Product } from "../service/product.service.js";
import { User } from "../service/user.service.js";

const order = new Order();
let orderList;
let orderCurrent;

const product = new Product();
let productList = [];

// Get URL To Get ID PRODUCT
const query = window.location.search;
let orderId = query.substring(1);

if (orderId == "") {
    window.location.href = "./product.html";
}

async function loading() {
    await order.orderLoadData();
    orderList = order.getOrderList();
    orderCurrent = orderList.find(item => item.id == orderId);
    await product.productLoadData();
    productList = product.getProductList();

    renderOrderDetail();
}

const renderOrderDetail = () => {
    let orderDetailHtml = order.orderDetailRender(orderCurrent, productList);
    document.querySelector("#infor_order_container").innerHTML = orderDetailHtml;
};

loading();

