import { Link } from "wouter";
import { Transaction } from "@shared/schema";
import { format } from "date-fns";

interface TransactionsListProps {
  transactions: Transaction[];
  showViewAll?: boolean;
}

export default function TransactionsList({ transactions, showViewAll = true }: TransactionsListProps) {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
        {showViewAll && (
          <Link href="/finance">
            <a className="text-sm text-primary hover:text-indigo-700">View all</a>
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
            >
              <div
                className={`${
                  transaction.isIncome ? "bg-green-100" : "bg-red-100"
                } p-2 rounded mr-3`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${
                    transaction.isIncome ? "text-green-500" : "text-red-500"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      transaction.isIncome
                        ? "M5 10l7-7m0 0l7 7m-7-7v18"
                        : "M19 14l-7 7m0 0l-7-7m7 7V3"
                    }
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {transaction.description}
                </h4>
                <p className="text-xs text-gray-500">
                  {format(new Date(transaction.date), "PPp")}
                </p>
              </div>
              <span
                className={`text-sm font-medium ${
                  transaction.isIncome ? "text-green-500" : "text-red-500"
                }`}
              >
                {transaction.isIncome ? "+" : "-"}${transaction.amount.toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <div className="p-3 text-sm text-gray-500 text-center">
            No recent transactions
          </div>
        )}
      </div>

      <Link href="/finance">
        <a className="block mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-amber-600 transition-colors duration-200 text-center">
          Add Transaction
        </a>
      </Link>
    </div>
  );
}
