import { useLocalStorage } from "./useLocalStorage";
import { useEffect } from "react";

export function useDelayTimer(onExpire) {
  const [delayItems, setDelayItems] = useLocalStorage("cofix_delay_items", []);

  // 1초마다 오직 만료 여부만 체크하여 상태 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      let hasExpired = false;
      let expiredList = [];

      setDelayItems(prevItems => {
        if (!prevItems || prevItems.length === 0) return prevItems;

        let stateChanged = false;

        const updated = prevItems.map(item => {
          if (!item.expireAt || item.isExpired) return item;

          const diffMs = item.expireAt - now;
          
          // 시간이 다 된 경우
          if (diffMs <= 0 && !item.isExpired) {
            expiredList.push({ ...item, isExpired: true });
            hasExpired = true;
            stateChanged = true;
            return { ...item, isExpired: true };
          }

          return item;
        });

        return stateChanged ? updated : prevItems;
      });

      if (hasExpired && expiredList.length > 0 && typeof onExpire === "function") {
        expiredList.forEach(expired => onExpire(expired));
      }

    }, 1000);

    return () => clearInterval(timer);
  }, [onExpire, setDelayItems]);

  return [delayItems, setDelayItems];
}