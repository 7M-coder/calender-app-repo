// selectors 
let switchL = document.getElementById("left");
let switchR = document.getElementById("right");
let yearH = document.querySelector(".heading .year");
let monthH = document.querySelector(".heading .month");
let daysParent = document.querySelector(".weekdays");
let mDayParent = document.querySelector(".monthdays");
let form = document.querySelector("form");

// date object get methods
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
let weekday = date.getDay();
let currentDay = date.getDate();

let months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];
let weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

weekdays.forEach((el, i)=> {

    // a parent of a single day
    let day = document.createElement("span");
    day.classList.add("day");
    // add the day name as a class to itself
    day.classList.add(weekdays[i])
    // the day name heading
    let name = document.createElement("h6");
    
    name.textContent = weekdays[i];
    // add h6 to span.day
    day.appendChild(name);
    // add span.day to weekdays
    daysParent.appendChild(day);


})

let taskDate;

let tasks = {};
let completed = {};
// setters
let setYear = ()=> {

    yearH.textContent = year;

}
let setMonth = ()=> {

    if(month > 12) {
        month = 1;
        year++;

        setYear();
    } 
    if(month < 1){
        month = 12
        year--;

        setYear();
    } 

    monthH.textContent = months[month];

}
// event listeners
window.addEventListener("DOMContentLoaded", ()=> {

    setMonth()
    setYear()

    // list days by number
    getMonthDays();

    // mark current day & date & days not in this month
    mark();


    let cookies = document.cookie.split(";");
    // get the task date

    cookies.forEach((c, i) => {

        let cookieName = c.split("=")[0];

        if(cookieName.match("todolist")) {

            let dates = c.split("],");

            dates.forEach((date, i) => {
                
                let tempTaskDate;

                if(i == 0) {

                    date = date.replace(`todolist={"`, "")

                } 

                let datePos = date.search(/\d{2}\/[A-Za-z]{3}\/\d{4}/g);
    
                tempTaskDate = date.substring(datePos, 12);
                
                if(i==0 && tempTaskDate.includes(`"`)) {
                    tempTaskDate = tempTaskDate.replace(`"`, '');
                }

                    
    
                // get tasks related to this date
                let dateTasks = date.substring(date.indexOf("[")).split(",");
    
    
                tasks[tempTaskDate] = new Array();
    
                dateTasks.forEach(t => {
    
                    // remove the symbols from the task
                    let retrievedTask = t.replace(/[^\w\s]/g, '');
    
                    // date: [tasks]
                    tasks[tempTaskDate].push(retrievedTask);
                })
        
    
            })

        } else if(cookieName.match("completed")) {

            let dates = c.split("],");

            dates.forEach((date, i) => {

                let tempTaskDate;

                if(i == 0) {

                    date = date.replace(`completed={"`, "")

                }

                let datePos = date.search(/\d{2}\/[A-Za-z]{3}\/\d{4}/g);
    
                tempTaskDate = date.substring(datePos, 12);
                    
                if(i==0 && tempTaskDate.includes(`"`)) {
                    tempTaskDate = tempTaskDate.replace(`"`, '');
                }
    
                // get tasks related to this date
                let dateTasks = date.substring(date.indexOf("[")).split(",");
    
    
                completed[tempTaskDate] = new Array();
    
                dateTasks.forEach(t => {
    
                    // remove the symbols from the task
                    let retrievedTask = t.replace(/[^\w\s]/g, '');
    
                    // date: [tasks]
                    completed[tempTaskDate].push(retrievedTask);
                })
        
                
            })
        }

    })


    console.log(`tasks object when retrieving:`);
    console.log(tasks);
    console.log(`completed tasks object when retrieving`);
    console.log(completed);
})
switchL.addEventListener("click", ()=> {
    month--;
    setMonth();

    // remove old p.monthday
    document.querySelectorAll(".monthday").forEach((el)=> {

        el.remove();
    })

    // print the old month days
    getMonthDays();

    mark();

})
switchR.addEventListener("click", ()=> {
    month++;
    setMonth();
    
    // remove old p.monthday
    document.querySelectorAll(".monthday").forEach((el)=> {

        el.remove();
    })

    // print the next month days
    getMonthDays();

    mark()
})


form.addEventListener("submit", (e)=> {

    e.preventDefault();

    newTask();
})

// functions

let numOfDays = (month, year)=> {

    // create a date object in specific date will give access to every info related to that date 
    return new Date(year, month, 0).getDate();
}

let getMonthDays = ()=> {


    // blocks outside this month
    let diff = 35 - numOfDays(month, year);

    // get the first day index of current month
    let startDayIndex = new Date(year, month - 1, 0).getDay() + 1;
    // get the last date of the current month
    let endDayIndex = new Date(year, month, 0).getDay();
    let endDayDate = new Date(year, month, 0).getDate();
    let counter = 1;
    // get the remaining days of the previous month
    prevDaysRemaining = startDayIndex; // should be +ve value
    prevDaysDates = new Date(year, month - 1, 0).getDate() - prevDaysRemaining;
    prevDaysDates++;
    // get the remaining days of the next month
    nextDaysRemaining = 42 - startDayIndex - endDayDate; // should be +ve value
    nextDaysDates = 1;


    for (index = 1; index <= 42; index++) {
        
        let monthDay = document.createElement("span");
        monthDay.classList.add("monthday");
        
        let name = document.createElement("p");
        
        if(index <= prevDaysRemaining) { // prev month

            name.textContent = prevDaysDates;
            monthDay.dataset.m = month - 1;
            prevDaysDates++;

        } else if(counter > endDayDate) { // next month

            name.textContent = nextDaysDates;
            monthDay.dataset.m = month + 1;
            nextDaysDates++;
        } else { // this month

            name.textContent = counter;
            monthDay.dataset.m = month;
            counter++;
        }
        

        monthDay.appendChild(name);
    
        mDayParent.appendChild(monthDay);


        // dependent event listeners
        // adding a new task
        monthDay.addEventListener("click", (day)=> {

            showTasks(day);

        });
    
        
    }
}

