import React, { useState } from 'react'
import { View, Text, Button, Input, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface Question {
  id: number
  text: string
  placeholder: string
}

interface CareerReport {
  title: string
  role: string
  description: string
  strengths: string[]
  recommendations: string[]
  salaryRange: string
}

const CareerBlindBox: React.FC = () => {
  const [step, setStep] = useState<'start' | 'question1' | 'question2' | 'showBox' | 'report'>('start')
  const [answers, setAnswers] = useState<string[]>(['', ''])
  const [report, setReport] = useState<CareerReport | null>(null)
  
  // 问题列表
  const questions: Question[] = [
    {
      id: 1,
      text: '第一题：你最希望在工作中获得什么？',
      placeholder: '例如：创造力、稳定性、高收入...'
    },
    {
      id: 2,
      text: '第二题：你更倾向于独立工作还是团队协作？',
      placeholder: '请描述你的偏好...'
    }
  ]
  
  // 职业报告示例数据
  const sampleReports: CareerReport[] = [
    {
      title: '创新先锋',
      role: 'AI产品经理',
      description: '结合商业敏锐度与技术理解，打造下一代智能产品',
      strengths: ['需求分析能力强', '跨部门沟通协调', '技术理解深刻'],
      recommendations: [
        '学习AI基础知识',
        '关注行业动态',
        '培养项目管理能力'
      ],
      salaryRange: '30-60K'
    },
    {
      title: '数据洞察者',
      role: '数据分析科学家',
      description: '从海量数据中发现价值，驱动业务智能决策',
      strengths: ['逻辑思维强', '数据敏感度高', '统计建模能力'],
      recommendations: [
        '精通Python/R语言',
        '学习机器学习算法',
        '掌握数据可视化'
      ],
      salaryRange: '35-70K'
    },
    {
      title: '技术艺术家',
      role: 'AI算法工程师',
      description: '将数学原理转化为智能应用，创造技术价值',
      strengths: ['数学基础扎实', '编程能力强', '算法理解深入'],
      recommendations: [
        '深度学习框架研究',
        '参与开源项目',
        '关注前沿论文'
      ],
      salaryRange: '40-80K'
    }
  ]

  // 处理答案输入
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  // 开始回答问题
  const startQuestions = () => {
    setStep('question1')
  }

  // 跳过问题直接开盲盒
  const skipToBox = () => {
    generateReport()
    setStep('showBox')
  }

  // 下一题
  const nextQuestion = () => {
    if (step === 'question1') {
      setStep('question2')
    } else if (step === 'question2') {
      generateReport()
      setStep('showBox')
    }
  }

  // 生成报告（模拟AI生成）
  const generateReport = () => {
    // 这里可以根据答案智能生成报告
    // 目前使用随机选择作为示例
    const randomIndex = Math.floor(Math.random() * sampleReports.length)
    setReport(sampleReports[randomIndex])
  }

  // 打开盲盒
  const openBox = () => {
    setStep('report')
  }

  // 重新开始
  const restart = () => {
    setStep('start')
    setAnswers(['', ''])
    setReport(null)
  }

  // 分享报告
  const shareReport = () => {
    Taro.showShareMenu({
      withShareTicket: true
    })
  }

  return (
    <View className="career-blind-box">
      {/* 开始页面 */}
      {step === 'start' && (
        <View className="start-page">
          <View className="header">
            <Image 
              src="https://example.com/blindbox-icon.png" 
              className="box-icon"
              mode="aspectFit"
            />
            <Text className="title">AI职业规划盲盒</Text>
            <Text className="subtitle">探索你的职业可能性</Text>
          </View>
          
          <View className="intro-text">
            <Text>回答1-2个简单问题，让AI为你定制专属职业报告</Text>
            <Text>或者直接开启神秘盲盒！</Text>
          </View>
          
          <View className="button-group">
            <Button 
              className="btn primary" 
              onClick={startQuestions}
            >
              开始答题
            </Button>
            <Button 
              className="btn secondary" 
              onClick={skipToBox}
            >
              直接打开盲盒
            </Button>
          </View>
        </View>
      )}

      {/* 问题页面 */}
      {(step === 'question1' || step === 'question2') && (
        <View className="question-page">
          <View className="progress-bar">
            <View 
              className={`progress-step ${step === 'question1' ? 'active' : ''}`}
            >
              <Text className="step-number">1</Text>
              <Text className="step-text">第一题</Text>
            </View>
            <View className="progress-line"></View>
            <View 
              className={`progress-step ${step === 'question2' ? 'active' : ''}`}
            >
              <Text className="step-number">2</Text>
              <Text className="step-text">第二题</Text>
            </View>
          </View>

          <View className="question-container">
            <Text className="question-text">
              {questions[step === 'question1' ? 0 : 1].text}
            </Text>
            
            <Input
              className="answer-input"
              placeholder={questions[step === 'question1' ? 0 : 1].placeholder}
              value={answers[step === 'question1' ? 0 : 1]}
              onInput={(e) => handleAnswerChange(
                step === 'question1' ? 0 : 1, 
                e.detail.value
              )}
              focus
            />
          </View>

          <View className="action-buttons">
            <Button 
              className="btn skip" 
              onClick={skipToBox}
            >
              跳过直接开盲盒
            </Button>
            <Button 
              className="btn next" 
              onClick={nextQuestion}
              disabled={!answers[step === 'question1' ? 0 : 1]}
            >
              {step === 'question1' ? '下一题' : '生成报告'}
            </Button>
          </View>
        </View>
      )}

      {/* 盲盒展示页面 */}
      {step === 'showBox' && (
        <View className="box-page">
          <View className="box-container">
            <Image 
              src="https://example.com/blindbox-closed.png" 
              className="blind-box"
              mode="aspectFit"
            />
            <Text className="box-title">专属职业盲盒已生成！</Text>
            <Text className="box-subtitle">
              {answers[0] || answers[1] 
                ? '基于你的回答，AI为你定制了职业报告' 
                : '神秘职业盲盒等待开启'}
            </Text>
          </View>
          
          <Button 
            className="btn open-btn" 
            onClick={openBox}
          >
            ✨ 点击打开盲盒 ✨
          </Button>
          
          <Button 
            className="btn restart-btn" 
            onClick={restart}
          >
            重新开始
          </Button>
        </View>
      )}

      {/* 报告页面 */}
      {step === 'report' && report && (
        <View className="report-page">
          <View className="report-header">
            <Text className="report-title">🎉 你的AI职业规划报告 🎉</Text>
            <Text className="report-tag">{report.title}</Text>
          </View>
          
          <View className="report-card">
            <View className="role-section">
              <Text className="role-title">推荐职位</Text>
              <Text className="role-name">{report.role}</Text>
              <Text className="role-desc">{report.description}</Text>
            </View>
            
            <View className="salary-section">
              <Text className="salary-label">参考薪资范围</Text>
              <Text className="salary-value">{report.salaryRange}/月</Text>
            </View>
            
            <View className="strengths-section">
              <Text className="section-title">你的潜在优势</Text>
              {report.strengths.map((strength, index) => (
                <View key={index} className="strength-item">
                  <Text className="strength-bullet">✓</Text>
                  <Text className="strength-text">{strength}</Text>
                </View>
              ))}
            </View>
            
            <View className="recommendations-section">
              <Text className="section-title">发展建议</Text>
              {report.recommendations.map((rec, index) => (
                <View key={index} className="recommendation-item">
                  <Text className="rec-number">{index + 1}</Text>
                  <Text className="rec-text">{rec}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View className="report-actions">
            <Button 
              className="btn share-btn" 
              onClick={shareReport}
            >
              分享报告
            </Button>
            <Button 
              className="btn restart-btn" 
              onClick={restart}
            >
              再测一次
            </Button>
          </View>
          
          <View className="disclaimer">
            <Text className="disclaimer-text">
              *本报告基于AI分析生成，仅供参考。职业发展还需结合个人实际情况。
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}

export default CareerBlindBox;
