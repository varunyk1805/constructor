const form = document.querySelector('.form');
const imageInput = document.querySelector('#input-image');
const imageError = document.querySelector('.error');
const imageThumb = document.querySelector('.thumb');
const titleInput = document.querySelector('#input-title');
const titleError = document.querySelector('#error-title');
const linkInput = document.querySelector('#input-link');
const linkError = document.querySelector('#error-link');
const textarea = document.querySelector('#textarea');
const textareaError = document.querySelector('#error-textarea');
const submitBtn = document.querySelector('.submit');
const box = document.querySelector('#box');
const loadMoreBtn = document.querySelector('.load-more');
const preloader = document.querySelector('.preloader');

const PER_PAGE = 10;
const blocks = [];
let page = 1;
let countMaxBlocksInPage = PER_PAGE * page;

let imageURL;
let titleValue;
let linkValue;
let textValue;

const renderImageInForm = () => {
    const file = imageInput.files[0];
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        imageThumb.innerHTML = '';
        return;
    };
    imageURL = window.URL.createObjectURL(file);
    imageThumb.innerHTML = `<img src="${imageURL}" width="190" />`;
};

const handlleValidationInput = (input, error) => {
    
    if (input.id === 'input-image') {
        if (!imageInput.value) {
            error.textContent = 'Нужно выбрать изображения следующих форматов: .png, .jpeg';
            return false;
        };

        const file = imageInput.files[0];
        if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
            error.textContent = 'Разрешено выбрать изображения следующих форматов: .png, .jpeg';
            error.classList.add('active');
            return false;
        };
    
        imageError.textContent = '';
        imageError.classList.remove('active');
        return true;
    };
    
    if (input.id === 'input-title' || 'textarea') { 
        if (!input.value.match(/^[А-Яа-яЁёІіЇїЄєҐґ\s]+$/)) {
            error.textContent = 'Только кириллические символы';
            error.classList.add('active');
            return false;
        };
    };
    
    if (!input.value) {
        error.textContent = 'Поле ввода не может быть пустым';
        return false;
    }; 

    error.textContent = '';
    error.classList.remove('active');
    return true;        
};

const handlleSubmit = event => {
    event.preventDefault();
    
    if (!handlleValidationInput(imageInput, imageError)) return;
    if (!handlleValidationInput(titleInput, titleError)) return;
    if (!handlleValidationInput(linkInput, linkError)) return;
    if (!handlleValidationInput(textarea, textareaError)) return;

    titleValue = titleInput.value;
    linkValue = linkInput.value;
    textValue = textarea.value;
    
    blocks.push({ imageURL, titleValue, textValue, linkValue });

    imageThumb.innerHTML = '';
    form.reset();
    
    if (blocks.length > countMaxBlocksInPage) {
        loadMoreBtn.classList.remove('is-none');
        return;
    };

    preloader.classList.remove('is-none');
    const markup = `
        <div class="block">
            <a href="${linkValue}">
                <img src="${imageURL}" alt="${titleValue}" />
                <p>${titleValue}</p>
                <p>${textValue}</p>
            </a>
        </div>
    `;   
    preloader.classList.add('is-none');
    box.insertAdjacentHTML('beforeend', markup);
};

const handlleLoadMore = () => {
    const start = countMaxBlocksInPage;
    page += 1;
    countMaxBlocksInPage = PER_PAGE * page;
    const end = Math.min(blocks.length, countMaxBlocksInPage);
    
    preloader.classList.remove('is-none');
    const markup = blocks.slice(start, end).map(block => {
        const { imageURL, titleValue, textValue, linkValue } = block;

        return `
            <div class="block">
                <a href="${linkValue}">
                    <img src="${imageURL}" alt="${titleValue}" />
                    <p>${titleValue}</p>
                    <p>${textValue}</p>
                </a>
            </div>
        `;
    }).join('');
    preloader.classList.add('is-none');
    box.insertAdjacentHTML('beforeend', markup);

    if (blocks.length > countMaxBlocksInPage) return;
    loadMoreBtn.classList.add('is-none');
};

imageInput.addEventListener('input', () => {
    handlleValidationInput(imageInput, imageError);
    renderImageInForm();
});
titleInput.addEventListener("input", () => handlleValidationInput(titleInput, titleError));
linkInput.addEventListener("input", () => handlleValidationInput(linkInput, linkError));
textarea.addEventListener("input", () => handlleValidationInput(textarea, textareaError));
submitBtn.addEventListener('click', handlleSubmit);
loadMoreBtn.addEventListener('click', handlleLoadMore);