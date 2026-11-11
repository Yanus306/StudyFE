import { useState } from 'react';

// 1. 상세 페이지 상단 (좌측 이미지 & 우측 구매 정보 영역)
export function ProductDetailTop({ product }) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      {/* 좌측: 상품 이미지 */}
      <div className="aspect-square bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 shadow-sm sticky top-24">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 우측: 상품 정보 및 구매 옵션 */}
      <div className="flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
            {product.category}
          </span>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-3 mb-2">
            {product.name}
          </h1>
          <p className="text-stone-600 text-base leading-relaxed mb-6">
            {product.description}
          </p>
          <div className="text-2xl font-black text-amber-900 pb-6 border-b border-stone-200">
            ₩{product.price.toLocaleString()}
          </div>
        </div>

        {/* 수량 선택 및 총 금액 계산 */}
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between bg-stone-100 p-4 rounded-2xl">
            <span className="text-sm font-medium text-stone-700">구매 수량</span>
            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs">
              <button 
                onClick={handleDecrease}
                className="w-6 h-6 flex items-center justify-center font-bold text-stone-600 hover:bg-stone-100 rounded-md transition"
              >
                -
              </button>
              <span className="text-sm font-bold w-6 text-center">{quantity}</span>
              <button 
                onClick={handleIncrease}
                className="w-6 h-6 flex items-center justify-center font-bold text-stone-600 hover:bg-stone-100 rounded-md transition"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-stone-500">총 상품 금액</span>
            <span className="text-xl font-black text-stone-900">
              ₩{(product.price * quantity).toLocaleString()}
            </span>
          </div>
        </div>

        {/* 하단 장바구니 / 바로 구매 버튼 */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button 
            onClick={() => alert(`장바구니에 '${product.name}' (${quantity}개)가 담겼습니다! 🧸`)}
            className="py-4 rounded-2xl border border-amber-900 text-amber-900 font-bold hover:bg-amber-50 transition shadow-xs"
          >
            장바구니 담기
          </button>
          <button 
            onClick={() => alert(`'${product.name}' (${quantity}개) 구매 페이지로 이동합니다! 🛍️`)}
            className="py-4 rounded-2xl bg-amber-900 text-white font-bold hover:bg-amber-800 transition shadow-sm"
          >
            바로 구매하기
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. 상세 페이지 하단 (내리면 보이는 상세 이미지 및 설명 영역)
export function ProductDetailBottom({ product }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 border-t border-stone-200 mt-12 text-center">
      <h2 className="text-xl font-serif font-bold text-stone-800 mb-4">
        ✨ 상품 상세 정보 및 큐레이션 가이드
      </h2>
      <p className="text-stone-500 text-sm mb-10 max-w-lg mx-auto">
        ROOMY STORE가 엄선한 따뜻한 감성의 굿즈입니다. 실물 컷과 안내 사항을 꼼꼼히 확인해 주세요.
      </p>

      {/* 스크롤을 내렸을 때 가장 먼저 보이는 '구매 전 필독 사항' 박스 */}
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

        {/* 상세 이미지 1 */}
        {product.detailImages && product.detailImages[0] && (
          <div className="w-full aspect-[4/3] bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 shadow-xs">
            <img src={product.detailImages[0]} alt="상세 뷰 1" className="w-full h-full object-cover" />
          </div>
        )}

        {/* 상세 이미지 2 */}
        {product.detailImages && product.detailImages[1] && (
          <div className="w-full aspect-[4/3] bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 shadow-xs">
            <img src={product.detailImages[1]} alt="상세 뷰 2" className="w-full h-full object-cover" />
          </div>
        )}

      </div>
    </div>
  );
}