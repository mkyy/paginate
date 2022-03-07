const data = Array.from({ length:100}).map((_, i) => `Item ${i + 1}`)

// 
const html = {
    get(element){
        return document.querySelector(element);
    }
}// html possui funcao get que simplesmente retorna o query selector do elemento.

let perPage = 5;
let maxVisibleButtons = 5;
const stage = {
    page:1,
    perPage,
    totalPage: Math.ceil(data.length / perPage),
    maxVisibleButtons
}

const list = {
    create(item){
        const div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = item

        html.get('.list').appendChild(div);
    },
    
    update() {
        html.get('.list').innerHTML = '';
        let page = stage.page - 1;
        let start = page * stage.perPage;
        let end = start + stage.perPage;

        const paginatedItems = data.slice(start, end);

        paginatedItems.forEach(list.create)
    }

}

const controls = {
    next(){
        stage.page++;

        const amIAtLastPage = stage.page > stage.totalPage;
        if(amIAtLastPage){
            stage.page--;
        }
    },
    prev(){
        stage.page--
        const amIAtFirstpage = stage.page < 1;
        if(amIAtFirstpage){
            stage.page++;
        }

    },
    goTo(index_page){
        stage.page = +index_page;
        if(index_page > stage.totalPage){
            stage.page = stage.totalPage;
        }
    },
    createListeners(){
        document.querySelector('.first').addEventListener('click', () => {   
            controls.goTo(1);
            updateScreen();
        })
        html.get(".last").addEventListener('click', () =>{
            controls.goTo(stage.totalPage);
            updateScreen();
        })
        html.get(".next").addEventListener('click', () =>{
            controls.next();
            updateScreen();
        })
        html.get(".prev").addEventListener('click', () =>{
            controls.prev();
            updateScreen();
        })
    }

}

const buttons = {
    create(number){
        const button = document.createElement('div')

        button.innerHTML = number;  

        if(stage.page == number){
            button.classList.add('active')
        }

        button.addEventListener('click', (event) =>{
            const page = event.target.innerText

            controls.goTo(page)
            updateScreen()
        })

        html.get('.numbers').appendChild(button);
        
    },
    update(){
        html.get('.numbers').innerHTML = '';
        const {MaxLeft, MaxRight} = buttons.calculateMaxVisible();

        for(let page = MaxLeft; page <= MaxRight; page++){
            buttons.create(page)
        }
    },
    calculateMaxVisible(){
        let MaxLeft = (stage.page - Math.floor(maxVisibleButtons/2));
        let MaxRight = (stage.page + Math.floor(maxVisibleButtons/2))
        if(MaxLeft < 1){
            MaxLeft = 1;
            MaxRight = maxVisibleButtons;
        }
        if(MaxRight > stage.totalPage){
            MaxLeft = stage.totalPage - (maxVisibleButtons - 1)
            MaxRight = stage.totalPage
            if(MaxLeft < 1){ MaxLeft = 1}
        }
        return {MaxLeft, MaxRight};
    }
}

function updateScreen(){
    list.update();
    buttons.update();
}

function init(){
    controls.createListeners();
    updateScreen();
}

init()