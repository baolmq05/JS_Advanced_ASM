const sideBarHTML = `
     <a href="./dashboard-day.html" class="btn btn-dark p-2 mb-4 w-100">
                        <i class="bi bi-grid-1x2-fill fs-3 me-1"></i>
                        Admin Page
                    </a>
                    <hr>
                    <a href="./dashboard-day.html" class="btn btn-outline-dark p-2 mb-3 w-100">
                        <i class="bi bi-house-door"></i> Thống kê
                    </a>

                    <div class="btn-group w-100 mb-3">
                        <a href="./category-index.html" class="btn btn-outline-dark">
                            <i class="bi bi-box"></i> Loại sản phẩm
                        </a>
                    </div>

                    <div class="btn-group w-100 mb-3">
                        <a href="./product-index.html" class="btn btn-outline-dark">
                            <i class="bi bi-border-all"></i> Sản phẩm
                        </a>
                    </div>

                    <div class="btn-group w-100 mb-3">
                        <a href="./order-index.html" class="btn btn-outline-dark">
                            <i class="bi bi-cart-fill"></i> Đơn hàng
                        </a>
                    </div>

                    <div class="btn-group w-100 mb-3">
                        <a href="./user-index.html" class="btn btn-outline-dark">
                            <i class="bi bi-people-fill"></i> Người dùng
                        </a>
                    </div>

                    <a href="../index.html" class="fw-bold btn btn-outline-primary p-2 mb-3 w-100">
                        <i class="bi bi-arrow-return-left"></i> Trở về trang người dùng
                    </a>
`;

const sideBarElement = document.querySelector("#side-bar");
sideBarElement.innerHTML = sideBarHTML;