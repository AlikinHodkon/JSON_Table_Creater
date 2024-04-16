let n = 0;
let temp = [];
function createHeader(tr, element) {
  for (let key in element) {
    if (Object.hasOwnProperty.call(element, key)) {
      if (typeof element[key] == "object") {
        createHeader(tr, element[key]);
      } else {
        let th = document.createElement("th");
        tr.append(th);
        th.append(key);
      }
    }
  }
}
function addElement(tr, element) {
  for (let key in element) {
    if (Object.hasOwnProperty.call(element, key)) {
      if (typeof element[key] == "object") {
        addElement(tr, element[key]);
      } else {
        let td = document.createElement("td");
        tr.append(td);
        td.append(element[key]);
      }
    }
  }
}
function allNone(trCollection) {
  for (let j = 0; j < trCollection.length; j++) {
    trCollection[j].style.display = "none";
  }
}
function show(trCollection, n) {
  for (let i = 0; i < 10 && trCollection[i + n * 10] !== undefined; i++) {
    trCollection[i + n * 10].style.display = "table-row";
  }
}
function makeFilter(element, i, trCollection) {
  let arr = [];
  for (let j = 0; j < trCollection.length; j++) {
    arr.push(trCollection[j].childNodes[i].innerHTML);
  }
  let click = "0";
  let originArr = arr.slice();
  element.addEventListener("click", () => {
    document.querySelector(".pagesButtons").lastChild.value = "";
    n = 0;
    allNone(trCollection);
    show(trCollection, n);
    document.querySelector(".buttons").firstChild.textContent = `Страница номер: «${n + 1}»`;
    if (n > trCollection.length / 10 - 1) document.querySelector('.buttons').lastChild.lastChild.style.display = "none";
    else document.querySelector('.buttons').lastChild.lastChild.style.display = "inline-block";
    if (n <= 0) document.querySelector('.buttons').lastChild.firstChild.style.display = "none";
    else document.querySelector('.buttons').lastChild.firstChild.style.display = "inline-block";
    switch(click){
      case "0": click = ">"; break;
      case ">": click = "<"; break;
      case "<": click = "0"; break;
    }
    if (!isNaN(Number(trCollection[0].childNodes[i].innerHTML)))
      arr.sort((a, b) => a - b);
    else arr.sort();
    if (click == "0") {
      for (let j = 0; j < trCollection.length; j++) {
        let object = trCollection[0];
        while (object.childNodes[i].innerHTML != originArr[j]) {
          object = object.nextSibling;
        }
        trCollection[trCollection.length - 1].after(object);
      }
    } else {
      for (let j = 0; j < trCollection.length; j++) {
        let object = trCollection[0];
        while (object.childNodes[i].innerHTML != arr[j]) {
          object = object.nextSibling;
        }
        if (click == "<")
          trCollection[0].before(object); //Сортировка по убыванию
        else trCollection[trCollection.length - 1].after(object); //Сортировка по возрастанию
      }
    }
    allNone(trCollection);
    n = 0;
    show(trCollection, n);
  });
}
const small =
  "http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D";
const big =
  "http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D";
