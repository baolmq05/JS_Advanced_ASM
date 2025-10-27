import { API_URL } from "../../enviroment/enviroment.js";
import { Category } from "./category.service.js";
import { ENDPOINT, STATUS } from "../../config/config.js";

export class Product {
    productList = [];
    productOne = [];

    getProductList() {
        return this.productList;
    }

    getProductOne() {
        return this.productOne;
    }

    async productLoadData() {
        await axios.get(API_URL + ENDPOINT.PRODUCT).then(response => {
            if (response.status === STATUS.OK) {
                this.productList = response.data;
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
                    <td>${this.formatPrice(item.base_price)}</td>
                    <td>
                        <img width="50px" src="${item.image ?? 'https://cdn.iconscout.com/icon/premium/png-256-thumb/no-image-1753539-1493784.png'}" alt="">
                    </td>
                    <td>${categoryName == "" || categoryName == undefined ? "(Chưa phân loại)" : categoryName}</td>
                    <td>
                        ${item.status == 1 ? '<span class="badge rounded-pill p-2 bg-success">Hiện</span>' : '<span class="badge rounded-pill p-2 bg-secondary">Ẩn</span>'}
                    </td>
                    <td class="">
                        <a href="./product-detail.html?${item.id}" class="btn btn-outline-primary"><i class="bi bi-eye-fill"></i></a>
                        <a href="./product-edit.html?${item.id}" class="btn btn-outline-warning"><i class="bi bi-pencil-fill"></i></a>
                        <button type="button" onclick="deleteProductHandle('${item.id}')" class="btn btn-outline-danger"><i class="bi bi-trash-fill"></i></button>
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

        let htmlList = ``;

        if (filtered.length > 0) {
            filtered.forEach((item, index) => {

                let categoryName = categoryList.find(cate => cate.id == item.category_id)?.name;

                let htmlItem = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.name.length > 20 ? item.name.slice(0, 18) + "..." : item.name}</td>
                        <td>${this.formatPrice(item.base_price)}</td>
                        <td>
                            <img width="50px" src="${item.image ?? 'https://cdn.iconscout.com/icon/premium/png-256-thumb/no-image-1753539-1493784.png'}" alt="">
                        </td>
                        <td>${categoryName == "" || categoryName == undefined ? "(Chưa phân loại)" : categoryName}</td>
                        <td>
                            ${item.status == 1 ? '<span class="badge rounded-pill p-2 bg-success">Hiện</span>' : '<span class="badge rounded-pill p-2 bg-secondary">Ẩn</span>'}
                        </td>
                        <td class="">
                            <a href="./product-detail.html?${item.id}" class="btn btn-outline-primary"><i class="bi bi-eye-fill"></i></a>
                            <a href="./product-edit.html" class="btn btn-outline-warning"><i class="bi bi-pencil-fill"></i></a>
                            <button type="button" onclick="deleteProductHandle('${item.id}')" class="btn btn-outline-danger"><i class="bi bi-trash-fill"></i></button>
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
                    <td>${this.formatPrice(item.base_price)}</td>
                    <td>
                        <img width="50px" src="${item.image ?? 'https://cdn.iconscout.com/icon/premium/png-256-thumb/no-image-1753539-1493784.png'}" alt="">
                    </td>
                    <td>${categoryName == "" || categoryName == undefined ? "(Chưa phân loại)" : categoryName}</td>
                    <td>
                        ${item.status == 1 ? '<span class="badge rounded-pill p-2 bg-success">Hiện</span>' : '<span class="badge rounded-pill p-2 bg-secondary">Ẩn</span>'}
                    </td>
                    <td class="">
                        <a href="./product-detail.html?${item.id}" class="btn btn-outline-primary"><i class="bi bi-eye-fill"></i></a>
                        <a href="./product-edit.html" class="btn btn-outline-warning"><i class="bi bi-pencil-fill"></i></a>
                        <button type="button" onclick="deleteProductHandle('${item.id}')" class="btn btn-outline-danger"><i class="bi bi-trash-fill"></i></button>
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
            product_variants: [],
        };

        axios.post(API_URL + ENDPOINT.PRODUCT, objectToCreate).then(response => {
            if (response.status === STATUS.CREATED) {
                sessionStorage.setItem("create_success", "Thêm thành công");
            } else {
                sessionStorage.setItem("create_danger", "Thêm thất bại. Lỗi hệ thống");
            }
        }).catch(error => console.error(error));
    }

    productDelete(id) {
        axios.delete(API_URL + ENDPOINT.PRODUCT + "/" + id).then(response => {
            if (response.status == STATUS.DELETED) {
                sessionStorage.setItem("delete_success", "Xóa thành công");
            } else {
                sessionStorage.setItem("delete_danger", "Xóa thất bại. Lỗi hệ thống");
            }
        }).catch(error => console.error(error));
    }

    async productDetailLoad(id) {
        await axios.get(API_URL + ENDPOINT.PRODUCT + "/" + id).then(response => {
            if (response.status == STATUS.OK) {
                this.productOne = response.data;
            }
        }).catch(error => console.error(error));
    }

    productRenderVariant(productData) {
        let htmlVariantList = ``;

        if (productData.product_variants.length == 0) {
            document.querySelector("#variant").style.display = "none";
        } else {
            document.querySelector("#variant").style.display = "block";
        }

        productData.product_variants.forEach(itemVariant => {
            let htmlItemVariant = `
                <tr>
                    <td scope="col">${itemVariant.variant_name}</td>
                    <td scope="col">${this.formatPrice(itemVariant.price)}</td>
                    <td scope="col">${itemVariant.quantity <= 0 ? '<span class="badge bg-danger">Hết hàng</span>' : itemVariant.quantity}</td>
                    <td scope="col" class="">
                        <button onclick="findVariant('${itemVariant.id}')" class="btn btn-outline-primary"><i class="bi bi-eye-fill"></i></button>
                        <button onclick="getVariantId('${itemVariant.id}')" class="btn btn-outline-warning"><i class="bi bi-pencil-fill"></i></button>
                        <button type="submit" onclick="deleteVariant('${itemVariant.id}')" class="btn btn-outline-danger"><i class="bi bi-trash-fill"></i></button>
                    </td>
                </tr>
            `;

            htmlVariantList += htmlItemVariant;
        });

        document.querySelector("#variant_list").innerHTML = htmlVariantList;
    }

    productUpdate(id, objectToUpdate, deleteUpdate) {
        axios.put(API_URL + ENDPOINT.PRODUCT + "/" + id, objectToUpdate).then(response => {
            if (response.status === STATUS.OK) {
                if (deleteUpdate) {
                    sessionStorage.setItem("delete_success", "Xóa thành công");
                }
                sessionStorage.setItem("update_success", "Cập nhật thành công");
            } else {
                sessionStorage.setItem("update_danger", "Cập nhật thất bại. Lỗi hệ thống");
            }
        }).catch(error => console.error(error));
    }

    formatPrice(x) {
        let newNumber = x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
        return newNumber;
    }

    productReplaceTable() {
        new DataTable('#product-table');
    }

    productVariantReplaceTable() {
        new DataTable('#product-variant-table');
    }
}