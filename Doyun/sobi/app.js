// 외부 HTML 파일을 읽어와 특정 요소에 삽입하는 함수
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`${filePath} 로드 실패`);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(error);
    }
}

// 앱이 실행되면 상단, 하단 컴포넌트 삽입
document.addEventListener("DOMContentLoaded", () => {
    loadComponent("header-container", "components/header.html");
    loadComponent("nav-container", "components/navigation.html");
});