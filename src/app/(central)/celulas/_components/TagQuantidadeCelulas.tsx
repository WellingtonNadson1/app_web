import { cn } from "@/lib/utils";

interface TagQuantidadeCelulasProps extends React.HTMLAttributes<HTMLDivElement> {
  cor?: string;
  nomeSupervisao: string;
  data: string;
}

export const TagQuantidadeCelulas: React.FC<TagQuantidadeCelulasProps> = ({ cor = 'yellow', nomeSupervisao, data, ...props }) => {
  return (
    <div className={cn(
      cor && `items-center justify-center px-2 py-1 text-xs font-medium text-center bg-yellow-100 text-yellow-600 ring-yellow-500 rounded-md ring-1 ring-inset md:block`,
      `bg-${cor}-100 text-${cor}-700 ring-${cor}-600/20`,
    )}>
      <p className="flex items-center justify-between">
        {nomeSupervisao}{" "}
        <span className={cn(`px-1 py-1 ml-2 text-white rounded-md bg-yellow-500`, `bg-${cor}-500`)}>
          {data}
        </span>
      </p>
    </div>
  )
}
