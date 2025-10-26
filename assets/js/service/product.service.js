import { API_URL } from "../../../enviroment/enviroment.js";
// import { Category } from "./category.service.js";
import { ENDPOINT, STATUS } from "../../../config/config.js";

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

    productRenderIndex() {
        let htmlList = ``;

        this.productList.forEach((item) => {

            if (item.is_featured == 1) {
                // const categoryName = categoryList.find(cateItem => cateItem.id == item.category_id)?.name;
                let htmlItem = `
                <div class="col-lg-3 col-sm-12 col-md-6 mt-3">
                        <div class="product-item card">
                            <div class="product-image-box h-180">
                                <img src="${item.image}"
                                    class="card-img-top product-image" alt="...">
                            </div>
                            <div class="card-body">
                                <h5 class="product-title card-title">
                                    <a href="./page/product-detail.html?${item.id}" class="text-decoration-none text-dark">
                                        ${item.name}
                                    </a>
                                </h5>
                                <p class="product-description card-text">${item.description}</p>
                                <p class="">Giá: <span class="fw-bold">${this.formatPrice(item.base_price)}</span></p>
                                <a href="./page/product-detail.html?${item.id}" class="btn btn-outline-secondary">Xem chi tiết</a>
                                <a href="#" class="btn btn-primary">Thêm vào giỏ</a>
                            </div>
                        </div>
                    </div>
            `;

                htmlList += htmlItem;
            }
        });

        return htmlList;
    }

    productRenderShop() {
        let htmlList = ``;

        this.productList.forEach((item) => {
            let htmlItem = `
                <div class="col-lg-4 mt-3">
                                <div class="product-item card">
                                    <div class="product-image-box h-180">
                                        <img src="${item.image}"
                                            class="card-img-top product-image" alt="...">
                                    </div>
                                    <div class="card-body">
                                        <h5 class="product-title card-title"><a href="./product-detail.html?${item.id}"
                                                class="text-decoration-none text-dark">${item.name}</a></h5>
                                        <p class="product-description card-text">${item.description}</p>
                                        <p class="">Giá: <span class="fw-bold">${this.formatPrice(item.base_price)}</span></p>
                                        <a href="./product-detail.html?${item.id}" class="btn btn-outline-primary">Xem chi tiết</a>
                                    </div>
                                </div>
                            </div>
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
                        <a href="./product-detail.html?${item.id}" class="btn btn-outline-primary">Xem</a>
                        <a href="./product-edit.html" class="btn btn-outline-warning">Sửa</a>
                        <form class="" action="">
                            <button type="submit" onclick="" class="btn btn-outline-danger">Xóa</button>
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

    async productDetailLoad(id) {
        await axios.get(API_URL + ENDPOINT.PRODUCT + "/" + id).then(response => {
            if (response.status == STATUS.OK) {
                this.productOne = response.data;
            }
        }).catch(error => console.error(error));
    }

    formatPrice(x) {
        let newNumber = x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
        return newNumber;
    }
}