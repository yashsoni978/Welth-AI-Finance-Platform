"use client";

import { useCallback, useEffect, useMemo } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import useFetch from "@/hooks/use-fetch";
import { updateDefaultAccount } from "@/actions/account";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const parsedBalance = useMemo(() => {
    const num = parseFloat(balance);
    return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
  }, [balance]);

  const accountType = useMemo(() => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }, [type]);

  const handleDefaultChange = useCallback(
    async (e) => {
      e.preventDefault();

      if (isDefault) {
        toast.warning("At least one default account is required.");
        return;
      }

      await updateDefaultFn(id);
    },
    [isDefault, id, updateDefaultFn]
  );

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card className="group relative transition-shadow hover:shadow-md">
      {/* Switch is outside the Link to avoid nav on toggle */}
      <div className="absolute top-2 right-2 z-10">
        <Switch
          checked={isDefault}
          onClick={handleDefaultChange}
          disabled={updateDefaultLoading}
          aria-label={`Set ${name} as default account`}
        />
      </div>

      <Link
        href={`/account/${id}`}
        className="block p-4 pt-10 focus:outline-none focus:ring-2 focus:ring-ring rounded-xl"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium capitalize truncate">
            {name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-1">
          <div className="text-2xl font-bold">{parsedBalance}</div>
          <p className="text-xs text-muted-foreground">{accountType} Account</p>
        </CardContent>

        <CardFooter className="mt-2 flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
