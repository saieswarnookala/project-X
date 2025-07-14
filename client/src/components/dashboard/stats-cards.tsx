import { Handshake, FileText, CheckCircle, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Active Transactions",
      value: stats.activeTransactions,
      icon: Handshake,
      color: "bg-primary",
      trend: { value: "12%", direction: "up" as const },
      description: "from last month"
    },
    {
      title: "Pending Documents",
      value: stats.pendingDocuments,
      icon: FileText,
      color: "bg-warning",
      trend: { value: "2", direction: "neutral" as const },
      description: "due today"
    },
    {
      title: "This Month Closings",
      value: stats.monthlyClosings,
      icon: CheckCircle,
      color: "bg-secondary",
      trend: { value: "8%", direction: "up" as const },
      description: "from last month"
    },
    {
      title: "Avg. Close Time",
      value: stats.averageCloseTime,
      icon: Clock,
      color: "bg-accent",
      suffix: "days",
      trend: { value: "3 days", direction: "down" as const },
      description: "faster"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-text">{card.value}</p>
                    {card.suffix && (
                      <p className="text-sm text-gray-500 ml-1">{card.suffix}</p>
                    )}
                  </div>
                </div>
                <div className={`w-12 h-12 ${card.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                  <Icon className={`${card.color.replace('bg-', 'text-')} text-xl`} size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {card.trend.direction === "up" && (
                  <TrendingUp className="text-secondary mr-1" size={16} />
                )}
                {card.trend.direction === "down" && (
                  <TrendingDown className="text-secondary mr-1" size={16} />
                )}
                <span className={`text-sm ${card.trend.direction === "neutral" ? "text-warning" : "text-secondary"}`}>
                  {card.trend.direction === "neutral" ? <Clock className="inline mr-1" size={12} /> : null}
                  {card.trend.value} {card.description}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
