import { useState, useMemo } from 'react';
import { MainBanner, CategoryNav, ProductGrid, ProductDetailTop, ProductDetailBottom, CartView } from './component';

export default function HomeIndex() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'detail' | 'cart'
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('desc');
  const [cartItems, setCartItems] = useState([]);
  
  // 장바구니 토스트 모달 메시지 상태
  const [toastMessage, setToastMessage] = useState(null);

  // 20개의 상품 더미 데이터
  const dummyProducts = [
    { 
      id: 1, name: '보들보들 말랑 곰돌이 인형', price: 15000, category: '봉제인형', 
      description: '끌어안고 자기 좋은 폭신한 촉감의 대형 테디베어', 
      image: 'https://chiikawamarket.jp/cdn/shop/files/4571609362555_1_1d8c023e-046d-4821-8506-71c9129fb924.jpg?v=1774955979&width=1100', 
      badge: 'BEST',
      detailImages: [
        'https://images.unsplash.com/photo-1559454403-b8fb8852101e?auto=format&fit=crop&q=80&w=800',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 5, name: '치이카와 봉제인형', price: 11000, category: '봉제인형', 
      description: '언제나 훌쩍이지만 사랑스러운 치이카와 인형', 
      image: 'https://chiikawamarket.jp/cdn/shop/files/4571609359159_1.jpg?v=1774939162&width=493', 
      badge: null,
      detailImages: [
        'https://chiikawamarket.jp/cdn/shop/files/image_1_fccf2104-fac9-431f-9e12-c62826fa6541.jpg?v=1774938840&width=1946',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 6, name: '하치와레 봉제인형', price: 11000, category: '봉제인형', 
      description: '푸른 귀와 촉촉한 눈망울이 매력적인 하치와레', 
      image: 'https://chiikawamarket.jp/cdn/shop/files/4571609359166_1.jpg?v=1774939172&width=493', 
      badge: null,
      detailImages: [
        'https://chiikawamarket.jp/cdn/shop/files/image_1_fccf2104-fac9-431f-9e12-c62826fa6541.jpg?v=1774938840&width=1946',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 7, name: '우사기 봉제인형', price: 11000, category: '봉제인형', 
      description: '텐션 높고 자유로운 영혼의 우사기 봉제인형', 
      image: 'https://chiikawamarket.jp/cdn/shop/files/4571609359173_1.jpg?v=1774939182&width=493', 
      badge: 'BEST',
      detailImages: [
        'https://chiikawamarket.jp/cdn/shop/files/image_1_fccf2104-fac9-431f-9e12-c62826fa6541.jpg?v=1774938840&width=1946',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 8, name: '모몽가 봉제인형', price: 5000, category: '봉제인형', 
      description: '보들보들 거대한 꼬리가 포인트인 모몽가', 
      image: 'https://chiikawamarket.jp/cdn/shop/files/4571609359180_1.jpg?v=1774939193&width=493', 
      badge: 'MD추천',
      detailImages: [
        'https://chiikawamarket.jp/cdn/shop/files/image_1_fccf2104-fac9-431f-9e12-c62826fa6541.jpg?v=1774938840&width=1946',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 9, name: '쿠리만쥬 봉제인형', price: 12000, category: '봉제인형', 
      description: '구수한 매력을 뽐내는 어른스러운 쿠리만쥬', 
      image: 'https://chiikawamarket.jp/cdn/shop/files/4571609359197_1.jpg?v=1774939205&width=493', 
      badge: null,
      detailImages: [
        'https://chiikawamarket.jp/cdn/shop/files/image_1_fccf2104-fac9-431f-9e12-c62826fa6541.jpg?v=1774938840&width=1946',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 10, name: '시사 봉제인형', price: 12000, category: '봉제인형', 
      description: '라멘집 알바를 사랑하는 귀여운 시사 인형', 
      image: 'https://chiikawamarket.jp/cdn/shop/files/4571609359203_1.jpg?v=1774939210&width=493', 
      badge: 'MD추천',
      detailImages: [
        'https://chiikawamarket.jp/cdn/shop/files/image_1_fccf2104-fac9-431f-9e12-c62826fa6541.jpg?v=1774938840&width=1946',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 11, name: '랏코 봉제인형', price: 13000, category: '봉제인형', 
      description: '멋있는 매력을 뽐내는 랏코', 
      image: 'https://chiikawamarket.jp/cdn/shop/files/4571609359210_1.jpg?v=1774939217&width=1100', 
      badge: null,
      detailImages: [
        'https://chiikawamarket.jp/cdn/shop/files/image_1_fccf2104-fac9-431f-9e12-c62826fa6541.jpg?v=1774938840&width=1946',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 12, name: '카니 봉제인형', price: 12000, category: '봉제인형', 
      description: '헌책방을 운영하는 귀여운 카니', 
      image: 'https://chiikawamarket.jp/cdn/shop/files/4571609359227_1.jpg?v=1774939224&width=493', 
      badge: 'MD추천',
      detailImages: [
        'https://chiikawamarket.jp/cdn/shop/files/image_1_fccf2104-fac9-431f-9e12-c62826fa6541.jpg?v=1774938840&width=1946',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    }, 
    { 
      id: 2, name: '스페이스 탐험가 우주인 피규어', price: 99999, category: '피규어·토이', 
      description: '책상 위를 은하수로 만들어줄 미니 피규어 세트', 
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600', 
      badge: 'NEW',
      detailImages: [
        'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=800',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 13, name: '주술회전 이타도리 유지 피규어', price: 22000, category: '피규어·토이', 
      description: '주력을 담아 주령에 맞서는 역동적인 모습의 이타도리 유지', 
      image: 'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/product/big/202605/f14e084fc382cf278d3bf67b48dc2b33.jpg', 
      badge: 'HOT',
      detailImages: [
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/upload/NNEditor/20260527/74594.jpg',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 14, name: '주술회전 고죠 사토루 피규어', price: 22000, category: '피규어·토이', 
      description: '무하한을 두른 최강의 주술사 고죠 사토루 스케일 피규어', 
      image: 'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/product/big/202609/f8cce060c435b2a30f23a8537a56bca4.jpg', 
      badge: 'BEST',
      detailImages: [
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/upload/NNEditor/20260923/copy-1790133779-2856240_b.jpg',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 15, name: '주술회전 료멘 스쿠나 피규어', price: 23000, category: '피규어·토이', 
      description: '저주의 왕 료멘 스쿠나의 압도적인 아우라를 담은 피규어', 
      image: 'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/product/big/202608/0c8f425185641bad4492e00b9fe9b3dd.jpg', 
      badge: 'NEW',
      detailImages: [
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/upload/NNEditor/20260804/74920.jpg',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 16, name: '주술회전 후시구로 메구미 미니피규어', price: 5000, category: '피규어·토이', 
      description: '주술회전 사멸회유 후시구로 메구미 미니 피규어', 
      image: 'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/product/big/202609/5514bd0dedb374fd7d12dbf368d5dde1.jpg', 
      badge: 'NEW',
      detailImages: [
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/upload/NNEditor/20260914/4582733468884.jpg',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 3, name: '감성 우드 우드블록 보드게임', price: 32000, category: '보드게임', 
      description: '주말 저녁 친구들과 함께 즐기는 밸런스 게임', 
      image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=600', 
      badge: null,
      detailImages: [
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 17, name: '부루마블 세계 여행 보드게임', price: 25000, category: '보드게임', 
      description: '전 세계 주요 도시를 누비며 빌딩을 세우는 추억의 명작', 
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBcmUdlwxPBBv90A7ZOqmjcXPEbzjJ9RcaLo7Plb8znw&s=10', 
      badge: 'BEST',
      detailImages: [
        'https://sitem.ssgcdn.com/02/39/66/item/1000321663902_i1_750.jpg',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 18, name: '할리갈리 스피드 보드게임', price: 18000, category: '보드게임', 
      description: '과일 카드가 5개가 되면 먼저 종을 치는 스릴 만점 게임', 
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTJ3Za-7Yz1hx2wPVL8BusIc1rMIQOL0AsQzkLZS34mQ&s=10', 
      badge: 'POPULAR',
      detailImages: [
        'https://i.namu.wiki/i/UkdY1koIZEiPlPgRB53Vp3a1jDGDjcHp9dnkQ1OQUr597g_J751oNx8O7tAao_Tr4gUNHWlxyZHHYvjfcrxq0A.webp',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 19, name: '루미큐브 클래식', price: 29000, category: '보드게임', 
      description: '숫자 타일을 조합하고 무너뜨리는 두뇌 전략 게임', 
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs55XnorwLcINFxpgk-oduQXrdnDAx5o_g_ugVh05IUw&s=10', 
      badge: 'HOT',
      detailImages: [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdDNk7EfapbBrrxpI-vZsdrKajoBec65U5yRZaPqUb8A&s=10',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
    { 
      id: 20, name: '다빈치 코드 추리 보드게임', price: 16000, category: '보드게임', 
      description: '상대의 숫자 조합을 추리해 맞추는 스릴 넘치는 게임', 
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSooSOjY5s-n1hItaEMSIxHdKeeS8MOgMCPap9mGWx53Q&s=10', 
      badge: null,
      detailImages: [
        'https://mblogthumb-phinf.pstatic.net/20160901_142/dearlh_1472657765800BeCFc_JPEG/IMG_0750.JPG?type=w800',
        'https://cafe24.poxo.com/ec01/figurepresso89/BhNwo1jckXH28PSBZRxpvrRNVBIPVsjIZXgklj2fzlwtz4XBkYsUeuG/tl2zOxkvgioVJTtBnfs8EcuagkLTXA==/_/web/presso/as_top_notice_m_03.png'
      ]
    },
  ];

  // 🌟 [핵심 수정] 앱 실행 시 딱 한 번만 배너 이미지를 무작위로 섞고 고정합니다.
  const bannerImages = useMemo(() => {
    return [...dummyProducts].sort(() => Math.random() - 0.5).map(p => p.image);
  }, []);

  // 장바구니 추가 및 토스트 모달 제어 함수
  const addToCart = (product, quantity) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });

    setToastMessage(`'${product.name}' (${quantity}개)를 장바구니에 담았어요! 🧸`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleGoHome = () => {
    setToastMessage(null);
    setCurrentView('home');
  };

  const handleGoCart = () => {
    setToastMessage(null);
    setCurrentView('cart');
  };

  // 상품 필터링 및 정렬
  const filteredProducts = (() => {
    let result = selectedCategory === 'all' 
      ? [...dummyProducts] 
      : dummyProducts.filter(p => {
          if (selectedCategory === 'doll') return p.category === '봉제인형';
          if (selectedCategory === 'figure') return p.category === '피규어·토이';
          if (selectedCategory === 'boardgame') return p.category === '보드게임';
          return true;
        });

    result.sort((a, b) => {
      if (sortOption === 'desc') return b.name.localeCompare(a.name);
      if (sortOption === 'asc') return a.name.localeCompare(b.name);
      if (sortOption === 'lowPrice') return a.price - b.price;
      if (sortOption === 'highPrice') return b.price - a.price;
      return 0;
    });

    return result;
  })();

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const currentProduct = dummyProducts.find(p => p.id === selectedProductId);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-900 font-sans flex flex-col justify-between">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <span 
            onClick={handleGoHome}
            className="text-2xl font-serif font-black tracking-tight text-amber-900 cursor-pointer"
          >
            ROOMY<span className="text-amber-600">.</span> <span className="text-xs font-sans font-normal text-stone-500">취미와 쉼의 공간</span>
          </span>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-stone-600">
            <button onClick={handleGoHome} className="hover:text-amber-900 transition cursor-pointer">홈</button>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <button 
            onClick={handleGoCart}
            className="bg-amber-900 text-white px-5 py-2.5 rounded-2xl hover:bg-amber-800 transition shadow-xs flex items-center gap-2 cursor-pointer"
          >
            장바구니 <span className="bg-amber-800 px-2 py-0.5 rounded-full text-xs font-bold">{totalCartCount}</span>
          </button>
        </div>
      </header>

      {/* 본문 화면 전환 */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            {/* 고정된 랜덤 배너 이미지 목록을 props로 전달 */}
            <MainBanner bannerImages={bannerImages} />
            
            <CategoryNav 
              selectedCategory={selectedCategory} 
              onSelectCategory={setSelectedCategory} 
              sortOption={sortOption}
              onSortChange={setSortOption}
            />
            <ProductGrid 
              products={filteredProducts} 
              onSelectProduct={(id) => {
                setSelectedProductId(id);
                setCurrentView('detail');
                window.scrollTo(0, 0);
              }} 
            />
          </>
        )}

        {currentView === 'detail' && currentProduct && (
          <>
            <ProductDetailTop 
              product={currentProduct} 
              onAddToCart={addToCart} 
              toastMessage={toastMessage}
              onGoCart={handleGoCart}
            />
            <ProductDetailBottom product={currentProduct} />
          </>
        )}

        {currentView === 'cart' && (
          <div className="max-w-4xl mx-auto w-full px-6 py-12">
            <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">장바구니</h1>
            <p className="text-sm text-stone-500 mb-6">담아두신 상품들은 안전하게 보관됩니다.</p>
            <CartView 
              cartItems={cartItems} 
              onUpdateQty={updateQuantity} 
              onRemove={removeFromCart} 
              onGoHome={handleGoHome} 
            />
          </div>
        )}
      </main>

      {/* 푸터 */}
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