import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { AlertCircleIcon } from "lucide-react";

type Props = {
  refreshData: () => void;
};

export function DataRefreshReminder(props: Props) {
  return (
    <Alert variant="default">
      <AlertCircleIcon />
      <AlertTitle>Flight offers might have been expired!</AlertTitle>
      <AlertDescription>
        <p>Please, keep in mind: </p>
        <ul className="list-inside list-disc text-sm">
          <li>We refresh data every 5 minutes</li>
          <li>
            Click on the refresh button or refresh the page to get fresh data
          </li>
        </ul>
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="default" onClick={() => props.refreshData()}>
          Refresh
        </Button>
      </AlertAction>
    </Alert>
  );
}
