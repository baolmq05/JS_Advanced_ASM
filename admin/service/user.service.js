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
            if (userItem.role == 1) {
                let htmlItem = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${userItem.name}</td>
                    <td>${userItem.email}</td>
                    <td><img width="50" src="${userItem.avatar != '' ? userItem.avatar : '../../assets/images/avatar/avatar.png'}" alt=""></td>
                    <td>
                ${userItem.role == 1
                        ? '<span class="badge rounded-pill p-2 bg-success">Admin</span>'
                        : '<span class="badge rounded-pill p-2 bg-primary">User</span>'}
            </td>
                    <td>
                        ${userItem.status == 1 ? '<span class="badge rounded-pill bg-success">Hoạt động</span>' : '<span class="badge rounded-pill bg-secondary">Vô hiệu</span>'}
                    </td>
                    <td class="">
                        <a href="./user-detail.html?${userItem.id}" class="btn btn-outline-primary"><i class="bi bi-eye-fill"></i></a>
                        <a href="./user-edit.html" class="btn btn-outline-warning"><i class="bi bi-pencil-fill"></i></a>
                    </td>
                </tr>
            `;
                htmlList += htmlItem;
            } else {
                let htmlItem = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${userItem.name}</td>
                    <td>${userItem.email}</td>
                    <td><img width="50" src="${userItem.avatar != '' ? userItem.avatar : '../../assets/images/avatar/avatar.png'}" alt=""></td>
                    <td>
                ${userItem.role == 1
                        ? '<span class="badge rounded-pill p-2 bg-success">Admin</span>'
                        : '<span class="badge rounded-pill p-2 bg-primary">User</span>'}
            </td>
                    <td>
                        ${userItem.status == 1 ? '<span class="badge rounded-pill bg-success">Hoạt động</span>' : '<span class="badge rounded-pill bg-secondary">Vô hiệu</span>'}
                    </td>
                    <td class="">
                        <a href="./user-detail.html?${userItem.id}" class="btn btn-outline-primary"><i class="bi bi-eye-fill"></i></a>
                        <a href="./user-edit.html?${userItem.id}" class="btn btn-outline-warning"><i class="bi bi-pencil-fill"></i></a>
                        <button type="button" onclick="deleteUserHandle('${userItem.id}')" class="btn btn-outline-danger"><i class="bi bi-trash-fill"></i></button>
                    </td>
                </tr>
            `;
                htmlList += htmlItem;
            }

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
                if (us.role == 1) {
                    let htmlItem = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${us.name}</td>
                    <td>${us.email}</td>
                    <td><img width="50" src="${us.avatar != '' ? us.avatar : '../../assets/images/avatar/avatar.png'}" alt=""></td>
                    <td>
                ${us.role == 1
                            ? '<span class="badge rounded-pill p-2 bg-success">Admin</span>'
                            : '<span class="badge rounded-pill p-2 bg-primary">User</span>'}
            </td>
                    <td>
                        ${us.status == 1 ? '<span class="badge rounded-pill bg-success">Hoạt động</span>' : '<span class="badge rounded-pill bg-secondary">Vô hiệu</span>'}
                    </td>
                    <td class="">
                        <a href="./user-detail.html?${us.id}" class="btn btn-outline-primary"><i class="bi bi-eye-fill"></i></a>
                        <a href="./user-edit.html" class="btn btn-outline-warning"><i class="bi bi-pencil-fill"></i></a>
                    </td>
                </tr>
            `;
                    htmlList += htmlItem;
                } else {
                    let htmlItem = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${us.name}</td>
                    <td>${us.email}</td>
                    <td><img width="50" src="${us.avatar != '' ? us.avatar : '../../assets/images/avatar/avatar.png'}" alt=""></td>
                    <td>
                ${us.role == 1
                            ? '<span class="badge rounded-pill p-2 bg-success">Admin</span>'
                            : '<span class="badge rounded-pill p-2 bg-primary">User</span>'}
            </td>
                    <td>
                        ${us.status == 1 ? '<span class="badge rounded-pill bg-success">Hoạt động</span>' : '<span class="badge rounded-pill bg-secondary">Vô hiệu</span>'}
                    </td>
                    <td class="">
                        <a href="./user-detail.html?${us.id}" class="btn btn-outline-primary"><i class="bi bi-eye-fill"></i></a>
                        <a href="./user-edit.html" class="btn btn-outline-warning"><i class="bi bi-pencil-fill"></i></a>
                        <button type="button" onlick="deleteUserHandle('${us.id}')" class="btn btn-outline-danger"><i class="bi bi-trash-fill"></i></button>
                    </td>
                </tr>
            `;
                    htmlList += htmlItem;
                }
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

            if (us.role == 1) {
                let htmlItem = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${us.name}</td>
                    <td>${us.email}</td>
                    <td><img width="50" src="${us.avatar != '' ? us.avatar : '../../assets/images/avatar/avatar.png'}" alt=""></td>
                    <td>
                ${us.role == 1
                        ? '<span class="badge rounded-pill p-2 bg-success">Admin</span>'
                        : '<span class="badge rounded-pill p-2 bg-primary">User</span>'}
            </td>
                    <td>
                        ${us.status == 1 ? '<span class="badge rounded-pill bg-success">Hoạt động</span>' : '<span class="badge rounded-pill bg-secondary">Vô hiệu</span>'}
                    </td>
                    <td class="">
                        <a href="./user-detail.html?${us.id}" class="btn btn-outline-primary"><i class="bi bi-eye-fill"></i></a>
                        <a href="./user-edit.html" class="btn btn-outline-warning"><i class="bi bi-pencil-fill"></i></a>
                    </td>
                </tr>
            `;
                htmlList += htmlItem;
            } else {
                let htmlItem = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${us.name}</td>
                    <td>${us.email}</td>
                    <td><img width="50" src="${us.avatar != '' ? us.avatar : '../../assets/images/avatar/avatar.png'}" alt=""></td>
                    <td>
                ${us.role == 1
                        ? '<span class="badge rounded-pill p-2 bg-success">Admin</span>'
                        : '<span class="badge rounded-pill p-2 bg-primary">User</span>'}
            </td>
                    <td>
                        ${us.status == 1 ? '<span class="badge rounded-pill bg-success">Hoạt động</span>' : '<span class="badge rounded-pill bg-secondary">Vô hiệu</span>'}
                    </td>
                    <td class="">
                        <a href="./user-detail.html?${us.id}" class="btn btn-outline-primary"><i class="bi bi-eye-fill"></i></a>
                        <a href="./user-edit.html" class="btn btn-outline-warning"><i class="bi bi-pencil-fill"></i></a>
                        <button type="button" onlick="deleteUserHandle('${us.id}')" class="btn btn-outline-danger"><i class="bi bi-trash-fill"></i></button>
                    </td>
                </tr>
            `;
                htmlList += htmlItem;
            }
        });

        return htmlList;
    }


    userCreate(objectToCreate) {
        axios.post(API_URL + ENDPOINT.USER, objectToCreate).then(response => {
            if (response.status === STATUS.CREATED) {
                sessionStorage.setItem("create_success", "Thêm thành công");
            } else {
                sessionStorage.setItem("create_danger", "Thêm thất bại. Lỗi hệ thống");
            }
        }).catch(error => console.error(error));
    }

    userDelete(id) {
        axios.delete(API_URL + ENDPOINT.USER + "/" + id).then(response => {
            if (response.status == STATUS.DELETED) {
                sessionStorage.setItem("delete_success", "Xóa thành công");
            } else {
                sessionStorage.setItem("delete_danger", "Xóa thất bại. Lỗi hệ thống");
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
            } else {
                sessionStorage.setItem("update_danger", "Cập nhật thất bại. Lỗi hệ thống");
            }
        }).catch(error => console.error(error));
    }
}