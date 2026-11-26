// ===== Part B =====

//average: 배열 ⇒ 평균 평점

//reduceAverage: 배열 ⇒ 평균 평점
const reduceAverage = (list) => {
  return list.reduce((acc, m) => acc + m.rating, 0) / list.length;
};

//sortBy: 배열, 키 이름, 참이면 내림차순 ⇒ 새 배열
function sortBy(list, key, desc) {
  const newList = [...list].sort((a, b) => {
    if (typeof a[key] === "string") return a[key].localeCompare(b[key]);
    return a[key] - b[key];
  });
  if (desc) return newList.reverse();
  return newList;
}

//search: 배열, 문자열 ⇒ 새 배열
const search = (list, keyword) => {
  const serchedList = [];
  keyword = keyword.trim().toLowerCase();
  for (const m of list) {
    if (m.title.toLowerCase().includes(keyword)) serchedList.push(m);
  }
  return serchedList;
};

//formatNumber: 숫자나 숫자 문자열 ⇒ "1,234,567" N
const formatNumber = (n) => Number(n).toLocaleString("ko-KR");

//yearsSince: "2014-11-06" ⇒ 올해까지 몇 년(숫자)

//formatDate: "2014-11-06" ⇒ 2014년 11월 6일 (목)
const formatDate = (d) => {
  const date = new Date(d);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
};

// document.getElementById("out").textContent =
//   `전체 10편, 평균 평점 ${average(movies).toFixed(1)}점 \
//  최고 평점 ${best(movies).title} (${best(movies).rating}점, 개봉한 지 ${yearsSince(best(movies).date)}년)  \
//  관객 1위 ${sortBy(movies, "audiences", true)[0].title} (누적 ${formatNumber(sortBy(movies, "audiences", true)[0].audiences)}명)`;

// ===== Part C =====
const getList = (data) => data.results;

const averageBy = (list, key) =>
  list.reduce((acc, cur) => acc + cur[key], 0) / list.length;

// loadJson : tmdb.json 파일 ⇒ 콘솔에 평점 상위 5편 표(13주차 fetch 미리 보기)
async function loadJson() {
  const res = await fetch("tmdb.json");
  const data = await res.json();
  console.table(sortBy(getList(data), "vote_average", true).slice(0, 5), [
    "title",
    "vote_average",
  ]);
}

function posterUrl(path, size) {
  return "https://image.tmdb.org/t/p/" + size + path;
}

const average = (list) => {
  let sum = 0;
  for (const m of list) {
    sum += m.rating;
  }
  return sum / list.length;
};

const best = (list) => {
  let top = list[0];
  for (const m of list) {
    if (m.rating > top.rating) top = m;
  }
  return top;
};

const best2 = (list) => {
  const max = Math.max(...list.map((m) => m.rating));
  return list.find((m) => m.rating === max);
};

const filterByRating = (list, min) => list.filter((m) => m.rating >= min);

// applySort : 선택 상자 값으로 정렬해서 다시 그리기(반환값 없음)
function applySort() {
  renderCards(getView());
}

console.log(
  "최근영화: " +
    sortBy(movies, "year", true)[0].title +
    " 기존 첫번쨰:" +
    movies[0].title,
);

const yearsSince = (dateStr) =>
  new Date().getFullYear() - new Date(dateStr).getFullYear();

// renderCards : 영화 배열 ⇒ 보드에 카드 생성(반환값 없음)
function renderCards(list) {
  const board = document.querySelector(".board");
  board.innerHTML = "";
  for (const m of list) {
    let innerImg = "";
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.id = m.id;
    card.setAttribute("data-type", m.type);
    card.setAttribute("data-title", m.title);
    if (m.rating >= 8) {
      card.classList.add("hot");
    }
    if (m.poster == null) {
      card.classList.add("no-poster");
      innerImg = `<div class="poster-fallback">${m.title[0]}</div>`;
    } else {
      innerImg = `<img class="poster" src="${posterUrl(m.poster, "w342")}" alt="${m.title} 포스터">`;
    }

    if (m.type === "boxoffice") {
      card.innerHTML =
        innerImg +
        `      
      <span class="rank">${m.rank}</span> 
      <span class="badge">${m.rating}</span>      
      <div class="info">        
        <h3>${m.title}</h3>        
        <p class="year">${m.year}</p>   
        <button class="like" type="button">♥</button>   
      </div>`;
    } else {
      card.innerHTML =
        innerImg +
        `      
      <span class="badge">${m.rating}</span>      
      <div class="info">        
        <h3>${m.title}</h3>        
        <p class="year">${m.year}</p>   
        <button class="like" type="button">♥</button>   
      </div>`;
    }
    // card.onclick = function () {
    //   alert(m.overview);
    // };
    board.appendChild(card);
  }
  document.getElementById("count").textContent = list.length + "편";
  updateLikeCount();
  if (list.length === 0) {
    board.classList.add("is-empty");
  } else {
    board.classList.remove("is-empty");
  }
}

const boxTop = {
  title: "극장판 치이카와: 인어 섬의 비밀",
  audience: 1875606,
};

// 검색창 : 글자를 칠 때마다 제목으로 걸러서 다시 그리기
document.getElementById("q").addEventListener("input", (e) => {
  renderCards(getView());
});

// getView : 없음 ⇒ 검색어로 거른 뒤 선택 상자 기준으로 정렬한 새 배열
function getView() {
  const keyword = document.getElementById("q").value.trim().toLowerCase();

  const key = document.getElementById("sort").value;
  const radioValue = document.querySelector('input[name="type"]:checked').value;
  const found = movies
    .filter((m) => m.title.toLowerCase().includes(keyword))
    .filter((m) => {
      if (radioValue === "all") return true;
      else return m.type === radioValue;
    });
  // return sortBy(found, key, key !== "title");

  if (key.slice(0, 3) === "rev") {
    console.log("rev", key.slice(0, 3));
    return sortBy(found, key.slice(4), key === "rev-title");
  }
  return sortBy(found, key, key !== "title");
}

//화살표 함수의 경우
// this: Window {window: Window, self: Window, document: document, name: '', location: Location, …}
// e.target: <img class="poster" src="https://image.tmdb.org/t/p/w342/gDN2NWtHbs8ZWEBQM8Dh5OVXdb4.jpg" alt="인터스텔라 포스터"></img>
// 일반 함수의 경우
// this: <section class="board" id="board">…</section>grid
// e.target: <img class="poster" src="https://image.tmdb.org/t/p/w342/u2oRQqUashBBIj5UNeOd5TN0bmB.jpg" alt="1917 포스터">
document.querySelector(".board").addEventListener("click", function (e) {
  if (e.target.classList.contains("like")) {
    e.target.classList.toggle("liked");
    updateLikeCount();
  }
});

// 찜한 제목 배열을 브라우저에 저장하고 불러오기(교재에 없는 문법: localStorage, JSON)
const liked = JSON.parse(localStorage.getItem("liked") || "[]");
function saveLiked() {
  localStorage.setItem("liked", JSON.stringify(liked));
}

function updateLikeCount() {
  document.getElementById("likeCount").textContent =
    document.querySelectorAll(".liked").length;
}

function refresh() {
  renderCards(getView());
}
refresh();

document.getElementById("q").addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    e.target.value = "";
    refresh();
  }
});

document.getElementById("sort").addEventListener("change", refresh);
document.getElementById("typeFilter").addEventListener("change", refresh);

document.querySelector("#themeToggle").addEventListener("click", function (e) {
  document.body.classList.toggle("dark");
});
