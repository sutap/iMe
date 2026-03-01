import { Link } from "wouter";
import { Transaction } from "@shared/schema";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface TransactionsListProps {
  transactions: Transaction[];
  showViewAll?: boolean;
}

export default function TransactionsList({ transactions, showViewAll = true }: TransactionsListProps) {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold" style={{ color: '#3d3d2e' }}>Recent Transactions</h3>
        {showViewAll && (
          <Link href="/finance">
            <a className="text-sm font-medium" style={{ color: '#7d9b6f' }}>View all</a>
          </Link>
        )}
      </div>

      <div className="space-y-2">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center p-3 rounded-xl transition-colors duration-150"
              style={{ backgroundColor: 'rgba(125, 155, 111, 0.06)' }}
            >
              <div
                className="p-2 rounded-lg mr-3"
                style={{
                  backgroundColor: transaction.isIncome ? 'rgba(125, 155, 111, 0.15)' : 'rgba(196, 122, 90, 0.12)'
                }}
              >
                {transaction.isIncome ? (
                  <ArrowUpRight className="h-4 w-4" style={{ color: '#5a7a50' }} />
                ) : (
                  <ArrowDownLeft className="h-4 w-4" style={{ color: '#c47a5a' }} />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium" style={{ color: '#3d3d2e' }}>
                  {transaction.description}
                </h4>
                <p className="text-xs" style={{ color: '#8a8a72' }}>
                  {format(new Date(transaction.date), "PPp")}
                </p>
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: transaction.isIncome ? '#5a7a50' : '#c47a5a' }}
              >
                {transaction.isIncome ? "+" : "-"}${transaction.amount.toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <div className="p-4 text-sm text-center rounded-xl" style={{ color: '#8a8a72', backgroundColor: 'rgba(125, 155, 111, 0.06)' }}>
            No recent transactions
          </div>
        )}
      </div>

      <Link href="/finance">
        <a className="block mt-4 w-full px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-all duration-200 hover:opacity-90 text-center"
          style={{ backgroundColor: '#c4a882' }}>
          + Add Transaction
        </a>
      </Link>
    </div>
  );
}
