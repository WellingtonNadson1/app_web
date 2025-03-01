import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { IconProps } from '@phosphor-icons/react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  previousLabel?: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  iconColor: string;
  trend?: 'up' | 'down' | 'neutral';
  percentage?: number;
}

export function StatCard({
  title,
  value,
  previousValue,
  previousLabel = 'anterior:',
  icon: Icon,
  iconColor,
  trend = 'neutral',
  percentage,
}: StatCardProps) {
  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex w-full items-center justify-between">
          <h3 className="font-sans text-sm font-semibold uppercase leading-normal text-gray-700">
            {title}
          </h3>
          <div className={`rounded-full ${iconColor} p-2 shadow-sm`}>
            <Icon weight="fill" size={20} color="#fff" />
          </div>
        </div>

        <div className="mt-3 flex items-center">
          <span className="text-xl font-bold text-gray-800">{value}</span>

          {percentage !== undefined && (
            <span
              className={cn('ml-2 text-sm font-medium', {
                'text-emerald-500': trend === 'up',
                'text-red-500': trend === 'down',
                'text-gray-500': trend === 'neutral',
              })}
            >
              {percentage.toFixed(1)}%{trend === 'up' && ' ↑'}
              {trend === 'down' && ' ↓'}
            </span>
          )}
        </div>

        {previousValue && (
          <div className="mt-1 flex items-center gap-1">
            <span className="text-xs font-medium text-gray-500">
              {previousLabel}
            </span>
            <span className="text-xs font-bold text-gray-700">
              {previousValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
