const taskInput = document.getElementById("task-input");
const taskCategory = document.getElementById("task-category");
const addBtn = document.getElementById("add-btn");
const pendingList = document.getElementById("pending-list");
const completedList = document.getElementById("completed-list");
const clearBtn = document.getElementById("clear-btn");
const saveBtn = document.getElementById("save-btn");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const searchBtn = document.getElementById("search-btn"); 
const taskCounter = document.getElementById("task-counter");
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  updateCounter();
});

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") addTask();
});
clearBtn.addEventListener("click", clearAllTasks);
saveBtn.addEventListener("click", saveToFile);
searchBtn.addEventListener("click", filterTasks); 
categoryFilter.addEventListener("change", filterTasks);

function addTask() {
  const taskText = taskInput.value.trim();
  const category = taskCategory.value;

  if (taskText === "") return;

  createTaskElement(taskText, category, false);
  saveTask(taskText, category, false);

  taskInput.value = "";
  updateCounter();
}

function createTaskElement(taskText, category, completed = false) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  
  const span = document.createElement("span");
  span.textContent = taskText;
  const tag = document.createElement("span");
  tag.classList.add("category-tag");
  tag.textContent = category;

 
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    updateLocalStorage();
    updateCounter();
  });

  
  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    if (li.classList.contains("completed")) {
      completedList.appendChild(li);
    } else {
      pendingList.appendChild(li);
    }
    updateLocalStorage();
    updateCounter();
  });

  li.appendChild(span);
  li.appendChild(tag);
  li.appendChild(deleteBtn);

  if (completed) {
    completedList.appendChild(li);
  } else {
    pendingList.appendChild(li);
  }
}

function saveTask(taskText, category, completed) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, category: category, completed: completed });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => createTaskElement(task.text, task.category, task.completed));
}

function updateLocalStorage() {
  let tasks = [];
  document.querySelectorAll("#pending-list li, #completed-list li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      category: li.querySelector(".category-tag").textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearAllTasks() {
  pendingList.innerHTML = "";
  completedList.innerHTML = "";
  localStorage.removeItem("tasks");
  updateCounter();
}

function updateCounter() {
  const total = document.querySelectorAll("#pending-list li, #completed-list li").length;
  const remaining = document.querySelectorAll("#pending-list li").length;
  if (total === 0) {
    taskCounter.textContent = "🎉 All done!";
  } else {
    taskCounter.textContent = `${remaining} of ${total} tasks remaining`;
  }
}

function filterTasks() {
  const searchValue = searchInput.value.toLowerCase();
  const filterCategory = categoryFilter.value;

  document.querySelectorAll("#pending-list li, #completed-list li").forEach(li => {
    const text = li.querySelector("span").textContent.toLowerCase();
    const category = li.querySelector(".category-tag").textContent;

    const matchesSearch = text.includes(searchValue);
    const matchesCategory = filterCategory === "all" || category === filterCategory;

    li.style.display = matchesSearch && matchesCategory ? "flex" : "none";
  });
}

function saveToFile() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (tasks.length === 0) {
    alert("No tasks to save!");
    return;
  }

  let content = "Your To-Do List:\n\n";
  tasks.forEach((task, index) => {
    content += `${index + 1}. ${task.text} [${task.category}] ${task.completed ? "(✔ Completed)" : "(⏳ Pending)"}\n`;
  });

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tasks.txt";
  link.click();
}
