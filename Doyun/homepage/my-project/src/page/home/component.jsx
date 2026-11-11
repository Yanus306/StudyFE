import { useState } from 'react';

export function MainBanner({ products, bannerImages }) {
  // 만약 products로 넘어왔다면 즉시 랜덤 섞고, bannerImages로 넘어왔다면 그것을 사용합니다.
  const sourceImages = bannerImages || (products ? products.map(p => p.image) : []);
  const randomImages = [...sourceImages].sort(() => Math.random() - 0.5);
  
  // 무한 반복 레일을 위해 배열을 3번 이어붙입니다.
  const duplicatedImages = [...randomImages, ...randomImages, ...randomImages];

  return (
    <div className="relative bg-[#2C2420] text-white py-32 px-6 md:px-16 overflow-hidden border-b border-amber-900/30">
      
      {/* 배경 레일 이미지 슬라이드 영역 (세로 꽉 채우기 & 양옆 흐림 마스크) */}
      <div className="absolute inset-0 opacity-25 overflow-hidden pointer-events-none flex items-center banner-fade-mask">
        <div className="flex h-full shrink-0 marquee-track items-center">
          {duplicatedImages.map((imgUrl, index) => (
            <div key={index} className="h-full w-[420px] shrink-0 bg-stone-800">
              <img src={imgUrl} alt="배너 배경 상품" className="w-full h-full object-cover filter brightness-90" />
            </div>
          ))}
        </div>
      </div>

      {/* 왼쪽에서 오른쪽으로 어두워지는 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2C2420] via-[#2C2420]/85 to-transparent pointer-events-none z-10"></div>

      {/* 배너 텍스트 콘텐츠 */}
      <div className="max-w-7xl mx-auto flex flex-col items-start justify-center relative z-20">
        
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-snug drop-shadow-sm text-white">
          마음이 포근해지는 공간,<br />일상 속 작은 위로가 되는 장난감
        </h1>
        <p className="text-stone-300 text-base md:text-lg max-w-xl font-light">
          귀여운 봉제인형부터 정교한 피규어까지, 당신의 취향을 채워줄 보물들을 만나보세요.
        </p>
      </div>

      {/* 순수 CSS 애니메이션 및 양옆 흐림(Mask) 효과 스타일 */}
      <style>{`
        @keyframes customMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .marquee-track {
          animation: customMarquee 50s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .banner-fade-mask {
          mask-image: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
          -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
        }
      `}</style>
    </div>
  );
}

export function CategoryNav({ selectedCategory, onSelectCategory, sortOption, onSortChange }) {
  const categories = [
    { id: 'all', label: '전체 보기' },
    { id: 'doll', label: '🧸 봉제인형' },
    { id: 'figure', label: '🤖 피규어·토이' },
    { id: 'boardgame', label: '🎲 보드게임' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 mt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id ? 'bg-amber-900 text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl shrink-0">
          <button onClick={() => onSortChange('desc')} className={`px-3 py-1.5 text-xs font-medium rounded-xl transition cursor-pointer ${sortOption === 'desc' ? 'bg-white text-amber-900 shadow-xs font-bold' : 'text-stone-500'}`}>내림차순</button>
          <button onClick={() => onSortChange('asc')} className={`px-3 py-1.5 text-xs font-medium rounded-xl transition cursor-pointer ${sortOption === 'asc' ? 'bg-white text-amber-900 shadow-xs font-bold' : 'text-stone-500'}`}>오름차순</button>
          <span className="w-[1px] h-3 bg-stone-300 mx-0.5"></span>
          <button onClick={() => onSortChange('lowPrice')} className={`px-3 py-1.5 text-xs font-medium rounded-xl transition cursor-pointer ${sortOption === 'lowPrice' ? 'bg-white text-amber-900 shadow-xs font-bold' : 'text-stone-500'}`}>낮은가격순</button>
          <button onClick={() => onSortChange('highPrice')} className={`px-3 py-1.5 text-xs font-medium rounded-xl transition cursor-pointer ${sortOption === 'highPrice' ? 'bg-white text-amber-900 shadow-xs font-bold' : 'text-stone-500'}`}>높은가격순</button>
        </div>
      </div>
    </div>
  );
}

export function ProductCard({ product, onSelectProduct }) {
  return (
    <div 
      onClick={() => onSelectProduct(product.id)}
      className="group cursor-pointer bg-white p-4 rounded-3xl border border-stone-100 shadow-xs hover:shadow-md transition"
    >
      <div className="aspect-square bg-stone-50 rounded-2xl overflow-hidden mb-4 relative">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        {product.badge && <span className="absolute top-3 left-3 bg-amber-800 text-white text-xs font-bold px-2.5 py-1 rounded-lg">{product.badge}</span>}
      </div>
      <div>
        <p className="text-xs text-amber-800 font-medium mb-1">{product.category}</p>
        <h3 className="font-bold text-gray-900 group-hover:text-amber-900 transition line-clamp-1">{product.name}</h3>
        <p className="text-xs text-stone-500 mt-1 line-clamp-1">{product.description}</p>
        <p className="font-extrabold text-stone-900 mt-3">₩{product.price.toLocaleString()}</p>
      </div>
    </div>
  );
}

export function ProductGrid({ products, onSelectProduct }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
        ))}
      </div>
    </div>
  );
}

