// import { Order } from "../../../service/order.service.js"
// import { Product } from "../../../service/product.service.js"

// const order = new Order();
// let orderList = [];
// let orderCurrent = [];

// const product = new Product();
// let productList = [];

// // Get URL To Get ID PRODUCT
// const query = window.location.search;
// let orderId = query.substring(1);

// if (orderId == "") {
//     window.location.href = "./order-index.html";
// }

// async function loading() {
//     await order.orderLoadData();
//     orderList = order.getOrderList();
//     await product.productLoadData();
//     productList = product.getProductList();

//     orderCurrent = orderList.find(item => item.id == orderId);
//     renderStatusInModal();
//     updateEventHandle();
// }

// loading();

