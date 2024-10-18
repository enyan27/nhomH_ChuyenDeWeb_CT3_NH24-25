import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function useTurnSwitch(key, defaultTab = "") {
  const [searchParams, setSearchParams] = useSearchParams("");
  const keyName = searchParams.get(key) || defaultTab;
  const [switchTab, setSwitchTab] = useState(-1);

  useEffect(() => {
    if (!keyName || keyName === defaultTab) {
      searchParams.set(key, defaultTab); 
      setSearchParams(searchParams);
    }
    setSwitchTab((turn) => turn - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyName]);

  return { switchTab, searchParams, setSearchParams, keyName };
}