const dbSmall = document.getElementById("dataset-small");
const dbBig = document.getElementById("dataset-big");
dbSmall.addEventListener("click", () => {
  document.getElementById("dataset").value = small;
});
dbBig.addEventListener("click", () => {
  document.getElementById("dataset").value = big;
});
const dbLoad = document.getElementById("load-dataset");
dbLoad.addEventListener("click", () => {
  fetch(document.getElementById("dataset").value)
    .then((response) => response.json())
    .then((commits) => {
      n = 0;
      if (document.querySelector(".pagesButtons") != null){
        document.querySelector(".pagesButtons").lastChild.value = "";
        document.querySelector(".pagesButtons").parentNode.removeChild(document.querySelector(".pagesButtons"));
      }
      document.getElementById("table-wrapper").replaceChildren();
      let table = document.createElement("table");
      let thead = document.createElement("thead");
      let tr = document.createElement("tr");
      table.className = "dynamic-table";
      document.getElementById("table-wrapper").append(table);
      table.append(thead);
      thead.append(tr);
      createHeader(tr, commits[0]);
      let tbody = document.createElement("tbody");
      table.append(tbody);
      commits.forEach((element) => {
        let tr = document.createElement("tr");
        tr.style.display = "none";
        tbody.append(tr);
        addElement(tr, element);
      });
    })
    .then(() => {
      let dynamicTable = document.querySelector(".dynamic-table");
      let thead = dynamicTable.firstChild;
      let tr = thead.firstChild;
      let thCollection = tr.childNodes;
      let trCollection = thead.nextSibling.childNodes;
      for (let i = 0; i < thCollection.length; i++) {
        makeFilter(thCollection[i], i, trCollection);
      }
    })
    .then(() => {
      let dynamicTable = document.querySelector(".dynamic-table");
      let thead = dynamicTable.firstChild;
      let trCollection = thead.nextSibling.childNodes;
      let nextPage = document.createElement("button");
      nextPage.append("Вперед");
      let previosPage = document.createElement("button");
      previosPage.append("Назад");
      let newWrapper = document.createElement("div");
      document.querySelector(".dataset").after(newWrapper);
      let stats = document.createElement("div");
      let p = document.createElement("p");
      p.append("Количество строк в таблице: " + trCollection.length);
      stats.append(p);
      p = document.createElement("p");
      p.append(
        "Количество страниц: " + (Math.floor(trCollection.length / 10) + 1)
      );
      stats.append(p);
      newWrapper.append(stats);
      let buttons = document.createElement("div");
      p = document.createElement("p");
      p.append(`Страница номер: «${n + 1}»`);
      buttons.append(p);
      let div = document.createElement("div");
      div.append(previosPage);
      div.append(nextPage);
      buttons.append(div);
      buttons.className = "buttons";
      newWrapper.className = "pagesButtons";
      newWrapper.append(buttons);
      previosPage.style.display = "none";
      nextPage.addEventListener("click", () => {
        if (document.querySelector(".pagesButtons").lastChild.value == ""){
          if (n <= trCollection.length / 10 - 1) n++;
          p.textContent = `Страница номер: «${n + 1}»`;
          if (n > trCollection.length / 10 - 1) nextPage.style.display = "none";
          else nextPage.style.display = "inline-block";
          if (n <= 0) previosPage.style.display = "none";
          else previosPage.style.display = "inline-block";
          allNone(trCollection);
          show(trCollection, n);
        }else{
          if (n <= temp.length / 10 - 1) n++;
          p.textContent = `Страница номер: «${n + 1}»`;
          if (n > temp.length / 10 - 1) nextPage.style.display = "none";
          else nextPage.style.display = "inline-block";
          if (n <= 0) previosPage.style.display = "none";
          else previosPage.style.display = "inline-block";
          allNone(trCollection);
          for (let i = 0; i < 10; i++) {
            let object = trCollection[0];
            while (object == null || object.firstChild.innerHTML != temp[i + n * 10]){
              if (object == null) break;
              object = object.nextSibling;
            }
            if (object == null) break;
            object.style.display = "table-row";
          }
        }
      });
      previosPage.addEventListener("click", () => {
        if (document.querySelector(".pagesButtons").lastChild.value == ""){
          if (n > 0) n--;
          p.textContent = `Страница номер: «${n + 1}»`;
          if (n >= trCollection.length / 10 - 1)
            nextPage.style.display = "none";
          else nextPage.style.display = "inline-block";
          if (n <= 0) previosPage.style.display = "none";
          else previosPage.style.display = "inline-block";
          allNone(trCollection);
          show(trCollection, n);
        }else{
          if (n > 0) n--;
          p.textContent = `Страница номер: «${n + 1}»`;
          if (n >= temp.length / 10 - 1) nextPage.style.display = "none";
          else nextPage.style.display = "inline-block";
          if (n <= 0) previosPage.style.display = "none";
          else previosPage.style.display = "inline-block";
          allNone(trCollection);
          for (let i = 0; i < 10; i++) {
            let object = trCollection[0];
            while (object == null || object.firstChild.innerHTML != temp[i + n * 10]){
              if (object == null) break;
              object = object.nextSibling;
            }
            if (object == null) break;
            object.style.display = "table-row";
          }
        }
      });
      show(trCollection, n);
    })
    .then(() => {
      let pagesButtons = document.querySelector(".pagesButtons");
      let input = document.createElement("input");
      let dynamicTable = document.querySelector(".dynamic-table");
      let thead = dynamicTable.firstChild;
      let trCollection = thead.nextSibling.childNodes;
      input.type = "text";
      input.placeholder = "Введите значение для поиска";
      pagesButtons.append(input);
      input.addEventListener("input", (e) => {
        n = 0;
        allNone(trCollection);
        document.querySelector(".buttons").firstChild.textContent = `Страница номер: «${n + 1}»`;
        if (e.target.value != "") {
          temp = [];
          for (let i = 0; i < trCollection.length; i++) {
            let tr = trCollection[i].childNodes;
            for (let td of tr) {
              if (
                td.innerHTML.substring(0, e.target.value.length) ==
                e.target.value
              ) {
                temp.push(trCollection[i].firstChild.innerHTML);
                break;
              }
            }
          }
          pagesButtons.firstChild.firstChild.innerHTML =
          "Количество строк в таблице: " + temp.length;
          pagesButtons.firstChild.lastChild.innerHTML =
          "Количество страниц: " +
          (Math.floor(temp.length / 10) + 1);
          if (n >= temp.length / 10 - 1) document.querySelector('.buttons').lastChild.lastChild.style.display = "none";
          else document.querySelector('.buttons').lastChild.lastChild.style.display = "inline-block";
          if (n <= 0) document.querySelector('.buttons').lastChild.firstChild.style.display = "none";
          else document.querySelector('.buttons').lastChild.firstChild.style.display = "inline-block";
          for (let i = 0; i < 10; i++) {
            let object = trCollection[0];
            while (object == null || object.firstChild.innerHTML != temp[i + n * 10]){
              if (object == null) break;
              object = object.nextSibling;
            }
            if (object == null) break;
            object.style.display = "table-row";
          }
        } else {
          pagesButtons.firstChild.firstChild.innerHTML =
          "Количество строк в таблице: " + trCollection.length;
          pagesButtons.firstChild.lastChild.innerHTML =
          "Количество страниц: " +
          (Math.floor(trCollection.length / 10) + 1);
          if (n >= trCollection.length / 10 - 1) document.querySelector('.buttons').lastChild.lastChild.style.display = "none";
          else document.querySelector('.buttons').lastChild.lastChild.style.display = "inline-block";
          if (n <= 0) document.querySelector('.buttons').lastChild.firstChild.style.display = "none";
          else document.querySelector('.buttons').lastChild.firstChild.style.display = "inline-block";
          allNone(trCollection);
          show(trCollection, n);
        }
      });
    });
});