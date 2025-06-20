import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { RefreshCw, Calculator, DollarSign, Instagram, MessageCircle, ExternalLink, AlertTriangle } from 'lucide-react'
import './App.css'

function App() {
  const [animalPrice, setAnimalPrice] = useState('')
  const [shippingFee, setShippingFee] = useState('')
  const [exchangeRate, setExchangeRate] = useState('')
  const [bankRate, setBankRate] = useState(null)
  const [loading, setLoading] = useState(false)

  // 獲取台銀美元匯率
  const fetchBankRate = async () => {
    setLoading(true)
    try {
      // 暫時使用模擬數據，實際部署時會連接API
      const mockBankRate = 29.575
      setBankRate(mockBankRate)
      setExchangeRate((mockBankRate * 1.1).toFixed(4))
      
      // 實際API調用代碼（暫時註解）
      /*
      const response = await fetch('http://localhost:5001/api/exchange-rate')
      const data = await response.json()
      if (data.success) {
        setBankRate(data.base_rate)
        setExchangeRate(data.paypal_rate.toString())
      }
      */
    } catch (error) {
      console.error('獲取匯率失敗:', error)
      // 使用預設值
      const defaultRate = 29.575
      setBankRate(defaultRate)
      setExchangeRate((defaultRate * 1.1).toFixed(4))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBankRate()
  }, [])

  // 計算各項費用
  const calculations = () => {
    const animal = parseFloat(animalPrice) || 0
    const shipping = parseFloat(shippingFee) || 0
    const rate = parseFloat(exchangeRate) || 0

    const totalUSD = animal + shipping
    const paypalFee = totalUSD * 0.044
    const paypalDeductionUSD = totalUSD * 1.044
    const paypalDeductionTWD = paypalDeductionUSD * rate
    const serviceFee = animal * rate * 0.4
    const totalPrice = paypalDeductionTWD + serviceFee

    return {
      totalUSD,
      paypalFee,
      paypalDeductionUSD,
      paypalDeductionTWD,
      serviceFee,
      totalPrice
    }
  }

  const calc = calculations()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 標題區域 */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <DollarSign className="h-8 w-8 text-blue-600" />
            動物進口手續費試算機
          </h1>
          <p className="text-lg text-gray-600">蛙爸進口服務 - 精確計算您的進口成本</p>
        </div>

        {/* 免責聲明 */}
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>免責聲明：</strong>此試算機由玩家依照自行設計，並非蛙爸官方製作。僅供預估購買動物的入手費用參考，實際服務應以蛙爸的官方計算為主，本試算機結果不代表最終價格。
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 輸入區域 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                基本資料輸入
              </CardTitle>
              <CardDescription>
                請輸入動物價格和相關費用資訊
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="animalPrice">MorphMarket原價 (USD)</Label>
                <Input
                  id="animalPrice"
                  type="number"
                  placeholder="1100.00"
                  value={animalPrice}
                  onChange={(e) => setAnimalPrice(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingFee">繁殖者收取的當地運費 (USD)</Label>
                <Input
                  id="shippingFee"
                  type="number"
                  placeholder="80.00"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  className="text-lg"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="exchangeRate">PayPal 匯率</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchBankRate}
                    disabled={loading}
                    className="h-8"
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    更新
                  </Button>
                </div>
                <Input
                  id="exchangeRate"
                  type="number"
                  step="0.0001"
                  placeholder="32.5325"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  className="text-lg"
                />
                {bankRate && (
                  <p className="text-sm text-gray-600">
                    台銀即期匯率: {bankRate} (預設 PayPal 匯率: {(bankRate * 1.1).toFixed(4)})
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 計算結果區域 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>費用明細</CardTitle>
              <CardDescription>
                詳細的費用計算結果
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">MorphMarket原價</span>
                  <span className="font-mono text-lg">${animalPrice || '0.00'}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">繁殖者收取的當地運費</span>
                  <span className="font-mono text-lg">${shippingFee || '0.00'}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">PayPal fee (4.4%)</span>
                  <span className="font-mono text-lg">${calc.paypalFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">PayPal繳給繁殖者的美金總價</span>
                  <span className="font-mono text-lg">${calc.paypalDeductionUSD.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">PayPal 匯率</span>
                  <span className="font-mono text-lg">{exchangeRate || '0.0000'}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">使用PayPal換算台幣</span>
                  <span className="font-mono text-lg text-blue-600">NT${calc.paypalDeductionTWD.toLocaleString()}</span>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">進口全部手續費用</span>
                  <span className="font-mono text-lg text-green-600">NT${calc.serviceFee.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-3 bg-gray-50 px-4 rounded-lg border-2 border-gray-200">
                  <span className="font-semibold text-gray-900">以上總共台幣金額</span>
                  <span className="font-mono text-xl font-bold text-red-600">NT${calc.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 說明區域 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>計算說明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">計算公式：</h4>
                <ul className="space-y-1">
                  <li>• 總金額(USD) = 動物金額 + 國內運費</li>
                  <li>• PayPal 手續費 = 總金額 × 0.044</li>
                  <li>• PayPal 扣款(USD) = 總金額 × 1.044</li>
                  <li>• PayPal 扣款(TWD) = PayPal 扣款 × 匯率</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">服務費用：</h4>
                <ul className="space-y-1">
                  <li>• 手續費 = 動物金額 × 匯率 × 0.4</li>
                  <li>• 總價 = PayPal扣款(TWD) + 手續費</li>
                  <li>• PayPal匯率預設為台銀美元匯率 × 1.1</li>
                  <li>• 可手動調整 PayPal 實際匯率</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 蛙爸聯絡資訊 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>蛙爸聯絡資訊</CardTitle>
            <CardDescription>
              如需實際進口服務，請聯絡蛙爸
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => window.open('https://www.instagram.com/taiwancasalin/', '_blank')}
              >
                <Instagram className="h-4 w-4" />
                Instagram
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => window.open('https://lin.ee/aroKUs6', '_blank')}
              >
                <MessageCircle className="h-4 w-4" />
                LINE
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 版權聲明 */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-2 text-sm text-gray-600">
              <p>© 2025 由 Manus AI 程式製作</p>
              <p>
                想要製作自己的 AI 應用程式嗎？
                <a 
                  href="https://manus.im/invitation/WYNW1DHRMGAGT" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  立即體驗 Manus AI
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

