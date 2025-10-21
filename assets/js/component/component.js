async function renderComponent(params) {
    const headerElement = document.getElementById("header");
    const footerElement = document.getElementById("footer");

    const headerHTML = `<header class="fixed-top">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand fw-bold text-uppercase" href="../index.html">Mobile Store</a>
                <button class="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="collapsibleNavId">
                    <ul class="navbar-nav ms-5 me-auto mt-2 mt-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" href="../index.html" aria-current="page">
                                <i class="bi bi-house-door"></i>
                                Trang chủ
                                <span class="visually-hidden">(current)</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./product.html" aria-current="page">
                                <i class="bi bi-box-seam"></i>
                                Sản phẩm
                                <span class="visually-hidden">(current)</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./about.html" aria-current="page">
                                <i class="bi bi-people-fill"></i>
                                Về chúng tôi
                                <span class="visually-hidden">(current)</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./contact.html" aria-current="page">
                                <i class="bi bi-headphones"></i>
                                Liên hệ
                                <span class="visually-hidden">(current)</span>
                            </a>
                        </li>
                        <!-- <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="dropdownId" data-bs-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false">Dropdown</a>
                            <div class="dropdown-menu" aria-labelledby="dropdownId">
                                <a class="dropdown-item" href="#">Action 1</a>
                                <a class="dropdown-item" href="#">Action 2</a>
                            </div>
                        </li> -->
                    </ul>
                    <div class="d-flex align-items-center my-2 my-lg-0 list-unstyled">
                        <form action="">
                            <input type="text" class="form-control" placeholder="Tìm kiếm">
                        </form>
                        
                        <li class="nav-item">
                            <a class="nav-link" href="./cart.html" aria-current="page">
                                <i class="bi bi-cart fs-4 text-dark"></i>
                                <!-- <span class="visually-hidden">(current)</span></a> -->
                            </a>
                        </li>

                        <div class="dropdown">
                            <a class="text-dark text-decoration-none dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                <img width="30" class="avatar-image" src="../assets/images/avatar/avatar.png" alt="">
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li id="profile_select">
                                    <a class="dropdown-item" href="./profile.html">
                                        <i class="bi bi-person"></i>
                                        <span class="fullname">User</span>
                                    </a>
                                </li>
                                <li id="login_select">
                                    <a class="dropdown-item text-primary" href="./login.html">
                                        <i class="bi bi-person"></i>
                                        Đăng nhập
                                    </a>
                                </li>
                                <li id="register_select">
                                    <a class="dropdown-item text-warning" href="./register.html">
                                        <i class="bi bi-person"></i>
                                        Đăng ký
                                    </a>
                                </li>
                                <li id="logout_select" class="border-top">
                                    <button class="dropdown-item text-danger" id="logout_BTN">
                                        <i class="bi bi-power"></i>
                                        Đăng xuất
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="#">Home</a></li>
                <li class="breadcrumb-item"><a href="#">Library</a></li>
                <li class="breadcrumb-item active" aria-current="page">Data</li>
            </ol>
        </nav> -->
    </header>`;

    const footerHTML = `<footer class="bg-dark">
        <div class="container py-5">
            <div class="row text-white">
                <div class="col-lg-3 col-sm-12 col-md-6">
                    <h5 class="text-uppercase">Mobile Store</h5>
                </div>
                <div class="col-lg-3 col-sm-12 col-md-6">
                    <h6>Thông tin công ty</h6>
                    <div class="my-5">
                        <p>Số điện thoại: 0123456789</p>
                        <p class="text-nowrap">Địa chỉ: Nguyễn Văn Cừ, Thành phố <br> Cần Thơ</p>
                        <p class="text-nowrap">Mobile Store công ty bán điện thoại <br> uy tính số 1 Cần Thơ</p>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-12 col-md-6">
                    <h6>Chính sách</h6>
                    <div class="my-5">
                        <p>Chính sách đổi trả</p>
                        <p>Chính sách bảo mật</p>
                        <p>Chính sách bảo hành</p>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-12 col-md-6">
                    <h6>Liên hệ với chúng tôi</h6>
                    <div class="mt-5 mb-3">
                        <form class="d-flex justify-content-start align-items-center">
                            <input type="text" class="form-control" placeholder="Email">
                            <button class="btn btn-outline-light">Gửi</button>
                        </form>
                    </div>
                    <div class="">
                        <p>
                            <i class="bi bi-github fs-5 me-lg-4 me-sm-0"></i>
                            <i class="bi bi-facebook fs-5 me-lg-4 me-sm-0"></i>
                            <i class="bi bi-tiktok fs-5 me-lg-4 me-sm-0"></i>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </footer>`;

    headerElement.innerHTML = headerHTML;
    footerElement.innerHTML = footerHTML;
}
import { User } from "../service/user.service.js";

// // Session (Alert)
const turnOffAlert = (alertElement, sessionName) => {
    sessionStorage.removeItem(sessionName);
    setTimeout(() => {
        alertElement.style.display = "none";
    }, 3000);
};

if (sessionStorage.getItem("login_success")) {
    let alertSuccessValue = sessionStorage.getItem("login_success");
    let alertElement = document.querySelector("#alert_success");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertSuccessValue;

    turnOffAlert(alertElement, "login_success");
}

if (sessionStorage.getItem("logout_success")) {
    let alertSuccessValue = sessionStorage.getItem("logout_success");
    let alertElement = document.querySelector("#alert_success");
    alertElement.style.display = "flex";
    alertElement.lastElementChild.innerText = alertSuccessValue;

    turnOffAlert(alertElement, "logout_success");
}

const user = new User();
let userList = [];
let userCurrent = [];

async function userLoading() {
    await renderComponent();
    await user.userLoadData();
    userList = user.getUserList();

    renderData();
}

const renderData = () => {
    if (sessionStorage.getItem("client_allow")) {
        let userID = sessionStorage.getItem("client_allow");
        userCurrent = userList.find(userItem => userItem.id == userID);

        renderProfileToggle();
    } else {
        let profileSelect = document.querySelector("#profile_select").style.display = "none";
        document.querySelector(".fullname").innerText = "";
        let logoutSelect = document.querySelector("#logout_select").style.display = "none";

        document.querySelector("#register_select").style.display = "block";
        document.querySelector("#login_select").style.display = "block";
    }
};

const renderProfileToggle = () => {
    let profileSelect = document.querySelector("#profile_select").style.display = "block";
    document.querySelector(".fullname").innerText = userCurrent.name;
    let logoutSelect = document.querySelector("#logout_select").style.display = "block";

    document.querySelector("#register_select").style.display = "none";
    document.querySelector("#login_select").style.display = "none";
}

userLoading();