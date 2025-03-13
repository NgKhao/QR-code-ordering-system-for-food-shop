import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import AccountTable from "@/app/manage/accounts/account-table";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 text-transparent bg-clip-text">
                  Tài khoản
                </CardTitle>
                <CardDescription className="text-slate-500 mt-1">
                  Quản lý tài khoản nhân viên
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense>
              <AccountTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
