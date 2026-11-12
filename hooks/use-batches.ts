import { useState, useEffect } from "react";
import { ReviewBatch } from "@/lib/types";
import { batchService } from "@/lib/services/batch-service";

export function useBatches(filters?: Parameters<typeof batchService.listBatches>[0]) {
  const [batches, setBatches] = useState<ReviewBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchBatches() {
      try {
        setLoading(true);
        const data = await batchService.listBatches(filters);
        if (mounted) {
          setBatches(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch batches"));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchBatches();

    return () => {
      mounted = false;
    };
  }, [JSON.stringify(filters)]);

  return { batches, loading, error };
}
