'use client';

import { HandsPraying, Confetti, ChartLineUp } from '@phosphor-icons/react';
import { useStatsData } from '@/hooks/use-stats-data';
import { StatCard } from '@/components/stat-card';
import { SkeletonCard } from '@/components/skeleton-card';

export default function StatsCard() {
  const { data, isLoading, calculateGrowthPercentage } = useStatsData();

  // Renderizar esqueletos durante o carregamento
  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 p-2 md:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  // Calcular tendências e porcentagens
  const mesGrowth = data
    ? calculateGrowthPercentage(
        data.almasGanhasNoMes,
        data.almasGanhasNoMesPassado,
      )
    : 0;
  const anoGrowth = data
    ? calculateGrowthPercentage(
        data.almasGanhasNoAno,
        data.almasGanhasNoAnoPassado,
      )
    : 0;

  const mesTrend = mesGrowth >= 100 ? 'up' : 'down';
  const anoTrend = anoGrowth >= 100 ? 'up' : 'down';

  return (
    <div className="grid w-full grid-cols-1 gap-4 p-2 md:grid-cols-3">
      {data && (
        <>
          <StatCard
            title="Conversões nas Células"
            value={`${data.almasGanhasNoMes} almas`}
            previousValue={`${data.almasGanhasNoMesPassado} almas`}
            previousLabel="mês passado:"
            icon={HandsPraying}
            iconColor="bg-primary"
            trend={mesTrend}
            percentage={mesGrowth}
          />

          <StatCard
            title="Conversões Células/Ano"
            value={`${data.almasGanhasNoAno} almas`}
            previousValue={`${data.almasGanhasNoAnoPassado} almas`}
            previousLabel="ano passado:"
            icon={Confetti}
            iconColor="bg-destructive"
            trend={anoTrend}
            percentage={anoGrowth}
          />

          <StatCard
            title="Frequência"
            value="Em breve"
            previousLabel="último culto:"
            previousValue="--"
            icon={ChartLineUp}
            iconColor="bg-emerald-500"
            trend="neutral"
          />
        </>
      )}
    </div>
  );
}
