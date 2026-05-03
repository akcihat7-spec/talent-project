'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CreditCardIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  from?: string
  to?: string
}

interface Wallet {
  balance: number
  availableBalance: number
  pendingBalance: number
  totalEarnings: number
  totalWithdrawn: number
  currency: string
  lastUpdated: string
}

const mockWallet: Wallet = {
  balance: 12567.89,
  availableBalance: 11234.56,
  pendingBalance: 1333.33,
  totalEarnings: 25678.90,
  totalWithdrawn: 13111.01,
  currency: 'USD',
  lastUpdated: '2024-05-03T14:30:00Z'
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'payment',
    amount: 2500.00,
    description: 'React E-commerce Platform',
    date: '2024-05-01',
    status: 'completed',
    from: 'TechCorp Inc.'
  },
  {
    id: '2',
    type: 'withdrawal',
    amount: 1500.00,
    description: 'Bank Transfer',
    date: '2024-04-30',
    status: 'completed',
    to: 'Bank Account ****1234'
  },
  {
    id: '3',
    type: 'payment',
    amount: 1800.00,
    description: 'Python Automation Project',
    date: '2024-04-28',
    status: 'completed',
    from: 'DataFlow Solutions'
  },
  {
    id: '4',
    type: 'deposit',
    amount: 500.00,
    description: 'Bonus Payment',
    date: '2024-04-25',
    status: 'completed'
  },
  {
    id: '5',
    type: 'payment',
    amount: 3200.00,
    description: 'Mobile App Development',
    date: '2024-04-22',
    status: 'pending',
    from: 'MobileFirst'
  },
  {
    id: '6',
    type: 'withdrawal',
    amount: 800.00,
    description: 'PayPal Transfer',
    date: '2024-04-20',
    status: 'failed',
    to: 'PayPal Account'
  }
]

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet>(mockWallet)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownTrayIcon className="h-5 w-5" />
      case 'withdrawal':
        return <ArrowUpTrayIcon className="h-5 w-5" />
      case 'payment':
        return <CurrencyDollarIcon className="h-5 w-5" />
      case 'refund':
        return <ArrowDownTrayIcon className="h-5 w-5" />
      default:
        return <CurrencyDollarIcon className="h-5 w-5" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'payment':
        return 'text-green-600 bg-green-100'
      case 'withdrawal':
      case 'refund':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-800 bg-green-100'
      case 'pending':
        return 'text-yellow-800 bg-yellow-100'
      case 'failed':
        return 'text-red-800 bg-red-100'
      default:
        return 'text-gray-800 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'pending':
        return <ClockIcon className="h-4 w-4" />
      case 'failed':
        return <ExclamationTriangleIcon className="h-4 w-4" />
      default:
        return <ClockIcon className="h-4 w-4" />
    }
  }

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return
    
    const amount = parseFloat(depositAmount)
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      type: 'deposit',
      amount: amount,
      description: 'Manual Deposit',
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    }

    setTransactions(prev => [newTransaction, ...prev])
    setWallet(prev => ({
      ...prev,
      pendingBalance: prev.pendingBalance + amount
    }))
    
    setDepositAmount('')
    setShowDepositModal(false)
  }

  const handleWithdrawal = () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) return
    
    const amount = parseFloat(withdrawalAmount)
    
    if (amount > wallet.availableBalance) {
      alert('Insufficient balance')
      return
    }

    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      type: 'withdrawal',
      amount: amount,
      description: 'Bank Transfer',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      to: 'Bank Account ****1234'
    }

    setTransactions(prev => [newTransaction, ...prev])
    setWallet(prev => ({
      ...prev,
      availableBalance: prev.availableBalance - amount,
      pendingBalance: prev.pendingBalance - amount
    }))
    
    setWithdrawalAmount('')
    setShowWithdrawalModal(false)
  }

  return (
    <DashboardLayout title="Wallet" subtitle="Manage your earnings and transactions">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Balance</p>
              <p className="text-2xl font-bold">${wallet.balance.toLocaleString()}</p>
            </div>
            <BanknotesIcon className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Available</p>
              <p className="text-2xl font-bold text-gray-900">${wallet.availableBalance.toLocaleString()}</p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">${wallet.pendingBalance.toLocaleString()}</p>
            </div>
            <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${wallet.totalEarnings.toLocaleString()}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setShowDepositModal(true)}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Deposit Funds</span>
          </button>
          <button
            onClick={() => setShowWithdrawalModal(true)}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md"
          >
            <ArrowUpTrayIcon className="h-5 w-5" />
            <span>Withdraw Funds</span>
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
            <div className="flex space-x-2">
              {(['week', 'month', 'year'] as const).map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    selectedPeriod === period
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                        {transaction.from && (
                          <div className="text-sm text-gray-500">From: {transaction.from}</div>
                        )}
                        {transaction.to && (
                          <div className="text-sm text-gray-500">To: {transaction.to}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1">{transaction.status}</span>
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                    transaction.type === 'deposit' || transaction.type === 'payment' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'deposit' || transaction.type === 'payment' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Deposit Funds</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
                  <option>Credit Card</option>
                  <option>Bank Transfer</option>
                  <option>PayPal</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleDeposit}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Deposit
              </button>
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Withdraw Funds</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="0.00"
                  max={wallet.availableBalance}
                />
                <p className="text-xs text-gray-500 mt-1">Available: ${wallet.availableBalance.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Method</label>
                <select className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
                  <option>Bank Transfer</option>
                  <option>PayPal</option>
                  <option>Wire Transfer</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleWithdrawal}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Withdraw
              </button>
              <button
                onClick={() => setShowWithdrawalModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
