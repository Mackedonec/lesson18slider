(function () {
    const container = document.querySelector('#carousel')
    const slides = container.querySelectorAll('.slide')
    const indicatorsContainer = container.querySelector('#indicators-container')
    const indicatorItems = indicatorsContainer.querySelectorAll('.indicator')
    const pauseBtn = container.querySelector('#pause-btn')
    const prevBtn = container.querySelector('#prev-btn')
    const nextBtn = container.querySelector('#next-btn')

    const SLIDES_COUNT = slides.length;
    const CODE_ARROW_LEFT = 'ArrowLeft';
    const CODE_ARROW_RIGHT = 'ArrowRight';
    const CODE_SPACE = 'Space';

    const FA_PAUSE = '<i class="fas fa-pause-circle"></i>';
    const FA_PLAY = '<i class="fas fa-play-circle"></i>';

    let currentSlide = 0;
    let timerId = null;
    let isPlaying = true;
    let interval = 2000;
    let startPosX = null;
    let endPosX = null;

    function gotoNth(n) {
        slides[currentSlide].classList.toggle('active');
        indicatorItems[currentSlide].classList.toggle('active');
        currentSlide = (n + SLIDES_COUNT) % SLIDES_COUNT;
        indicatorItems[currentSlide].classList.toggle('active');
        slides[currentSlide].classList.toggle('active');
    }

    function gotoPrev() {
        gotoNth(currentSlide - 1)
    }

    function gotoNext() {
        gotoNth(currentSlide + 1)
    }

    function tick() {
        timerId = setInterval(gotoNext, interval);
    }

    function playHandler() {
        tick();
        pauseBtn.innerHTML = FA_PAUSE;
        isPlaying = true;
    }

    function pauseHandler() {
        clearInterval(timerId)
        pauseBtn.innerHTML = FA_PLAY;
        isPlaying = false;
    }

    const pausePlay = () => isPlaying ? pauseHandler() : playHandler();

    function prev() {
        pauseHandler();
        gotoPrev();
    }

    function next() {
        pauseHandler();
        gotoNext();
    }

    function indicate(e) {
        const target = e.target;

        if (target && target.classList.contains('indicator')) {
            pauseHandler();
            gotoNth(+target.dataset.slideTo);
        }
    }

    function pressKey(e) {
        if (e.code === CODE_ARROW_LEFT) prev();
        if (e.code === CODE_ARROW_RIGHT) next();
        if (e.code === CODE_SPACE) pausePlay();
    }

    function swipeStart(e) {
        startPosX = e instanceof MouseEvent
            ? e.pageX
            : e.changedTouches[0].pageX;
    }

    function swipeEnd(e) {
        endPosX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX;
        if (endPosX - startPosX > 100) prev();
        if (endPosX - startPosX < -100) next();
    }

    function initListeners() {
        pauseBtn.addEventListener('click', pausePlay)
        prevBtn.addEventListener('click', prev)
        nextBtn.addEventListener('click', next)
        indicatorsContainer.addEventListener('click', indicate)
        container.addEventListener('touchstart', swipeStart)
        container.addEventListener('mousedown', swipeStart)
        container.addEventListener('touchend', swipeEnd)
        container.addEventListener('mouseup', swipeEnd)
        document.addEventListener('keydown', pressKey)
    };

    function initApp() {
        initListeners();
        tick()
    };

    initApp();

}());