import { Card, CardContent } from "@/components/ui/card";
import MenuOrder from "./menu-order";
import { Button } from "@/components/ui/button";
import { ChefHat, Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function MenuPage() {
  return (
    <div className="max-w-md mx-auto space-y-4 pb-20 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen p-4">
      <div className="sticky top-0 z-10 bg-white shadow-md rounded-lg p-4 border border-orange-100">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-orange-800 flex items-center">
            <ChefHat className="h-5 w-5 mr-2 text-orange-500" />
            Menu Quán
          </h1>
          <Badge
            variant="outline"
            className="bg-orange-100 text-orange-700 border-orange-200"
          >
            <Clock className="h-3 w-3 mr-1" /> Mở cửa
          </Badge>
        </div>
        <div className="text-sm text-gray-500 flex items-center">
          <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
          <span>4.8</span>
          <span className="mx-2">•</span>
          <span>Phục vụ nhanh 15-20 phút</span>
        </div>
      </div>
      <MenuOrder />
    </div>
  );
}
