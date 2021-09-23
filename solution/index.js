
//Recieves the list id which the task should be created in, and creates the task.
function addTask(listId) {
    let text;
    //Finds the task's text by finding the input element of the section and taking its value.
    for (let child of document.getElementById(listId).parentElement.children) {
        if (child.tagName === "INPUT") {
            text = child.value;
            child.value="";
        }
    }
    const id = createTaskId();
    const taskObj = { type: "li", attributes: { id: id, "data-text": text, "data-parentId": listId }, classes: [] }

    localStorage.setItem("task" + id, JSON.stringify({ taskObj }));
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

//Creates a new unique id for the task
function createTaskId() {
    if (localStorage.length === 0) {
        return 1;
    }
    return localStorage.length + 1;
}

//generates all the tasks by appending their li element to the corresponding ul element.
function generateTasks() {
    //First, resets all the ul elements to prevent duplication
    document.getElementById("toDoTasks").textContent="";
    document.getElementById("inProgressTasks").textContent="";
    document.getElementById("doneTasks").textContent="";
    //Goes through localStorage, creates the li elements, and appends it to the right ul.
    for (let i = 1; i <= localStorage.length; i++) {
        const el = createElementFromObject(JSON.parse(localStorage.getItem("task" + i)).taskObj);
        el.textContent = el.getAttribute("data-text");
        console.log(el)
        const parent = document.getElementById(el.getAttribute("data-parentId"));

        parent.append(el);
    }
}

generateTasks();