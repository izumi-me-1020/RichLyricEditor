import { Button } from "@/ui/button";
import { IconAlertTriangle, IconHome2, IconRefresh } from "@tabler/icons-react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

// -- Constants -----------------------------------------------------------------

const LOG_PREFIX = "[Composer]";
const IS_DEV = import.meta.env.DEV;

// -- Helpers -------------------------------------------------------------------

interface ErrorDetails {
  title: string;
  subtitle: string;
  status?: number;
  stack?: string;
}

function describeError(error: unknown): ErrorDetails {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        title: "404",
        subtitle: "We couldn't find that page.",
        status: 404,
      };
    }
    return {
      title: `${error.status}`,
      subtitle: error.statusText || "The route returned an error response.",
      status: error.status,
    };
  }

  if (error instanceof Error) {
    return {
      title: "Something broke",
      subtitle: error.message || "An unexpected error occurred.",
      stack: error.stack,
    };
  }

  return {
    title: "Something broke",
    subtitle: "An unexpected error occurred while loading this view.",
  };
}

// -- Component -----------------------------------------------------------------

const ErrorFallback: React.FC = () => {
  const error = useRouteError();
  const details = describeError(error);

  if (IS_DEV) console.error(LOG_PREFIX, "route error", error);

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-composer-bg text-composer-text flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-md flex flex-col items-center text-center gap-5">
        <div className="w-16 h-16 rounded-full bg-composer-button flex items-center justify-center text-composer-accent">
          <IconAlertTriangle size={28} strokeWidth={1.75} />
        </div>

        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-semibold text-composer-text">{details.title}</h1>
          <p className="text-sm text-composer-text-secondary leading-relaxed select-text">{details.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Button variant="primary" hasIcon onClick={handleReload}>
            <IconRefresh size={16} />
            Reload
          </Button>
          <Button variant="secondary" hasIcon onClick={handleGoHome}>
            <IconHome2 size={16} />
            Go home
          </Button>
        </div>

        {IS_DEV && details.stack && (
          <details className="w-full mt-4 text-left">
            <summary className="text-xs text-composer-text-muted cursor-pointer hover:text-composer-text transition-colors">
              Stack trace
            </summary>
            <pre className="mt-2 p-3 rounded-md bg-composer-button text-[11px] leading-relaxed text-composer-text-muted overflow-auto max-h-72 select-text">
              {details.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

// -- Exports -------------------------------------------------------------------

export { ErrorFallback };
export default ErrorFallback;
