// // Change Main Image
// const gallaryContainer = document.querySelector(".gallary");
// const imageProductDetail = document.querySelector("#main-image-detail");

// const gallaryBoxList = gallaryContainer.querySelectorAll(".gallary-box");

// for(let gallaryBox of gallaryBoxList) {
//     gallaryBox.addEventListener("click", () => {
//         removeGallaryActive(gallaryBoxList);
//         gallaryBox.classList.add("gallary-box-active");
//         setMainImageDetail(gallaryBox.firstElementChild);
//     });
// }

// const removeGallaryActive = (arr) => {
//     for(let gallary of arr) {
//         gallary.classList.remove("gallary-box-active");
//     }
// };

// const setMainImageDetail = (currentImage) => {
//     imageProductDetail.src = currentImage.src;
// };

// Toogle Quantity
const increBtn = document.getElementById("btn-increment");
const decreBtn = document.getElementById("btn-decrement");
let inputQuantity = document.getElementById("input-quantity");

increBtn.addEventListener("click", function () {
    if (inputQuantity.value >= 99) return;
    let number = Number(inputQuantity.value);
    number += 1;
    inputQuantity.value = number;
});

decreBtn.addEventListener("click", () => {
    if (inputQuantity.value <= 1) return;
    inputQuantity.value -= 1;
}); 
