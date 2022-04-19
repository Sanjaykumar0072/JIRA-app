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
    handleRemoval(ticketCont);
    handleColor(ticketCont);
    handleLock(ticketCont);
    if(!ticketId){
        ticketArr.push({"color":ticketColor,"task":task,"id":id});
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
function handleRemoval(ticket){
    ticket.addEventListener("click",function(){
        if(removeFlag){
            ticket.remove();
        }
    })
}

function handleColor(ticket) {
    let ticketColorBand = ticket.querySelector('.ticket-color');
    ticketColorBand.addEventListener('click',function(){
        let currentTicketColor = ticketColorBand.classList[1];
        let currentTicketColorIdx = colors.findIndex(function(color){
            return currentTicketColor === color;
        })

        newIdx = (currentTicketColorIdx + 1) % colors.length;
        newColor = colors[newIdx];
        ticketColorBand.classList.remove(currentTicketColor);
        ticketColorBand.classList.add(newColor);
    })
}

function handleLock(ticket) {
    let ticketLock = document.querySelector(".ticket-lock i");
    let ticketTaskArea = document.querySelector(".task-area");
    ticketLock.addEventListener('click',function(){
        if(ticketLock.classList.contains('fa-lock')){
            ticketLock.classList.remove('fa-lock');
            ticketLock.classList.add('fa-unlock');
            ticketTaskArea.setAttribute('contenteditable','true'); 
        }else{
            ticketLock.classList.remove('fa-unlock');
            ticketLock.classList.add('fa-lock');  
            ticketTaskArea.setAttribute('contenteditable','false');

        }
    })
}