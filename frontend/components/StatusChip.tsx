// components/StatusChip.tsx
import { Chip } from "@mui/material";

interface StatusChipProps {
  status: "queue" | "progress" | "completed";
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  className,
}) => {
  const statusConfig = {
    queue: {
      label: "In Queue",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      muiColor: "warning" as const,
    },
    progress: {
      label: "In Progress",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      muiColor: "info" as const,
    },
    completed: {
      label: "Completed",
      color: "bg-green-100 text-green-800 border-green-200",
      muiColor: "success" as const,
    },
  };

  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      color={config.muiColor}
      variant="outlined"
      size="small"
      className={className}
    />
  );
};
