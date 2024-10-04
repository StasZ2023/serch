const input = document.querySelector("input");
const link = document.querySelector(".link");
const info = document.querySelector(".info");

info.addEventListener("click", function(event) {
    let target = event.target;
    if (!target.classList.contains("btn")) return;

    target.parentElement.remove();
});

link.addEventListener("click", function(event) {
    let target = event.target;
    if (!target.classList.contains("link")) {
	return;
    }
    addChosen(target);
    input.value = "";
    removePredictions();
});

function removePredictions() {
    link.innerHTML = "";
}

function showPredictions(repositories) {
    
    removePredictions();

    for (let repositoryIndex = 0; repositoryIndex < 5; repositoryIndex++) {
	let name = repositories.items[repositoryIndex].name;
	let owner = repositories.items[repositoryIndex].owner.login;
	let stars = repositories.items[repositoryIndex].stargazers_count;

	let dropdownContent = `<div class="link" data-owner="${owner}" data-stars="${stars}">${name}</div>`;
	link.innerHTML += dropdownContent;
    }
}

function addChosen(target) {
    let name = target.textContent;
    let owner = target.dataset.owner;
    let stars = target.dataset.stars;
    
    info.innerHTML += `<div class="block">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="btn"><div class="line"></div>
    <div class="line"></div></button></div>`;
}

async function getPredictions() {
    const urlSearchRepositories = new URL("https://api.github.com/search/repositories");
    let repos = input.value;
    if (repos == "") {
	removePredictions();
	return;
    }

    urlSearchRepositories.searchParams.append("q", repos)
    try {
	let response = await fetch(urlSearchRepositories);
	if (response.ok) {
	    let repositories = await response.json();
	    showPredictions(repositories);
	}
	else return null;
    } catch(error) {
	return null;
    }
}

function debounce(fn, timeout) {
    let timer = null;

    return (...args) => {
	clearTimeout(timer);
	return new Promise((resolve) => {
	    timer = setTimeout(
		() => resolve(fn(...args)),
		timeout,
	    );
	});
    };
}

const getPredictionsDebounce = debounce(getPredictions, 200);
input.addEventListener("input", getPredictionsDebounce);