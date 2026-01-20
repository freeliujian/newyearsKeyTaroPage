import React, { useState, useEffect } from "react";
import { View, Text, Input } from "@tarojs/components";
import { Button, TextArea } from "@nutui/nutui-react-taro";
import Taro, { request } from "@tarojs/taro";
import { Refresh } from "@nutui/icons-react-taro";
import "./index.scss";

function safeParseMixedFormat(str: string) {
  try {
    return JSON.parse(str);
  } catch (jsonError) {
    try {
      const formatted = str
        .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3')
        .replace(/\/\/.*$/gm, "")
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]");
      return JSON.parse(formatted);
    } catch (formatError) {
      console.error("所有解析方法都失败");
      return null;
    }
  }
}

function NewYearFortune() {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [fortuneResult, setFortuneResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [QUICK_HINTS, setQUICK_HINTS] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    request({
      url: "https://hello.daibot.cn/api/thoughtHeart",
      method: "GET",
    })
      .then((res) => {
        setQUICK_HINTS(
          safeParseMixedFormat(res.data.message).thoughtsInTheHeart
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleHintClick = (hint: string) => {
    setInputText(hint);
  };

  const fetchFortune = async () => {
    if (!inputText.trim()) {
      return;
    }
    try {
      setIsGenerating(true);
      const response = await request({
        url: "https://hello.daibot.cn/api/fortune",
        method: "POST",
        header: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          inputText,
          currentYear,
        }),
      });

      const data = safeParseMixedFormat(response.data.message);
      console.log(data);
      setFortuneResult(data);
      setShowResult(true);
    } catch (err) {
      console.error("获取运势失败:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  Taro.useShareAppMessage(() => {
    return {
      title: "我的新年签，快来测测你的运势！",
      path: "/pages/index/index",
    };
  });
  const handleRandomHint = () => {
    if (QUICK_HINTS && QUICK_HINTS.length > 0) {
      const randomIndex = Math.floor(Math.random() * QUICK_HINTS.length);

      setInputText(QUICK_HINTS[randomIndex]);
    } else {
      Taro.showToast({
        title: "正在加载灵感...",
        icon: "none",
      });
    }
  };
  const regenerateFortune = () => {
    setShowResult(false);
    setInputText("");
  };

  const saveToAlbum = async () => {
    try {
      if (!fortuneResult || !fortuneResult.copyContent) {
        Taro.showToast({
          title: "签文内容不存在",
          icon: "none",
          duration: 2000,
        });
        return;
      }

      await Taro.setClipboardData({
        data: fortuneResult.copyContent,
        success: () => {
          Taro.showToast({
            title: "签文已复制到剪切板",
            icon: "success",
            duration: 2000,
          });
        },
        fail: (err) => {
          console.error("复制失败:", err);
          Taro.showToast({
            title: "复制失败，请重试",
            icon: "none",
            duration: 2000,
          });
        },
      });
    } catch (error) {
      console.error("保存失败:", error);
      Taro.showToast({
        title: "保存失败，请重试",
        icon: "none",
        duration: 2000,
      });
    }
  };

  const newYearsFortune = () => {
    return (
      <>
        <View className="layer"> </View>
        <View className="content-area"></View>
        <View className="footer"></View>
        <View className="gold-card">
          <View className="top-cutter" onClick={handleRandomHint}>
            <TextArea
              className="wish-input"
              placeholder={`例如:我希望${currentYear}年事业进步，家人健康`}
              value={inputText}
              onChange={(value) => setInputText(value)}
              maxLength={200}
              rows={4}
              autoHeight
            />
            <View className="action-icon">
              <Refresh color="#999" size={16} />
            </View>
          </View>
          <Button
            className="action-btn"
            type="primary"
            loading={isGenerating}
            onClick={fetchFortune}
          >
            {isGenerating ? "生成中..." : `生成我的${currentYear}新年签`}
          </Button>
        </View>
      </>
    );
  };

  const messageGeneration = () => {
    const tags = fortuneResult?.advice.split(/[，。]/).filter(Boolean);
    return (
      <>
        <View className="result-section">
          <View className="top-title">{currentYear}年专属运势</View>
          <View className="fortune-content">{fortuneResult?.title}</View>
          <View className="result-card">
            <View className="info-grid">
              <View className="grid-item">
                <Text className="label">幸运色</Text>
                <View className="value-row">
                  <View
                    className="color-block"
                    style={{
                      backgroundColor:
                        fortuneResult?.luckyColor.hex || "#D90000",
                    }}
                  ></View>

                  <Text className="link-text">
                    {fortuneResult?.luckyColor.name}
                  </Text>
                </View>
              </View>

              <View className="grid-item">
                <Text className="label">幸运数字</Text>
                <Text className="value-text">{fortuneResult?.luckyNumber}</Text>
              </View>

              <View className="grid-item">
                <Text className="label">吉利方位</Text>
                <Text className="value-text">
                  {fortuneResult?.luckyDirection}
                </Text>
              </View>
            </View>
            <View className="fortune-list">
              {fortuneResult?.areas?.map((item, index) => (
                <View className="fortune-item" key={index}>
                  <Text className="item-label">{item.name}</Text>
                  <Text className="star-text">{item.stars}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className="advice-card">
            <View className="card-header">
              <Text className="title">新年建议：</Text>
            </View>

            <View className="tags-wrapper">
              {tags.map((item, index) => (
                <View className="tag-pill" key={index}>
                  <Text className="tag-text">{item}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className="text-card-container">
            <View className="text-body">
              <Text className="inline-title">新年建议：</Text>
              <Text className="inline-content">
                {fortuneResult?.copyContent}
              </Text>
            </View>
          </View>
        </View>
        <View className="gold">
          <View className="button-group">
            <Button className=" btn-share" type="primary" openType="share">
              分享好运
            </Button>
            <Button className=" btn-save" type="default" onClick={saveToAlbum}>
              保存寄语
            </Button>
            <Button
              className="again-btn"
              type="default"
              onClick={regenerateFortune}
            >
              重新生成
            </Button>
            <View className="tip">
              本结果由AI生成,仅供娱乐参考愿您2026年心想事成,万事如意!
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <View className="card-wrapper">
      {!showResult ? newYearsFortune() : messageGeneration()}
    </View>
  );
}

export default NewYearFortune;
