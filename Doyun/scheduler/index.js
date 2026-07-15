console.log('Happy developing ✨');

function addSchedule() {
    const dateInput = document.getElementById('schedule-date').value; // 형식: "YYYY-MM-DD"
    const contentInput = document.getElementById('schedule-content').value;
// 날짜와 내용을 입력하지 않을때
    if (!dateInput || !contentInput.trim()) {
        alert("날짜와 내용을 모두 입력해주세요!");
        return;
    }

    const targetDayBox = document.querySelector(`[data-date="${dateInput}"]`);

    if (targetDayBox) {

        const scheduleDiv = document.createElement('div');
        scheduleDiv.className = 'schedule-item';
        scheduleDiv.innerText = contentInput;

        const listContainer = targetDayBox.querySelector('.schedule-list') || targetDayBox;
        listContainer.appendChild(scheduleDiv);

        // 5. 입력창 초기화
        document.getElementById('schedule-content').value = '';
    } else {
        alert("해당 날짜를 달력에서 찾을 수 없습니다. (이번 달 범위를 벗어났는지 확인해보세요)");
    }
}
