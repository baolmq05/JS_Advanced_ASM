import { API_URL } from "../../../enviroment/enviroment.js"
import { ENDPOINT, STATUS } from "../../../config/config.js"

export class Order {
    orderList = [];

    getOrderList() {
        return this.orderList;
    }

    async orderLoadData() {
        await axios.get(API_URL + ENDPOINT.ORDER).then(response => {
            if (response.status == STATUS.OK) {
                this.orderList = response.data;
            }
        }).catch(error => console.error(error));
    }

    orderRender(orderCurrent) {
        let html = ``;

        orderCurrent.forEach(item => {

            let statusBackground = '';
            let statusText = '';
            if (item.status == 0) {
                statusBackground = "primary";
                statusText = 'Đang chuẩn bị';
            } else if (item.status == 1) {
                statusBackground = "warning";
                statusText = 'Đang vận chuyển';
            } else if (item.status == 2) {
                statusBackground = "success";
                statusText = 'Đã giao hàng';
            } else {
                statusBackground = "danger";
                statusText = 'Đã hủy';
            }

            let itemHtml = `<a href="./order-detail.html?${item.id}"
                                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    <div><strong>Đơn hàng: </strong>#${item.order_code} </div>
                                    <div><strong>Người đặt: </strong>${item.fullname}</div>
                                    <span class="badge bg-${statusBackground} rounded-pill">${statusText}</span>
                                </a>`;

            html += itemHtml;
        });

        return html;
    }

    orderDetailRender(orderCurrent, productList) {
        let html = ``;
        let total = 0;

        let statusBackground = '';
        let statusText = '';
        if (orderCurrent.status == 0) {
            statusBackground = "primary";
            statusText = 'Đang chuẩn bị';
        } else if (orderCurrent.status == 1) {
            statusBackground = "warning";
            statusText = 'Đang vận chuyển';
        } else if (orderCurrent.status == 2) {
            statusBackground = "success";
            statusText = 'Đã giao hàng';
        } else {
            statusBackground = "danger";
            statusText = 'Đã hủy';
        }

        let headInforProduct = `
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                    <i class="bi bi-bag"></i> Sản phẩm trong đơn
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        let footInforProdcut = `
            </tbody >
                    </table >
                </div >
            </div >
        `;

        orderCurrent.order_details.forEach(item => {
            total += item.total_price;
            let productCurrent = productList.find(productItem => productItem.id == item.product_id);
            let productVariant = productCurrent.product_variants.find(variant => variant.id == item.variant_id);
            let productItemHtml = `
            <tr>
                <td><img src="${productVariant.image}" width="60" class="rounded"
                    alt=""></td>
                <td><a class="text-decoration-none text-dark" href="./product-detail.html?${item.product_id}">${productVariant.variant_name}</a></td>
                <td>${item.quantity}</td>
                <td>${this.formatPrice(productVariant.price)}</td>
                <td>${this.formatPrice(item.total_price)}</td>
            </tr>`;

            headInforProduct += productItemHtml;
        });

        let inforOrder = `
            

            <div class="row mt-5">
                <div class="col-lg-4 mb-4 ">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <i class="bi bi-receipt"></i> Thông tin đơn hàng
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>Mã đơn:</strong> #${orderCurrent.order_code}</li>
                        <li class="list-group-item"><strong>Ngày đặt:</strong> ${orderCurrent.created_at}</li>
                        <li class="list-group-item">
                            <strong>Trạng thái:</strong>
                            <span class="badge bg-${statusBackground}">${statusText}</span>
                        </li>
                    </ul>
                </div>
            </div>
        `;


        let inforUser = `
                <div class="col-lg-4 mb-4">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <i class="bi bi-person"></i> Thông tin khách hàng
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>Tên:</strong> ${orderCurrent.fullname}</li>
                        <li class="list-group-item"><strong>Điện thoại:</strong> ${orderCurrent.phone}</li>
                        <li class="list-group-item"><strong>Địa chỉ:</strong> ${orderCurrent.address}</li>
                    </ul>
                </div>
            </div>
            `;

        let inforResult = `
                <div class="col-lg-4 mb-4">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <i class="bi bi-cash-coin"></i> Tổng kết đơn hàng
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Tạm tính</span> <span>${this.formatPrice(total)}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Phí vận chuyển</span> <span>${this.formatPrice(30000)}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between fw-bold">
                            <span>Tổng cộng</span> <span class="text-primary">${this.formatPrice(total + 30000)}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div >`;

        html += inforOrder;
        html += inforUser;
        html += inforResult;
        headInforProduct += footInforProdcut;
        html += headInforProduct;

        return html;
    }

    create(objectToCreate) {
        axios.post(API_URL + ENDPOINT.ORDER, objectToCreate).then(response => {
            if (response.status == STATUS.CREATED) {
                sessionStorage.setItem("order_sucess", response.data.id);
                window.location.href = "./order-success.html";
            }
        }).catch(error => console.error(error));
    }

    formatPrice(x) {
        let newNumber = x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
        return newNumber;
    }
}