var ProductNameInput = document.getElementById('ProductName');
var ProductPriceInput = document.getElementById('ProductPrice');
var ProductCategoryInput = document.getElementById('ProductCategory');
var ProductDescriptionInput = document.getElementById('ProductDescription');
var ProductImageInput = document.getElementById('ProductImage');
var searchInput = document.getElementById('searchInput');
var addBtn = document.getElementById('addBtn');
var updateBtn = document.getElementById('updateBtn');
var currentIndex;
var productList = [];

if (localStorage.getItem('productList') !== null) {
    productList = JSON.parse(localStorage.getItem('productList'));
    displayProduct(productList);
}

function addProduct() {
    const Product = {
        code: ProductNameInput.value.trim(),
        price: ProductPriceInput.value.trim(),
        category: ProductCategoryInput.value.trim(),
        description: ProductDescriptionInput.value.trim(),
        image: ProductImageInput.files[0] ? `images/${ProductImageInput.files[0].name}` : 'images/default.png',
    };

    if (!isValidProduct(Product)) {
        alert('Please fill out all required fields correctly.');
        return;
    }

    productList.push(Product);
    updatelocalStorage();
    displayProduct(productList);
    clearForm();
}

function getDataToUpdate(index) {
    ProductNameInput.value = productList[index].code;
    ProductPriceInput.value = productList[index].price;
    ProductCategoryInput.value = productList[index].category;
    ProductDescriptionInput.value = productList[index].description;
    currentIndex = index;
    addBtn.classList.add('d-none');
    updateBtn.classList.remove('d-none');
}

function updateProduct() {
    productList[currentIndex].code = ProductNameInput.value.trim();
    productList[currentIndex].price = ProductPriceInput.value.trim();
    productList[currentIndex].category = ProductCategoryInput.value.trim();
    productList[currentIndex].description = ProductDescriptionInput.value.trim();

    if (!isValidProduct(productList[currentIndex])) {
        alert('Please fill out all required fields correctly.');
        return;
    }

    updatelocalStorage();
    displayProduct(productList);
    addBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none');
    clearForm();
}

function deleteProduct(index) {
    productList.splice(index, 1);
    updatelocalStorage();
    displayProduct(productList);
}

function searchProducts(searchValue) {
    const lowerCaseSearchValue = searchValue.trim().toLowerCase();
    const searchRegex = new RegExp(lowerCaseSearchValue, 'gi');

    const searchItem = productList.map((product) => {
        if (searchRegex.test(product.code)) {
            const highlightedName = product.code.replace(
                searchRegex,
                (match) => `<span class="text-danger">${match}</span>`
            );

            return { ...product, highlightedName };
        }
        return null;
    }).filter(product => product !== null);

    displayProduct(searchItem);
}

function displayProduct(list) {
    var display = '';

    for (var i = 0; i < list.length; i++) {
        display += `
            <div class="col-md-4">
                <div class="item text-white border border-danger rounded-3 overflow-hidden">
                    <img src="${list[i].image}" alt="" class="w-100">
                    <div class="p-3">
                        <h2 class="h4">Name :- ${list[i].highlightedName || list[i].code}</h2>
                        <h3 class="h5">Price :- ${list[i].price}</h3>
                        <h3 class="h5">Category :- ${list[i].category}</h3>
                        <p>Description :- ${list[i].description}</p>
                        <button onclick="getDataToUpdate(${i})" class="btn btn-outline-warning w-100 mb-3">Update</button>
                        <button onclick="deleteProduct(${i})" class="btn btn-outline-danger w-100">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }

    document.getElementById('myData').innerHTML = display;
}

function updatelocalStorage() {
    localStorage.setItem('productList', JSON.stringify(productList));
}

function isValidProduct(product) {
    const nameRegex = /^[a-zA-Z0-9\s]+$/;
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    const categoryRegex = /^[a-zA-Z\s]+$/;
    const descriptionRegex = /^.{10,200}$/;

    return (
        nameRegex.test(product.code) &&
        priceRegex.test(product.price) &&
        categoryRegex.test(product.category) &&
        descriptionRegex.test(product.description)
    );
}

function clearForm() {
    ProductNameInput.value = '';
    ProductPriceInput.value = '';
    ProductCategoryInput.value = '';
    ProductDescriptionInput.value = '';
    ProductImageInput.value = null;
}
