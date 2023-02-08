var A = Object.defineProperty;
var B = (i, e, t) => e in i ? A(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var a = (i, e, t) => (B(i, typeof e != "symbol" ? e + "" : e, t), t);
/**
 * tua-body-scroll-lock v1.2.1
 * (c) 2021 Evinma, BuptStEve
 * @license MIT
 */
var u = function() {
  return typeof window > "u";
}, y = function(e) {
  e = e || navigator.userAgent;
  var t = /(iPad).*OS\s([\d_]+)/.test(e), s = !t && /(iPhone\sOS)\s([\d_]+)/.test(e), n = /(Android);?[\s/]+([\d.]+)?/.test(e), o = s || t;
  return {
    ios: o,
    android: n
  };
};
function T(i) {
  if (u())
    return !1;
  if (!i)
    throw new Error("options must be provided");
  var e = !1, t = {
    get passive() {
      e = !0;
    }
  }, s = function() {
  }, n = "__TUA_BSL_TEST_PASSIVE__";
  window.addEventListener(n, s, t), window.removeEventListener(n, s, t);
  var o = i.capture;
  return e ? i : typeof o < "u" ? o : !1;
}
var p = 0, b = 0, w = 0, v = null, d = !1, c = [], S = T({
  passive: !1
}), _ = !u() && "scrollBehavior" in document.documentElement.style, x = function() {
  var e = document.body, t = Object.assign({}, e.style), s = window.innerWidth - e.clientWidth;
  return e.style.overflow = "hidden", e.style.boxSizing = "border-box", e.style.paddingRight = "".concat(s, "px"), function() {
    ["overflow", "boxSizing", "paddingRight"].forEach(function(n) {
      e.style[n] = t[n] || "";
    });
  };
}, j = function() {
  var e = document.documentElement, t = document.body, s = e.scrollTop || t.scrollTop, n = Object.assign({}, e.style), o = Object.assign({}, t.style);
  return e.style.height = "100%", e.style.overflow = "hidden", t.style.top = "-".concat(s, "px"), t.style.width = "100%", t.style.height = "auto", t.style.position = "fixed", t.style.overflow = "hidden", function() {
    e.style.height = n.height || "", e.style.overflow = n.overflow || "", ["top", "width", "height", "overflow", "position"].forEach(function(r) {
      t.style[r] = o[r] || "";
    }), _ ? window.scrollTo({
      top: s,
      // @ts-ignore
      behavior: "instant"
    }) : window.scrollTo(0, s);
  };
}, m = function(e) {
  e.cancelable && e.preventDefault();
}, C = function(e, t) {
  if (t) {
    var s = t.scrollTop, n = t.scrollLeft, o = t.scrollWidth, r = t.scrollHeight, l = t.clientWidth, L = t.clientHeight, h = e.targetTouches[0].clientX - w, f = e.targetTouches[0].clientY - b, g = Math.abs(f) > Math.abs(h), k = f > 0 && s === 0, O = h > 0 && n === 0, M = h < 0 && n + l + 1 >= o, E = f < 0 && s + L + 1 >= r;
    if (g && (k || E) || !g && (O || M))
      return m(e);
  }
  return e.stopPropagation(), !0;
}, I = function(e) {
  e || e !== null && process.env.NODE_ENV !== "production" && console.warn("If scrolling is also required in the floating layer, the target element must be provided.");
}, P = function(e) {
  if (!u()) {
    if (I(e), y().ios) {
      if (e) {
        var t = Array.isArray(e) ? e : [e];
        t.forEach(function(s) {
          s && c.indexOf(s) === -1 && (s.ontouchstart = function(n) {
            b = n.targetTouches[0].clientY, w = n.targetTouches[0].clientX;
          }, s.ontouchmove = function(n) {
            n.targetTouches.length === 1 && C(n, s);
          }, c.push(s));
        });
      }
      d || (document.addEventListener("touchmove", m, S), d = !0);
    } else
      p <= 0 && (v = y().android ? j() : x());
    p += 1;
  }
}, z = function() {
  if (!u()) {
    if (p = 0, !y().ios && typeof v == "function") {
      v();
      return;
    }
    if (c.length)
      for (var e = c.pop(); e; )
        e.ontouchmove = null, e.ontouchstart = null, e = c.pop();
    d && (document.removeEventListener("touchmove", m, S), d = !1);
  }
};
class H {
  constructor(e) {
    a(this, "isInited", !1);
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
    a(this, "_focusElements", [
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
  eventsFeeler() {
    let e = !1;
    document.addEventListener("click", (t) => {
      const s = t.target, n = s.closest(`[${this.config.linkAttributeName}]`);
      if (n && !this.isBusy) {
        this.isBusy = !0;
        const l = this.config.linkAttributeName ? n.getAttribute(this.config.linkAttributeName) : null;
        l && this.open(l, n.hasAttribute("data-stacked"), n);
        return;
      }
      if (s.closest("[data-hystclose]") && !this.isBusy) {
        this.isBusy = !0;
        const l = s.closest(".hystmodal");
        l && this.close(l);
        return;
      }
      if ((s.classList.contains("hystmodal") || s.classList.contains("hystmodal__wrap")) && e && !this.isBusy) {
        this.isBusy = !0;
        const l = s.closest(".hystmodal");
        l && this.close(l);
        return;
      }
    }), document.addEventListener("mousedown", ({ target: t }) => {
      e = !1, !(!(t instanceof HTMLElement) || !(t.classList.contains("hystmodal") || t.classList.contains("hystmodal__wrap"))) && (e = !0);
    }), window.addEventListener("keydown", (t) => {
      if (this.config.closeOnEsc && t.key === "Escape" && this.openedModals.length && !this.isBusy) {
        t.preventDefault(), this.isBusy = !0, this.closeObj(this.openedModals.pop()).then(() => this.isBusy = !1);
        return;
      }
      this.config.catchFocus && t.key === "Tab" && this.openedModals.length && this.focusCatcher(t);
    });
  }
  async openObj(e, t = !1) {
    if (this.config.isStacked || t) {
      const o = this.openedModals.filter((r) => r.element === e.element);
      for (let r = 0; r < o.length; r++)
        await this.closeObj(o[r], !1, !0, !1);
    } else
      await this.closeAll(), this.openedModals = [];
    if (this.isBodyLocked || this.bodyScrollControl(e, "opening"), !e.element.querySelector(".hystmodal__window"))
      return console.error("Warning: selector .hystmodal__window not found in modal window");
    e.element.classList.add("hystmodal--animated"), e.element.classList.add("hystmodal--active"), e.element.style.zIndex = e.zIndex.toString(), e.element.setAttribute("aria-hidden", "false");
    const n = getComputedStyle(e.element).getPropertyValue("--hystmodal-speed");
    this.openedModals.push(e), this.focusIn(e.element), setTimeout(() => {
      e.element.classList.remove("hystmodal--animated"), this.isBusy = !1;
    }, this.cssParseSpeed(n));
  }
  async open(e, t = this.config.isStacked, s = null) {
    const n = this.getActiveModal(), o = e ? document.querySelector(e) : null;
    if (!o)
      return console.error(`Warning: selector: ${e} not found on document`);
    const r = getComputedStyle(o).getPropertyValue("--hystmodal-zindex"), l = {
      element: o,
      starter: s,
      zIndex: n ? n.zIndex + this.openedModals.length : parseInt(r),
      isLocked: !1
    };
    return await this.openObj(l, t), this.isBusy = !1, l;
  }
  closeObj(e, t = !1, s = !1, n = !0) {
    return new Promise((o) => {
      if (!e)
        return;
      this.config.waitTransitions && !s && (e.element.classList.add("hystmodal--animated"), e.element.classList.add("hystmodal--moved")), e.element.classList.remove("hystmodal--active");
      const r = getComputedStyle(e.element).getPropertyValue("--hystmodal-speed");
      e.element.setAttribute("aria-hidden", "false"), this.openedModals = this.openedModals.filter((l) => l.element !== e.element), setTimeout(() => {
        e.element.classList.remove("hystmodal--animated"), e.element.classList.remove("hystmodal--moved"), e.element.style.zIndex = "", this.config.backscroll && !this.openedModals.length && t && (z(), this.bodyScrollControl(e, "closing"), this.isBodyLocked = !1), this.config.catchFocus && e.starter && n && e.starter.focus(), o(e);
      }, this.config.waitTransitions && !s ? this.cssParseSpeed(r) : 0);
    });
  }
  async close(e) {
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
    const t = Array.from(e.querySelectorAll(this._focusElements.join(", ")));
    t.length && t[0].focus();
  }
  focusCatcher(e) {
    const t = this.openedModals[this.openedModals.length - 1], s = Array.from(t.element.querySelectorAll(this._focusElements.join(", ")));
    if (!t.element.contains(document.activeElement))
      s[0].focus(), e.preventDefault();
    else {
      if (!document.activeElement)
        return;
      const n = s.indexOf(document.activeElement);
      e.shiftKey && n === 0 && (s[s.length - 1].focus(), e.preventDefault()), !e.shiftKey && n === s.length - 1 && (s[0].focus(), e.preventDefault());
    }
  }
  cssParseSpeed(e) {
    const t = parseFloat(e);
    let s = e.match(/m?s/), n = s ? s[0] : null, o = 0;
    switch (n) {
      case "s":
        o = t * 1e3;
        break;
      case "ms":
        o = t;
        break;
    }
    return o;
  }
  getActiveModal() {
    return this.openedModals.length ? this.openedModals[this.openedModals.length - 1] : null;
  }
  bodyScrollControl(e, t) {
    const s = Array.from(this.config.fixedSelectors ? document.querySelectorAll(this.config.fixedSelectors.join(", ")) : []);
    if (t === "closing") {
      if (this.openedModals.length)
        return;
      s.forEach((o) => {
        o.style.marginRight = "";
      }), document.documentElement.classList.remove("hystmodal__opened");
      return;
    }
    this.config.backscroll && !this.isBodyLocked && (P(e.element), this.isBodyLocked = !0);
    const n = parseFloat(document.body.style.paddingRight);
    n && s.forEach((o) => {
      o.style.marginRight = `${parseInt(getComputedStyle(o).marginRight, 10) + n}px`;
    }), document.documentElement.classList.add("hystmodal__opened");
  }
}
export {
  H as default
};
