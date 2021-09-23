
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

function addToLocalStorage() {

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

function createTaskId(tasks) {
    return tasks.todo.length + tasks['in-progress'].length + tasks.done.length + 1;
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
    appendTask(tasks, "todo");
    appendTask(tasks, "in-progress");
    appendTask(tasks, "done");
}

function appendTask(tasks, taskList) {
    if (tasks[taskList].length > 0) {
        for (let i = 0; i < tasks[taskList].length; i++) {
            const id = createTaskId(tasks);
            const taskObj = { type: "li", attributes: { id: id }, classes: ["task"] }
            const el = createElementFromObject(taskObj);
            el.textContent = tasks[taskList][i];
            const parent = document.getElementById(taskList);

            parent.append(el);
        }
    }
}

generateTasks();