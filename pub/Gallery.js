function gallery(selector) {



    const _self = {}

    _self.selector = selector
    _self.element = document.querySelector(selector)
    _self.holders = []
    _self.slides = []


    /*Div for display FullImage View*/
    const Fullview = document.createElement('div')
    Fullview.setAttribute('id', 'FullView')
    Fullview.style = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, .9); display: none; text-align: center; '
    const Fullimage = document.createElement('img')
    Fullimage.setAttribute('id', 'FullImage')
    Fullimage.style = 'padding: 24px; max-width: 98%; max-height: 98%'
    Fullview.appendChild(Fullimage)
    const btn = document.createElement("button")
    btn.innerHTML = "&times;"
    btn.style = 'position: absolute; top: 12px; right: 5px; cursor: pointer;'
    btn.onclick = function(){
        document.getElementById('FullView').style.display = 'none';
    }
    Fullview.appendChild(btn)
    _self.element.appendChild(Fullview)
    /*Div for display FullImage View*/




    _self.makeholders = function(num) {
        const holdersarea = document.createElement('div')
        holdersarea.style = 'width: 100%; height:100%; display: flex; justify-content: center;  align-items:center;'
        holdersarea.setAttribute('id', 'area')
        _self.element.append(holdersarea)
        const width = holdersarea.clientWidth
        const height = holdersarea.clientHeight
        for (let i = 0; i < num; i++){
            makeholder(holdersarea, num, width)
        }


    }
    _self.changesize = function(index, stlysheet) {
        console.log(stlysheet)
        this.holders[index].style = stlysheet;
    }
    /*Functionalities for reordering images*/
    makeholder = function(div, num, width) {
        const holder = document.createElement('div')
        const temp = 1/num * width
        holder.style = 'height: 300px; background-color: white; margin: 2%; float: left;'
        holder.style.width = temp + "px";
        div.append(holder)
        _self.holders.push(holder)
    }

    _self.drag = function() {
        for (let i = 0; i < _self.holders.length; i++) {
            _self.holders[i].setAttribute('draggable', true)
            _self.holders[i].style.cursor = 'move'
            _self.holders[i].classList.add('draggable')
        }
    }

    _self.order = function() {
        const draggables = document.querySelectorAll('.draggable')
        const container = _self.element.querySelector('#area')
        console.log(container)

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => {
                draggable.classList.add('dragging')
                const temp = document.getElementsByClassName('dragging')
                temp.style = 'opacity: 0.3;'
            })
            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging')
            })
        })

        container.addEventListener('dragover', e => {
            e.preventDefault()
            const afterElement = getDragAfterElement(container, e.clientX)
            const draggable = document.querySelector('.dragging')
            if (afterElement == null) {
                container.appendChild(draggable)
            }else{
                container.insertBefore(draggable, afterElement)
            }
        })
    }

    _self.setchildclass = function(className) {
        for (let i = 0; i < _self.holders.length; i++) {
            _self.holders[i].classList.add(className)
        }
        
    }

    _self.insertimages = function(index, path) {
        const image = document.createElement('img')
        image.setAttribute('src', path)
        image.style = 'width: 100%; height: 100%;'
        image.classList.add('child')
        image.onclick = function(){
            document.getElementById('FullImage').src = this.src;
            document.getElementById('FullView').style.display = 'block';

        }
        let numchild = _self.holders[index].children.length
        if (numchild > 0) {
            const old_image = _self.holders[index].querySelector('.child')
            _self.holders[index].removeChild(old_image)
            _self.holders[index].appendChild(image)
        }
        _self.holders[index].appendChild(image)
    }
/*Functionalities for image slider*/
    _self.makeslide = function(name) {
        const slide = document.createElement('div')
        slide.style = 'width: 20%; transition: 2s; background-color:grey;'
        slide.classList.add(name)
        _self.element.append(slide)
        _self.slides.push(slide)
        slide.setAttribute('id', 'radio' + _self.slides.length)
    }
    


    _self.show = function() {
        showSlides()
    }

    _self.insertslideimages = function(index, path) {
        const image = document.createElement('img')
        image.setAttribute('src', path)
        image.style = 'width: 100%; height: 100%;'
        image.classList.add('child')
        let numchild = _self.slides[index].children.length
        if (numchild > 0) {
            const old_image = _self.slides[index].querySelector('.child')
            _self.slides[index].removeChild(old_image)
            _self.slides[index].appendChild(image)
        }
        _self.slides[index].appendChild(image)

    }


    var slideIndex = 0
    function showSlides() {
        var i;
        for (i=0; i<_self.slides.length; i++){
            _self.slides[i].style.display = "none"
        }
        slideIndex++;
        if (slideIndex > _self.slides.length) {
            slideIndex = 1
        }
        _self.slides[slideIndex - 1].style.display = 'block'
        setTimeout(showSlides, 3500)
    }


