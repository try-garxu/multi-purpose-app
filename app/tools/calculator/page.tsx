'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Delete } from 'lucide-react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '%':
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const Button = ({ value, onClick, className = '', span = false }: any) => (
    <button
      onClick={onClick}
      className={`h-16 rounded-lg font-semibold text-lg transition-all hover:scale-105 active:scale-95 ${
        span ? 'col-span-2' : ''
      } ${className}`}
    >
      {value}
    </button>
  );

  return (
    <ToolLayout
      title="Calculator"
      description="A simple and elegant calculator for your everyday calculations."
    >
      <div className="max-w-md mx-auto">
        <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl">
          {/* Display */}
          <div className="bg-gray-800 rounded-xl p-6 mb-4 min-h-[100px] flex items-end justify-end">
            <div className="text-right">
              {operation && previousValue !== null && (
                <div className="text-gray-400 text-sm mb-1">
                  {previousValue} {operation}
                </div>
              )}
              <div className="text-white text-4xl font-bold break-all">
                {display}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <Button
              value="C"
              onClick={clear}
              className="bg-red-500 hover:bg-red-600 text-white"
            />
            <Button
              value="%"
              onClick={() => performOperation('%')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            />
            <Button
              value={<Delete className="w-5 h-5 mx-auto" />}
              onClick={() => setDisplay(display.slice(0, -1) || '0')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            />
            <Button
              value="÷"
              onClick={() => performOperation('÷')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            />

            {/* Row 2 */}
            <Button
              value="7"
              onClick={() => inputDigit('7')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            />
            <Button
              value="8"
              onClick={() => inputDigit('8')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            />
            <Button
              value="9"
              onClick={() => inputDigit('9')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            />
            <Button
              value="×"
              onClick={() => performOperation('×')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            />

            {/* Row 3 */}
            <Button
              value="4"
              onClick={() => inputDigit('4')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            />
            <Button
              value="5"
              onClick={() => inputDigit('5')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            />
            <Button
              value="6"
              onClick={() => inputDigit('6')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            />
            <Button
              value="-"
              onClick={() => performOperation('-')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            />

            {/* Row 4 */}
            <Button
              value="1"
              onClick={() => inputDigit('1')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            />
            <Button
              value="2"
              onClick={() => inputDigit('2')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            />
            <Button
              value="3"
              onClick={() => inputDigit('3')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            />
            <Button
              value="+"
              onClick={() => performOperation('+')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            />

            {/* Row 5 */}
            <Button
              value="0"
              onClick={() => inputDigit('0')}
              span={true}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            />
            <Button
              value="."
              onClick={inputDecimal}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            />
            <Button
              value="="
              onClick={handleEquals}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            />
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Keyboard Shortcuts</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div>• Numbers: 0-9</div>
            <div>• Clear: C or Escape</div>
            <div>• Add: +</div>
            <div>• Subtract: -</div>
            <div>• Multiply: * or ×</div>
            <div>• Divide: / or ÷</div>
            <div>• Decimal: .</div>
            <div>• Equals: = or Enter</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
