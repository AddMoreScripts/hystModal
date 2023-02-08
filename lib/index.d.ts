interface HystModalInstance {
  element: HTMLElement,
  zIndex: number,
  starter: HTMLElement | null,
  isLocked: boolean,
}
interface HystModalConfig {
  linkAttributeName?: string;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  closeOnButton?: boolean;
  waitTransitions?: boolean;
  catchFocus?: boolean;
  fixedSelectors?: string[];
  backscroll?: boolean;
  beforeOpen?: CallableFunction;
  afterClose?: CallableFunction;
  isStacked?: boolean;
}
export { HystModalInstance, HystModalConfig };
