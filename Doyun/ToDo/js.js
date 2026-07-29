// DOM 요소 변수 지정
const input = document.getElementById('inputtodo');
const addBtn = document.getElementById('btn');
const todolist = document.getElementById('todolist');
const todocount = document.getElementById('todocount');
const donecount = document.getElementById('donecount');
const alldelbtn = document.getElementById('alldel');

// [기능 1] 무작위 인사말 띄우기 (오타 제거 및 정상 통합)
const his = [
    "오늘도 좋은하루!",
    "기분좋은 일만 가득하길!",
    "어제보다 행복한 오늘!"
];
const ranhi = Math.floor(Math.random() * his.length);
document.getElementById('hi').innerHTML = his[ranhi];


// [기능 2] 할 일 개수 세기
function updateCount() {
    const currentItems = todolist.getElementsByTagName('li').length;
    todocount.textContent = currentItems;
}

// [기능 3] 체크된 할 일 개수 세기
function updatedonecount() {
    const checkedItems = todolist.querySelectorAll('input[type=checkbox]:checked').length;
    donecount.textContent = checkedItems;
}

// [기능 4] 입력한 내용 리스트에 넣기
function addItem() {
    const value = input.value.trim(); // 공백만 입력하는 것 방지

    if (value !== "") {
        const li = document.createElement('li');

        // 텍스트를 감싸는 span 생성 (디자인 정렬용)
        const textSpan = document.createElement('span');
        textSpan.textContent = value;
        li.appendChild(textSpan);

        // 리스트 삭제 버튼 만들기
        const delBtn = document.createElement('button');
        delBtn.textContent = "X";
        delBtn.addEventListener('click', function () {
            if (confirm('정말 이 할일을 삭제하시겠습니까?')) {
                li.remove();
                updateCount();
                updatedonecount();
            }
        });

        // 체크박스 만들기
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        // 체크박스 상태 변경 이벤트 (오타 수정 완료)
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                textSpan.style.textDecoration = 'line-through';
                textSpan.style.color = '#aaaaaa'; // 정상적인 색상 코드로 수정
            } else {
                textSpan.style.textDecoration = 'none';
                textSpan.style.color = '#34495e';
            }
            updatedonecount();
        });

        // 요소들을 li에 올바른 순서로 삽입
        li.appendChild(delBtn);
        li.appendChild(checkbox);
        todolist.appendChild(li);

        // 카운트 갱신
        updateCount();
        updatedonecount();

        // 입력창 초기화 및 포커스
        input.value = "";
        input.focus();
    } else {
        alert("할 일을 입력하세요!");
    }
}

// 버튼 클릭 및 엔터 키 이벤트 리스너
addBtn.addEventListener('click', addItem);
input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addItem();
    }
});

// 할 일 전체 삭제
alldelbtn.addEventListener('click', function() {
    if (confirm("정말 모든 할 일을 삭제하시겠습니까?")){
        todolist.innerHTML = "";
        updatedonecount();
        updateCount();
    }
});