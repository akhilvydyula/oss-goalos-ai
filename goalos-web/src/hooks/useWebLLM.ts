"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type WebLLMStatus,
  checkWebGPUSupport,
  formatWebLLMError,
  generateCoachReplyWithWebLLM,
  getLoadedWebLLMModelId,
  loadWebLLMEngine,
  resetWebLLMEngine,
} from "@/lib/web-llm-coach";

export function useWebLLM(active: boolean) {
  const [status, setStatus] = useState<WebLLMStatus>("checking");
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadedModel, setLoadedModel] = useState<string | null>(null);
  const loadPromiseRef = useRef<Promise<void> | null>(null);
  const supportedRef = useRef(false);
  const statusRef = useRef<WebLLMStatus>("checking");
  const checkPromiseRef = useRef<Promise<void> | null>(null);

  const setStatusSafe = useCallback((next: WebLLMStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  useEffect(() => {
    if (!active) return;
    if (checkPromiseRef.current) return;

    checkPromiseRef.current = checkWebGPUSupport().then((ok) => {
      supportedRef.current = ok;
      if (ok) {
        setStatusSafe("idle");
      } else {
        setStatusSafe("unsupported");
        setError(
          "WebGPU not available. Use Chrome or Edge on desktop (Brave: enable WebGPU in brave://flags)."
        );
      }
    });

    return () => {
      checkPromiseRef.current = null;
    };
  }, [active, setStatusSafe]);

  const loadModel = useCallback(async () => {
    if (checkPromiseRef.current) {
      await checkPromiseRef.current;
    }
    if (!supportedRef.current) {
      setStatusSafe("unsupported");
      return;
    }
    if (statusRef.current === "ready") return;

    if (loadPromiseRef.current) {
      await loadPromiseRef.current;
      return;
    }

    if (statusRef.current === "error") {
      resetWebLLMEngine();
    }

    const loadTask = (async () => {
      setStatusSafe("loading");
      setError(null);
      setProgress(0);
      setProgressText("Starting…");

      try {
        await loadWebLLMEngine((p, text) => {
          setProgress(Math.round(p * 100));
          setProgressText(text);
        });
        const modelId = getLoadedWebLLMModelId();
        setLoadedModel(modelId);
        setStatusSafe("ready");
        setProgress(100);
        setProgressText("");
      } catch (err) {
        resetWebLLMEngine();
        setLoadedModel(null);
        setStatusSafe("error");
        setError(formatWebLLMError(err));
        throw err;
      } finally {
        loadPromiseRef.current = null;
      }
    })();

    loadPromiseRef.current = loadTask;
    await loadTask;
  }, [setStatusSafe]);

  return {
    status,
    progress,
    progressText,
    error,
    loadedModel,
    loadModel,
    generateCoachReplyWithWebLLM,
    isSupported: status !== "unsupported" && status !== "checking",
    isChecking: status === "checking",
    isReady: status === "ready",
  };
}