export function ProductDetailTop({ product, onAddToCart, toastMessage, onGoCart }) {
  const [quantity, setQuantity] = useState(1);
  const [modalImg, setModalImg] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative">
      
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 animate-[fadeInOut_2s_ease-in-out]">
          <span className="text-sm font-medium">{toastMessage}</span>
          <button 
            onClick={onGoCart}
            className="bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-amber-500 transition cursor-pointer"
          >
            장바구니 보기
          </button>
        </div>
      )}

      <div 
        onClick={() => setModalImg(product.image)}
        className="aspect-square bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 shadow-sm sticky top-24 flex items-center justify-center p-4 cursor-pointer group relative"
      >
        <img src={product.image} alt={product.name} className="w-full h-full object-contain transform transition-transform duration-500 ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <span className="text-3xl text-white drop-shadow-md">🔍</span>
        </div>
      </div>

      <div className="flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">{product.category}</span>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-3 mb-2">{product.name}</h1>
          <p className="text-stone-600 text-base leading-relaxed mb-6">{product.description}</p>
          <div className="text-2xl font-black text-amber-900 pb-6 border-b border-stone-200">₩{product.price.toLocaleString()}</div>
        </div>

        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between bg-stone-100 p-4 rounded-2xl">
            <span className="text-sm font-medium text-stone-700">구매 수량</span>
            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-stone-200">
              <button onClick={() => quantity > 1 && setQuantity(q => q - 1)} className="w-6 h-6 flex items-center justify-center font-bold text-stone-600 cursor-pointer">-</button>
              <span className="text-sm font-bold w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-6 h-6 flex items-center justify-center font-bold text-stone-600 cursor-pointer">+</button>
            </div>
          </div>
          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-stone-500">총 상품 금액</span>
            <span className="text-xl font-black text-stone-900">₩{(product.price * quantity).toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <button onClick={() => onAddToCart(product, quantity)} className="py-4 rounded-2xl border border-amber-900 text-amber-900 font-bold hover:bg-amber-50 transition cursor-pointer">장바구니 담기</button>
          <button onClick={() => alert(`'${product.name}' (${quantity}개) 구매 페이지로 이동합니다! 🛍️`)} className="py-4 rounded-2xl bg-amber-900 text-white font-bold hover:bg-amber-800 transition cursor-pointer">바로 구매하기</button>
        </div>
      </div>

      {modalImg && (
        <div 
          onClick={() => setModalImg(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
            <img src={modalImg} alt="확대 이미지" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
            <button 
              onClick={() => setModalImg(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProductDetailBottom({ product }) {
  const [modalImg, setModalImg] = useState(null);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 border-t border-stone-200 mt-12 text-center">
      <h2 className="text-xl font-serif font-bold text-stone-800 mb-4">
        ✨ 상품 상세 정보 및 큐레이션 가이드
      </h2>
      <p className="text-stone-500 text-sm mb-10 max-w-lg mx-auto">
        ROOMY STORE가 엄선한 따뜻한 감성의 굿즈입니다. 안내 사항과 상세 컷을 확인해 주세요.
      </p>

      <div className="space-y-8 flex flex-col items-center">
        
        <div className="bg-amber-50/50 p-8 rounded-3xl w-full text-stone-700 text-sm leading-relaxed border border-amber-100/60 text-left shadow-2xs">
          <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-1.5">
            <span>💡</span> 구매 전 필독 사항
          </h3>
          <ul className="space-y-1.5 text-stone-600">
            <li>· 상품 측정 방법에 따라 1~2cm의 오차가 발생할 수 있습니다.</li>
            <li>· 모니터 해상도 및 조명에 따라 실제 색상과 조금 차이가 있을 수 있습니다.</li>
            <li>· 본 상품은 KC 안전기준을 통과한 안전한 제품입니다.</li>
          </ul>
        </div>

        {product.detailImages && product.detailImages[0] && (
          <div 
            onClick={() => setModalImg(product.detailImages[0])}
            className="w-full bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 shadow-xs flex items-center justify-center p-4 cursor-pointer group relative"
          >
            <img src={product.detailImages[0]} alt="상세 뷰 1" className="w-full h-auto object-contain max-h-[800px] transform transition-transform duration-500 ease-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
              <span className="text-3xl text-white drop-shadow-md">🔍</span>
            </div>
          </div>
        )}

        {product.detailImages && product.detailImages[1] && (
          <div 
            onClick={() => setModalImg(product.detailImages[1])}
            className="w-full bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 shadow-xs flex items-center justify-center p-4 cursor-pointer group relative"
          >
            <img src={product.detailImages[1]} alt="상세 뷰 2" className="w-full h-auto object-contain max-h-[800px] transform transition-transform duration-500 ease-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
              <span className="text-3xl text-white drop-shadow-md">🔍</span>
            </div>
          </div>
        )}

      </div>

      {modalImg && (
        <div 
          onClick={() => setModalImg(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
            <img src={modalImg} alt="확대 상세 이미지" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
            <button 
              onClick={() => setModalImg(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function CartView({ cartItems, onUpdateQty, onRemove, onGoHome }) {
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = totalPrice > 0 && totalPrice < 50000 ? 3000 : 0;
  const finalPrice = totalPrice + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border border-stone-100 shadow-xs my-8">
        <p className="text-4xl mb-3">🛒</p>
        <h2 className="text-lg font-serif font-bold text-stone-800 mb-1">장바구니가 비어 있어요</h2>
        <button onClick={onGoHome} className="mt-4 bg-amber-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer">상품 구경하러 가기</button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 my-8">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-white p-5 rounded-3xl border border-stone-100 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-stone-50 rounded-2xl overflow-hidden border border-stone-100 shrink-0 flex items-center justify-center p-1">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">{item.category}</span>
                <h3 className="font-bold text-stone-900 mt-1">{item.name}</h3>
                <p className="text-xs text-stone-400 mt-0.5">₩{item.price.toLocaleString()} 원</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                <button onClick={() => onUpdateQty(item.id, -1)} className="w-5 h-5 flex items-center justify-center font-bold text-stone-600 cursor-pointer">-</button>
                <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                <button onClick={() => onUpdateQty(item.id, 1)} className="w-5 h-5 flex items-center justify-center font-bold text-stone-600 cursor-pointer">+</button>
              </div>
              <div className="text-right w-24">
                <p className="font-extrabold text-stone-900">₩{(item.price * item.quantity).toLocaleString()}</p>
              </div>
              <button onClick={() => onRemove(item.id)} className="text-stone-400 hover:text-red-500 transition text-sm font-medium cursor-pointer">삭제</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm mt-8">
        <h3 className="text-lg font-serif font-bold text-stone-900 mb-6 pb-4 border-b border-stone-100">결제예정 금액</h3>
        <div className="space-y-3 text-sm text-stone-600 mb-6">
          <div className="flex justify-between"><span>총 상품금액</span><span className="font-bold text-stone-900">₩{totalPrice.toLocaleString()}</span></div>
          <div className="flex justify-between"><span>배송비</span><span className="font-bold text-stone-900">{shippingFee === 0 ? '무료' : `₩${shippingFee.toLocaleString()}`}</span></div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-stone-100 mb-8">
          <span className="font-bold text-stone-800">최종 결제금액</span>
          <span className="text-2xl font-black text-amber-900">₩{finalPrice.toLocaleString()}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={onGoHome} className="py-4 rounded-2xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-50 transition cursor-pointer">쇼핑 계속하기</button>
          <button onClick={() => alert(`총 ₩{finalPrice.toLocaleString()} 결제 페이지로 이동합니다! 🛍️`)} className="py-4 rounded-2xl bg-amber-900 text-white font-bold hover:bg-amber-800 transition shadow-sm cursor-pointer">구매하기 ({cartItems.length})</button>
        </div>
      </div>
    </div>
  );
}