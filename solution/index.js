const newTaskButt = document.getElementById("submit-add-to-do");
const inProgressButt = document.getElementById("submit-add-in-progress");
const doneTasksButt = document.getElementById("submit-add-done");

function addTask(listId) {
    const text = document.getElementById(listId).nextElementSibling.textContent; //The next sibling to the list- the input
    const id = createTaskId();
    const taskObj = { type: "li", attributes: { id: id, localStorage: text, parentId: listId }, classes: [] }

    localStorage.setItem("task" + id, JSON.stringify({ taskObj }));
    generateTasks();
}

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

function createTaskId() {
    if (localStorage.length === 0) {
        return 1;
    }
    return JSON.parse(localStorage.getItem("task" + localStorage.length - 1)).id + 1;
}

function generateTasks() {
    for (let i = 1; i <= localStorage.length; i++) {
        //Bug- custom element attributes are not working- possible fix with data attr
        const el = createElementFromObject(JSON.parse(localStorage.getItem("task" + i)).taskObj);
        const parent = document.getElementById(el.parentId);
        parent.append(el);
    }
}
generateTasks();