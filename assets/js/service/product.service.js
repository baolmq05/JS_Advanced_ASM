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
                                <a href="./page/product-detail.html?${item.id}" class="btn btn-outline-primary">Xem chi tiết</a>
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

    async productDetailLoad(id) {
        await axios.get(API_URL + ENDPOINT.PRODUCT + "/" + id).then(response => {
            if (response.status == STATUS.OK) {
                this.productOne = response.data;
            }
        }).catch(error => console.error(error));
    }

    // Find product
    productRenderByCategory(categoryId) {
        const filtered = this.productList.filter(pro =>
            pro.category_id == categoryId
        );

        let htmlList = ``;

        if (filtered.length > 0) {
            filtered.forEach((item) => {
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
        } else {
            htmlList = `Không tìm thấy sản phẩm nào`;
        }

        return htmlList;
    }

    productRenderBySort(productCurrentList, sortValue) {
        let htmlList = ``;
        let productSorted;
        if (productCurrentList.length > 0) {
            if (sortValue == "") {
                productSorted = productCurrentList;
            } else {
                if (sortValue == 1) {
                    productCurrentList.sort((a, b) => a.base_price - b.base_price);
                    productSorted = productCurrentList;
                } else if (sortValue == 0) {
                    productCurrentList.sort((a, b) => b.base_price - a.base_price);
                    productSorted = productCurrentList;
                }
            }

            productSorted.forEach((item) => {
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
        } else {
            htmlList = "Không có sản phẩm để sắp xếp";
        }

        return htmlList;
    }

    productRenderBySearch(productCurrentList, searchValue) {
        let htmlList = ``;

        if (searchValue == "") {
            htmlList = this.productRenderShop();
        } else {
            const filtered = productCurrentList.filter(pro =>
                pro.name.toLowerCase().includes(searchValue.toLowerCase())
            );

            if (filtered.length > 0) {
                filtered.forEach((item) => {
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
                    </div>`;

                    htmlList += htmlItem;
                });
            } else {
                htmlList = "Không có sản phẩm để sắp xếp";
            }

            return htmlList;
        }
    }

    productRenderByCurrentList(array) {
        let htmlList = ``;

        array.forEach((item) => {
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

    formatPrice(x) {
        let newNumber = x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
        return newNumber;
    }
}
