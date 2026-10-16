// src/data/mockAnalysisData.js
export const ANALYSIS_MOCK_DATA = {
  // 📅 2026년 데이터 (9월만 포함, 10월은 실제 앱 데이터로 테스트)
  "2026-09": {
    year: 2026,
    month: 9,
    totalConfirmedExpense: 100000, // 💡 9월 확정지출 10만 원 설정
    categories: {
      "필수": 60000,
      "자기계발/업무": 30000,
      "취미/소장": 10000,
    },
    reportSummary: "9월은 계획적인 소비가 이루어져 확정 지출이 10만 원 선으로 안정적으로 통제되었습니다.",
  },

  // 📅 2025년 하반기 데이터 (8월 ~ 12월)
  "2025-12": {
    year: 2025,
    month: 12,
    totalConfirmedExpense: 230000,
    categories: {
      "필수": 130000,
      "자기계발/업무": 60000,
      "취미/소장": 40000,
    },
    reportSummary: "연말 시즌을 맞아 취미 및 선물 지출이 다소 증가한 달입니다.",
  },
  "2025-11": {
    year: 2025,
    month: 11,
    totalConfirmedExpense: 180000,
    categories: {
      "필수": 110000,
      "자기계발/업무": 50000,
      "취미/소장": 20000,
    },
    reportSummary: "안정적인 지출 비중을 유지하며 건전한 소비 패턴을 보였습니다.",
  },
  "2025-10": {
    year: 2025,
    month: 10,
    totalConfirmedExpense: 195000,
    categories: {
      "필수": 120000,
      "자기계발/업무": 45000,
      "취미/소장": 30000,
    },
    reportSummary: "가을 시즌 의류 및 자기계발 관련 서적 구매가 집중되었습니다.",
  },
  "2025-09": {
    year: 2025,
    month: 9,
    totalConfirmedExpense: 160000,
    categories: {
      "필수": 100000,
      "자기계발/업무": 40000,
      "취미/소장": 20000,
    },
    reportSummary: "새학기 및 하반기 시작과 함께 필수 지출 위주로 예산이 집행되었습니다.",
  },
  "2025-08": {
    year: 2025,
    month: 8,
    totalConfirmedExpense: 210000,
    categories: {
      "필수": 110000,
      "자기계발/업무": 50000,
      "취미/소장": 50000,
    },
    reportSummary: "여름 휴가철 및 시즌성 소비로 인해 취미/소장 비중이 일시적으로 올랐습니다.",
  },
};