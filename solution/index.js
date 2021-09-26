//Recieves the list id which the task should be created in, and creates the task.
function addTask(listId) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    let inputEl;
    let text;
    switch (listId) {
        case "todo":
            inputEl = document.getElementById("add-to-do-task")
            text = inputEl.value
            inputEl.value = "";
            break;
        case "in-progress":
            inputEl = document.getElementById("add-in-progress-task")
            text = inputEl.value
            inputEl.value = "";
            break;
        case "done":
            inputEl = document.getElementById("add-done-task")
            text = inputEl.value
            inputEl.value = "";
            break;
    }
    if (text !== "") {
        if (listId === "todo") {
            tasks.todo.push(text);
        }
        if (listId === "in-progress") {
            tasks['in-progress'].push(text);
        }
        if (listId === "done") {
            tasks.done.push(text);
        }
    }
    else {
        alert("No task entered!")
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
        for (let taskList in tasks) {
            for (let task of tasks[`${taskList}`]) {
                if (task.includes(event.target.value)) {
                    searchedTasks[`${taskList}`].push(task);
                }
            }
        }
        //localStorage.setItem("searchedTasks", JSON.stringify(searchTasks));
        document.getElementById("todo").textContent = "";
        document.getElementById("in-progress").textContent = "";
        document.getElementById("done").textContent = "";
        appendTask(searchedTasks, ["todo", "in-progress", "done"]);
    } else {
        generateTasks();
    }
}

//generates all the tasks by appending their li element to the corresponding ul element.
function generateTasks() {
    if (!localStorage.getItem("tasks")) {
        const tasksObj = {
            "todo": [],
            "in-progress": [],
            "done": []
        }
        localStorage.setItem("tasks", JSON.stringify(tasksObj))
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
                el.draggable = "true";
                const parent = document.getElementById(listsIdArr[j]);

                parent.append(el);
                countForIds++;
            }
        }
    }
}

//Hover event, checks if alt + 1/2/3 are pressed, then moves the hovered task.
function newTaskMove(event) {
    if (event.altKey && [49, 50, 51].includes(event.keyCode)) {
        const allHoverItems = Array.from(document.querySelectorAll(":hover"));
        const tasks = Array.from(document.getElementsByClassName("task"));
        tasks.forEach((tasks) => {
            if (allHoverItems[allHoverItems.length - 1] === tasks) {
                if (event.keyCode === 49) {
                    moveTask(tasks.textContent, "todo", tasks.parentElement.id)
                }
                if (event.keyCode === 50) {
                    moveTask(tasks.textContent, "in-progress", tasks.parentElement.id)
                }
                if (event.keyCode === 51) {
                    moveTask(tasks.textContent, "done", tasks.parentElement.id)
                }
            }
        });
    }
}

//Moves task 'task' from 'moveFrom' list to 'moveTo' list.
function moveTask(task, moveTo, moveFrom) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[`${moveFrom}`].splice(tasks[`${moveFrom}`].findIndex(a => a === task), 1);
    tasks[`${moveTo}`].unshift(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    generateTasks();
}

//Edits the task after double click
function editTask(event) {
    if (event.target.classList.contains("task")) {
        const task = event.target;
        const oldText = task.textContent;
        const taskType = task.parentElement.id;
        task.setAttribute("contenteditable", true)
        task.addEventListener("blur", (e) => {
            const newText = e.target.textContent;
            updateTask(oldText, newText, taskType);
        })
    }
}

//Updates the task's text
function updateTask(oldTask, newTask, taskListId) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const taskIndex = tasks[`${taskListId}`].findIndex(a => a === oldTask);
    if (newTask !== "") {
        tasks[`${taskListId}`].splice(taskIndex, 1, newTask);
        //tasks[`${taskListId}`][taskIndex] = newTask;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        generateTasks();
    } else {
        tasks[`${taskListId}`].splice(taskIndex, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        generateTasks();
    }

}

//Saves data to the api
async function saveToApi() {
    try {
        showLoading();
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        const response = await fetch("https://json-bins.herokuapp.com/bin/614b27d04021ac0e6c080cfa", {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tasks: { "todo": tasks["todo"], "in-progress": tasks["in-progress"], "done": tasks["done"] } }),
        });
        const result = await response.json();
        stopLoading();
        if (!response.ok) {
            throw "error"
        }
        return result;
    } catch (err) {
        alert("Error! Please try again! " + err.message)
    }
}

