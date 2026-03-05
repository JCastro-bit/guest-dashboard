import { useState, useCallback, useEffect } from "react"

type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string }

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  immediate = true
) {
  const [state, setState] = useState<AsyncState<T>>({ status: "idle" })

  const execute = useCallback(async () => {
    setState({ status: "loading" })
    try {
      const data = await asyncFn()
      setState({ status: "success", data })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar los datos"
      setState({ status: "error", error: message })
    }
  }, [asyncFn])

  useEffect(() => {
    if (immediate) execute()
  }, [execute, immediate])

  return { ...state, execute }
}
