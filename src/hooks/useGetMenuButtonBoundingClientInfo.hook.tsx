import Taro from "@tarojs/taro";
import React, { useEffect, useState } from "react";

const useGetMenuButtonBoundingClientInfo = () => {
  const [menuBtnInfo, setMenuButtonInfo] = useState({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
  });

  useEffect(() => {
    const menuBtnInfo = Taro.getMenuButtonBoundingClientRect();
    setMenuButtonInfo(menuBtnInfo);
  }, []);

  return {
    menuBtnInfo,
    setMenuButtonInfo,
  };
};

export default useGetMenuButtonBoundingClientInfo;
