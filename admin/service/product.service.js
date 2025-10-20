import { API_URL } from "../../enviroment/enviroment.js";
import { Category } from "./category.service.js";
import { ENDPOINT, STATUS } from "../../config/config.js";

export class Product {
    productList = [];

    getProductList() {
        return this.productList;
    }

    async productLoadData() {
        await axios.get(API_URL + ENDPOINT.PRODUCT).then(response => {
            if (response.status === STATUS.OK) {
                this.productList = response.data;
                console.log(this.productList);
            }
        }).catch(error => console.error(error));
    }

    productRender(categoryList) {
        let htmlList = ``;

        this.productList.forEach((item, index) => {
            const categoryName = categoryList.find(cateItem => cateItem.id == item.category_id)?.name;
            let htmlItem = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name.length > 20 ? item.name.slice(0, 18) + "..." : item.name}</td>
                    <td>${item.base_price}đ</td>
                    <td>
                        <img width="50px" src="${item.image ?? 'https://cdn.iconscout.com/icon/premium/png-256-thumb/no-image-1753539-1493784.png'}" alt="">
                    </td>
                    <td>...</td>
                    <td>${categoryName == "" || categoryName == undefined ? "(Chưa phân loại)" : categoryName}</td>
                    <td>
                        ${item.status == 1 ? '<span class="badge rounded-pill p-2 bg-success">Hiện</span>' : '<span class="badge rounded-pill p-2 bg-secondary">Ẩn</span>'}
                    </td>
                    <td class="d-flex gap-1">
                    <a href="./product-edit.html" class="btn btn-outline-primary">Xem</a>
                    <a href="./product-edit.html" class="btn btn-outline-warning">Sửa</a>
                    <form class="" action="">
                        <button type="button" class="btn btn-outline-danger">Xóa</button>
                    </form>
                    </td>
                </tr>
            `;

            htmlList += htmlItem;
        });

        return htmlList;
    }

    productRenderByName(searchValue, categoryList) {
        const filtered = this.productList.filter(pro =>
            pro.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        console.log(filtered);

        let htmlList = ``;

        if (filtered.length > 0) {
            filtered.forEach((item, index) => {

                let categoryName = categoryList.find(cate => cate.id == item.category_id)?.name;

                let htmlItem = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.name.length > 20 ? item.name.slice(0, 18) + "..." : item.name}</td>
                        <td>${item.base_price}đ</td>
                        <td>
                            <img width="50px" src="${item.image ?? 'https://cdn.iconscout.com/icon/premium/png-256-thumb/no-image-1753539-1493784.png'}" alt="">
                        </td>
                        <td>...</td>
                        <td>${categoryName == "" || categoryName == undefined ? "(Chưa phân loại)" : categoryName}</td>
                        <td>
                            ${item.status == 1 ? '<span class="badge rounded-pill p-2 bg-success">Hiện</span>' : '<span class="badge rounded-pill p-2 bg-secondary">Ẩn</span>'}
                        </td>
                        <td class="d-flex gap-1">
                        <a href="./product-edit.html" class="btn btn-outline-primary">Xem</a>
                        <a href="./product-edit.html" class="btn btn-outline-warning">Sửa</a>
                        <form class="" action="">
                            <button type="button" class="btn btn-outline-danger">Xóa</button>
                        </form>
                        </td>
                    </tr>
                `;

                htmlList += htmlItem;
            });
        } else {
            htmlList = `Không tìm thấy danh mục với tên: ${searchValue}`;
        }

        return htmlList;
    }

    productRenderByStatus(statusValue, categoryList) {
        const filtered = this.productList.filter(pro => pro.status == statusValue);

        let htmlList = ``;

        if (filtered.length == 0) {
            return `Không có danh mục nào với trạng thái: ${statusValue == 0 ? "Ẩn" : "Hiện"}`;
        }

        filtered.forEach((item, index) => {
            const categoryName = categoryList.find(cateItem => cateItem.id == item.category_id)?.name;
            let htmlItem = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name.length > 20 ? item.name.slice(0, 18) + "..." : item.name}</td>
                    <td>${item.base_price}đ</td>
                    <td>
                        <img width="50px" src="${item.image ?? 'https://cdn.iconscout.com/icon/premium/png-256-thumb/no-image-1753539-1493784.png'}" alt="">
                    </td>
                    <td>...</td>
                    <td>${categoryName == "" || categoryName == undefined ? "(Chưa phân loại)" : categoryName}</td>
                    <td>
                        ${item.status == 1 ? '<span class="badge rounded-pill p-2 bg-success">Hiện</span>' : '<span class="badge rounded-pill p-2 bg-secondary">Ẩn</span>'}
                    </td>
                    <td class="d-flex gap-1">
                    <a href="./product-edit.html" class="btn btn-outline-primary">Xem</a>
                    <a href="./product-edit.html" class="btn btn-outline-warning">Sửa</a>
                    <form class="" action="">
                        <button type="button" class="btn btn-outline-danger">Xóa</button>
                    </form>
                    </td>
                </tr>
            `;

            htmlList += htmlItem;
        });

        return htmlList;
    }

    productCreate(name, image, description, category_id, base_price) {
        let objectToCreate = {
            name: name,
            image: image,
            description: description,
            category_id: category_id,
            status: 1,
            base_price: base_price,
            product_variant: [],
        };

        console.log(objectToCreate);

        axios.post(API_URL + ENDPOINT.PRODUCT, objectToCreate).then(response => {
            if (response.status === STATUS.CREATED) {
                sessionStorage.setItem("create_success", "Thêm thành công");
                // alert("Thêm thành công");
                // alert(response.data);
            } else {
                // alert("Thất bại");
                sessionStorage.setItem("create_danger", "Thêm thất bại. Lỗi hệ thống");
            }
        }).catch(error => console.error(error));
    }

    // categoryDelete(id) {
    //     axios.delete(API_URL + ENDPOINT.CATEGORY + "/" + id).then(response => {
    //         if (response.status == STATUS.DELETED) {
    //             sessionStorage.setItem("alert_delete_success", "Xóa thành công");
    //         } else {
    //             sessionStorage.setItem("alert_delete_danger", "Xóa thất bại. Lỗi hệ thống");
    //         }
    //     }).catch(error => console.error(error));
    // }

    // async categoryGetOne(id) {
    //     await axios.get(API_URL + ENDPOINT.CATEGORY + "/" + id).then(response => {
    //         if (response.status == STATUS.OK) {
    //             this.categoryOne = response.data;
    //         }
    //     }).catch(error => console.error(error));
    // }

    // categoryUpdate(id, objectToUpdate) {
    //     axios.put(API_URL + ENDPOINT.CATEGORY + "/" + id, objectToUpdate).then(response => {
    //         if (response.status === STATUS.OK) {
    //             sessionStorage.setItem("update_success", "Cập nhật thành công");
    //         } else {
    //             sessionStorage.setItem("update_danger", "Cập nhật thất bại. Lỗi hệ thống");
    //         }
    //     }).catch(error => console.error(error));
    // }
}