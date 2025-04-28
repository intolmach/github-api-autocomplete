const inputBox = document.querySelector("input");
const searchList = document.querySelector(".list_result");
const cardList = document.querySelector(".card_result")


let debounce = function (fn, ms) {
    let timer;
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, ms)
    }
}

inputBox.addEventListener("input", debounce((function (e) {
    setItems(e.target.value)
}), 400));

function createList(elem) {
    let newItem = document.createElement("li")
    newItem.classList.add("item_search")
    newItem.textContent = elem.name;
    searchList.appendChild(newItem)
    newItem.addEventListener("click", () => {
        createCard(elem);
        searchList.innerHTML = '';
        inputBox.value = ""
    });
}

function createCard(elem) {
    let cardResult = document.createElement("li");
    cardResult.classList.add("item_result");
    let name = document.createElement("p");
    name.textContent = `Name: ${elem.name}`;
    let owner = document.createElement("p");
    owner.textContent = `Owner: ${elem.owner.login}`;
    let stars = document.createElement("p");
    stars.textContent = `Stars: ${elem.stargazers_count}`;
    let close = document.createElement("button")
    close.classList.add("item_result-close");
    close.addEventListener("click", function() {
        let parent = close.closest("li")
        parent.remove()
    })
    cardResult.append(name, owner, stars, close)
    cardList.appendChild(cardResult)
}
function setItems(value) {
    searchList.innerHTML = '';
    if (!value) return;
    fetch(`https://api.github.com/search/repositories?sort=stars&per_page=5&q=${value}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            let arr = data.items
            arr.forEach((item) => {
                createList(item);
            })
        })
        .catch(error => console.error('Ошибка:', error));
}


