let addBtn = document.querySelector(".add-btn");
let addModel = true;
let modelCont = document.querySelector(".model-cont");
let mainCont = document.querySelector(".main-cont");
let taskAreaCont = document.querySelector(".text-area-cont");
let allpriorityColors =document.querySelectorAll(".priority-color");
//let modelPriorityColor ='red';
let removeBtn = document.querySelector(".remove-btn");
let removeFlag = false;
let colors = ['yellow','blue','green','red'];
let modelPriorityColor = colors[colors.length-1];
var uid = new ShortUniqueId();
let toolBoxColors = document.querySelectorAll(".color");

let ticketArr = [];

if(localStorage.getItem('tickets')){
    ticketArrStr = localStorage.getItem('tickets');
    ticketArr = JSON.parse(ticketArrStr);
    for(let i=0;i<ticketArr.length;i++){
        let ticketObj = ticketArr[i];
        createTicket(ticketObj.color,ticketObj.task,ticketObj.id);
    } 
}

for(let i=0;i<toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener("click",function(){
        let currentColor = toolBoxColors[i].classList[1];
        let filteredArr = ticketArr.filter(function(ticketObj){
            return currentColor == ticketObj.color;
        })
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let j=0;j<allTickets.length;j++){
            allTickets[j].remove();
        }
        for(let j=0;j<filteredArr.length;j++){
            let color = filteredArr[j].color;
            let task = filteredArr[j].task;
            let id = filteredArr[j].id;
            createTicket(color,task,id);
        }
    })

    toolBoxColors[i].addEventListener('dblclick',function(){
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTickets.length;i++){
           allTickets[i].remove();
        }
        for(let j=0;j<ticketArr.length;j++){
            let ticketObj = ticketArr[j];
            createTicket(ticketObj.color,ticketObj.task,ticketObj.id);
        }
    })
}

//showing model
addBtn.addEventListener("click",function(){
    //console.log("btn clicked");
    if(addModel){
        modelCont.style.display = "flex";
    }else{
        modelCont.style.display = "none";
    }
    addModel = !addModel;
})

//priority colors change
for(let i=0;i<allpriorityColors.length;i++){
    let priorityDivOneColor = allpriorityColors[i];
    priorityDivOneColor.addEventListener("click",function(){
        for(let j=0;j<allpriorityColors.length;j++){
            allpriorityColors[j].classList.remove('active');
        }
        priorityDivOneColor.classList.add("active");
        modelPriorityColor = priorityDivOneColor.classList[0];
    })
}

//generating ticket
modelCont.addEventListener('keydown',function(e){
    let key = e.key;
    if(key == 'Enter'){
        createTicket(modelPriorityColor,taskAreaCont.value);
        taskAreaCont.value = "";
        modelCont.style.display = "none";
        addModel = !addModel;
    }
})

function createTicket(ticketColor,task,ticketId){
    // <div class="ticket-cont">
            // <div class="ticket-color"></div>
            // <div class="ticket-id"></div>
            // <div class="task-area"></div>
    //     </div>
    let id;
    if(!ticketId){
        id = uid();
    }else{
        id = ticketId;
    }
    let ticketCont = document.createElement('div');
    ticketCont.setAttribute('class','ticket-cont');
    ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
                            <div class="ticket-id">#${id}</div>
                            <div class="task-area">${task}</div>
                            <div class="ticket-lock"><i class="fa fa-lock"></i></div>`;    
    mainCont.appendChild(ticketCont);
    handleRemoval(ticketCont,id);
    handleColor(ticketCont,id);
    handleLock(ticketCont,id);
    if(!ticketId){
        ticketArr.push({"color":ticketColor,"task":task,"id":id});
        let ticketArrStr = JSON.stringify(ticketArr);
        localStorage.setItem('tickets',ticketArrStr);
    }
}

removeBtn.addEventListener("click",function(){
    if(removeFlag){
        removeBtn.style.color = 'black'
    }else{
        removeBtn.style.color = 'red'
    }
    removeFlag = !removeFlag;
})
function handleRemoval(ticket,id){
    ticket.addEventListener("click",function(){
        if(removeFlag){
            let idx = getTicketIdx(id);
            ticketArr.splice(idx,1);
            let ticketArrStr = JSON.stringify(ticketArr);
            localStorage.setItem('tickets',ticketArrStr);
            ticket.remove();
        }
    })
}

function handleColor(ticket,id) {
    let ticketColorBand = ticket.querySelector('.ticket-color');
    ticketColorBand.addEventListener('click',function(){
        let currentTicketColor = ticketColorBand.classList[1];
        let currentTicketColorIdx = colors.findIndex(function(color){
            return currentTicketColor === color;
        })
        let ticketIdx = getTicketIdx(id);
        newIdx = (currentTicketColorIdx + 1) % colors.length;
        newColor = colors[newIdx];
        ticketColorBand.classList.remove(currentTicketColor);
        ticketColorBand.classList.add(newColor);
        ticketArr[ticketIdx].color = newColor;
        localStorage.setItem('tickets',JSON.stringify(ticketArr));
    })
}

function handleLock(ticket,id){
    let ticketLock = ticket.querySelector(".ticket-lock i");
    let ticketTaskArea = ticket.querySelector('.task-area');
    ticketLock.addEventListener("click",function(){
        let ticketIdx = getTicketIdx(id);
        if(ticketLock.classList.contains('fa-lock')){
            ticketLock.classList.remove('fa-lock');
            ticketLock.classList.add('fa-unlock');
            ticketTaskArea.setAttribute('contenteditable','true');
        }else{
            ticketLock.classList.remove('fa-unlock');
            ticketLock.classList.add('fa-lock');
            ticketTaskArea.setAttribute('contenteditable','false');
        }
        ticketArr[ticketIdx].task = ticketTaskArea.innerText;
        localStorage.setItem('tickets',JSON.stringify(ticketArr));
    })

}

function getTicketIdx(id){
    let TicketIdx = ticketArr.findIndex(function(ticketObj){
        return ticketObj.id == id;
    })
    return TicketIdx;
}