/*Image Animations*/
    /*Pixel Rain effect*/
    _self.pixelRainEffect = function(height, width, sp=0.5, index=0, method = 0, path) {
        var image = new Image()
        image.src = path
        image.addEventListener('load', function(){
            var canvas = document.createElement('canvas')
            var context = canvas.getContext('2d')
            canvas.height = height
            canvas.width = width
            _self.element.appendChild(canvas)
            context.drawImage(image, 0, 0, canvas.width, canvas.height)
            const pixels = context.getImageData(0, 0, canvas.width, canvas.height)
            context.clearRect(0, 0, canvas.width, canvas.height)
            
            
            let particlesArray = []
            const numParticles = 5000

            let mappedImage = []
            for(let i = 0; i < canvas.height; i ++){
                let row = []
                for(let j = 0; j < canvas.width; j++){
                    const red = pixels.data[(i * 4 * pixels.width)+(j * 4)]
                    const green = pixels.data[(i * 4 * pixels.width)+(j * 4 + 1)]
                    const blue = pixels.data[(i * 4 * pixels.width)+(j * 4 + 2)]
                    const brightness = calculateRelativeBrightness(red, green, blue)
                    const cell = [
                        cellBrightness = brightness,
                        cellColor = 'rgb(' + red + ',' + green + ',' + blue +')'
                    ]
                    row.push(cell)
                }
                mappedImage.push(row)
            }

            function calculateRelativeBrightness(red, green, blue){
                return Math.sqrt(
                    (red * red) * 0.299 + 
                    (green * green) * 0.587 + 
                    (blue * blue) * 0.114
                )/100
            }



            class Particle {
                constructor(){
                    this.x = Math.random() * canvas.width
                    this.y = 0
                    this.speed = 0
                    this.velocity = Math.random() * sp
                    this.size = Math.random() * 1.5 + 1
                    this.position1 = Math.floor(this.y)
                    this.position2 = Math.floor(this.x)
                }
                update() {
                    this.position1 = Math.floor(this.y)
                    this.position2 = Math.floor(this.x)
                    this.speed = mappedImage[this.position1][this.position2][0]
                    let movement = (2.5 -  this.speed) + this.velocity

                    if(method == 0){
                        this.y += movement
                        if (this.y >= canvas.height){
                             this.y = 0
                             this.x = Math.random() * canvas.width
                        }
                    }
                    if(method == 1){
                        this.y += movement
                        this.x += movement
                        if (this.y >= canvas.height){
                             this.y = 0
                             this.x = Math.random() * canvas.width
                        }
                        if (this.x >= canvas.width){
                            this.x = 0
                            this.y = Math.random() * canvas.height
                       }
                    }
                }
                draw() {
                    context.beginPath()
                    if(index == 1){
                        context.fillStyle = mappedImage[this.position1][this.position2][1]
                    } else {
                        context.fillStyle = 'white'
                    }
                    context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                    context.fill()
                }
            }
            function init(){
                for (let i = 0; i < numParticles; i++){
                    particlesArray.push(new Particle)
                }
            }
            init()
            function animate() {
                context.globalAlpha = 0.05
                context.fillStyle = 'rgb(0,0,0)'
                context.fillRect(0, 0, canvas.width, canvas.height)
                context.globalAlpha = 0.2
                for (let i = 0; i < particlesArray.length; i++){
                    particlesArray[i].update()
                    context.globalAlpha = particlesArray[i].speed * 0.5
                    particlesArray[i].draw()
                }
                requestAnimationFrame(animate)
            }
            animate()

        })
        
        
    
    }

    return _self
}



function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = x - box.left - box.width / 2
        if (offset < 0 && offset > closest.offset){
            return { offset: offset, element:child }
        } else {
            return closest
        }

    }, {offset: Number.NEGATIVE_INFINITY}).element

}


