const form = document.querySelector('.form');
const inputs = document.querySelectorAll('.input');
const imageError = document.querySelector('.error');
const imageThumb = document.querySelector('.thumb');
const titleError = document.querySelector('#error-title');
const linkError = document.querySelector('#error-link');
const textareaError = document.querySelector('#error-textarea');
const submitBtn = document.querySelector('.submit');
const box = document.querySelector('#box');
const loadMoreBtn = document.querySelector('.load-more');
const preloader = document.querySelector('.preloader');

const PER_PAGE = 10;
const blocks = [];
let page = 1;
let countMaxBlocksInPage = PER_PAGE * page;

let file;
let imageURL;
let titleValue;
let linkValue;
let textValue;

const renderImageInForm = () => {
    imageURL = window.URL.createObjectURL(file);
    imageThumb.innerHTML = `<img src="${imageURL}" width="190" />`;
};

const renderBlocks = blocks => {
    const markup = blocks.map(block => {
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
    
    preloader.classList.remove('is-none');
    box.insertAdjacentHTML('beforeend', markup);
    preloader.classList.add('is-none');
};

const handlleValidationInput = input => {
    switch (input.dataset.input) {
        case 'image':
            if (!input.value) {
                imageError.textContent = 'Нужно выбрать изображения следующих форматов: .png, .jpeg';
                return;
            };

            file = input.files[0];
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                imageError.textContent = 'Разрешено выбрать изображения следующих форматов: .png, .jpeg';
                imageError.classList.add('active');
                imageThumb.innerHTML = '';
                return;
            };
        
            imageError.textContent = '';
            imageError.classList.remove('active');
            renderImageInForm();
            break;
        
        case 'title':
            if (!input.value) {
                titleError.textContent = 'Поле ввода не может быть пустым';
                return;
            };
            if (!input.value.match(/^[А-Яа-яЁёІіЇїЄєҐґ\s]+$/)) {
                titleError.textContent = 'Только кириллические символы';
                titleError.classList.add('active');
                return;
            };
            titleValue = input.value;
            titleError.textContent = '';
            titleError.classList.remove('active');
            break;
            
        case 'link':
            if (!input.value) {
                linkError.textContent = 'Поле ввода не может быть пустым';
                return;
            };
                
            linkValue = input.value;
            linkError.textContent = '';
            linkError.classList.remove('active');
            break;
            
        case 'text':
            if (!input.value) {
                textareaError.textContent = 'Поле ввода не может быть пустым';
                return;
            };
            if (!input.value.match(/^[А-Яа-яЁёІіЇїЄєҐґ\s]+$/)) {
                textareaError.textContent = 'Только кириллические символы';
                textareaError.classList.add('active');
                return;
            };
            textValue = input.value;
            textareaError.textContent = '';
            textareaError.classList.remove('active');
            break;
        
        default:
            return;
    };
};

const handlleSubmit = event => {
    event.preventDefault();

    inputs.forEach(input =>  handlleValidationInput(input));

    blocks.push({ imageURL, titleValue, textValue, linkValue });
    
    imageThumb.innerHTML = '';
    form.reset();
    
    if (blocks.length > countMaxBlocksInPage) {
        loadMoreBtn.classList.remove('is-none');
        return;
    };

    const lastBlock = blocks[blocks.length - 1];
    renderBlocks([lastBlock]);
};

const handlleLoadMore = () => {
    const start = countMaxBlocksInPage;
    page += 1;
    countMaxBlocksInPage = PER_PAGE * page;
    const end = Math.min(blocks.length, countMaxBlocksInPage);
    const blocksForRender = blocks.slice(start, end);

    renderBlocks(blocksForRender);

    if (blocks.length > countMaxBlocksInPage) return;
    loadMoreBtn.classList.add('is-none');
};

inputs.forEach(input => input.addEventListener("input", event => handlleValidationInput(event.target)));
submitBtn.addEventListener('click', handlleSubmit);
loadMoreBtn.addEventListener('click', handlleLoadMore);