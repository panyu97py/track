export type Listener = (...args: any[]) => void

export interface EventNode {
  listener: (...args: any[]) => void;
  context?: any;
}
