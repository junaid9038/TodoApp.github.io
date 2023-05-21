let tasks = []; //Storing all tasks
let filterTasks = []; //Filter tasks based upon choice of view
let taskLeft = 0; //Number of tasks left to be completed
const taskList = document.getElementById('list'); //Element for storing list of tasks
const addTaskInput = document.getElementById('add'); //Element of task form
const addTaskInputBox = document.getElementById('add-task'); //Element of input box
const tasksCounter = document.getElementById('tasks-counter'); //Element of showing counter
const filterTaskType = document.getElementById('filter'); //Element for taking choice of filter
const snackbar = document.getElementById("snackbar"); //Element for snackbar assing number of variable 


// Function to add/append task in document/HTML page 
function addTaskToDOM(task) {
    // Create li tag
    const li = document.createElement("li");
    // Add data to li tag
    li.innerHTML = `
          <input type="checkbox" id="${task.id}" ${task.done ? "checked" : ""} class="custom-checkbox">
          <label for="${task.id}">${task.text}</label>
          <img src="bin.png" class="delete" data-id="${task.id}" />
    `;
    // Append li tag to HTML page
    taskList.append(li);
}

// Function to make filter
function makeFilterTasks() {
    // Get all radio buttons of name as choice
    const radioButtons = document.querySelectorAll('input[name="choice"]');
    let selected;
    // Select the checked radio button
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selected = radioButton.value;
            break;
        }
    }
    // Filter according to checked choice
    if (selected === "All") {
        filterTasks = tasks;
    } else if (selected === "Uncomplete") {
        filterTasks = tasks.filter((task) => { return !task.done; })
    } else if (selected === "Completed") {
        filterTasks = tasks.filter((task) => { return task.done; })
    }
}

// Function to get data visible
function renderList() {
    // Empty the whole data
    taskList.innerHTML = ""
    // Choose which data to show
    makeFilterTasks();
    // Add each data to document
    filterTasks.forEach((task) => addTaskToDOM(task));
    // Make counter visible
    tasksCounter.innerHTML = taskLeft + " / " + tasks.length;
}

// Function to check/uncheck task
function toggleTask(taskId) {
    // Select the task element
    const selectedTask = tasks.filter(function (task) {
        return task.id === taskId;
    });

    //Make element check if uncheck or uncheck if check and change the taskLeft count accordindgly
    if (selectedTask[0]) {
        if (selectedTask[0].done)
            taskLeft++;
        else
            taskLeft--;
        selectedTask[0].done = !selectedTask[0].done;
        tasksCounter.innerHTML = taskLeft + " / " + tasks.length;
    }
    // If any error comes
    else
        showNotification("No task found", true);
}

// Function to delete task
function deleteTask(taskId) {
    // filter data by skipping the selected task 
    const newTasks = tasks.filter((task) => {
        return task.id !== taskId;
    })

    // Replace the tasks with new tasks
    tasks = newTasks;
    renderList();
    // decrease the counter
    taskLeft -= 1;
    tasksCounter.innerHTML = taskLeft + " / " + tasks.length;
    showNotification("Task deleted successfully", true);
}

// Function to add new task
function addTask(task) {
    // Add task to tasks list
    tasks.push(task);
    // Append the task in document
    addTaskToDOM(task);
    // Increase the counter
    taskLeft = taskLeft + 1;
    tasksCounter.innerHTML = taskLeft + " / " + tasks.length;
    showNotification("Task Added Successfully", false);
}

// Function to mark all task as completed
function markAllCompleted() {
    // Make all task variable done as true
    tasks.forEach((task) => {
        task.done = true;
    });
    // Make task left counter 0
    taskLeft = 0;
    tasksCounter.innerHTML = taskLeft + " / " + tasks.length;
    renderList();
    showNotification("All tasks marked completed", false);
}

// Function to clear all completed tasks
function clearComplete() {
    // Filter data if task is not completed
    const newTasks = tasks.filter((task) => { return !task.done; });
    // Update tasks with filter data
    tasks = newTasks;
    renderList();
    showNotification("All completed tasks cleared", true);
}

// Function to show snackbar
function showNotification(text, error) {
    // Replace the message
    snackbar.innerHTML = text;

    // Add the "show" class to DIV with background color
    if (error) {
        snackbar.className = "show red"
    } else {
        snackbar.className = "show green";
    }

    // After 1.5 seconds, remove the show class from DIV
    setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 1500);
}

// Function to ceate task object
function createTask(text) {
    // Check if task has text or not
    if (!text.trim()) {
        showNotification("Text Can not be Empty!", true);
        return;
    }

    //Create object of task
    const task = {
        text,
        id: Date.now().toString(),
        done: false
    } 

    // Sent object to add function
    addTask(task);
}

// Function to handle keypress
function handleInputKeypress(e) {
    e.preventDefault();
    if (e.key === 'Enter') {
        createTask(e.target.value);
        e.target.value = "";
    }
}

// Function to handle click events
function handleClickListener(e) {
    // Select the target
    const target = e.target;

    // Call function according to className
    if (target.className === "delete") {
        const taskId = target.dataset.id;
        deleteTask(taskId);
    } else if (target.className === "custom-checkbox") {
        const taskId = target.id;
        toggleTask(taskId);
    } else if (target.className === "allComplete") {
        markAllCompleted();
    } else if (target.className === "clearComplete") {
        clearComplete();
    } else if (target.className === "submit") {
        createTask(addTaskInputBox.value);
        addTaskInputBox.value = "";
    } else if(target.className === "choice"){
        renderList();
    }
}



function intializeApp() {
    // Setup keyup event listener
    addTaskInput.addEventListener('keyup', handleInputKeypress);
    // Setup click event listener
    document.addEventListener('click', handleClickListener);
}


// Setup App
intializeApp();