# Kanban- Task managment simplified!
Kanban is a simple and easy to use application destined on making task and mission managment easier.

## Whats in the app?
![alt text](Pictures\KanbanExample.png)

### Top section
The top section has basic information such as the headline and a clock.

### Middle section
Where all the juice can be found, the middle section contains interaction button and inputs, whom will be covered later, and the 3 deducated task sections:

1. To do task (Task who werent started yet) 
2. In progress tasks (Started tasks awaiting complition)
3. Completed tasks- self explenatory.

## Usage

### Adding tasks
Users can freely add new tasks for themself using inputs found in the bottom of each section.

### Moving tasks
Users can move created tasks between the 3 sections. Moving tasks is possible with 2 methods:
- Drag N drop: Simply click on the desired task, and drag it to whatever section you want.
- Alt + 1/2/3: Press alt + 1/2/3. 1 represent the "To do" section, 2 the "In progress" section, and 3 the "Completed" section.
The tasked under the mouse cursor will hop to the beggining of the desired section.

### Editing tasks
Typo? Missclick? Nonsense! Just double click on the misstyped task and retype it, and click anywhere on the viewport to save it. Note that if you try to save an empty task, it will be deleted.

### Search tasks
Having a hard time a certain task? The page contains a handy seach box. Note that it refreshes by each keystroke. Delete your search phrase to view all the tasks again. The search works case insensitively.

## Storage
The application uses 2 storing methods:

### LocalStorage
LocalStorage- All the tasks and interaction are instantly saved to the browsers localstorage. Refreshing won't corrupt your content!

### Bin API
The a bin API to store your tasks. Under the task sections, you will find 2 buttons, `Save` and `Load`. Pressing the save button will save the current state of the sections. After saving, press the load button to reload the saved state of the sections.

## GitHub Pages:
You are able to use the site right now using GitHub page, follow the link: [a link](https://yoav-ro.github.io/kanban-final/solution/)