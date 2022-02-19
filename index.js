const imageInput = document.querySelector('#input-image');
const imageError = document.querySelector('.error');
const ImageThumb = document.querySelector('.thumb');
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

const handlleImageInput = () => {
    const fileType = imageInput.files[0].type;
    if (fileType !== 'image/png' && fileType !== 'image/jpeg') {
        ImageThumb.innerHTML = ``;
        imageError.textContent = 'Разрешено выбрать изображения следующих форматов: .png, .jpeg';
        imageError.classList.add('active');
        return false;
    };
    
    const imageURL = window.URL.createObjectURL(imageInput.files[0]);
    ImageThumb.innerHTML = `<img src="${imageURL}" width="190" />`;
    
    imageError.textContent = '';
    imageError.classList.remove('active');
    return true;
};

const handlleTitleInput = () => {
    if (!titleInput.value) {
        titleError.textContent = 'Поле ввода не может быть пустым';
        return false;
    };
    if (!titleInput.value.match(/^[А-Яа-яЁё\s]+$/)) {
        titleError.textContent = 'Только кириллические символы';
        titleError.classList.add('active');
        return false;
    };

    titleError.textContent = '';
    titleError.classList.remove('active');
    return true;
};

const handlleLinkInput = () => {
    if (!linkInput.value) {
        linkError.textContent = 'Поле ввода не может быть пустым';
        return false;
    };

    linkError.textContent = '';
    linkError.classList.remove('active');
    return true;
};

const handlletextarea = () => {
    if (!textarea.value) {
        textareaError.textContent = 'Поле ввода не может быть пустым';
        return false;
    };
    if (!textarea.value.match(/^[А-Яа-яЁё\s]+$/)) {
        textareaError.textContent = 'Только кириллические символы';
        textareaError.classList.add('active');
        return false;
    };

    textareaError.textContent = '';
    textareaError.classList.remove('active');
    return true;
};

const handlleSubmit = event => {
    event.preventDefault();
    
    const image = imageInput.value;
    const title = titleInput.value;
    const link = linkInput.value;
    const text = textarea.value;

    // ---------------------
    // Перевірка на пусті поля вводу
    if (!image) {
        imageError.textContent = 'Нужно выбрать изображения следующих форматов: .png, .jpeg';
        return
    };
    if (!title) {
        titleError.textContent = 'Поле ввода не может быть пустым';
        return;
    }; 
    if (!link) {
        linkError.textContent = 'Поле ввода не может быть пустым';
        return;
    };
    if (!text) {
        textareaError.textContent = 'Поле ввода не может быть пустым';
        return;
    };
    // ---------------------

    // ---------------------
    // Перевірка на валідність введених даних в поля вводу
    if (!handlleImageInput()) return;
    if (!handlleTitleInput()) return;
    if (!handlleLinkInput()) return;
    if (!handlletextarea()) return;
    // ---------------------
    
    const imageURL = window.URL.createObjectURL(imageInput.files[0]);
    
    blocks.push({ imageURL, title, text, link });
    
    if (blocks.length > countMaxBlocksInPage) {
        return;
    };
    
    preloader.classList.remove('is-none');
    
    const markup = `
        <div class="block">
            <a href="${link}">
                <img src="${imageURL}" alt="${title}" />
                <p>${title}</p>
                <p>${text}</p>
            </a>
        </div>
    `;
    
    // ---------------------
    // Очистка форми
    ImageThumb.innerHTML = '';
    imageInput.value = '';
    titleInput.value = '';
    linkInput.value = '';
    textarea.value = '';
    // ---------------------
    
    preloader.classList.add('is-none');
    box.insertAdjacentHTML('beforeend', markup);
};

const handlleLoadMore = () => {
    preloader.classList.remove('is-none');
    const start = countMaxBlocksInPage;
    page += 1;
    countMaxBlocksInPage = PER_PAGE * page;
    const end = Math.min(blocks.length, countMaxBlocksInPage);

    const markup = blocks.slice(start, end).map(block => {
        const { imageURL, title, text, link } = block;

        return `
            <div class="block">
                <a href="${link}">
                    <img src="${imageURL}" alt="${title}" />
                    <p>${title}</p>
                    <p>${text}</p>
                </a>
            </div>
        `;
    }).join('');

    preloader.classList.add('is-none');
    box.insertAdjacentHTML('beforeend', markup);
    if (blocks.length > countMaxBlocksInPage) return;

    loadMoreBtn.classList.add('is-none');
};

imageInput.addEventListener('input', handlleImageInput);
titleInput.addEventListener("input", handlleTitleInput);
linkInput.addEventListener("input", handlleLinkInput);
textarea.addEventListener("input", handlletextarea);
submitBtn.addEventListener('click', handlleSubmit);
loadMoreBtn.addEventListener('click', handlleLoadMore);