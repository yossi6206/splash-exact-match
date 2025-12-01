import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp } from "lucide-react";

interface FinanceCalculatorProps {
  carPrice: number;
}

const FinanceCalculator = ({ carPrice }: FinanceCalculatorProps) => {
  const [downPaymentPercent, setDownPaymentPercent] = useState(0);
  const [loanPeriodMonths, setLoanPeriodMonths] = useState(12);
  const [interestRate, setInterestRate] = useState(3.5);

  const downPaymentAmount = (carPrice * downPaymentPercent) / 100;
  const loanAmount = carPrice - downPaymentAmount;

  // Calculate monthly payment using standard loan formula
  const calculateMonthlyPayment = () => {
    if (loanAmount <= 0) return 0;
    
    const monthlyRate = interestRate / 100 / 12;
    if (monthlyRate === 0) return loanAmount / loanPeriodMonths;
    
    const monthlyPayment = 
      loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, loanPeriodMonths)) / 
      (Math.pow(1 + monthlyRate, loanPeriodMonths) - 1);
    
    return monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * loanPeriodMonths;
  const totalInterest = totalPayment - loanAmount;

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold text-foreground">מחשבון מימון</h3>
        </div>

        <div className="space-y-6">
          {/* Down Payment Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">מקדמה</Label>
              <span className="text-sm font-bold text-foreground">
                ₪{downPaymentAmount.toLocaleString('he-IL', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <Slider
              value={[downPaymentPercent]}
              onValueChange={(value) => setDownPaymentPercent(value[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span className="font-bold text-primary">{downPaymentPercent}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Loan Period Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">תקופת הלוואה (חודשים)</Label>
              <span className="text-sm font-bold text-foreground">{loanPeriodMonths}</span>
            </div>
            <Slider
              value={[loanPeriodMonths]}
              onValueChange={(value) => setLoanPeriodMonths(value[0])}
              min={12}
              max={84}
              step={12}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>12</span>
              <span className="font-bold text-primary">{loanPeriodMonths}</span>
              <span>84</span>
            </div>
          </div>

          {/* Interest Rate Input */}
          <div className="space-y-2">
            <Label className="text-base font-medium">ריבית שנתית (%)</Label>
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0"
              max="20"
              className="text-center text-lg font-semibold"
            />
          </div>

          {/* Results Box */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-5 space-y-3 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h4 className="font-bold text-foreground">תוצאות החישוב</h4>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">תשלום חודשי</span>
              <span className="text-2xl font-bold text-primary">
                ₪{monthlyPayment.toLocaleString('he-IL', { maximumFractionDigits: 0 })}
              </span>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-border/50">
              <span className="text-sm text-muted-foreground">סכום הלוואה</span>
              <span className="text-lg font-bold text-foreground">
                ₪{loanAmount.toLocaleString('he-IL', { maximumFractionDigits: 0 })}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">סה״כ ריבית</span>
              <span className="text-lg font-bold text-foreground">
                ₪{totalInterest.toLocaleString('he-IL', { maximumFractionDigits: 0 })}
              </span>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-primary/20">
              <span className="text-sm text-muted-foreground">סה״כ לתשלום</span>
              <span className="text-lg font-bold text-foreground">
                ₪{totalPayment.toLocaleString('he-IL', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-center text-muted-foreground">
            * החישוב הוא משוער בלבד ואינו מהווה הצעה מחייבת
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceCalculator;
