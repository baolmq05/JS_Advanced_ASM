import { Order } from "../service/order.service.js";

if (!sessionStorage.getItem("order_sucess")) {
    window.location.href = "http://127.0.0.1:5501/index.html";
}

const order = new Order();
let orderList = [];
let orderCurrent = [];
let orderId = sessionStorage.getItem("order_sucess");

async function orderLoading() {
    await order.orderLoadData();
    orderList = order.getOrderList();
    console.log(orderList);

    orderCurrent = orderList.find(item => item.id == orderId);
    console.log(orderCurrent);
    renderData();
}

const renderData = () => {
    document.querySelector("#order_code").innerText = "#" + orderCurrent.order_code;
    document.querySelector("#created_at").innerText = orderCurrent.created_at;
    let totalPrice = 0
    orderCurrent.order_details.forEach(element => {
        totalPrice += element.total_price;
    });
    document.querySelector("#total_price").innerText = order.formatPrice(totalPrice);
}

// CALL LOADING
orderLoading();