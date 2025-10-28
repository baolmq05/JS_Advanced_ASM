import { Cart } from "./cart.service.js";
import { API_URL } from "../../../../enviroment/enviroment.js";
import { ENDPOINT, STATUS } from "../../../../config/config.js";

export class User {
    userList = [];
    userOne = [];

    getUserList() {
        return this.userList;
    }

    getUserOne() {
        return this.userOne;
    }

    async userLoadData() {
        await axios.get(API_URL + ENDPOINT.USER).then(response => {
            if (response.status === STATUS.OK) {
                this.userList = response.data;
            }
        }).catch(error => console.error(error));
    }

    userRender() {
        let htmlList = ``;

        this.userList.forEach((userItem, index) => {
            let htmlItem = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${userItem.name}</td>
                    <td>${userItem.email}</td>
                    <td><img width="50" src="../../assets/images/avatar/avatar.png" alt=""></td>
                    <td>
                        ${userItem.status == 1 ? '<span class="badge rounded-pill bg-success">Hoạt động</span>' : '<span class="badge rounded-pill bg-secondary">Vô hiệu</span>'}
                    </td>
                    <td class="d-flex flex-wrap gap-1">
                        <a href="./user-edit.html" class="btn btn-sm btn-outline-primary">Xem</a>
                        <a href="./user-edit.html" class="btn btn-sm btn-outline-warning">Sửa</a>
                        <button type="submit" class="btn btn-sm btn-outline-danger">Xóa</button>
                    </td>
                </tr>
            `;

            htmlList += htmlItem;
        });

        return htmlList;
    }

    userRenderByName(searchValue) {
        const filtered = this.userList.filter(us =>
            us.name.toLowerCase().includes(searchValue.toLowerCase())
        );

        let htmlList = ``;

        if (filtered.length > 0) {
            filtered.forEach((us, index) => {
                htmlList += `<tr>
                <td>${index + 1}</td>
                <td>${us.name}</td>
                <td>${us.email}</td>
                <td>
                    <img width="50" src="../../assets/images/avatar/avatar.png" alt="">
                </td>
                <td>
                    ${us.status == 1
                        ? '<span class="badge rounded-pill p-2 bg-success">Hoạt động</span>'
                        : '<span class="badge rounded-pill p-2 bg-secondary">Vô hiệu hóa</span>'}
                </td>
                <td>
                    <a href="./category-detail.html?${us.id}" class="btn btn-outline-primary">Xem</a>
                    <a href="./category-edit.html?${us.id}" class="btn btn-outline-warning">Sửa</a>
                    <button type="submit" onclick="deleteCategoryHandle('${us.id}')" class="btn btn-outline-danger">Xóa</button>
                </td>
            </tr>`;
            });
        } else {
            htmlList = `Không tìm thấy danh mục với tên: ${searchValue}`;
        }

        return htmlList;
    }

    userRenderByStatus(statusValue) {
        const filtered = this.userList.filter(us => us.status == statusValue);

        let htmlList = ``;

        if (filtered.length == 0) {
            return `Không có danh mục nào với trạng thái: ${statusValue == 0 ? "Ẩn" : "Hiện"}`;
        }

        filtered.forEach((us, index) => {
            const parentItem = this.userList.find(item => item.id == us.parent_id);

            console.log(parentItem);
            const parentName = parentItem ? parentItem.name : "(Không có)";

            htmlList += `<tr>
            <td>${index + 1}</td>
            <td>${us.name}</td>
            <td>${us.email}</td>
            <td>
                <img width="50" src="../../assets/images/avatar/avatar.png" alt="">
            </td>
            <td>
                ${us.status == 1
                    ? '<span class="badge rounded-pill p-2 bg-success">Hoạt động</span>'
                    : '<span class="badge rounded-pill p-2 bg-secondary">Vô hiệu hóa</span>'}
            </td>
            <td>
                <a href="?${us.id}" class="btn btn-outline-primary">Xem</a>
                <a href="?${us.id}" class="btn btn-outline-warning">Sửa</a>
                <button type="button" onclick="" class="btn btn-outline-danger">Xóa</button>
            </td>
        </tr>`;
        });

        return htmlList;
    }


    userCreate(objectToCreate) {
        axios.post(API_URL + ENDPOINT.USER, objectToCreate).then(response => {
            if (response.status === STATUS.CREATED) {
                sessionStorage.setItem("create_success", "Thêm thành công");
                alert(response.data.id);
                const cart = new Cart();
                cart.create(response.data.id);
            } else {
                sessionStorage.setItem("create_danger", "Thêm thất bại. Lỗi hệ thống");
            }
        }).catch(error => console.error(error));
    }

    async userGetOne(id) {
        await axios.get(API_URL + ENDPOINT.USER + "/" + id).then(response => {
            if (response.status == STATUS.OK) {
                this.categoryOne = response.data;
            }
        }).catch(error => console.error(error));
    }

    userUpdate(id, objectToUpdate) {
        axios.put(API_URL + ENDPOINT.USER + "/" + id, objectToUpdate).then(response => {
            if (response.status === STATUS.OK) {
                sessionStorage.setItem("update_success", "Cập nhật thành công");
                sessionStorage.setItem("avatar_login", response.data.avatar);
            } else {
                sessionStorage.setItem("update_danger", "Cập nhật thất bại. Lỗi hệ thống");
            }
        }).catch(error => console.error(error));
    }
}