//Loading data from the api
async function loadFromApi() {
    try {
        showLoading();
        const response = await fetch("https://json-bins.herokuapp.com/bin/614b27d04021ac0e6c080cfa", {
            method: "GET",
        })
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem("tasks", JSON.stringify(result["tasks"])); //Sets the recieved data to the localStorage
            generateTasks();
        }
        stopLoading();
        if (!response.ok) {
            throw "error"
        }
    } catch (err) {
        alert("Error! Please try again! " + err.message)
    }
}

//Adds the loading div
function showLoading() {
    const loader = document.createElement("div");
    loader.classList.add("loader");
    loader.id = "loader";
    document.body.append(loader);
}

//Deletes the Showing the loading div
function stopLoading() {
    document.getElementById("loader").remove();
}

//The drag and drop functionallity
function dragTask(e) {
    //Make sure the clicked element is a task
    if (e.target.classList.contains("task")) {
        const originalList = e.target.parentElement.id;
        let dragging;

        //Starts dragging
        document.addEventListener('dragstart', function (event) {
            dragging = event.target;
            event.dataTransfer.setData('text/plain', null);
            event.dataTransfer.setDragImage(dragging, 0, 0);
        });

        //Markes the dropapple areas of the page if dragged upon
        document.addEventListener('dragover', function (event) {
            event.preventDefault();
            let draggingOver = event.target;
            if (isDropabble(draggingOver)) {
                let bounding = draggingOver.getBoundingClientRect()
                let offset = bounding.y + (bounding.height / 2);
                if (event.clientY - offset > 0) {
                    draggingOver.style['border-bottom'] = 'solid 4px blue';
                    draggingOver.style['border-top'] = '';
                } else {
                    draggingOver.style['border-top'] = 'solid 4px blue';
                    draggingOver.style['border-bottom'] = '';
                }
            }
        });

        //Removes the marking from draggable elements which were dragged on.
        document.addEventListener('dragleave', function (event) {
            let target = event.target;
            target.style['border-bottom'] = '';
            target.style['border-top'] = '';
        });

        //Dropping the task. After dropping, removes all marking and updates localStorage. 
        document.addEventListener('drop', function (event) {
            event.preventDefault();
            let dropTarget = event.target
            if (isDropabble(event.target) && event.target !== dragging) { //Makes sure the drop target is droppable
                if (dropTarget.style['border-bottom'] !== '') {
                    dropTarget.style['border-bottom'] = '';
                    if (event.target.classList.contains("task")) {
                        dropTarget.parentNode.insertBefore(dragging, event.target.nextSibling);
                    } else {
                        event.target.firstElementChild.append(dragging);
                    }
                } else {
                    dropTarget.style['border-top'] = '';
                    if (event.target.classList.contains("task")) {
                        dropTarget.parentNode.insertBefore(dragging, event.target);
                    } else {
                        event.target.firstElementChild.append(dragging);
                    }
                }
                saveElements();
                event.stopImmediatePropagation()
            }
        });
    }
}

//Save tasks to the local stroge, as seen the the lists.
function saveElements() {
    const tasksObj = {
        "todo": [],
        "in-progress": [],
        "done": []
    }
    const lists = ["todo", "in-progress", "done"];
    for (let i = 0; i < lists.length; i++) {
        const list = document.getElementById(lists[i])
        for (let j = 0; j < list.children.length; j++) {
            tasksObj[`${lists[i]}`].push(list.children[j].textContent);
        }
    }
    localStorage.setItem("tasks", JSON.stringify(tasksObj));
    generateTasks();
}

//For the drag and drop function, returns true if the given element is a task list
function isDropabble(dropTarget) {
    if (dropTarget.closest(".list-container")) {
        return true;
    }
    return false;
}

//Calls generateTasks and adds event listeners
function generatePage() {
    document.addEventListener("keydown", newTaskMove);
    document.addEventListener("dblclick", editTask);
    document.getElementById("search").addEventListener("keyup", searchTasks)
    document.getElementById("load-btn").addEventListener("click", loadFromApi)
    document.getElementById("save-btn").addEventListener("click", saveToApi)
    document.addEventListener("mousedown", dragTask)
    startTime();

    generateTasks();
}

//Start setting the time using Date()
function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    m = checkTime(m);
    s = checkTime(s);
    let dateStr = day + "/" + month + "/" + year;
    let timeStr = h + ":" + m + ":" + s;
    let fullDateTime = timeStr + "\n" + dateStr
    document.getElementById('clock').innerHTML = fullDateTime;
    setTimeout(startTime, 1000);
}

//Addes 0 in front of numbers
function checkTime(i) {
    if (i < 10) { i = "0" + i }; // add zero in front of numbers < 10
    return i;
}

generatePage();