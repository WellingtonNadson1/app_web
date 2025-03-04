'use client';

import { ChartLineUp } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

type CultoData = {
  nome: string;
  data: string;
  presentes: number;
  capacidade: number;
  comparativo: number; // porcentagem em relação ao culto anterior do mesmo tipo
};

type CultoTipo = 'edificacao' | 'cpd' | 'celebracao-manha' | 'celebracao-tarde';

type AttendanceCardProps = {
  cultos: Record<CultoTipo, CultoData[]>;
  isLoading?: boolean;
};

export function AttendanceCard({
  cultos,
  isLoading = false,
}: AttendanceCardProps) {
  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Frequência últimos cultos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[120px] items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (comparativo: number) => {
    if (comparativo > 0) {
      return <ArrowUp className="h-4 w-4 text-emerald-500" />;
    } else if (comparativo < 0) {
      return <ArrowDown className="h-4 w-4 text-destructive" />;
    }
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getPercentageText = (comparativo: number) => {
    if (comparativo === 0) return '0%';
    return `${comparativo > 0 ? '+' : ''}${comparativo}%`;
  };

  const getOcupacaoColor = (percentual: number) => {
    if (percentual >= 90) return 'bg-emerald-500';
    if (percentual >= 70) return 'bg-amber-500';
    return 'bg-destructive';
  };

  const renderCultoContent = (tipo: CultoTipo, titulo: string) => {
    const cultosList = cultos[tipo] || [];
    const ultimoCulto = cultosList.length > 0 ? cultosList[0] : null;
    const penultimoCulto = cultosList.length > 0 ? cultosList[1] : null;

    if (!ultimoCulto) {
      return (
        <div className="flex h-[120px] items-center justify-center">
          <p className="text-sm text-muted-foreground">Sem dados disponíveis</p>
        </div>
      );
    }

    if (!penultimoCulto) {
      return (
        <div className="flex h-[120px] items-center justify-center">
          <p className="text-sm text-muted-foreground">Sem dados disponíveis</p>
        </div>
      );
    }

    const ocupacaoPercentual = Math.round(
      (ultimoCulto.presentes / ultimoCulto.capacidade) * 100,
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{ultimoCulto.presentes}</p>
            <p className="text-xs text-muted-foreground">
              presentes em {ultimoCulto.data}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {getTrendIcon(penultimoCulto.comparativo)}
            <span
              className={cn(
                'text-xs font-medium',
                penultimoCulto.comparativo > 0
                  ? 'text-emerald-500'
                  : penultimoCulto.comparativo < 0
                    ? 'text-destructive'
                    : 'text-muted-foreground',
              )}
            >
              {getPercentageText(penultimoCulto.comparativo)}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span>Presença</span>
            <span>{ocupacaoPercentual}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary">
            <div
              className={cn(
                'h-2 rounded-full',
                getOcupacaoColor(ocupacaoPercentual),
              )}
              style={{ width: `${ocupacaoPercentual}%` }}
            />
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="cursor-help">
                Total de Membros: {ultimoCulto.capacidade}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Membros totais da Ibb</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Frequência últimos cultos
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
            <ChartLineUp
              className="h-4 w-4 text-primary-foreground"
              weight="bold"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="edificacao">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="edificacao">Edificação</TabsTrigger>
            <TabsTrigger value="cpd">CPD</TabsTrigger>
          </TabsList>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="celebracao-manha">Celebração Manhã</TabsTrigger>
            <TabsTrigger value="celebracao-tarde">Celebração Tarde</TabsTrigger>
          </TabsList>

          <TabsContent value="edificacao" className="mt-4">
            {renderCultoContent('edificacao', 'Culto de Edificação')}
          </TabsContent>

          <TabsContent value="cpd" className="mt-4">
            {renderCultoContent('cpd', 'CPD')}
          </TabsContent>

          <TabsContent value="celebracao-manha" className="mt-4">
            {renderCultoContent('celebracao-manha', 'Celebração Manhã')}
          </TabsContent>

          <TabsContent value="celebracao-tarde" className="mt-4">
            {renderCultoContent('celebracao-tarde', 'Celebração Tarde')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
