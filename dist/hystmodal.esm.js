var h = Object.defineProperty;
var u = (c, e, t) => e in c ? h(c, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : c[e] = t;
var a = (c, e, t) => (u(c, typeof e != "symbol" ? e + "" : e, t), t);
import { clearBodyLocks as f, lock as m } from "tua-body-scroll-lock";
class r {
  constructor(e) {
    /** If true - Stops the modal from opening */
    a(this, "stopTrigger", !1);
    a(this, "openedModals", []);
    a(this, "isBodyLocked", !1);
    a(this, "isBusy", !1);
    a(this, "config", {
      linkAttributeName: "data-hystmodal",
      closeOnEsc: !0,
      closeOnOverlay: !0,
      closeOnButton: !0,
      catchFocus: !0,
      isStacked: !1,
      backscroll: !0,
      waitTransitions: !1,
      fixedSelectors: [
        "[data-hystfixed]"
      ]
    });
    a(this, "focusElements", [
      "a[href]",
      "area[href]",
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      "select:not([disabled]):not([aria-hidden])",
      "textarea:not([disabled]):not([aria-hidden])",
      "button:not([disabled]):not([aria-hidden])",
      "iframe",
      "object",
      "embed",
      "[contenteditable]",
      '[tabindex]:not([tabindex^="-"])'
    ]);
    this.config = Object.assign(this.config, e), this.eventsFeeler();
  }
  /**
   * @deprecated since version 1.0.0
   */
  init() {
    return this;
  }
  eventsFeeler() {
    let e = !1;
    document.addEventListener("click", (t) => {
      const s = t.target, n = s.closest(`[${this.config.linkAttributeName}]`);
      if (n && !this.isBusy) {
        this.isBusy = !0, t.preventDefault();
        const o = this.config.linkAttributeName, d = o ? n.getAttribute(o) : null;
        d && this.open(d, n.hasAttribute("data-stacked"), n);
        return;
      }
      const i = s.closest("[data-hystclose]");
      if (this.config.closeOnButton && i && !this.isBusy) {
        this.isBusy = !0, t.preventDefault();
        const o = s.closest(".hystmodal");
        o && this.close(o);
        return;
      }
      if ((s.classList.contains("hystmodal") || s.classList.contains("hystmodal__wrap")) && e && !this.isBusy) {
        this.isBusy = !0, t.preventDefault();
        const o = s.closest(".hystmodal");
        o && this.close(o);
      }
    }), document.addEventListener("mousedown", ({ target: t }) => {
      e = !1, !(!this.config.closeOnOverlay || !(t instanceof HTMLElement) || !(t.classList.contains("hystmodal") || t.classList.contains("hystmodal__wrap"))) && (e = !0);
    }), window.addEventListener("keydown", (t) => {
      if (this.config.closeOnEsc && t.key === "Escape" && this.openedModals.length && !this.isBusy) {
        t.preventDefault(), this.isBusy = !0, this.closeObj(this.openedModals.pop()).then(() => {
          this.isBusy = !1;
        });
        return;
      }
      this.config.catchFocus && t.key === "Tab" && this.openedModals.length && this.focusCatcher(t);
    });
  }
  async openObj(e, t = !1) {
    if (this.config.beforeOpen && this.config.beforeOpen(e, this), this.stopTrigger) {
      this.stopTrigger = !1;
      return;
    }
    if (this.config.isStacked || t) {
      const i = this.openedModals.filter((l) => l.element === e.element);
      await Promise.all(i.map(async (l) => {
        await this.closeObj(l, !1, !0, !1);
      }));
    } else
      await this.closeAll(), this.openedModals = [];
    if (this.isBodyLocked || this.bodyScrollControl(e, "opening"), !e.element.querySelector(".hystmodal__window")) {
      console.error("Warning: selector .hystmodal__window not found in modal window"), this.isBusy = !1;
      return;
    }
    this.openedModals.push(e), e.element.classList.add("hystmodal--animated"), e.element.classList.add("hystmodal--active"), e.element.style.zIndex = e.zIndex.toString(), e.element.setAttribute("aria-hidden", "false");
    const n = getComputedStyle(e.element).getPropertyValue("--hystmodal-speed");
    this.focusIn(e.element), setTimeout(() => {
      e.element.classList.remove("hystmodal--animated"), this.isBusy = !1;
    }, r.cssParseSpeed(n));
  }
  /**
   * @argument selectorName CSS string of selector, ID recomended
   * @argument isStack Whether the modal window should open above the previous one and not close it
   * @argument starter Optional - Manually set the starter element of the modal
  * */
  async open(e, t = this.config.isStacked, s = null) {
    const n = this.getActiveModal(), i = e ? document.querySelector(e) : null;
    if (!i) {
      console.error("Warning: selector .hystmodal__window not found in modal window"), this.isBusy = !1;
      return;
    }
    const l = getComputedStyle(i).getPropertyValue("--hystmodal-zindex"), o = {
      element: i,
      openedWindow: i,
      starter: s,
      zIndex: n ? n.zIndex + this.openedModals.length : parseInt(l, 10),
      config: this.config,
      isOpened: !1
    };
    await this.openObj(o, t), this.isBusy = !1;
  }
  closeObj(e, t = !1, s = !1, n = !0) {
    return new Promise((i) => {
      if (!e)
        return;
      this.config.waitTransitions && !s && (e.element.classList.add("hystmodal--animated"), e.element.classList.add("hystmodal--moved")), e.element.classList.remove("hystmodal--active");
      const l = getComputedStyle(e.element).getPropertyValue("--hystmodal-speed");
      e.element.setAttribute("aria-hidden", "false"), this.openedModals = this.openedModals.filter((o) => o.element !== e.element), setTimeout(() => {
        e.element.classList.remove("hystmodal--animated"), e.element.classList.remove("hystmodal--moved"), e.element.style.zIndex = "", this.config.backscroll && !this.openedModals.length && t && (f(), this.bodyScrollControl(e, "closing"), this.isBodyLocked = !1), this.config.catchFocus && e.starter && n && e.starter.focus(), this.config.afterClose && this.config.afterClose(e, this), i(e);
      }, this.config.waitTransitions && !s ? r.cssParseSpeed(l) : 0);
    });
  }
  /**
   * @argument modalElem The CSS string of the modal element selector. If not passed,
   * all open modal windows will close.
  * */
  async close(e = null) {
    if (!e) {
      const s = await this.closeAll();
      return s.length ? s[s.length - 1] : null;
    }
    const t = this.openedModals.find((s) => s.element === e);
    return t ? (await this.closeObj(t, !0), this.isBusy = !1, t) : null;
  }
  async closeAll() {
    const e = [];
    return await Promise.all(this.openedModals.map(async (t) => {
      await this.closeObj(t, !0), e.push(t);
    })), this.openedModals = [], this.isBusy = !1, e;
  }
  focusIn(e) {
    if (!this.openedModals.length)
      return;
    const t = Array.from(e.querySelectorAll(this.focusElements.join(", ")));
    t.length && t[0].focus();
  }
  focusCatcher(e) {
    const t = this.openedModals[this.openedModals.length - 1], s = Array.from(t.element.querySelectorAll(this.focusElements.join(", ")));
    if (!t.element.contains(document.activeElement))
      s[0].focus(), e.preventDefault();
    else {
      if (!document.activeElement)
        return;
      const n = s.indexOf(document.activeElement);
      e.shiftKey && n === 0 && (s[s.length - 1].focus(), e.preventDefault()), !e.shiftKey && n === s.length - 1 && (s[0].focus(), e.preventDefault());
    }
  }
  static cssParseSpeed(e) {
    const t = parseFloat(e), s = e.match(/m?s/), n = s ? s[0] : null;
    let i = 0;
    switch (n) {
      case "s":
        i = t * 1e3;
        break;
      case "ms":
        i = t;
        break;
    }
    return i;
  }
  getActiveModal() {
    return this.openedModals.length ? this.openedModals[this.openedModals.length - 1] : null;
  }
  bodyScrollControl(e, t) {
    const s = Array.from(this.config.fixedSelectors ? document.querySelectorAll(this.config.fixedSelectors.join(", ")) : []);
    if (t === "closing") {
      if (this.openedModals.length)
        return;
      s.forEach((i) => {
        i.style.marginRight = "";
      }), document.documentElement.classList.remove("hystmodal__opened");
      return;
    }
    this.config.backscroll && !this.isBodyLocked && (m(e.element), this.isBodyLocked = !0);
    const n = parseFloat(document.body.style.paddingRight);
    n && s.forEach((i) => {
      i.style.marginRight = `${parseInt(getComputedStyle(i).marginRight, 10) + n}px`;
    }), document.documentElement.classList.add("hystmodal__opened");
  }
}
export {
  r as default
};
