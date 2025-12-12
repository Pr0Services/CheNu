export type SphereStatus = "active" | "dormant" | "archived";

export type SphereRuntime = {
  id: string;
  status: SphereStatus;
};
