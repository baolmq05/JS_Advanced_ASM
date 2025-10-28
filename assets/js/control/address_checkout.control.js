let provinceE = document.querySelector("#province");
let districtE = document.querySelector("#district");
let wardE = document.querySelector("#ward");

let provinceData;
let districtData;
let wardData;

async function getProvince() {
    await fetch("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Token': '3f6a7dfa-3f99-11f0-af3d-c6397eafcdbc'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.code == 200) {
                provinceData = data.data;
            }
        });
}

async function getDistrict() {
    await fetch("https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=" + provinceE.value, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Token': '3f6a7dfa-3f99-11f0-af3d-c6397eafcdbc'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.code == 200) {
                districtData = data.data;
                printDistrict();
            }
        });
}

async function getWard() {
    await fetch("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=" + districtE.value, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Token': '3f6a7dfa-3f99-11f0-af3d-c6397eafcdbc'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.code == 200) {
                wardData = data.data;
                printWard();
            }
        });
}

const printDistrict = () => {
    districtData.forEach(item => {
        let newOption = document.createElement("option");
        newOption.value = item.DistrictID;
        newOption.innerText = item.DistrictName;

        districtE.appendChild(newOption);
    })
}

const printWard = () => {
    wardData.forEach(item => {
        let newOption = document.createElement("option");
        newOption.value = item.WardCode;
        newOption.innerText = item.WardName;

        wardE.appendChild(newOption);
    })
}

async function provinceLoading() {
    await getProvince();
    printProvince();
    provinceSelectEvent();
    districtSelectEvent();
}

const printProvince = () => {
    provinceData.forEach(element => {
        let newOption = document.createElement("option");
        newOption.value = element.ProvinceID;
        newOption.innerText = element.ProvinceName;

        provinceE.appendChild(newOption);
    });
}

const provinceSelectEvent = () => {
    provinceE.addEventListener("change", getDistrict);
}

const districtSelectEvent = () => {
    districtE.addEventListener("change", getWard);
}

provinceLoading();