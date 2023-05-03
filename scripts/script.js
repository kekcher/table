//Объявление переменных
let firstName = "";//Имя студента
let secondName = "";//Фамилия студента
let middleName = "";//Отчество студента
let birthDay = document.getElementById("birthDay").valueAsDate;//Дата рождения студента
let startYear = document.getElementById("startYear").value;//Год начала обучения
let faculty = document.getElementById("faculty").value;;//Факультет

//Достаём данные из локального хранилища
let students = localStorage.length != 0 ? JSON.parse(localStorage.getItem("students")) : new Array();//Массив, где хранятся все студенты

//Заполняем таблицу студентами из локального хранилища
students.forEach((item) =>{
    item["birthDay"] = new Date(item["birthDay"]);
    addStudentTable(item);
})


function Empty(){//Функция которая проверяет, остались ли пустыми поля
    let input = document.querySelectorAll(".input");
    let logic = false;
    let labels = document.querySelectorAll("label");
    for(let item of input){
        if(item.value == ""){
            logic = true;
            item.classList.toggle("wrong");
            item.value = "";
            LabelSearch(labels, item.id).style.color = "red";
        }
    }
    return logic;  
}

//Функция поиска нужного label
function LabelSearch(labels,id){
    for(let item of labels){
        if(item.htmlFor == id){
            return item;
        }
    }
}

//Функция сортировки таблицы
function sortTable(index, type){
    let tbody = document.getElementById("table").querySelector("tbody");
    let rowsArray = Array.from(tbody.rows);
    let compare;
    switch(type){
        case "number":
          compare = (rowA, rowB) => rowA.cells[index].innerHTML - rowB.cells[index].innerHTML;
          break; 
        case "string":
          compare = (rowA, rowB) => rowA.cells[index].innerHTML > rowB.cells[index].innerHTML ? 1: -1;
          break;
        case "date":
            compare = (rowA, rowB) => new Date(rowA.cells[index].innerHTML.split(".")[2],rowA.cells[index].innerHTML.split(".")[1]-1,rowA.cells[index].innerHTML.split(".")[0]).getTime() 
            > new Date(rowB.cells[index].innerHTML.split(".")[2],rowB.cells[index].innerHTML.split(".")[1]-1,rowB.cells[index].innerHTML.split(".")[0]).getTime() ? 1: -1;
    }
    rowsArray.sort(compare);
    tbody.append(...rowsArray);
}

//Функция добавления нового студента в таблицу
function addStudentTable(student){
    let tbody = document.querySelector("tbody")
    let tr = document.createElement("tr");
    let td;
    for(let key of Object.keys(student)){
        td = document.createElement("td");
        if(key == "birthDay"){//Если дата
            let str = student[key].getDate() < 10 ? `0${student[key].getDate()}.` : `${student[key].getDate()}.`;
            str += student[key].getMonth() + 1 < 10 ? `0${student[key].getMonth() + 1}.` : `${student[key].getMonth() + 1}.`;
            td.textContent = str + student[key].getFullYear();
        }
        else
        {
            td.textContent = student[key];
        }
        tr.append(td);
    }
    //Добавление кнопки удаления студента из таблицы
    td = document.createElement("td");
    let btn = document.createElement("button");
    btn.className = "delete";
    btn.textContent = "X";
    td.append(btn);
    tr.append(td);


    tbody.append(tr);
}
//События навешивающиеся события focus и blur, на три поля Имя, Фамилия, Отчество
function AddEvent(){
    for(let i=1; i<4; i++){
        let input = document.forms[0][i];//Достаём нужные input из нашей формы
        let labels = document.querySelectorAll("label");
        input.onblur = (e) =>{
            let reg = new RegExp("[а-яА-Я]{3,30}");
            if(!reg.test(e.target.value)){//Если неправильно введено поле
                e.target.classList.add("wrong");
                e.target.value = "";
                LabelSearch(labels, e.target.id).style.color = "red";
            }
        };
        input.onfocus = (e) =>{
            if(e.target.classList.contains("wrong")){//Если поле горит красным
                e.target.classList.remove("wrong");
                LabelSearch(labels, e.target.id).style.color = "black";
            }
        }
    }
}


function Student(firstName, secondName, middleName, birthDay, startYear, faculty){//Конструткор для объекта студента
    this.firstName = firstName ;
    this.secondName = secondName;
    this.middleName = middleName;
    this.birthDay = birthDay;
    this.startYear = startYear;
    this.faculty = faculty;
}

//Событие input для каждого поля формы
document.querySelectorAll(".input").forEach((item) =>{
    item.addEventListener("input", (e) =>{
        switch(e.target.id){
            case "firstName" :
                firstName = e.target.value;
                break;
            case "secondName":
                secondName = e.target.value;
                break;
            case "middleName":
                middleName = e.target.value;
                break;
            case "birthDay":
                birthDay = e.target.valueAsDate;
                break;
            case "startYear":
                startYear = e.target.value;
                break;
            case "faculty":
                faculty = e.target.value;
                break;
        }
    })
})


AddEvent();//Запускаем функцию, которая навешивает события

add.onclick = () => {//По нажатию на кнопку добавить
    if(!Empty()){//Если все поля заполнены
        student = new Student(firstName,secondName,middleName,birthDay,+startYear,faculty);
        students.push(student);
        addStudentTable(student);//Добавляем студента в таблицу
        localStorage.setItem("students", JSON.stringify(students));
    }
}

//Сортировка таблицы при помощи делегирования при нажатии на заголовки
table.onclick = (e) =>{
    if(e.target.tagName != "TH"){
        if(e.target.className != "delete"){
            return;
        }
        else{
            let btn = e.target;
            deleteStudent(btn.closest("tr").rowIndex - 1, students);
            btn.closest("tr").remove();//Удаление строки в таблице
        }
    }
    else{
        let th = e.target;
        sortTable(th.cellIndex, th.dataset.type);
    }
}

//Функция удаления студента
function deleteStudent(index, students){
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
}