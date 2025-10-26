import { API_URL } from "../../../../enviroment/enviroment.js";
import { ENDPOINT, STATUS } from "../../../../config/config.js";

export class Category {
    #id;
    #name;
    #parent_id;

    #categoryList = [];
    #categoryOne;

    getCategoryList() {
        return this.categoryList;
    }

    getCategoryOne() {
        return this.categoryOne;
    }

    async categoryLoadData() {
        await axios.get(API_URL + ENDPOINT.CATEGORY).then(response => {
            if (response.status === STATUS.OK) {
                this.categoryList = response.data;
            }
        }).catch(error => console.error(error));
    }

    categoryRender() {
        let htmlList = ``;

        let index = 0;
        for (let i = 0; i < (this.categoryList.length); i++) {
            if (this.categoryList[i].parent_id == null || this.categoryList[i].parent_id == "") {
                index += 1;
                let htmlItem = `<tr>
                                <td>${index}</td>
                                <td>${this.categoryList[i].name}</td>
                                <td>${this.categoryList[i].parent_id == null || this.categoryList[i].parent_id == "" ? "(Không có)" : ""}</td>
                                <td>
                                    ${this.categoryList[i].status == 1 ? '<span class="badge rounded-pill p-2 bg-success">Hiện</span>' : '<span class="badge rounded-pill p-2 bg-secondary">Ẩn</span>'}
                                </td>
                                <td>
                                    <a href="./category-detail.html?${this.categoryList[i].id}" class="btn btn-outline-primary"><i class="bi bi-eye-fill"></i></a>
                                    <a href="./category-edit.html?${this.categoryList[i].id}" class="btn btn-outline-warning"><i class="bi bi-pencil-fill"></i></a>
                                    <button type="submit" onclick="deleteCategoryHandle('${this.categoryList[i].id}')" class="btn btn-outline-danger"><i class="bi bi-trash-fill"></i></button>
                                </td>
                            </tr>`;

                for (let j = i + 1; j < this.categoryList.length; j++) {
                    if (this.categoryList[j].parent_id == this.categoryList[i].id) {
                        index += 1;
                        let htmlItemChild = `
                        <tr>
                            <td>${index}</td>
                            <td>-- ${this.categoryList[j].name}</td>
                            <td>${this.categoryList[i].name}</td>
                            <td>
                                ${this.categoryList[j].status == 1 ? '<span class="badge rounded-pill p-2 bg-success">Hiện</span>' : '<span class="badge rounded-pill p-2 bg-secondary">Ẩn</span>'}
                            </td >
                        <td>
                            <a href="./category-detail.html?${this.categoryList[j].id}" class="btn btn-outline-primary"><i class="bi bi-eye-fill"></i></a>
                            <a href="./category-edit.html?${this.categoryList[j].id}" class="btn btn-outline-warning"><i class="bi bi-pencil-fill"></i></a>
                            <button type="submit" onclick="deleteCategoryHandle('${this.categoryList[j].id}')" class="btn btn-outline-danger"><i class="bi bi-trash-fill"></i></button>
                        </td>
                        </tr >
                        `;

                        htmlItem += htmlItemChild;
                    }
                }
                htmlList += htmlItem;
            }
        }

        return htmlList;
    }

    categoryRenderByName(searchValue) {
        const filtered = this.categoryList.filter(cat =>
            cat.name.toLowerCase().includes(searchValue.toLowerCase())
        );

        let htmlList = ``;

        if (filtered.length > 0) {
            filtered.forEach((cat, idx) => {
                const parentItem = this.categoryList.find(item => item.id == cat.parent_id);

                console.log(parentItem);
                const parentName = parentItem ? parentItem.name : "(Không có)";

                htmlList += `<tr>
                <td>${idx + 1}</td>
                <td>${cat.name}</td>
                <td>${(cat.parent_id == null || cat.parent_id == "") ? "(Không có)" : parentName}</td>
                <td>
                    ${cat.status == 1
                        ? '<span class="badge rounded-pill p-2 bg-success">Hiện</span>'
                        : '<span class="badge rounded-pill p-2 bg-secondary">Ẩn</span>'}
                </td>
                <td>
                    <a href="./category-detail.html?${cat.id}" class="btn btn-outline-primary"><i class="bi bi-eye-fill"></i></a>
                    <a href="./category-edit.html?${cat.id}" class="btn btn-outline-warning"><i class="bi bi-pencil-fill"></i></a>
                    <button type="submit" onclick="deleteCategoryHandle('${cat.id}')" class="btn btn-outline-danger"><i class="bi bi-trash-fill"></i></button>
                </td>
            </tr>`;
            });
        } else {
            htmlList = `Không tìm thấy danh mục với tên: ${searchValue}`;
        }

        return htmlList;
    }

    categoryRenderByStatus(statusValue) {
        const filtered = this.categoryList.filter(cat => cat.status == statusValue);

        let htmlList = ``;

        if (filtered.length == 0) {
            return `Không có danh mục nào với trạng thái: ${statusValue}`;
        }

        filtered.forEach((cat, index) => {
            const parentItem = this.categoryList.find(item => item.id == cat.parent_id);

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
                <a href="./category-detail.html?${cat.id}" class="btn btn-outline-primary"><i class="bi bi-eye-fill"></i></a>
                <a href="./category-edit.html?${cat.id}" class="btn btn-outline-warning"><i class="bi bi-pencil-fill"></i></a>
                <button type="button" onclick="deleteCategoryHandle('${cat.id}')" class="btn btn-outline-danger"><i class="bi bi-trash-fill"></i></button>
            </td>
        </tr>`;
        });

        return htmlList;
    }


    categoryCreate(name, parent_id, status) {
        let objectToCreate = {
            name: name,
            parent_id: parent_id,
            status: status
        };

        axios.post(API_URL + ENDPOINT.CATEGORY, objectToCreate).then(response => {
            if (response.status === STATUS.CREATED) {
                sessionStorage.setItem("alert_success", "Thêm thành công");
            } else {
                sessionStorage.setItem("alert_danger", "Thêm thất bại. Lỗi hệ thống");
            }
        }).catch(error => console.error(error));
    }

    categoryDelete(id) {
        axios.delete(API_URL + ENDPOINT.CATEGORY + "/" + id).then(response => {
            if (response.status == STATUS.DELETED) {
                sessionStorage.setItem("alert_delete_success", "Xóa thành công");
            } else {
                sessionStorage.setItem("alert_delete_danger", "Xóa thất bại. Lỗi hệ thống");
            }
        }).catch(error => console.error(error));
    }

    async categoryGetOne(id) {
        await axios.get(API_URL + ENDPOINT.CATEGORY + "/" + id).then(response => {
            if (response.status == STATUS.OK) {
                this.categoryOne = response.data;
            }
        }).catch(error => console.error(error));
    }

    categoryUpdate(id, objectToUpdate) {
        axios.put(API_URL + ENDPOINT.CATEGORY + "/" + id, objectToUpdate).then(response => {
            if (response.status === STATUS.OK) {
                sessionStorage.setItem("update_success", "Cập nhật thành công");
            } else {
                sessionStorage.setItem("update_danger", "Cập nhật thất bại. Lỗi hệ thống");
            }
        }).catch(error => console.error(error));
    }
}