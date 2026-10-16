export function useTime() {
  const getCurrentTimestamp = () => new Date();

  const formatTime = (dateInput) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    const hrs = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    const secs = String(d.getSeconds()).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  // 💡 연도별 동적 월 목록 생성 (해가 바뀌면 해당 연도 1월부터 시작)
  const getDynamicMonths = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1~12

    // 프로젝트 최초 시작 연도 설정 (2026년)
    const appStartYear = 2026;
    const appStartMonth = 10; // 2026년은 10월부터 시작

    let months = [];

    // 현재 연도가 시작 연도(2026년)인 경우: 10월부터 현재 월까지
    // 해가 바뀐 경우(2027년 이후): 해당 연도 1월부터 현재 월까지
    let startY = currentYear === appStartYear ? appStartYear : currentYear;
    let startM = currentYear === appStartYear ? appStartMonth : 1;

    let y = startY;
    let m = startM;

    while (y < currentYear || (y === currentYear && m <= currentMonth)) {
      months.push({
        label: `${m}월`,
        year: y,
        month: m,
        key: `${y}-${m}`
      });

      m += 1;
      if (m > 12) {
        m = 1;
        y += 1;
      }
    }

    return months;
  };

  return {
    getCurrentTimestamp,
    formatTime,
    formatDate,
    getDynamicMonths,
  };
}