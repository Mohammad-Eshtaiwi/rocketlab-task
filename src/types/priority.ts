export const priority = ["low", "medium", "high"] as const;
export type Priority = (typeof priority)[number];
