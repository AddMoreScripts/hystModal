/* eslint-disable no-param-reassign */
import { clearBodyLocks, lock } from 'tua-body-scroll-lock';
import './hystmodal.css';

class HystModal {
  /** If true - Stops the modal from opening */
  stopTrigger = false;

  openedModals: HystModalInstance[] = [];

  isBodyLocked: boolean = false;

  private isBusy: boolean = false;

  config: HystModalConfig = {
    linkAttributeName: 'data-hystmodal',
    closeOnEsc: true,
    closeOnOverlay: true,
    closeOnButton: true,
    catchFocus: true,
    isStacked: false,
    backscroll: true,
    waitTransitions: false,
    fixedSelectors: [
      '[data-hystfixed]',
    ],
  };

  private focusElements: string[] = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
    'select:not([disabled]):not([aria-hidden])',
    'textarea:not([disabled]):not([aria-hidden])',
    'button:not([disabled]):not([aria-hidden])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex^="-"])',
  ];

  constructor(props: HystModalConfig) {
    this.config = Object.assign(this.config, props);
    this.eventsFeeler();
  }

  /**
   * @deprecated since version 1.0.0
   */
  init() { return this; }

  private eventsFeeler() {
    let isOverlayCheker = false;
    document.addEventListener('click', (e) => {
      const eventTarget = e.target as HTMLElement;
      const starterElement: HTMLElement | null = eventTarget.closest(`[${this.config.linkAttributeName}]`);

      if (starterElement && !this.isBusy) {
        this.isBusy = true;
        e.preventDefault();
        const attr = this.config.linkAttributeName;
        const selectorName = attr ? starterElement.getAttribute(attr) : null;
        if (selectorName) this.open(selectorName, starterElement.hasAttribute('data-stacked'), starterElement);
        return;
      }

      const terminator = eventTarget.closest('[data-hystclose]');
      if (this.config.closeOnButton && terminator && !this.isBusy) {
        this.isBusy = true;
        e.preventDefault();
        const modalEl = eventTarget.closest<HTMLElement>('.hystmodal');
        if (modalEl) this.close(modalEl);
        return;
      }

      const bg = eventTarget.classList.contains('hystmodal') || eventTarget.classList.contains('hystmodal__wrap');
      if (bg && isOverlayCheker && !this.isBusy) {
        this.isBusy = true;
        e.preventDefault();
        const modalEl = eventTarget.closest<HTMLElement>('.hystmodal');
        if (modalEl) this.close(modalEl);
      }
    });

    document.addEventListener('mousedown', ({ target }) => {
      isOverlayCheker = false;
      if (!this.config.closeOnOverlay) return;
      if (!(target instanceof HTMLElement)) return;
      const isTargetValid = target.classList.contains('hystmodal') || target.classList.contains('hystmodal__wrap');
      if (!isTargetValid) return;
      isOverlayCheker = true;
    });

    window.addEventListener('keydown', (e) => {
      if (this.config.closeOnEsc && e.key === 'Escape' && this.openedModals.length && !this.isBusy) {
        e.preventDefault();
        this.isBusy = true;
        this.closeObj(this.openedModals.pop()).then(() => { this.isBusy = false; });
        return;
      }
      if (this.config.catchFocus && e.key === 'Tab' && this.openedModals.length) {
        this.focusCatcher(e);
      }
    });
  }

  private async openObj(modal: HystModalInstance, isStack: boolean = false) {
    if (this.config.beforeOpen) this.config.beforeOpen(modal, this);
    if (this.stopTrigger) {
      this.stopTrigger = false;
      return;
    }
    if (this.config.isStacked || isStack) {
      const needClose = this.openedModals.filter((m) => m.element === modal.element);
      await Promise.all(needClose.map(async (m) => {
        await this.closeObj(m, false, true, false);
      }));
    } else {
      await this.closeAll();
      this.openedModals = [];
    }
    if (!this.isBodyLocked) this.bodyScrollControl(modal, 'opening');
    const windowEl = modal.element.querySelector('.hystmodal__window');
    if (!windowEl) {
      console.error('Warning: selector .hystmodal__window not found in modal window');
      this.isBusy = false;
      return;
    }
    this.openedModals.push(modal);
    modal.element.classList.add('hystmodal--animated');
    modal.element.classList.add('hystmodal--active');
    modal.element.style.zIndex = modal.zIndex.toString();
    modal.element.setAttribute('aria-hidden', 'false');
    const speed = getComputedStyle(modal.element).getPropertyValue('--hystmodal-speed');
    this.focusIn(modal.element);
    setTimeout(() => {
      modal.element.classList.remove('hystmodal--animated');
      this.isBusy = false;
    }, HystModal.cssParseSpeed(speed));
  }

  /**
   * @argument selectorName CSS string of selector, ID recomended
   * @argument isStack Whether the modal window should open above the previous one and not close it
   * @argument starter Optional - Manually set the starter element of the modal
  * */
  async open(
    selectorName: string,
    isStack: boolean | undefined = this.config.isStacked,
    starter: HTMLElement | null = null,
  ): Promise<HystModalInstance | void> {
    const activeModal = this.getActiveModal();
    const target: HTMLElement | null = selectorName ? document.querySelector(selectorName) : null;
    if (!target) {
      console.error('Warning: selector .hystmodal__window not found in modal window');
      this.isBusy = false;
      return;
    }
    const zIndex = getComputedStyle(target).getPropertyValue('--hystmodal-zindex');
    const newModal: HystModalInstance = {
      element: target,
      openedWindow: target,
      starter,
      zIndex: activeModal ? activeModal.zIndex + this.openedModals.length : parseInt(zIndex, 10),
      config: this.config,
      isOpened: false,
    };
    await this.openObj(newModal, isStack);
    this.isBusy = false;
  }

  private closeObj(
    modal: HystModalInstance | undefined,
    isUnlock: boolean = false,
    isForceImmediately: boolean = false,
    isFocusBack: boolean = true,
  ): Promise<any> {
    return new Promise((resolve) => {
      if (!modal) return;
      if (this.config.waitTransitions && !isForceImmediately) {
        modal.element.classList.add('hystmodal--animated');
        modal.element.classList.add('hystmodal--moved');
      }
      modal.element.classList.remove('hystmodal--active');
      const speed = getComputedStyle(modal.element).getPropertyValue('--hystmodal-speed');
      modal.element.setAttribute('aria-hidden', 'false');
      this.openedModals = this.openedModals.filter((m) => m.element !== modal.element);
      setTimeout(() => {
        modal.element.classList.remove('hystmodal--animated');
        modal.element.classList.remove('hystmodal--moved');
        modal.element.style.zIndex = '';
        if (this.config.backscroll && !this.openedModals.length && isUnlock) {
          clearBodyLocks();
          this.bodyScrollControl(modal, 'closing');
          this.isBodyLocked = false;
        }
        if (this.config.catchFocus && modal.starter && isFocusBack) modal.starter.focus();
        if (this.config.afterClose) this.config.afterClose(modal, this);
        resolve(modal);
      }, this.config.waitTransitions && !isForceImmediately ? HystModal.cssParseSpeed(speed) : 0);
    });
  }

  /**
   * @argument modalElem The CSS string of the modal element selector. If not passed,
   * all open modal windows will close.
  * */
  async close(modalElem: HTMLElement | null = null): Promise<HystModalInstance | null> {
    if (!modalElem) {
      const list = await this.closeAll();
      return list.length ? list[list.length - 1] : null;
    }
    const needModalObject = this.openedModals.find((elem) => elem.element === modalElem);
    if (!needModalObject) return null;
    await this.closeObj(needModalObject, true);
    this.isBusy = false;
    return needModalObject;
  }

  async closeAll(): Promise<HystModalInstance[]> {
    const list: HystModalInstance[] = [];
    await Promise.all(this.openedModals.map(async (modal) => {
      await this.closeObj(modal, true);
      list.push(modal);
    }));
    this.openedModals = [];
    this.isBusy = false;
    return list;
  }

  private focusIn(modalEl: HTMLElement) {
    if (!this.openedModals.length) return;
    const nodes: HTMLElement[] = Array.from(modalEl.querySelectorAll(this.focusElements.join(', ')));
    if (nodes.length) nodes[0].focus();
  }

  private focusCatcher(e: KeyboardEvent) {
    const activeWindow = this.openedModals[this.openedModals.length - 1];
    const nodes: HTMLElement[] = Array.from(activeWindow.element.querySelectorAll(this.focusElements.join(', ')));
    if (!activeWindow.element.contains(document.activeElement)) {
      nodes[0].focus();
      e.preventDefault();
    } else {
      if (!document.activeElement) return;
      const focusedItemIndex = nodes.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && focusedItemIndex === 0) {
        nodes[nodes.length - 1].focus();
        e.preventDefault();
      }
      if (!e.shiftKey && focusedItemIndex === nodes.length - 1) {
        nodes[0].focus();
        e.preventDefault();
      }
    }
  }

  static cssParseSpeed(speed: string): number {
    const num = parseFloat(speed);
    const units = speed.match(/m?s/);
    const unit: string | null = units ? units[0] : null;
    let milliseconds: number = 0;
    switch (unit) {
      case 's':
        milliseconds = num * 1000;
        break;
      case 'ms':
        milliseconds = num;
        break;
      default:
        break;
    }
    return milliseconds;
  }

  private getActiveModal(): HystModalInstance | null {
    if (!this.openedModals.length) return null;
    return this.openedModals[this.openedModals.length - 1];
  }

  private bodyScrollControl(modal: HystModalInstance, state: 'opening' | 'closing') {
    const fixedSelectors: HTMLElement[] = Array.from(this.config.fixedSelectors ? document.querySelectorAll(this.config.fixedSelectors.join(', ')) : []);
    if (state === 'closing') {
      if (this.openedModals.length) return;
      fixedSelectors.forEach((el) => {
        el.style.marginRight = '';
      });
      document.documentElement.classList.remove('hystmodal__opened');
      return;
    }
    if (this.config.backscroll && !this.isBodyLocked) {
      lock(modal.element);
      this.isBodyLocked = true;
    }
    const marginSize = parseFloat(document.body.style.paddingRight);
    if (marginSize) {
      fixedSelectors.forEach((el) => {
        el.style.marginRight = `${parseInt(getComputedStyle(el).marginRight, 10) + marginSize}px`;
      });
    }
    document.documentElement.classList.add('hystmodal__opened');
  }
}

interface HystModalInstance {
  element: HTMLElement,
  zIndex: number,
  starter: HTMLElement | null,
  config: HystModalConfig,
  /** @deprecated use HystModal.openedModals property to list of opened modals */
  isOpened: boolean,
  /** @deprecated use "element" property instead */
  openedWindow: HTMLElement,
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
  beforeOpen?: (modalWindow: HystModalInstance, instance: HystModal) => boolean | void;
  afterClose?: (modalWindow: HystModalInstance, instance: HystModal) => boolean | void;
  isStacked?: boolean;
}

export type { HystModalInstance, HystModalConfig };
export default HystModal;
