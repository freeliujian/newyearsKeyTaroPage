import React from "react";
import { View, Text } from "@tarojs/components";
import { Button } from "@nutui/nutui-react-taro";
import "../../pages/index/index.scss"; 

interface FortuneResult {
  title: string;
  content: string;
  luckyColor: { name: string; hex: string };
  luckyNumber: number;
  luckyDirection: string;
  advice: string;
  areas: Array<{ name: string; stars: string }>;
}

interface ResultReportProps {
  result: FortuneResult;
  onRegenerate: () => void;
  onSaveToAlbum: () => void;
  currentYear: number;
}

function ResultReport({ 
  result, 
  onRegenerate, 
  onSaveToAlbum, 
  currentYear 
}: ResultReportProps) {
  return (
    <div className="content">

    <View className="result-section">
      <View className="fortune-card">
        <View className="fortune-header">
          <View className="fortune-tag">{result.title}</View>
          <Text className="fortune-title">{currentYear}新年运势</Text>
        </View>

        <View className="fortune-content">
          <Text className="fortune-text">{result.content}</Text>
        </View>

        <View className="fortune-details">
          <View className="detail-item">
            <Text className="detail-label">幸运色</Text>
            <View className="color-sample" style={{ backgroundColor: result.luckyColor.hex }}>
              <Text className="color-name">{result.luckyColor.name}</Text>
            </View>
          </View>

          <View className="detail-item">
            <Text className="detail-label">幸运数字</Text>
            <View className="lucky-number">
              <Text className="number">{result.luckyNumber}</Text>
            </View>
          </View>

          <View className="detail-item">
            <Text className="detail-label">吉祥方位</Text>
            <Text className="direction">{result.luckyDirection}</Text>
          </View>
        </View>

        <View className="areas-section">
          <Text className="section-title">运势指数</Text>
          <View className="areas-grid">
            {result.areas.map((area, index) => (
              <View key={index} className="area-item">
                <Text className="area-name">{area.name}</Text>
                <Text className="area-stars">{area.stars}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="advice-section">
          <Text className="section-title">新年建议</Text>
          <Text className="advice-text">{result.advice}</Text>
        </View>

        <View className="action-buttons">
          <Button 
            className="action-btn regenerate-btn" 
            type="default" 
            onClick={onRegenerate}
          >
            重新生成
          </Button>
          <Button 
            className="action-btn save-btn" 
            type="primary" 
            onClick={onSaveToAlbum}
          >
            保存到相册
          </Button>
        </View>

        <View className="share-hint">
          <Text>点击右上角分享给好友，一起测新年运势</Text>
        </View>
      </View>
      </View>
    </div>
  );
}

export default ResultReport;