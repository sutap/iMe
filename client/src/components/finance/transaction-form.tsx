import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Transaction } from "@shared/schema";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TransactionFormProps {
  userId: number;
  transaction?: Transaction;
  onSubmit: (transactionData: Partial<Transaction>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export default function TransactionForm({ 
  userId, 
  transaction, 
  onSubmit, 
  onCancel, 
  onDelete 
}: TransactionFormProps) {
  const [amount, setAmount] = useState(transaction?.amount.toString() || "");
  const [description, setDescription] = useState(transaction?.description || "");
  const [date, setDate] = useState<Date>(transaction ? new Date(transaction.date) : new Date());
  const [category, setCategory] = useState(transaction?.category || "groceries");
  const [isIncome, setIsIncome] = useState(transaction?.isIncome || false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      amount: parseFloat(amount),
      description,
      date,
      category,
      isIncome
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Type</Label>
          <div className="flex items-center space-x-2">
            <Label htmlFor="transaction-type" className={isIncome ? "text-gray-500" : "text-red-500"}>
              Expense
            </Label>
            <Switch
              id="transaction-type"
              checked={isIncome}
              onCheckedChange={setIsIncome}
            />
            <Label htmlFor="transaction-type" className={isIncome ? "text-green-500" : "text-gray-500"}>
              Income
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right text-sm font-medium">
            Amount
          </Label>
          <div className="relative col-span-3">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              $
            </span>
            <Input
              type="number"
              step="0.01"
              min="0"
              className="pl-8"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right text-sm font-medium">
            Description
          </Label>
          <Input
            type="text"
            className="col-span-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right text-sm font-medium">
            Date
          </Label>
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="col-span-3 text-left justify-start font-normal"
              >
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  if (date) {
                    setDate(date);
                    setIsDatePickerOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right text-sm font-medium">
            Category
          </Label>
          <Select
            value={category}
            onValueChange={setCategory}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {isIncome ? (
                <>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="gift">Gift</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="groceries">Groceries</SelectItem>
                  <SelectItem value="dining">Dining</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="housing">Housing</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
        <div className="flex-1"></div>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className={isIncome ? "bg-green-600 hover:bg-green-700" : "bg-accent hover:bg-accent/90"}>
          Save
        </Button>
      </div>
    </form>
  );
}
