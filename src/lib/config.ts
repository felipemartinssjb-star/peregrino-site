const baseUrl = ((import.meta.env["VITE_TRAY_BASE_URL"] as string | undefined) ?? "").replace(
  /\/+$/,
  "",
);
const lojaId = (import.meta.env["VITE_TRAY_LOJA_ID"] as string | undefined) ?? "";

export const TRAY_BASE_URL = baseUrl;
export const TRAY_LOJA_ID = lojaId;

export const trayConfigurado = baseUrl !== "" && lojaId !== "";
