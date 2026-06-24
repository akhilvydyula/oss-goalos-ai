"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type WebLLMStatus,
  generateCoachReplyWithWebLLM,
  isWebGPUSupported,
  loadWebLLMEngine,
} from "@/lib/web-llm-coach";

export function useWebLLM(autoLoad = false) {
  const [status, setStatus] = useState<WebLLMStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const loadModel = useCallback(async () => {
    if (loadingRef.current || status === "ready") return;
    if (!isWebGPUSupported()) {
      setStatus("unsupported");
      setError("WebGPU not available. Use Chrome or Edge for browser AI.");
      return;
    }

    loadingRef.current = true;
    setStatus("loading");
    setError(null);
    setProgress(0);

    try {
      await loadWebLLMEngine((p, text) => {
        setProgress(Math.round(p * 100));
        setProgressText(text);
      });
      setStatus("ready");
      setProgress(100);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to load browser AI model");
    } finally {
      loadingRef.current = false;
    }
  }, [status]);

  useEffect(() => {
    if (autoLoad && status === "idle") {
      void loadModel();
    }
  }, [autoLoad, status, loadModel]);

  return {
    status,
    progress,
    progressText,
    error,
    loadModel,
    generateCoachReplyWithWebLLM,
    isSupported: isWebGPUSupported(),
  };
}
