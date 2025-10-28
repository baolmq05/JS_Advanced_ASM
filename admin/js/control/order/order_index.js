import { Order } from "../../../service/order.service.js";

const order = new Order();
let orderList = [];

async function loading() {
    await order.orderLoadData();
    orderList = order.getOrderList();

    let orderHtmlList = order.orderRender();
    document.querySelector("#order_list").innerHTML = orderHtmlList;

    order.orderReplaceTable();
}

loading();