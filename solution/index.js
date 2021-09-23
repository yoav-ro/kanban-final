
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
                const parent = document.getElementById(listsIdArr[j]);

                parent.append(el);
                countForIds++;
            }
        }
    }
}

//Hover event, checks if alt + 1/2/3 are pressed, then moves the hovered task.
function taskHovered(event) {
    const taskType = event.target.parentElement.id; //The original list id, so we know where to move from.
    if (event.target.tagName === "LI") { //Make sure the hovered element is li.
        document.addEventListener("keydown", (e) => {
            if (e.altKey) {
                if (e.key === "1") {
                    moveTask(event.target, "todo", taskType);
                }
                if (e.key === "2") {
                    moveTask(event.target, "in-progress", taskType);
                }
                if (e.key === "3") {
                    moveTask(event.target, "done", taskType);
                }
            }
        })
    }
}

//Moves task 'task' from 'moveFrom' list to 'moveTo' list.
function moveTask(task, moveTo, moveFrom) {
    console.log(`Moving ${task} from ${moveFrom} to ${moveTo}!`)
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    console.log(tasks[`${moveFrom}`]);
    tasks[`${moveFrom}`].splice(tasks[`${moveFrom}`].findIndex(a => a === task.textContent), 1);
    tasks[`${moveTo}`].push(task.textContent);
    console.log(tasks)
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log(localStorage)
    generateTasks();
}

function generatePage() {
    document.body.addEventListener("mouseover", taskHovered)
    generateTasks();
}
generatePage();
