fetch('./slides_ru.json')
    .then(response => response.json())
    .then(({ slides }) => {
        const slider = new Slider({
          slides,
          sliderContainerSelector: '#slider',
          navContainerSelector: '#nav-container',
          tinySlider: tns
        })
    })
    .catch((error) => console.error(error));

class Slider {
    slider;
    sliderContainer;
    navContainer;
    domParser;

    constructor({ sliderContainerSelector, navContainerSelector, slides, tinySlider }) {
        this.domParser = new DOMParser();
        this.sliderContainer = document.querySelector(sliderContainerSelector);
        this.navContainer = document.querySelector(navContainerSelector);
        this.renderTemplate(slides);
        this.initSlider({
            sliderFabric: tinySlider,
            sliderContainerSelector,
            navContainerSelector
        });
        this.initListeners();
    }

    renderTemplate(slides) {
        const slideTemplate = (slideData) => `
            <div class="slider-item ${slideData.slide.gif ? 'slider-item--has-gif' :''}" data-index="${slideData.index}">
                <div class="slider-img">
                    <div class="slider-icon">
                        <img src="/images/icons/play.svg" alt="watch gif">
                        <p>
                            Watch gif
                        </p>
                    </div>
                    <img src="${slideData.slide.img}"
                        alt="${slideData.alt}"
                        class="code-screenshot"
                        data-gif="${slideData.slide.gif}"
                        data-img="${slideData.slide.img}"
                    />
                </div>
                <span class="slider-description">
                    <b>${slideData.title}</b> ${slideData.description}
                </span>
            </div>
        `;
        const navTemplate = `<div class="dot"></div>`;
        slides.forEach((slideData, i) => {
            const htmlSlideString = slideTemplate({ ...slideData, index: i });
            const slideNode = this.domParser.parseFromString(htmlSlideString, "text/html").body.firstChild;
            const navNode = this.domParser.parseFromString(navTemplate, "text/html").body.firstChild;

            this.sliderContainer.appendChild(slideNode);
            this.navContainer.appendChild(navNode);
        });
    }

    initSlider({ sliderFabric, sliderContainerSelector, navContainerSelector }) {
        this.slider = sliderFabric({
            container: sliderContainerSelector,
            items: 1,
            preventScrollOnTouch: 'auto',
            nav: true,
            controls: false,
            mouseDrag: true,
            navPosition: 'bottom',
            navContainer: navContainerSelector
        })
    }

    initListeners() {
        this.sliderContainer.addEventListener('mouseup', (event) => {
            const slide = event.target.closest('.slider-item');
            const img = slide?.querySelector('.code-screenshot');
            const sliderContainer = event.target.closest('.slider-item');
            if (!slide || !img?.dataset?.gif) {
                return false;
            }

            const gifPlayed= img.src === img.dataset.gif;
            if (gifPlayed) {
                img.src = img.dataset.img;
                sliderContainer.classList.add('slider-item--has-gif');
            } else {
                img.src =  img.dataset.gif;
                sliderContainer.classList.remove('slider-item--has-gif');
            }
        });
    }
}
