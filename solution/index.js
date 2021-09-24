
//Recieves the list id which the task should be created in, and creates the task.
function addTask(listId) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    let text;
    //Finds the task's text by finding the input element of the section and taking its value.
    for (let child of document.getElementById(listId).parentElement.children) {
        if (child.tagName === "INPUT") {
            text = child.value;
            child.value = "";
        }
    }
    if (listId === "todo") {
        tasks.todo.push(text);
    }
    if (listId === "in-progress") {
        tasks['in-progress'].push(text);
    }
    if (listId === "done") {
        tasks.done.push(text);
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    generateTasks();
}

//Recieves an object containing the element type, attributes, and classes, and makes an html element from it.
function createElementFromObject(obj) {
    const el = document.createElement(`${obj.type}`);
    for (const cls of obj.classes) {
        el.classList.add(cls)
    }
    for (const attr in obj.attributes) {
        el.setAttribute(attr, obj.attributes[attr]);
    }
    return el;
}

//Updated the sections to the only the tasks containing the string searched in the search box. Updated per keyStroke. Does not effect localStorage.
function searchTasks(event) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (event.target.value !== "") {
        const searchedTasks = {
            "todo": [],
            "in-progress": [],
            "done": []
        }
        for(let taskList in tasks){
            for(let task of tasks[`${taskList}`]){
                if(task.includes(event.target.value)){
                    searchedTasks[`${taskList}`].push(task);
                }
            }
        }
        //localStorage.setItem("searchedTasks", JSON.stringify(searchTasks));
        document.getElementById("todo").textContent = "";
        document.getElementById("in-progress").textContent = "";
        document.getElementById("done").textContent = "";
        appendTask(searchedTasks, ["todo", "in-progress", "done"]);
    }
    else {
        generateTasks();
    }
}

//generates all the tasks by appending their li element to the corresponding ul element.
function generateTasks() {
    if (localStorage.length === 0) {
        const tasksObj = {
            "todo": [],
            "in-progress": [],
            "done": []
        }
        localStorage.setItem("tasks", JSON.stringify(tasksObj))
    }
    if (localStorage.length === 2) {

    }
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    //First, resets all the ul elements to prevent duplication
    document.getElementById("todo").textContent = "";
    document.getElementById("in-progress").textContent = "";
    document.getElementById("done").textContent = "";
    //Goes through localStorage, creates the li elements, and appends it to the right ul.
    appendTask(tasks, ["todo", "in-progress", "done"]);
}

//Appends all tasks as li elements to the ul lists.
function appendTask(tasks, listsIdArr) {
    let countForIds = 1;
    for (let j = 0; j < listsIdArr.length; j++) {
        if (tasks[listsIdArr[j]].length > 0) {
            for (let i = 0; i < tasks[listsIdArr[j]].length; i++) {
                const taskObj = { type: "li", attributes: { id: "task" + countForIds }, classes: ["task"] }
                const el = createElementFromObject(taskObj);
                el.textContent = tasks[listsIdArr[j]][i];
                const editInput = document.createElement("input");
                editInput.type = "hidden";
                editInput.value = el.textContent;
                const parent = document.getElementById(listsIdArr[j]);

                parent.append(el);
                parent.append(editInput);
                countForIds++;
            }
        }
    }
}

//Hover event, checks if alt + 1/2/3 are pressed, then moves the hovered task.
function taskHovered(event) {
    if (event.target.classList.contains("task")) { //Make sure the hovered element is li.
        const taskType = event.target.parentElement.id; //The original list id, so we know where to move from.
        document.addEventListener("keydown", (e) => {
            if (e.altKey) {
                if (e.key === "1") {
                    moveTask(event.target.textContent, "todo", taskType);
                    e.stopPropagation();
                }
                if (e.key === "2") {
                    moveTask(event.target.textContent, "in-progress", taskType);
                    e.stopPropagation();
                }
                if (e.key === "3") {
                    moveTask(event.target.textContent, "done", taskType);
                    e.stopPropagation();
                }
            }
        })
    }
}

//Moves task 'task' from 'moveFrom' list to 'moveTo' list.
function moveTask(task, moveTo, moveFrom) {
    console.log(`Moving ${task} from ${moveFrom} to ${moveTo}!`)
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[`${moveFrom}`].splice(tasks[`${moveFrom}`].findIndex(a => a === task), 1);
    tasks[`${moveTo}`].push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    generateTasks();
}

function editTask(event) {
    if (event.target.classList.contains("task")) {
        const oldTask = event.target.textContent;
        const taskType = event.target.parentElement.id;
        event.target.style.display = "none";
        const editInput = event.target.nextElementSibling;
        editInput.type = "text";
        editInput.addEventListener("blur", (e) => {
            event.target.textContent = editInput.value;
            event.target.style.display = "list-item";
            editInput.type = "hidden";
            updateTask(oldTask, editInput.value, taskType);
        })
    }
}

function updateTask(oldTask, newTask, taskListId) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const taskIndex = tasks[`${taskListId}`].findIndex(a => a === oldTask);
    tasks[`${taskListId}`][taskIndex] = newTask;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    generateTasks();
}

function generatePage() {
    document.addEventListener("keydown", newTaskMove);
    document.addEventListener("mouseover", taskHovered);
    document.addEventListener("dblclick", editTask);
    document.getElementById("search").addEventListener("keyup", searchTasks)
    generateTasks();
}
//generateTasks();
generatePage();
