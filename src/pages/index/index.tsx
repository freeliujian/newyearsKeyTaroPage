import React, { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import { Button, TextArea } from "@nutui/nutui-react-taro";
import Taro, { request } from "@tarojs/taro";
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
      url: "http://123.57.67.54:3000/api/thoughtHeart",
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
        url: "http://123.57.67.54:3000/api/fortune",
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

  return (
    <View className="new-year-fortune-wrapper">
      {loading ? null : (
        <>
          <View className="background-decorations">
            <View className="lantern left-lantern"></View>
            <View className="lantern right-lantern"></View>
            <View className="firework firework-1"></View>
            <View className="firework firework-2"></View>
          </View>
          <View className="content">
            <View className="couplets-section">
              <View className="couplet left-couplet">
                <View className="couplet-border">
                  <Text className="couplet-title">辞旧</Text>
                  <Text className="couplet-content">
                    挥别{previousYear}遗憾
                  </Text>
                  <Text className="couplet-content">往事皆清零</Text>
                </View>
              </View>

              <View className="couplet-center">
                <Text className="main-title">新年签</Text>
                <Text className="year-text">{currentYear}</Text>
                <Text className="sub-title">预见你的新年运势</Text>
              </View>

              <View className="couplet right-couplet">
                <View className="couplet-border">
                  <Text className="couplet-title">迎新</Text>
                  <Text className="couplet-content">喜迎{currentYear}期待</Text>
                  <Text className="couplet-content">未来皆可期</Text>
                </View>
              </View>
            </View>

            {!showResult ? (
              <View className="input-section">
                <View className="input-container">
                  <Text className="section-title">写下你的新年愿望</Text>
                  <TextArea
                    className="wish-input"
                    placeholder={`例如：我希望${currentYear}年事业进步，家人健康，学习新技能...`}
                    value={inputText}
                    onChange={(value) => setInputText(value)}
                    maxLength={200}
                    rows={4}
                    autoHeight
                  />

                  <View className="quick-hints">
                    <Text className="hints-title">输入你的心中寄语：</Text>
                    <View className="hints-container">
                      {QUICK_HINTS.map((hint, index) => (
                        <View
                          key={index}
                          className="hint-tag"
                          onClick={() => handleHintClick(hint)}
                        >
                          <Text className="hint-text">{hint}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
                <div className="button-wrapper">
                  <Button
                    className="generate-btn"
                    type="primary"
                    loading={isGenerating}
                    onClick={fetchFortune}
                  >
                    {isGenerating
                      ? "生成中..."
                      : `生成我的${currentYear}新年签`}
                  </Button>
                </div>
              </View>
            ) : (
              <View className="result-section">
                <View className="fortune-card">
                  <View className="fortune-header">
                    <Text className="fortune-title">
                      {fortuneResult?.title}
                    </Text>
                    <Text className="fortune-date">
                      {currentYear}年专属运势
                    </Text>
                  </View>
                  <View className="fortune-content">
                    <Text className="fortune-text">
                      {fortuneResult?.content}
                    </Text>
                    <View className="fortune-details">
                      <View className="detail-item">
                        <Text className="detail-label">幸运色</Text>
                        <View className="detail-value">
                          <View
                            className="color-box"
                            style={{
                              backgroundColor: fortuneResult?.luckyColor.hex,
                            }}
                          />
                          <Text>{fortuneResult?.luckyColor.name}</Text>
                        </View>
                      </View>

                      <View className="detail-item">
                        <Text className="detail-label">幸运数字</Text>
                        <Text className="detail-number">
                          {fortuneResult?.luckyNumber}
                        </Text>
                      </View>

                      <View className="detail-item">
                        <Text className="detail-label">吉利方位</Text>
                        <Text className="detail-value">
                          {fortuneResult?.luckyDirection}
                        </Text>
                      </View>
                    </View>

                    <View className="fortune-areas">
                      {fortuneResult?.areas.map((area: any, index: number) => (
                        <View key={index} className="area-item">
                          <Text className="area-name">{area.name}</Text>
                          <Text className="area-stars">{area.stars}</Text>
                        </View>
                      ))}
                    </View>

                    <View className="advice-section">
                      <Text className="advice-label">新年建议：</Text>
                      <Text className="advice-text">
                        {fortuneResult?.advice}
                      </Text>
                    </View>
                    <View className="advice-section" style={{ marginTop: 10 }}>
                      <Text className="advice-label" style={{fontSize: 14}}>新年寄语：</Text>
                      <Text className="advice-text" style={{fontSize: 14}}>
                        {fortuneResult?.copyContent}
                      </Text>
                    </View>
                  </View>

                  <View className="action-buttons">
                    <Button
                      className="action-btn share-btn"
                      type="primary"
                      openType="share"
                    >
                      分享好运
                    </Button>
                    <Button
                      className="action-btn save-btn"
                      onClick={saveToAlbum}
                    >
                      保存寄语
                    </Button>
                    <Button
                      className="action-btn regenerate-btn"
                      type="default"
                      onClick={regenerateFortune}
                    >
                      重新生成
                    </Button>
                  </View>
                </View>

                <View className="fortune-note">
                  <Text>本结果由AI生成，仅供娱乐参考</Text>
                  <Text>愿您{currentYear}年心想事成，万事如意！</Text>
                </View>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}

export default NewYearFortune;
