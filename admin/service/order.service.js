import { API_URL } from "../../../../enviroment/enviroment.js";
import { ENDPOINT, STATUS } from "../../../../config/config.js";

export class Order {
    orderList = [];
    orderOne;

    getOrderList() {
        return this.orderList;
    }

    getOrderOne() {
        return this.orderOne;
    }

    async orderLoadData() {
        await axios.get(API_URL + ENDPOINT.ORDER).then(response => {
            if (response.status === STATUS.OK) {
                this.orderList = response.data;
            }
        }).catch(error => console.error(error));
    }

    orderRender() {
        let htmlList = ``;
        this.orderList.forEach(item => {
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

            let htmlItem = `
                <tr>
                    <td>#${item.order_code}</td>
                    <td>${item.fullname}</td>
                    <td>${item.created_at}</td>
                    <td>
                        <span class="badge rounded-pill p-2 bg-${statusBackground}">${statusText}</span>
                    </td>
                    <td class="d-flex gap-1">
                        <a href="./order-detail.html?${item.id}" class="btn btn-outline-primary">Xem</a>
                        <a href="./order-edit.html" class="btn btn-outline-warning">Sửa</a>
                    </td>
                </tr>
            `;

            htmlList += htmlItem;
        });

        return htmlList;
    }

    orderRenderByStatus(statusValue) {
        const filtered = this.orderList.filter(cat => cat.status == statusValue);

        let htmlList = ``;

        if (filtered.length == 0) {
            return `Không có danh mục nào với trạng thái: ${statusValue}`;
        }

        filtered.forEach((cat, index) => {
            const parentItem = this.orderList.find(item => item.id == cat.parent_id);

            console.log(parentItem);
            const parentName = parentItem ? parentItem.name : "(Không có)";

            htmlList += `<tr>
            <td>${index + 1}</td>
            <td>${cat.name}</td>
            <td>${(cat.parent_id == null || cat.parent_id == "") ? "(Không có)" : parentName}</td>
            <td>
                ${cat.status == 1
                    ? '<span class="badge rounded-pill p-2 bg-success">Hiện</span>'
                    : '<span class="badge rounded-pill p-2 bg-secondary">Ẩn</span>'}
            </td>
            <td>
                <a href="./order-detail.html?${cat.id}" class="btn btn-outline-primary"><i class="bi bi-eye-fill"></i></a>
                <a href="./order-edit.html?${cat.id}" class="btn btn-outline-warning"><i class="bi bi-pencil-fill"></i></a>
                <button type="button" onclick="deleteOrderHandle('${cat.id}')" class="btn btn-outline-danger"><i class="bi bi-trash-fill"></i></button>
            </td>
        </tr>`;
        });

        return htmlList;
    }

    orderUpdate(id, objectToUpdate) {
        axios.put(API_URL + ENDPOINT.ORDER + "/" + id, objectToUpdate).then(response => {
            if (response.status === STATUS.OK) {
                // sessionStorage.setItem("update_success", "Cập nhật thành công");
            } else {
                // sessionStorage.setItem("update_danger", "Cập nhật thất bại. Lỗi hệ thống");
            }
        }).catch(error => console.error(error));
    }

    orderReplaceTable() {
        new DataTable('#order-table');
    }

    formatPrice(x) {
        let newNumber = x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
        return newNumber;
    }
}