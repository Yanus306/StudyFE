import { useParams, useNavigate } from 'react-router-dom';
import { ProductDetailTop, ProductDetailBottom } from './component';

export default function DetailIndex() {
  const { id } = useParams(); // URL에서 상품 ID 가져오기
  const navigate = useNavigate();

  // 메인 화면과 공유하는 전체 더미 데이터 (실무에서는 API나 전역 상태로 관리)
  const dummyProducts = [
    { id: 1, name: '보들보들 말랑 곰돌이 인형', price: 15000, category: '봉제인형', description: '끌어안고 자기 좋은 폭신한 촉감의 대형 테디베어', image: 'https://chiikawamarket.jp/cdn/shop/files/4571609362555_1_1d8c023e-046d-4821-8506-71c9129fb924.jpg?v=1774955979&width=1100', badge: 'BEST' },
    { id: 5, name: '치이카와 봉제인형', price: 11000, category: '봉제인형', description: '언제나 훌쩍이지만 사랑스러운 치이카와 인형', image: 'https://chiikawamarket.jp/cdn/shop/files/4571609359159_1.jpg?v=1774939162&width=493', badge: null },
    { id: 6, name: '하치와레 봉제인형', price: 11000, category: '봉제인형', description: '푸른 귀와 촉촉한 눈망울이 매력적인 하치와레', image: 'https://chiikawamarket.jp/cdn/shop/files/4571609359166_1.jpg?v=1774939172&width=493', badge: null },
    { id: 7, name: '우사기 봉제인형', price: 11000, category: '봉제인형', description: '텐션 높고 자유로운 영혼의 우사기 봉제인형', image: 'https://chiikawamarket.jp/cdn/shop/files/4571609359173_1.jpg?v=1774939182&width=493', badge: 'BEST' },
    { id: 8, name: '모몽가 봉제인형', price: 5000, category: '봉제인형', description: '보들보들 거대한 꼬리가 포인트인 모몽가', image: 'https://chiikawamarket.jp/cdn/shop/files/4571609359180_1.jpg?v=1774939193&width=493', badge: 'MD추천' },
    { id: 9, name: '쿠리만쥬 봉제인형', price: 12000, category: '봉제인형', description: '구수한 매력을 뽐내는 어른스러운 쿠리만쥬', image: 'https://chiikawamarket.jp/cdn/shop/files/4571609359197_1.jpg?v=1774939205&width=493', badge: null },
    { id: 10, name: '시사 봉제인형', price: 12000, category: '봉제인형', description: '라멘집 알바를 사랑하는 귀여운 시사 인형', image: 'https://chiikawamarket.jp/cdn/shop/files/4571609359203_1.jpg?v=1774939210&width=493', badge: 'MD추천' },
    { id: 11, name: '랏코 봉제인형', price: 13000, category: '봉제인형', description: '멋있는 매력을 뽐내는 랏코', image: 'https://chiikawamarket.jp/cdn/shop/files/4571609359210_1.jpg?v=1774939217&width=1100', badge: null },
    { id: 12, name: '카니 봉제인형', price: 12000, category: '봉제인형', description: '헌책방을 운영하는 귀여운 카니', image: 'https://chiikawamarket.jp/cdn/shop/files/4571609359227_1.jpg?v=1774939224&width=493', badge: 'MD추천' }, 
    { id: 2, name: '스페이스 탐험가 우주인 피규어', price: 99999, category: '피규어·토이', description: '책상 위를 은하수로 만들어줄 미니 피규어 세트', image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600', badge: 'NEW' },
    { id: 13, name: '주술회전 이타도리 유지 피규어', price: 22000, category: '피규어·토이', description: '주력을 담아 주령에 맞서는 역동적인 모습의 이타도리 유지', image: 'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/product/big/202605/f14e084fc382cf278d3bf67b48dc2b33.jpg', badge: 'HOT' },
    { id: 14, name: '주술회전 고죠 사토루 피규어', price: 22000, category: '피규어·토이', description: '무하한을 두른 최강의 주술사 고죠 사토루 스케일 피규어', image: 'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/product/big/202609/f8cce060c435b2a30f23a8537a56bca4.jpg', badge: 'BEST' },
    { id: 15, name: '주술회전 료멘 스쿠나 피규어', price: 23000, category: '피규어·토이', description: '저주의 왕 료멘 스쿠나의 압도적인 아우라를 담은 피규어', image: 'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/product/big/202608/0c8f425185641bad4492e00b9fe9b3dd.jpg', badge: 'NEW' },
    { id: 16, name: '주술회전 후시구로 메구미 미니피규어', price: 5000, category: '피규어·토이', description: '주술회전 사멸회유 후시구로 메구미 미니 피규어', image: 'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/product/big/202609/5514bd0dedb374fd7d12dbf368d5dde1.jpg', badge: 'NEW' },
    { id: 3, name: '감성 우드 우드블록 보드게임', price: 32000, category: '보드게임', description: '주말 저녁 친구들과 함께 즐기는 밸런스 게임', image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=600', badge: null },
    { id: 17, name: '부루마블 세계 여행 보드게임', price: 25000, category: '보드게임', description: '전 세계 주요 도시를 누비며 빌딩을 세우는 추억의 명작', image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=600', badge: 'BEST' },
    { id: 18, name: '할리갈리 스피드 보드게임', price: 18000, category: '보드게임', description: '과일 카드가 5개가 되면 먼저 종을 치는 스릴 만점 게임', image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=600', badge: 'POPULAR' },
    { id: 19, name: '루미큐브 클래식', price: 29000, category: '보드게임', description: '숫자 타일을 조합하고 무너뜨리는 두뇌 전략 게임', image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=600', badge: 'HOT' },
    { id: 20, name: '다빈치 코드 추리 보드게임', price: 16000, category: '보드게임', description: '상대의 숫자 조합을 추리해 맞추는 스릴 넘치는 게임', image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=600', badge: null },
  ];

  // URL로 전달받은 ID와 일치하는 상품 찾기 (문자열이므로 숫자로 변환 비교)
  const product = dummyProducts.find((p) => p.id === Number(id));

  // 만약 잘못된 경로로 들어왔을 때의 예외 처리
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8] text-stone-700">
        <h2 className="text-2xl font-bold mb-2">상품을 찾을 수 없습니다 🥲</h2>
        <p className="text-sm text-stone-500 mb-6">존재하지 않거나 삭제된 상품입니다.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-amber-900 text-white px-6 py-2.5 rounded-2xl text-sm font-medium hover:bg-amber-800 transition"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-900 font-sans flex flex-col justify-between">
      {/* 상단 공통 헤더 */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <span 
            onClick={() => navigate('/')}
            className="text-2xl font-serif font-black tracking-tight text-amber-900 cursor-pointer"
          >
            ROOMY<span className="text-amber-600">.</span> <span className="text-xs font-sans font-normal text-stone-500">취미와 쉼의 공간</span>
          </span>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-stone-600">
            <button onClick={() => navigate('/')} className="hover:text-amber-900 transition">홈</button>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <button className="bg-amber-900 text-white px-5 py-2.5 rounded-2xl hover:bg-amber-800 transition shadow-xs">
            장바구니 (0)
          </button>
        </div>
      </header>

      {/* 상세 페이지 본문 영역 */}
      <main className="flex-grow">
        <ProductDetailTop product={product} />
        <ProductDetailBottom product={product} />
      </main>

      {/* 하단 푸터 */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-6 mt-20 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="text-white font-serif font-bold text-lg mb-2">ROOMY STORE</h3>
            <p className="text-stone-400">일상에 따뜻한 온기를 더하는 인형 & 토이 셀렉트샵</p>
          </div>
          <div className="flex gap-12">
            <div>
              <h4 className="text-white font-semibold mb-2">Customer Center</h4>
              <p>02-123-4567 (평일 10:00 - 18:00)</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Store Info</h4>
              <p>공지사항 | 이용약관 | 개인정보처리방침</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}