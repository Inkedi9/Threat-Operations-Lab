import { useCallback, useState } from "react";

/* ========================================
   🕶️ useImmersiveMode
======================================== */

export default function useImmersiveMode(initialValue = false) {
  const [isImmersive, setIsImmersive] = useState(initialValue);

  const enterImmersive = useCallback(() => {
    setIsImmersive(true);
  }, []);

  const exitImmersive = useCallback(() => {
    setIsImmersive(false);
  }, []);

  const toggleImmersive = useCallback(() => {
    setIsImmersive((prev) => !prev);
  }, []);

  return {
    isImmersive,
    setIsImmersive,
    enterImmersive,
    exitImmersive,
    toggleImmersive,
  };
}