let mark = ()=> {

    let tempMonth = new Date().getMonth() + 1;

    // add the active class to the current day
    document.querySelector(`.${weekdays[date.getDay()]}`).classList.add("active")


    let currentDate = document.querySelectorAll(".monthday p");
    currentDate.forEach((el)=> {

        // mark the current date
        if(tempMonth == month && el.textContent == currentDay) {

            el.classList.add("currentDay")

        }

        
        // mark days from next month
        if(el.parentElement.dataset.m != month) {

            el.classList.add("next");
            el.classList.remove("currentDay")
        }


    })
}
const showTasks = (day)=> {

    let taskContainer = document.querySelector(".task-container");
    if(taskContainer.classList.contains("disable")) {
        //show the task container
        taskContainer.classList.remove("disable");
    }

    // display the clicked day
    let mDay = day.target.textContent < 10 ? `0${day.target.textContent}` : day.target.textContent ;
    let date = `${mDay}/${months[day.target.parentElement.dataset.m]}/${document.querySelector(".year").textContent}`;

    document.querySelector(".task-date").textContent = date;
    // for global scope
    taskDate = date;

    if(tasks[date] != undefined && tasks[date].length != 0) {
        
        console.log('achived');
        tasks[date].forEach(item => {

            if(completed[date] !== undefined) {

                if(completed[date].includes(item)) { // if the task is completed

                    document.querySelector(".tasks").innerHTML += `<span class='task'><h5 class='task-title completed'>${item}</h5><i class='fa-solid fa-check check-icon'></i><i class='fa-solid fa-trash remove-icon'></i></span>`;
    
                } else {
    
                    document.querySelector(".tasks").innerHTML += `<span class='task'><h5 class='task-title'>${item}</h5><i class='fa-solid fa-check check-icon'></i><i class='fa-solid fa-trash remove-icon'></i></span>`;
    
                }    
            } else {

                document.querySelector(".tasks").innerHTML += `<span class='task'><h5 class='task-title'>${item}</h5><i class='fa-solid fa-check check-icon'></i><i class='fa-solid fa-trash remove-icon'></i></span>`;

            }
            

        });

        let check = document.querySelectorAll(".check-icon");
        let remove = document.querySelectorAll(".remove-icon");
        check.forEach(icon => {
    
            icon.addEventListener("click", (e)=> {
    
                completeTask(e)
            })
        })

        remove.forEach(icon => {

            icon.addEventListener("click", (e)=> {

                removeTask(e)
            })
        })
        
    }
    


    let closeBtn = document.querySelector(".close-btn");
    

    closeBtn.addEventListener("click", ()=> {

        document.querySelectorAll(".task").forEach(task => {

            task.remove();
        })

        // hide the task container
        taskContainer.classList.add("disable");
    });

}
const newTask = ()=> {

    let input = document.querySelector(".new-task");

    let newTask = document.createElement("span");
    newTask.classList.add("task");
    newTask.innerHTML += `<h5 class='task-title'>${input.value}</h5>
    <i class='fa-solid fa-check check-icon'></i><i class='fa-solid fa-trash remove-icon'></i>`;

    document.querySelector(".tasks").appendChild(newTask);

    console.log(taskDate);
    if(tasks[taskDate] == undefined) { // there is no tasks assigned to this date
        
        tasks[taskDate] = new Array();
    }

    tasks[taskDate].push(input.value)

    console.log(`tasks object when adding`);
    console.log(tasks);
    document.cookie = "todolist= " + JSON.stringify(tasks);

    let check = document.querySelectorAll(".check-icon");
    let remove = document.querySelectorAll(".remove-icon");
    check.forEach(icon => {

        icon.addEventListener("click", (e)=> {

            completeTask(e)
        })
    })

    remove.forEach(icon => {

        icon.addEventListener("click", (e)=> {

            removeTask(e)
        })
    })

}

const completeTask = (e)=> {

    // stopped here

    let completedTask =  e.target.previousSibling.textContent;
    let completedTaskDate = document.querySelector(".task-date").textContent;

    if(completed[completedTaskDate] == undefined) {
        completed[completedTaskDate] = new Array();
        completed[completedTaskDate].push(completedTask);

    } else {
        completed[completedTaskDate].push(completedTask);

    }

    document.cookie = "completed=" + JSON.stringify(completed);

    e.target.previousSibling.style.color = "gray";
    e.target.previousSibling.style.textDecoration = "line-through"
}

const removeTask = (e)=> {

    console.log(e.target.previousSibling.previousSibling.textContent);
    let task = e.target.previousSibling.previousSibling.textContent;

    let taskDate = document.querySelector(".task-date").textContent;
    tasks[taskDate].forEach((el, i) => {
        
        el == task ? delete tasks[taskDate][i] : true;
    })
    
    tasks[taskDate] = tasks[taskDate].filter(el => el !== '');

    completed[taskDate].forEach((el, i) => {

        el == task ? delete completed[taskDate][i] : true;
    })

    completed[taskDate] = completed[taskDate].filter(el => el !== '')

    document.cookie = `todolist=${JSON.stringify(tasks)}`;
    document.cookie = `completed=${JSON.stringify(completed)}`;

    console.log(`tasks after deleting:`);
    console.log(tasks);
    console.log(`completed after deleting:`);
    console.log(completed);
    
    e.target.parentElement.remove();
}