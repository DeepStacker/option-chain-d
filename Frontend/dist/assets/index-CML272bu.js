var jv = Object.defineProperty;
var zv = (e, t, n) =>
  t in e
    ? jv(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
    : (e[t] = n);
var Y = (e, t, n) => zv(e, typeof t != "symbol" ? t + "" : t, n);
function Fv(e, t) {
  for (var n = 0; n < t.length; n++) {
    const i = t[n];
    if (typeof i != "string" && !Array.isArray(i)) {
      for (const r in i)
        if (r !== "default" && !(r in e)) {
          const s = Object.getOwnPropertyDescriptor(i, r);
          s &&
            Object.defineProperty(
              e,
              r,
              s.get ? s : { enumerable: !0, get: () => i[r] }
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(e, Symbol.toStringTag, { value: "Module" })
  );
}
(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) i(r);
  new MutationObserver((r) => {
    for (const s of r)
      if (s.type === "childList")
        for (const o of s.addedNodes)
          o.tagName === "LINK" && o.rel === "modulepreload" && i(o);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(r) {
    const s = {};
    return (
      r.integrity && (s.integrity = r.integrity),
      r.referrerPolicy && (s.referrerPolicy = r.referrerPolicy),
      r.crossOrigin === "use-credentials"
        ? (s.credentials = "include")
        : r.crossOrigin === "anonymous"
        ? (s.credentials = "omit")
        : (s.credentials = "same-origin"),
      s
    );
  }
  function i(r) {
    if (r.ep) return;
    r.ep = !0;
    const s = n(r);
    fetch(r.href, s);
  }
})();
function kc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
var cm = { exports: {} },
  Al = {},
  fm = { exports: {} },
  G = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Is = Symbol.for("react.element"),
  Bv = Symbol.for("react.portal"),
  Hv = Symbol.for("react.fragment"),
  Uv = Symbol.for("react.strict_mode"),
  Wv = Symbol.for("react.profiler"),
  Vv = Symbol.for("react.provider"),
  $v = Symbol.for("react.context"),
  Yv = Symbol.for("react.forward_ref"),
  Xv = Symbol.for("react.suspense"),
  Kv = Symbol.for("react.memo"),
  qv = Symbol.for("react.lazy"),
  fd = Symbol.iterator;
function Qv(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (fd && e[fd]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var dm = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  hm = Object.assign,
  pm = {};
function rr(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = pm),
    (this.updater = n || dm);
}
rr.prototype.isReactComponent = {};
rr.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables."
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
rr.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function mm() {}
mm.prototype = rr.prototype;
function Tc(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = pm),
    (this.updater = n || dm);
}
var Cc = (Tc.prototype = new mm());
Cc.constructor = Tc;
hm(Cc, rr.prototype);
Cc.isPureReactComponent = !0;
var dd = Array.isArray,
  gm = Object.prototype.hasOwnProperty,
  Pc = { current: null },
  ym = { key: !0, ref: !0, __self: !0, __source: !0 };
function vm(e, t, n) {
  var i,
    r = {},
    s = null,
    o = null;
  if (t != null)
    for (i in (t.ref !== void 0 && (o = t.ref),
    t.key !== void 0 && (s = "" + t.key),
    t))
      gm.call(t, i) && !ym.hasOwnProperty(i) && (r[i] = t[i]);
  var l = arguments.length - 2;
  if (l === 1) r.children = n;
  else if (1 < l) {
    for (var a = Array(l), u = 0; u < l; u++) a[u] = arguments[u + 2];
    r.children = a;
  }
  if (e && e.defaultProps)
    for (i in ((l = e.defaultProps), l)) r[i] === void 0 && (r[i] = l[i]);
  return {
    $$typeof: Is,
    type: e,
    key: s,
    ref: o,
    props: r,
    _owner: Pc.current,
  };
}
function Gv(e, t) {
  return {
    $$typeof: Is,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function Oc(e) {
  return typeof e == "object" && e !== null && e.$$typeof === Is;
}
function Zv(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var hd = /\/+/g;
function va(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? Zv("" + e.key)
    : t.toString(36);
}
function Lo(e, t, n, i, r) {
  var s = typeof e;
  (s === "undefined" || s === "boolean") && (e = null);
  var o = !1;
  if (e === null) o = !0;
  else
    switch (s) {
      case "string":
      case "number":
        o = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case Is:
          case Bv:
            o = !0;
        }
    }
  if (o)
    return (
      (o = e),
      (r = r(o)),
      (e = i === "" ? "." + va(o, 0) : i),
      dd(r)
        ? ((n = ""),
          e != null && (n = e.replace(hd, "$&/") + "/"),
          Lo(r, t, n, "", function (u) {
            return u;
          }))
        : r != null &&
          (Oc(r) &&
            (r = Gv(
              r,
              n +
                (!r.key || (o && o.key === r.key)
                  ? ""
                  : ("" + r.key).replace(hd, "$&/") + "/") +
                e
            )),
          t.push(r)),
      1
    );
  if (((o = 0), (i = i === "" ? "." : i + ":"), dd(e)))
    for (var l = 0; l < e.length; l++) {
      s = e[l];
      var a = i + va(s, l);
      o += Lo(s, t, n, a, r);
    }
  else if (((a = Qv(e)), typeof a == "function"))
    for (e = a.call(e), l = 0; !(s = e.next()).done; )
      (s = s.value), (a = i + va(s, l++)), (o += Lo(s, t, n, a, r));
  else if (s === "object")
    throw (
      ((t = String(e)),
      Error(
        "Objects are not valid as a React child (found: " +
          (t === "[object Object]"
            ? "object with keys {" + Object.keys(e).join(", ") + "}"
            : t) +
          "). If you meant to render a collection of children, use an array instead."
      ))
    );
  return o;
}
function eo(e, t, n) {
  if (e == null) return e;
  var i = [],
    r = 0;
  return (
    Lo(e, i, "", "", function (s) {
      return t.call(n, s, r++);
    }),
    i
  );
}
function Jv(e) {
  if (e._status === -1) {
    var t = e._result;
    (t = t()),
      t.then(
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 1), (e._result = n));
        },
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 2), (e._result = n));
        }
      ),
      e._status === -1 && ((e._status = 0), (e._result = t));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var Ye = { current: null },
  Io = { transition: null },
  ex = {
    ReactCurrentDispatcher: Ye,
    ReactCurrentBatchConfig: Io,
    ReactCurrentOwner: Pc,
  };
function xm() {
  throw Error("act(...) is not supported in production builds of React.");
}
G.Children = {
  map: eo,
  forEach: function (e, t, n) {
    eo(
      e,
      function () {
        t.apply(this, arguments);
      },
      n
    );
  },
  count: function (e) {
    var t = 0;
    return (
      eo(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      eo(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!Oc(e))
      throw Error(
        "React.Children.only expected to receive a single React element child."
      );
    return e;
  },
};
G.Component = rr;
G.Fragment = Hv;
G.Profiler = Wv;
G.PureComponent = Tc;
G.StrictMode = Uv;
G.Suspense = Xv;
G.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ex;
G.act = xm;
G.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        "."
    );
  var i = hm({}, e.props),
    r = e.key,
    s = e.ref,
    o = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((s = t.ref), (o = Pc.current)),
      t.key !== void 0 && (r = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var l = e.type.defaultProps;
    for (a in t)
      gm.call(t, a) &&
        !ym.hasOwnProperty(a) &&
        (i[a] = t[a] === void 0 && l !== void 0 ? l[a] : t[a]);
  }
  var a = arguments.length - 2;
  if (a === 1) i.children = n;
  else if (1 < a) {
    l = Array(a);
    for (var u = 0; u < a; u++) l[u] = arguments[u + 2];
    i.children = l;
  }
  return { $$typeof: Is, type: e.type, key: r, ref: s, props: i, _owner: o };
};
G.createContext = function (e) {
  return (
    (e = {
      $$typeof: $v,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: Vv, _context: e }),
    (e.Consumer = e)
  );
};
G.createElement = vm;
G.createFactory = function (e) {
  var t = vm.bind(null, e);
  return (t.type = e), t;
};
G.createRef = function () {
  return { current: null };
};
G.forwardRef = function (e) {
  return { $$typeof: Yv, render: e };
};
G.isValidElement = Oc;
G.lazy = function (e) {
  return { $$typeof: qv, _payload: { _status: -1, _result: e }, _init: Jv };
};
G.memo = function (e, t) {
  return { $$typeof: Kv, type: e, compare: t === void 0 ? null : t };
};
G.startTransition = function (e) {
  var t = Io.transition;
  Io.transition = {};
  try {
    e();
  } finally {
    Io.transition = t;
  }
};
G.unstable_act = xm;
G.useCallback = function (e, t) {
  return Ye.current.useCallback(e, t);
};
G.useContext = function (e) {
  return Ye.current.useContext(e);
};
G.useDebugValue = function () {};
G.useDeferredValue = function (e) {
  return Ye.current.useDeferredValue(e);
};
G.useEffect = function (e, t) {
  return Ye.current.useEffect(e, t);
};
G.useId = function () {
  return Ye.current.useId();
};
G.useImperativeHandle = function (e, t, n) {
  return Ye.current.useImperativeHandle(e, t, n);
};
G.useInsertionEffect = function (e, t) {
  return Ye.current.useInsertionEffect(e, t);
};
G.useLayoutEffect = function (e, t) {
  return Ye.current.useLayoutEffect(e, t);
};
G.useMemo = function (e, t) {
  return Ye.current.useMemo(e, t);
};
G.useReducer = function (e, t, n) {
  return Ye.current.useReducer(e, t, n);
};
G.useRef = function (e) {
  return Ye.current.useRef(e);
};
G.useState = function (e) {
  return Ye.current.useState(e);
};
G.useSyncExternalStore = function (e, t, n) {
  return Ye.current.useSyncExternalStore(e, t, n);
};
G.useTransition = function () {
  return Ye.current.useTransition();
};
G.version = "18.3.1";
fm.exports = G;
var M = fm.exports;
const It = kc(M),
  tx = Fv({ __proto__: null, default: It }, [M]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var nx = M,
  ix = Symbol.for("react.element"),
  rx = Symbol.for("react.fragment"),
  sx = Object.prototype.hasOwnProperty,
  ox = nx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  lx = { key: !0, ref: !0, __self: !0, __source: !0 };
function _m(e, t, n) {
  var i,
    r = {},
    s = null,
    o = null;
  n !== void 0 && (s = "" + n),
    t.key !== void 0 && (s = "" + t.key),
    t.ref !== void 0 && (o = t.ref);
  for (i in t) sx.call(t, i) && !lx.hasOwnProperty(i) && (r[i] = t[i]);
  if (e && e.defaultProps)
    for (i in ((t = e.defaultProps), t)) r[i] === void 0 && (r[i] = t[i]);
  return {
    $$typeof: ix,
    type: e,
    key: s,
    ref: o,
    props: r,
    _owner: ox.current,
  };
}
Al.Fragment = rx;
Al.jsx = _m;
Al.jsxs = _m;
cm.exports = Al;
var S = cm.exports,
  wm = { exports: {} },
  ft = {},
  Sm = { exports: {} },
  bm = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(A, H) {
    var U = A.length;
    A.push(H);
    e: for (; 0 < U; ) {
      var re = (U - 1) >>> 1,
        ee = A[re];
      if (0 < r(ee, H)) (A[re] = H), (A[U] = ee), (U = re);
      else break e;
    }
  }
  function n(A) {
    return A.length === 0 ? null : A[0];
  }
  function i(A) {
    if (A.length === 0) return null;
    var H = A[0],
      U = A.pop();
    if (U !== H) {
      A[0] = U;
      e: for (var re = 0, ee = A.length, ht = ee >>> 1; re < ht; ) {
        var Ee = 2 * (re + 1) - 1,
          Ct = A[Ee],
          Re = Ee + 1,
          xe = A[Re];
        if (0 > r(Ct, U))
          Re < ee && 0 > r(xe, Ct)
            ? ((A[re] = xe), (A[Re] = U), (re = Re))
            : ((A[re] = Ct), (A[Ee] = U), (re = Ee));
        else if (Re < ee && 0 > r(xe, U)) (A[re] = xe), (A[Re] = U), (re = Re);
        else break e;
      }
    }
    return H;
  }
  function r(A, H) {
    var U = A.sortIndex - H.sortIndex;
    return U !== 0 ? U : A.id - H.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var s = performance;
    e.unstable_now = function () {
      return s.now();
    };
  } else {
    var o = Date,
      l = o.now();
    e.unstable_now = function () {
      return o.now() - l;
    };
  }
  var a = [],
    u = [],
    c = 1,
    f = null,
    d = 3,
    h = !1,
    m = !1,
    v = !1,
    _ = typeof setTimeout == "function" ? setTimeout : null,
    g = typeof clearTimeout == "function" ? clearTimeout : null,
    y = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function w(A) {
    for (var H = n(u); H !== null; ) {
      if (H.callback === null) i(u);
      else if (H.startTime <= A)
        i(u), (H.sortIndex = H.expirationTime), t(a, H);
      else break;
      H = n(u);
    }
  }
  function E(A) {
    if (((v = !1), w(A), !m))
      if (n(a) !== null) (m = !0), ie(k);
      else {
        var H = n(u);
        H !== null && ae(E, H.startTime - A);
      }
  }
  function k(A, H) {
    (m = !1), v && ((v = !1), g(N), (N = -1)), (h = !0);
    var U = d;
    try {
      for (
        w(H), f = n(a);
        f !== null && (!(f.expirationTime > H) || (A && !F()));

      ) {
        var re = f.callback;
        if (typeof re == "function") {
          (f.callback = null), (d = f.priorityLevel);
          var ee = re(f.expirationTime <= H);
          (H = e.unstable_now()),
            typeof ee == "function" ? (f.callback = ee) : f === n(a) && i(a),
            w(H);
        } else i(a);
        f = n(a);
      }
      if (f !== null) var ht = !0;
      else {
        var Ee = n(u);
        Ee !== null && ae(E, Ee.startTime - H), (ht = !1);
      }
      return ht;
    } finally {
      (f = null), (d = U), (h = !1);
    }
  }
  var P = !1,
    C = null,
    N = -1,
    I = 5,
    D = -1;
  function F() {
    return !(e.unstable_now() - D < I);
  }
  function B() {
    if (C !== null) {
      var A = e.unstable_now();
      D = A;
      var H = !0;
      try {
        H = C(!0, A);
      } finally {
        H ? Z() : ((P = !1), (C = null));
      }
    } else P = !1;
  }
  var Z;
  if (typeof y == "function")
    Z = function () {
      y(B);
    };
  else if (typeof MessageChannel < "u") {
    var X = new MessageChannel(),
      $ = X.port2;
    (X.port1.onmessage = B),
      (Z = function () {
        $.postMessage(null);
      });
  } else
    Z = function () {
      _(B, 0);
    };
  function ie(A) {
    (C = A), P || ((P = !0), Z());
  }
  function ae(A, H) {
    N = _(function () {
      A(e.unstable_now());
    }, H);
  }
  (e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (A) {
      A.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      m || h || ((m = !0), ie(k));
    }),
    (e.unstable_forceFrameRate = function (A) {
      0 > A || 125 < A
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
          )
        : (I = 0 < A ? Math.floor(1e3 / A) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return d;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(a);
    }),
    (e.unstable_next = function (A) {
      switch (d) {
        case 1:
        case 2:
        case 3:
          var H = 3;
          break;
        default:
          H = d;
      }
      var U = d;
      d = H;
      try {
        return A();
      } finally {
        d = U;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (A, H) {
      switch (A) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          A = 3;
      }
      var U = d;
      d = A;
      try {
        return H();
      } finally {
        d = U;
      }
    }),
    (e.unstable_scheduleCallback = function (A, H, U) {
      var re = e.unstable_now();
      switch (
        (typeof U == "object" && U !== null
          ? ((U = U.delay), (U = typeof U == "number" && 0 < U ? re + U : re))
          : (U = re),
        A)
      ) {
        case 1:
          var ee = -1;
          break;
        case 2:
          ee = 250;
          break;
        case 5:
          ee = 1073741823;
          break;
        case 4:
          ee = 1e4;
          break;
        default:
          ee = 5e3;
      }
      return (
        (ee = U + ee),
        (A = {
          id: c++,
          callback: H,
          priorityLevel: A,
          startTime: U,
          expirationTime: ee,
          sortIndex: -1,
        }),
        U > re
          ? ((A.sortIndex = U),
            t(u, A),
            n(a) === null &&
              A === n(u) &&
              (v ? (g(N), (N = -1)) : (v = !0), ae(E, U - re)))
          : ((A.sortIndex = ee), t(a, A), m || h || ((m = !0), ie(k))),
        A
      );
    }),
    (e.unstable_shouldYield = F),
    (e.unstable_wrapCallback = function (A) {
      var H = d;
      return function () {
        var U = d;
        d = H;
        try {
          return A.apply(this, arguments);
        } finally {
          d = U;
        }
      };
    });
})(bm);
Sm.exports = bm;
var ax = Sm.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var ux = M,
  ct = ax;
function L(e) {
  for (
    var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1;
    n < arguments.length;
    n++
  )
    t += "&args[]=" + encodeURIComponent(arguments[n]);
  return (
    "Minified React error #" +
    e +
    "; visit " +
    t +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var Em = new Set(),
  ls = {};
function wi(e, t) {
  qi(e, t), qi(e + "Capture", t);
}
function qi(e, t) {
  for (ls[e] = t, e = 0; e < t.length; e++) Em.add(t[e]);
}
var fn = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  ou = Object.prototype.hasOwnProperty,
  cx =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  pd = {},
  md = {};
function fx(e) {
  return ou.call(md, e)
    ? !0
    : ou.call(pd, e)
    ? !1
    : cx.test(e)
    ? (md[e] = !0)
    : ((pd[e] = !0), !1);
}
function dx(e, t, n, i) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return i
        ? !1
        : n !== null
        ? !n.acceptsBooleans
        : ((e = e.toLowerCase().slice(0, 5)), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function hx(e, t, n, i) {
  if (t === null || typeof t > "u" || dx(e, t, n, i)) return !0;
  if (i) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function Xe(e, t, n, i, r, s, o) {
  (this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = i),
    (this.attributeNamespace = r),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = s),
    (this.removeEmptyString = o);
}
var Ae = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    Ae[e] = new Xe(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  Ae[t] = new Xe(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  Ae[e] = new Xe(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  Ae[e] = new Xe(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    Ae[e] = new Xe(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  Ae[e] = new Xe(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  Ae[e] = new Xe(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  Ae[e] = new Xe(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  Ae[e] = new Xe(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var Nc = /[\-:]([a-z])/g;
function Mc(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(Nc, Mc);
    Ae[t] = new Xe(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(Nc, Mc);
    Ae[t] = new Xe(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(Nc, Mc);
  Ae[t] = new Xe(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  Ae[e] = new Xe(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
Ae.xlinkHref = new Xe(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1
);
["src", "href", "action", "formAction"].forEach(function (e) {
  Ae[e] = new Xe(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function Rc(e, t, n, i) {
  var r = Ae.hasOwnProperty(t) ? Ae[t] : null;
  (r !== null
    ? r.type !== 0
    : i ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (hx(t, n, r, i) && (n = null),
    i || r === null
      ? fx(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
      : r.mustUseProperty
      ? (e[r.propertyName] = n === null ? (r.type === 3 ? !1 : "") : n)
      : ((t = r.attributeName),
        (i = r.attributeNamespace),
        n === null
          ? e.removeAttribute(t)
          : ((r = r.type),
            (n = r === 3 || (r === 4 && n === !0) ? "" : "" + n),
            i ? e.setAttributeNS(i, t, n) : e.setAttribute(t, n))));
}
var gn = ux.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  to = Symbol.for("react.element"),
  Ni = Symbol.for("react.portal"),
  Mi = Symbol.for("react.fragment"),
  Lc = Symbol.for("react.strict_mode"),
  lu = Symbol.for("react.profiler"),
  km = Symbol.for("react.provider"),
  Tm = Symbol.for("react.context"),
  Ic = Symbol.for("react.forward_ref"),
  au = Symbol.for("react.suspense"),
  uu = Symbol.for("react.suspense_list"),
  Dc = Symbol.for("react.memo"),
  bn = Symbol.for("react.lazy"),
  Cm = Symbol.for("react.offscreen"),
  gd = Symbol.iterator;
function _r(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (gd && e[gd]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var de = Object.assign,
  xa;
function Ir(e) {
  if (xa === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      xa = (t && t[1]) || "";
    }
  return (
    `
` +
    xa +
    e
  );
}
var _a = !1;
function wa(e, t) {
  if (!e || _a) return "";
  _a = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (u) {
          var i = u;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (u) {
          i = u;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (u) {
        i = u;
      }
      e();
    }
  } catch (u) {
    if (u && i && typeof u.stack == "string") {
      for (
        var r = u.stack.split(`
`),
          s = i.stack.split(`
`),
          o = r.length - 1,
          l = s.length - 1;
        1 <= o && 0 <= l && r[o] !== s[l];

      )
        l--;
      for (; 1 <= o && 0 <= l; o--, l--)
        if (r[o] !== s[l]) {
          if (o !== 1 || l !== 1)
            do
              if ((o--, l--, 0 > l || r[o] !== s[l])) {
                var a =
                  `
` + r[o].replace(" at new ", " at ");
                return (
                  e.displayName &&
                    a.includes("<anonymous>") &&
                    (a = a.replace("<anonymous>", e.displayName)),
                  a
                );
              }
            while (1 <= o && 0 <= l);
          break;
        }
    }
  } finally {
    (_a = !1), (Error.prepareStackTrace = n);
  }
  return (e = e ? e.displayName || e.name : "") ? Ir(e) : "";
}
function px(e) {
  switch (e.tag) {
    case 5:
      return Ir(e.type);
    case 16:
      return Ir("Lazy");
    case 13:
      return Ir("Suspense");
    case 19:
      return Ir("SuspenseList");
    case 0:
    case 2:
    case 15:
      return (e = wa(e.type, !1)), e;
    case 11:
      return (e = wa(e.type.render, !1)), e;
    case 1:
      return (e = wa(e.type, !0)), e;
    default:
      return "";
  }
}
function cu(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case Mi:
      return "Fragment";
    case Ni:
      return "Portal";
    case lu:
      return "Profiler";
    case Lc:
      return "StrictMode";
    case au:
      return "Suspense";
    case uu:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case Tm:
        return (e.displayName || "Context") + ".Consumer";
      case km:
        return (e._context.displayName || "Context") + ".Provider";
      case Ic:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case Dc:
        return (
          (t = e.displayName || null), t !== null ? t : cu(e.type) || "Memo"
        );
      case bn:
        (t = e._payload), (e = e._init);
        try {
          return cu(e(t));
        } catch {}
    }
  return null;
}
function mx(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ""),
        t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
      );
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return cu(t);
    case 8:
      return t === Lc ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function Hn(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function Pm(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function gx(e) {
  var t = Pm(e) ? "checked" : "value",
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    i = "" + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof n < "u" &&
    typeof n.get == "function" &&
    typeof n.set == "function"
  ) {
    var r = n.get,
      s = n.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return r.call(this);
        },
        set: function (o) {
          (i = "" + o), s.call(this, o);
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return i;
        },
        setValue: function (o) {
          i = "" + o;
        },
        stopTracking: function () {
          (e._valueTracker = null), delete e[t];
        },
      }
    );
  }
}
function no(e) {
  e._valueTracker || (e._valueTracker = gx(e));
}
function Om(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    i = "";
  return (
    e && (i = Pm(e) ? (e.checked ? "true" : "false") : e.value),
    (e = i),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function Zo(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u"))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function fu(e, t) {
  var n = t.checked;
  return de({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? e._wrapperState.initialChecked,
  });
}
function yd(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    i = t.checked != null ? t.checked : t.defaultChecked;
  (n = Hn(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: i,
      initialValue: n,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    });
}
function Nm(e, t) {
  (t = t.checked), t != null && Rc(e, "checked", t, !1);
}
function du(e, t) {
  Nm(e, t);
  var n = Hn(t.value),
    i = t.type;
  if (n != null)
    i === "number"
      ? ((n === 0 && e.value === "") || e.value != n) && (e.value = "" + n)
      : e.value !== "" + n && (e.value = "" + n);
  else if (i === "submit" || i === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value")
    ? hu(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && hu(e, t.type, Hn(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked);
}
function vd(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var i = t.type;
    if (
      !(
        (i !== "submit" && i !== "reset") ||
        (t.value !== void 0 && t.value !== null)
      )
    )
      return;
    (t = "" + e._wrapperState.initialValue),
      n || t === e.value || (e.value = t),
      (e.defaultValue = t);
  }
  (n = e.name),
    n !== "" && (e.name = ""),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== "" && (e.name = n);
}
function hu(e, t, n) {
  (t !== "number" || Zo(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var Dr = Array.isArray;
function Ui(e, t, n, i) {
  if (((e = e.options), t)) {
    t = {};
    for (var r = 0; r < n.length; r++) t["$" + n[r]] = !0;
    for (n = 0; n < e.length; n++)
      (r = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== r && (e[n].selected = r),
        r && i && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + Hn(n), t = null, r = 0; r < e.length; r++) {
      if (e[r].value === n) {
        (e[r].selected = !0), i && (e[r].defaultSelected = !0);
        return;
      }
      t !== null || e[r].disabled || (t = e[r]);
    }
    t !== null && (t.selected = !0);
  }
}
function pu(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(L(91));
  return de({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function xd(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(L(92));
      if (Dr(n)) {
        if (1 < n.length) throw Error(L(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), (n = t);
  }
  e._wrapperState = { initialValue: Hn(n) };
}
function Mm(e, t) {
  var n = Hn(t.value),
    i = Hn(t.defaultValue);
  n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    i != null && (e.defaultValue = "" + i);
}
function _d(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function Rm(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function mu(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? Rm(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
    ? "http://www.w3.org/1999/xhtml"
    : e;
}
var io,
  Lm = (function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (t, n, i, r) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, i, r);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
      e.innerHTML = t;
    else {
      for (
        io = io || document.createElement("div"),
          io.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = io.firstChild;
        e.firstChild;

      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function as(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var Vr = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  yx = ["Webkit", "ms", "Moz", "O"];
Object.keys(Vr).forEach(function (e) {
  yx.forEach(function (t) {
    (t = t + e.charAt(0).toUpperCase() + e.substring(1)), (Vr[t] = Vr[e]);
  });
});
function Im(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || (Vr.hasOwnProperty(e) && Vr[e])
    ? ("" + t).trim()
    : t + "px";
}
function Dm(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var i = n.indexOf("--") === 0,
        r = Im(n, t[n], i);
      n === "float" && (n = "cssFloat"), i ? e.setProperty(n, r) : (e[n] = r);
    }
}
var vx = de(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  }
);
function gu(e, t) {
  if (t) {
    if (vx[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(L(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(L(60));
      if (
        typeof t.dangerouslySetInnerHTML != "object" ||
        !("__html" in t.dangerouslySetInnerHTML)
      )
        throw Error(L(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(L(62));
  }
}
function yu(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var vu = null;
function Ac(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var xu = null,
  Wi = null,
  Vi = null;
function wd(e) {
  if ((e = js(e))) {
    if (typeof xu != "function") throw Error(L(280));
    var t = e.stateNode;
    t && ((t = Hl(t)), xu(e.stateNode, e.type, t));
  }
}
function Am(e) {
  Wi ? (Vi ? Vi.push(e) : (Vi = [e])) : (Wi = e);
}
function jm() {
  if (Wi) {
    var e = Wi,
      t = Vi;
    if (((Vi = Wi = null), wd(e), t)) for (e = 0; e < t.length; e++) wd(t[e]);
  }
}
function zm(e, t) {
  return e(t);
}
function Fm() {}
var Sa = !1;
function Bm(e, t, n) {
  if (Sa) return e(t, n);
  Sa = !0;
  try {
    return zm(e, t, n);
  } finally {
    (Sa = !1), (Wi !== null || Vi !== null) && (Fm(), jm());
  }
}
function us(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var i = Hl(n);
  if (i === null) return null;
  n = i[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (i = !i.disabled) ||
        ((e = e.type),
        (i = !(
          e === "button" ||
          e === "input" ||
          e === "select" ||
          e === "textarea"
        ))),
        (e = !i);
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(L(231, t, typeof n));
  return n;
}
var _u = !1;
if (fn)
  try {
    var wr = {};
    Object.defineProperty(wr, "passive", {
      get: function () {
        _u = !0;
      },
    }),
      window.addEventListener("test", wr, wr),
      window.removeEventListener("test", wr, wr);
  } catch {
    _u = !1;
  }
function xx(e, t, n, i, r, s, o, l, a) {
  var u = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, u);
  } catch (c) {
    this.onError(c);
  }
}
var $r = !1,
  Jo = null,
  el = !1,
  wu = null,
  _x = {
    onError: function (e) {
      ($r = !0), (Jo = e);
    },
  };
function wx(e, t, n, i, r, s, o, l, a) {
  ($r = !1), (Jo = null), xx.apply(_x, arguments);
}
function Sx(e, t, n, i, r, s, o, l, a) {
  if ((wx.apply(this, arguments), $r)) {
    if ($r) {
      var u = Jo;
      ($r = !1), (Jo = null);
    } else throw Error(L(198));
    el || ((el = !0), (wu = u));
  }
}
function Si(e) {
  var t = e,
    n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do (t = e), t.flags & 4098 && (n = t.return), (e = t.return);
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function Hm(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (
      (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function Sd(e) {
  if (Si(e) !== e) throw Error(L(188));
}
function bx(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = Si(e)), t === null)) throw Error(L(188));
    return t !== e ? null : e;
  }
  for (var n = e, i = t; ; ) {
    var r = n.return;
    if (r === null) break;
    var s = r.alternate;
    if (s === null) {
      if (((i = r.return), i !== null)) {
        n = i;
        continue;
      }
      break;
    }
    if (r.child === s.child) {
      for (s = r.child; s; ) {
        if (s === n) return Sd(r), e;
        if (s === i) return Sd(r), t;
        s = s.sibling;
      }
      throw Error(L(188));
    }
    if (n.return !== i.return) (n = r), (i = s);
    else {
      for (var o = !1, l = r.child; l; ) {
        if (l === n) {
          (o = !0), (n = r), (i = s);
          break;
        }
        if (l === i) {
          (o = !0), (i = r), (n = s);
          break;
        }
        l = l.sibling;
      }
      if (!o) {
        for (l = s.child; l; ) {
          if (l === n) {
            (o = !0), (n = s), (i = r);
            break;
          }
          if (l === i) {
            (o = !0), (i = s), (n = r);
            break;
          }
          l = l.sibling;
        }
        if (!o) throw Error(L(189));
      }
    }
    if (n.alternate !== i) throw Error(L(190));
  }
  if (n.tag !== 3) throw Error(L(188));
  return n.stateNode.current === n ? e : t;
}
function Um(e) {
  return (e = bx(e)), e !== null ? Wm(e) : null;
}
function Wm(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = Wm(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Vm = ct.unstable_scheduleCallback,
  bd = ct.unstable_cancelCallback,
  Ex = ct.unstable_shouldYield,
  kx = ct.unstable_requestPaint,
  ge = ct.unstable_now,
  Tx = ct.unstable_getCurrentPriorityLevel,
  jc = ct.unstable_ImmediatePriority,
  $m = ct.unstable_UserBlockingPriority,
  tl = ct.unstable_NormalPriority,
  Cx = ct.unstable_LowPriority,
  Ym = ct.unstable_IdlePriority,
  jl = null,
  Qt = null;
function Px(e) {
  if (Qt && typeof Qt.onCommitFiberRoot == "function")
    try {
      Qt.onCommitFiberRoot(jl, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var Dt = Math.clz32 ? Math.clz32 : Mx,
  Ox = Math.log,
  Nx = Math.LN2;
function Mx(e) {
  return (e >>>= 0), e === 0 ? 32 : (31 - ((Ox(e) / Nx) | 0)) | 0;
}
var ro = 64,
  so = 4194304;
function Ar(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function nl(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var i = 0,
    r = e.suspendedLanes,
    s = e.pingedLanes,
    o = n & 268435455;
  if (o !== 0) {
    var l = o & ~r;
    l !== 0 ? (i = Ar(l)) : ((s &= o), s !== 0 && (i = Ar(s)));
  } else (o = n & ~r), o !== 0 ? (i = Ar(o)) : s !== 0 && (i = Ar(s));
  if (i === 0) return 0;
  if (
    t !== 0 &&
    t !== i &&
    !(t & r) &&
    ((r = i & -i), (s = t & -t), r >= s || (r === 16 && (s & 4194240) !== 0))
  )
    return t;
  if ((i & 4 && (i |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= i; 0 < t; )
      (n = 31 - Dt(t)), (r = 1 << n), (i |= e[n]), (t &= ~r);
  return i;
}
function Rx(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function Lx(e, t) {
  for (
    var n = e.suspendedLanes,
      i = e.pingedLanes,
      r = e.expirationTimes,
      s = e.pendingLanes;
    0 < s;

  ) {
    var o = 31 - Dt(s),
      l = 1 << o,
      a = r[o];
    a === -1
      ? (!(l & n) || l & i) && (r[o] = Rx(l, t))
      : a <= t && (e.expiredLanes |= l),
      (s &= ~l);
  }
}
function Su(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function Xm() {
  var e = ro;
  return (ro <<= 1), !(ro & 4194240) && (ro = 64), e;
}
function ba(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function Ds(e, t, n) {
  (e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - Dt(t)),
    (e[t] = n);
}
function Ix(e, t) {
  var n = e.pendingLanes & ~t;
  (e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements);
  var i = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var r = 31 - Dt(n),
      s = 1 << r;
    (t[r] = 0), (i[r] = -1), (e[r] = -1), (n &= ~s);
  }
}
function zc(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var i = 31 - Dt(n),
      r = 1 << i;
    (r & t) | (e[i] & t) && (e[i] |= t), (n &= ~r);
  }
}
var ne = 0;
function Km(e) {
  return (e &= -e), 1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1;
}
var qm,
  Fc,
  Qm,
  Gm,
  Zm,
  bu = !1,
  oo = [],
  Mn = null,
  Rn = null,
  Ln = null,
  cs = new Map(),
  fs = new Map(),
  kn = [],
  Dx =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " "
    );
function Ed(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      Mn = null;
      break;
    case "dragenter":
    case "dragleave":
      Rn = null;
      break;
    case "mouseover":
    case "mouseout":
      Ln = null;
      break;
    case "pointerover":
    case "pointerout":
      cs.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      fs.delete(t.pointerId);
  }
}
function Sr(e, t, n, i, r, s) {
  return e === null || e.nativeEvent !== s
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: i,
        nativeEvent: s,
        targetContainers: [r],
      }),
      t !== null && ((t = js(t)), t !== null && Fc(t)),
      e)
    : ((e.eventSystemFlags |= i),
      (t = e.targetContainers),
      r !== null && t.indexOf(r) === -1 && t.push(r),
      e);
}
function Ax(e, t, n, i, r) {
  switch (t) {
    case "focusin":
      return (Mn = Sr(Mn, e, t, n, i, r)), !0;
    case "dragenter":
      return (Rn = Sr(Rn, e, t, n, i, r)), !0;
    case "mouseover":
      return (Ln = Sr(Ln, e, t, n, i, r)), !0;
    case "pointerover":
      var s = r.pointerId;
      return cs.set(s, Sr(cs.get(s) || null, e, t, n, i, r)), !0;
    case "gotpointercapture":
      return (
        (s = r.pointerId), fs.set(s, Sr(fs.get(s) || null, e, t, n, i, r)), !0
      );
  }
  return !1;
}
function Jm(e) {
  var t = ri(e.target);
  if (t !== null) {
    var n = Si(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = Hm(n)), t !== null)) {
          (e.blockedOn = t),
            Zm(e.priority, function () {
              Qm(n);
            });
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function Do(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = Eu(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var i = new n.constructor(n.type, n);
      (vu = i), n.target.dispatchEvent(i), (vu = null);
    } else return (t = js(n)), t !== null && Fc(t), (e.blockedOn = n), !1;
    t.shift();
  }
  return !0;
}
function kd(e, t, n) {
  Do(e) && n.delete(t);
}
function jx() {
  (bu = !1),
    Mn !== null && Do(Mn) && (Mn = null),
    Rn !== null && Do(Rn) && (Rn = null),
    Ln !== null && Do(Ln) && (Ln = null),
    cs.forEach(kd),
    fs.forEach(kd);
}
function br(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    bu ||
      ((bu = !0),
      ct.unstable_scheduleCallback(ct.unstable_NormalPriority, jx)));
}
function ds(e) {
  function t(r) {
    return br(r, e);
  }
  if (0 < oo.length) {
    br(oo[0], e);
    for (var n = 1; n < oo.length; n++) {
      var i = oo[n];
      i.blockedOn === e && (i.blockedOn = null);
    }
  }
  for (
    Mn !== null && br(Mn, e),
      Rn !== null && br(Rn, e),
      Ln !== null && br(Ln, e),
      cs.forEach(t),
      fs.forEach(t),
      n = 0;
    n < kn.length;
    n++
  )
    (i = kn[n]), i.blockedOn === e && (i.blockedOn = null);
  for (; 0 < kn.length && ((n = kn[0]), n.blockedOn === null); )
    Jm(n), n.blockedOn === null && kn.shift();
}
var $i = gn.ReactCurrentBatchConfig,
  il = !0;
function zx(e, t, n, i) {
  var r = ne,
    s = $i.transition;
  $i.transition = null;
  try {
    (ne = 1), Bc(e, t, n, i);
  } finally {
    (ne = r), ($i.transition = s);
  }
}
function Fx(e, t, n, i) {
  var r = ne,
    s = $i.transition;
  $i.transition = null;
  try {
    (ne = 4), Bc(e, t, n, i);
  } finally {
    (ne = r), ($i.transition = s);
  }
}
function Bc(e, t, n, i) {
  if (il) {
    var r = Eu(e, t, n, i);
    if (r === null) La(e, t, i, rl, n), Ed(e, i);
    else if (Ax(r, e, t, n, i)) i.stopPropagation();
    else if ((Ed(e, i), t & 4 && -1 < Dx.indexOf(e))) {
      for (; r !== null; ) {
        var s = js(r);
        if (
          (s !== null && qm(s),
          (s = Eu(e, t, n, i)),
          s === null && La(e, t, i, rl, n),
          s === r)
        )
          break;
        r = s;
      }
      r !== null && i.stopPropagation();
    } else La(e, t, i, null, n);
  }
}
var rl = null;
function Eu(e, t, n, i) {
  if (((rl = null), (e = Ac(i)), (e = ri(e)), e !== null))
    if (((t = Si(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = Hm(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return (rl = e), null;
}
function eg(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (Tx()) {
        case jc:
          return 1;
        case $m:
          return 4;
        case tl:
        case Cx:
          return 16;
        case Ym:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var Cn = null,
  Hc = null,
  Ao = null;
function tg() {
  if (Ao) return Ao;
  var e,
    t = Hc,
    n = t.length,
    i,
    r = "value" in Cn ? Cn.value : Cn.textContent,
    s = r.length;
  for (e = 0; e < n && t[e] === r[e]; e++);
  var o = n - e;
  for (i = 1; i <= o && t[n - i] === r[s - i]; i++);
  return (Ao = r.slice(e, 1 < i ? 1 - i : void 0));
}
function jo(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function lo() {
  return !0;
}
function Td() {
  return !1;
}
function dt(e) {
  function t(n, i, r, s, o) {
    (this._reactName = n),
      (this._targetInst = r),
      (this.type = i),
      (this.nativeEvent = s),
      (this.target = o),
      (this.currentTarget = null);
    for (var l in e)
      e.hasOwnProperty(l) && ((n = e[l]), (this[l] = n ? n(s) : s[l]));
    return (
      (this.isDefaultPrevented = (
        s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1
      )
        ? lo
        : Td),
      (this.isPropagationStopped = Td),
      this
    );
  }
  return (
    de(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = lo));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = lo));
      },
      persist: function () {},
      isPersistent: lo,
    }),
    t
  );
}
var sr = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  Uc = dt(sr),
  As = de({}, sr, { view: 0, detail: 0 }),
  Bx = dt(As),
  Ea,
  ka,
  Er,
  zl = de({}, As, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Wc,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return "movementX" in e
        ? e.movementX
        : (e !== Er &&
            (Er && e.type === "mousemove"
              ? ((Ea = e.screenX - Er.screenX), (ka = e.screenY - Er.screenY))
              : (ka = Ea = 0),
            (Er = e)),
          Ea);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : ka;
    },
  }),
  Cd = dt(zl),
  Hx = de({}, zl, { dataTransfer: 0 }),
  Ux = dt(Hx),
  Wx = de({}, As, { relatedTarget: 0 }),
  Ta = dt(Wx),
  Vx = de({}, sr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  $x = dt(Vx),
  Yx = de({}, sr, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  Xx = dt(Yx),
  Kx = de({}, sr, { data: 0 }),
  Pd = dt(Kx),
  qx = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  Qx = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  Gx = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function Zx(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = Gx[e]) ? !!t[e] : !1;
}
function Wc() {
  return Zx;
}
var Jx = de({}, As, {
    key: function (e) {
      if (e.key) {
        var t = qx[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = jo(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
        ? Qx[e.keyCode] || "Unidentified"
        : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Wc,
    charCode: function (e) {
      return e.type === "keypress" ? jo(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? jo(e)
        : e.type === "keydown" || e.type === "keyup"
        ? e.keyCode
        : 0;
    },
  }),
  e1 = dt(Jx),
  t1 = de({}, zl, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  Od = dt(t1),
  n1 = de({}, As, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Wc,
  }),
  i1 = dt(n1),
  r1 = de({}, sr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  s1 = dt(r1),
  o1 = de({}, zl, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e
        ? e.deltaY
        : "wheelDeltaY" in e
        ? -e.wheelDeltaY
        : "wheelDelta" in e
        ? -e.wheelDelta
        : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  l1 = dt(o1),
  a1 = [9, 13, 27, 32],
  Vc = fn && "CompositionEvent" in window,
  Yr = null;
fn && "documentMode" in document && (Yr = document.documentMode);
var u1 = fn && "TextEvent" in window && !Yr,
  ng = fn && (!Vc || (Yr && 8 < Yr && 11 >= Yr)),
  Nd = " ",
  Md = !1;
function ig(e, t) {
  switch (e) {
    case "keyup":
      return a1.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function rg(e) {
  return (e = e.detail), typeof e == "object" && "data" in e ? e.data : null;
}
var Ri = !1;
function c1(e, t) {
  switch (e) {
    case "compositionend":
      return rg(t);
    case "keypress":
      return t.which !== 32 ? null : ((Md = !0), Nd);
    case "textInput":
      return (e = t.data), e === Nd && Md ? null : e;
    default:
      return null;
  }
}
function f1(e, t) {
  if (Ri)
    return e === "compositionend" || (!Vc && ig(e, t))
      ? ((e = tg()), (Ao = Hc = Cn = null), (Ri = !1), e)
      : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return ng && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var d1 = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function Rd(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!d1[e.type] : t === "textarea";
}
function sg(e, t, n, i) {
  Am(i),
    (t = sl(t, "onChange")),
    0 < t.length &&
      ((n = new Uc("onChange", "change", null, n, i)),
      e.push({ event: n, listeners: t }));
}
var Xr = null,
  hs = null;
function h1(e) {
  gg(e, 0);
}
function Fl(e) {
  var t = Di(e);
  if (Om(t)) return e;
}
function p1(e, t) {
  if (e === "change") return t;
}
var og = !1;
if (fn) {
  var Ca;
  if (fn) {
    var Pa = "oninput" in document;
    if (!Pa) {
      var Ld = document.createElement("div");
      Ld.setAttribute("oninput", "return;"),
        (Pa = typeof Ld.oninput == "function");
    }
    Ca = Pa;
  } else Ca = !1;
  og = Ca && (!document.documentMode || 9 < document.documentMode);
}
function Id() {
  Xr && (Xr.detachEvent("onpropertychange", lg), (hs = Xr = null));
}
function lg(e) {
  if (e.propertyName === "value" && Fl(hs)) {
    var t = [];
    sg(t, hs, e, Ac(e)), Bm(h1, t);
  }
}
function m1(e, t, n) {
  e === "focusin"
    ? (Id(), (Xr = t), (hs = n), Xr.attachEvent("onpropertychange", lg))
    : e === "focusout" && Id();
}
function g1(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return Fl(hs);
}
function y1(e, t) {
  if (e === "click") return Fl(t);
}
function v1(e, t) {
  if (e === "input" || e === "change") return Fl(t);
}
function x1(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var jt = typeof Object.is == "function" ? Object.is : x1;
function ps(e, t) {
  if (jt(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var n = Object.keys(e),
    i = Object.keys(t);
  if (n.length !== i.length) return !1;
  for (i = 0; i < n.length; i++) {
    var r = n[i];
    if (!ou.call(t, r) || !jt(e[r], t[r])) return !1;
  }
  return !0;
}
function Dd(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Ad(e, t) {
  var n = Dd(e);
  e = 0;
  for (var i; n; ) {
    if (n.nodeType === 3) {
      if (((i = e + n.textContent.length), e <= t && i >= t))
        return { node: n, offset: t - e };
      e = i;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = Dd(n);
  }
}
function ag(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
      ? !1
      : t && t.nodeType === 3
      ? ag(e, t.parentNode)
      : "contains" in e
      ? e.contains(t)
      : e.compareDocumentPosition
      ? !!(e.compareDocumentPosition(t) & 16)
      : !1
    : !1;
}
function ug() {
  for (var e = window, t = Zo(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Zo(e.document);
  }
  return t;
}
function $c(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === "input" &&
      (e.type === "text" ||
        e.type === "search" ||
        e.type === "tel" ||
        e.type === "url" ||
        e.type === "password")) ||
      t === "textarea" ||
      e.contentEditable === "true")
  );
}
function _1(e) {
  var t = ug(),
    n = e.focusedElem,
    i = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    ag(n.ownerDocument.documentElement, n)
  ) {
    if (i !== null && $c(n)) {
      if (
        ((t = i.start),
        (e = i.end),
        e === void 0 && (e = t),
        "selectionStart" in n)
      )
        (n.selectionStart = t), (n.selectionEnd = Math.min(e, n.value.length));
      else if (
        ((e = ((t = n.ownerDocument || document) && t.defaultView) || window),
        e.getSelection)
      ) {
        e = e.getSelection();
        var r = n.textContent.length,
          s = Math.min(i.start, r);
        (i = i.end === void 0 ? s : Math.min(i.end, r)),
          !e.extend && s > i && ((r = i), (i = s), (s = r)),
          (r = Ad(n, s));
        var o = Ad(n, i);
        r &&
          o &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== r.node ||
            e.anchorOffset !== r.offset ||
            e.focusNode !== o.node ||
            e.focusOffset !== o.offset) &&
          ((t = t.createRange()),
          t.setStart(r.node, r.offset),
          e.removeAllRanges(),
          s > i
            ? (e.addRange(t), e.extend(o.node, o.offset))
            : (t.setEnd(o.node, o.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; (e = e.parentNode); )
      e.nodeType === 1 &&
        t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)
      (e = t[n]),
        (e.element.scrollLeft = e.left),
        (e.element.scrollTop = e.top);
  }
}
var w1 = fn && "documentMode" in document && 11 >= document.documentMode,
  Li = null,
  ku = null,
  Kr = null,
  Tu = !1;
function jd(e, t, n) {
  var i = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  Tu ||
    Li == null ||
    Li !== Zo(i) ||
    ((i = Li),
    "selectionStart" in i && $c(i)
      ? (i = { start: i.selectionStart, end: i.selectionEnd })
      : ((i = (
          (i.ownerDocument && i.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (i = {
          anchorNode: i.anchorNode,
          anchorOffset: i.anchorOffset,
          focusNode: i.focusNode,
          focusOffset: i.focusOffset,
        })),
    (Kr && ps(Kr, i)) ||
      ((Kr = i),
      (i = sl(ku, "onSelect")),
      0 < i.length &&
        ((t = new Uc("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: i }),
        (t.target = Li))));
}
function ao(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n["Webkit" + e] = "webkit" + t),
    (n["Moz" + e] = "moz" + t),
    n
  );
}
var Ii = {
    animationend: ao("Animation", "AnimationEnd"),
    animationiteration: ao("Animation", "AnimationIteration"),
    animationstart: ao("Animation", "AnimationStart"),
    transitionend: ao("Transition", "TransitionEnd"),
  },
  Oa = {},
  cg = {};
fn &&
  ((cg = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete Ii.animationend.animation,
    delete Ii.animationiteration.animation,
    delete Ii.animationstart.animation),
  "TransitionEvent" in window || delete Ii.transitionend.transition);
function Bl(e) {
  if (Oa[e]) return Oa[e];
  if (!Ii[e]) return e;
  var t = Ii[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in cg) return (Oa[e] = t[n]);
  return e;
}
var fg = Bl("animationend"),
  dg = Bl("animationiteration"),
  hg = Bl("animationstart"),
  pg = Bl("transitionend"),
  mg = new Map(),
  zd =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " "
    );
function Yn(e, t) {
  mg.set(e, t), wi(t, [e]);
}
for (var Na = 0; Na < zd.length; Na++) {
  var Ma = zd[Na],
    S1 = Ma.toLowerCase(),
    b1 = Ma[0].toUpperCase() + Ma.slice(1);
  Yn(S1, "on" + b1);
}
Yn(fg, "onAnimationEnd");
Yn(dg, "onAnimationIteration");
Yn(hg, "onAnimationStart");
Yn("dblclick", "onDoubleClick");
Yn("focusin", "onFocus");
Yn("focusout", "onBlur");
Yn(pg, "onTransitionEnd");
qi("onMouseEnter", ["mouseout", "mouseover"]);
qi("onMouseLeave", ["mouseout", "mouseover"]);
qi("onPointerEnter", ["pointerout", "pointerover"]);
qi("onPointerLeave", ["pointerout", "pointerover"]);
wi(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(" ")
);
wi(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " "
  )
);
wi("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
wi(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" ")
);
wi(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" ")
);
wi(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
);
var jr =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " "
    ),
  E1 = new Set("cancel close invalid load scroll toggle".split(" ").concat(jr));
function Fd(e, t, n) {
  var i = e.type || "unknown-event";
  (e.currentTarget = n), Sx(i, t, void 0, e), (e.currentTarget = null);
}
function gg(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var i = e[n],
      r = i.event;
    i = i.listeners;
    e: {
      var s = void 0;
      if (t)
        for (var o = i.length - 1; 0 <= o; o--) {
          var l = i[o],
            a = l.instance,
            u = l.currentTarget;
          if (((l = l.listener), a !== s && r.isPropagationStopped())) break e;
          Fd(r, l, u), (s = a);
        }
      else
        for (o = 0; o < i.length; o++) {
          if (
            ((l = i[o]),
            (a = l.instance),
            (u = l.currentTarget),
            (l = l.listener),
            a !== s && r.isPropagationStopped())
          )
            break e;
          Fd(r, l, u), (s = a);
        }
    }
  }
  if (el) throw ((e = wu), (el = !1), (wu = null), e);
}
function oe(e, t) {
  var n = t[Mu];
  n === void 0 && (n = t[Mu] = new Set());
  var i = e + "__bubble";
  n.has(i) || (yg(t, e, 2, !1), n.add(i));
}
function Ra(e, t, n) {
  var i = 0;
  t && (i |= 4), yg(n, e, i, t);
}
var uo = "_reactListening" + Math.random().toString(36).slice(2);
function ms(e) {
  if (!e[uo]) {
    (e[uo] = !0),
      Em.forEach(function (n) {
        n !== "selectionchange" && (E1.has(n) || Ra(n, !1, e), Ra(n, !0, e));
      });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[uo] || ((t[uo] = !0), Ra("selectionchange", !1, t));
  }
}
function yg(e, t, n, i) {
  switch (eg(t)) {
    case 1:
      var r = zx;
      break;
    case 4:
      r = Fx;
      break;
    default:
      r = Bc;
  }
  (n = r.bind(null, t, n, e)),
    (r = void 0),
    !_u ||
      (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
      (r = !0),
    i
      ? r !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: r })
        : e.addEventListener(t, n, !0)
      : r !== void 0
      ? e.addEventListener(t, n, { passive: r })
      : e.addEventListener(t, n, !1);
}
function La(e, t, n, i, r) {
  var s = i;
  if (!(t & 1) && !(t & 2) && i !== null)
    e: for (;;) {
      if (i === null) return;
      var o = i.tag;
      if (o === 3 || o === 4) {
        var l = i.stateNode.containerInfo;
        if (l === r || (l.nodeType === 8 && l.parentNode === r)) break;
        if (o === 4)
          for (o = i.return; o !== null; ) {
            var a = o.tag;
            if (
              (a === 3 || a === 4) &&
              ((a = o.stateNode.containerInfo),
              a === r || (a.nodeType === 8 && a.parentNode === r))
            )
              return;
            o = o.return;
          }
        for (; l !== null; ) {
          if (((o = ri(l)), o === null)) return;
          if (((a = o.tag), a === 5 || a === 6)) {
            i = s = o;
            continue e;
          }
          l = l.parentNode;
        }
      }
      i = i.return;
    }
  Bm(function () {
    var u = s,
      c = Ac(n),
      f = [];
    e: {
      var d = mg.get(e);
      if (d !== void 0) {
        var h = Uc,
          m = e;
        switch (e) {
          case "keypress":
            if (jo(n) === 0) break e;
          case "keydown":
          case "keyup":
            h = e1;
            break;
          case "focusin":
            (m = "focus"), (h = Ta);
            break;
          case "focusout":
            (m = "blur"), (h = Ta);
            break;
          case "beforeblur":
          case "afterblur":
            h = Ta;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            h = Cd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            h = Ux;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            h = i1;
            break;
          case fg:
          case dg:
          case hg:
            h = $x;
            break;
          case pg:
            h = s1;
            break;
          case "scroll":
            h = Bx;
            break;
          case "wheel":
            h = l1;
            break;
          case "copy":
          case "cut":
          case "paste":
            h = Xx;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            h = Od;
        }
        var v = (t & 4) !== 0,
          _ = !v && e === "scroll",
          g = v ? (d !== null ? d + "Capture" : null) : d;
        v = [];
        for (var y = u, w; y !== null; ) {
          w = y;
          var E = w.stateNode;
          if (
            (w.tag === 5 &&
              E !== null &&
              ((w = E),
              g !== null && ((E = us(y, g)), E != null && v.push(gs(y, E, w)))),
            _)
          )
            break;
          y = y.return;
        }
        0 < v.length &&
          ((d = new h(d, m, null, n, c)), f.push({ event: d, listeners: v }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (
          ((d = e === "mouseover" || e === "pointerover"),
          (h = e === "mouseout" || e === "pointerout"),
          d &&
            n !== vu &&
            (m = n.relatedTarget || n.fromElement) &&
            (ri(m) || m[dn]))
        )
          break e;
        if (
          (h || d) &&
          ((d =
            c.window === c
              ? c
              : (d = c.ownerDocument)
              ? d.defaultView || d.parentWindow
              : window),
          h
            ? ((m = n.relatedTarget || n.toElement),
              (h = u),
              (m = m ? ri(m) : null),
              m !== null &&
                ((_ = Si(m)), m !== _ || (m.tag !== 5 && m.tag !== 6)) &&
                (m = null))
            : ((h = null), (m = u)),
          h !== m)
        ) {
          if (
            ((v = Cd),
            (E = "onMouseLeave"),
            (g = "onMouseEnter"),
            (y = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((v = Od),
              (E = "onPointerLeave"),
              (g = "onPointerEnter"),
              (y = "pointer")),
            (_ = h == null ? d : Di(h)),
            (w = m == null ? d : Di(m)),
            (d = new v(E, y + "leave", h, n, c)),
            (d.target = _),
            (d.relatedTarget = w),
            (E = null),
            ri(c) === u &&
              ((v = new v(g, y + "enter", m, n, c)),
              (v.target = w),
              (v.relatedTarget = _),
              (E = v)),
            (_ = E),
            h && m)
          )
            t: {
              for (v = h, g = m, y = 0, w = v; w; w = Pi(w)) y++;
              for (w = 0, E = g; E; E = Pi(E)) w++;
              for (; 0 < y - w; ) (v = Pi(v)), y--;
              for (; 0 < w - y; ) (g = Pi(g)), w--;
              for (; y--; ) {
                if (v === g || (g !== null && v === g.alternate)) break t;
                (v = Pi(v)), (g = Pi(g));
              }
              v = null;
            }
          else v = null;
          h !== null && Bd(f, d, h, v, !1),
            m !== null && _ !== null && Bd(f, _, m, v, !0);
        }
      }
      e: {
        if (
          ((d = u ? Di(u) : window),
          (h = d.nodeName && d.nodeName.toLowerCase()),
          h === "select" || (h === "input" && d.type === "file"))
        )
          var k = p1;
        else if (Rd(d))
          if (og) k = v1;
          else {
            k = g1;
            var P = m1;
          }
        else
          (h = d.nodeName) &&
            h.toLowerCase() === "input" &&
            (d.type === "checkbox" || d.type === "radio") &&
            (k = y1);
        if (k && (k = k(e, u))) {
          sg(f, k, n, c);
          break e;
        }
        P && P(e, d, u),
          e === "focusout" &&
            (P = d._wrapperState) &&
            P.controlled &&
            d.type === "number" &&
            hu(d, "number", d.value);
      }
      switch (((P = u ? Di(u) : window), e)) {
        case "focusin":
          (Rd(P) || P.contentEditable === "true") &&
            ((Li = P), (ku = u), (Kr = null));
          break;
        case "focusout":
          Kr = ku = Li = null;
          break;
        case "mousedown":
          Tu = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          (Tu = !1), jd(f, n, c);
          break;
        case "selectionchange":
          if (w1) break;
        case "keydown":
        case "keyup":
          jd(f, n, c);
      }
      var C;
      if (Vc)
        e: {
          switch (e) {
            case "compositionstart":
              var N = "onCompositionStart";
              break e;
            case "compositionend":
              N = "onCompositionEnd";
              break e;
            case "compositionupdate":
              N = "onCompositionUpdate";
              break e;
          }
          N = void 0;
        }
      else
        Ri
          ? ig(e, n) && (N = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (N = "onCompositionStart");
      N &&
        (ng &&
          n.locale !== "ko" &&
          (Ri || N !== "onCompositionStart"
            ? N === "onCompositionEnd" && Ri && (C = tg())
            : ((Cn = c),
              (Hc = "value" in Cn ? Cn.value : Cn.textContent),
              (Ri = !0))),
        (P = sl(u, N)),
        0 < P.length &&
          ((N = new Pd(N, e, null, n, c)),
          f.push({ event: N, listeners: P }),
          C ? (N.data = C) : ((C = rg(n)), C !== null && (N.data = C)))),
        (C = u1 ? c1(e, n) : f1(e, n)) &&
          ((u = sl(u, "onBeforeInput")),
          0 < u.length &&
            ((c = new Pd("onBeforeInput", "beforeinput", null, n, c)),
            f.push({ event: c, listeners: u }),
            (c.data = C)));
    }
    gg(f, t);
  });
}
function gs(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function sl(e, t) {
  for (var n = t + "Capture", i = []; e !== null; ) {
    var r = e,
      s = r.stateNode;
    r.tag === 5 &&
      s !== null &&
      ((r = s),
      (s = us(e, n)),
      s != null && i.unshift(gs(e, s, r)),
      (s = us(e, t)),
      s != null && i.push(gs(e, s, r))),
      (e = e.return);
  }
  return i;
}
function Pi(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Bd(e, t, n, i, r) {
  for (var s = t._reactName, o = []; n !== null && n !== i; ) {
    var l = n,
      a = l.alternate,
      u = l.stateNode;
    if (a !== null && a === i) break;
    l.tag === 5 &&
      u !== null &&
      ((l = u),
      r
        ? ((a = us(n, s)), a != null && o.unshift(gs(n, a, l)))
        : r || ((a = us(n, s)), a != null && o.push(gs(n, a, l)))),
      (n = n.return);
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var k1 = /\r\n?/g,
  T1 = /\u0000|\uFFFD/g;
function Hd(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      k1,
      `
`
    )
    .replace(T1, "");
}
function co(e, t, n) {
  if (((t = Hd(t)), Hd(e) !== t && n)) throw Error(L(425));
}
function ol() {}
var Cu = null,
  Pu = null;
function Ou(e, t) {
  return (
    e === "textarea" ||
    e === "noscript" ||
    typeof t.children == "string" ||
    typeof t.children == "number" ||
    (typeof t.dangerouslySetInnerHTML == "object" &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var Nu = typeof setTimeout == "function" ? setTimeout : void 0,
  C1 = typeof clearTimeout == "function" ? clearTimeout : void 0,
  Ud = typeof Promise == "function" ? Promise : void 0,
  P1 =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof Ud < "u"
      ? function (e) {
          return Ud.resolve(null).then(e).catch(O1);
        }
      : Nu;
function O1(e) {
  setTimeout(function () {
    throw e;
  });
}
function Ia(e, t) {
  var n = t,
    i = 0;
  do {
    var r = n.nextSibling;
    if ((e.removeChild(n), r && r.nodeType === 8))
      if (((n = r.data), n === "/$")) {
        if (i === 0) {
          e.removeChild(r), ds(t);
          return;
        }
        i--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || i++;
    n = r;
  } while (n);
  ds(t);
}
function In(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function Wd(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var or = Math.random().toString(36).slice(2),
  qt = "__reactFiber$" + or,
  ys = "__reactProps$" + or,
  dn = "__reactContainer$" + or,
  Mu = "__reactEvents$" + or,
  N1 = "__reactListeners$" + or,
  M1 = "__reactHandles$" + or;
function ri(e) {
  var t = e[qt];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[dn] || n[qt])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = Wd(e); e !== null; ) {
          if ((n = e[qt])) return n;
          e = Wd(e);
        }
      return t;
    }
    (e = n), (n = e.parentNode);
  }
  return null;
}
function js(e) {
  return (
    (e = e[qt] || e[dn]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function Di(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(L(33));
}
function Hl(e) {
  return e[ys] || null;
}
var Ru = [],
  Ai = -1;
function Xn(e) {
  return { current: e };
}
function le(e) {
  0 > Ai || ((e.current = Ru[Ai]), (Ru[Ai] = null), Ai--);
}
function se(e, t) {
  Ai++, (Ru[Ai] = e.current), (e.current = t);
}
var Un = {},
  Ue = Xn(Un),
  et = Xn(!1),
  pi = Un;
function Qi(e, t) {
  var n = e.type.contextTypes;
  if (!n) return Un;
  var i = e.stateNode;
  if (i && i.__reactInternalMemoizedUnmaskedChildContext === t)
    return i.__reactInternalMemoizedMaskedChildContext;
  var r = {},
    s;
  for (s in n) r[s] = t[s];
  return (
    i &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = r)),
    r
  );
}
function tt(e) {
  return (e = e.childContextTypes), e != null;
}
function ll() {
  le(et), le(Ue);
}
function Vd(e, t, n) {
  if (Ue.current !== Un) throw Error(L(168));
  se(Ue, t), se(et, n);
}
function vg(e, t, n) {
  var i = e.stateNode;
  if (((t = t.childContextTypes), typeof i.getChildContext != "function"))
    return n;
  i = i.getChildContext();
  for (var r in i) if (!(r in t)) throw Error(L(108, mx(e) || "Unknown", r));
  return de({}, n, i);
}
function al(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || Un),
    (pi = Ue.current),
    se(Ue, e),
    se(et, et.current),
    !0
  );
}
function $d(e, t, n) {
  var i = e.stateNode;
  if (!i) throw Error(L(169));
  n
    ? ((e = vg(e, t, pi)),
      (i.__reactInternalMemoizedMergedChildContext = e),
      le(et),
      le(Ue),
      se(Ue, e))
    : le(et),
    se(et, n);
}
var on = null,
  Ul = !1,
  Da = !1;
function xg(e) {
  on === null ? (on = [e]) : on.push(e);
}
function R1(e) {
  (Ul = !0), xg(e);
}
function Kn() {
  if (!Da && on !== null) {
    Da = !0;
    var e = 0,
      t = ne;
    try {
      var n = on;
      for (ne = 1; e < n.length; e++) {
        var i = n[e];
        do i = i(!0);
        while (i !== null);
      }
      (on = null), (Ul = !1);
    } catch (r) {
      throw (on !== null && (on = on.slice(e + 1)), Vm(jc, Kn), r);
    } finally {
      (ne = t), (Da = !1);
    }
  }
  return null;
}
var ji = [],
  zi = 0,
  ul = null,
  cl = 0,
  yt = [],
  vt = 0,
  mi = null,
  an = 1,
  un = "";
function ti(e, t) {
  (ji[zi++] = cl), (ji[zi++] = ul), (ul = e), (cl = t);
}
function _g(e, t, n) {
  (yt[vt++] = an), (yt[vt++] = un), (yt[vt++] = mi), (mi = e);
  var i = an;
  e = un;
  var r = 32 - Dt(i) - 1;
  (i &= ~(1 << r)), (n += 1);
  var s = 32 - Dt(t) + r;
  if (30 < s) {
    var o = r - (r % 5);
    (s = (i & ((1 << o) - 1)).toString(32)),
      (i >>= o),
      (r -= o),
      (an = (1 << (32 - Dt(t) + r)) | (n << r) | i),
      (un = s + e);
  } else (an = (1 << s) | (n << r) | i), (un = e);
}
function Yc(e) {
  e.return !== null && (ti(e, 1), _g(e, 1, 0));
}
function Xc(e) {
  for (; e === ul; )
    (ul = ji[--zi]), (ji[zi] = null), (cl = ji[--zi]), (ji[zi] = null);
  for (; e === mi; )
    (mi = yt[--vt]),
      (yt[vt] = null),
      (un = yt[--vt]),
      (yt[vt] = null),
      (an = yt[--vt]),
      (yt[vt] = null);
}
var at = null,
  lt = null,
  ue = !1,
  Rt = null;
function wg(e, t) {
  var n = xt(5, null, null, 0);
  (n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n);
}
function Yd(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (at = e), (lt = In(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (at = e), (lt = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = mi !== null ? { id: an, overflow: un } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = xt(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (at = e),
            (lt = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function Lu(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Iu(e) {
  if (ue) {
    var t = lt;
    if (t) {
      var n = t;
      if (!Yd(e, t)) {
        if (Lu(e)) throw Error(L(418));
        t = In(n.nextSibling);
        var i = at;
        t && Yd(e, t)
          ? wg(i, n)
          : ((e.flags = (e.flags & -4097) | 2), (ue = !1), (at = e));
      }
    } else {
      if (Lu(e)) throw Error(L(418));
      (e.flags = (e.flags & -4097) | 2), (ue = !1), (at = e);
    }
  }
}
function Xd(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  at = e;
}
function fo(e) {
  if (e !== at) return !1;
  if (!ue) return Xd(e), (ue = !0), !1;
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !Ou(e.type, e.memoizedProps))),
    t && (t = lt))
  ) {
    if (Lu(e)) throw (Sg(), Error(L(418)));
    for (; t; ) wg(e, t), (t = In(t.nextSibling));
  }
  if ((Xd(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(L(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              lt = In(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      lt = null;
    }
  } else lt = at ? In(e.stateNode.nextSibling) : null;
  return !0;
}
function Sg() {
  for (var e = lt; e; ) e = In(e.nextSibling);
}
function Gi() {
  (lt = at = null), (ue = !1);
}
function Kc(e) {
  Rt === null ? (Rt = [e]) : Rt.push(e);
}
var L1 = gn.ReactCurrentBatchConfig;
function kr(e, t, n) {
  if (
    ((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(L(309));
        var i = n.stateNode;
      }
      if (!i) throw Error(L(147, e));
      var r = i,
        s = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === s
        ? t.ref
        : ((t = function (o) {
            var l = r.refs;
            o === null ? delete l[s] : (l[s] = o);
          }),
          (t._stringRef = s),
          t);
    }
    if (typeof e != "string") throw Error(L(284));
    if (!n._owner) throw Error(L(290, e));
  }
  return e;
}
function ho(e, t) {
  throw (
    ((e = Object.prototype.toString.call(t)),
    Error(
      L(
        31,
        e === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : e
      )
    ))
  );
}
function Kd(e) {
  var t = e._init;
  return t(e._payload);
}
function bg(e) {
  function t(g, y) {
    if (e) {
      var w = g.deletions;
      w === null ? ((g.deletions = [y]), (g.flags |= 16)) : w.push(y);
    }
  }
  function n(g, y) {
    if (!e) return null;
    for (; y !== null; ) t(g, y), (y = y.sibling);
    return null;
  }
  function i(g, y) {
    for (g = new Map(); y !== null; )
      y.key !== null ? g.set(y.key, y) : g.set(y.index, y), (y = y.sibling);
    return g;
  }
  function r(g, y) {
    return (g = zn(g, y)), (g.index = 0), (g.sibling = null), g;
  }
  function s(g, y, w) {
    return (
      (g.index = w),
      e
        ? ((w = g.alternate),
          w !== null
            ? ((w = w.index), w < y ? ((g.flags |= 2), y) : w)
            : ((g.flags |= 2), y))
        : ((g.flags |= 1048576), y)
    );
  }
  function o(g) {
    return e && g.alternate === null && (g.flags |= 2), g;
  }
  function l(g, y, w, E) {
    return y === null || y.tag !== 6
      ? ((y = Ua(w, g.mode, E)), (y.return = g), y)
      : ((y = r(y, w)), (y.return = g), y);
  }
  function a(g, y, w, E) {
    var k = w.type;
    return k === Mi
      ? c(g, y, w.props.children, E, w.key)
      : y !== null &&
        (y.elementType === k ||
          (typeof k == "object" &&
            k !== null &&
            k.$$typeof === bn &&
            Kd(k) === y.type))
      ? ((E = r(y, w.props)), (E.ref = kr(g, y, w)), (E.return = g), E)
      : ((E = Vo(w.type, w.key, w.props, null, g.mode, E)),
        (E.ref = kr(g, y, w)),
        (E.return = g),
        E);
  }
  function u(g, y, w, E) {
    return y === null ||
      y.tag !== 4 ||
      y.stateNode.containerInfo !== w.containerInfo ||
      y.stateNode.implementation !== w.implementation
      ? ((y = Wa(w, g.mode, E)), (y.return = g), y)
      : ((y = r(y, w.children || [])), (y.return = g), y);
  }
  function c(g, y, w, E, k) {
    return y === null || y.tag !== 7
      ? ((y = fi(w, g.mode, E, k)), (y.return = g), y)
      : ((y = r(y, w)), (y.return = g), y);
  }
  function f(g, y, w) {
    if ((typeof y == "string" && y !== "") || typeof y == "number")
      return (y = Ua("" + y, g.mode, w)), (y.return = g), y;
    if (typeof y == "object" && y !== null) {
      switch (y.$$typeof) {
        case to:
          return (
            (w = Vo(y.type, y.key, y.props, null, g.mode, w)),
            (w.ref = kr(g, null, y)),
            (w.return = g),
            w
          );
        case Ni:
          return (y = Wa(y, g.mode, w)), (y.return = g), y;
        case bn:
          var E = y._init;
          return f(g, E(y._payload), w);
      }
      if (Dr(y) || _r(y))
        return (y = fi(y, g.mode, w, null)), (y.return = g), y;
      ho(g, y);
    }
    return null;
  }
  function d(g, y, w, E) {
    var k = y !== null ? y.key : null;
    if ((typeof w == "string" && w !== "") || typeof w == "number")
      return k !== null ? null : l(g, y, "" + w, E);
    if (typeof w == "object" && w !== null) {
      switch (w.$$typeof) {
        case to:
          return w.key === k ? a(g, y, w, E) : null;
        case Ni:
          return w.key === k ? u(g, y, w, E) : null;
        case bn:
          return (k = w._init), d(g, y, k(w._payload), E);
      }
      if (Dr(w) || _r(w)) return k !== null ? null : c(g, y, w, E, null);
      ho(g, w);
    }
    return null;
  }
  function h(g, y, w, E, k) {
    if ((typeof E == "string" && E !== "") || typeof E == "number")
      return (g = g.get(w) || null), l(y, g, "" + E, k);
    if (typeof E == "object" && E !== null) {
      switch (E.$$typeof) {
        case to:
          return (g = g.get(E.key === null ? w : E.key) || null), a(y, g, E, k);
        case Ni:
          return (g = g.get(E.key === null ? w : E.key) || null), u(y, g, E, k);
        case bn:
          var P = E._init;
          return h(g, y, w, P(E._payload), k);
      }
      if (Dr(E) || _r(E)) return (g = g.get(w) || null), c(y, g, E, k, null);
      ho(y, E);
    }
    return null;
  }
  function m(g, y, w, E) {
    for (
      var k = null, P = null, C = y, N = (y = 0), I = null;
      C !== null && N < w.length;
      N++
    ) {
      C.index > N ? ((I = C), (C = null)) : (I = C.sibling);
      var D = d(g, C, w[N], E);
      if (D === null) {
        C === null && (C = I);
        break;
      }
      e && C && D.alternate === null && t(g, C),
        (y = s(D, y, N)),
        P === null ? (k = D) : (P.sibling = D),
        (P = D),
        (C = I);
    }
    if (N === w.length) return n(g, C), ue && ti(g, N), k;
    if (C === null) {
      for (; N < w.length; N++)
        (C = f(g, w[N], E)),
          C !== null &&
            ((y = s(C, y, N)), P === null ? (k = C) : (P.sibling = C), (P = C));
      return ue && ti(g, N), k;
    }
    for (C = i(g, C); N < w.length; N++)
      (I = h(C, g, N, w[N], E)),
        I !== null &&
          (e && I.alternate !== null && C.delete(I.key === null ? N : I.key),
          (y = s(I, y, N)),
          P === null ? (k = I) : (P.sibling = I),
          (P = I));
    return (
      e &&
        C.forEach(function (F) {
          return t(g, F);
        }),
      ue && ti(g, N),
      k
    );
  }
  function v(g, y, w, E) {
    var k = _r(w);
    if (typeof k != "function") throw Error(L(150));
    if (((w = k.call(w)), w == null)) throw Error(L(151));
    for (
      var P = (k = null), C = y, N = (y = 0), I = null, D = w.next();
      C !== null && !D.done;
      N++, D = w.next()
    ) {
      C.index > N ? ((I = C), (C = null)) : (I = C.sibling);
      var F = d(g, C, D.value, E);
      if (F === null) {
        C === null && (C = I);
        break;
      }
      e && C && F.alternate === null && t(g, C),
        (y = s(F, y, N)),
        P === null ? (k = F) : (P.sibling = F),
        (P = F),
        (C = I);
    }
    if (D.done) return n(g, C), ue && ti(g, N), k;
    if (C === null) {
      for (; !D.done; N++, D = w.next())
        (D = f(g, D.value, E)),
          D !== null &&
            ((y = s(D, y, N)), P === null ? (k = D) : (P.sibling = D), (P = D));
      return ue && ti(g, N), k;
    }
    for (C = i(g, C); !D.done; N++, D = w.next())
      (D = h(C, g, N, D.value, E)),
        D !== null &&
          (e && D.alternate !== null && C.delete(D.key === null ? N : D.key),
          (y = s(D, y, N)),
          P === null ? (k = D) : (P.sibling = D),
          (P = D));
    return (
      e &&
        C.forEach(function (B) {
          return t(g, B);
        }),
      ue && ti(g, N),
      k
    );
  }
  function _(g, y, w, E) {
    if (
      (typeof w == "object" &&
        w !== null &&
        w.type === Mi &&
        w.key === null &&
        (w = w.props.children),
      typeof w == "object" && w !== null)
    ) {
      switch (w.$$typeof) {
        case to:
          e: {
            for (var k = w.key, P = y; P !== null; ) {
              if (P.key === k) {
                if (((k = w.type), k === Mi)) {
                  if (P.tag === 7) {
                    n(g, P.sibling),
                      (y = r(P, w.props.children)),
                      (y.return = g),
                      (g = y);
                    break e;
                  }
                } else if (
                  P.elementType === k ||
                  (typeof k == "object" &&
                    k !== null &&
                    k.$$typeof === bn &&
                    Kd(k) === P.type)
                ) {
                  n(g, P.sibling),
                    (y = r(P, w.props)),
                    (y.ref = kr(g, P, w)),
                    (y.return = g),
                    (g = y);
                  break e;
                }
                n(g, P);
                break;
              } else t(g, P);
              P = P.sibling;
            }
            w.type === Mi
              ? ((y = fi(w.props.children, g.mode, E, w.key)),
                (y.return = g),
                (g = y))
              : ((E = Vo(w.type, w.key, w.props, null, g.mode, E)),
                (E.ref = kr(g, y, w)),
                (E.return = g),
                (g = E));
          }
          return o(g);
        case Ni:
          e: {
            for (P = w.key; y !== null; ) {
              if (y.key === P)
                if (
                  y.tag === 4 &&
                  y.stateNode.containerInfo === w.containerInfo &&
                  y.stateNode.implementation === w.implementation
                ) {
                  n(g, y.sibling),
                    (y = r(y, w.children || [])),
                    (y.return = g),
                    (g = y);
                  break e;
                } else {
                  n(g, y);
                  break;
                }
              else t(g, y);
              y = y.sibling;
            }
            (y = Wa(w, g.mode, E)), (y.return = g), (g = y);
          }
          return o(g);
        case bn:
          return (P = w._init), _(g, y, P(w._payload), E);
      }
      if (Dr(w)) return m(g, y, w, E);
      if (_r(w)) return v(g, y, w, E);
      ho(g, w);
    }
    return (typeof w == "string" && w !== "") || typeof w == "number"
      ? ((w = "" + w),
        y !== null && y.tag === 6
          ? (n(g, y.sibling), (y = r(y, w)), (y.return = g), (g = y))
          : (n(g, y), (y = Ua(w, g.mode, E)), (y.return = g), (g = y)),
        o(g))
      : n(g, y);
  }
  return _;
}
var Zi = bg(!0),
  Eg = bg(!1),
  fl = Xn(null),
  dl = null,
  Fi = null,
  qc = null;
function Qc() {
  qc = Fi = dl = null;
}
function Gc(e) {
  var t = fl.current;
  le(fl), (e._currentValue = t);
}
function Du(e, t, n) {
  for (; e !== null; ) {
    var i = e.alternate;
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), i !== null && (i.childLanes |= t))
        : i !== null && (i.childLanes & t) !== t && (i.childLanes |= t),
      e === n)
    )
      break;
    e = e.return;
  }
}
function Yi(e, t) {
  (dl = e),
    (qc = Fi = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      (e.lanes & t && (Je = !0), (e.firstContext = null));
}
function bt(e) {
  var t = e._currentValue;
  if (qc !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), Fi === null)) {
      if (dl === null) throw Error(L(308));
      (Fi = e), (dl.dependencies = { lanes: 0, firstContext: e });
    } else Fi = Fi.next = e;
  return t;
}
var si = null;
function Zc(e) {
  si === null ? (si = [e]) : si.push(e);
}
function kg(e, t, n, i) {
  var r = t.interleaved;
  return (
    r === null ? ((n.next = n), Zc(t)) : ((n.next = r.next), (r.next = n)),
    (t.interleaved = n),
    hn(e, i)
  );
}
function hn(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
    (e.childLanes |= t),
      (n = e.alternate),
      n !== null && (n.childLanes |= t),
      (n = e),
      (e = e.return);
  return n.tag === 3 ? n.stateNode : null;
}
var En = !1;
function Jc(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function Tg(e, t) {
  (e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      });
}
function cn(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function Dn(e, t, n) {
  var i = e.updateQueue;
  if (i === null) return null;
  if (((i = i.shared), J & 2)) {
    var r = i.pending;
    return (
      r === null ? (t.next = t) : ((t.next = r.next), (r.next = t)),
      (i.pending = t),
      hn(e, n)
    );
  }
  return (
    (r = i.interleaved),
    r === null ? ((t.next = t), Zc(i)) : ((t.next = r.next), (r.next = t)),
    (i.interleaved = t),
    hn(e, n)
  );
}
function zo(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
  ) {
    var i = t.lanes;
    (i &= e.pendingLanes), (n |= i), (t.lanes = n), zc(e, n);
  }
}
function qd(e, t) {
  var n = e.updateQueue,
    i = e.alternate;
  if (i !== null && ((i = i.updateQueue), n === i)) {
    var r = null,
      s = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var o = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        s === null ? (r = s = o) : (s = s.next = o), (n = n.next);
      } while (n !== null);
      s === null ? (r = s = t) : (s = s.next = t);
    } else r = s = t;
    (n = {
      baseState: i.baseState,
      firstBaseUpdate: r,
      lastBaseUpdate: s,
      shared: i.shared,
      effects: i.effects,
    }),
      (e.updateQueue = n);
    return;
  }
  (e = n.lastBaseUpdate),
    e === null ? (n.firstBaseUpdate = t) : (e.next = t),
    (n.lastBaseUpdate = t);
}
function hl(e, t, n, i) {
  var r = e.updateQueue;
  En = !1;
  var s = r.firstBaseUpdate,
    o = r.lastBaseUpdate,
    l = r.shared.pending;
  if (l !== null) {
    r.shared.pending = null;
    var a = l,
      u = a.next;
    (a.next = null), o === null ? (s = u) : (o.next = u), (o = a);
    var c = e.alternate;
    c !== null &&
      ((c = c.updateQueue),
      (l = c.lastBaseUpdate),
      l !== o &&
        (l === null ? (c.firstBaseUpdate = u) : (l.next = u),
        (c.lastBaseUpdate = a)));
  }
  if (s !== null) {
    var f = r.baseState;
    (o = 0), (c = u = a = null), (l = s);
    do {
      var d = l.lane,
        h = l.eventTime;
      if ((i & d) === d) {
        c !== null &&
          (c = c.next =
            {
              eventTime: h,
              lane: 0,
              tag: l.tag,
              payload: l.payload,
              callback: l.callback,
              next: null,
            });
        e: {
          var m = e,
            v = l;
          switch (((d = t), (h = n), v.tag)) {
            case 1:
              if (((m = v.payload), typeof m == "function")) {
                f = m.call(h, f, d);
                break e;
              }
              f = m;
              break e;
            case 3:
              m.flags = (m.flags & -65537) | 128;
            case 0:
              if (
                ((m = v.payload),
                (d = typeof m == "function" ? m.call(h, f, d) : m),
                d == null)
              )
                break e;
              f = de({}, f, d);
              break e;
            case 2:
              En = !0;
          }
        }
        l.callback !== null &&
          l.lane !== 0 &&
          ((e.flags |= 64),
          (d = r.effects),
          d === null ? (r.effects = [l]) : d.push(l));
      } else
        (h = {
          eventTime: h,
          lane: d,
          tag: l.tag,
          payload: l.payload,
          callback: l.callback,
          next: null,
        }),
          c === null ? ((u = c = h), (a = f)) : (c = c.next = h),
          (o |= d);
      if (((l = l.next), l === null)) {
        if (((l = r.shared.pending), l === null)) break;
        (d = l),
          (l = d.next),
          (d.next = null),
          (r.lastBaseUpdate = d),
          (r.shared.pending = null);
      }
    } while (!0);
    if (
      (c === null && (a = f),
      (r.baseState = a),
      (r.firstBaseUpdate = u),
      (r.lastBaseUpdate = c),
      (t = r.shared.interleaved),
      t !== null)
    ) {
      r = t;
      do (o |= r.lane), (r = r.next);
      while (r !== t);
    } else s === null && (r.shared.lanes = 0);
    (yi |= o), (e.lanes = o), (e.memoizedState = f);
  }
}
function Qd(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var i = e[t],
        r = i.callback;
      if (r !== null) {
        if (((i.callback = null), (i = n), typeof r != "function"))
          throw Error(L(191, r));
        r.call(i);
      }
    }
}
var zs = {},
  Gt = Xn(zs),
  vs = Xn(zs),
  xs = Xn(zs);
function oi(e) {
  if (e === zs) throw Error(L(174));
  return e;
}
function ef(e, t) {
  switch ((se(xs, t), se(vs, e), se(Gt, zs), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : mu(null, "");
      break;
    default:
      (e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = mu(t, e));
  }
  le(Gt), se(Gt, t);
}
function Ji() {
  le(Gt), le(vs), le(xs);
}
function Cg(e) {
  oi(xs.current);
  var t = oi(Gt.current),
    n = mu(t, e.type);
  t !== n && (se(vs, e), se(Gt, n));
}
function tf(e) {
  vs.current === e && (le(Gt), le(vs));
}
var ce = Xn(0);
function pl(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (
        n !== null &&
        ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
      )
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      (t.child.return = t), (t = t.child);
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    (t.sibling.return = t.return), (t = t.sibling);
  }
  return null;
}
var Aa = [];
function nf() {
  for (var e = 0; e < Aa.length; e++)
    Aa[e]._workInProgressVersionPrimary = null;
  Aa.length = 0;
}
var Fo = gn.ReactCurrentDispatcher,
  ja = gn.ReactCurrentBatchConfig,
  gi = 0,
  fe = null,
  ke = null,
  Pe = null,
  ml = !1,
  qr = !1,
  _s = 0,
  I1 = 0;
function je() {
  throw Error(L(321));
}
function rf(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!jt(e[n], t[n])) return !1;
  return !0;
}
function sf(e, t, n, i, r, s) {
  if (
    ((gi = s),
    (fe = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (Fo.current = e === null || e.memoizedState === null ? z1 : F1),
    (e = n(i, r)),
    qr)
  ) {
    s = 0;
    do {
      if (((qr = !1), (_s = 0), 25 <= s)) throw Error(L(301));
      (s += 1),
        (Pe = ke = null),
        (t.updateQueue = null),
        (Fo.current = B1),
        (e = n(i, r));
    } while (qr);
  }
  if (
    ((Fo.current = gl),
    (t = ke !== null && ke.next !== null),
    (gi = 0),
    (Pe = ke = fe = null),
    (ml = !1),
    t)
  )
    throw Error(L(300));
  return e;
}
function of() {
  var e = _s !== 0;
  return (_s = 0), e;
}
function $t() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return Pe === null ? (fe.memoizedState = Pe = e) : (Pe = Pe.next = e), Pe;
}
function Et() {
  if (ke === null) {
    var e = fe.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = ke.next;
  var t = Pe === null ? fe.memoizedState : Pe.next;
  if (t !== null) (Pe = t), (ke = e);
  else {
    if (e === null) throw Error(L(310));
    (ke = e),
      (e = {
        memoizedState: ke.memoizedState,
        baseState: ke.baseState,
        baseQueue: ke.baseQueue,
        queue: ke.queue,
        next: null,
      }),
      Pe === null ? (fe.memoizedState = Pe = e) : (Pe = Pe.next = e);
  }
  return Pe;
}
function ws(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function za(e) {
  var t = Et(),
    n = t.queue;
  if (n === null) throw Error(L(311));
  n.lastRenderedReducer = e;
  var i = ke,
    r = i.baseQueue,
    s = n.pending;
  if (s !== null) {
    if (r !== null) {
      var o = r.next;
      (r.next = s.next), (s.next = o);
    }
    (i.baseQueue = r = s), (n.pending = null);
  }
  if (r !== null) {
    (s = r.next), (i = i.baseState);
    var l = (o = null),
      a = null,
      u = s;
    do {
      var c = u.lane;
      if ((gi & c) === c)
        a !== null &&
          (a = a.next =
            {
              lane: 0,
              action: u.action,
              hasEagerState: u.hasEagerState,
              eagerState: u.eagerState,
              next: null,
            }),
          (i = u.hasEagerState ? u.eagerState : e(i, u.action));
      else {
        var f = {
          lane: c,
          action: u.action,
          hasEagerState: u.hasEagerState,
          eagerState: u.eagerState,
          next: null,
        };
        a === null ? ((l = a = f), (o = i)) : (a = a.next = f),
          (fe.lanes |= c),
          (yi |= c);
      }
      u = u.next;
    } while (u !== null && u !== s);
    a === null ? (o = i) : (a.next = l),
      jt(i, t.memoizedState) || (Je = !0),
      (t.memoizedState = i),
      (t.baseState = o),
      (t.baseQueue = a),
      (n.lastRenderedState = i);
  }
  if (((e = n.interleaved), e !== null)) {
    r = e;
    do (s = r.lane), (fe.lanes |= s), (yi |= s), (r = r.next);
    while (r !== e);
  } else r === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function Fa(e) {
  var t = Et(),
    n = t.queue;
  if (n === null) throw Error(L(311));
  n.lastRenderedReducer = e;
  var i = n.dispatch,
    r = n.pending,
    s = t.memoizedState;
  if (r !== null) {
    n.pending = null;
    var o = (r = r.next);
    do (s = e(s, o.action)), (o = o.next);
    while (o !== r);
    jt(s, t.memoizedState) || (Je = !0),
      (t.memoizedState = s),
      t.baseQueue === null && (t.baseState = s),
      (n.lastRenderedState = s);
  }
  return [s, i];
}
function Pg() {}
function Og(e, t) {
  var n = fe,
    i = Et(),
    r = t(),
    s = !jt(i.memoizedState, r);
  if (
    (s && ((i.memoizedState = r), (Je = !0)),
    (i = i.queue),
    lf(Rg.bind(null, n, i, e), [e]),
    i.getSnapshot !== t || s || (Pe !== null && Pe.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      Ss(9, Mg.bind(null, n, i, r, t), void 0, null),
      Ne === null)
    )
      throw Error(L(349));
    gi & 30 || Ng(n, t, r);
  }
  return r;
}
function Ng(e, t, n) {
  (e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = fe.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (fe.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e));
}
function Mg(e, t, n, i) {
  (t.value = n), (t.getSnapshot = i), Lg(t) && Ig(e);
}
function Rg(e, t, n) {
  return n(function () {
    Lg(t) && Ig(e);
  });
}
function Lg(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !jt(e, n);
  } catch {
    return !0;
  }
}
function Ig(e) {
  var t = hn(e, 1);
  t !== null && At(t, e, 1, -1);
}
function Gd(e) {
  var t = $t();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: ws,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = j1.bind(null, fe, e)),
    [t.memoizedState, e]
  );
}
function Ss(e, t, n, i) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: i, next: null }),
    (t = fe.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (fe.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((i = n.next), (n.next = e), (e.next = i), (t.lastEffect = e))),
    e
  );
}
function Dg() {
  return Et().memoizedState;
}
function Bo(e, t, n, i) {
  var r = $t();
  (fe.flags |= e),
    (r.memoizedState = Ss(1 | t, n, void 0, i === void 0 ? null : i));
}
function Wl(e, t, n, i) {
  var r = Et();
  i = i === void 0 ? null : i;
  var s = void 0;
  if (ke !== null) {
    var o = ke.memoizedState;
    if (((s = o.destroy), i !== null && rf(i, o.deps))) {
      r.memoizedState = Ss(t, n, s, i);
      return;
    }
  }
  (fe.flags |= e), (r.memoizedState = Ss(1 | t, n, s, i));
}
function Zd(e, t) {
  return Bo(8390656, 8, e, t);
}
function lf(e, t) {
  return Wl(2048, 8, e, t);
}
function Ag(e, t) {
  return Wl(4, 2, e, t);
}
function jg(e, t) {
  return Wl(4, 4, e, t);
}
function zg(e, t) {
  if (typeof t == "function")
    return (
      (e = e()),
      t(e),
      function () {
        t(null);
      }
    );
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null;
      }
    );
}
function Fg(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null), Wl(4, 4, zg.bind(null, t, e), n)
  );
}
function af() {}
function Bg(e, t) {
  var n = Et();
  t = t === void 0 ? null : t;
  var i = n.memoizedState;
  return i !== null && t !== null && rf(t, i[1])
    ? i[0]
    : ((n.memoizedState = [e, t]), e);
}
function Hg(e, t) {
  var n = Et();
  t = t === void 0 ? null : t;
  var i = n.memoizedState;
  return i !== null && t !== null && rf(t, i[1])
    ? i[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function Ug(e, t, n) {
  return gi & 21
    ? (jt(n, t) || ((n = Xm()), (fe.lanes |= n), (yi |= n), (e.baseState = !0)),
      t)
    : (e.baseState && ((e.baseState = !1), (Je = !0)), (e.memoizedState = n));
}
function D1(e, t) {
  var n = ne;
  (ne = n !== 0 && 4 > n ? n : 4), e(!0);
  var i = ja.transition;
  ja.transition = {};
  try {
    e(!1), t();
  } finally {
    (ne = n), (ja.transition = i);
  }
}
function Wg() {
  return Et().memoizedState;
}
function A1(e, t, n) {
  var i = jn(e);
  if (
    ((n = {
      lane: i,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    Vg(e))
  )
    $g(t, n);
  else if (((n = kg(e, t, n, i)), n !== null)) {
    var r = $e();
    At(n, e, i, r), Yg(n, t, i);
  }
}
function j1(e, t, n) {
  var i = jn(e),
    r = { lane: i, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Vg(e)) $g(t, r);
  else {
    var s = e.alternate;
    if (
      e.lanes === 0 &&
      (s === null || s.lanes === 0) &&
      ((s = t.lastRenderedReducer), s !== null)
    )
      try {
        var o = t.lastRenderedState,
          l = s(o, n);
        if (((r.hasEagerState = !0), (r.eagerState = l), jt(l, o))) {
          var a = t.interleaved;
          a === null
            ? ((r.next = r), Zc(t))
            : ((r.next = a.next), (a.next = r)),
            (t.interleaved = r);
          return;
        }
      } catch {
      } finally {
      }
    (n = kg(e, t, r, i)),
      n !== null && ((r = $e()), At(n, e, i, r), Yg(n, t, i));
  }
}
function Vg(e) {
  var t = e.alternate;
  return e === fe || (t !== null && t === fe);
}
function $g(e, t) {
  qr = ml = !0;
  var n = e.pending;
  n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t);
}
function Yg(e, t, n) {
  if (n & 4194240) {
    var i = t.lanes;
    (i &= e.pendingLanes), (n |= i), (t.lanes = n), zc(e, n);
  }
}
var gl = {
    readContext: bt,
    useCallback: je,
    useContext: je,
    useEffect: je,
    useImperativeHandle: je,
    useInsertionEffect: je,
    useLayoutEffect: je,
    useMemo: je,
    useReducer: je,
    useRef: je,
    useState: je,
    useDebugValue: je,
    useDeferredValue: je,
    useTransition: je,
    useMutableSource: je,
    useSyncExternalStore: je,
    useId: je,
    unstable_isNewReconciler: !1,
  },
  z1 = {
    readContext: bt,
    useCallback: function (e, t) {
      return ($t().memoizedState = [e, t === void 0 ? null : t]), e;
    },
    useContext: bt,
    useEffect: Zd,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        Bo(4194308, 4, zg.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return Bo(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return Bo(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = $t();
      return (
        (t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e
      );
    },
    useReducer: function (e, t, n) {
      var i = $t();
      return (
        (t = n !== void 0 ? n(t) : t),
        (i.memoizedState = i.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (i.queue = e),
        (e = e.dispatch = A1.bind(null, fe, e)),
        [i.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = $t();
      return (e = { current: e }), (t.memoizedState = e);
    },
    useState: Gd,
    useDebugValue: af,
    useDeferredValue: function (e) {
      return ($t().memoizedState = e);
    },
    useTransition: function () {
      var e = Gd(!1),
        t = e[0];
      return (e = D1.bind(null, e[1])), ($t().memoizedState = e), [t, e];
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var i = fe,
        r = $t();
      if (ue) {
        if (n === void 0) throw Error(L(407));
        n = n();
      } else {
        if (((n = t()), Ne === null)) throw Error(L(349));
        gi & 30 || Ng(i, t, n);
      }
      r.memoizedState = n;
      var s = { value: n, getSnapshot: t };
      return (
        (r.queue = s),
        Zd(Rg.bind(null, i, s, e), [e]),
        (i.flags |= 2048),
        Ss(9, Mg.bind(null, i, s, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = $t(),
        t = Ne.identifierPrefix;
      if (ue) {
        var n = un,
          i = an;
        (n = (i & ~(1 << (32 - Dt(i) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = _s++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":");
      } else (n = I1++), (t = ":" + t + "r" + n.toString(32) + ":");
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  F1 = {
    readContext: bt,
    useCallback: Bg,
    useContext: bt,
    useEffect: lf,
    useImperativeHandle: Fg,
    useInsertionEffect: Ag,
    useLayoutEffect: jg,
    useMemo: Hg,
    useReducer: za,
    useRef: Dg,
    useState: function () {
      return za(ws);
    },
    useDebugValue: af,
    useDeferredValue: function (e) {
      var t = Et();
      return Ug(t, ke.memoizedState, e);
    },
    useTransition: function () {
      var e = za(ws)[0],
        t = Et().memoizedState;
      return [e, t];
    },
    useMutableSource: Pg,
    useSyncExternalStore: Og,
    useId: Wg,
    unstable_isNewReconciler: !1,
  },
  B1 = {
    readContext: bt,
    useCallback: Bg,
    useContext: bt,
    useEffect: lf,
    useImperativeHandle: Fg,
    useInsertionEffect: Ag,
    useLayoutEffect: jg,
    useMemo: Hg,
    useReducer: Fa,
    useRef: Dg,
    useState: function () {
      return Fa(ws);
    },
    useDebugValue: af,
    useDeferredValue: function (e) {
      var t = Et();
      return ke === null ? (t.memoizedState = e) : Ug(t, ke.memoizedState, e);
    },
    useTransition: function () {
      var e = Fa(ws)[0],
        t = Et().memoizedState;
      return [e, t];
    },
    useMutableSource: Pg,
    useSyncExternalStore: Og,
    useId: Wg,
    unstable_isNewReconciler: !1,
  };
function Nt(e, t) {
  if (e && e.defaultProps) {
    (t = de({}, t)), (e = e.defaultProps);
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function Au(e, t, n, i) {
  (t = e.memoizedState),
    (n = n(i, t)),
    (n = n == null ? t : de({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n);
}
var Vl = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? Si(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var i = $e(),
      r = jn(e),
      s = cn(i, r);
    (s.payload = t),
      n != null && (s.callback = n),
      (t = Dn(e, s, r)),
      t !== null && (At(t, e, r, i), zo(t, e, r));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var i = $e(),
      r = jn(e),
      s = cn(i, r);
    (s.tag = 1),
      (s.payload = t),
      n != null && (s.callback = n),
      (t = Dn(e, s, r)),
      t !== null && (At(t, e, r, i), zo(t, e, r));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = $e(),
      i = jn(e),
      r = cn(n, i);
    (r.tag = 2),
      t != null && (r.callback = t),
      (t = Dn(e, r, i)),
      t !== null && (At(t, e, i, n), zo(t, e, i));
  },
};
function Jd(e, t, n, i, r, s, o) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(i, s, o)
      : t.prototype && t.prototype.isPureReactComponent
      ? !ps(n, i) || !ps(r, s)
      : !0
  );
}
function Xg(e, t, n) {
  var i = !1,
    r = Un,
    s = t.contextType;
  return (
    typeof s == "object" && s !== null
      ? (s = bt(s))
      : ((r = tt(t) ? pi : Ue.current),
        (i = t.contextTypes),
        (s = (i = i != null) ? Qi(e, r) : Un)),
    (t = new t(n, s)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = Vl),
    (e.stateNode = t),
    (t._reactInternals = e),
    i &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = r),
      (e.__reactInternalMemoizedMaskedChildContext = s)),
    t
  );
}
function eh(e, t, n, i) {
  (e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(n, i),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, i),
    t.state !== e && Vl.enqueueReplaceState(t, t.state, null);
}
function ju(e, t, n, i) {
  var r = e.stateNode;
  (r.props = n), (r.state = e.memoizedState), (r.refs = {}), Jc(e);
  var s = t.contextType;
  typeof s == "object" && s !== null
    ? (r.context = bt(s))
    : ((s = tt(t) ? pi : Ue.current), (r.context = Qi(e, s))),
    (r.state = e.memoizedState),
    (s = t.getDerivedStateFromProps),
    typeof s == "function" && (Au(e, t, s, n), (r.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof r.getSnapshotBeforeUpdate == "function" ||
      (typeof r.UNSAFE_componentWillMount != "function" &&
        typeof r.componentWillMount != "function") ||
      ((t = r.state),
      typeof r.componentWillMount == "function" && r.componentWillMount(),
      typeof r.UNSAFE_componentWillMount == "function" &&
        r.UNSAFE_componentWillMount(),
      t !== r.state && Vl.enqueueReplaceState(r, r.state, null),
      hl(e, n, r, i),
      (r.state = e.memoizedState)),
    typeof r.componentDidMount == "function" && (e.flags |= 4194308);
}
function er(e, t) {
  try {
    var n = "",
      i = t;
    do (n += px(i)), (i = i.return);
    while (i);
    var r = n;
  } catch (s) {
    r =
      `
Error generating stack: ` +
      s.message +
      `
` +
      s.stack;
  }
  return { value: e, source: t, stack: r, digest: null };
}
function Ba(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function zu(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var H1 = typeof WeakMap == "function" ? WeakMap : Map;
function Kg(e, t, n) {
  (n = cn(-1, n)), (n.tag = 3), (n.payload = { element: null });
  var i = t.value;
  return (
    (n.callback = function () {
      vl || ((vl = !0), (Ku = i)), zu(e, t);
    }),
    n
  );
}
function qg(e, t, n) {
  (n = cn(-1, n)), (n.tag = 3);
  var i = e.type.getDerivedStateFromError;
  if (typeof i == "function") {
    var r = t.value;
    (n.payload = function () {
      return i(r);
    }),
      (n.callback = function () {
        zu(e, t);
      });
  }
  var s = e.stateNode;
  return (
    s !== null &&
      typeof s.componentDidCatch == "function" &&
      (n.callback = function () {
        zu(e, t),
          typeof i != "function" &&
            (An === null ? (An = new Set([this])) : An.add(this));
        var o = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: o !== null ? o : "",
        });
      }),
    n
  );
}
function th(e, t, n) {
  var i = e.pingCache;
  if (i === null) {
    i = e.pingCache = new H1();
    var r = new Set();
    i.set(t, r);
  } else (r = i.get(t)), r === void 0 && ((r = new Set()), i.set(t, r));
  r.has(n) || (r.add(n), (e = t_.bind(null, e, t, n)), t.then(e, e));
}
function nh(e) {
  do {
    var t;
    if (
      ((t = e.tag === 13) &&
        ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
      t)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function ih(e, t, n, i, r) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = r), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = cn(-1, 1)), (t.tag = 2), Dn(n, t, 1))),
          (n.lanes |= 1)),
      e);
}
var U1 = gn.ReactCurrentOwner,
  Je = !1;
function Ve(e, t, n, i) {
  t.child = e === null ? Eg(t, null, n, i) : Zi(t, e.child, n, i);
}
function rh(e, t, n, i, r) {
  n = n.render;
  var s = t.ref;
  return (
    Yi(t, r),
    (i = sf(e, t, n, i, s, r)),
    (n = of()),
    e !== null && !Je
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~r),
        pn(e, t, r))
      : (ue && n && Yc(t), (t.flags |= 1), Ve(e, t, i, r), t.child)
  );
}
function sh(e, t, n, i, r) {
  if (e === null) {
    var s = n.type;
    return typeof s == "function" &&
      !gf(s) &&
      s.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = s), Qg(e, t, s, i, r))
      : ((e = Vo(n.type, null, i, t, t.mode, r)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((s = e.child), !(e.lanes & r))) {
    var o = s.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : ps), n(o, i) && e.ref === t.ref)
    )
      return pn(e, t, r);
  }
  return (
    (t.flags |= 1),
    (e = zn(s, i)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function Qg(e, t, n, i, r) {
  if (e !== null) {
    var s = e.memoizedProps;
    if (ps(s, i) && e.ref === t.ref)
      if (((Je = !1), (t.pendingProps = i = s), (e.lanes & r) !== 0))
        e.flags & 131072 && (Je = !0);
      else return (t.lanes = e.lanes), pn(e, t, r);
  }
  return Fu(e, t, n, i, r);
}
function Gg(e, t, n) {
  var i = t.pendingProps,
    r = i.children,
    s = e !== null ? e.memoizedState : null;
  if (i.mode === "hidden")
    if (!(t.mode & 1))
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        se(Hi, ot),
        (ot |= n);
    else {
      if (!(n & 1073741824))
        return (
          (e = s !== null ? s.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null,
          }),
          (t.updateQueue = null),
          se(Hi, ot),
          (ot |= e),
          null
        );
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (i = s !== null ? s.baseLanes : n),
        se(Hi, ot),
        (ot |= i);
    }
  else
    s !== null ? ((i = s.baseLanes | n), (t.memoizedState = null)) : (i = n),
      se(Hi, ot),
      (ot |= i);
  return Ve(e, t, r, n), t.child;
}
function Zg(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function Fu(e, t, n, i, r) {
  var s = tt(n) ? pi : Ue.current;
  return (
    (s = Qi(t, s)),
    Yi(t, r),
    (n = sf(e, t, n, i, s, r)),
    (i = of()),
    e !== null && !Je
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~r),
        pn(e, t, r))
      : (ue && i && Yc(t), (t.flags |= 1), Ve(e, t, n, r), t.child)
  );
}
function oh(e, t, n, i, r) {
  if (tt(n)) {
    var s = !0;
    al(t);
  } else s = !1;
  if ((Yi(t, r), t.stateNode === null))
    Ho(e, t), Xg(t, n, i), ju(t, n, i, r), (i = !0);
  else if (e === null) {
    var o = t.stateNode,
      l = t.memoizedProps;
    o.props = l;
    var a = o.context,
      u = n.contextType;
    typeof u == "object" && u !== null
      ? (u = bt(u))
      : ((u = tt(n) ? pi : Ue.current), (u = Qi(t, u)));
    var c = n.getDerivedStateFromProps,
      f =
        typeof c == "function" ||
        typeof o.getSnapshotBeforeUpdate == "function";
    f ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((l !== i || a !== u) && eh(t, o, i, u)),
      (En = !1);
    var d = t.memoizedState;
    (o.state = d),
      hl(t, i, o, r),
      (a = t.memoizedState),
      l !== i || d !== a || et.current || En
        ? (typeof c == "function" && (Au(t, n, c, i), (a = t.memoizedState)),
          (l = En || Jd(t, n, l, i, d, a, u))
            ? (f ||
                (typeof o.UNSAFE_componentWillMount != "function" &&
                  typeof o.componentWillMount != "function") ||
                (typeof o.componentWillMount == "function" &&
                  o.componentWillMount(),
                typeof o.UNSAFE_componentWillMount == "function" &&
                  o.UNSAFE_componentWillMount()),
              typeof o.componentDidMount == "function" && (t.flags |= 4194308))
            : (typeof o.componentDidMount == "function" && (t.flags |= 4194308),
              (t.memoizedProps = i),
              (t.memoizedState = a)),
          (o.props = i),
          (o.state = a),
          (o.context = u),
          (i = l))
        : (typeof o.componentDidMount == "function" && (t.flags |= 4194308),
          (i = !1));
  } else {
    (o = t.stateNode),
      Tg(e, t),
      (l = t.memoizedProps),
      (u = t.type === t.elementType ? l : Nt(t.type, l)),
      (o.props = u),
      (f = t.pendingProps),
      (d = o.context),
      (a = n.contextType),
      typeof a == "object" && a !== null
        ? (a = bt(a))
        : ((a = tt(n) ? pi : Ue.current), (a = Qi(t, a)));
    var h = n.getDerivedStateFromProps;
    (c =
      typeof h == "function" ||
      typeof o.getSnapshotBeforeUpdate == "function") ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((l !== f || d !== a) && eh(t, o, i, a)),
      (En = !1),
      (d = t.memoizedState),
      (o.state = d),
      hl(t, i, o, r);
    var m = t.memoizedState;
    l !== f || d !== m || et.current || En
      ? (typeof h == "function" && (Au(t, n, h, i), (m = t.memoizedState)),
        (u = En || Jd(t, n, u, i, d, m, a) || !1)
          ? (c ||
              (typeof o.UNSAFE_componentWillUpdate != "function" &&
                typeof o.componentWillUpdate != "function") ||
              (typeof o.componentWillUpdate == "function" &&
                o.componentWillUpdate(i, m, a),
              typeof o.UNSAFE_componentWillUpdate == "function" &&
                o.UNSAFE_componentWillUpdate(i, m, a)),
            typeof o.componentDidUpdate == "function" && (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof o.componentDidUpdate != "function" ||
              (l === e.memoizedProps && d === e.memoizedState) ||
              (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate != "function" ||
              (l === e.memoizedProps && d === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = i),
            (t.memoizedState = m)),
        (o.props = i),
        (o.state = m),
        (o.context = a),
        (i = u))
      : (typeof o.componentDidUpdate != "function" ||
          (l === e.memoizedProps && d === e.memoizedState) ||
          (t.flags |= 4),
        typeof o.getSnapshotBeforeUpdate != "function" ||
          (l === e.memoizedProps && d === e.memoizedState) ||
          (t.flags |= 1024),
        (i = !1));
  }
  return Bu(e, t, n, i, s, r);
}
function Bu(e, t, n, i, r, s) {
  Zg(e, t);
  var o = (t.flags & 128) !== 0;
  if (!i && !o) return r && $d(t, n, !1), pn(e, t, s);
  (i = t.stateNode), (U1.current = t);
  var l =
    o && typeof n.getDerivedStateFromError != "function" ? null : i.render();
  return (
    (t.flags |= 1),
    e !== null && o
      ? ((t.child = Zi(t, e.child, null, s)), (t.child = Zi(t, null, l, s)))
      : Ve(e, t, l, s),
    (t.memoizedState = i.state),
    r && $d(t, n, !0),
    t.child
  );
}
function Jg(e) {
  var t = e.stateNode;
  t.pendingContext
    ? Vd(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && Vd(e, t.context, !1),
    ef(e, t.containerInfo);
}
function lh(e, t, n, i, r) {
  return Gi(), Kc(r), (t.flags |= 256), Ve(e, t, n, i), t.child;
}
var Hu = { dehydrated: null, treeContext: null, retryLane: 0 };
function Uu(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function e0(e, t, n) {
  var i = t.pendingProps,
    r = ce.current,
    s = !1,
    o = (t.flags & 128) !== 0,
    l;
  if (
    ((l = o) ||
      (l = e !== null && e.memoizedState === null ? !1 : (r & 2) !== 0),
    l
      ? ((s = !0), (t.flags &= -129))
      : (e === null || e.memoizedState !== null) && (r |= 1),
    se(ce, r & 1),
    e === null)
  )
    return (
      Iu(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (t.mode & 1
            ? e.data === "$!"
              ? (t.lanes = 8)
              : (t.lanes = 1073741824)
            : (t.lanes = 1),
          null)
        : ((o = i.children),
          (e = i.fallback),
          s
            ? ((i = t.mode),
              (s = t.child),
              (o = { mode: "hidden", children: o }),
              !(i & 1) && s !== null
                ? ((s.childLanes = 0), (s.pendingProps = o))
                : (s = Xl(o, i, 0, null)),
              (e = fi(e, i, n, null)),
              (s.return = t),
              (e.return = t),
              (s.sibling = e),
              (t.child = s),
              (t.child.memoizedState = Uu(n)),
              (t.memoizedState = Hu),
              e)
            : uf(t, o))
    );
  if (((r = e.memoizedState), r !== null && ((l = r.dehydrated), l !== null)))
    return W1(e, t, o, i, l, r, n);
  if (s) {
    (s = i.fallback), (o = t.mode), (r = e.child), (l = r.sibling);
    var a = { mode: "hidden", children: i.children };
    return (
      !(o & 1) && t.child !== r
        ? ((i = t.child),
          (i.childLanes = 0),
          (i.pendingProps = a),
          (t.deletions = null))
        : ((i = zn(r, a)), (i.subtreeFlags = r.subtreeFlags & 14680064)),
      l !== null ? (s = zn(l, s)) : ((s = fi(s, o, n, null)), (s.flags |= 2)),
      (s.return = t),
      (i.return = t),
      (i.sibling = s),
      (t.child = i),
      (i = s),
      (s = t.child),
      (o = e.child.memoizedState),
      (o =
        o === null
          ? Uu(n)
          : {
              baseLanes: o.baseLanes | n,
              cachePool: null,
              transitions: o.transitions,
            }),
      (s.memoizedState = o),
      (s.childLanes = e.childLanes & ~n),
      (t.memoizedState = Hu),
      i
    );
  }
  return (
    (s = e.child),
    (e = s.sibling),
    (i = zn(s, { mode: "visible", children: i.children })),
    !(t.mode & 1) && (i.lanes = n),
    (i.return = t),
    (i.sibling = null),
    e !== null &&
      ((n = t.deletions),
      n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
    (t.child = i),
    (t.memoizedState = null),
    i
  );
}
function uf(e, t) {
  return (
    (t = Xl({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function po(e, t, n, i) {
  return (
    i !== null && Kc(i),
    Zi(t, e.child, null, n),
    (e = uf(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function W1(e, t, n, i, r, s, o) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (i = Ba(Error(L(422)))), po(e, t, o, i))
      : t.memoizedState !== null
      ? ((t.child = e.child), (t.flags |= 128), null)
      : ((s = i.fallback),
        (r = t.mode),
        (i = Xl({ mode: "visible", children: i.children }, r, 0, null)),
        (s = fi(s, r, o, null)),
        (s.flags |= 2),
        (i.return = t),
        (s.return = t),
        (i.sibling = s),
        (t.child = i),
        t.mode & 1 && Zi(t, e.child, null, o),
        (t.child.memoizedState = Uu(o)),
        (t.memoizedState = Hu),
        s);
  if (!(t.mode & 1)) return po(e, t, o, null);
  if (r.data === "$!") {
    if (((i = r.nextSibling && r.nextSibling.dataset), i)) var l = i.dgst;
    return (i = l), (s = Error(L(419))), (i = Ba(s, i, void 0)), po(e, t, o, i);
  }
  if (((l = (o & e.childLanes) !== 0), Je || l)) {
    if (((i = Ne), i !== null)) {
      switch (o & -o) {
        case 4:
          r = 2;
          break;
        case 16:
          r = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          r = 32;
          break;
        case 536870912:
          r = 268435456;
          break;
        default:
          r = 0;
      }
      (r = r & (i.suspendedLanes | o) ? 0 : r),
        r !== 0 &&
          r !== s.retryLane &&
          ((s.retryLane = r), hn(e, r), At(i, e, r, -1));
    }
    return mf(), (i = Ba(Error(L(421)))), po(e, t, o, i);
  }
  return r.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = n_.bind(null, e)),
      (r._reactRetry = t),
      null)
    : ((e = s.treeContext),
      (lt = In(r.nextSibling)),
      (at = t),
      (ue = !0),
      (Rt = null),
      e !== null &&
        ((yt[vt++] = an),
        (yt[vt++] = un),
        (yt[vt++] = mi),
        (an = e.id),
        (un = e.overflow),
        (mi = t)),
      (t = uf(t, i.children)),
      (t.flags |= 4096),
      t);
}
function ah(e, t, n) {
  e.lanes |= t;
  var i = e.alternate;
  i !== null && (i.lanes |= t), Du(e.return, t, n);
}
function Ha(e, t, n, i, r) {
  var s = e.memoizedState;
  s === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: n,
        tailMode: r,
      })
    : ((s.isBackwards = t),
      (s.rendering = null),
      (s.renderingStartTime = 0),
      (s.last = i),
      (s.tail = n),
      (s.tailMode = r));
}
function t0(e, t, n) {
  var i = t.pendingProps,
    r = i.revealOrder,
    s = i.tail;
  if ((Ve(e, t, i.children, n), (i = ce.current), i & 2))
    (i = (i & 1) | 2), (t.flags |= 128);
  else {
    if (e !== null && e.flags & 128)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && ah(e, n, t);
        else if (e.tag === 19) ah(e, n, t);
        else if (e.child !== null) {
          (e.child.return = e), (e = e.child);
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        (e.sibling.return = e.return), (e = e.sibling);
      }
    i &= 1;
  }
  if ((se(ce, i), !(t.mode & 1))) t.memoizedState = null;
  else
    switch (r) {
      case "forwards":
        for (n = t.child, r = null; n !== null; )
          (e = n.alternate),
            e !== null && pl(e) === null && (r = n),
            (n = n.sibling);
        (n = r),
          n === null
            ? ((r = t.child), (t.child = null))
            : ((r = n.sibling), (n.sibling = null)),
          Ha(t, !1, r, n, s);
        break;
      case "backwards":
        for (n = null, r = t.child, t.child = null; r !== null; ) {
          if (((e = r.alternate), e !== null && pl(e) === null)) {
            t.child = r;
            break;
          }
          (e = r.sibling), (r.sibling = n), (n = r), (r = e);
        }
        Ha(t, !0, n, null, s);
        break;
      case "together":
        Ha(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function Ho(e, t) {
  !(t.mode & 1) &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function pn(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (yi |= t.lanes),
    !(n & t.childLanes))
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(L(153));
  if (t.child !== null) {
    for (
      e = t.child, n = zn(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;

    )
      (e = e.sibling), (n = n.sibling = zn(e, e.pendingProps)), (n.return = t);
    n.sibling = null;
  }
  return t.child;
}
function V1(e, t, n) {
  switch (t.tag) {
    case 3:
      Jg(t), Gi();
      break;
    case 5:
      Cg(t);
      break;
    case 1:
      tt(t.type) && al(t);
      break;
    case 4:
      ef(t, t.stateNode.containerInfo);
      break;
    case 10:
      var i = t.type._context,
        r = t.memoizedProps.value;
      se(fl, i._currentValue), (i._currentValue = r);
      break;
    case 13:
      if (((i = t.memoizedState), i !== null))
        return i.dehydrated !== null
          ? (se(ce, ce.current & 1), (t.flags |= 128), null)
          : n & t.child.childLanes
          ? e0(e, t, n)
          : (se(ce, ce.current & 1),
            (e = pn(e, t, n)),
            e !== null ? e.sibling : null);
      se(ce, ce.current & 1);
      break;
    case 19:
      if (((i = (n & t.childLanes) !== 0), e.flags & 128)) {
        if (i) return t0(e, t, n);
        t.flags |= 128;
      }
      if (
        ((r = t.memoizedState),
        r !== null &&
          ((r.rendering = null), (r.tail = null), (r.lastEffect = null)),
        se(ce, ce.current),
        i)
      )
        break;
      return null;
    case 22:
    case 23:
      return (t.lanes = 0), Gg(e, t, n);
  }
  return pn(e, t, n);
}
var n0, Wu, i0, r0;
n0 = function (e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      (n.child.return = n), (n = n.child);
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    (n.sibling.return = n.return), (n = n.sibling);
  }
};
Wu = function () {};
i0 = function (e, t, n, i) {
  var r = e.memoizedProps;
  if (r !== i) {
    (e = t.stateNode), oi(Gt.current);
    var s = null;
    switch (n) {
      case "input":
        (r = fu(e, r)), (i = fu(e, i)), (s = []);
        break;
      case "select":
        (r = de({}, r, { value: void 0 })),
          (i = de({}, i, { value: void 0 })),
          (s = []);
        break;
      case "textarea":
        (r = pu(e, r)), (i = pu(e, i)), (s = []);
        break;
      default:
        typeof r.onClick != "function" &&
          typeof i.onClick == "function" &&
          (e.onclick = ol);
    }
    gu(n, i);
    var o;
    n = null;
    for (u in r)
      if (!i.hasOwnProperty(u) && r.hasOwnProperty(u) && r[u] != null)
        if (u === "style") {
          var l = r[u];
          for (o in l) l.hasOwnProperty(o) && (n || (n = {}), (n[o] = ""));
        } else
          u !== "dangerouslySetInnerHTML" &&
            u !== "children" &&
            u !== "suppressContentEditableWarning" &&
            u !== "suppressHydrationWarning" &&
            u !== "autoFocus" &&
            (ls.hasOwnProperty(u)
              ? s || (s = [])
              : (s = s || []).push(u, null));
    for (u in i) {
      var a = i[u];
      if (
        ((l = r != null ? r[u] : void 0),
        i.hasOwnProperty(u) && a !== l && (a != null || l != null))
      )
        if (u === "style")
          if (l) {
            for (o in l)
              !l.hasOwnProperty(o) ||
                (a && a.hasOwnProperty(o)) ||
                (n || (n = {}), (n[o] = ""));
            for (o in a)
              a.hasOwnProperty(o) &&
                l[o] !== a[o] &&
                (n || (n = {}), (n[o] = a[o]));
          } else n || (s || (s = []), s.push(u, n)), (n = a);
        else
          u === "dangerouslySetInnerHTML"
            ? ((a = a ? a.__html : void 0),
              (l = l ? l.__html : void 0),
              a != null && l !== a && (s = s || []).push(u, a))
            : u === "children"
            ? (typeof a != "string" && typeof a != "number") ||
              (s = s || []).push(u, "" + a)
            : u !== "suppressContentEditableWarning" &&
              u !== "suppressHydrationWarning" &&
              (ls.hasOwnProperty(u)
                ? (a != null && u === "onScroll" && oe("scroll", e),
                  s || l === a || (s = []))
                : (s = s || []).push(u, a));
    }
    n && (s = s || []).push("style", n);
    var u = s;
    (t.updateQueue = u) && (t.flags |= 4);
  }
};
r0 = function (e, t, n, i) {
  n !== i && (t.flags |= 4);
};
function Tr(e, t) {
  if (!ue)
    switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; )
          t.alternate !== null && (n = t), (t = t.sibling);
        n === null ? (e.tail = null) : (n.sibling = null);
        break;
      case "collapsed":
        n = e.tail;
        for (var i = null; n !== null; )
          n.alternate !== null && (i = n), (n = n.sibling);
        i === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (i.sibling = null);
    }
}
function ze(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    i = 0;
  if (t)
    for (var r = e.child; r !== null; )
      (n |= r.lanes | r.childLanes),
        (i |= r.subtreeFlags & 14680064),
        (i |= r.flags & 14680064),
        (r.return = e),
        (r = r.sibling);
  else
    for (r = e.child; r !== null; )
      (n |= r.lanes | r.childLanes),
        (i |= r.subtreeFlags),
        (i |= r.flags),
        (r.return = e),
        (r = r.sibling);
  return (e.subtreeFlags |= i), (e.childLanes = n), t;
}
function $1(e, t, n) {
  var i = t.pendingProps;
  switch ((Xc(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return ze(t), null;
    case 1:
      return tt(t.type) && ll(), ze(t), null;
    case 3:
      return (
        (i = t.stateNode),
        Ji(),
        le(et),
        le(Ue),
        nf(),
        i.pendingContext &&
          ((i.context = i.pendingContext), (i.pendingContext = null)),
        (e === null || e.child === null) &&
          (fo(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), Rt !== null && (Gu(Rt), (Rt = null)))),
        Wu(e, t),
        ze(t),
        null
      );
    case 5:
      tf(t);
      var r = oi(xs.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        i0(e, t, n, i, r),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152));
      else {
        if (!i) {
          if (t.stateNode === null) throw Error(L(166));
          return ze(t), null;
        }
        if (((e = oi(Gt.current)), fo(t))) {
          (i = t.stateNode), (n = t.type);
          var s = t.memoizedProps;
          switch (((i[qt] = t), (i[ys] = s), (e = (t.mode & 1) !== 0), n)) {
            case "dialog":
              oe("cancel", i), oe("close", i);
              break;
            case "iframe":
            case "object":
            case "embed":
              oe("load", i);
              break;
            case "video":
            case "audio":
              for (r = 0; r < jr.length; r++) oe(jr[r], i);
              break;
            case "source":
              oe("error", i);
              break;
            case "img":
            case "image":
            case "link":
              oe("error", i), oe("load", i);
              break;
            case "details":
              oe("toggle", i);
              break;
            case "input":
              yd(i, s), oe("invalid", i);
              break;
            case "select":
              (i._wrapperState = { wasMultiple: !!s.multiple }),
                oe("invalid", i);
              break;
            case "textarea":
              xd(i, s), oe("invalid", i);
          }
          gu(n, s), (r = null);
          for (var o in s)
            if (s.hasOwnProperty(o)) {
              var l = s[o];
              o === "children"
                ? typeof l == "string"
                  ? i.textContent !== l &&
                    (s.suppressHydrationWarning !== !0 &&
                      co(i.textContent, l, e),
                    (r = ["children", l]))
                  : typeof l == "number" &&
                    i.textContent !== "" + l &&
                    (s.suppressHydrationWarning !== !0 &&
                      co(i.textContent, l, e),
                    (r = ["children", "" + l]))
                : ls.hasOwnProperty(o) &&
                  l != null &&
                  o === "onScroll" &&
                  oe("scroll", i);
            }
          switch (n) {
            case "input":
              no(i), vd(i, s, !0);
              break;
            case "textarea":
              no(i), _d(i);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof s.onClick == "function" && (i.onclick = ol);
          }
          (i = r), (t.updateQueue = i), i !== null && (t.flags |= 4);
        } else {
          (o = r.nodeType === 9 ? r : r.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = Rm(n)),
            e === "http://www.w3.org/1999/xhtml"
              ? n === "script"
                ? ((e = o.createElement("div")),
                  (e.innerHTML = "<script></script>"),
                  (e = e.removeChild(e.firstChild)))
                : typeof i.is == "string"
                ? (e = o.createElement(n, { is: i.is }))
                : ((e = o.createElement(n)),
                  n === "select" &&
                    ((o = e),
                    i.multiple
                      ? (o.multiple = !0)
                      : i.size && (o.size = i.size)))
              : (e = o.createElementNS(e, n)),
            (e[qt] = t),
            (e[ys] = i),
            n0(e, t, !1, !1),
            (t.stateNode = e);
          e: {
            switch (((o = yu(n, i)), n)) {
              case "dialog":
                oe("cancel", e), oe("close", e), (r = i);
                break;
              case "iframe":
              case "object":
              case "embed":
                oe("load", e), (r = i);
                break;
              case "video":
              case "audio":
                for (r = 0; r < jr.length; r++) oe(jr[r], e);
                r = i;
                break;
              case "source":
                oe("error", e), (r = i);
                break;
              case "img":
              case "image":
              case "link":
                oe("error", e), oe("load", e), (r = i);
                break;
              case "details":
                oe("toggle", e), (r = i);
                break;
              case "input":
                yd(e, i), (r = fu(e, i)), oe("invalid", e);
                break;
              case "option":
                r = i;
                break;
              case "select":
                (e._wrapperState = { wasMultiple: !!i.multiple }),
                  (r = de({}, i, { value: void 0 })),
                  oe("invalid", e);
                break;
              case "textarea":
                xd(e, i), (r = pu(e, i)), oe("invalid", e);
                break;
              default:
                r = i;
            }
            gu(n, r), (l = r);
            for (s in l)
              if (l.hasOwnProperty(s)) {
                var a = l[s];
                s === "style"
                  ? Dm(e, a)
                  : s === "dangerouslySetInnerHTML"
                  ? ((a = a ? a.__html : void 0), a != null && Lm(e, a))
                  : s === "children"
                  ? typeof a == "string"
                    ? (n !== "textarea" || a !== "") && as(e, a)
                    : typeof a == "number" && as(e, "" + a)
                  : s !== "suppressContentEditableWarning" &&
                    s !== "suppressHydrationWarning" &&
                    s !== "autoFocus" &&
                    (ls.hasOwnProperty(s)
                      ? a != null && s === "onScroll" && oe("scroll", e)
                      : a != null && Rc(e, s, a, o));
              }
            switch (n) {
              case "input":
                no(e), vd(e, i, !1);
                break;
              case "textarea":
                no(e), _d(e);
                break;
              case "option":
                i.value != null && e.setAttribute("value", "" + Hn(i.value));
                break;
              case "select":
                (e.multiple = !!i.multiple),
                  (s = i.value),
                  s != null
                    ? Ui(e, !!i.multiple, s, !1)
                    : i.defaultValue != null &&
                      Ui(e, !!i.multiple, i.defaultValue, !0);
                break;
              default:
                typeof r.onClick == "function" && (e.onclick = ol);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                i = !!i.autoFocus;
                break e;
              case "img":
                i = !0;
                break e;
              default:
                i = !1;
            }
          }
          i && (t.flags |= 4);
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
      }
      return ze(t), null;
    case 6:
      if (e && t.stateNode != null) r0(e, t, e.memoizedProps, i);
      else {
        if (typeof i != "string" && t.stateNode === null) throw Error(L(166));
        if (((n = oi(xs.current)), oi(Gt.current), fo(t))) {
          if (
            ((i = t.stateNode),
            (n = t.memoizedProps),
            (i[qt] = t),
            (s = i.nodeValue !== n) && ((e = at), e !== null))
          )
            switch (e.tag) {
              case 3:
                co(i.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  co(i.nodeValue, n, (e.mode & 1) !== 0);
            }
          s && (t.flags |= 4);
        } else
          (i = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(i)),
            (i[qt] = t),
            (t.stateNode = i);
      }
      return ze(t), null;
    case 13:
      if (
        (le(ce),
        (i = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (ue && lt !== null && t.mode & 1 && !(t.flags & 128))
          Sg(), Gi(), (t.flags |= 98560), (s = !1);
        else if (((s = fo(t)), i !== null && i.dehydrated !== null)) {
          if (e === null) {
            if (!s) throw Error(L(318));
            if (
              ((s = t.memoizedState),
              (s = s !== null ? s.dehydrated : null),
              !s)
            )
              throw Error(L(317));
            s[qt] = t;
          } else
            Gi(), !(t.flags & 128) && (t.memoizedState = null), (t.flags |= 4);
          ze(t), (s = !1);
        } else Rt !== null && (Gu(Rt), (Rt = null)), (s = !0);
        if (!s) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128
        ? ((t.lanes = n), t)
        : ((i = i !== null),
          i !== (e !== null && e.memoizedState !== null) &&
            i &&
            ((t.child.flags |= 8192),
            t.mode & 1 &&
              (e === null || ce.current & 1 ? Te === 0 && (Te = 3) : mf())),
          t.updateQueue !== null && (t.flags |= 4),
          ze(t),
          null);
    case 4:
      return (
        Ji(), Wu(e, t), e === null && ms(t.stateNode.containerInfo), ze(t), null
      );
    case 10:
      return Gc(t.type._context), ze(t), null;
    case 17:
      return tt(t.type) && ll(), ze(t), null;
    case 19:
      if ((le(ce), (s = t.memoizedState), s === null)) return ze(t), null;
      if (((i = (t.flags & 128) !== 0), (o = s.rendering), o === null))
        if (i) Tr(s, !1);
        else {
          if (Te !== 0 || (e !== null && e.flags & 128))
            for (e = t.child; e !== null; ) {
              if (((o = pl(e)), o !== null)) {
                for (
                  t.flags |= 128,
                    Tr(s, !1),
                    i = o.updateQueue,
                    i !== null && ((t.updateQueue = i), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    i = n,
                    n = t.child;
                  n !== null;

                )
                  (s = n),
                    (e = i),
                    (s.flags &= 14680066),
                    (o = s.alternate),
                    o === null
                      ? ((s.childLanes = 0),
                        (s.lanes = e),
                        (s.child = null),
                        (s.subtreeFlags = 0),
                        (s.memoizedProps = null),
                        (s.memoizedState = null),
                        (s.updateQueue = null),
                        (s.dependencies = null),
                        (s.stateNode = null))
                      : ((s.childLanes = o.childLanes),
                        (s.lanes = o.lanes),
                        (s.child = o.child),
                        (s.subtreeFlags = 0),
                        (s.deletions = null),
                        (s.memoizedProps = o.memoizedProps),
                        (s.memoizedState = o.memoizedState),
                        (s.updateQueue = o.updateQueue),
                        (s.type = o.type),
                        (e = o.dependencies),
                        (s.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (n = n.sibling);
                return se(ce, (ce.current & 1) | 2), t.child;
              }
              e = e.sibling;
            }
          s.tail !== null &&
            ge() > tr &&
            ((t.flags |= 128), (i = !0), Tr(s, !1), (t.lanes = 4194304));
        }
      else {
        if (!i)
          if (((e = pl(o)), e !== null)) {
            if (
              ((t.flags |= 128),
              (i = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              Tr(s, !0),
              s.tail === null && s.tailMode === "hidden" && !o.alternate && !ue)
            )
              return ze(t), null;
          } else
            2 * ge() - s.renderingStartTime > tr &&
              n !== 1073741824 &&
              ((t.flags |= 128), (i = !0), Tr(s, !1), (t.lanes = 4194304));
        s.isBackwards
          ? ((o.sibling = t.child), (t.child = o))
          : ((n = s.last),
            n !== null ? (n.sibling = o) : (t.child = o),
            (s.last = o));
      }
      return s.tail !== null
        ? ((t = s.tail),
          (s.rendering = t),
          (s.tail = t.sibling),
          (s.renderingStartTime = ge()),
          (t.sibling = null),
          (n = ce.current),
          se(ce, i ? (n & 1) | 2 : n & 1),
          t)
        : (ze(t), null);
    case 22:
    case 23:
      return (
        pf(),
        (i = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== i && (t.flags |= 8192),
        i && t.mode & 1
          ? ot & 1073741824 && (ze(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : ze(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(L(156, t.tag));
}
function Y1(e, t) {
  switch ((Xc(t), t.tag)) {
    case 1:
      return (
        tt(t.type) && ll(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        Ji(),
        le(et),
        le(Ue),
        nf(),
        (e = t.flags),
        e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 5:
      return tf(t), null;
    case 13:
      if (
        (le(ce), (e = t.memoizedState), e !== null && e.dehydrated !== null)
      ) {
        if (t.alternate === null) throw Error(L(340));
        Gi();
      }
      return (
        (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return le(ce), null;
    case 4:
      return Ji(), null;
    case 10:
      return Gc(t.type._context), null;
    case 22:
    case 23:
      return pf(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var mo = !1,
  Be = !1,
  X1 = typeof WeakSet == "function" ? WeakSet : Set,
  z = null;
function Bi(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (i) {
        he(e, t, i);
      }
    else n.current = null;
}
function Vu(e, t, n) {
  try {
    n();
  } catch (i) {
    he(e, t, i);
  }
}
var uh = !1;
function K1(e, t) {
  if (((Cu = il), (e = ug()), $c(e))) {
    if ("selectionStart" in e)
      var n = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window;
        var i = n.getSelection && n.getSelection();
        if (i && i.rangeCount !== 0) {
          n = i.anchorNode;
          var r = i.anchorOffset,
            s = i.focusNode;
          i = i.focusOffset;
          try {
            n.nodeType, s.nodeType;
          } catch {
            n = null;
            break e;
          }
          var o = 0,
            l = -1,
            a = -1,
            u = 0,
            c = 0,
            f = e,
            d = null;
          t: for (;;) {
            for (
              var h;
              f !== n || (r !== 0 && f.nodeType !== 3) || (l = o + r),
                f !== s || (i !== 0 && f.nodeType !== 3) || (a = o + i),
                f.nodeType === 3 && (o += f.nodeValue.length),
                (h = f.firstChild) !== null;

            )
              (d = f), (f = h);
            for (;;) {
              if (f === e) break t;
              if (
                (d === n && ++u === r && (l = o),
                d === s && ++c === i && (a = o),
                (h = f.nextSibling) !== null)
              )
                break;
              (f = d), (d = f.parentNode);
            }
            f = h;
          }
          n = l === -1 || a === -1 ? null : { start: l, end: a };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Pu = { focusedElem: e, selectionRange: n }, il = !1, z = t; z !== null; )
    if (((t = z), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      (e.return = t), (z = e);
    else
      for (; z !== null; ) {
        t = z;
        try {
          var m = t.alternate;
          if (t.flags & 1024)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (m !== null) {
                  var v = m.memoizedProps,
                    _ = m.memoizedState,
                    g = t.stateNode,
                    y = g.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? v : Nt(t.type, v),
                      _
                    );
                  g.__reactInternalSnapshotBeforeUpdate = y;
                }
                break;
              case 3:
                var w = t.stateNode.containerInfo;
                w.nodeType === 1
                  ? (w.textContent = "")
                  : w.nodeType === 9 &&
                    w.documentElement &&
                    w.removeChild(w.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(L(163));
            }
        } catch (E) {
          he(t, t.return, E);
        }
        if (((e = t.sibling), e !== null)) {
          (e.return = t.return), (z = e);
          break;
        }
        z = t.return;
      }
  return (m = uh), (uh = !1), m;
}
function Qr(e, t, n) {
  var i = t.updateQueue;
  if (((i = i !== null ? i.lastEffect : null), i !== null)) {
    var r = (i = i.next);
    do {
      if ((r.tag & e) === e) {
        var s = r.destroy;
        (r.destroy = void 0), s !== void 0 && Vu(t, n, s);
      }
      r = r.next;
    } while (r !== i);
  }
}
function $l(e, t) {
  if (
    ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
  ) {
    var n = (t = t.next);
    do {
      if ((n.tag & e) === e) {
        var i = n.create;
        n.destroy = i();
      }
      n = n.next;
    } while (n !== t);
  }
}
function $u(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : (t.current = e);
  }
}
function s0(e) {
  var t = e.alternate;
  t !== null && ((e.alternate = null), s0(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[qt], delete t[ys], delete t[Mu], delete t[N1], delete t[M1])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null);
}
function o0(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function ch(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || o0(e.return)) return null;
      e = e.return;
    }
    for (
      e.sibling.return = e.return, e = e.sibling;
      e.tag !== 5 && e.tag !== 6 && e.tag !== 18;

    ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      (e.child.return = e), (e = e.child);
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function Yu(e, t, n) {
  var i = e.tag;
  if (i === 5 || i === 6)
    (e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8
            ? ((t = n.parentNode), t.insertBefore(e, n))
            : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = ol));
  else if (i !== 4 && ((e = e.child), e !== null))
    for (Yu(e, t, n), e = e.sibling; e !== null; ) Yu(e, t, n), (e = e.sibling);
}
function Xu(e, t, n) {
  var i = e.tag;
  if (i === 5 || i === 6)
    (e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (i !== 4 && ((e = e.child), e !== null))
    for (Xu(e, t, n), e = e.sibling; e !== null; ) Xu(e, t, n), (e = e.sibling);
}
var Ie = null,
  Mt = !1;
function xn(e, t, n) {
  for (n = n.child; n !== null; ) l0(e, t, n), (n = n.sibling);
}
function l0(e, t, n) {
  if (Qt && typeof Qt.onCommitFiberUnmount == "function")
    try {
      Qt.onCommitFiberUnmount(jl, n);
    } catch {}
  switch (n.tag) {
    case 5:
      Be || Bi(n, t);
    case 6:
      var i = Ie,
        r = Mt;
      (Ie = null),
        xn(e, t, n),
        (Ie = i),
        (Mt = r),
        Ie !== null &&
          (Mt
            ? ((e = Ie),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : Ie.removeChild(n.stateNode));
      break;
    case 18:
      Ie !== null &&
        (Mt
          ? ((e = Ie),
            (n = n.stateNode),
            e.nodeType === 8
              ? Ia(e.parentNode, n)
              : e.nodeType === 1 && Ia(e, n),
            ds(e))
          : Ia(Ie, n.stateNode));
      break;
    case 4:
      (i = Ie),
        (r = Mt),
        (Ie = n.stateNode.containerInfo),
        (Mt = !0),
        xn(e, t, n),
        (Ie = i),
        (Mt = r);
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !Be &&
        ((i = n.updateQueue), i !== null && ((i = i.lastEffect), i !== null))
      ) {
        r = i = i.next;
        do {
          var s = r,
            o = s.destroy;
          (s = s.tag),
            o !== void 0 && (s & 2 || s & 4) && Vu(n, t, o),
            (r = r.next);
        } while (r !== i);
      }
      xn(e, t, n);
      break;
    case 1:
      if (
        !Be &&
        (Bi(n, t),
        (i = n.stateNode),
        typeof i.componentWillUnmount == "function")
      )
        try {
          (i.props = n.memoizedProps),
            (i.state = n.memoizedState),
            i.componentWillUnmount();
        } catch (l) {
          he(n, t, l);
        }
      xn(e, t, n);
      break;
    case 21:
      xn(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((Be = (i = Be) || n.memoizedState !== null), xn(e, t, n), (Be = i))
        : xn(e, t, n);
      break;
    default:
      xn(e, t, n);
  }
}
function fh(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new X1()),
      t.forEach(function (i) {
        var r = i_.bind(null, e, i);
        n.has(i) || (n.add(i), i.then(r, r));
      });
  }
}
function Ot(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var i = 0; i < n.length; i++) {
      var r = n[i];
      try {
        var s = e,
          o = t,
          l = o;
        e: for (; l !== null; ) {
          switch (l.tag) {
            case 5:
              (Ie = l.stateNode), (Mt = !1);
              break e;
            case 3:
              (Ie = l.stateNode.containerInfo), (Mt = !0);
              break e;
            case 4:
              (Ie = l.stateNode.containerInfo), (Mt = !0);
              break e;
          }
          l = l.return;
        }
        if (Ie === null) throw Error(L(160));
        l0(s, o, r), (Ie = null), (Mt = !1);
        var a = r.alternate;
        a !== null && (a.return = null), (r.return = null);
      } catch (u) {
        he(r, t, u);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null; ) a0(t, e), (t = t.sibling);
}
function a0(e, t) {
  var n = e.alternate,
    i = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((Ot(t, e), Ut(e), i & 4)) {
        try {
          Qr(3, e, e.return), $l(3, e);
        } catch (v) {
          he(e, e.return, v);
        }
        try {
          Qr(5, e, e.return);
        } catch (v) {
          he(e, e.return, v);
        }
      }
      break;
    case 1:
      Ot(t, e), Ut(e), i & 512 && n !== null && Bi(n, n.return);
      break;
    case 5:
      if (
        (Ot(t, e),
        Ut(e),
        i & 512 && n !== null && Bi(n, n.return),
        e.flags & 32)
      ) {
        var r = e.stateNode;
        try {
          as(r, "");
        } catch (v) {
          he(e, e.return, v);
        }
      }
      if (i & 4 && ((r = e.stateNode), r != null)) {
        var s = e.memoizedProps,
          o = n !== null ? n.memoizedProps : s,
          l = e.type,
          a = e.updateQueue;
        if (((e.updateQueue = null), a !== null))
          try {
            l === "input" && s.type === "radio" && s.name != null && Nm(r, s),
              yu(l, o);
            var u = yu(l, s);
            for (o = 0; o < a.length; o += 2) {
              var c = a[o],
                f = a[o + 1];
              c === "style"
                ? Dm(r, f)
                : c === "dangerouslySetInnerHTML"
                ? Lm(r, f)
                : c === "children"
                ? as(r, f)
                : Rc(r, c, f, u);
            }
            switch (l) {
              case "input":
                du(r, s);
                break;
              case "textarea":
                Mm(r, s);
                break;
              case "select":
                var d = r._wrapperState.wasMultiple;
                r._wrapperState.wasMultiple = !!s.multiple;
                var h = s.value;
                h != null
                  ? Ui(r, !!s.multiple, h, !1)
                  : d !== !!s.multiple &&
                    (s.defaultValue != null
                      ? Ui(r, !!s.multiple, s.defaultValue, !0)
                      : Ui(r, !!s.multiple, s.multiple ? [] : "", !1));
            }
            r[ys] = s;
          } catch (v) {
            he(e, e.return, v);
          }
      }
      break;
    case 6:
      if ((Ot(t, e), Ut(e), i & 4)) {
        if (e.stateNode === null) throw Error(L(162));
        (r = e.stateNode), (s = e.memoizedProps);
        try {
          r.nodeValue = s;
        } catch (v) {
          he(e, e.return, v);
        }
      }
      break;
    case 3:
      if (
        (Ot(t, e), Ut(e), i & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          ds(t.containerInfo);
        } catch (v) {
          he(e, e.return, v);
        }
      break;
    case 4:
      Ot(t, e), Ut(e);
      break;
    case 13:
      Ot(t, e),
        Ut(e),
        (r = e.child),
        r.flags & 8192 &&
          ((s = r.memoizedState !== null),
          (r.stateNode.isHidden = s),
          !s ||
            (r.alternate !== null && r.alternate.memoizedState !== null) ||
            (df = ge())),
        i & 4 && fh(e);
      break;
    case 22:
      if (
        ((c = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((Be = (u = Be) || c), Ot(t, e), (Be = u)) : Ot(t, e),
        Ut(e),
        i & 8192)
      ) {
        if (
          ((u = e.memoizedState !== null),
          (e.stateNode.isHidden = u) && !c && e.mode & 1)
        )
          for (z = e, c = e.child; c !== null; ) {
            for (f = z = c; z !== null; ) {
              switch (((d = z), (h = d.child), d.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Qr(4, d, d.return);
                  break;
                case 1:
                  Bi(d, d.return);
                  var m = d.stateNode;
                  if (typeof m.componentWillUnmount == "function") {
                    (i = d), (n = d.return);
                    try {
                      (t = i),
                        (m.props = t.memoizedProps),
                        (m.state = t.memoizedState),
                        m.componentWillUnmount();
                    } catch (v) {
                      he(i, n, v);
                    }
                  }
                  break;
                case 5:
                  Bi(d, d.return);
                  break;
                case 22:
                  if (d.memoizedState !== null) {
                    hh(f);
                    continue;
                  }
              }
              h !== null ? ((h.return = d), (z = h)) : hh(f);
            }
            c = c.sibling;
          }
        e: for (c = null, f = e; ; ) {
          if (f.tag === 5) {
            if (c === null) {
              c = f;
              try {
                (r = f.stateNode),
                  u
                    ? ((s = r.style),
                      typeof s.setProperty == "function"
                        ? s.setProperty("display", "none", "important")
                        : (s.display = "none"))
                    : ((l = f.stateNode),
                      (a = f.memoizedProps.style),
                      (o =
                        a != null && a.hasOwnProperty("display")
                          ? a.display
                          : null),
                      (l.style.display = Im("display", o)));
              } catch (v) {
                he(e, e.return, v);
              }
            }
          } else if (f.tag === 6) {
            if (c === null)
              try {
                f.stateNode.nodeValue = u ? "" : f.memoizedProps;
              } catch (v) {
                he(e, e.return, v);
              }
          } else if (
            ((f.tag !== 22 && f.tag !== 23) ||
              f.memoizedState === null ||
              f === e) &&
            f.child !== null
          ) {
            (f.child.return = f), (f = f.child);
            continue;
          }
          if (f === e) break e;
          for (; f.sibling === null; ) {
            if (f.return === null || f.return === e) break e;
            c === f && (c = null), (f = f.return);
          }
          c === f && (c = null), (f.sibling.return = f.return), (f = f.sibling);
        }
      }
      break;
    case 19:
      Ot(t, e), Ut(e), i & 4 && fh(e);
      break;
    case 21:
      break;
    default:
      Ot(t, e), Ut(e);
  }
}
function Ut(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (o0(n)) {
            var i = n;
            break e;
          }
          n = n.return;
        }
        throw Error(L(160));
      }
      switch (i.tag) {
        case 5:
          var r = i.stateNode;
          i.flags & 32 && (as(r, ""), (i.flags &= -33));
          var s = ch(e);
          Xu(e, s, r);
          break;
        case 3:
        case 4:
          var o = i.stateNode.containerInfo,
            l = ch(e);
          Yu(e, l, o);
          break;
        default:
          throw Error(L(161));
      }
    } catch (a) {
      he(e, e.return, a);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function q1(e, t, n) {
  (z = e), u0(e);
}
function u0(e, t, n) {
  for (var i = (e.mode & 1) !== 0; z !== null; ) {
    var r = z,
      s = r.child;
    if (r.tag === 22 && i) {
      var o = r.memoizedState !== null || mo;
      if (!o) {
        var l = r.alternate,
          a = (l !== null && l.memoizedState !== null) || Be;
        l = mo;
        var u = Be;
        if (((mo = o), (Be = a) && !u))
          for (z = r; z !== null; )
            (o = z),
              (a = o.child),
              o.tag === 22 && o.memoizedState !== null
                ? ph(r)
                : a !== null
                ? ((a.return = o), (z = a))
                : ph(r);
        for (; s !== null; ) (z = s), u0(s), (s = s.sibling);
        (z = r), (mo = l), (Be = u);
      }
      dh(e);
    } else
      r.subtreeFlags & 8772 && s !== null ? ((s.return = r), (z = s)) : dh(e);
  }
}
function dh(e) {
  for (; z !== null; ) {
    var t = z;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Be || $l(5, t);
              break;
            case 1:
              var i = t.stateNode;
              if (t.flags & 4 && !Be)
                if (n === null) i.componentDidMount();
                else {
                  var r =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : Nt(t.type, n.memoizedProps);
                  i.componentDidUpdate(
                    r,
                    n.memoizedState,
                    i.__reactInternalSnapshotBeforeUpdate
                  );
                }
              var s = t.updateQueue;
              s !== null && Qd(t, s, i);
              break;
            case 3:
              var o = t.updateQueue;
              if (o !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode;
                      break;
                    case 1:
                      n = t.child.stateNode;
                  }
                Qd(t, o, n);
              }
              break;
            case 5:
              var l = t.stateNode;
              if (n === null && t.flags & 4) {
                n = l;
                var a = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    a.autoFocus && n.focus();
                    break;
                  case "img":
                    a.src && (n.src = a.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var u = t.alternate;
                if (u !== null) {
                  var c = u.memoizedState;
                  if (c !== null) {
                    var f = c.dehydrated;
                    f !== null && ds(f);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(L(163));
          }
        Be || (t.flags & 512 && $u(t));
      } catch (d) {
        he(t, t.return, d);
      }
    }
    if (t === e) {
      z = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      (n.return = t.return), (z = n);
      break;
    }
    z = t.return;
  }
}
function hh(e) {
  for (; z !== null; ) {
    var t = z;
    if (t === e) {
      z = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      (n.return = t.return), (z = n);
      break;
    }
    z = t.return;
  }
}
function ph(e) {
  for (; z !== null; ) {
    var t = z;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            $l(4, t);
          } catch (a) {
            he(t, n, a);
          }
          break;
        case 1:
          var i = t.stateNode;
          if (typeof i.componentDidMount == "function") {
            var r = t.return;
            try {
              i.componentDidMount();
            } catch (a) {
              he(t, r, a);
            }
          }
          var s = t.return;
          try {
            $u(t);
          } catch (a) {
            he(t, s, a);
          }
          break;
        case 5:
          var o = t.return;
          try {
            $u(t);
          } catch (a) {
            he(t, o, a);
          }
      }
    } catch (a) {
      he(t, t.return, a);
    }
    if (t === e) {
      z = null;
      break;
    }
    var l = t.sibling;
    if (l !== null) {
      (l.return = t.return), (z = l);
      break;
    }
    z = t.return;
  }
}
var Q1 = Math.ceil,
  yl = gn.ReactCurrentDispatcher,
  cf = gn.ReactCurrentOwner,
  St = gn.ReactCurrentBatchConfig,
  J = 0,
  Ne = null,
  Se = null,
  De = 0,
  ot = 0,
  Hi = Xn(0),
  Te = 0,
  bs = null,
  yi = 0,
  Yl = 0,
  ff = 0,
  Gr = null,
  Qe = null,
  df = 0,
  tr = 1 / 0,
  sn = null,
  vl = !1,
  Ku = null,
  An = null,
  go = !1,
  Pn = null,
  xl = 0,
  Zr = 0,
  qu = null,
  Uo = -1,
  Wo = 0;
function $e() {
  return J & 6 ? ge() : Uo !== -1 ? Uo : (Uo = ge());
}
function jn(e) {
  return e.mode & 1
    ? J & 2 && De !== 0
      ? De & -De
      : L1.transition !== null
      ? (Wo === 0 && (Wo = Xm()), Wo)
      : ((e = ne),
        e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : eg(e.type))),
        e)
    : 1;
}
function At(e, t, n, i) {
  if (50 < Zr) throw ((Zr = 0), (qu = null), Error(L(185)));
  Ds(e, n, i),
    (!(J & 2) || e !== Ne) &&
      (e === Ne && (!(J & 2) && (Yl |= n), Te === 4 && Tn(e, De)),
      nt(e, i),
      n === 1 && J === 0 && !(t.mode & 1) && ((tr = ge() + 500), Ul && Kn()));
}
function nt(e, t) {
  var n = e.callbackNode;
  Lx(e, t);
  var i = nl(e, e === Ne ? De : 0);
  if (i === 0)
    n !== null && bd(n), (e.callbackNode = null), (e.callbackPriority = 0);
  else if (((t = i & -i), e.callbackPriority !== t)) {
    if ((n != null && bd(n), t === 1))
      e.tag === 0 ? R1(mh.bind(null, e)) : xg(mh.bind(null, e)),
        P1(function () {
          !(J & 6) && Kn();
        }),
        (n = null);
    else {
      switch (Km(i)) {
        case 1:
          n = jc;
          break;
        case 4:
          n = $m;
          break;
        case 16:
          n = tl;
          break;
        case 536870912:
          n = Ym;
          break;
        default:
          n = tl;
      }
      n = y0(n, c0.bind(null, e));
    }
    (e.callbackPriority = t), (e.callbackNode = n);
  }
}
function c0(e, t) {
  if (((Uo = -1), (Wo = 0), J & 6)) throw Error(L(327));
  var n = e.callbackNode;
  if (Xi() && e.callbackNode !== n) return null;
  var i = nl(e, e === Ne ? De : 0);
  if (i === 0) return null;
  if (i & 30 || i & e.expiredLanes || t) t = _l(e, i);
  else {
    t = i;
    var r = J;
    J |= 2;
    var s = d0();
    (Ne !== e || De !== t) && ((sn = null), (tr = ge() + 500), ci(e, t));
    do
      try {
        J1();
        break;
      } catch (l) {
        f0(e, l);
      }
    while (!0);
    Qc(),
      (yl.current = s),
      (J = r),
      Se !== null ? (t = 0) : ((Ne = null), (De = 0), (t = Te));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((r = Su(e)), r !== 0 && ((i = r), (t = Qu(e, r)))), t === 1)
    )
      throw ((n = bs), ci(e, 0), Tn(e, i), nt(e, ge()), n);
    if (t === 6) Tn(e, i);
    else {
      if (
        ((r = e.current.alternate),
        !(i & 30) &&
          !G1(r) &&
          ((t = _l(e, i)),
          t === 2 && ((s = Su(e)), s !== 0 && ((i = s), (t = Qu(e, s)))),
          t === 1))
      )
        throw ((n = bs), ci(e, 0), Tn(e, i), nt(e, ge()), n);
      switch (((e.finishedWork = r), (e.finishedLanes = i), t)) {
        case 0:
        case 1:
          throw Error(L(345));
        case 2:
          ni(e, Qe, sn);
          break;
        case 3:
          if (
            (Tn(e, i), (i & 130023424) === i && ((t = df + 500 - ge()), 10 < t))
          ) {
            if (nl(e, 0) !== 0) break;
            if (((r = e.suspendedLanes), (r & i) !== i)) {
              $e(), (e.pingedLanes |= e.suspendedLanes & r);
              break;
            }
            e.timeoutHandle = Nu(ni.bind(null, e, Qe, sn), t);
            break;
          }
          ni(e, Qe, sn);
          break;
        case 4:
          if ((Tn(e, i), (i & 4194240) === i)) break;
          for (t = e.eventTimes, r = -1; 0 < i; ) {
            var o = 31 - Dt(i);
            (s = 1 << o), (o = t[o]), o > r && (r = o), (i &= ~s);
          }
          if (
            ((i = r),
            (i = ge() - i),
            (i =
              (120 > i
                ? 120
                : 480 > i
                ? 480
                : 1080 > i
                ? 1080
                : 1920 > i
                ? 1920
                : 3e3 > i
                ? 3e3
                : 4320 > i
                ? 4320
                : 1960 * Q1(i / 1960)) - i),
            10 < i)
          ) {
            e.timeoutHandle = Nu(ni.bind(null, e, Qe, sn), i);
            break;
          }
          ni(e, Qe, sn);
          break;
        case 5:
          ni(e, Qe, sn);
          break;
        default:
          throw Error(L(329));
      }
    }
  }
  return nt(e, ge()), e.callbackNode === n ? c0.bind(null, e) : null;
}
function Qu(e, t) {
  var n = Gr;
  return (
    e.current.memoizedState.isDehydrated && (ci(e, t).flags |= 256),
    (e = _l(e, t)),
    e !== 2 && ((t = Qe), (Qe = n), t !== null && Gu(t)),
    e
  );
}
function Gu(e) {
  Qe === null ? (Qe = e) : Qe.push.apply(Qe, e);
}
function G1(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var i = 0; i < n.length; i++) {
          var r = n[i],
            s = r.getSnapshot;
          r = r.value;
          try {
            if (!jt(s(), r)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
      (n.return = t), (t = n);
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      (t.sibling.return = t.return), (t = t.sibling);
    }
  }
  return !0;
}
function Tn(e, t) {
  for (
    t &= ~ff,
      t &= ~Yl,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;

  ) {
    var n = 31 - Dt(t),
      i = 1 << n;
    (e[n] = -1), (t &= ~i);
  }
}
function mh(e) {
  if (J & 6) throw Error(L(327));
  Xi();
  var t = nl(e, 0);
  if (!(t & 1)) return nt(e, ge()), null;
  var n = _l(e, t);
  if (e.tag !== 0 && n === 2) {
    var i = Su(e);
    i !== 0 && ((t = i), (n = Qu(e, i)));
  }
  if (n === 1) throw ((n = bs), ci(e, 0), Tn(e, t), nt(e, ge()), n);
  if (n === 6) throw Error(L(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    ni(e, Qe, sn),
    nt(e, ge()),
    null
  );
}
function hf(e, t) {
  var n = J;
  J |= 1;
  try {
    return e(t);
  } finally {
    (J = n), J === 0 && ((tr = ge() + 500), Ul && Kn());
  }
}
function vi(e) {
  Pn !== null && Pn.tag === 0 && !(J & 6) && Xi();
  var t = J;
  J |= 1;
  var n = St.transition,
    i = ne;
  try {
    if (((St.transition = null), (ne = 1), e)) return e();
  } finally {
    (ne = i), (St.transition = n), (J = t), !(J & 6) && Kn();
  }
}
function pf() {
  (ot = Hi.current), le(Hi);
}
function ci(e, t) {
  (e.finishedWork = null), (e.finishedLanes = 0);
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), C1(n)), Se !== null))
    for (n = Se.return; n !== null; ) {
      var i = n;
      switch ((Xc(i), i.tag)) {
        case 1:
          (i = i.type.childContextTypes), i != null && ll();
          break;
        case 3:
          Ji(), le(et), le(Ue), nf();
          break;
        case 5:
          tf(i);
          break;
        case 4:
          Ji();
          break;
        case 13:
          le(ce);
          break;
        case 19:
          le(ce);
          break;
        case 10:
          Gc(i.type._context);
          break;
        case 22:
        case 23:
          pf();
      }
      n = n.return;
    }
  if (
    ((Ne = e),
    (Se = e = zn(e.current, null)),
    (De = ot = t),
    (Te = 0),
    (bs = null),
    (ff = Yl = yi = 0),
    (Qe = Gr = null),
    si !== null)
  ) {
    for (t = 0; t < si.length; t++)
      if (((n = si[t]), (i = n.interleaved), i !== null)) {
        n.interleaved = null;
        var r = i.next,
          s = n.pending;
        if (s !== null) {
          var o = s.next;
          (s.next = r), (i.next = o);
        }
        n.pending = i;
      }
    si = null;
  }
  return e;
}
function f0(e, t) {
  do {
    var n = Se;
    try {
      if ((Qc(), (Fo.current = gl), ml)) {
        for (var i = fe.memoizedState; i !== null; ) {
          var r = i.queue;
          r !== null && (r.pending = null), (i = i.next);
        }
        ml = !1;
      }
      if (
        ((gi = 0),
        (Pe = ke = fe = null),
        (qr = !1),
        (_s = 0),
        (cf.current = null),
        n === null || n.return === null)
      ) {
        (Te = 1), (bs = t), (Se = null);
        break;
      }
      e: {
        var s = e,
          o = n.return,
          l = n,
          a = t;
        if (
          ((t = De),
          (l.flags |= 32768),
          a !== null && typeof a == "object" && typeof a.then == "function")
        ) {
          var u = a,
            c = l,
            f = c.tag;
          if (!(c.mode & 1) && (f === 0 || f === 11 || f === 15)) {
            var d = c.alternate;
            d
              ? ((c.updateQueue = d.updateQueue),
                (c.memoizedState = d.memoizedState),
                (c.lanes = d.lanes))
              : ((c.updateQueue = null), (c.memoizedState = null));
          }
          var h = nh(o);
          if (h !== null) {
            (h.flags &= -257),
              ih(h, o, l, s, t),
              h.mode & 1 && th(s, u, t),
              (t = h),
              (a = u);
            var m = t.updateQueue;
            if (m === null) {
              var v = new Set();
              v.add(a), (t.updateQueue = v);
            } else m.add(a);
            break e;
          } else {
            if (!(t & 1)) {
              th(s, u, t), mf();
              break e;
            }
            a = Error(L(426));
          }
        } else if (ue && l.mode & 1) {
          var _ = nh(o);
          if (_ !== null) {
            !(_.flags & 65536) && (_.flags |= 256),
              ih(_, o, l, s, t),
              Kc(er(a, l));
            break e;
          }
        }
        (s = a = er(a, l)),
          Te !== 4 && (Te = 2),
          Gr === null ? (Gr = [s]) : Gr.push(s),
          (s = o);
        do {
          switch (s.tag) {
            case 3:
              (s.flags |= 65536), (t &= -t), (s.lanes |= t);
              var g = Kg(s, a, t);
              qd(s, g);
              break e;
            case 1:
              l = a;
              var y = s.type,
                w = s.stateNode;
              if (
                !(s.flags & 128) &&
                (typeof y.getDerivedStateFromError == "function" ||
                  (w !== null &&
                    typeof w.componentDidCatch == "function" &&
                    (An === null || !An.has(w))))
              ) {
                (s.flags |= 65536), (t &= -t), (s.lanes |= t);
                var E = qg(s, l, t);
                qd(s, E);
                break e;
              }
          }
          s = s.return;
        } while (s !== null);
      }
      p0(n);
    } catch (k) {
      (t = k), Se === n && n !== null && (Se = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function d0() {
  var e = yl.current;
  return (yl.current = gl), e === null ? gl : e;
}
function mf() {
  (Te === 0 || Te === 3 || Te === 2) && (Te = 4),
    Ne === null || (!(yi & 268435455) && !(Yl & 268435455)) || Tn(Ne, De);
}
function _l(e, t) {
  var n = J;
  J |= 2;
  var i = d0();
  (Ne !== e || De !== t) && ((sn = null), ci(e, t));
  do
    try {
      Z1();
      break;
    } catch (r) {
      f0(e, r);
    }
  while (!0);
  if ((Qc(), (J = n), (yl.current = i), Se !== null)) throw Error(L(261));
  return (Ne = null), (De = 0), Te;
}
function Z1() {
  for (; Se !== null; ) h0(Se);
}
function J1() {
  for (; Se !== null && !Ex(); ) h0(Se);
}
function h0(e) {
  var t = g0(e.alternate, e, ot);
  (e.memoizedProps = e.pendingProps),
    t === null ? p0(e) : (Se = t),
    (cf.current = null);
}
function p0(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), t.flags & 32768)) {
      if (((n = Y1(n, t)), n !== null)) {
        (n.flags &= 32767), (Se = n);
        return;
      }
      if (e !== null)
        (e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null);
      else {
        (Te = 6), (Se = null);
        return;
      }
    } else if (((n = $1(n, t, ot)), n !== null)) {
      Se = n;
      return;
    }
    if (((t = t.sibling), t !== null)) {
      Se = t;
      return;
    }
    Se = t = e;
  } while (t !== null);
  Te === 0 && (Te = 5);
}
function ni(e, t, n) {
  var i = ne,
    r = St.transition;
  try {
    (St.transition = null), (ne = 1), e_(e, t, n, i);
  } finally {
    (St.transition = r), (ne = i);
  }
  return null;
}
function e_(e, t, n, i) {
  do Xi();
  while (Pn !== null);
  if (J & 6) throw Error(L(327));
  n = e.finishedWork;
  var r = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(L(177));
  (e.callbackNode = null), (e.callbackPriority = 0);
  var s = n.lanes | n.childLanes;
  if (
    (Ix(e, s),
    e === Ne && ((Se = Ne = null), (De = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      go ||
      ((go = !0),
      y0(tl, function () {
        return Xi(), null;
      })),
    (s = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || s)
  ) {
    (s = St.transition), (St.transition = null);
    var o = ne;
    ne = 1;
    var l = J;
    (J |= 4),
      (cf.current = null),
      K1(e, n),
      a0(n, e),
      _1(Pu),
      (il = !!Cu),
      (Pu = Cu = null),
      (e.current = n),
      q1(n),
      kx(),
      (J = l),
      (ne = o),
      (St.transition = s);
  } else e.current = n;
  if (
    (go && ((go = !1), (Pn = e), (xl = r)),
    (s = e.pendingLanes),
    s === 0 && (An = null),
    Px(n.stateNode),
    nt(e, ge()),
    t !== null)
  )
    for (i = e.onRecoverableError, n = 0; n < t.length; n++)
      (r = t[n]), i(r.value, { componentStack: r.stack, digest: r.digest });
  if (vl) throw ((vl = !1), (e = Ku), (Ku = null), e);
  return (
    xl & 1 && e.tag !== 0 && Xi(),
    (s = e.pendingLanes),
    s & 1 ? (e === qu ? Zr++ : ((Zr = 0), (qu = e))) : (Zr = 0),
    Kn(),
    null
  );
}
function Xi() {
  if (Pn !== null) {
    var e = Km(xl),
      t = St.transition,
      n = ne;
    try {
      if (((St.transition = null), (ne = 16 > e ? 16 : e), Pn === null))
        var i = !1;
      else {
        if (((e = Pn), (Pn = null), (xl = 0), J & 6)) throw Error(L(331));
        var r = J;
        for (J |= 4, z = e.current; z !== null; ) {
          var s = z,
            o = s.child;
          if (z.flags & 16) {
            var l = s.deletions;
            if (l !== null) {
              for (var a = 0; a < l.length; a++) {
                var u = l[a];
                for (z = u; z !== null; ) {
                  var c = z;
                  switch (c.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Qr(8, c, s);
                  }
                  var f = c.child;
                  if (f !== null) (f.return = c), (z = f);
                  else
                    for (; z !== null; ) {
                      c = z;
                      var d = c.sibling,
                        h = c.return;
                      if ((s0(c), c === u)) {
                        z = null;
                        break;
                      }
                      if (d !== null) {
                        (d.return = h), (z = d);
                        break;
                      }
                      z = h;
                    }
                }
              }
              var m = s.alternate;
              if (m !== null) {
                var v = m.child;
                if (v !== null) {
                  m.child = null;
                  do {
                    var _ = v.sibling;
                    (v.sibling = null), (v = _);
                  } while (v !== null);
                }
              }
              z = s;
            }
          }
          if (s.subtreeFlags & 2064 && o !== null) (o.return = s), (z = o);
          else
            e: for (; z !== null; ) {
              if (((s = z), s.flags & 2048))
                switch (s.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Qr(9, s, s.return);
                }
              var g = s.sibling;
              if (g !== null) {
                (g.return = s.return), (z = g);
                break e;
              }
              z = s.return;
            }
        }
        var y = e.current;
        for (z = y; z !== null; ) {
          o = z;
          var w = o.child;
          if (o.subtreeFlags & 2064 && w !== null) (w.return = o), (z = w);
          else
            e: for (o = y; z !== null; ) {
              if (((l = z), l.flags & 2048))
                try {
                  switch (l.tag) {
                    case 0:
                    case 11:
                    case 15:
                      $l(9, l);
                  }
                } catch (k) {
                  he(l, l.return, k);
                }
              if (l === o) {
                z = null;
                break e;
              }
              var E = l.sibling;
              if (E !== null) {
                (E.return = l.return), (z = E);
                break e;
              }
              z = l.return;
            }
        }
        if (
          ((J = r), Kn(), Qt && typeof Qt.onPostCommitFiberRoot == "function")
        )
          try {
            Qt.onPostCommitFiberRoot(jl, e);
          } catch {}
        i = !0;
      }
      return i;
    } finally {
      (ne = n), (St.transition = t);
    }
  }
  return !1;
}
function gh(e, t, n) {
  (t = er(n, t)),
    (t = Kg(e, t, 1)),
    (e = Dn(e, t, 1)),
    (t = $e()),
    e !== null && (Ds(e, 1, t), nt(e, t));
}
function he(e, t, n) {
  if (e.tag === 3) gh(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        gh(t, e, n);
        break;
      } else if (t.tag === 1) {
        var i = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof i.componentDidCatch == "function" &&
            (An === null || !An.has(i)))
        ) {
          (e = er(n, e)),
            (e = qg(t, e, 1)),
            (t = Dn(t, e, 1)),
            (e = $e()),
            t !== null && (Ds(t, 1, e), nt(t, e));
          break;
        }
      }
      t = t.return;
    }
}
function t_(e, t, n) {
  var i = e.pingCache;
  i !== null && i.delete(t),
    (t = $e()),
    (e.pingedLanes |= e.suspendedLanes & n),
    Ne === e &&
      (De & n) === n &&
      (Te === 4 || (Te === 3 && (De & 130023424) === De && 500 > ge() - df)
        ? ci(e, 0)
        : (ff |= n)),
    nt(e, t);
}
function m0(e, t) {
  t === 0 &&
    (e.mode & 1
      ? ((t = so), (so <<= 1), !(so & 130023424) && (so = 4194304))
      : (t = 1));
  var n = $e();
  (e = hn(e, t)), e !== null && (Ds(e, t, n), nt(e, n));
}
function n_(e) {
  var t = e.memoizedState,
    n = 0;
  t !== null && (n = t.retryLane), m0(e, n);
}
function i_(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var i = e.stateNode,
        r = e.memoizedState;
      r !== null && (n = r.retryLane);
      break;
    case 19:
      i = e.stateNode;
      break;
    default:
      throw Error(L(314));
  }
  i !== null && i.delete(t), m0(e, n);
}
var g0;
g0 = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || et.current) Je = !0;
    else {
      if (!(e.lanes & n) && !(t.flags & 128)) return (Je = !1), V1(e, t, n);
      Je = !!(e.flags & 131072);
    }
  else (Je = !1), ue && t.flags & 1048576 && _g(t, cl, t.index);
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var i = t.type;
      Ho(e, t), (e = t.pendingProps);
      var r = Qi(t, Ue.current);
      Yi(t, n), (r = sf(null, t, i, e, r, n));
      var s = of();
      return (
        (t.flags |= 1),
        typeof r == "object" &&
        r !== null &&
        typeof r.render == "function" &&
        r.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            tt(i) ? ((s = !0), al(t)) : (s = !1),
            (t.memoizedState =
              r.state !== null && r.state !== void 0 ? r.state : null),
            Jc(t),
            (r.updater = Vl),
            (t.stateNode = r),
            (r._reactInternals = t),
            ju(t, i, e, n),
            (t = Bu(null, t, i, !0, s, n)))
          : ((t.tag = 0), ue && s && Yc(t), Ve(null, t, r, n), (t = t.child)),
        t
      );
    case 16:
      i = t.elementType;
      e: {
        switch (
          (Ho(e, t),
          (e = t.pendingProps),
          (r = i._init),
          (i = r(i._payload)),
          (t.type = i),
          (r = t.tag = s_(i)),
          (e = Nt(i, e)),
          r)
        ) {
          case 0:
            t = Fu(null, t, i, e, n);
            break e;
          case 1:
            t = oh(null, t, i, e, n);
            break e;
          case 11:
            t = rh(null, t, i, e, n);
            break e;
          case 14:
            t = sh(null, t, i, Nt(i.type, e), n);
            break e;
        }
        throw Error(L(306, i, ""));
      }
      return t;
    case 0:
      return (
        (i = t.type),
        (r = t.pendingProps),
        (r = t.elementType === i ? r : Nt(i, r)),
        Fu(e, t, i, r, n)
      );
    case 1:
      return (
        (i = t.type),
        (r = t.pendingProps),
        (r = t.elementType === i ? r : Nt(i, r)),
        oh(e, t, i, r, n)
      );
    case 3:
      e: {
        if ((Jg(t), e === null)) throw Error(L(387));
        (i = t.pendingProps),
          (s = t.memoizedState),
          (r = s.element),
          Tg(e, t),
          hl(t, i, null, n);
        var o = t.memoizedState;
        if (((i = o.element), s.isDehydrated))
          if (
            ((s = {
              element: i,
              isDehydrated: !1,
              cache: o.cache,
              pendingSuspenseBoundaries: o.pendingSuspenseBoundaries,
              transitions: o.transitions,
            }),
            (t.updateQueue.baseState = s),
            (t.memoizedState = s),
            t.flags & 256)
          ) {
            (r = er(Error(L(423)), t)), (t = lh(e, t, i, n, r));
            break e;
          } else if (i !== r) {
            (r = er(Error(L(424)), t)), (t = lh(e, t, i, n, r));
            break e;
          } else
            for (
              lt = In(t.stateNode.containerInfo.firstChild),
                at = t,
                ue = !0,
                Rt = null,
                n = Eg(t, null, i, n),
                t.child = n;
              n;

            )
              (n.flags = (n.flags & -3) | 4096), (n = n.sibling);
        else {
          if ((Gi(), i === r)) {
            t = pn(e, t, n);
            break e;
          }
          Ve(e, t, i, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        Cg(t),
        e === null && Iu(t),
        (i = t.type),
        (r = t.pendingProps),
        (s = e !== null ? e.memoizedProps : null),
        (o = r.children),
        Ou(i, r) ? (o = null) : s !== null && Ou(i, s) && (t.flags |= 32),
        Zg(e, t),
        Ve(e, t, o, n),
        t.child
      );
    case 6:
      return e === null && Iu(t), null;
    case 13:
      return e0(e, t, n);
    case 4:
      return (
        ef(t, t.stateNode.containerInfo),
        (i = t.pendingProps),
        e === null ? (t.child = Zi(t, null, i, n)) : Ve(e, t, i, n),
        t.child
      );
    case 11:
      return (
        (i = t.type),
        (r = t.pendingProps),
        (r = t.elementType === i ? r : Nt(i, r)),
        rh(e, t, i, r, n)
      );
    case 7:
      return Ve(e, t, t.pendingProps, n), t.child;
    case 8:
      return Ve(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return Ve(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (
          ((i = t.type._context),
          (r = t.pendingProps),
          (s = t.memoizedProps),
          (o = r.value),
          se(fl, i._currentValue),
          (i._currentValue = o),
          s !== null)
        )
          if (jt(s.value, o)) {
            if (s.children === r.children && !et.current) {
              t = pn(e, t, n);
              break e;
            }
          } else
            for (s = t.child, s !== null && (s.return = t); s !== null; ) {
              var l = s.dependencies;
              if (l !== null) {
                o = s.child;
                for (var a = l.firstContext; a !== null; ) {
                  if (a.context === i) {
                    if (s.tag === 1) {
                      (a = cn(-1, n & -n)), (a.tag = 2);
                      var u = s.updateQueue;
                      if (u !== null) {
                        u = u.shared;
                        var c = u.pending;
                        c === null
                          ? (a.next = a)
                          : ((a.next = c.next), (c.next = a)),
                          (u.pending = a);
                      }
                    }
                    (s.lanes |= n),
                      (a = s.alternate),
                      a !== null && (a.lanes |= n),
                      Du(s.return, n, t),
                      (l.lanes |= n);
                    break;
                  }
                  a = a.next;
                }
              } else if (s.tag === 10) o = s.type === t.type ? null : s.child;
              else if (s.tag === 18) {
                if (((o = s.return), o === null)) throw Error(L(341));
                (o.lanes |= n),
                  (l = o.alternate),
                  l !== null && (l.lanes |= n),
                  Du(o, n, t),
                  (o = s.sibling);
              } else o = s.child;
              if (o !== null) o.return = s;
              else
                for (o = s; o !== null; ) {
                  if (o === t) {
                    o = null;
                    break;
                  }
                  if (((s = o.sibling), s !== null)) {
                    (s.return = o.return), (o = s);
                    break;
                  }
                  o = o.return;
                }
              s = o;
            }
        Ve(e, t, r.children, n), (t = t.child);
      }
      return t;
    case 9:
      return (
        (r = t.type),
        (i = t.pendingProps.children),
        Yi(t, n),
        (r = bt(r)),
        (i = i(r)),
        (t.flags |= 1),
        Ve(e, t, i, n),
        t.child
      );
    case 14:
      return (
        (i = t.type),
        (r = Nt(i, t.pendingProps)),
        (r = Nt(i.type, r)),
        sh(e, t, i, r, n)
      );
    case 15:
      return Qg(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (i = t.type),
        (r = t.pendingProps),
        (r = t.elementType === i ? r : Nt(i, r)),
        Ho(e, t),
        (t.tag = 1),
        tt(i) ? ((e = !0), al(t)) : (e = !1),
        Yi(t, n),
        Xg(t, i, r),
        ju(t, i, r, n),
        Bu(null, t, i, !0, e, n)
      );
    case 19:
      return t0(e, t, n);
    case 22:
      return Gg(e, t, n);
  }
  throw Error(L(156, t.tag));
};
function y0(e, t) {
  return Vm(e, t);
}
function r_(e, t, n, i) {
  (this.tag = e),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = i),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null);
}
function xt(e, t, n, i) {
  return new r_(e, t, n, i);
}
function gf(e) {
  return (e = e.prototype), !(!e || !e.isReactComponent);
}
function s_(e) {
  if (typeof e == "function") return gf(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === Ic)) return 11;
    if (e === Dc) return 14;
  }
  return 2;
}
function zn(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = xt(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t),
        (n.type = e.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = e.flags & 14680064),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies =
      t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  );
}
function Vo(e, t, n, i, r, s) {
  var o = 2;
  if (((i = e), typeof e == "function")) gf(e) && (o = 1);
  else if (typeof e == "string") o = 5;
  else
    e: switch (e) {
      case Mi:
        return fi(n.children, r, s, t);
      case Lc:
        (o = 8), (r |= 8);
        break;
      case lu:
        return (
          (e = xt(12, n, t, r | 2)), (e.elementType = lu), (e.lanes = s), e
        );
      case au:
        return (e = xt(13, n, t, r)), (e.elementType = au), (e.lanes = s), e;
      case uu:
        return (e = xt(19, n, t, r)), (e.elementType = uu), (e.lanes = s), e;
      case Cm:
        return Xl(n, r, s, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case km:
              o = 10;
              break e;
            case Tm:
              o = 9;
              break e;
            case Ic:
              o = 11;
              break e;
            case Dc:
              o = 14;
              break e;
            case bn:
              (o = 16), (i = null);
              break e;
          }
        throw Error(L(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = xt(o, n, t, r)), (t.elementType = e), (t.type = i), (t.lanes = s), t
  );
}
function fi(e, t, n, i) {
  return (e = xt(7, e, i, t)), (e.lanes = n), e;
}
function Xl(e, t, n, i) {
  return (
    (e = xt(22, e, i, t)),
    (e.elementType = Cm),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function Ua(e, t, n) {
  return (e = xt(6, e, null, t)), (e.lanes = n), e;
}
function Wa(e, t, n) {
  return (
    (t = xt(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function o_(e, t, n, i, r) {
  (this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = ba(0)),
    (this.expirationTimes = ba(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = ba(0)),
    (this.identifierPrefix = i),
    (this.onRecoverableError = r),
    (this.mutableSourceEagerHydrationData = null);
}
function yf(e, t, n, i, r, s, o, l, a) {
  return (
    (e = new o_(e, t, n, l, a)),
    t === 1 ? ((t = 1), s === !0 && (t |= 8)) : (t = 0),
    (s = xt(3, null, null, t)),
    (e.current = s),
    (s.stateNode = e),
    (s.memoizedState = {
      element: i,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    Jc(s),
    e
  );
}
function l_(e, t, n) {
  var i = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: Ni,
    key: i == null ? null : "" + i,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function v0(e) {
  if (!e) return Un;
  e = e._reactInternals;
  e: {
    if (Si(e) !== e || e.tag !== 1) throw Error(L(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (tt(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(L(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (tt(n)) return vg(e, n, t);
  }
  return t;
}
function x0(e, t, n, i, r, s, o, l, a) {
  return (
    (e = yf(n, i, !0, e, r, s, o, l, a)),
    (e.context = v0(null)),
    (n = e.current),
    (i = $e()),
    (r = jn(n)),
    (s = cn(i, r)),
    (s.callback = t ?? null),
    Dn(n, s, r),
    (e.current.lanes = r),
    Ds(e, r, i),
    nt(e, i),
    e
  );
}
function Kl(e, t, n, i) {
  var r = t.current,
    s = $e(),
    o = jn(r);
  return (
    (n = v0(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = cn(s, o)),
    (t.payload = { element: e }),
    (i = i === void 0 ? null : i),
    i !== null && (t.callback = i),
    (e = Dn(r, t, o)),
    e !== null && (At(e, r, o, s), zo(e, r, o)),
    o
  );
}
function wl(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function yh(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function vf(e, t) {
  yh(e, t), (e = e.alternate) && yh(e, t);
}
function a_() {
  return null;
}
var _0 =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function xf(e) {
  this._internalRoot = e;
}
ql.prototype.render = xf.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(L(409));
  Kl(e, t, null, null);
};
ql.prototype.unmount = xf.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    vi(function () {
      Kl(null, e, null, null);
    }),
      (t[dn] = null);
  }
};
function ql(e) {
  this._internalRoot = e;
}
ql.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = Gm();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < kn.length && t !== 0 && t < kn[n].priority; n++);
    kn.splice(n, 0, e), n === 0 && Jm(e);
  }
};
function _f(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function Ql(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function vh() {}
function u_(e, t, n, i, r) {
  if (r) {
    if (typeof i == "function") {
      var s = i;
      i = function () {
        var u = wl(o);
        s.call(u);
      };
    }
    var o = x0(t, i, e, 0, null, !1, !1, "", vh);
    return (
      (e._reactRootContainer = o),
      (e[dn] = o.current),
      ms(e.nodeType === 8 ? e.parentNode : e),
      vi(),
      o
    );
  }
  for (; (r = e.lastChild); ) e.removeChild(r);
  if (typeof i == "function") {
    var l = i;
    i = function () {
      var u = wl(a);
      l.call(u);
    };
  }
  var a = yf(e, 0, !1, null, null, !1, !1, "", vh);
  return (
    (e._reactRootContainer = a),
    (e[dn] = a.current),
    ms(e.nodeType === 8 ? e.parentNode : e),
    vi(function () {
      Kl(t, a, n, i);
    }),
    a
  );
}
function Gl(e, t, n, i, r) {
  var s = n._reactRootContainer;
  if (s) {
    var o = s;
    if (typeof r == "function") {
      var l = r;
      r = function () {
        var a = wl(o);
        l.call(a);
      };
    }
    Kl(t, o, e, r);
  } else o = u_(n, t, e, r, i);
  return wl(o);
}
qm = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = Ar(t.pendingLanes);
        n !== 0 &&
          (zc(t, n | 1), nt(t, ge()), !(J & 6) && ((tr = ge() + 500), Kn()));
      }
      break;
    case 13:
      vi(function () {
        var i = hn(e, 1);
        if (i !== null) {
          var r = $e();
          At(i, e, 1, r);
        }
      }),
        vf(e, 1);
  }
};
Fc = function (e) {
  if (e.tag === 13) {
    var t = hn(e, 134217728);
    if (t !== null) {
      var n = $e();
      At(t, e, 134217728, n);
    }
    vf(e, 134217728);
  }
};
Qm = function (e) {
  if (e.tag === 13) {
    var t = jn(e),
      n = hn(e, t);
    if (n !== null) {
      var i = $e();
      At(n, e, t, i);
    }
    vf(e, t);
  }
};
Gm = function () {
  return ne;
};
Zm = function (e, t) {
  var n = ne;
  try {
    return (ne = e), t();
  } finally {
    ne = n;
  }
};
xu = function (e, t, n) {
  switch (t) {
    case "input":
      if ((du(e, n), (t = n.name), n.type === "radio" && t != null)) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (
          n = n.querySelectorAll(
            "input[name=" + JSON.stringify("" + t) + '][type="radio"]'
          ),
            t = 0;
          t < n.length;
          t++
        ) {
          var i = n[t];
          if (i !== e && i.form === e.form) {
            var r = Hl(i);
            if (!r) throw Error(L(90));
            Om(i), du(i, r);
          }
        }
      }
      break;
    case "textarea":
      Mm(e, n);
      break;
    case "select":
      (t = n.value), t != null && Ui(e, !!n.multiple, t, !1);
  }
};
zm = hf;
Fm = vi;
var c_ = { usingClientEntryPoint: !1, Events: [js, Di, Hl, Am, jm, hf] },
  Cr = {
    findFiberByHostInstance: ri,
    bundleType: 0,
    version: "18.3.1",
    rendererPackageName: "react-dom",
  },
  f_ = {
    bundleType: Cr.bundleType,
    version: Cr.version,
    rendererPackageName: Cr.rendererPackageName,
    rendererConfig: Cr.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: gn.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return (e = Um(e)), e === null ? null : e.stateNode;
    },
    findFiberByHostInstance: Cr.findFiberByHostInstance || a_,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var yo = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!yo.isDisabled && yo.supportsFiber)
    try {
      (jl = yo.inject(f_)), (Qt = yo);
    } catch {}
}
ft.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = c_;
ft.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!_f(t)) throw Error(L(200));
  return l_(e, t, null, n);
};
ft.createRoot = function (e, t) {
  if (!_f(e)) throw Error(L(299));
  var n = !1,
    i = "",
    r = _0;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (i = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (r = t.onRecoverableError)),
    (t = yf(e, 1, !1, null, null, n, !1, i, r)),
    (e[dn] = t.current),
    ms(e.nodeType === 8 ? e.parentNode : e),
    new xf(t)
  );
};
ft.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(L(188))
      : ((e = Object.keys(e).join(",")), Error(L(268, e)));
  return (e = Um(t)), (e = e === null ? null : e.stateNode), e;
};
ft.flushSync = function (e) {
  return vi(e);
};
ft.hydrate = function (e, t, n) {
  if (!Ql(t)) throw Error(L(200));
  return Gl(null, e, t, !0, n);
};
ft.hydrateRoot = function (e, t, n) {
  if (!_f(e)) throw Error(L(405));
  var i = (n != null && n.hydratedSources) || null,
    r = !1,
    s = "",
    o = _0;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (r = !0),
      n.identifierPrefix !== void 0 && (s = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (o = n.onRecoverableError)),
    (t = x0(t, null, e, 1, n ?? null, r, !1, s, o)),
    (e[dn] = t.current),
    ms(e),
    i)
  )
    for (e = 0; e < i.length; e++)
      (n = i[e]),
        (r = n._getVersion),
        (r = r(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, r])
          : t.mutableSourceEagerHydrationData.push(n, r);
  return new ql(t);
};
ft.render = function (e, t, n) {
  if (!Ql(t)) throw Error(L(200));
  return Gl(null, e, t, !1, n);
};
ft.unmountComponentAtNode = function (e) {
  if (!Ql(e)) throw Error(L(40));
  return e._reactRootContainer
    ? (vi(function () {
        Gl(null, null, e, !1, function () {
          (e._reactRootContainer = null), (e[dn] = null);
        });
      }),
      !0)
    : !1;
};
ft.unstable_batchedUpdates = hf;
ft.unstable_renderSubtreeIntoContainer = function (e, t, n, i) {
  if (!Ql(n)) throw Error(L(200));
  if (e == null || e._reactInternals === void 0) throw Error(L(38));
  return Gl(e, t, n, !1, i);
};
ft.version = "18.3.1-next-f1338f8080-20240426";
function w0() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(w0);
    } catch (e) {
      console.error(e);
    }
}
w0(), (wm.exports = ft);
var d_ = wm.exports,
  S0,
  xh = d_;
(S0 = xh.createRoot), xh.hydrateRoot;
/**
 * @remix-run/router v1.20.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function Es() {
  return (
    (Es = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var i in n)
              Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
          }
          return e;
        }),
    Es.apply(this, arguments)
  );
}
var On;
(function (e) {
  (e.Pop = "POP"), (e.Push = "PUSH"), (e.Replace = "REPLACE");
})(On || (On = {}));
const _h = "popstate";
function h_(e) {
  e === void 0 && (e = {});
  function t(i, r) {
    let { pathname: s, search: o, hash: l } = i.location;
    return Zu(
      "",
      { pathname: s, search: o, hash: l },
      (r.state && r.state.usr) || null,
      (r.state && r.state.key) || "default"
    );
  }
  function n(i, r) {
    return typeof r == "string" ? r : Sl(r);
  }
  return m_(t, n, null, e);
}
function be(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
function b0(e, t) {
  if (!e) {
    typeof console < "u" && console.warn(t);
    try {
      throw new Error(t);
    } catch {}
  }
}
function p_() {
  return Math.random().toString(36).substr(2, 8);
}
function wh(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function Zu(e, t, n, i) {
  return (
    n === void 0 && (n = null),
    Es(
      { pathname: typeof e == "string" ? e : e.pathname, search: "", hash: "" },
      typeof t == "string" ? lr(t) : t,
      { state: n, key: (t && t.key) || i || p_() }
    )
  );
}
function Sl(e) {
  let { pathname: t = "/", search: n = "", hash: i = "" } = e;
  return (
    n && n !== "?" && (t += n.charAt(0) === "?" ? n : "?" + n),
    i && i !== "#" && (t += i.charAt(0) === "#" ? i : "#" + i),
    t
  );
}
function lr(e) {
  let t = {};
  if (e) {
    let n = e.indexOf("#");
    n >= 0 && ((t.hash = e.substr(n)), (e = e.substr(0, n)));
    let i = e.indexOf("?");
    i >= 0 && ((t.search = e.substr(i)), (e = e.substr(0, i))),
      e && (t.pathname = e);
  }
  return t;
}
function m_(e, t, n, i) {
  i === void 0 && (i = {});
  let { window: r = document.defaultView, v5Compat: s = !1 } = i,
    o = r.history,
    l = On.Pop,
    a = null,
    u = c();
  u == null && ((u = 0), o.replaceState(Es({}, o.state, { idx: u }), ""));
  function c() {
    return (o.state || { idx: null }).idx;
  }
  function f() {
    l = On.Pop;
    let _ = c(),
      g = _ == null ? null : _ - u;
    (u = _), a && a({ action: l, location: v.location, delta: g });
  }
  function d(_, g) {
    l = On.Push;
    let y = Zu(v.location, _, g);
    u = c() + 1;
    let w = wh(y, u),
      E = v.createHref(y);
    try {
      o.pushState(w, "", E);
    } catch (k) {
      if (k instanceof DOMException && k.name === "DataCloneError") throw k;
      r.location.assign(E);
    }
    s && a && a({ action: l, location: v.location, delta: 1 });
  }
  function h(_, g) {
    l = On.Replace;
    let y = Zu(v.location, _, g);
    u = c();
    let w = wh(y, u),
      E = v.createHref(y);
    o.replaceState(w, "", E),
      s && a && a({ action: l, location: v.location, delta: 0 });
  }
  function m(_) {
    let g = r.location.origin !== "null" ? r.location.origin : r.location.href,
      y = typeof _ == "string" ? _ : Sl(_);
    return (
      (y = y.replace(/ $/, "%20")),
      be(
        g,
        "No window.location.(origin|href) available to create URL for href: " +
          y
      ),
      new URL(y, g)
    );
  }
  let v = {
    get action() {
      return l;
    },
    get location() {
      return e(r, o);
    },
    listen(_) {
      if (a) throw new Error("A history only accepts one active listener");
      return (
        r.addEventListener(_h, f),
        (a = _),
        () => {
          r.removeEventListener(_h, f), (a = null);
        }
      );
    },
    createHref(_) {
      return t(r, _);
    },
    createURL: m,
    encodeLocation(_) {
      let g = m(_);
      return { pathname: g.pathname, search: g.search, hash: g.hash };
    },
    push: d,
    replace: h,
    go(_) {
      return o.go(_);
    },
  };
  return v;
}
var Sh;
(function (e) {
  (e.data = "data"),
    (e.deferred = "deferred"),
    (e.redirect = "redirect"),
    (e.error = "error");
})(Sh || (Sh = {}));
function g_(e, t, n) {
  return n === void 0 && (n = "/"), y_(e, t, n, !1);
}
function y_(e, t, n, i) {
  let r = typeof t == "string" ? lr(t) : t,
    s = wf(r.pathname || "/", n);
  if (s == null) return null;
  let o = E0(e);
  v_(o);
  let l = null;
  for (let a = 0; l == null && a < o.length; ++a) {
    let u = O_(s);
    l = C_(o[a], u, i);
  }
  return l;
}
function E0(e, t, n, i) {
  t === void 0 && (t = []), n === void 0 && (n = []), i === void 0 && (i = "");
  let r = (s, o, l) => {
    let a = {
      relativePath: l === void 0 ? s.path || "" : l,
      caseSensitive: s.caseSensitive === !0,
      childrenIndex: o,
      route: s,
    };
    a.relativePath.startsWith("/") &&
      (be(
        a.relativePath.startsWith(i),
        'Absolute route path "' +
          a.relativePath +
          '" nested under path ' +
          ('"' + i + '" is not valid. An absolute child route path ') +
          "must start with the combined path of all its parent routes."
      ),
      (a.relativePath = a.relativePath.slice(i.length)));
    let u = Fn([i, a.relativePath]),
      c = n.concat(a);
    s.children &&
      s.children.length > 0 &&
      (be(
        s.index !== !0,
        "Index routes must not have child routes. Please remove " +
          ('all child routes from route path "' + u + '".')
      ),
      E0(s.children, t, c, u)),
      !(s.path == null && !s.index) &&
        t.push({ path: u, score: k_(u, s.index), routesMeta: c });
  };
  return (
    e.forEach((s, o) => {
      var l;
      if (s.path === "" || !((l = s.path) != null && l.includes("?"))) r(s, o);
      else for (let a of k0(s.path)) r(s, o, a);
    }),
    t
  );
}
function k0(e) {
  let t = e.split("/");
  if (t.length === 0) return [];
  let [n, ...i] = t,
    r = n.endsWith("?"),
    s = n.replace(/\?$/, "");
  if (i.length === 0) return r ? [s, ""] : [s];
  let o = k0(i.join("/")),
    l = [];
  return (
    l.push(...o.map((a) => (a === "" ? s : [s, a].join("/")))),
    r && l.push(...o),
    l.map((a) => (e.startsWith("/") && a === "" ? "/" : a))
  );
}
function v_(e) {
  e.sort((t, n) =>
    t.score !== n.score
      ? n.score - t.score
      : T_(
          t.routesMeta.map((i) => i.childrenIndex),
          n.routesMeta.map((i) => i.childrenIndex)
        )
  );
}
const x_ = /^:[\w-]+$/,
  __ = 3,
  w_ = 2,
  S_ = 1,
  b_ = 10,
  E_ = -2,
  bh = (e) => e === "*";
function k_(e, t) {
  let n = e.split("/"),
    i = n.length;
  return (
    n.some(bh) && (i += E_),
    t && (i += w_),
    n
      .filter((r) => !bh(r))
      .reduce((r, s) => r + (x_.test(s) ? __ : s === "" ? S_ : b_), i)
  );
}
function T_(e, t) {
  return e.length === t.length && e.slice(0, -1).every((i, r) => i === t[r])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function C_(e, t, n) {
  let { routesMeta: i } = e,
    r = {},
    s = "/",
    o = [];
  for (let l = 0; l < i.length; ++l) {
    let a = i[l],
      u = l === i.length - 1,
      c = s === "/" ? t : t.slice(s.length) || "/",
      f = Eh(
        { path: a.relativePath, caseSensitive: a.caseSensitive, end: u },
        c
      ),
      d = a.route;
    if (
      (!f &&
        u &&
        n &&
        !i[i.length - 1].route.index &&
        (f = Eh(
          { path: a.relativePath, caseSensitive: a.caseSensitive, end: !1 },
          c
        )),
      !f)
    )
      return null;
    Object.assign(r, f.params),
      o.push({
        params: r,
        pathname: Fn([s, f.pathname]),
        pathnameBase: L_(Fn([s, f.pathnameBase])),
        route: d,
      }),
      f.pathnameBase !== "/" && (s = Fn([s, f.pathnameBase]));
  }
  return o;
}
function Eh(e, t) {
  typeof e == "string" && (e = { path: e, caseSensitive: !1, end: !0 });
  let [n, i] = P_(e.path, e.caseSensitive, e.end),
    r = t.match(n);
  if (!r) return null;
  let s = r[0],
    o = s.replace(/(.)\/+$/, "$1"),
    l = r.slice(1);
  return {
    params: i.reduce((u, c, f) => {
      let { paramName: d, isOptional: h } = c;
      if (d === "*") {
        let v = l[f] || "";
        o = s.slice(0, s.length - v.length).replace(/(.)\/+$/, "$1");
      }
      const m = l[f];
      return (
        h && !m ? (u[d] = void 0) : (u[d] = (m || "").replace(/%2F/g, "/")), u
      );
    }, {}),
    pathname: s,
    pathnameBase: o,
    pattern: e,
  };
}
function P_(e, t, n) {
  t === void 0 && (t = !1),
    n === void 0 && (n = !0),
    b0(
      e === "*" || !e.endsWith("*") || e.endsWith("/*"),
      'Route path "' +
        e +
        '" will be treated as if it were ' +
        ('"' + e.replace(/\*$/, "/*") + '" because the `*` character must ') +
        "always follow a `/` in the pattern. To get rid of this warning, " +
        ('please change the route path to "' + e.replace(/\*$/, "/*") + '".')
    );
  let i = [],
    r =
      "^" +
      e
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (o, l, a) => (
            i.push({ paramName: l, isOptional: a != null }),
            a ? "/?([^\\/]+)?" : "/([^\\/]+)"
          )
        );
  return (
    e.endsWith("*")
      ? (i.push({ paramName: "*" }),
        (r += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : n
      ? (r += "\\/*$")
      : e !== "" && e !== "/" && (r += "(?:(?=\\/|$))"),
    [new RegExp(r, t ? void 0 : "i"), i]
  );
}
function O_(e) {
  try {
    return e
      .split("/")
      .map((t) => decodeURIComponent(t).replace(/\//g, "%2F"))
      .join("/");
  } catch (t) {
    return (
      b0(
        !1,
        'The URL path "' +
          e +
          '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
          ("encoding (" + t + ").")
      ),
      e
    );
  }
}
function wf(e, t) {
  if (t === "/") return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let n = t.endsWith("/") ? t.length - 1 : t.length,
    i = e.charAt(n);
  return i && i !== "/" ? null : e.slice(n) || "/";
}
function N_(e, t) {
  t === void 0 && (t = "/");
  let {
    pathname: n,
    search: i = "",
    hash: r = "",
  } = typeof e == "string" ? lr(e) : e;
  return {
    pathname: n ? (n.startsWith("/") ? n : M_(n, t)) : t,
    search: I_(i),
    hash: D_(r),
  };
}
function M_(e, t) {
  let n = t.replace(/\/+$/, "").split("/");
  return (
    e.split("/").forEach((r) => {
      r === ".." ? n.length > 1 && n.pop() : r !== "." && n.push(r);
    }),
    n.length > 1 ? n.join("/") : "/"
  );
}
function Va(e, t, n, i) {
  return (
    "Cannot include a '" +
    e +
    "' character in a manually specified " +
    ("`to." +
      t +
      "` field [" +
      JSON.stringify(i) +
      "].  Please separate it out to the ") +
    ("`to." + n + "` field. Alternatively you may provide the full path as ") +
    'a string in <Link to="..."> and the router will parse it for you.'
  );
}
function R_(e) {
  return e.filter(
    (t, n) => n === 0 || (t.route.path && t.route.path.length > 0)
  );
}
function T0(e, t) {
  let n = R_(e);
  return t
    ? n.map((i, r) => (r === n.length - 1 ? i.pathname : i.pathnameBase))
    : n.map((i) => i.pathnameBase);
}
function C0(e, t, n, i) {
  i === void 0 && (i = !1);
  let r;
  typeof e == "string"
    ? (r = lr(e))
    : ((r = Es({}, e)),
      be(
        !r.pathname || !r.pathname.includes("?"),
        Va("?", "pathname", "search", r)
      ),
      be(
        !r.pathname || !r.pathname.includes("#"),
        Va("#", "pathname", "hash", r)
      ),
      be(!r.search || !r.search.includes("#"), Va("#", "search", "hash", r)));
  let s = e === "" || r.pathname === "",
    o = s ? "/" : r.pathname,
    l;
  if (o == null) l = n;
  else {
    let f = t.length - 1;
    if (!i && o.startsWith("..")) {
      let d = o.split("/");
      for (; d[0] === ".."; ) d.shift(), (f -= 1);
      r.pathname = d.join("/");
    }
    l = f >= 0 ? t[f] : "/";
  }
  let a = N_(r, l),
    u = o && o !== "/" && o.endsWith("/"),
    c = (s || o === ".") && n.endsWith("/");
  return !a.pathname.endsWith("/") && (u || c) && (a.pathname += "/"), a;
}
const Fn = (e) => e.join("/").replace(/\/\/+/g, "/"),
  L_ = (e) => e.replace(/\/+$/, "").replace(/^\/*/, "/"),
  I_ = (e) => (!e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e),
  D_ = (e) => (!e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e);
function A_(e) {
  return (
    e != null &&
    typeof e.status == "number" &&
    typeof e.statusText == "string" &&
    typeof e.internal == "boolean" &&
    "data" in e
  );
}
const P0 = ["post", "put", "patch", "delete"];
new Set(P0);
const j_ = ["get", ...P0];
new Set(j_);
/**
 * React Router v6.27.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function ks() {
  return (
    (ks = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var i in n)
              Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
          }
          return e;
        }),
    ks.apply(this, arguments)
  );
}
const Sf = M.createContext(null),
  z_ = M.createContext(null),
  bi = M.createContext(null),
  Zl = M.createContext(null),
  Ei = M.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
  O0 = M.createContext(null);
function F_(e, t) {
  let { relative: n } = t === void 0 ? {} : t;
  Fs() || be(!1);
  let { basename: i, navigator: r } = M.useContext(bi),
    { hash: s, pathname: o, search: l } = M0(e, { relative: n }),
    a = o;
  return (
    i !== "/" && (a = o === "/" ? i : Fn([i, o])),
    r.createHref({ pathname: a, search: l, hash: s })
  );
}
function Fs() {
  return M.useContext(Zl) != null;
}
function Jl() {
  return Fs() || be(!1), M.useContext(Zl).location;
}
function N0(e) {
  M.useContext(bi).static || M.useLayoutEffect(e);
}
function B_() {
  let { isDataRoute: e } = M.useContext(Ei);
  return e ? J_() : H_();
}
function H_() {
  Fs() || be(!1);
  let e = M.useContext(Sf),
    { basename: t, future: n, navigator: i } = M.useContext(bi),
    { matches: r } = M.useContext(Ei),
    { pathname: s } = Jl(),
    o = JSON.stringify(T0(r, n.v7_relativeSplatPath)),
    l = M.useRef(!1);
  return (
    N0(() => {
      l.current = !0;
    }),
    M.useCallback(
      function (u, c) {
        if ((c === void 0 && (c = {}), !l.current)) return;
        if (typeof u == "number") {
          i.go(u);
          return;
        }
        let f = C0(u, JSON.parse(o), s, c.relative === "path");
        e == null &&
          t !== "/" &&
          (f.pathname = f.pathname === "/" ? t : Fn([t, f.pathname])),
          (c.replace ? i.replace : i.push)(f, c.state, c);
      },
      [t, i, o, s, e]
    )
  );
}
function M0(e, t) {
  let { relative: n } = t === void 0 ? {} : t,
    { future: i } = M.useContext(bi),
    { matches: r } = M.useContext(Ei),
    { pathname: s } = Jl(),
    o = JSON.stringify(T0(r, i.v7_relativeSplatPath));
  return M.useMemo(() => C0(e, JSON.parse(o), s, n === "path"), [e, o, s, n]);
}
function U_(e, t) {
  return W_(e, t);
}
function W_(e, t, n, i) {
  Fs() || be(!1);
  let { navigator: r } = M.useContext(bi),
    { matches: s } = M.useContext(Ei),
    o = s[s.length - 1],
    l = o ? o.params : {};
  o && o.pathname;
  let a = o ? o.pathnameBase : "/";
  o && o.route;
  let u = Jl(),
    c;
  if (t) {
    var f;
    let _ = typeof t == "string" ? lr(t) : t;
    a === "/" || ((f = _.pathname) != null && f.startsWith(a)) || be(!1),
      (c = _);
  } else c = u;
  let d = c.pathname || "/",
    h = d;
  if (a !== "/") {
    let _ = a.replace(/^\//, "").split("/");
    h = "/" + d.replace(/^\//, "").split("/").slice(_.length).join("/");
  }
  let m = g_(e, { pathname: h }),
    v = K_(
      m &&
        m.map((_) =>
          Object.assign({}, _, {
            params: Object.assign({}, l, _.params),
            pathname: Fn([
              a,
              r.encodeLocation
                ? r.encodeLocation(_.pathname).pathname
                : _.pathname,
            ]),
            pathnameBase:
              _.pathnameBase === "/"
                ? a
                : Fn([
                    a,
                    r.encodeLocation
                      ? r.encodeLocation(_.pathnameBase).pathname
                      : _.pathnameBase,
                  ]),
          })
        ),
      s,
      n,
      i
    );
  return t && v
    ? M.createElement(
        Zl.Provider,
        {
          value: {
            location: ks(
              {
                pathname: "/",
                search: "",
                hash: "",
                state: null,
                key: "default",
              },
              c
            ),
            navigationType: On.Pop,
          },
        },
        v
      )
    : v;
}
function V_() {
  let e = Z_(),
    t = A_(e)
      ? e.status + " " + e.statusText
      : e instanceof Error
      ? e.message
      : JSON.stringify(e),
    n = e instanceof Error ? e.stack : null,
    r = { padding: "0.5rem", backgroundColor: "rgba(200,200,200, 0.5)" };
  return M.createElement(
    M.Fragment,
    null,
    M.createElement("h2", null, "Unexpected Application Error!"),
    M.createElement("h3", { style: { fontStyle: "italic" } }, t),
    n ? M.createElement("pre", { style: r }, n) : null,
    null
  );
}
const $_ = M.createElement(V_, null);
class Y_ extends M.Component {
  constructor(t) {
    super(t),
      (this.state = {
        location: t.location,
        revalidation: t.revalidation,
        error: t.error,
      });
  }
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  static getDerivedStateFromProps(t, n) {
    return n.location !== t.location ||
      (n.revalidation !== "idle" && t.revalidation === "idle")
      ? { error: t.error, location: t.location, revalidation: t.revalidation }
      : {
          error: t.error !== void 0 ? t.error : n.error,
          location: n.location,
          revalidation: t.revalidation || n.revalidation,
        };
  }
  componentDidCatch(t, n) {
    console.error(
      "React Router caught the following error during render",
      t,
      n
    );
  }
  render() {
    return this.state.error !== void 0
      ? M.createElement(
          Ei.Provider,
          { value: this.props.routeContext },
          M.createElement(O0.Provider, {
            value: this.state.error,
            children: this.props.component,
          })
        )
      : this.props.children;
  }
}
function X_(e) {
  let { routeContext: t, match: n, children: i } = e,
    r = M.useContext(Sf);
  return (
    r &&
      r.static &&
      r.staticContext &&
      (n.route.errorElement || n.route.ErrorBoundary) &&
      (r.staticContext._deepestRenderedBoundaryId = n.route.id),
    M.createElement(Ei.Provider, { value: t }, i)
  );
}
function K_(e, t, n, i) {
  var r;
  if (
    (t === void 0 && (t = []),
    n === void 0 && (n = null),
    i === void 0 && (i = null),
    e == null)
  ) {
    var s;
    if (!n) return null;
    if (n.errors) e = n.matches;
    else if (
      (s = i) != null &&
      s.v7_partialHydration &&
      t.length === 0 &&
      !n.initialized &&
      n.matches.length > 0
    )
      e = n.matches;
    else return null;
  }
  let o = e,
    l = (r = n) == null ? void 0 : r.errors;
  if (l != null) {
    let c = o.findIndex(
      (f) => f.route.id && (l == null ? void 0 : l[f.route.id]) !== void 0
    );
    c >= 0 || be(!1), (o = o.slice(0, Math.min(o.length, c + 1)));
  }
  let a = !1,
    u = -1;
  if (n && i && i.v7_partialHydration)
    for (let c = 0; c < o.length; c++) {
      let f = o[c];
      if (
        ((f.route.HydrateFallback || f.route.hydrateFallbackElement) && (u = c),
        f.route.id)
      ) {
        let { loaderData: d, errors: h } = n,
          m =
            f.route.loader &&
            d[f.route.id] === void 0 &&
            (!h || h[f.route.id] === void 0);
        if (f.route.lazy || m) {
          (a = !0), u >= 0 ? (o = o.slice(0, u + 1)) : (o = [o[0]]);
          break;
        }
      }
    }
  return o.reduceRight((c, f, d) => {
    let h,
      m = !1,
      v = null,
      _ = null;
    n &&
      ((h = l && f.route.id ? l[f.route.id] : void 0),
      (v = f.route.errorElement || $_),
      a &&
        (u < 0 && d === 0
          ? ((m = !0), (_ = null))
          : u === d &&
            ((m = !0), (_ = f.route.hydrateFallbackElement || null))));
    let g = t.concat(o.slice(0, d + 1)),
      y = () => {
        let w;
        return (
          h
            ? (w = v)
            : m
            ? (w = _)
            : f.route.Component
            ? (w = M.createElement(f.route.Component, null))
            : f.route.element
            ? (w = f.route.element)
            : (w = c),
          M.createElement(X_, {
            match: f,
            routeContext: { outlet: c, matches: g, isDataRoute: n != null },
            children: w,
          })
        );
      };
    return n && (f.route.ErrorBoundary || f.route.errorElement || d === 0)
      ? M.createElement(Y_, {
          location: n.location,
          revalidation: n.revalidation,
          component: v,
          error: h,
          children: y(),
          routeContext: { outlet: null, matches: g, isDataRoute: !0 },
        })
      : y();
  }, null);
}
var R0 = (function (e) {
    return (
      (e.UseBlocker = "useBlocker"),
      (e.UseRevalidator = "useRevalidator"),
      (e.UseNavigateStable = "useNavigate"),
      e
    );
  })(R0 || {}),
  bl = (function (e) {
    return (
      (e.UseBlocker = "useBlocker"),
      (e.UseLoaderData = "useLoaderData"),
      (e.UseActionData = "useActionData"),
      (e.UseRouteError = "useRouteError"),
      (e.UseNavigation = "useNavigation"),
      (e.UseRouteLoaderData = "useRouteLoaderData"),
      (e.UseMatches = "useMatches"),
      (e.UseRevalidator = "useRevalidator"),
      (e.UseNavigateStable = "useNavigate"),
      (e.UseRouteId = "useRouteId"),
      e
    );
  })(bl || {});
function q_(e) {
  let t = M.useContext(Sf);
  return t || be(!1), t;
}
function Q_(e) {
  let t = M.useContext(z_);
  return t || be(!1), t;
}
function G_(e) {
  let t = M.useContext(Ei);
  return t || be(!1), t;
}
function L0(e) {
  let t = G_(),
    n = t.matches[t.matches.length - 1];
  return n.route.id || be(!1), n.route.id;
}
function Z_() {
  var e;
  let t = M.useContext(O0),
    n = Q_(bl.UseRouteError),
    i = L0(bl.UseRouteError);
  return t !== void 0 ? t : (e = n.errors) == null ? void 0 : e[i];
}
function J_() {
  let { router: e } = q_(R0.UseNavigateStable),
    t = L0(bl.UseNavigateStable),
    n = M.useRef(!1);
  return (
    N0(() => {
      n.current = !0;
    }),
    M.useCallback(
      function (r, s) {
        s === void 0 && (s = {}),
          n.current &&
            (typeof r == "number"
              ? e.navigate(r)
              : e.navigate(r, ks({ fromRouteId: t }, s)));
      },
      [e, t]
    )
  );
}
function $o(e) {
  be(!1);
}
function ew(e) {
  let {
    basename: t = "/",
    children: n = null,
    location: i,
    navigationType: r = On.Pop,
    navigator: s,
    static: o = !1,
    future: l,
  } = e;
  Fs() && be(!1);
  let a = t.replace(/^\/*/, "/"),
    u = M.useMemo(
      () => ({
        basename: a,
        navigator: s,
        static: o,
        future: ks({ v7_relativeSplatPath: !1 }, l),
      }),
      [a, l, s, o]
    );
  typeof i == "string" && (i = lr(i));
  let {
      pathname: c = "/",
      search: f = "",
      hash: d = "",
      state: h = null,
      key: m = "default",
    } = i,
    v = M.useMemo(() => {
      let _ = wf(c, a);
      return _ == null
        ? null
        : {
            location: { pathname: _, search: f, hash: d, state: h, key: m },
            navigationType: r,
          };
    }, [a, c, f, d, h, m, r]);
  return v == null
    ? null
    : M.createElement(
        bi.Provider,
        { value: u },
        M.createElement(Zl.Provider, { children: n, value: v })
      );
}
function tw(e) {
  let { children: t, location: n } = e;
  return U_(Ju(t), n);
}
new Promise(() => {});
function Ju(e, t) {
  t === void 0 && (t = []);
  let n = [];
  return (
    M.Children.forEach(e, (i, r) => {
      if (!M.isValidElement(i)) return;
      let s = [...t, r];
      if (i.type === M.Fragment) {
        n.push.apply(n, Ju(i.props.children, s));
        return;
      }
      i.type !== $o && be(!1), !i.props.index || !i.props.children || be(!1);
      let o = {
        id: i.props.id || s.join("-"),
        caseSensitive: i.props.caseSensitive,
        element: i.props.element,
        Component: i.props.Component,
        index: i.props.index,
        path: i.props.path,
        loader: i.props.loader,
        action: i.props.action,
        errorElement: i.props.errorElement,
        ErrorBoundary: i.props.ErrorBoundary,
        hasErrorBoundary:
          i.props.ErrorBoundary != null || i.props.errorElement != null,
        shouldRevalidate: i.props.shouldRevalidate,
        handle: i.props.handle,
        lazy: i.props.lazy,
      };
      i.props.children && (o.children = Ju(i.props.children, s)), n.push(o);
    }),
    n
  );
}
/**
 * React Router DOM v6.27.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function ec() {
  return (
    (ec = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var i in n)
              Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
          }
          return e;
        }),
    ec.apply(this, arguments)
  );
}
function nw(e, t) {
  if (e == null) return {};
  var n = {},
    i = Object.keys(e),
    r,
    s;
  for (s = 0; s < i.length; s++)
    (r = i[s]), !(t.indexOf(r) >= 0) && (n[r] = e[r]);
  return n;
}
function iw(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function rw(e, t) {
  return e.button === 0 && (!t || t === "_self") && !iw(e);
}
const sw = [
    "onClick",
    "relative",
    "reloadDocument",
    "replace",
    "state",
    "target",
    "to",
    "preventScrollReset",
    "viewTransition",
  ],
  ow = "6";
try {
  window.__reactRouterVersion = ow;
} catch {}
const lw = "startTransition",
  kh = tx[lw];
function aw(e) {
  let { basename: t, children: n, future: i, window: r } = e,
    s = M.useRef();
  s.current == null && (s.current = h_({ window: r, v5Compat: !0 }));
  let o = s.current,
    [l, a] = M.useState({ action: o.action, location: o.location }),
    { v7_startTransition: u } = i || {},
    c = M.useCallback(
      (f) => {
        u && kh ? kh(() => a(f)) : a(f);
      },
      [a, u]
    );
  return (
    M.useLayoutEffect(() => o.listen(c), [o, c]),
    M.createElement(ew, {
      basename: t,
      children: n,
      location: l.location,
      navigationType: l.action,
      navigator: o,
      future: i,
    })
  );
}
const uw =
    typeof window < "u" &&
    typeof window.document < "u" &&
    typeof window.document.createElement < "u",
  cw = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  zr = M.forwardRef(function (t, n) {
    let {
        onClick: i,
        relative: r,
        reloadDocument: s,
        replace: o,
        state: l,
        target: a,
        to: u,
        preventScrollReset: c,
        viewTransition: f,
      } = t,
      d = nw(t, sw),
      { basename: h } = M.useContext(bi),
      m,
      v = !1;
    if (typeof u == "string" && cw.test(u) && ((m = u), uw))
      try {
        let w = new URL(window.location.href),
          E = u.startsWith("//") ? new URL(w.protocol + u) : new URL(u),
          k = wf(E.pathname, h);
        E.origin === w.origin && k != null
          ? (u = k + E.search + E.hash)
          : (v = !0);
      } catch {}
    let _ = F_(u, { relative: r }),
      g = fw(u, {
        replace: o,
        state: l,
        target: a,
        preventScrollReset: c,
        relative: r,
        viewTransition: f,
      });
    function y(w) {
      i && i(w), w.defaultPrevented || g(w);
    }
    return M.createElement(
      "a",
      ec({}, d, { href: m || _, onClick: v || s ? i : y, ref: n, target: a })
    );
  });
var Th;
(function (e) {
  (e.UseScrollRestoration = "useScrollRestoration"),
    (e.UseSubmit = "useSubmit"),
    (e.UseSubmitFetcher = "useSubmitFetcher"),
    (e.UseFetcher = "useFetcher"),
    (e.useViewTransitionState = "useViewTransitionState");
})(Th || (Th = {}));
var Ch;
(function (e) {
  (e.UseFetcher = "useFetcher"),
    (e.UseFetchers = "useFetchers"),
    (e.UseScrollRestoration = "useScrollRestoration");
})(Ch || (Ch = {}));
function fw(e, t) {
  let {
      target: n,
      replace: i,
      state: r,
      preventScrollReset: s,
      relative: o,
      viewTransition: l,
    } = t === void 0 ? {} : t,
    a = B_(),
    u = Jl(),
    c = M0(e, { relative: o });
  return M.useCallback(
    (f) => {
      if (rw(f, n)) {
        f.preventDefault();
        let d = i !== void 0 ? i : Sl(u) === Sl(c);
        a(e, {
          replace: d,
          state: r,
          preventScrollReset: s,
          relative: o,
          viewTransition: l,
        });
      }
    },
    [u, a, c, i, r, n, e, s, o, l]
  );
}
const dw = () =>
  S.jsx("nav", {
    className: "bg-white shadow-md sticky top-0 z-50",
    children: S.jsxs("div", {
      className:
        "container mx-auto px-4 py-2 flex justify-between items-center",
      children: [
        S.jsx(zr, {
          to: "/",
          className: "text-2xl font-bold text-blue-600",
          children: "Stockify",
        }),
        S.jsxs("ul", {
          className: "flex space-x-6",
          children: [
            S.jsx("li", {
              children: S.jsx(zr, {
                to: "/",
                className: "hover:text-blue-600",
                children: "Home",
              }),
            }),
            S.jsx("li", {
              children: S.jsx(zr, {
                to: "/about",
                className: "hover:text-blue-600",
                children: "About",
              }),
            }),
            S.jsx("li", {
              children: S.jsx(zr, {
                to: "/advanced-option-chain",
                className: "hover:text-blue-600",
                children: "Option Chain",
              }),
            }),
            S.jsx("li", {
              children: S.jsx("a", {
                href: "#contact",
                className: "hover:text-blue-600",
                children: "Contact",
              }),
            }),
          ],
        }),
        S.jsx("button", {
          className:
            "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500",
          children: "Get Started",
        }),
      ],
    }),
  });
function I0(e, t) {
  return function () {
    return e.apply(t, arguments);
  };
}
const { toString: hw } = Object.prototype,
  { getPrototypeOf: bf } = Object,
  ea = ((e) => (t) => {
    const n = hw.call(t);
    return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
  })(Object.create(null)),
  zt = (e) => ((e = e.toLowerCase()), (t) => ea(t) === e),
  ta = (e) => (t) => typeof t === e,
  { isArray: ar } = Array,
  Ts = ta("undefined");
function pw(e) {
  return (
    e !== null &&
    !Ts(e) &&
    e.constructor !== null &&
    !Ts(e.constructor) &&
    ut(e.constructor.isBuffer) &&
    e.constructor.isBuffer(e)
  );
}
const D0 = zt("ArrayBuffer");
function mw(e) {
  let t;
  return (
    typeof ArrayBuffer < "u" && ArrayBuffer.isView
      ? (t = ArrayBuffer.isView(e))
      : (t = e && e.buffer && D0(e.buffer)),
    t
  );
}
const gw = ta("string"),
  ut = ta("function"),
  A0 = ta("number"),
  na = (e) => e !== null && typeof e == "object",
  yw = (e) => e === !0 || e === !1,
  Yo = (e) => {
    if (ea(e) !== "object") return !1;
    const t = bf(e);
    return (
      (t === null ||
        t === Object.prototype ||
        Object.getPrototypeOf(t) === null) &&
      !(Symbol.toStringTag in e) &&
      !(Symbol.iterator in e)
    );
  },
  vw = zt("Date"),
  xw = zt("File"),
  _w = zt("Blob"),
  ww = zt("FileList"),
  Sw = (e) => na(e) && ut(e.pipe),
  bw = (e) => {
    let t;
    return (
      e &&
      ((typeof FormData == "function" && e instanceof FormData) ||
        (ut(e.append) &&
          ((t = ea(e)) === "formdata" ||
            (t === "object" &&
              ut(e.toString) &&
              e.toString() === "[object FormData]"))))
    );
  },
  Ew = zt("URLSearchParams"),
  [kw, Tw, Cw, Pw] = ["ReadableStream", "Request", "Response", "Headers"].map(
    zt
  ),
  Ow = (e) =>
    e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Bs(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u") return;
  let i, r;
  if ((typeof e != "object" && (e = [e]), ar(e)))
    for (i = 0, r = e.length; i < r; i++) t.call(null, e[i], i, e);
  else {
    const s = n ? Object.getOwnPropertyNames(e) : Object.keys(e),
      o = s.length;
    let l;
    for (i = 0; i < o; i++) (l = s[i]), t.call(null, e[l], l, e);
  }
}
function j0(e, t) {
  t = t.toLowerCase();
  const n = Object.keys(e);
  let i = n.length,
    r;
  for (; i-- > 0; ) if (((r = n[i]), t === r.toLowerCase())) return r;
  return null;
}
const li =
    typeof globalThis < "u"
      ? globalThis
      : typeof self < "u"
      ? self
      : typeof window < "u"
      ? window
      : global,
  z0 = (e) => !Ts(e) && e !== li;
function tc() {
  const { caseless: e } = (z0(this) && this) || {},
    t = {},
    n = (i, r) => {
      const s = (e && j0(t, r)) || r;
      Yo(t[s]) && Yo(i)
        ? (t[s] = tc(t[s], i))
        : Yo(i)
        ? (t[s] = tc({}, i))
        : ar(i)
        ? (t[s] = i.slice())
        : (t[s] = i);
    };
  for (let i = 0, r = arguments.length; i < r; i++)
    arguments[i] && Bs(arguments[i], n);
  return t;
}
const Nw = (e, t, n, { allOwnKeys: i } = {}) => (
    Bs(
      t,
      (r, s) => {
        n && ut(r) ? (e[s] = I0(r, n)) : (e[s] = r);
      },
      { allOwnKeys: i }
    ),
    e
  ),
  Mw = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e),
  Rw = (e, t, n, i) => {
    (e.prototype = Object.create(t.prototype, i)),
      (e.prototype.constructor = e),
      Object.defineProperty(e, "super", { value: t.prototype }),
      n && Object.assign(e.prototype, n);
  },
  Lw = (e, t, n, i) => {
    let r, s, o;
    const l = {};
    if (((t = t || {}), e == null)) return t;
    do {
      for (r = Object.getOwnPropertyNames(e), s = r.length; s-- > 0; )
        (o = r[s]), (!i || i(o, e, t)) && !l[o] && ((t[o] = e[o]), (l[o] = !0));
      e = n !== !1 && bf(e);
    } while (e && (!n || n(e, t)) && e !== Object.prototype);
    return t;
  },
  Iw = (e, t, n) => {
    (e = String(e)),
      (n === void 0 || n > e.length) && (n = e.length),
      (n -= t.length);
    const i = e.indexOf(t, n);
    return i !== -1 && i === n;
  },
  Dw = (e) => {
    if (!e) return null;
    if (ar(e)) return e;
    let t = e.length;
    if (!A0(t)) return null;
    const n = new Array(t);
    for (; t-- > 0; ) n[t] = e[t];
    return n;
  },
  Aw = (
    (e) => (t) =>
      e && t instanceof e
  )(typeof Uint8Array < "u" && bf(Uint8Array)),
  jw = (e, t) => {
    const i = (e && e[Symbol.iterator]).call(e);
    let r;
    for (; (r = i.next()) && !r.done; ) {
      const s = r.value;
      t.call(e, s[0], s[1]);
    }
  },
  zw = (e, t) => {
    let n;
    const i = [];
    for (; (n = e.exec(t)) !== null; ) i.push(n);
    return i;
  },
  Fw = zt("HTMLFormElement"),
  Bw = (e) =>
    e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (n, i, r) {
      return i.toUpperCase() + r;
    }),
  Ph = (
    ({ hasOwnProperty: e }) =>
    (t, n) =>
      e.call(t, n)
  )(Object.prototype),
  Hw = zt("RegExp"),
  F0 = (e, t) => {
    const n = Object.getOwnPropertyDescriptors(e),
      i = {};
    Bs(n, (r, s) => {
      let o;
      (o = t(r, s, e)) !== !1 && (i[s] = o || r);
    }),
      Object.defineProperties(e, i);
  },
  Uw = (e) => {
    F0(e, (t, n) => {
      if (ut(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1)
        return !1;
      const i = e[n];
      if (ut(i)) {
        if (((t.enumerable = !1), "writable" in t)) {
          t.writable = !1;
          return;
        }
        t.set ||
          (t.set = () => {
            throw Error("Can not rewrite read-only method '" + n + "'");
          });
      }
    });
  },
  Ww = (e, t) => {
    const n = {},
      i = (r) => {
        r.forEach((s) => {
          n[s] = !0;
        });
      };
    return ar(e) ? i(e) : i(String(e).split(t)), n;
  },
  Vw = () => {},
  $w = (e, t) => (e != null && Number.isFinite((e = +e)) ? e : t),
  $a = "abcdefghijklmnopqrstuvwxyz",
  Oh = "0123456789",
  B0 = { DIGIT: Oh, ALPHA: $a, ALPHA_DIGIT: $a + $a.toUpperCase() + Oh },
  Yw = (e = 16, t = B0.ALPHA_DIGIT) => {
    let n = "";
    const { length: i } = t;
    for (; e--; ) n += t[(Math.random() * i) | 0];
    return n;
  };
function Xw(e) {
  return !!(
    e &&
    ut(e.append) &&
    e[Symbol.toStringTag] === "FormData" &&
    e[Symbol.iterator]
  );
}
const Kw = (e) => {
    const t = new Array(10),
      n = (i, r) => {
        if (na(i)) {
          if (t.indexOf(i) >= 0) return;
          if (!("toJSON" in i)) {
            t[r] = i;
            const s = ar(i) ? [] : {};
            return (
              Bs(i, (o, l) => {
                const a = n(o, r + 1);
                !Ts(a) && (s[l] = a);
              }),
              (t[r] = void 0),
              s
            );
          }
        }
        return i;
      };
    return n(e, 0);
  },
  qw = zt("AsyncFunction"),
  Qw = (e) => e && (na(e) || ut(e)) && ut(e.then) && ut(e.catch),
  H0 = ((e, t) =>
    e
      ? setImmediate
      : t
      ? ((n, i) => (
          li.addEventListener(
            "message",
            ({ source: r, data: s }) => {
              r === li && s === n && i.length && i.shift()();
            },
            !1
          ),
          (r) => {
            i.push(r), li.postMessage(n, "*");
          }
        ))(`axios@${Math.random()}`, [])
      : (n) => setTimeout(n))(
    typeof setImmediate == "function",
    ut(li.postMessage)
  ),
  Gw =
    typeof queueMicrotask < "u"
      ? queueMicrotask.bind(li)
      : (typeof process < "u" && process.nextTick) || H0,
  O = {
    isArray: ar,
    isArrayBuffer: D0,
    isBuffer: pw,
    isFormData: bw,
    isArrayBufferView: mw,
    isString: gw,
    isNumber: A0,
    isBoolean: yw,
    isObject: na,
    isPlainObject: Yo,
    isReadableStream: kw,
    isRequest: Tw,
    isResponse: Cw,
    isHeaders: Pw,
    isUndefined: Ts,
    isDate: vw,
    isFile: xw,
    isBlob: _w,
    isRegExp: Hw,
    isFunction: ut,
    isStream: Sw,
    isURLSearchParams: Ew,
    isTypedArray: Aw,
    isFileList: ww,
    forEach: Bs,
    merge: tc,
    extend: Nw,
    trim: Ow,
    stripBOM: Mw,
    inherits: Rw,
    toFlatObject: Lw,
    kindOf: ea,
    kindOfTest: zt,
    endsWith: Iw,
    toArray: Dw,
    forEachEntry: jw,
    matchAll: zw,
    isHTMLForm: Fw,
    hasOwnProperty: Ph,
    hasOwnProp: Ph,
    reduceDescriptors: F0,
    freezeMethods: Uw,
    toObjectSet: Ww,
    toCamelCase: Bw,
    noop: Vw,
    toFiniteNumber: $w,
    findKey: j0,
    global: li,
    isContextDefined: z0,
    ALPHABET: B0,
    generateString: Yw,
    isSpecCompliantForm: Xw,
    toJSONObject: Kw,
    isAsyncFn: qw,
    isThenable: Qw,
    setImmediate: H0,
    asap: Gw,
  };
function V(e, t, n, i, r) {
  Error.call(this),
    Error.captureStackTrace
      ? Error.captureStackTrace(this, this.constructor)
      : (this.stack = new Error().stack),
    (this.message = e),
    (this.name = "AxiosError"),
    t && (this.code = t),
    n && (this.config = n),
    i && (this.request = i),
    r && ((this.response = r), (this.status = r.status ? r.status : null));
}
O.inherits(V, Error, {
  toJSON: function () {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: O.toJSONObject(this.config),
      code: this.code,
      status: this.status,
    };
  },
});
const U0 = V.prototype,
  W0 = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL",
].forEach((e) => {
  W0[e] = { value: e };
});
Object.defineProperties(V, W0);
Object.defineProperty(U0, "isAxiosError", { value: !0 });
V.from = (e, t, n, i, r, s) => {
  const o = Object.create(U0);
  return (
    O.toFlatObject(
      e,
      o,
      function (a) {
        return a !== Error.prototype;
      },
      (l) => l !== "isAxiosError"
    ),
    V.call(o, e.message, t, n, i, r),
    (o.cause = e),
    (o.name = e.name),
    s && Object.assign(o, s),
    o
  );
};
const Zw = null;
function nc(e) {
  return O.isPlainObject(e) || O.isArray(e);
}
function V0(e) {
  return O.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function Nh(e, t, n) {
  return e
    ? e
        .concat(t)
        .map(function (r, s) {
          return (r = V0(r)), !n && s ? "[" + r + "]" : r;
        })
        .join(n ? "." : "")
    : t;
}
function Jw(e) {
  return O.isArray(e) && !e.some(nc);
}
const eS = O.toFlatObject(O, {}, null, function (t) {
  return /^is[A-Z]/.test(t);
});
function ia(e, t, n) {
  if (!O.isObject(e)) throw new TypeError("target must be an object");
  (t = t || new FormData()),
    (n = O.toFlatObject(
      n,
      { metaTokens: !0, dots: !1, indexes: !1 },
      !1,
      function (v, _) {
        return !O.isUndefined(_[v]);
      }
    ));
  const i = n.metaTokens,
    r = n.visitor || c,
    s = n.dots,
    o = n.indexes,
    a = (n.Blob || (typeof Blob < "u" && Blob)) && O.isSpecCompliantForm(t);
  if (!O.isFunction(r)) throw new TypeError("visitor must be a function");
  function u(m) {
    if (m === null) return "";
    if (O.isDate(m)) return m.toISOString();
    if (!a && O.isBlob(m))
      throw new V("Blob is not supported. Use a Buffer instead.");
    return O.isArrayBuffer(m) || O.isTypedArray(m)
      ? a && typeof Blob == "function"
        ? new Blob([m])
        : Buffer.from(m)
      : m;
  }
  function c(m, v, _) {
    let g = m;
    if (m && !_ && typeof m == "object") {
      if (O.endsWith(v, "{}"))
        (v = i ? v : v.slice(0, -2)), (m = JSON.stringify(m));
      else if (
        (O.isArray(m) && Jw(m)) ||
        ((O.isFileList(m) || O.endsWith(v, "[]")) && (g = O.toArray(m)))
      )
        return (
          (v = V0(v)),
          g.forEach(function (w, E) {
            !(O.isUndefined(w) || w === null) &&
              t.append(
                o === !0 ? Nh([v], E, s) : o === null ? v : v + "[]",
                u(w)
              );
          }),
          !1
        );
    }
    return nc(m) ? !0 : (t.append(Nh(_, v, s), u(m)), !1);
  }
  const f = [],
    d = Object.assign(eS, {
      defaultVisitor: c,
      convertValue: u,
      isVisitable: nc,
    });
  function h(m, v) {
    if (!O.isUndefined(m)) {
      if (f.indexOf(m) !== -1)
        throw Error("Circular reference detected in " + v.join("."));
      f.push(m),
        O.forEach(m, function (g, y) {
          (!(O.isUndefined(g) || g === null) &&
            r.call(t, g, O.isString(y) ? y.trim() : y, v, d)) === !0 &&
            h(g, v ? v.concat(y) : [y]);
        }),
        f.pop();
    }
  }
  if (!O.isObject(e)) throw new TypeError("data must be an object");
  return h(e), t;
}
function Mh(e) {
  const t = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0",
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (i) {
    return t[i];
  });
}
function Ef(e, t) {
  (this._pairs = []), e && ia(e, this, t);
}
const $0 = Ef.prototype;
$0.append = function (t, n) {
  this._pairs.push([t, n]);
};
$0.toString = function (t) {
  const n = t
    ? function (i) {
        return t.call(this, i, Mh);
      }
    : Mh;
  return this._pairs
    .map(function (r) {
      return n(r[0]) + "=" + n(r[1]);
    }, "")
    .join("&");
};
function tS(e) {
  return encodeURIComponent(e)
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}
function Y0(e, t, n) {
  if (!t) return e;
  const i = (n && n.encode) || tS,
    r = n && n.serialize;
  let s;
  if (
    (r
      ? (s = r(t, n))
      : (s = O.isURLSearchParams(t) ? t.toString() : new Ef(t, n).toString(i)),
    s)
  ) {
    const o = e.indexOf("#");
    o !== -1 && (e = e.slice(0, o)),
      (e += (e.indexOf("?") === -1 ? "?" : "&") + s);
  }
  return e;
}
class Rh {
  constructor() {
    this.handlers = [];
  }
  use(t, n, i) {
    return (
      this.handlers.push({
        fulfilled: t,
        rejected: n,
        synchronous: i ? i.synchronous : !1,
        runWhen: i ? i.runWhen : null,
      }),
      this.handlers.length - 1
    );
  }
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  clear() {
    this.handlers && (this.handlers = []);
  }
  forEach(t) {
    O.forEach(this.handlers, function (i) {
      i !== null && t(i);
    });
  }
}
const X0 = {
    silentJSONParsing: !0,
    forcedJSONParsing: !0,
    clarifyTimeoutError: !1,
  },
  nS = typeof URLSearchParams < "u" ? URLSearchParams : Ef,
  iS = typeof FormData < "u" ? FormData : null,
  rS = typeof Blob < "u" ? Blob : null,
  sS = {
    isBrowser: !0,
    classes: { URLSearchParams: nS, FormData: iS, Blob: rS },
    protocols: ["http", "https", "file", "blob", "url", "data"],
  },
  kf = typeof window < "u" && typeof document < "u",
  ic = (typeof navigator == "object" && navigator) || void 0,
  oS =
    kf &&
    (!ic || ["ReactNative", "NativeScript", "NS"].indexOf(ic.product) < 0),
  lS =
    typeof WorkerGlobalScope < "u" &&
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts == "function",
  aS = (kf && window.location.href) || "http://localhost",
  uS = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        hasBrowserEnv: kf,
        hasStandardBrowserEnv: oS,
        hasStandardBrowserWebWorkerEnv: lS,
        navigator: ic,
        origin: aS,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  ),
  it = { ...uS, ...sS };
function cS(e, t) {
  return ia(
    e,
    new it.classes.URLSearchParams(),
    Object.assign(
      {
        visitor: function (n, i, r, s) {
          return it.isNode && O.isBuffer(n)
            ? (this.append(i, n.toString("base64")), !1)
            : s.defaultVisitor.apply(this, arguments);
        },
      },
      t
    )
  );
}
function fS(e) {
  return O.matchAll(/\w+|\[(\w*)]/g, e).map((t) =>
    t[0] === "[]" ? "" : t[1] || t[0]
  );
}
function dS(e) {
  const t = {},
    n = Object.keys(e);
  let i;
  const r = n.length;
  let s;
  for (i = 0; i < r; i++) (s = n[i]), (t[s] = e[s]);
  return t;
}
function K0(e) {
  function t(n, i, r, s) {
    let o = n[s++];
    if (o === "__proto__") return !0;
    const l = Number.isFinite(+o),
      a = s >= n.length;
    return (
      (o = !o && O.isArray(r) ? r.length : o),
      a
        ? (O.hasOwnProp(r, o) ? (r[o] = [r[o], i]) : (r[o] = i), !l)
        : ((!r[o] || !O.isObject(r[o])) && (r[o] = []),
          t(n, i, r[o], s) && O.isArray(r[o]) && (r[o] = dS(r[o])),
          !l)
    );
  }
  if (O.isFormData(e) && O.isFunction(e.entries)) {
    const n = {};
    return (
      O.forEachEntry(e, (i, r) => {
        t(fS(i), r, n, 0);
      }),
      n
    );
  }
  return null;
}
function hS(e, t, n) {
  if (O.isString(e))
    try {
      return (t || JSON.parse)(e), O.trim(e);
    } catch (i) {
      if (i.name !== "SyntaxError") throw i;
    }
  return (0, JSON.stringify)(e);
}
const Hs = {
  transitional: X0,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [
    function (t, n) {
      const i = n.getContentType() || "",
        r = i.indexOf("application/json") > -1,
        s = O.isObject(t);
      if ((s && O.isHTMLForm(t) && (t = new FormData(t)), O.isFormData(t)))
        return r ? JSON.stringify(K0(t)) : t;
      if (
        O.isArrayBuffer(t) ||
        O.isBuffer(t) ||
        O.isStream(t) ||
        O.isFile(t) ||
        O.isBlob(t) ||
        O.isReadableStream(t)
      )
        return t;
      if (O.isArrayBufferView(t)) return t.buffer;
      if (O.isURLSearchParams(t))
        return (
          n.setContentType(
            "application/x-www-form-urlencoded;charset=utf-8",
            !1
          ),
          t.toString()
        );
      let l;
      if (s) {
        if (i.indexOf("application/x-www-form-urlencoded") > -1)
          return cS(t, this.formSerializer).toString();
        if ((l = O.isFileList(t)) || i.indexOf("multipart/form-data") > -1) {
          const a = this.env && this.env.FormData;
          return ia(
            l ? { "files[]": t } : t,
            a && new a(),
            this.formSerializer
          );
        }
      }
      return s || r ? (n.setContentType("application/json", !1), hS(t)) : t;
    },
  ],
  transformResponse: [
    function (t) {
      const n = this.transitional || Hs.transitional,
        i = n && n.forcedJSONParsing,
        r = this.responseType === "json";
      if (O.isResponse(t) || O.isReadableStream(t)) return t;
      if (t && O.isString(t) && ((i && !this.responseType) || r)) {
        const o = !(n && n.silentJSONParsing) && r;
        try {
          return JSON.parse(t);
        } catch (l) {
          if (o)
            throw l.name === "SyntaxError"
              ? V.from(l, V.ERR_BAD_RESPONSE, this, null, this.response)
              : l;
        }
      }
      return t;
    },
  ],
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: { FormData: it.classes.FormData, Blob: it.classes.Blob },
  validateStatus: function (t) {
    return t >= 200 && t < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0,
    },
  },
};
O.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
  Hs.headers[e] = {};
});
const pS = O.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent",
  ]),
  mS = (e) => {
    const t = {};
    let n, i, r;
    return (
      e &&
        e
          .split(
            `
`
          )
          .forEach(function (o) {
            (r = o.indexOf(":")),
              (n = o.substring(0, r).trim().toLowerCase()),
              (i = o.substring(r + 1).trim()),
              !(!n || (t[n] && pS[n])) &&
                (n === "set-cookie"
                  ? t[n]
                    ? t[n].push(i)
                    : (t[n] = [i])
                  : (t[n] = t[n] ? t[n] + ", " + i : i));
          }),
      t
    );
  },
  Lh = Symbol("internals");
function Pr(e) {
  return e && String(e).trim().toLowerCase();
}
function Xo(e) {
  return e === !1 || e == null ? e : O.isArray(e) ? e.map(Xo) : String(e);
}
function gS(e) {
  const t = Object.create(null),
    n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let i;
  for (; (i = n.exec(e)); ) t[i[1]] = i[2];
  return t;
}
const yS = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function Ya(e, t, n, i, r) {
  if (O.isFunction(i)) return i.call(this, t, n);
  if ((r && (t = n), !!O.isString(t))) {
    if (O.isString(i)) return t.indexOf(i) !== -1;
    if (O.isRegExp(i)) return i.test(t);
  }
}
function vS(e) {
  return e
    .trim()
    .toLowerCase()
    .replace(/([a-z\d])(\w*)/g, (t, n, i) => n.toUpperCase() + i);
}
function xS(e, t) {
  const n = O.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((i) => {
    Object.defineProperty(e, i + n, {
      value: function (r, s, o) {
        return this[i].call(this, t, r, s, o);
      },
      configurable: !0,
    });
  });
}
class rt {
  constructor(t) {
    t && this.set(t);
  }
  set(t, n, i) {
    const r = this;
    function s(l, a, u) {
      const c = Pr(a);
      if (!c) throw new Error("header name must be a non-empty string");
      const f = O.findKey(r, c);
      (!f || r[f] === void 0 || u === !0 || (u === void 0 && r[f] !== !1)) &&
        (r[f || a] = Xo(l));
    }
    const o = (l, a) => O.forEach(l, (u, c) => s(u, c, a));
    if (O.isPlainObject(t) || t instanceof this.constructor) o(t, n);
    else if (O.isString(t) && (t = t.trim()) && !yS(t)) o(mS(t), n);
    else if (O.isHeaders(t)) for (const [l, a] of t.entries()) s(a, l, i);
    else t != null && s(n, t, i);
    return this;
  }
  get(t, n) {
    if (((t = Pr(t)), t)) {
      const i = O.findKey(this, t);
      if (i) {
        const r = this[i];
        if (!n) return r;
        if (n === !0) return gS(r);
        if (O.isFunction(n)) return n.call(this, r, i);
        if (O.isRegExp(n)) return n.exec(r);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, n) {
    if (((t = Pr(t)), t)) {
      const i = O.findKey(this, t);
      return !!(i && this[i] !== void 0 && (!n || Ya(this, this[i], i, n)));
    }
    return !1;
  }
  delete(t, n) {
    const i = this;
    let r = !1;
    function s(o) {
      if (((o = Pr(o)), o)) {
        const l = O.findKey(i, o);
        l && (!n || Ya(i, i[l], l, n)) && (delete i[l], (r = !0));
      }
    }
    return O.isArray(t) ? t.forEach(s) : s(t), r;
  }
  clear(t) {
    const n = Object.keys(this);
    let i = n.length,
      r = !1;
    for (; i--; ) {
      const s = n[i];
      (!t || Ya(this, this[s], s, t, !0)) && (delete this[s], (r = !0));
    }
    return r;
  }
  normalize(t) {
    const n = this,
      i = {};
    return (
      O.forEach(this, (r, s) => {
        const o = O.findKey(i, s);
        if (o) {
          (n[o] = Xo(r)), delete n[s];
          return;
        }
        const l = t ? vS(s) : String(s).trim();
        l !== s && delete n[s], (n[l] = Xo(r)), (i[l] = !0);
      }),
      this
    );
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const n = Object.create(null);
    return (
      O.forEach(this, (i, r) => {
        i != null && i !== !1 && (n[r] = t && O.isArray(i) ? i.join(", ") : i);
      }),
      n
    );
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ": " + n).join(`
`);
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...n) {
    const i = new this(t);
    return n.forEach((r) => i.set(r)), i;
  }
  static accessor(t) {
    const i = (this[Lh] = this[Lh] = { accessors: {} }).accessors,
      r = this.prototype;
    function s(o) {
      const l = Pr(o);
      i[l] || (xS(r, o), (i[l] = !0));
    }
    return O.isArray(t) ? t.forEach(s) : s(t), this;
  }
}
rt.accessor([
  "Content-Type",
  "Content-Length",
  "Accept",
  "Accept-Encoding",
  "User-Agent",
  "Authorization",
]);
O.reduceDescriptors(rt.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(i) {
      this[n] = i;
    },
  };
});
O.freezeMethods(rt);
function Xa(e, t) {
  const n = this || Hs,
    i = t || n,
    r = rt.from(i.headers);
  let s = i.data;
  return (
    O.forEach(e, function (l) {
      s = l.call(n, s, r.normalize(), t ? t.status : void 0);
    }),
    r.normalize(),
    s
  );
}
function q0(e) {
  return !!(e && e.__CANCEL__);
}
function ur(e, t, n) {
  V.call(this, e ?? "canceled", V.ERR_CANCELED, t, n),
    (this.name = "CanceledError");
}
O.inherits(ur, V, { __CANCEL__: !0 });
function Q0(e, t, n) {
  const i = n.config.validateStatus;
  !n.status || !i || i(n.status)
    ? e(n)
    : t(
        new V(
          "Request failed with status code " + n.status,
          [V.ERR_BAD_REQUEST, V.ERR_BAD_RESPONSE][
            Math.floor(n.status / 100) - 4
          ],
          n.config,
          n.request,
          n
        )
      );
}
function _S(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return (t && t[1]) || "";
}
function wS(e, t) {
  e = e || 10;
  const n = new Array(e),
    i = new Array(e);
  let r = 0,
    s = 0,
    o;
  return (
    (t = t !== void 0 ? t : 1e3),
    function (a) {
      const u = Date.now(),
        c = i[s];
      o || (o = u), (n[r] = a), (i[r] = u);
      let f = s,
        d = 0;
      for (; f !== r; ) (d += n[f++]), (f = f % e);
      if (((r = (r + 1) % e), r === s && (s = (s + 1) % e), u - o < t)) return;
      const h = c && u - c;
      return h ? Math.round((d * 1e3) / h) : void 0;
    }
  );
}
function SS(e, t) {
  let n = 0,
    i = 1e3 / t,
    r,
    s;
  const o = (u, c = Date.now()) => {
    (n = c), (r = null), s && (clearTimeout(s), (s = null)), e.apply(null, u);
  };
  return [
    (...u) => {
      const c = Date.now(),
        f = c - n;
      f >= i
        ? o(u, c)
        : ((r = u),
          s ||
            (s = setTimeout(() => {
              (s = null), o(r);
            }, i - f)));
    },
    () => r && o(r),
  ];
}
const El = (e, t, n = 3) => {
    let i = 0;
    const r = wS(50, 250);
    return SS((s) => {
      const o = s.loaded,
        l = s.lengthComputable ? s.total : void 0,
        a = o - i,
        u = r(a),
        c = o <= l;
      i = o;
      const f = {
        loaded: o,
        total: l,
        progress: l ? o / l : void 0,
        bytes: a,
        rate: u || void 0,
        estimated: u && l && c ? (l - o) / u : void 0,
        event: s,
        lengthComputable: l != null,
        [t ? "download" : "upload"]: !0,
      };
      e(f);
    }, n);
  },
  Ih = (e, t) => {
    const n = e != null;
    return [(i) => t[0]({ lengthComputable: n, total: e, loaded: i }), t[1]];
  },
  Dh =
    (e) =>
    (...t) =>
      O.asap(() => e(...t)),
  bS = it.hasStandardBrowserEnv
    ? (function () {
        const t =
            it.navigator && /(msie|trident)/i.test(it.navigator.userAgent),
          n = document.createElement("a");
        let i;
        function r(s) {
          let o = s;
          return (
            t && (n.setAttribute("href", o), (o = n.href)),
            n.setAttribute("href", o),
            {
              href: n.href,
              protocol: n.protocol ? n.protocol.replace(/:$/, "") : "",
              host: n.host,
              search: n.search ? n.search.replace(/^\?/, "") : "",
              hash: n.hash ? n.hash.replace(/^#/, "") : "",
              hostname: n.hostname,
              port: n.port,
              pathname:
                n.pathname.charAt(0) === "/" ? n.pathname : "/" + n.pathname,
            }
          );
        }
        return (
          (i = r(window.location.href)),
          function (o) {
            const l = O.isString(o) ? r(o) : o;
            return l.protocol === i.protocol && l.host === i.host;
          }
        );
      })()
    : (function () {
        return function () {
          return !0;
        };
      })(),
  ES = it.hasStandardBrowserEnv
    ? {
        write(e, t, n, i, r, s) {
          const o = [e + "=" + encodeURIComponent(t)];
          O.isNumber(n) && o.push("expires=" + new Date(n).toGMTString()),
            O.isString(i) && o.push("path=" + i),
            O.isString(r) && o.push("domain=" + r),
            s === !0 && o.push("secure"),
            (document.cookie = o.join("; "));
        },
        read(e) {
          const t = document.cookie.match(
            new RegExp("(^|;\\s*)(" + e + ")=([^;]*)")
          );
          return t ? decodeURIComponent(t[3]) : null;
        },
        remove(e) {
          this.write(e, "", Date.now() - 864e5);
        },
      }
    : {
        write() {},
        read() {
          return null;
        },
        remove() {},
      };
function kS(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function TS(e, t) {
  return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function G0(e, t) {
  return e && !kS(t) ? TS(e, t) : t;
}
const Ah = (e) => (e instanceof rt ? { ...e } : e);
function xi(e, t) {
  t = t || {};
  const n = {};
  function i(u, c, f) {
    return O.isPlainObject(u) && O.isPlainObject(c)
      ? O.merge.call({ caseless: f }, u, c)
      : O.isPlainObject(c)
      ? O.merge({}, c)
      : O.isArray(c)
      ? c.slice()
      : c;
  }
  function r(u, c, f) {
    if (O.isUndefined(c)) {
      if (!O.isUndefined(u)) return i(void 0, u, f);
    } else return i(u, c, f);
  }
  function s(u, c) {
    if (!O.isUndefined(c)) return i(void 0, c);
  }
  function o(u, c) {
    if (O.isUndefined(c)) {
      if (!O.isUndefined(u)) return i(void 0, u);
    } else return i(void 0, c);
  }
  function l(u, c, f) {
    if (f in t) return i(u, c);
    if (f in e) return i(void 0, u);
  }
  const a = {
    url: s,
    method: s,
    data: s,
    baseURL: o,
    transformRequest: o,
    transformResponse: o,
    paramsSerializer: o,
    timeout: o,
    timeoutMessage: o,
    withCredentials: o,
    withXSRFToken: o,
    adapter: o,
    responseType: o,
    xsrfCookieName: o,
    xsrfHeaderName: o,
    onUploadProgress: o,
    onDownloadProgress: o,
    decompress: o,
    maxContentLength: o,
    maxBodyLength: o,
    beforeRedirect: o,
    transport: o,
    httpAgent: o,
    httpsAgent: o,
    cancelToken: o,
    socketPath: o,
    responseEncoding: o,
    validateStatus: l,
    headers: (u, c) => r(Ah(u), Ah(c), !0),
  };
  return (
    O.forEach(Object.keys(Object.assign({}, e, t)), function (c) {
      const f = a[c] || r,
        d = f(e[c], t[c], c);
      (O.isUndefined(d) && f !== l) || (n[c] = d);
    }),
    n
  );
}
const Z0 = (e) => {
    const t = xi({}, e);
    let {
      data: n,
      withXSRFToken: i,
      xsrfHeaderName: r,
      xsrfCookieName: s,
      headers: o,
      auth: l,
    } = t;
    (t.headers = o = rt.from(o)),
      (t.url = Y0(G0(t.baseURL, t.url), e.params, e.paramsSerializer)),
      l &&
        o.set(
          "Authorization",
          "Basic " +
            btoa(
              (l.username || "") +
                ":" +
                (l.password ? unescape(encodeURIComponent(l.password)) : "")
            )
        );
    let a;
    if (O.isFormData(n)) {
      if (it.hasStandardBrowserEnv || it.hasStandardBrowserWebWorkerEnv)
        o.setContentType(void 0);
      else if ((a = o.getContentType()) !== !1) {
        const [u, ...c] = a
          ? a
              .split(";")
              .map((f) => f.trim())
              .filter(Boolean)
          : [];
        o.setContentType([u || "multipart/form-data", ...c].join("; "));
      }
    }
    if (
      it.hasStandardBrowserEnv &&
      (i && O.isFunction(i) && (i = i(t)), i || (i !== !1 && bS(t.url)))
    ) {
      const u = r && s && ES.read(s);
      u && o.set(r, u);
    }
    return t;
  },
  CS = typeof XMLHttpRequest < "u",
  PS =
    CS &&
    function (e) {
      return new Promise(function (n, i) {
        const r = Z0(e);
        let s = r.data;
        const o = rt.from(r.headers).normalize();
        let { responseType: l, onUploadProgress: a, onDownloadProgress: u } = r,
          c,
          f,
          d,
          h,
          m;
        function v() {
          h && h(),
            m && m(),
            r.cancelToken && r.cancelToken.unsubscribe(c),
            r.signal && r.signal.removeEventListener("abort", c);
        }
        let _ = new XMLHttpRequest();
        _.open(r.method.toUpperCase(), r.url, !0), (_.timeout = r.timeout);
        function g() {
          if (!_) return;
          const w = rt.from(
              "getAllResponseHeaders" in _ && _.getAllResponseHeaders()
            ),
            k = {
              data:
                !l || l === "text" || l === "json"
                  ? _.responseText
                  : _.response,
              status: _.status,
              statusText: _.statusText,
              headers: w,
              config: e,
              request: _,
            };
          Q0(
            function (C) {
              n(C), v();
            },
            function (C) {
              i(C), v();
            },
            k
          ),
            (_ = null);
        }
        "onloadend" in _
          ? (_.onloadend = g)
          : (_.onreadystatechange = function () {
              !_ ||
                _.readyState !== 4 ||
                (_.status === 0 &&
                  !(_.responseURL && _.responseURL.indexOf("file:") === 0)) ||
                setTimeout(g);
            }),
          (_.onabort = function () {
            _ &&
              (i(new V("Request aborted", V.ECONNABORTED, e, _)), (_ = null));
          }),
          (_.onerror = function () {
            i(new V("Network Error", V.ERR_NETWORK, e, _)), (_ = null);
          }),
          (_.ontimeout = function () {
            let E = r.timeout
              ? "timeout of " + r.timeout + "ms exceeded"
              : "timeout exceeded";
            const k = r.transitional || X0;
            r.timeoutErrorMessage && (E = r.timeoutErrorMessage),
              i(
                new V(
                  E,
                  k.clarifyTimeoutError ? V.ETIMEDOUT : V.ECONNABORTED,
                  e,
                  _
                )
              ),
              (_ = null);
          }),
          s === void 0 && o.setContentType(null),
          "setRequestHeader" in _ &&
            O.forEach(o.toJSON(), function (E, k) {
              _.setRequestHeader(k, E);
            }),
          O.isUndefined(r.withCredentials) ||
            (_.withCredentials = !!r.withCredentials),
          l && l !== "json" && (_.responseType = r.responseType),
          u && (([d, m] = El(u, !0)), _.addEventListener("progress", d)),
          a &&
            _.upload &&
            (([f, h] = El(a)),
            _.upload.addEventListener("progress", f),
            _.upload.addEventListener("loadend", h)),
          (r.cancelToken || r.signal) &&
            ((c = (w) => {
              _ &&
                (i(!w || w.type ? new ur(null, e, _) : w),
                _.abort(),
                (_ = null));
            }),
            r.cancelToken && r.cancelToken.subscribe(c),
            r.signal &&
              (r.signal.aborted ? c() : r.signal.addEventListener("abort", c)));
        const y = _S(r.url);
        if (y && it.protocols.indexOf(y) === -1) {
          i(new V("Unsupported protocol " + y + ":", V.ERR_BAD_REQUEST, e));
          return;
        }
        _.send(s || null);
      });
    },
  OS = (e, t) => {
    const { length: n } = (e = e ? e.filter(Boolean) : []);
    if (t || n) {
      let i = new AbortController(),
        r;
      const s = function (u) {
        if (!r) {
          (r = !0), l();
          const c = u instanceof Error ? u : this.reason;
          i.abort(
            c instanceof V ? c : new ur(c instanceof Error ? c.message : c)
          );
        }
      };
      let o =
        t &&
        setTimeout(() => {
          (o = null), s(new V(`timeout ${t} of ms exceeded`, V.ETIMEDOUT));
        }, t);
      const l = () => {
        e &&
          (o && clearTimeout(o),
          (o = null),
          e.forEach((u) => {
            u.unsubscribe
              ? u.unsubscribe(s)
              : u.removeEventListener("abort", s);
          }),
          (e = null));
      };
      e.forEach((u) => u.addEventListener("abort", s));
      const { signal: a } = i;
      return (a.unsubscribe = () => O.asap(l)), a;
    }
  },
  NS = function* (e, t) {
    let n = e.byteLength;
    if (n < t) {
      yield e;
      return;
    }
    let i = 0,
      r;
    for (; i < n; ) (r = i + t), yield e.slice(i, r), (i = r);
  },
  MS = async function* (e, t) {
    for await (const n of RS(e)) yield* NS(n, t);
  },
  RS = async function* (e) {
    if (e[Symbol.asyncIterator]) {
      yield* e;
      return;
    }
    const t = e.getReader();
    try {
      for (;;) {
        const { done: n, value: i } = await t.read();
        if (n) break;
        yield i;
      }
    } finally {
      await t.cancel();
    }
  },
  jh = (e, t, n, i) => {
    const r = MS(e, t);
    let s = 0,
      o,
      l = (a) => {
        o || ((o = !0), i && i(a));
      };
    return new ReadableStream(
      {
        async pull(a) {
          try {
            const { done: u, value: c } = await r.next();
            if (u) {
              l(), a.close();
              return;
            }
            let f = c.byteLength;
            if (n) {
              let d = (s += f);
              n(d);
            }
            a.enqueue(new Uint8Array(c));
          } catch (u) {
            throw (l(u), u);
          }
        },
        cancel(a) {
          return l(a), r.return();
        },
      },
      { highWaterMark: 2 }
    );
  },
  ra =
    typeof fetch == "function" &&
    typeof Request == "function" &&
    typeof Response == "function",
  J0 = ra && typeof ReadableStream == "function",
  LS =
    ra &&
    (typeof TextEncoder == "function"
      ? (
          (e) => (t) =>
            e.encode(t)
        )(new TextEncoder())
      : async (e) => new Uint8Array(await new Response(e).arrayBuffer())),
  ey = (e, ...t) => {
    try {
      return !!e(...t);
    } catch {
      return !1;
    }
  },
  IS =
    J0 &&
    ey(() => {
      let e = !1;
      const t = new Request(it.origin, {
        body: new ReadableStream(),
        method: "POST",
        get duplex() {
          return (e = !0), "half";
        },
      }).headers.has("Content-Type");
      return e && !t;
    }),
  zh = 64 * 1024,
  rc = J0 && ey(() => O.isReadableStream(new Response("").body)),
  kl = { stream: rc && ((e) => e.body) };
ra &&
  ((e) => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((t) => {
      !kl[t] &&
        (kl[t] = O.isFunction(e[t])
          ? (n) => n[t]()
          : (n, i) => {
              throw new V(
                `Response type '${t}' is not supported`,
                V.ERR_NOT_SUPPORT,
                i
              );
            });
    });
  })(new Response());
const DS = async (e) => {
    if (e == null) return 0;
    if (O.isBlob(e)) return e.size;
    if (O.isSpecCompliantForm(e))
      return (
        await new Request(it.origin, { method: "POST", body: e }).arrayBuffer()
      ).byteLength;
    if (O.isArrayBufferView(e) || O.isArrayBuffer(e)) return e.byteLength;
    if ((O.isURLSearchParams(e) && (e = e + ""), O.isString(e)))
      return (await LS(e)).byteLength;
  },
  AS = async (e, t) => {
    const n = O.toFiniteNumber(e.getContentLength());
    return n ?? DS(t);
  },
  jS =
    ra &&
    (async (e) => {
      let {
        url: t,
        method: n,
        data: i,
        signal: r,
        cancelToken: s,
        timeout: o,
        onDownloadProgress: l,
        onUploadProgress: a,
        responseType: u,
        headers: c,
        withCredentials: f = "same-origin",
        fetchOptions: d,
      } = Z0(e);
      u = u ? (u + "").toLowerCase() : "text";
      let h = OS([r, s && s.toAbortSignal()], o),
        m;
      const v =
        h &&
        h.unsubscribe &&
        (() => {
          h.unsubscribe();
        });
      let _;
      try {
        if (
          a &&
          IS &&
          n !== "get" &&
          n !== "head" &&
          (_ = await AS(c, i)) !== 0
        ) {
          let k = new Request(t, { method: "POST", body: i, duplex: "half" }),
            P;
          if (
            (O.isFormData(i) &&
              (P = k.headers.get("content-type")) &&
              c.setContentType(P),
            k.body)
          ) {
            const [C, N] = Ih(_, El(Dh(a)));
            i = jh(k.body, zh, C, N);
          }
        }
        O.isString(f) || (f = f ? "include" : "omit");
        const g = "credentials" in Request.prototype;
        m = new Request(t, {
          ...d,
          signal: h,
          method: n.toUpperCase(),
          headers: c.normalize().toJSON(),
          body: i,
          duplex: "half",
          credentials: g ? f : void 0,
        });
        let y = await fetch(m);
        const w = rc && (u === "stream" || u === "response");
        if (rc && (l || (w && v))) {
          const k = {};
          ["status", "statusText", "headers"].forEach((I) => {
            k[I] = y[I];
          });
          const P = O.toFiniteNumber(y.headers.get("content-length")),
            [C, N] = (l && Ih(P, El(Dh(l), !0))) || [];
          y = new Response(
            jh(y.body, zh, C, () => {
              N && N(), v && v();
            }),
            k
          );
        }
        u = u || "text";
        let E = await kl[O.findKey(kl, u) || "text"](y, e);
        return (
          !w && v && v(),
          await new Promise((k, P) => {
            Q0(k, P, {
              data: E,
              headers: rt.from(y.headers),
              status: y.status,
              statusText: y.statusText,
              config: e,
              request: m,
            });
          })
        );
      } catch (g) {
        throw (
          (v && v(),
          g && g.name === "TypeError" && /fetch/i.test(g.message)
            ? Object.assign(new V("Network Error", V.ERR_NETWORK, e, m), {
                cause: g.cause || g,
              })
            : V.from(g, g && g.code, e, m))
        );
      }
    }),
  sc = { http: Zw, xhr: PS, fetch: jS };
O.forEach(sc, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: t });
    } catch {}
    Object.defineProperty(e, "adapterName", { value: t });
  }
});
const Fh = (e) => `- ${e}`,
  zS = (e) => O.isFunction(e) || e === null || e === !1,
  ty = {
    getAdapter: (e) => {
      e = O.isArray(e) ? e : [e];
      const { length: t } = e;
      let n, i;
      const r = {};
      for (let s = 0; s < t; s++) {
        n = e[s];
        let o;
        if (
          ((i = n),
          !zS(n) && ((i = sc[(o = String(n)).toLowerCase()]), i === void 0))
        )
          throw new V(`Unknown adapter '${o}'`);
        if (i) break;
        r[o || "#" + s] = i;
      }
      if (!i) {
        const s = Object.entries(r).map(
          ([l, a]) =>
            `adapter ${l} ` +
            (a === !1
              ? "is not supported by the environment"
              : "is not available in the build")
        );
        let o = t
          ? s.length > 1
            ? `since :
` +
              s.map(Fh).join(`
`)
            : " " + Fh(s[0])
          : "as no adapter specified";
        throw new V(
          "There is no suitable adapter to dispatch the request " + o,
          "ERR_NOT_SUPPORT"
        );
      }
      return i;
    },
    adapters: sc,
  };
function Ka(e) {
  if (
    (e.cancelToken && e.cancelToken.throwIfRequested(),
    e.signal && e.signal.aborted)
  )
    throw new ur(null, e);
}
function Bh(e) {
  return (
    Ka(e),
    (e.headers = rt.from(e.headers)),
    (e.data = Xa.call(e, e.transformRequest)),
    ["post", "put", "patch"].indexOf(e.method) !== -1 &&
      e.headers.setContentType("application/x-www-form-urlencoded", !1),
    ty
      .getAdapter(e.adapter || Hs.adapter)(e)
      .then(
        function (i) {
          return (
            Ka(e),
            (i.data = Xa.call(e, e.transformResponse, i)),
            (i.headers = rt.from(i.headers)),
            i
          );
        },
        function (i) {
          return (
            q0(i) ||
              (Ka(e),
              i &&
                i.response &&
                ((i.response.data = Xa.call(
                  e,
                  e.transformResponse,
                  i.response
                )),
                (i.response.headers = rt.from(i.response.headers)))),
            Promise.reject(i)
          );
        }
      )
  );
}
const ny = "1.7.7",
  Tf = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach(
  (e, t) => {
    Tf[e] = function (i) {
      return typeof i === e || "a" + (t < 1 ? "n " : " ") + e;
    };
  }
);
const Hh = {};
Tf.transitional = function (t, n, i) {
  function r(s, o) {
    return (
      "[Axios v" +
      ny +
      "] Transitional option '" +
      s +
      "'" +
      o +
      (i ? ". " + i : "")
    );
  }
  return (s, o, l) => {
    if (t === !1)
      throw new V(
        r(o, " has been removed" + (n ? " in " + n : "")),
        V.ERR_DEPRECATED
      );
    return (
      n &&
        !Hh[o] &&
        ((Hh[o] = !0),
        console.warn(
          r(
            o,
            " has been deprecated since v" +
              n +
              " and will be removed in the near future"
          )
        )),
      t ? t(s, o, l) : !0
    );
  };
};
function FS(e, t, n) {
  if (typeof e != "object")
    throw new V("options must be an object", V.ERR_BAD_OPTION_VALUE);
  const i = Object.keys(e);
  let r = i.length;
  for (; r-- > 0; ) {
    const s = i[r],
      o = t[s];
    if (o) {
      const l = e[s],
        a = l === void 0 || o(l, s, e);
      if (a !== !0)
        throw new V("option " + s + " must be " + a, V.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (n !== !0) throw new V("Unknown option " + s, V.ERR_BAD_OPTION);
  }
}
const oc = { assertOptions: FS, validators: Tf },
  _n = oc.validators;
class di {
  constructor(t) {
    (this.defaults = t),
      (this.interceptors = { request: new Rh(), response: new Rh() });
  }
  async request(t, n) {
    try {
      return await this._request(t, n);
    } catch (i) {
      if (i instanceof Error) {
        let r;
        Error.captureStackTrace
          ? Error.captureStackTrace((r = {}))
          : (r = new Error());
        const s = r.stack ? r.stack.replace(/^.+\n/, "") : "";
        try {
          i.stack
            ? s &&
              !String(i.stack).endsWith(s.replace(/^.+\n.+\n/, "")) &&
              (i.stack +=
                `
` + s)
            : (i.stack = s);
        } catch {}
      }
      throw i;
    }
  }
  _request(t, n) {
    typeof t == "string" ? ((n = n || {}), (n.url = t)) : (n = t || {}),
      (n = xi(this.defaults, n));
    const { transitional: i, paramsSerializer: r, headers: s } = n;
    i !== void 0 &&
      oc.assertOptions(
        i,
        {
          silentJSONParsing: _n.transitional(_n.boolean),
          forcedJSONParsing: _n.transitional(_n.boolean),
          clarifyTimeoutError: _n.transitional(_n.boolean),
        },
        !1
      ),
      r != null &&
        (O.isFunction(r)
          ? (n.paramsSerializer = { serialize: r })
          : oc.assertOptions(
              r,
              { encode: _n.function, serialize: _n.function },
              !0
            )),
      (n.method = (n.method || this.defaults.method || "get").toLowerCase());
    let o = s && O.merge(s.common, s[n.method]);
    s &&
      O.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (m) => {
          delete s[m];
        }
      ),
      (n.headers = rt.concat(o, s));
    const l = [];
    let a = !0;
    this.interceptors.request.forEach(function (v) {
      (typeof v.runWhen == "function" && v.runWhen(n) === !1) ||
        ((a = a && v.synchronous), l.unshift(v.fulfilled, v.rejected));
    });
    const u = [];
    this.interceptors.response.forEach(function (v) {
      u.push(v.fulfilled, v.rejected);
    });
    let c,
      f = 0,
      d;
    if (!a) {
      const m = [Bh.bind(this), void 0];
      for (
        m.unshift.apply(m, l),
          m.push.apply(m, u),
          d = m.length,
          c = Promise.resolve(n);
        f < d;

      )
        c = c.then(m[f++], m[f++]);
      return c;
    }
    d = l.length;
    let h = n;
    for (f = 0; f < d; ) {
      const m = l[f++],
        v = l[f++];
      try {
        h = m(h);
      } catch (_) {
        v.call(this, _);
        break;
      }
    }
    try {
      c = Bh.call(this, h);
    } catch (m) {
      return Promise.reject(m);
    }
    for (f = 0, d = u.length; f < d; ) c = c.then(u[f++], u[f++]);
    return c;
  }
  getUri(t) {
    t = xi(this.defaults, t);
    const n = G0(t.baseURL, t.url);
    return Y0(n, t.params, t.paramsSerializer);
  }
}
O.forEach(["delete", "get", "head", "options"], function (t) {
  di.prototype[t] = function (n, i) {
    return this.request(
      xi(i || {}, { method: t, url: n, data: (i || {}).data })
    );
  };
});
O.forEach(["post", "put", "patch"], function (t) {
  function n(i) {
    return function (s, o, l) {
      return this.request(
        xi(l || {}, {
          method: t,
          headers: i ? { "Content-Type": "multipart/form-data" } : {},
          url: s,
          data: o,
        })
      );
    };
  }
  (di.prototype[t] = n()), (di.prototype[t + "Form"] = n(!0));
});
class Cf {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let n;
    this.promise = new Promise(function (s) {
      n = s;
    });
    const i = this;
    this.promise.then((r) => {
      if (!i._listeners) return;
      let s = i._listeners.length;
      for (; s-- > 0; ) i._listeners[s](r);
      i._listeners = null;
    }),
      (this.promise.then = (r) => {
        let s;
        const o = new Promise((l) => {
          i.subscribe(l), (s = l);
        }).then(r);
        return (
          (o.cancel = function () {
            i.unsubscribe(s);
          }),
          o
        );
      }),
      t(function (s, o, l) {
        i.reason || ((i.reason = new ur(s, o, l)), n(i.reason));
      });
  }
  throwIfRequested() {
    if (this.reason) throw this.reason;
  }
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : (this._listeners = [t]);
  }
  unsubscribe(t) {
    if (!this._listeners) return;
    const n = this._listeners.indexOf(t);
    n !== -1 && this._listeners.splice(n, 1);
  }
  toAbortSignal() {
    const t = new AbortController(),
      n = (i) => {
        t.abort(i);
      };
    return (
      this.subscribe(n),
      (t.signal.unsubscribe = () => this.unsubscribe(n)),
      t.signal
    );
  }
  static source() {
    let t;
    return {
      token: new Cf(function (r) {
        t = r;
      }),
      cancel: t,
    };
  }
}
function BS(e) {
  return function (n) {
    return e.apply(null, n);
  };
}
function HS(e) {
  return O.isObject(e) && e.isAxiosError === !0;
}
const lc = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};
Object.entries(lc).forEach(([e, t]) => {
  lc[t] = e;
});
function iy(e) {
  const t = new di(e),
    n = I0(di.prototype.request, t);
  return (
    O.extend(n, di.prototype, t, { allOwnKeys: !0 }),
    O.extend(n, t, null, { allOwnKeys: !0 }),
    (n.create = function (r) {
      return iy(xi(e, r));
    }),
    n
  );
}
const me = iy(Hs);
me.Axios = di;
me.CanceledError = ur;
me.CancelToken = Cf;
me.isCancel = q0;
me.VERSION = ny;
me.toFormData = ia;
me.AxiosError = V;
me.Cancel = me.CanceledError;
me.all = function (t) {
  return Promise.all(t);
};
me.spread = BS;
me.isAxiosError = HS;
me.mergeConfig = xi;
me.AxiosHeaders = rt;
me.formToJSON = (e) => K0(O.isHTMLForm(e) ? new FormData(e) : e);
me.getAdapter = ty.getAdapter;
me.HttpStatusCode = lc;
me.default = me;
const ki = M.createContext(),
  US = ({ children: e }) => {
    const [t, n] = M.useState(null),
      [i, r] = M.useState("dark"),
      [s, o] = M.useState(!0),
      [l, a] = M.useState(!0),
      [u, c] = M.useState(null),
      [f, d] = M.useState(null),
      [h, m] = M.useState(1414780200),
      [v, _] = M.useState("NIFTY"),
      [g, y] = M.useState(!0),
      w = M.useRef(null),
      E = (I) => n(I),
      k = () => n(null),
      P = () => r((I) => (I === "dark" ? "light" : "dark")),
      C = async (I) => {
        var D, F, B;
        try {
          const Z = await me.get("http://192.168.29.33:8000/api/live-data", {
            params: I,
          });
          c(Z.data);
          const X =
            (B =
              (F = (D = Z.data) == null ? void 0 : D.fut) == null
                ? void 0
                : F.data) == null
              ? void 0
              : B.explist;
          (Array.isArray(X) && X.length > 0) ||
            console.warn("The 'explist' is not an array or is empty.");
        } catch (Z) {
          console.error("Error fetching live data:", Z);
        }
      },
      N = async (I) => {
        var D, F, B, Z, X, $;
        try {
          const ie = await me.get("http://192.168.29.33:8000/api/exp-date", {
            params: I,
          });
          d(
            (B =
              (F = (D = ie.data) == null ? void 0 : D.fut) == null
                ? void 0
                : F.data) == null
              ? void 0
              : B.explist
          );
          const ae =
            ($ =
              (X = (Z = ie.data) == null ? void 0 : Z.fut) == null
                ? void 0
                : X.data) == null
              ? void 0
              : $.explist;
          Array.isArray(ae) && ae.length > 0
            ? (m(ae[0]), d(ae))
            : console.warn("The 'explist' is not an array or is empty.");
        } catch (ie) {
          console.error("Error fetching live data:", ie);
        }
      };
    return (
      M.useEffect(() => {
        (async () => {
          if (g)
            try {
              await N({ sid: v, exp: h });
            } catch (D) {
              console.error("Error fetching expiry date:", D);
            }
        })();
      }, [v, g]),
      M.useEffect(() => {
        const I = async () => {
          if (g)
            try {
              await C({ sid: v, exp: h });
            } catch (D) {
              console.error("Error fetching live data:", D);
            }
        };
        return (
          I(), (w.current = setInterval(I, 1e4)), () => clearInterval(w.current)
        );
      }, [h, g, d, f]),
      S.jsx(ki.Provider, {
        value: {
          user: t,
          loginUser: E,
          logoutUser: k,
          theme: i,
          toggleTheme: P,
          isReversed: s,
          setIsReversed: o,
          isHighlighting: l,
          setIsHighlighting: a,
          data: u,
          exp: h,
          setExp: m,
          symbol: v,
          setSymbol: _,
          expDate: f,
          isOc: g,
          setIsOc: y,
        },
        children: e,
      })
    );
  },
  ry = () => {
    const { symbol: e, setSymbol: t } = M.useContext(ki),
      n = (i) => {
        t(i.target.value);
      };
    return S.jsxs("div", {
      className: "form-group",
      children: [
        S.jsx("label", { htmlFor: "ticker", children: "Ticker" }),
        S.jsxs("select", {
          id: "ticker",
          name: "ticker",
          className: "form-control",
          value: e,
          onChange: n,
          required: !0,
          children: [
            S.jsx("option", { value: "NIFTY", children: "NIFTY" }),
            S.jsx("option", { value: "BANKNIFTY", children: "BANKNIFTY" }),
            S.jsx("option", { value: "FINNIFTY", children: "FINNIFTY" }),
            S.jsx("option", { value: "MIDCPNIFTY", children: "MIDCPNIFTY" }),
            S.jsx("option", { value: "NIFTYNXT50", children: "NIFTYNXT50" }),
            S.jsx("option", { value: "SENSEX", children: "SENSEX" }),
            S.jsx("option", { value: "BANKEX", children: "BANKEX" }),
            S.jsx("option", { value: "SHRIRAMFIN", children: "SHRIRAMFIN" }),
            S.jsx("option", { value: "MM", children: "MM" }),
            S.jsx("option", { value: "HDFCLIFE", children: "HDFCLIFE" }),
            S.jsx("option", { value: "DIVISLAB", children: "DIVISLAB" }),
            S.jsx("option", { value: "TITAN", children: "TITAN" }),
            S.jsx("option", { value: "LT", children: "LT" }),
            S.jsx("option", { value: "CRUDEOIL", children: "CRUDEOIL" }),
          ],
        }),
      ],
    });
  },
  WS = () => {
    const e = "Stockify",
      t = (n) => {
        n.preventDefault(), console.log("Message sent!");
      };
    return (
      M.useEffect(() => {
        document.title = `${e} | Home`;
      }, []),
      S.jsxs("div", {
        children: [
          S.jsx("section", {
            className:
              "bg-cover bg-center h-screen flex items-center justify-center",
            style: {
              backgroundImage:
                "url(https://images.unsplash.com/photo-1705635847741-d38022d08d93?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
            },
            children: S.jsxs("div", {
              className: "text-center text-white",
              children: [
                S.jsxs("h1", {
                  className: "text-5xl font-bold mb-4",
                  children: ["Welcome to ", e],
                }),
                S.jsx("p", {
                  className: "text-xl mb-8",
                  children:
                    "Manage your investments smartly with real-time data.",
                }),
                S.jsx(zr, {
                  to: "/advanced-option-chain",
                  className:
                    "px-6 py-3 bg-blue-500 hover:bg-blue-700 rounded text-white text-lg",
                  children: "Explore Option Chain",
                }),
              ],
            }),
          }),
          S.jsx(ry, {}),
          S.jsxs("section", {
            className: "py-16 bg-gray-50 text-center",
            children: [
              S.jsx("h2", {
                className: "text-4xl font-bold mb-10",
                children: "Our Services",
              }),
              S.jsxs("div", {
                className: "flex justify-center space-x-6",
                children: [
                  S.jsxs("div", {
                    className:
                      "w-1/4 p-6 bg-white rounded shadow hover:shadow-lg",
                    children: [
                      S.jsx("i", {
                        className:
                          "fas fa-chart-line text-5xl text-blue-500 mb-4",
                      }),
                      S.jsx("h3", {
                        className: "text-2xl font-semibold mb-2",
                        children: "Option Chain",
                      }),
                      S.jsx("p", {
                        children:
                          "Get real-time option chain data for smart trading decisions.",
                      }),
                    ],
                  }),
                  S.jsxs("div", {
                    className:
                      "w-1/4 p-6 bg-white rounded shadow hover:shadow-lg",
                    children: [
                      S.jsx("i", {
                        className:
                          "fas fa-briefcase text-5xl text-green-500 mb-4",
                      }),
                      S.jsx("h3", {
                        className: "text-2xl font-semibold mb-2",
                        children: "Portfolio Management",
                      }),
                      S.jsx("p", {
                        children:
                          "Manage your investments with advanced analytics and insights.",
                      }),
                    ],
                  }),
                  S.jsxs("div", {
                    className:
                      "w-1/4 p-6 bg-white rounded shadow hover:shadow-lg",
                    children: [
                      S.jsx("i", {
                        className:
                          "fas fa-shield-alt text-5xl text-red-500 mb-4",
                      }),
                      S.jsx("h3", {
                        className: "text-2xl font-semibold mb-2",
                        children: "Risk Management",
                      }),
                      S.jsx("p", {
                        children:
                          "Monitor risks and safeguard your financial portfolio.",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          S.jsxs("section", {
            className: "py-16 bg-white text-center",
            children: [
              S.jsx("h2", {
                className: "text-4xl font-bold mb-10",
                children: "Our Expertise",
              }),
              S.jsxs("div", {
                className: "flex justify-center space-x-8",
                children: [
                  S.jsxs("div", {
                    className: "w-1/5",
                    children: [
                      S.jsx("h3", {
                        className: "text-xl font-semibold",
                        children: "Python",
                      }),
                      S.jsx("div", {
                        className: "w-full bg-gray-300 rounded h-6",
                        children: S.jsx("div", {
                          className: "bg-blue-500 h-6 rounded",
                          style: { width: "90%" },
                        }),
                      }),
                    ],
                  }),
                  S.jsxs("div", {
                    className: "w-1/5",
                    children: [
                      S.jsx("h3", {
                        className: "text-xl font-semibold",
                        children: "JavaScript",
                      }),
                      S.jsx("div", {
                        className: "w-full bg-gray-300 rounded h-6",
                        children: S.jsx("div", {
                          className: "bg-yellow-500 h-6 rounded",
                          style: { width: "80%" },
                        }),
                      }),
                    ],
                  }),
                  S.jsxs("div", {
                    className: "w-1/5",
                    children: [
                      S.jsx("h3", {
                        className: "text-xl font-semibold",
                        children: "MySQL",
                      }),
                      S.jsx("div", {
                        className: "w-full bg-gray-300 rounded h-6",
                        children: S.jsx("div", {
                          className: "bg-green-500 h-6 rounded",
                          style: { width: "70%" },
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          S.jsxs("section", {
            id: "contact",
            className: "py-16 bg-gray-800 text-white text-center",
            children: [
              S.jsx("h2", {
                className: "text-4xl font-bold mb-10",
                children: "Contact Us",
              }),
              S.jsxs("form", {
                className: "max-w-lg mx-auto",
                onSubmit: t,
                children: [
                  S.jsx("div", {
                    className: "mb-4",
                    children: S.jsx("input", {
                      type: "text",
                      placeholder: "Name",
                      className:
                        "w-full p-3 rounded bg-gray-700 placeholder-white",
                      required: !0,
                    }),
                  }),
                  S.jsx("div", {
                    className: "mb-4",
                    children: S.jsx("input", {
                      type: "email",
                      placeholder: "Email",
                      className:
                        "w-full p-3 rounded bg-gray-700 placeholder-white",
                      required: !0,
                    }),
                  }),
                  S.jsx("div", {
                    className: "mb-4",
                    children: S.jsx("textarea", {
                      placeholder: "Message",
                      rows: "4",
                      className:
                        "w-full p-3 rounded bg-gray-700 placeholder-white",
                      required: !0,
                    }),
                  }),
                  S.jsx("button", {
                    type: "submit",
                    className:
                      "px-6 py-3 bg-blue-500 hover:bg-blue-700 rounded text-white",
                    children: "Send Message",
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  },
  VS = () =>
    S.jsxs("section", {
      className: "max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-10",
      children: [
        S.jsx("h2", {
          className: "text-3xl font-semibold mb-4",
          children: "Company Overview",
        }),
        S.jsx("p", {
          className: "text-gray-700",
          children:
            "Stockify provides detailed option chain data and analysis on derivative instruments. Our platform is designed to help traders manage their risks effectively by offering real-time data and insights. With Stockify, traders can make informed decisions and optimize their trading strategies.",
        }),
      ],
    }),
  $S = () =>
    S.jsxs("section", {
      className: "max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-10",
      children: [
        S.jsx("h2", {
          className: "text-3xl font-semibold mb-4",
          children: "Risk Management",
        }),
        S.jsx("p", {
          className: "text-gray-700",
          children:
            "At Stockify, we emphasize the importance of risk management. Our platform offers various tools and features that help traders assess their risks effectively. Users can access detailed analytics, historical data, and risk assessment models that provide a comprehensive view of their positions.",
        }),
        S.jsx("p", {
          className: "text-gray-700 mt-4",
          children: "Our risk management tools include:",
        }),
        S.jsxs("ul", {
          className: "list-disc list-inside mt-2 text-gray-700",
          children: [
            S.jsx("li", { children: "Real-time market data analysis" }),
            S.jsx("li", { children: "Risk assessment tools" }),
            S.jsx("li", { children: "Portfolio optimization strategies" }),
          ],
        }),
      ],
    }),
  YS = () =>
    S.jsxs("section", {
      className: "max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-10",
      children: [
        S.jsx("h2", {
          className: "text-3xl font-semibold mb-4",
          children: "Our Mission",
        }),
        S.jsx("p", {
          className: "text-gray-700",
          children:
            "Our mission at Stockify is to empower traders by providing the most accurate and actionable derivative data available. We aim to make trading more accessible and informed for everyone by continuously innovating and improving our platform.",
        }),
        S.jsx("p", {
          className: "text-gray-700 mt-4",
          children:
            "Join us on our journey to revolutionize the trading experience and help traders manage their risks effectively.",
        }),
      ],
    }),
  XS = () => (
    M.useEffect(() => {
      document.title = "About Stockify";
    }, []),
    S.jsxs("div", {
      className: "min-h-screen bg-gray-100 py-10",
      children: [
        S.jsx("h1", {
          className: "text-4xl font-bold text-center text-blue-600 mb-8",
          children: "About Stockify",
        }),
        S.jsx(VS, {}),
        S.jsx($S, {}),
        S.jsx(YS, {}),
      ],
    })
  );
function st(e) {
  return typeof e == "number"
    ? e >= 1e12 || e <= -1e12
      ? (e / 1e12).toFixed(2) + "T"
      : e >= 1e9 || e <= -1e9
      ? (e / 1e9).toFixed(2) + "B"
      : e >= 1e6 || e <= -1e6
      ? (e / 1e6).toFixed(2) + "M"
      : e >= 1e3 || e <= -1e3
      ? (e / 1e3).toFixed(2) + "k"
      : e.toFixed(2)
    : "N/A";
}
function Xt(e) {
  return e ? e.toFixed(2) : 0;
}
function KS() {
  const { data: e } = M.useContext(ki);
  if (!e) return null;
  const t = e.options.data;
  return S.jsxs("div", {
    className: "w-full flex items-center justify-between space-x-5",
    children: [
      S.jsxs("div", {
        className: "text-center",
        children: [
          S.jsx("p", {
            className: "text-sm font-medium text-gray-600",
            children: "ATM IV",
          }),
          S.jsx("p", {
            className: "text-lg font-semibold text-gray-800",
            children: Xt(t.atmiv) || 0,
          }),
        ],
      }),
      S.jsxs("div", {
        className: "text-center",
        children: [
          S.jsx("p", {
            className: "text-sm font-medium text-gray-600",
            children: "IV Change",
          }),
          S.jsxs("p", {
            className: `text-lg font-semibold text-gray-800 ${
              t.aivperchng >= 0 ? "text-green-600" : "text-red-600"
            }`,
            children: [Xt(t.aivperchng) || 0, "%"],
          }),
        ],
      }),
      S.jsxs("div", {
        className: "text-center",
        children: [
          S.jsx("p", {
            className: "text-sm font-medium text-gray-600",
            children: "Days to Exp",
          }),
          S.jsx("p", {
            className: "text-lg font-semibold text-gray-800",
            children: t.dte || 0,
          }),
        ],
      }),
      S.jsxs("div", {
        className: "text-center",
        children: [
          S.jsx("p", {
            className: "text-sm font-medium text-gray-600",
            children: "Lot Size",
          }),
          S.jsx("p", {
            className: "text-lg font-semibold text-gray-800",
            children: t.olot || 0,
          }),
        ],
      }),
      S.jsxs("div", {
        className: "text-center",
        children: [
          S.jsx("p", {
            className: "text-sm font-medium text-gray-600",
            children: "PCR",
          }),
          S.jsx("p", {
            className: `text-lg font-semibold ${
              t.Rto
                ? t.Rto > 1.2
                  ? "text-green-600"
                  : t.Rto < 0.8
                  ? "text-red-600"
                  : "text-gray-800"
                : "text-gray-400"
            }`,
            children: t.Rto ? t.Rto.toFixed(2) : 0,
          }),
        ],
      }),
    ],
  });
}
function qS() {
  const { data: e } = M.useContext(ki),
    t = e.spot.data,
    n = `${t.d_sym}  | ${Xt(t.Ltp)} | ${st(t.ch)}`;
  return (
    (document.title = n),
    S.jsxs("div", {
      className:
        "flex flex-col md:flex-row md:items-center md:justify-between p-1 bg-white shadow-md ",
      children: [
        S.jsxs("div", {
          className: "flex items-center md:mb-0",
          children: [
            S.jsx("p", {
              className: "text-xl font-semibold text-gray-800",
              children: t.d_sym || "N/A",
            }),
            S.jsx("p", {
              className: "mx-2 text-2xl font-bold text-gray-800",
              children: Xt(t.Ltp),
            }),
            S.jsx("p", {
              className: `text-lg ${
                t.ch > 0 ? "text-green-500" : "text-red-500"
              }`,
              children: st(t.ch),
            }),
            S.jsxs("p", {
              className: `text-lg ${
                t.ch > 0 ? "text-green-500" : "text-red-500"
              }`,
              children: ["(", st(t.p_ch), "%)"],
            }),
          ],
        }),
        S.jsx("div", { children: S.jsx(KS, {}) }),
        S.jsxs("div", {
          className:
            "flex flex-col md:flex-row gap-4 justify-center text-gray-600",
          children: [
            S.jsxs("p", {
              className: "text-sm",
              children: [
                "Open: ",
                S.jsx("span", {
                  className: "font-medium text-gray-800",
                  children: Xt(t.op),
                }),
              ],
            }),
            S.jsxs("p", {
              className: "text-sm",
              children: [
                "High: ",
                S.jsx("span", {
                  className: "font-medium text-gray-800",
                  children: Xt(t.hg),
                }),
              ],
            }),
            S.jsxs("p", {
              className: "text-sm",
              children: [
                "Low: ",
                S.jsx("span", {
                  className: "font-medium text-gray-800",
                  children: Xt(t.lo),
                }),
              ],
            }),
            S.jsxs("p", {
              className: "text-sm",
              children: [
                "Close: ",
                S.jsx("span", {
                  className: "font-medium text-gray-800",
                  children: Xt(t.cl),
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );
}
/*!
 * @kurkle/color v0.3.2
 * https://github.com/kurkle/color#readme
 * (c) 2023 Jukka Kurkela
 * Released under the MIT License
 */ function Us(e) {
  return (e + 0.5) | 0;
}
const Nn = (e, t, n) => Math.max(Math.min(e, n), t);
function Fr(e) {
  return Nn(Us(e * 2.55), 0, 255);
}
function Bn(e) {
  return Nn(Us(e * 255), 0, 255);
}
function ln(e) {
  return Nn(Us(e / 2.55) / 100, 0, 1);
}
function Uh(e) {
  return Nn(Us(e * 100), 0, 100);
}
const gt = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    a: 10,
    b: 11,
    c: 12,
    d: 13,
    e: 14,
    f: 15,
  },
  ac = [..."0123456789ABCDEF"],
  QS = (e) => ac[e & 15],
  GS = (e) => ac[(e & 240) >> 4] + ac[e & 15],
  vo = (e) => (e & 240) >> 4 === (e & 15),
  ZS = (e) => vo(e.r) && vo(e.g) && vo(e.b) && vo(e.a);
function JS(e) {
  var t = e.length,
    n;
  return (
    e[0] === "#" &&
      (t === 4 || t === 5
        ? (n = {
            r: 255 & (gt[e[1]] * 17),
            g: 255 & (gt[e[2]] * 17),
            b: 255 & (gt[e[3]] * 17),
            a: t === 5 ? gt[e[4]] * 17 : 255,
          })
        : (t === 7 || t === 9) &&
          (n = {
            r: (gt[e[1]] << 4) | gt[e[2]],
            g: (gt[e[3]] << 4) | gt[e[4]],
            b: (gt[e[5]] << 4) | gt[e[6]],
            a: t === 9 ? (gt[e[7]] << 4) | gt[e[8]] : 255,
          })),
    n
  );
}
const eb = (e, t) => (e < 255 ? t(e) : "");
function tb(e) {
  var t = ZS(e) ? QS : GS;
  return e ? "#" + t(e.r) + t(e.g) + t(e.b) + eb(e.a, t) : void 0;
}
const nb =
  /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function sy(e, t, n) {
  const i = t * Math.min(n, 1 - n),
    r = (s, o = (s + e / 30) % 12) =>
      n - i * Math.max(Math.min(o - 3, 9 - o, 1), -1);
  return [r(0), r(8), r(4)];
}
function ib(e, t, n) {
  const i = (r, s = (r + e / 60) % 6) =>
    n - n * t * Math.max(Math.min(s, 4 - s, 1), 0);
  return [i(5), i(3), i(1)];
}
function rb(e, t, n) {
  const i = sy(e, 1, 0.5);
  let r;
  for (t + n > 1 && ((r = 1 / (t + n)), (t *= r), (n *= r)), r = 0; r < 3; r++)
    (i[r] *= 1 - t - n), (i[r] += t);
  return i;
}
function sb(e, t, n, i, r) {
  return e === r
    ? (t - n) / i + (t < n ? 6 : 0)
    : t === r
    ? (n - e) / i + 2
    : (e - t) / i + 4;
}
function Pf(e) {
  const n = e.r / 255,
    i = e.g / 255,
    r = e.b / 255,
    s = Math.max(n, i, r),
    o = Math.min(n, i, r),
    l = (s + o) / 2;
  let a, u, c;
  return (
    s !== o &&
      ((c = s - o),
      (u = l > 0.5 ? c / (2 - s - o) : c / (s + o)),
      (a = sb(n, i, r, c, s)),
      (a = a * 60 + 0.5)),
    [a | 0, u || 0, l]
  );
}
function Of(e, t, n, i) {
  return (Array.isArray(t) ? e(t[0], t[1], t[2]) : e(t, n, i)).map(Bn);
}
function Nf(e, t, n) {
  return Of(sy, e, t, n);
}
function ob(e, t, n) {
  return Of(rb, e, t, n);
}
function lb(e, t, n) {
  return Of(ib, e, t, n);
}
function oy(e) {
  return ((e % 360) + 360) % 360;
}
function ab(e) {
  const t = nb.exec(e);
  let n = 255,
    i;
  if (!t) return;
  t[5] !== i && (n = t[6] ? Fr(+t[5]) : Bn(+t[5]));
  const r = oy(+t[2]),
    s = +t[3] / 100,
    o = +t[4] / 100;
  return (
    t[1] === "hwb"
      ? (i = ob(r, s, o))
      : t[1] === "hsv"
      ? (i = lb(r, s, o))
      : (i = Nf(r, s, o)),
    { r: i[0], g: i[1], b: i[2], a: n }
  );
}
function ub(e, t) {
  var n = Pf(e);
  (n[0] = oy(n[0] + t)), (n = Nf(n)), (e.r = n[0]), (e.g = n[1]), (e.b = n[2]);
}
function cb(e) {
  if (!e) return;
  const t = Pf(e),
    n = t[0],
    i = Uh(t[1]),
    r = Uh(t[2]);
  return e.a < 255
    ? `hsla(${n}, ${i}%, ${r}%, ${ln(e.a)})`
    : `hsl(${n}, ${i}%, ${r}%)`;
}
const Wh = {
    x: "dark",
    Z: "light",
    Y: "re",
    X: "blu",
    W: "gr",
    V: "medium",
    U: "slate",
    A: "ee",
    T: "ol",
    S: "or",
    B: "ra",
    C: "lateg",
    D: "ights",
    R: "in",
    Q: "turquois",
    E: "hi",
    P: "ro",
    O: "al",
    N: "le",
    M: "de",
    L: "yello",
    F: "en",
    K: "ch",
    G: "arks",
    H: "ea",
    I: "ightg",
    J: "wh",
  },
  Vh = {
    OiceXe: "f0f8ff",
    antiquewEte: "faebd7",
    aqua: "ffff",
    aquamarRe: "7fffd4",
    azuY: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "0",
    blanKedOmond: "ffebcd",
    Xe: "ff",
    XeviTet: "8a2be2",
    bPwn: "a52a2a",
    burlywood: "deb887",
    caMtXe: "5f9ea0",
    KartYuse: "7fff00",
    KocTate: "d2691e",
    cSO: "ff7f50",
    cSnflowerXe: "6495ed",
    cSnsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "ffff",
    xXe: "8b",
    xcyan: "8b8b",
    xgTMnPd: "b8860b",
    xWay: "a9a9a9",
    xgYF: "6400",
    xgYy: "a9a9a9",
    xkhaki: "bdb76b",
    xmagFta: "8b008b",
    xTivegYF: "556b2f",
    xSange: "ff8c00",
    xScEd: "9932cc",
    xYd: "8b0000",
    xsOmon: "e9967a",
    xsHgYF: "8fbc8f",
    xUXe: "483d8b",
    xUWay: "2f4f4f",
    xUgYy: "2f4f4f",
    xQe: "ced1",
    xviTet: "9400d3",
    dAppRk: "ff1493",
    dApskyXe: "bfff",
    dimWay: "696969",
    dimgYy: "696969",
    dodgerXe: "1e90ff",
    fiYbrick: "b22222",
    flSOwEte: "fffaf0",
    foYstWAn: "228b22",
    fuKsia: "ff00ff",
    gaRsbSo: "dcdcdc",
    ghostwEte: "f8f8ff",
    gTd: "ffd700",
    gTMnPd: "daa520",
    Way: "808080",
    gYF: "8000",
    gYFLw: "adff2f",
    gYy: "808080",
    honeyMw: "f0fff0",
    hotpRk: "ff69b4",
    RdianYd: "cd5c5c",
    Rdigo: "4b0082",
    ivSy: "fffff0",
    khaki: "f0e68c",
    lavFMr: "e6e6fa",
    lavFMrXsh: "fff0f5",
    lawngYF: "7cfc00",
    NmoncEffon: "fffacd",
    ZXe: "add8e6",
    ZcSO: "f08080",
    Zcyan: "e0ffff",
    ZgTMnPdLw: "fafad2",
    ZWay: "d3d3d3",
    ZgYF: "90ee90",
    ZgYy: "d3d3d3",
    ZpRk: "ffb6c1",
    ZsOmon: "ffa07a",
    ZsHgYF: "20b2aa",
    ZskyXe: "87cefa",
    ZUWay: "778899",
    ZUgYy: "778899",
    ZstAlXe: "b0c4de",
    ZLw: "ffffe0",
    lime: "ff00",
    limegYF: "32cd32",
    lRF: "faf0e6",
    magFta: "ff00ff",
    maPon: "800000",
    VaquamarRe: "66cdaa",
    VXe: "cd",
    VScEd: "ba55d3",
    VpurpN: "9370db",
    VsHgYF: "3cb371",
    VUXe: "7b68ee",
    VsprRggYF: "fa9a",
    VQe: "48d1cc",
    VviTetYd: "c71585",
    midnightXe: "191970",
    mRtcYam: "f5fffa",
    mistyPse: "ffe4e1",
    moccasR: "ffe4b5",
    navajowEte: "ffdead",
    navy: "80",
    Tdlace: "fdf5e6",
    Tive: "808000",
    TivedBb: "6b8e23",
    Sange: "ffa500",
    SangeYd: "ff4500",
    ScEd: "da70d6",
    pOegTMnPd: "eee8aa",
    pOegYF: "98fb98",
    pOeQe: "afeeee",
    pOeviTetYd: "db7093",
    papayawEp: "ffefd5",
    pHKpuff: "ffdab9",
    peru: "cd853f",
    pRk: "ffc0cb",
    plum: "dda0dd",
    powMrXe: "b0e0e6",
    purpN: "800080",
    YbeccapurpN: "663399",
    Yd: "ff0000",
    Psybrown: "bc8f8f",
    PyOXe: "4169e1",
    saddNbPwn: "8b4513",
    sOmon: "fa8072",
    sandybPwn: "f4a460",
    sHgYF: "2e8b57",
    sHshell: "fff5ee",
    siFna: "a0522d",
    silver: "c0c0c0",
    skyXe: "87ceeb",
    UXe: "6a5acd",
    UWay: "708090",
    UgYy: "708090",
    snow: "fffafa",
    sprRggYF: "ff7f",
    stAlXe: "4682b4",
    tan: "d2b48c",
    teO: "8080",
    tEstN: "d8bfd8",
    tomato: "ff6347",
    Qe: "40e0d0",
    viTet: "ee82ee",
    JHt: "f5deb3",
    wEte: "ffffff",
    wEtesmoke: "f5f5f5",
    Lw: "ffff00",
    LwgYF: "9acd32",
  };
function fb() {
  const e = {},
    t = Object.keys(Vh),
    n = Object.keys(Wh);
  let i, r, s, o, l;
  for (i = 0; i < t.length; i++) {
    for (o = l = t[i], r = 0; r < n.length; r++)
      (s = n[r]), (l = l.replace(s, Wh[s]));
    (s = parseInt(Vh[o], 16)),
      (e[l] = [(s >> 16) & 255, (s >> 8) & 255, s & 255]);
  }
  return e;
}
let xo;
function db(e) {
  xo || ((xo = fb()), (xo.transparent = [0, 0, 0, 0]));
  const t = xo[e.toLowerCase()];
  return t && { r: t[0], g: t[1], b: t[2], a: t.length === 4 ? t[3] : 255 };
}
const hb =
  /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function pb(e) {
  const t = hb.exec(e);
  let n = 255,
    i,
    r,
    s;
  if (t) {
    if (t[7] !== i) {
      const o = +t[7];
      n = t[8] ? Fr(o) : Nn(o * 255, 0, 255);
    }
    return (
      (i = +t[1]),
      (r = +t[3]),
      (s = +t[5]),
      (i = 255 & (t[2] ? Fr(i) : Nn(i, 0, 255))),
      (r = 255 & (t[4] ? Fr(r) : Nn(r, 0, 255))),
      (s = 255 & (t[6] ? Fr(s) : Nn(s, 0, 255))),
      { r: i, g: r, b: s, a: n }
    );
  }
}
function mb(e) {
  return (
    e &&
    (e.a < 255
      ? `rgba(${e.r}, ${e.g}, ${e.b}, ${ln(e.a)})`
      : `rgb(${e.r}, ${e.g}, ${e.b})`)
  );
}
const qa = (e) =>
    e <= 0.0031308 ? e * 12.92 : Math.pow(e, 1 / 2.4) * 1.055 - 0.055,
  Oi = (e) => (e <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4));
function gb(e, t, n) {
  const i = Oi(ln(e.r)),
    r = Oi(ln(e.g)),
    s = Oi(ln(e.b));
  return {
    r: Bn(qa(i + n * (Oi(ln(t.r)) - i))),
    g: Bn(qa(r + n * (Oi(ln(t.g)) - r))),
    b: Bn(qa(s + n * (Oi(ln(t.b)) - s))),
    a: e.a + n * (t.a - e.a),
  };
}
function _o(e, t, n) {
  if (e) {
    let i = Pf(e);
    (i[t] = Math.max(0, Math.min(i[t] + i[t] * n, t === 0 ? 360 : 1))),
      (i = Nf(i)),
      (e.r = i[0]),
      (e.g = i[1]),
      (e.b = i[2]);
  }
}
function ly(e, t) {
  return e && Object.assign(t || {}, e);
}
function $h(e) {
  var t = { r: 0, g: 0, b: 0, a: 255 };
  return (
    Array.isArray(e)
      ? e.length >= 3 &&
        ((t = { r: e[0], g: e[1], b: e[2], a: 255 }),
        e.length > 3 && (t.a = Bn(e[3])))
      : ((t = ly(e, { r: 0, g: 0, b: 0, a: 1 })), (t.a = Bn(t.a))),
    t
  );
}
function yb(e) {
  return e.charAt(0) === "r" ? pb(e) : ab(e);
}
class Cs {
  constructor(t) {
    if (t instanceof Cs) return t;
    const n = typeof t;
    let i;
    n === "object"
      ? (i = $h(t))
      : n === "string" && (i = JS(t) || db(t) || yb(t)),
      (this._rgb = i),
      (this._valid = !!i);
  }
  get valid() {
    return this._valid;
  }
  get rgb() {
    var t = ly(this._rgb);
    return t && (t.a = ln(t.a)), t;
  }
  set rgb(t) {
    this._rgb = $h(t);
  }
  rgbString() {
    return this._valid ? mb(this._rgb) : void 0;
  }
  hexString() {
    return this._valid ? tb(this._rgb) : void 0;
  }
  hslString() {
    return this._valid ? cb(this._rgb) : void 0;
  }
  mix(t, n) {
    if (t) {
      const i = this.rgb,
        r = t.rgb;
      let s;
      const o = n === s ? 0.5 : n,
        l = 2 * o - 1,
        a = i.a - r.a,
        u = ((l * a === -1 ? l : (l + a) / (1 + l * a)) + 1) / 2;
      (s = 1 - u),
        (i.r = 255 & (u * i.r + s * r.r + 0.5)),
        (i.g = 255 & (u * i.g + s * r.g + 0.5)),
        (i.b = 255 & (u * i.b + s * r.b + 0.5)),
        (i.a = o * i.a + (1 - o) * r.a),
        (this.rgb = i);
    }
    return this;
  }
  interpolate(t, n) {
    return t && (this._rgb = gb(this._rgb, t._rgb, n)), this;
  }
  clone() {
    return new Cs(this.rgb);
  }
  alpha(t) {
    return (this._rgb.a = Bn(t)), this;
  }
  clearer(t) {
    const n = this._rgb;
    return (n.a *= 1 - t), this;
  }
  greyscale() {
    const t = this._rgb,
      n = Us(t.r * 0.3 + t.g * 0.59 + t.b * 0.11);
    return (t.r = t.g = t.b = n), this;
  }
  opaquer(t) {
    const n = this._rgb;
    return (n.a *= 1 + t), this;
  }
  negate() {
    const t = this._rgb;
    return (t.r = 255 - t.r), (t.g = 255 - t.g), (t.b = 255 - t.b), this;
  }
  lighten(t) {
    return _o(this._rgb, 2, t), this;
  }
  darken(t) {
    return _o(this._rgb, 2, -t), this;
  }
  saturate(t) {
    return _o(this._rgb, 1, t), this;
  }
  desaturate(t) {
    return _o(this._rgb, 1, -t), this;
  }
  rotate(t) {
    return ub(this._rgb, t), this;
  }
}
/*!
 * Chart.js v4.4.5
 * https://www.chartjs.org
 * (c) 2024 Chart.js Contributors
 * Released under the MIT License
 */ function tn() {}
const vb = (() => {
  let e = 0;
  return () => e++;
})();
function pe(e) {
  return e === null || typeof e > "u";
}
function Oe(e) {
  if (Array.isArray && Array.isArray(e)) return !0;
  const t = Object.prototype.toString.call(e);
  return t.slice(0, 7) === "[object" && t.slice(-6) === "Array]";
}
function te(e) {
  return e !== null && Object.prototype.toString.call(e) === "[object Object]";
}
function kt(e) {
  return (typeof e == "number" || e instanceof Number) && isFinite(+e);
}
function Wt(e, t) {
  return kt(e) ? e : t;
}
function K(e, t) {
  return typeof e > "u" ? t : e;
}
const xb = (e, t) =>
  typeof e == "string" && e.endsWith("%") ? (parseFloat(e) / 100) * t : +e;
function W(e, t, n) {
  if (e && typeof e.call == "function") return e.apply(n, t);
}
function Q(e, t, n, i) {
  let r, s, o;
  if (Oe(e)) for (s = e.length, r = 0; r < s; r++) t.call(n, e[r], r);
  else if (te(e))
    for (o = Object.keys(e), s = o.length, r = 0; r < s; r++)
      t.call(n, e[o[r]], o[r]);
}
function Tl(e, t) {
  let n, i, r, s;
  if (!e || !t || e.length !== t.length) return !1;
  for (n = 0, i = e.length; n < i; ++n)
    if (
      ((r = e[n]),
      (s = t[n]),
      r.datasetIndex !== s.datasetIndex || r.index !== s.index)
    )
      return !1;
  return !0;
}
function Cl(e) {
  if (Oe(e)) return e.map(Cl);
  if (te(e)) {
    const t = Object.create(null),
      n = Object.keys(e),
      i = n.length;
    let r = 0;
    for (; r < i; ++r) t[n[r]] = Cl(e[n[r]]);
    return t;
  }
  return e;
}
function ay(e) {
  return ["__proto__", "prototype", "constructor"].indexOf(e) === -1;
}
function _b(e, t, n, i) {
  if (!ay(e)) return;
  const r = t[e],
    s = n[e];
  te(r) && te(s) ? Ps(r, s, i) : (t[e] = Cl(s));
}
function Ps(e, t, n) {
  const i = Oe(t) ? t : [t],
    r = i.length;
  if (!te(e)) return e;
  n = n || {};
  const s = n.merger || _b;
  let o;
  for (let l = 0; l < r; ++l) {
    if (((o = i[l]), !te(o))) continue;
    const a = Object.keys(o);
    for (let u = 0, c = a.length; u < c; ++u) s(a[u], e, o, n);
  }
  return e;
}
function Jr(e, t) {
  return Ps(e, t, { merger: wb });
}
function wb(e, t, n) {
  if (!ay(e)) return;
  const i = t[e],
    r = n[e];
  te(i) && te(r)
    ? Jr(i, r)
    : Object.prototype.hasOwnProperty.call(t, e) || (t[e] = Cl(r));
}
const Yh = { "": (e) => e, x: (e) => e.x, y: (e) => e.y };
function Sb(e) {
  const t = e.split("."),
    n = [];
  let i = "";
  for (const r of t)
    (i += r),
      i.endsWith("\\") ? (i = i.slice(0, -1) + ".") : (n.push(i), (i = ""));
  return n;
}
function bb(e) {
  const t = Sb(e);
  return (n) => {
    for (const i of t) {
      if (i === "") break;
      n = n && n[i];
    }
    return n;
  };
}
function Pl(e, t) {
  return (Yh[t] || (Yh[t] = bb(t)))(e);
}
function Mf(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
const Ol = (e) => typeof e < "u",
  Wn = (e) => typeof e == "function",
  Xh = (e, t) => {
    if (e.size !== t.size) return !1;
    for (const n of e) if (!t.has(n)) return !1;
    return !0;
  };
function Eb(e) {
  return e.type === "mouseup" || e.type === "click" || e.type === "contextmenu";
}
const Me = Math.PI,
  Zt = 2 * Me,
  kb = Zt + Me,
  Nl = Number.POSITIVE_INFINITY,
  Tb = Me / 180,
  Lt = Me / 2,
  Zn = Me / 4,
  Kh = (Me * 2) / 3,
  uc = Math.log10,
  Vn = Math.sign;
function es(e, t, n) {
  return Math.abs(e - t) < n;
}
function qh(e) {
  const t = Math.round(e);
  e = es(e, t, e / 1e3) ? t : e;
  const n = Math.pow(10, Math.floor(uc(e))),
    i = e / n;
  return (i <= 1 ? 1 : i <= 2 ? 2 : i <= 5 ? 5 : 10) * n;
}
function Cb(e) {
  const t = [],
    n = Math.sqrt(e);
  let i;
  for (i = 1; i < n; i++) e % i === 0 && (t.push(i), t.push(e / i));
  return n === (n | 0) && t.push(n), t.sort((r, s) => r - s).pop(), t;
}
function Os(e) {
  return !isNaN(parseFloat(e)) && isFinite(e);
}
function Pb(e, t) {
  const n = Math.round(e);
  return n - t <= e && n + t >= e;
}
function Ob(e, t, n) {
  let i, r, s;
  for (i = 0, r = e.length; i < r; i++)
    (s = e[i][n]),
      isNaN(s) || ((t.min = Math.min(t.min, s)), (t.max = Math.max(t.max, s)));
}
function ai(e) {
  return e * (Me / 180);
}
function Nb(e) {
  return e * (180 / Me);
}
function Qh(e) {
  if (!kt(e)) return;
  let t = 1,
    n = 0;
  for (; Math.round(e * t) / t !== e; ) (t *= 10), n++;
  return n;
}
function Mb(e, t) {
  const n = t.x - e.x,
    i = t.y - e.y,
    r = Math.sqrt(n * n + i * i);
  let s = Math.atan2(i, n);
  return s < -0.5 * Me && (s += Zt), { angle: s, distance: r };
}
function cc(e, t) {
  return Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
}
function Rb(e, t) {
  return ((e - t + kb) % Zt) - Me;
}
function Sn(e) {
  return ((e % Zt) + Zt) % Zt;
}
function uy(e, t, n, i) {
  const r = Sn(e),
    s = Sn(t),
    o = Sn(n),
    l = Sn(s - r),
    a = Sn(o - r),
    u = Sn(r - s),
    c = Sn(r - o);
  return r === s || r === o || (i && s === o) || (l > a && u < c);
}
function _t(e, t, n) {
  return Math.max(t, Math.min(n, e));
}
function Lb(e) {
  return _t(e, -32768, 32767);
}
function Br(e, t, n, i = 1e-6) {
  return e >= Math.min(t, n) - i && e <= Math.max(t, n) + i;
}
function Rf(e, t, n) {
  n = n || ((o) => e[o] < t);
  let i = e.length - 1,
    r = 0,
    s;
  for (; i - r > 1; ) (s = (r + i) >> 1), n(s) ? (r = s) : (i = s);
  return { lo: r, hi: i };
}
const ui = (e, t, n, i) =>
    Rf(
      e,
      n,
      i
        ? (r) => {
            const s = e[r][t];
            return s < n || (s === n && e[r + 1][t] === n);
          }
        : (r) => e[r][t] < n
    ),
  Ib = (e, t, n) => Rf(e, n, (i) => e[i][t] >= n);
function Db(e, t, n) {
  let i = 0,
    r = e.length;
  for (; i < r && e[i] < t; ) i++;
  for (; r > i && e[r - 1] > n; ) r--;
  return i > 0 || r < e.length ? e.slice(i, r) : e;
}
const cy = ["push", "pop", "shift", "splice", "unshift"];
function Ab(e, t) {
  if (e._chartjs) {
    e._chartjs.listeners.push(t);
    return;
  }
  Object.defineProperty(e, "_chartjs", {
    configurable: !0,
    enumerable: !1,
    value: { listeners: [t] },
  }),
    cy.forEach((n) => {
      const i = "_onData" + Mf(n),
        r = e[n];
      Object.defineProperty(e, n, {
        configurable: !0,
        enumerable: !1,
        value(...s) {
          const o = r.apply(this, s);
          return (
            e._chartjs.listeners.forEach((l) => {
              typeof l[i] == "function" && l[i](...s);
            }),
            o
          );
        },
      });
    });
}
function Gh(e, t) {
  const n = e._chartjs;
  if (!n) return;
  const i = n.listeners,
    r = i.indexOf(t);
  r !== -1 && i.splice(r, 1),
    !(i.length > 0) &&
      (cy.forEach((s) => {
        delete e[s];
      }),
      delete e._chartjs);
}
function jb(e) {
  const t = new Set(e);
  return t.size === e.length ? e : Array.from(t);
}
const fy = (function () {
  return typeof window > "u"
    ? function (e) {
        return e();
      }
    : window.requestAnimationFrame;
})();
function dy(e, t) {
  let n = [],
    i = !1;
  return function (...r) {
    (n = r),
      i ||
        ((i = !0),
        fy.call(window, () => {
          (i = !1), e.apply(t, n);
        }));
  };
}
function zb(e, t) {
  let n;
  return function (...i) {
    return (
      t ? (clearTimeout(n), (n = setTimeout(e, t, i))) : e.apply(this, i), t
    );
  };
}
const Lf = (e) => (e === "start" ? "left" : e === "end" ? "right" : "center"),
  Fe = (e, t, n) => (e === "start" ? t : e === "end" ? n : (t + n) / 2),
  Fb = (e, t, n, i) =>
    e === (i ? "left" : "right") ? n : e === "center" ? (t + n) / 2 : t;
function Bb(e, t, n) {
  const i = t.length;
  let r = 0,
    s = i;
  if (e._sorted) {
    const { iScale: o, _parsed: l } = e,
      a = o.axis,
      { min: u, max: c, minDefined: f, maxDefined: d } = o.getUserBounds();
    f &&
      (r = _t(
        Math.min(ui(l, a, u).lo, n ? i : ui(t, a, o.getPixelForValue(u)).lo),
        0,
        i - 1
      )),
      d
        ? (s =
            _t(
              Math.max(
                ui(l, o.axis, c, !0).hi + 1,
                n ? 0 : ui(t, a, o.getPixelForValue(c), !0).hi + 1
              ),
              r,
              i
            ) - r)
        : (s = i - r);
  }
  return { start: r, count: s };
}
function Hb(e) {
  const { xScale: t, yScale: n, _scaleRanges: i } = e,
    r = { xmin: t.min, xmax: t.max, ymin: n.min, ymax: n.max };
  if (!i) return (e._scaleRanges = r), !0;
  const s =
    i.xmin !== t.min ||
    i.xmax !== t.max ||
    i.ymin !== n.min ||
    i.ymax !== n.max;
  return Object.assign(i, r), s;
}
const wo = (e) => e === 0 || e === 1,
  Zh = (e, t, n) =>
    -(Math.pow(2, 10 * (e -= 1)) * Math.sin(((e - t) * Zt) / n)),
  Jh = (e, t, n) => Math.pow(2, -10 * e) * Math.sin(((e - t) * Zt) / n) + 1,
  ts = {
    linear: (e) => e,
    easeInQuad: (e) => e * e,
    easeOutQuad: (e) => -e * (e - 2),
    easeInOutQuad: (e) =>
      (e /= 0.5) < 1 ? 0.5 * e * e : -0.5 * (--e * (e - 2) - 1),
    easeInCubic: (e) => e * e * e,
    easeOutCubic: (e) => (e -= 1) * e * e + 1,
    easeInOutCubic: (e) =>
      (e /= 0.5) < 1 ? 0.5 * e * e * e : 0.5 * ((e -= 2) * e * e + 2),
    easeInQuart: (e) => e * e * e * e,
    easeOutQuart: (e) => -((e -= 1) * e * e * e - 1),
    easeInOutQuart: (e) =>
      (e /= 0.5) < 1 ? 0.5 * e * e * e * e : -0.5 * ((e -= 2) * e * e * e - 2),
    easeInQuint: (e) => e * e * e * e * e,
    easeOutQuint: (e) => (e -= 1) * e * e * e * e + 1,
    easeInOutQuint: (e) =>
      (e /= 0.5) < 1
        ? 0.5 * e * e * e * e * e
        : 0.5 * ((e -= 2) * e * e * e * e + 2),
    easeInSine: (e) => -Math.cos(e * Lt) + 1,
    easeOutSine: (e) => Math.sin(e * Lt),
    easeInOutSine: (e) => -0.5 * (Math.cos(Me * e) - 1),
    easeInExpo: (e) => (e === 0 ? 0 : Math.pow(2, 10 * (e - 1))),
    easeOutExpo: (e) => (e === 1 ? 1 : -Math.pow(2, -10 * e) + 1),
    easeInOutExpo: (e) =>
      wo(e)
        ? e
        : e < 0.5
        ? 0.5 * Math.pow(2, 10 * (e * 2 - 1))
        : 0.5 * (-Math.pow(2, -10 * (e * 2 - 1)) + 2),
    easeInCirc: (e) => (e >= 1 ? e : -(Math.sqrt(1 - e * e) - 1)),
    easeOutCirc: (e) => Math.sqrt(1 - (e -= 1) * e),
    easeInOutCirc: (e) =>
      (e /= 0.5) < 1
        ? -0.5 * (Math.sqrt(1 - e * e) - 1)
        : 0.5 * (Math.sqrt(1 - (e -= 2) * e) + 1),
    easeInElastic: (e) => (wo(e) ? e : Zh(e, 0.075, 0.3)),
    easeOutElastic: (e) => (wo(e) ? e : Jh(e, 0.075, 0.3)),
    easeInOutElastic(e) {
      return wo(e)
        ? e
        : e < 0.5
        ? 0.5 * Zh(e * 2, 0.1125, 0.45)
        : 0.5 + 0.5 * Jh(e * 2 - 1, 0.1125, 0.45);
    },
    easeInBack(e) {
      return e * e * ((1.70158 + 1) * e - 1.70158);
    },
    easeOutBack(e) {
      return (e -= 1) * e * ((1.70158 + 1) * e + 1.70158) + 1;
    },
    easeInOutBack(e) {
      let t = 1.70158;
      return (e /= 0.5) < 1
        ? 0.5 * (e * e * (((t *= 1.525) + 1) * e - t))
        : 0.5 * ((e -= 2) * e * (((t *= 1.525) + 1) * e + t) + 2);
    },
    easeInBounce: (e) => 1 - ts.easeOutBounce(1 - e),
    easeOutBounce(e) {
      return e < 1 / 2.75
        ? 7.5625 * e * e
        : e < 2 / 2.75
        ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75
        : e < 2.5 / 2.75
        ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375
        : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375;
    },
    easeInOutBounce: (e) =>
      e < 0.5
        ? ts.easeInBounce(e * 2) * 0.5
        : ts.easeOutBounce(e * 2 - 1) * 0.5 + 0.5,
  };
function If(e) {
  if (e && typeof e == "object") {
    const t = e.toString();
    return t === "[object CanvasPattern]" || t === "[object CanvasGradient]";
  }
  return !1;
}
function ep(e) {
  return If(e) ? e : new Cs(e);
}
function Qa(e) {
  return If(e) ? e : new Cs(e).saturate(0.5).darken(0.1).hexString();
}
const Ub = ["x", "y", "borderWidth", "radius", "tension"],
  Wb = ["color", "borderColor", "backgroundColor"];
function Vb(e) {
  e.set("animation", {
    delay: void 0,
    duration: 1e3,
    easing: "easeOutQuart",
    fn: void 0,
    from: void 0,
    loop: void 0,
    to: void 0,
    type: void 0,
  }),
    e.describe("animation", {
      _fallback: !1,
      _indexable: !1,
      _scriptable: (t) =>
        t !== "onProgress" && t !== "onComplete" && t !== "fn",
    }),
    e.set("animations", {
      colors: { type: "color", properties: Wb },
      numbers: { type: "number", properties: Ub },
    }),
    e.describe("animations", { _fallback: "animation" }),
    e.set("transitions", {
      active: { animation: { duration: 400 } },
      resize: { animation: { duration: 0 } },
      show: {
        animations: {
          colors: { from: "transparent" },
          visible: { type: "boolean", duration: 0 },
        },
      },
      hide: {
        animations: {
          colors: { to: "transparent" },
          visible: { type: "boolean", easing: "linear", fn: (t) => t | 0 },
        },
      },
    });
}
function $b(e) {
  e.set("layout", {
    autoPadding: !0,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  });
}
const tp = new Map();
function Yb(e, t) {
  t = t || {};
  const n = e + JSON.stringify(t);
  let i = tp.get(n);
  return i || ((i = new Intl.NumberFormat(e, t)), tp.set(n, i)), i;
}
function hy(e, t, n) {
  return Yb(t, n).format(e);
}
const py = {
  values(e) {
    return Oe(e) ? e : "" + e;
  },
  numeric(e, t, n) {
    if (e === 0) return "0";
    const i = this.chart.options.locale;
    let r,
      s = e;
    if (n.length > 1) {
      const u = Math.max(Math.abs(n[0].value), Math.abs(n[n.length - 1].value));
      (u < 1e-4 || u > 1e15) && (r = "scientific"), (s = Xb(e, n));
    }
    const o = uc(Math.abs(s)),
      l = isNaN(o) ? 1 : Math.max(Math.min(-1 * Math.floor(o), 20), 0),
      a = { notation: r, minimumFractionDigits: l, maximumFractionDigits: l };
    return Object.assign(a, this.options.ticks.format), hy(e, i, a);
  },
  logarithmic(e, t, n) {
    if (e === 0) return "0";
    const i = n[t].significand || e / Math.pow(10, Math.floor(uc(e)));
    return [1, 2, 3, 5, 10, 15].includes(i) || t > 0.8 * n.length
      ? py.numeric.call(this, e, t, n)
      : "";
  },
};
function Xb(e, t) {
  let n = t.length > 3 ? t[2].value - t[1].value : t[1].value - t[0].value;
  return Math.abs(n) >= 1 && e !== Math.floor(e) && (n = e - Math.floor(e)), n;
}
var my = { formatters: py };
function Kb(e) {
  e.set("scale", {
    display: !0,
    offset: !1,
    reverse: !1,
    beginAtZero: !1,
    bounds: "ticks",
    clip: !0,
    grace: 0,
    grid: {
      display: !0,
      lineWidth: 1,
      drawOnChartArea: !0,
      drawTicks: !0,
      tickLength: 8,
      tickWidth: (t, n) => n.lineWidth,
      tickColor: (t, n) => n.color,
      offset: !1,
    },
    border: { display: !0, dash: [], dashOffset: 0, width: 1 },
    title: { display: !1, text: "", padding: { top: 4, bottom: 4 } },
    ticks: {
      minRotation: 0,
      maxRotation: 50,
      mirror: !1,
      textStrokeWidth: 0,
      textStrokeColor: "",
      padding: 3,
      display: !0,
      autoSkip: !0,
      autoSkipPadding: 3,
      labelOffset: 0,
      callback: my.formatters.values,
      minor: {},
      major: {},
      align: "center",
      crossAlign: "near",
      showLabelBackdrop: !1,
      backdropColor: "rgba(255, 255, 255, 0.75)",
      backdropPadding: 2,
    },
  }),
    e.route("scale.ticks", "color", "", "color"),
    e.route("scale.grid", "color", "", "borderColor"),
    e.route("scale.border", "color", "", "borderColor"),
    e.route("scale.title", "color", "", "color"),
    e.describe("scale", {
      _fallback: !1,
      _scriptable: (t) =>
        !t.startsWith("before") &&
        !t.startsWith("after") &&
        t !== "callback" &&
        t !== "parser",
      _indexable: (t) =>
        t !== "borderDash" && t !== "tickBorderDash" && t !== "dash",
    }),
    e.describe("scales", { _fallback: "scale" }),
    e.describe("scale.ticks", {
      _scriptable: (t) => t !== "backdropPadding" && t !== "callback",
      _indexable: (t) => t !== "backdropPadding",
    });
}
const _i = Object.create(null),
  fc = Object.create(null);
function ns(e, t) {
  if (!t) return e;
  const n = t.split(".");
  for (let i = 0, r = n.length; i < r; ++i) {
    const s = n[i];
    e = e[s] || (e[s] = Object.create(null));
  }
  return e;
}
function Ga(e, t, n) {
  return typeof t == "string" ? Ps(ns(e, t), n) : Ps(ns(e, ""), t);
}
class qb {
  constructor(t, n) {
    (this.animation = void 0),
      (this.backgroundColor = "rgba(0,0,0,0.1)"),
      (this.borderColor = "rgba(0,0,0,0.1)"),
      (this.color = "#666"),
      (this.datasets = {}),
      (this.devicePixelRatio = (i) => i.chart.platform.getDevicePixelRatio()),
      (this.elements = {}),
      (this.events = [
        "mousemove",
        "mouseout",
        "click",
        "touchstart",
        "touchmove",
      ]),
      (this.font = {
        family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        size: 12,
        style: "normal",
        lineHeight: 1.2,
        weight: null,
      }),
      (this.hover = {}),
      (this.hoverBackgroundColor = (i, r) => Qa(r.backgroundColor)),
      (this.hoverBorderColor = (i, r) => Qa(r.borderColor)),
      (this.hoverColor = (i, r) => Qa(r.color)),
      (this.indexAxis = "x"),
      (this.interaction = {
        mode: "nearest",
        intersect: !0,
        includeInvisible: !1,
      }),
      (this.maintainAspectRatio = !0),
      (this.onHover = null),
      (this.onClick = null),
      (this.parsing = !0),
      (this.plugins = {}),
      (this.responsive = !0),
      (this.scale = void 0),
      (this.scales = {}),
      (this.showLine = !0),
      (this.drawActiveElementsOnTop = !0),
      this.describe(t),
      this.apply(n);
  }
  set(t, n) {
    return Ga(this, t, n);
  }
  get(t) {
    return ns(this, t);
  }
  describe(t, n) {
    return Ga(fc, t, n);
  }
  override(t, n) {
    return Ga(_i, t, n);
  }
  route(t, n, i, r) {
    const s = ns(this, t),
      o = ns(this, i),
      l = "_" + n;
    Object.defineProperties(s, {
      [l]: { value: s[n], writable: !0 },
      [n]: {
        enumerable: !0,
        get() {
          const a = this[l],
            u = o[r];
          return te(a) ? Object.assign({}, u, a) : K(a, u);
        },
        set(a) {
          this[l] = a;
        },
      },
    });
  }
  apply(t) {
    t.forEach((n) => n(this));
  }
}
var ye = new qb(
  {
    _scriptable: (e) => !e.startsWith("on"),
    _indexable: (e) => e !== "events",
    hover: { _fallback: "interaction" },
    interaction: { _scriptable: !1, _indexable: !1 },
  },
  [Vb, $b, Kb]
);
function Qb(e) {
  return !e || pe(e.size) || pe(e.family)
    ? null
    : (e.style ? e.style + " " : "") +
        (e.weight ? e.weight + " " : "") +
        e.size +
        "px " +
        e.family;
}
function np(e, t, n, i, r) {
  let s = t[r];
  return (
    s || ((s = t[r] = e.measureText(r).width), n.push(r)), s > i && (i = s), i
  );
}
function Jn(e, t, n) {
  const i = e.currentDevicePixelRatio,
    r = n !== 0 ? Math.max(n / 2, 0.5) : 0;
  return Math.round((t - r) * i) / i + r;
}
function ip(e, t) {
  (!t && !e) ||
    ((t = t || e.getContext("2d")),
    t.save(),
    t.resetTransform(),
    t.clearRect(0, 0, e.width, e.height),
    t.restore());
}
function dc(e, t, n, i) {
  gy(e, t, n, i, null);
}
function gy(e, t, n, i, r) {
  let s, o, l, a, u, c, f, d;
  const h = t.pointStyle,
    m = t.rotation,
    v = t.radius;
  let _ = (m || 0) * Tb;
  if (
    h &&
    typeof h == "object" &&
    ((s = h.toString()),
    s === "[object HTMLImageElement]" || s === "[object HTMLCanvasElement]")
  ) {
    e.save(),
      e.translate(n, i),
      e.rotate(_),
      e.drawImage(h, -h.width / 2, -h.height / 2, h.width, h.height),
      e.restore();
    return;
  }
  if (!(isNaN(v) || v <= 0)) {
    switch ((e.beginPath(), h)) {
      default:
        r ? e.ellipse(n, i, r / 2, v, 0, 0, Zt) : e.arc(n, i, v, 0, Zt),
          e.closePath();
        break;
      case "triangle":
        (c = r ? r / 2 : v),
          e.moveTo(n + Math.sin(_) * c, i - Math.cos(_) * v),
          (_ += Kh),
          e.lineTo(n + Math.sin(_) * c, i - Math.cos(_) * v),
          (_ += Kh),
          e.lineTo(n + Math.sin(_) * c, i - Math.cos(_) * v),
          e.closePath();
        break;
      case "rectRounded":
        (u = v * 0.516),
          (a = v - u),
          (o = Math.cos(_ + Zn) * a),
          (f = Math.cos(_ + Zn) * (r ? r / 2 - u : a)),
          (l = Math.sin(_ + Zn) * a),
          (d = Math.sin(_ + Zn) * (r ? r / 2 - u : a)),
          e.arc(n - f, i - l, u, _ - Me, _ - Lt),
          e.arc(n + d, i - o, u, _ - Lt, _),
          e.arc(n + f, i + l, u, _, _ + Lt),
          e.arc(n - d, i + o, u, _ + Lt, _ + Me),
          e.closePath();
        break;
      case "rect":
        if (!m) {
          (a = Math.SQRT1_2 * v),
            (c = r ? r / 2 : a),
            e.rect(n - c, i - a, 2 * c, 2 * a);
          break;
        }
        _ += Zn;
      case "rectRot":
        (f = Math.cos(_) * (r ? r / 2 : v)),
          (o = Math.cos(_) * v),
          (l = Math.sin(_) * v),
          (d = Math.sin(_) * (r ? r / 2 : v)),
          e.moveTo(n - f, i - l),
          e.lineTo(n + d, i - o),
          e.lineTo(n + f, i + l),
          e.lineTo(n - d, i + o),
          e.closePath();
        break;
      case "crossRot":
        _ += Zn;
      case "cross":
        (f = Math.cos(_) * (r ? r / 2 : v)),
          (o = Math.cos(_) * v),
          (l = Math.sin(_) * v),
          (d = Math.sin(_) * (r ? r / 2 : v)),
          e.moveTo(n - f, i - l),
          e.lineTo(n + f, i + l),
          e.moveTo(n + d, i - o),
          e.lineTo(n - d, i + o);
        break;
      case "star":
        (f = Math.cos(_) * (r ? r / 2 : v)),
          (o = Math.cos(_) * v),
          (l = Math.sin(_) * v),
          (d = Math.sin(_) * (r ? r / 2 : v)),
          e.moveTo(n - f, i - l),
          e.lineTo(n + f, i + l),
          e.moveTo(n + d, i - o),
          e.lineTo(n - d, i + o),
          (_ += Zn),
          (f = Math.cos(_) * (r ? r / 2 : v)),
          (o = Math.cos(_) * v),
          (l = Math.sin(_) * v),
          (d = Math.sin(_) * (r ? r / 2 : v)),
          e.moveTo(n - f, i - l),
          e.lineTo(n + f, i + l),
          e.moveTo(n + d, i - o),
          e.lineTo(n - d, i + o);
        break;
      case "line":
        (o = r ? r / 2 : Math.cos(_) * v),
          (l = Math.sin(_) * v),
          e.moveTo(n - o, i - l),
          e.lineTo(n + o, i + l);
        break;
      case "dash":
        e.moveTo(n, i),
          e.lineTo(n + Math.cos(_) * (r ? r / 2 : v), i + Math.sin(_) * v);
        break;
      case !1:
        e.closePath();
        break;
    }
    e.fill(), t.borderWidth > 0 && e.stroke();
  }
}
function Ns(e, t, n) {
  return (
    (n = n || 0.5),
    !t ||
      (e &&
        e.x > t.left - n &&
        e.x < t.right + n &&
        e.y > t.top - n &&
        e.y < t.bottom + n)
  );
}
function Df(e, t) {
  e.save(),
    e.beginPath(),
    e.rect(t.left, t.top, t.right - t.left, t.bottom - t.top),
    e.clip();
}
function Af(e) {
  e.restore();
}
function Gb(e, t, n, i, r) {
  if (!t) return e.lineTo(n.x, n.y);
  if (r === "middle") {
    const s = (t.x + n.x) / 2;
    e.lineTo(s, t.y), e.lineTo(s, n.y);
  } else (r === "after") != !!i ? e.lineTo(t.x, n.y) : e.lineTo(n.x, t.y);
  e.lineTo(n.x, n.y);
}
function Zb(e, t, n, i) {
  if (!t) return e.lineTo(n.x, n.y);
  e.bezierCurveTo(
    i ? t.cp1x : t.cp2x,
    i ? t.cp1y : t.cp2y,
    i ? n.cp2x : n.cp1x,
    i ? n.cp2y : n.cp1y,
    n.x,
    n.y
  );
}
function Jb(e, t) {
  t.translation && e.translate(t.translation[0], t.translation[1]),
    pe(t.rotation) || e.rotate(t.rotation),
    t.color && (e.fillStyle = t.color),
    t.textAlign && (e.textAlign = t.textAlign),
    t.textBaseline && (e.textBaseline = t.textBaseline);
}
function eE(e, t, n, i, r) {
  if (r.strikethrough || r.underline) {
    const s = e.measureText(i),
      o = t - s.actualBoundingBoxLeft,
      l = t + s.actualBoundingBoxRight,
      a = n - s.actualBoundingBoxAscent,
      u = n + s.actualBoundingBoxDescent,
      c = r.strikethrough ? (a + u) / 2 : u;
    (e.strokeStyle = e.fillStyle),
      e.beginPath(),
      (e.lineWidth = r.decorationWidth || 2),
      e.moveTo(o, c),
      e.lineTo(l, c),
      e.stroke();
  }
}
function tE(e, t) {
  const n = e.fillStyle;
  (e.fillStyle = t.color),
    e.fillRect(t.left, t.top, t.width, t.height),
    (e.fillStyle = n);
}
function Ms(e, t, n, i, r, s = {}) {
  const o = Oe(t) ? t : [t],
    l = s.strokeWidth > 0 && s.strokeColor !== "";
  let a, u;
  for (e.save(), e.font = r.string, Jb(e, s), a = 0; a < o.length; ++a)
    (u = o[a]),
      s.backdrop && tE(e, s.backdrop),
      l &&
        (s.strokeColor && (e.strokeStyle = s.strokeColor),
        pe(s.strokeWidth) || (e.lineWidth = s.strokeWidth),
        e.strokeText(u, n, i, s.maxWidth)),
      e.fillText(u, n, i, s.maxWidth),
      eE(e, n, i, u, s),
      (i += Number(r.lineHeight));
  e.restore();
}
function hc(e, t) {
  const { x: n, y: i, w: r, h: s, radius: o } = t;
  e.arc(n + o.topLeft, i + o.topLeft, o.topLeft, 1.5 * Me, Me, !0),
    e.lineTo(n, i + s - o.bottomLeft),
    e.arc(n + o.bottomLeft, i + s - o.bottomLeft, o.bottomLeft, Me, Lt, !0),
    e.lineTo(n + r - o.bottomRight, i + s),
    e.arc(
      n + r - o.bottomRight,
      i + s - o.bottomRight,
      o.bottomRight,
      Lt,
      0,
      !0
    ),
    e.lineTo(n + r, i + o.topRight),
    e.arc(n + r - o.topRight, i + o.topRight, o.topRight, 0, -Lt, !0),
    e.lineTo(n + o.topLeft, i);
}
const nE = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/,
  iE = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
function rE(e, t) {
  const n = ("" + e).match(nE);
  if (!n || n[1] === "normal") return t * 1.2;
  switch (((e = +n[2]), n[3])) {
    case "px":
      return e;
    case "%":
      e /= 100;
      break;
  }
  return t * e;
}
const sE = (e) => +e || 0;
function yy(e, t) {
  const n = {},
    i = te(t),
    r = i ? Object.keys(t) : t,
    s = te(e) ? (i ? (o) => K(e[o], e[t[o]]) : (o) => e[o]) : () => e;
  for (const o of r) n[o] = sE(s(o));
  return n;
}
function oE(e) {
  return yy(e, { top: "y", right: "x", bottom: "y", left: "x" });
}
function is(e) {
  return yy(e, ["topLeft", "topRight", "bottomLeft", "bottomRight"]);
}
function Tt(e) {
  const t = oE(e);
  return (t.width = t.left + t.right), (t.height = t.top + t.bottom), t;
}
function He(e, t) {
  (e = e || {}), (t = t || ye.font);
  let n = K(e.size, t.size);
  typeof n == "string" && (n = parseInt(n, 10));
  let i = K(e.style, t.style);
  i &&
    !("" + i).match(iE) &&
    (console.warn('Invalid font style specified: "' + i + '"'), (i = void 0));
  const r = {
    family: K(e.family, t.family),
    lineHeight: rE(K(e.lineHeight, t.lineHeight), n),
    size: n,
    style: i,
    weight: K(e.weight, t.weight),
    string: "",
  };
  return (r.string = Qb(r)), r;
}
function So(e, t, n, i) {
  let r, s, o;
  for (r = 0, s = e.length; r < s; ++r)
    if (((o = e[r]), o !== void 0 && o !== void 0)) return o;
}
function lE(e, t, n) {
  const { min: i, max: r } = e,
    s = xb(t, (r - i) / 2),
    o = (l, a) => (n && l === 0 ? 0 : l + a);
  return { min: o(i, -Math.abs(s)), max: o(r, s) };
}
function Ti(e, t) {
  return Object.assign(Object.create(e), t);
}
function jf(e, t = [""], n, i, r = () => e[0]) {
  const s = n || e;
  typeof i > "u" && (i = wy("_fallback", e));
  const o = {
    [Symbol.toStringTag]: "Object",
    _cacheable: !0,
    _scopes: e,
    _rootScopes: s,
    _fallback: i,
    _getTarget: r,
    override: (l) => jf([l, ...e], t, s, i),
  };
  return new Proxy(o, {
    deleteProperty(l, a) {
      return delete l[a], delete l._keys, delete e[0][a], !0;
    },
    get(l, a) {
      return xy(l, a, () => mE(a, t, e, l));
    },
    getOwnPropertyDescriptor(l, a) {
      return Reflect.getOwnPropertyDescriptor(l._scopes[0], a);
    },
    getPrototypeOf() {
      return Reflect.getPrototypeOf(e[0]);
    },
    has(l, a) {
      return sp(l).includes(a);
    },
    ownKeys(l) {
      return sp(l);
    },
    set(l, a, u) {
      const c = l._storage || (l._storage = r());
      return (l[a] = c[a] = u), delete l._keys, !0;
    },
  });
}
function nr(e, t, n, i) {
  const r = {
    _cacheable: !1,
    _proxy: e,
    _context: t,
    _subProxy: n,
    _stack: new Set(),
    _descriptors: vy(e, i),
    setContext: (s) => nr(e, s, n, i),
    override: (s) => nr(e.override(s), t, n, i),
  };
  return new Proxy(r, {
    deleteProperty(s, o) {
      return delete s[o], delete e[o], !0;
    },
    get(s, o, l) {
      return xy(s, o, () => uE(s, o, l));
    },
    getOwnPropertyDescriptor(s, o) {
      return s._descriptors.allKeys
        ? Reflect.has(e, o)
          ? { enumerable: !0, configurable: !0 }
          : void 0
        : Reflect.getOwnPropertyDescriptor(e, o);
    },
    getPrototypeOf() {
      return Reflect.getPrototypeOf(e);
    },
    has(s, o) {
      return Reflect.has(e, o);
    },
    ownKeys() {
      return Reflect.ownKeys(e);
    },
    set(s, o, l) {
      return (e[o] = l), delete s[o], !0;
    },
  });
}
function vy(e, t = { scriptable: !0, indexable: !0 }) {
  const {
    _scriptable: n = t.scriptable,
    _indexable: i = t.indexable,
    _allKeys: r = t.allKeys,
  } = e;
  return {
    allKeys: r,
    scriptable: n,
    indexable: i,
    isScriptable: Wn(n) ? n : () => n,
    isIndexable: Wn(i) ? i : () => i,
  };
}
const aE = (e, t) => (e ? e + Mf(t) : t),
  zf = (e, t) =>
    te(t) &&
    e !== "adapters" &&
    (Object.getPrototypeOf(t) === null || t.constructor === Object);
function xy(e, t, n) {
  if (Object.prototype.hasOwnProperty.call(e, t) || t === "constructor")
    return e[t];
  const i = n();
  return (e[t] = i), i;
}
function uE(e, t, n) {
  const { _proxy: i, _context: r, _subProxy: s, _descriptors: o } = e;
  let l = i[t];
  return (
    Wn(l) && o.isScriptable(t) && (l = cE(t, l, e, n)),
    Oe(l) && l.length && (l = fE(t, l, e, o.isIndexable)),
    zf(t, l) && (l = nr(l, r, s && s[t], o)),
    l
  );
}
function cE(e, t, n, i) {
  const { _proxy: r, _context: s, _subProxy: o, _stack: l } = n;
  if (l.has(e))
    throw new Error(
      "Recursion detected: " + Array.from(l).join("->") + "->" + e
    );
  l.add(e);
  let a = t(s, o || i);
  return l.delete(e), zf(e, a) && (a = Ff(r._scopes, r, e, a)), a;
}
function fE(e, t, n, i) {
  const { _proxy: r, _context: s, _subProxy: o, _descriptors: l } = n;
  if (typeof s.index < "u" && i(e)) return t[s.index % t.length];
  if (te(t[0])) {
    const a = t,
      u = r._scopes.filter((c) => c !== a);
    t = [];
    for (const c of a) {
      const f = Ff(u, r, e, c);
      t.push(nr(f, s, o && o[e], l));
    }
  }
  return t;
}
function _y(e, t, n) {
  return Wn(e) ? e(t, n) : e;
}
const dE = (e, t) => (e === !0 ? t : typeof e == "string" ? Pl(t, e) : void 0);
function hE(e, t, n, i, r) {
  for (const s of t) {
    const o = dE(n, s);
    if (o) {
      e.add(o);
      const l = _y(o._fallback, n, r);
      if (typeof l < "u" && l !== n && l !== i) return l;
    } else if (o === !1 && typeof i < "u" && n !== i) return null;
  }
  return !1;
}
function Ff(e, t, n, i) {
  const r = t._rootScopes,
    s = _y(t._fallback, n, i),
    o = [...e, ...r],
    l = new Set();
  l.add(i);
  let a = rp(l, o, n, s || n, i);
  return a === null ||
    (typeof s < "u" && s !== n && ((a = rp(l, o, s, a, i)), a === null))
    ? !1
    : jf(Array.from(l), [""], r, s, () => pE(t, n, i));
}
function rp(e, t, n, i, r) {
  for (; n; ) n = hE(e, t, n, i, r);
  return n;
}
function pE(e, t, n) {
  const i = e._getTarget();
  t in i || (i[t] = {});
  const r = i[t];
  return Oe(r) && te(n) ? n : r || {};
}
function mE(e, t, n, i) {
  let r;
  for (const s of t)
    if (((r = wy(aE(s, e), n)), typeof r < "u"))
      return zf(e, r) ? Ff(n, i, e, r) : r;
}
function wy(e, t) {
  for (const n of t) {
    if (!n) continue;
    const i = n[e];
    if (typeof i < "u") return i;
  }
}
function sp(e) {
  let t = e._keys;
  return t || (t = e._keys = gE(e._scopes)), t;
}
function gE(e) {
  const t = new Set();
  for (const n of e)
    for (const i of Object.keys(n).filter((r) => !r.startsWith("_"))) t.add(i);
  return Array.from(t);
}
const yE = Number.EPSILON || 1e-14,
  ir = (e, t) => t < e.length && !e[t].skip && e[t],
  Sy = (e) => (e === "x" ? "y" : "x");
function vE(e, t, n, i) {
  const r = e.skip ? t : e,
    s = t,
    o = n.skip ? t : n,
    l = cc(s, r),
    a = cc(o, s);
  let u = l / (l + a),
    c = a / (l + a);
  (u = isNaN(u) ? 0 : u), (c = isNaN(c) ? 0 : c);
  const f = i * u,
    d = i * c;
  return {
    previous: { x: s.x - f * (o.x - r.x), y: s.y - f * (o.y - r.y) },
    next: { x: s.x + d * (o.x - r.x), y: s.y + d * (o.y - r.y) },
  };
}
function xE(e, t, n) {
  const i = e.length;
  let r,
    s,
    o,
    l,
    a,
    u = ir(e, 0);
  for (let c = 0; c < i - 1; ++c)
    if (((a = u), (u = ir(e, c + 1)), !(!a || !u))) {
      if (es(t[c], 0, yE)) {
        n[c] = n[c + 1] = 0;
        continue;
      }
      (r = n[c] / t[c]),
        (s = n[c + 1] / t[c]),
        (l = Math.pow(r, 2) + Math.pow(s, 2)),
        !(l <= 9) &&
          ((o = 3 / Math.sqrt(l)),
          (n[c] = r * o * t[c]),
          (n[c + 1] = s * o * t[c]));
    }
}
function _E(e, t, n = "x") {
  const i = Sy(n),
    r = e.length;
  let s,
    o,
    l,
    a = ir(e, 0);
  for (let u = 0; u < r; ++u) {
    if (((o = l), (l = a), (a = ir(e, u + 1)), !l)) continue;
    const c = l[n],
      f = l[i];
    o &&
      ((s = (c - o[n]) / 3),
      (l[`cp1${n}`] = c - s),
      (l[`cp1${i}`] = f - s * t[u])),
      a &&
        ((s = (a[n] - c) / 3),
        (l[`cp2${n}`] = c + s),
        (l[`cp2${i}`] = f + s * t[u]));
  }
}
function wE(e, t = "x") {
  const n = Sy(t),
    i = e.length,
    r = Array(i).fill(0),
    s = Array(i);
  let o,
    l,
    a,
    u = ir(e, 0);
  for (o = 0; o < i; ++o)
    if (((l = a), (a = u), (u = ir(e, o + 1)), !!a)) {
      if (u) {
        const c = u[t] - a[t];
        r[o] = c !== 0 ? (u[n] - a[n]) / c : 0;
      }
      s[o] = l
        ? u
          ? Vn(r[o - 1]) !== Vn(r[o])
            ? 0
            : (r[o - 1] + r[o]) / 2
          : r[o - 1]
        : r[o];
    }
  xE(e, r, s), _E(e, s, t);
}
function bo(e, t, n) {
  return Math.max(Math.min(e, n), t);
}
function SE(e, t) {
  let n,
    i,
    r,
    s,
    o,
    l = Ns(e[0], t);
  for (n = 0, i = e.length; n < i; ++n)
    (o = s),
      (s = l),
      (l = n < i - 1 && Ns(e[n + 1], t)),
      s &&
        ((r = e[n]),
        o &&
          ((r.cp1x = bo(r.cp1x, t.left, t.right)),
          (r.cp1y = bo(r.cp1y, t.top, t.bottom))),
        l &&
          ((r.cp2x = bo(r.cp2x, t.left, t.right)),
          (r.cp2y = bo(r.cp2y, t.top, t.bottom))));
}
function bE(e, t, n, i, r) {
  let s, o, l, a;
  if (
    (t.spanGaps && (e = e.filter((u) => !u.skip)),
    t.cubicInterpolationMode === "monotone")
  )
    wE(e, r);
  else {
    let u = i ? e[e.length - 1] : e[0];
    for (s = 0, o = e.length; s < o; ++s)
      (l = e[s]),
        (a = vE(u, l, e[Math.min(s + 1, o - (i ? 0 : 1)) % o], t.tension)),
        (l.cp1x = a.previous.x),
        (l.cp1y = a.previous.y),
        (l.cp2x = a.next.x),
        (l.cp2y = a.next.y),
        (u = l);
  }
  t.capBezierPoints && SE(e, n);
}
function Bf() {
  return typeof window < "u" && typeof document < "u";
}
function Hf(e) {
  let t = e.parentNode;
  return t && t.toString() === "[object ShadowRoot]" && (t = t.host), t;
}
function Ml(e, t, n) {
  let i;
  return (
    typeof e == "string"
      ? ((i = parseInt(e, 10)),
        e.indexOf("%") !== -1 && (i = (i / 100) * t.parentNode[n]))
      : (i = e),
    i
  );
}
const sa = (e) => e.ownerDocument.defaultView.getComputedStyle(e, null);
function EE(e, t) {
  return sa(e).getPropertyValue(t);
}
const kE = ["top", "right", "bottom", "left"];
function hi(e, t, n) {
  const i = {};
  n = n ? "-" + n : "";
  for (let r = 0; r < 4; r++) {
    const s = kE[r];
    i[s] = parseFloat(e[t + "-" + s + n]) || 0;
  }
  return (i.width = i.left + i.right), (i.height = i.top + i.bottom), i;
}
const TE = (e, t, n) => (e > 0 || t > 0) && (!n || !n.shadowRoot);
function CE(e, t) {
  const n = e.touches,
    i = n && n.length ? n[0] : e,
    { offsetX: r, offsetY: s } = i;
  let o = !1,
    l,
    a;
  if (TE(r, s, e.target)) (l = r), (a = s);
  else {
    const u = t.getBoundingClientRect();
    (l = i.clientX - u.left), (a = i.clientY - u.top), (o = !0);
  }
  return { x: l, y: a, box: o };
}
function Kt(e, t) {
  if ("native" in e) return e;
  const { canvas: n, currentDevicePixelRatio: i } = t,
    r = sa(n),
    s = r.boxSizing === "border-box",
    o = hi(r, "padding"),
    l = hi(r, "border", "width"),
    { x: a, y: u, box: c } = CE(e, n),
    f = o.left + (c && l.left),
    d = o.top + (c && l.top);
  let { width: h, height: m } = t;
  return (
    s && ((h -= o.width + l.width), (m -= o.height + l.height)),
    {
      x: Math.round((((a - f) / h) * n.width) / i),
      y: Math.round((((u - d) / m) * n.height) / i),
    }
  );
}
function PE(e, t, n) {
  let i, r;
  if (t === void 0 || n === void 0) {
    const s = e && Hf(e);
    if (!s) (t = e.clientWidth), (n = e.clientHeight);
    else {
      const o = s.getBoundingClientRect(),
        l = sa(s),
        a = hi(l, "border", "width"),
        u = hi(l, "padding");
      (t = o.width - u.width - a.width),
        (n = o.height - u.height - a.height),
        (i = Ml(l.maxWidth, s, "clientWidth")),
        (r = Ml(l.maxHeight, s, "clientHeight"));
    }
  }
  return { width: t, height: n, maxWidth: i || Nl, maxHeight: r || Nl };
}
const Eo = (e) => Math.round(e * 10) / 10;
function OE(e, t, n, i) {
  const r = sa(e),
    s = hi(r, "margin"),
    o = Ml(r.maxWidth, e, "clientWidth") || Nl,
    l = Ml(r.maxHeight, e, "clientHeight") || Nl,
    a = PE(e, t, n);
  let { width: u, height: c } = a;
  if (r.boxSizing === "content-box") {
    const d = hi(r, "border", "width"),
      h = hi(r, "padding");
    (u -= h.width + d.width), (c -= h.height + d.height);
  }
  return (
    (u = Math.max(0, u - s.width)),
    (c = Math.max(0, i ? u / i : c - s.height)),
    (u = Eo(Math.min(u, o, a.maxWidth))),
    (c = Eo(Math.min(c, l, a.maxHeight))),
    u && !c && (c = Eo(u / 2)),
    (t !== void 0 || n !== void 0) &&
      i &&
      a.height &&
      c > a.height &&
      ((c = a.height), (u = Eo(Math.floor(c * i)))),
    { width: u, height: c }
  );
}
function op(e, t, n) {
  const i = t || 1,
    r = Math.floor(e.height * i),
    s = Math.floor(e.width * i);
  (e.height = Math.floor(e.height)), (e.width = Math.floor(e.width));
  const o = e.canvas;
  return (
    o.style &&
      (n || (!o.style.height && !o.style.width)) &&
      ((o.style.height = `${e.height}px`), (o.style.width = `${e.width}px`)),
    e.currentDevicePixelRatio !== i || o.height !== r || o.width !== s
      ? ((e.currentDevicePixelRatio = i),
        (o.height = r),
        (o.width = s),
        e.ctx.setTransform(i, 0, 0, i, 0, 0),
        !0)
      : !1
  );
}
const NE = (function () {
  let e = !1;
  try {
    const t = {
      get passive() {
        return (e = !0), !1;
      },
    };
    Bf() &&
      (window.addEventListener("test", null, t),
      window.removeEventListener("test", null, t));
  } catch {}
  return e;
})();
function lp(e, t) {
  const n = EE(e, t),
    i = n && n.match(/^(\d+)(\.\d+)?px$/);
  return i ? +i[1] : void 0;
}
function ii(e, t, n, i) {
  return { x: e.x + n * (t.x - e.x), y: e.y + n * (t.y - e.y) };
}
function ME(e, t, n, i) {
  return {
    x: e.x + n * (t.x - e.x),
    y:
      i === "middle"
        ? n < 0.5
          ? e.y
          : t.y
        : i === "after"
        ? n < 1
          ? e.y
          : t.y
        : n > 0
        ? t.y
        : e.y,
  };
}
function RE(e, t, n, i) {
  const r = { x: e.cp2x, y: e.cp2y },
    s = { x: t.cp1x, y: t.cp1y },
    o = ii(e, r, n),
    l = ii(r, s, n),
    a = ii(s, t, n),
    u = ii(o, l, n),
    c = ii(l, a, n);
  return ii(u, c, n);
}
const LE = function (e, t) {
    return {
      x(n) {
        return e + e + t - n;
      },
      setWidth(n) {
        t = n;
      },
      textAlign(n) {
        return n === "center" ? n : n === "right" ? "left" : "right";
      },
      xPlus(n, i) {
        return n - i;
      },
      leftForLtr(n, i) {
        return n - i;
      },
    };
  },
  IE = function () {
    return {
      x(e) {
        return e;
      },
      setWidth(e) {},
      textAlign(e) {
        return e;
      },
      xPlus(e, t) {
        return e + t;
      },
      leftForLtr(e, t) {
        return e;
      },
    };
  };
function Ki(e, t, n) {
  return e ? LE(t, n) : IE();
}
function by(e, t) {
  let n, i;
  (t === "ltr" || t === "rtl") &&
    ((n = e.canvas.style),
    (i = [n.getPropertyValue("direction"), n.getPropertyPriority("direction")]),
    n.setProperty("direction", t, "important"),
    (e.prevTextDirection = i));
}
function Ey(e, t) {
  t !== void 0 &&
    (delete e.prevTextDirection,
    e.canvas.style.setProperty("direction", t[0], t[1]));
}
function ky(e) {
  return e === "angle"
    ? { between: uy, compare: Rb, normalize: Sn }
    : { between: Br, compare: (t, n) => t - n, normalize: (t) => t };
}
function ap({ start: e, end: t, count: n, loop: i, style: r }) {
  return {
    start: e % n,
    end: t % n,
    loop: i && (t - e + 1) % n === 0,
    style: r,
  };
}
function DE(e, t, n) {
  const { property: i, start: r, end: s } = n,
    { between: o, normalize: l } = ky(i),
    a = t.length;
  let { start: u, end: c, loop: f } = e,
    d,
    h;
  if (f) {
    for (u += a, c += a, d = 0, h = a; d < h && o(l(t[u % a][i]), r, s); ++d)
      u--, c--;
    (u %= a), (c %= a);
  }
  return c < u && (c += a), { start: u, end: c, loop: f, style: e.style };
}
function AE(e, t, n) {
  if (!n) return [e];
  const { property: i, start: r, end: s } = n,
    o = t.length,
    { compare: l, between: a, normalize: u } = ky(i),
    { start: c, end: f, loop: d, style: h } = DE(e, t, n),
    m = [];
  let v = !1,
    _ = null,
    g,
    y,
    w;
  const E = () => a(r, w, g) && l(r, w) !== 0,
    k = () => l(s, g) === 0 || a(s, w, g),
    P = () => v || E(),
    C = () => !v || k();
  for (let N = c, I = c; N <= f; ++N)
    (y = t[N % o]),
      !y.skip &&
        ((g = u(y[i])),
        g !== w &&
          ((v = a(g, r, s)),
          _ === null && P() && (_ = l(g, r) === 0 ? N : I),
          _ !== null &&
            C() &&
            (m.push(ap({ start: _, end: N, loop: d, count: o, style: h })),
            (_ = null)),
          (I = N),
          (w = g)));
  return (
    _ !== null && m.push(ap({ start: _, end: f, loop: d, count: o, style: h })),
    m
  );
}
function jE(e, t) {
  const n = [],
    i = e.segments;
  for (let r = 0; r < i.length; r++) {
    const s = AE(i[r], e.points, t);
    s.length && n.push(...s);
  }
  return n;
}
function zE(e, t, n, i) {
  let r = 0,
    s = t - 1;
  if (n && !i) for (; r < t && !e[r].skip; ) r++;
  for (; r < t && e[r].skip; ) r++;
  for (r %= t, n && (s += r); s > r && e[s % t].skip; ) s--;
  return (s %= t), { start: r, end: s };
}
function FE(e, t, n, i) {
  const r = e.length,
    s = [];
  let o = t,
    l = e[t],
    a;
  for (a = t + 1; a <= n; ++a) {
    const u = e[a % r];
    u.skip || u.stop
      ? l.skip ||
        ((i = !1),
        s.push({ start: t % r, end: (a - 1) % r, loop: i }),
        (t = o = u.stop ? a : null))
      : ((o = a), l.skip && (t = a)),
      (l = u);
  }
  return o !== null && s.push({ start: t % r, end: o % r, loop: i }), s;
}
function BE(e, t) {
  const n = e.points,
    i = e.options.spanGaps,
    r = n.length;
  if (!r) return [];
  const s = !!e._loop,
    { start: o, end: l } = zE(n, r, s, i);
  if (i === !0) return up(e, [{ start: o, end: l, loop: s }], n, t);
  const a = l < o ? l + r : l,
    u = !!e._fullLoop && o === 0 && l === r - 1;
  return up(e, FE(n, o, a, u), n, t);
}
function up(e, t, n, i) {
  return !i || !i.setContext || !n ? t : HE(e, t, n, i);
}
function HE(e, t, n, i) {
  const r = e._chart.getContext(),
    s = cp(e.options),
    {
      _datasetIndex: o,
      options: { spanGaps: l },
    } = e,
    a = n.length,
    u = [];
  let c = s,
    f = t[0].start,
    d = f;
  function h(m, v, _, g) {
    const y = l ? -1 : 1;
    if (m !== v) {
      for (m += a; n[m % a].skip; ) m -= y;
      for (; n[v % a].skip; ) v += y;
      m % a !== v % a &&
        (u.push({ start: m % a, end: v % a, loop: _, style: g }),
        (c = g),
        (f = v % a));
    }
  }
  for (const m of t) {
    f = l ? f : m.start;
    let v = n[f % a],
      _;
    for (d = f + 1; d <= m.end; d++) {
      const g = n[d % a];
      (_ = cp(
        i.setContext(
          Ti(r, {
            type: "segment",
            p0: v,
            p1: g,
            p0DataIndex: (d - 1) % a,
            p1DataIndex: d % a,
            datasetIndex: o,
          })
        )
      )),
        UE(_, c) && h(f, d - 1, m.loop, c),
        (v = g),
        (c = _);
    }
    f < d - 1 && h(f, d - 1, m.loop, c);
  }
  return u;
}
function cp(e) {
  return {
    backgroundColor: e.backgroundColor,
    borderCapStyle: e.borderCapStyle,
    borderDash: e.borderDash,
    borderDashOffset: e.borderDashOffset,
    borderJoinStyle: e.borderJoinStyle,
    borderWidth: e.borderWidth,
    borderColor: e.borderColor,
  };
}
function UE(e, t) {
  if (!t) return !1;
  const n = [],
    i = function (r, s) {
      return If(s) ? (n.includes(s) || n.push(s), n.indexOf(s)) : s;
    };
  return JSON.stringify(e, i) !== JSON.stringify(t, i);
}
/*!
 * Chart.js v4.4.5
 * https://www.chartjs.org
 * (c) 2024 Chart.js Contributors
 * Released under the MIT License
 */ class WE {
  constructor() {
    (this._request = null),
      (this._charts = new Map()),
      (this._running = !1),
      (this._lastDate = void 0);
  }
  _notify(t, n, i, r) {
    const s = n.listeners[r],
      o = n.duration;
    s.forEach((l) =>
      l({
        chart: t,
        initial: n.initial,
        numSteps: o,
        currentStep: Math.min(i - n.start, o),
      })
    );
  }
  _refresh() {
    this._request ||
      ((this._running = !0),
      (this._request = fy.call(window, () => {
        this._update(),
          (this._request = null),
          this._running && this._refresh();
      })));
  }
  _update(t = Date.now()) {
    let n = 0;
    this._charts.forEach((i, r) => {
      if (!i.running || !i.items.length) return;
      const s = i.items;
      let o = s.length - 1,
        l = !1,
        a;
      for (; o >= 0; --o)
        (a = s[o]),
          a._active
            ? (a._total > i.duration && (i.duration = a._total),
              a.tick(t),
              (l = !0))
            : ((s[o] = s[s.length - 1]), s.pop());
      l && (r.draw(), this._notify(r, i, t, "progress")),
        s.length ||
          ((i.running = !1),
          this._notify(r, i, t, "complete"),
          (i.initial = !1)),
        (n += s.length);
    }),
      (this._lastDate = t),
      n === 0 && (this._running = !1);
  }
  _getAnims(t) {
    const n = this._charts;
    let i = n.get(t);
    return (
      i ||
        ((i = {
          running: !1,
          initial: !0,
          items: [],
          listeners: { complete: [], progress: [] },
        }),
        n.set(t, i)),
      i
    );
  }
  listen(t, n, i) {
    this._getAnims(t).listeners[n].push(i);
  }
  add(t, n) {
    !n || !n.length || this._getAnims(t).items.push(...n);
  }
  has(t) {
    return this._getAnims(t).items.length > 0;
  }
  start(t) {
    const n = this._charts.get(t);
    n &&
      ((n.running = !0),
      (n.start = Date.now()),
      (n.duration = n.items.reduce((i, r) => Math.max(i, r._duration), 0)),
      this._refresh());
  }
  running(t) {
    if (!this._running) return !1;
    const n = this._charts.get(t);
    return !(!n || !n.running || !n.items.length);
  }
  stop(t) {
    const n = this._charts.get(t);
    if (!n || !n.items.length) return;
    const i = n.items;
    let r = i.length - 1;
    for (; r >= 0; --r) i[r].cancel();
    (n.items = []), this._notify(t, n, Date.now(), "complete");
  }
  remove(t) {
    return this._charts.delete(t);
  }
}
var nn = new WE();
const fp = "transparent",
  VE = {
    boolean(e, t, n) {
      return n > 0.5 ? t : e;
    },
    color(e, t, n) {
      const i = ep(e || fp),
        r = i.valid && ep(t || fp);
      return r && r.valid ? r.mix(i, n).hexString() : t;
    },
    number(e, t, n) {
      return e + (t - e) * n;
    },
  };
class $E {
  constructor(t, n, i, r) {
    const s = n[i];
    r = So([t.to, r, s, t.from]);
    const o = So([t.from, s, r]);
    (this._active = !0),
      (this._fn = t.fn || VE[t.type || typeof o]),
      (this._easing = ts[t.easing] || ts.linear),
      (this._start = Math.floor(Date.now() + (t.delay || 0))),
      (this._duration = this._total = Math.floor(t.duration)),
      (this._loop = !!t.loop),
      (this._target = n),
      (this._prop = i),
      (this._from = o),
      (this._to = r),
      (this._promises = void 0);
  }
  active() {
    return this._active;
  }
  update(t, n, i) {
    if (this._active) {
      this._notify(!1);
      const r = this._target[this._prop],
        s = i - this._start,
        o = this._duration - s;
      (this._start = i),
        (this._duration = Math.floor(Math.max(o, t.duration))),
        (this._total += s),
        (this._loop = !!t.loop),
        (this._to = So([t.to, n, r, t.from])),
        (this._from = So([t.from, r, n]));
    }
  }
  cancel() {
    this._active &&
      (this.tick(Date.now()), (this._active = !1), this._notify(!1));
  }
  tick(t) {
    const n = t - this._start,
      i = this._duration,
      r = this._prop,
      s = this._from,
      o = this._loop,
      l = this._to;
    let a;
    if (((this._active = s !== l && (o || n < i)), !this._active)) {
      (this._target[r] = l), this._notify(!0);
      return;
    }
    if (n < 0) {
      this._target[r] = s;
      return;
    }
    (a = (n / i) % 2),
      (a = o && a > 1 ? 2 - a : a),
      (a = this._easing(Math.min(1, Math.max(0, a)))),
      (this._target[r] = this._fn(s, l, a));
  }
  wait() {
    const t = this._promises || (this._promises = []);
    return new Promise((n, i) => {
      t.push({ res: n, rej: i });
    });
  }
  _notify(t) {
    const n = t ? "res" : "rej",
      i = this._promises || [];
    for (let r = 0; r < i.length; r++) i[r][n]();
  }
}
class Ty {
  constructor(t, n) {
    (this._chart = t), (this._properties = new Map()), this.configure(n);
  }
  configure(t) {
    if (!te(t)) return;
    const n = Object.keys(ye.animation),
      i = this._properties;
    Object.getOwnPropertyNames(t).forEach((r) => {
      const s = t[r];
      if (!te(s)) return;
      const o = {};
      for (const l of n) o[l] = s[l];
      ((Oe(s.properties) && s.properties) || [r]).forEach((l) => {
        (l === r || !i.has(l)) && i.set(l, o);
      });
    });
  }
  _animateOptions(t, n) {
    const i = n.options,
      r = XE(t, i);
    if (!r) return [];
    const s = this._createAnimations(r, i);
    return (
      i.$shared &&
        YE(t.options.$animations, i).then(
          () => {
            t.options = i;
          },
          () => {}
        ),
      s
    );
  }
  _createAnimations(t, n) {
    const i = this._properties,
      r = [],
      s = t.$animations || (t.$animations = {}),
      o = Object.keys(n),
      l = Date.now();
    let a;
    for (a = o.length - 1; a >= 0; --a) {
      const u = o[a];
      if (u.charAt(0) === "$") continue;
      if (u === "options") {
        r.push(...this._animateOptions(t, n));
        continue;
      }
      const c = n[u];
      let f = s[u];
      const d = i.get(u);
      if (f)
        if (d && f.active()) {
          f.update(d, c, l);
          continue;
        } else f.cancel();
      if (!d || !d.duration) {
        t[u] = c;
        continue;
      }
      (s[u] = f = new $E(d, t, u, c)), r.push(f);
    }
    return r;
  }
  update(t, n) {
    if (this._properties.size === 0) {
      Object.assign(t, n);
      return;
    }
    const i = this._createAnimations(t, n);
    if (i.length) return nn.add(this._chart, i), !0;
  }
}
function YE(e, t) {
  const n = [],
    i = Object.keys(t);
  for (let r = 0; r < i.length; r++) {
    const s = e[i[r]];
    s && s.active() && n.push(s.wait());
  }
  return Promise.all(n);
}
function XE(e, t) {
  if (!t) return;
  let n = e.options;
  if (!n) {
    e.options = t;
    return;
  }
  return (
    n.$shared &&
      (e.options = n = Object.assign({}, n, { $shared: !1, $animations: {} })),
    n
  );
}
function dp(e, t) {
  const n = (e && e.options) || {},
    i = n.reverse,
    r = n.min === void 0 ? t : 0,
    s = n.max === void 0 ? t : 0;
  return { start: i ? s : r, end: i ? r : s };
}
function KE(e, t, n) {
  if (n === !1) return !1;
  const i = dp(e, n),
    r = dp(t, n);
  return { top: r.end, right: i.end, bottom: r.start, left: i.start };
}
function qE(e) {
  let t, n, i, r;
  return (
    te(e)
      ? ((t = e.top), (n = e.right), (i = e.bottom), (r = e.left))
      : (t = n = i = r = e),
    { top: t, right: n, bottom: i, left: r, disabled: e === !1 }
  );
}
function Cy(e, t) {
  const n = [],
    i = e._getSortedDatasetMetas(t);
  let r, s;
  for (r = 0, s = i.length; r < s; ++r) n.push(i[r].index);
  return n;
}
function hp(e, t, n, i = {}) {
  const r = e.keys,
    s = i.mode === "single";
  let o, l, a, u;
  if (t !== null) {
    for (o = 0, l = r.length; o < l; ++o) {
      if (((a = +r[o]), a === n)) {
        if (i.all) continue;
        break;
      }
      (u = e.values[a]), kt(u) && (s || t === 0 || Vn(t) === Vn(u)) && (t += u);
    }
    return t;
  }
}
function QE(e, t) {
  const { iScale: n, vScale: i } = t,
    r = n.axis === "x" ? "x" : "y",
    s = i.axis === "x" ? "x" : "y",
    o = Object.keys(e),
    l = new Array(o.length);
  let a, u, c;
  for (a = 0, u = o.length; a < u; ++a)
    (c = o[a]), (l[a] = { [r]: c, [s]: e[c] });
  return l;
}
function Za(e, t) {
  const n = e && e.options.stacked;
  return n || (n === void 0 && t.stack !== void 0);
}
function GE(e, t, n) {
  return `${e.id}.${t.id}.${n.stack || n.type}`;
}
function ZE(e) {
  const { min: t, max: n, minDefined: i, maxDefined: r } = e.getUserBounds();
  return {
    min: i ? t : Number.NEGATIVE_INFINITY,
    max: r ? n : Number.POSITIVE_INFINITY,
  };
}
function JE(e, t, n) {
  const i = e[t] || (e[t] = {});
  return i[n] || (i[n] = {});
}
function pp(e, t, n, i) {
  for (const r of t.getMatchingVisibleMetas(i).reverse()) {
    const s = e[r.index];
    if ((n && s > 0) || (!n && s < 0)) return r.index;
  }
  return null;
}
function mp(e, t) {
  const { chart: n, _cachedMeta: i } = e,
    r = n._stacks || (n._stacks = {}),
    { iScale: s, vScale: o, index: l } = i,
    a = s.axis,
    u = o.axis,
    c = GE(s, o, i),
    f = t.length;
  let d;
  for (let h = 0; h < f; ++h) {
    const m = t[h],
      { [a]: v, [u]: _ } = m,
      g = m._stacks || (m._stacks = {});
    (d = g[u] = JE(r, c, v)),
      (d[l] = _),
      (d._top = pp(d, o, !0, i.type)),
      (d._bottom = pp(d, o, !1, i.type));
    const y = d._visualValues || (d._visualValues = {});
    y[l] = _;
  }
}
function Ja(e, t) {
  const n = e.scales;
  return Object.keys(n)
    .filter((i) => n[i].axis === t)
    .shift();
}
function ek(e, t) {
  return Ti(e, {
    active: !1,
    dataset: void 0,
    datasetIndex: t,
    index: t,
    mode: "default",
    type: "dataset",
  });
}
function tk(e, t, n) {
  return Ti(e, {
    active: !1,
    dataIndex: t,
    parsed: void 0,
    raw: void 0,
    element: n,
    index: t,
    mode: "default",
    type: "data",
  });
}
function Or(e, t) {
  const n = e.controller.index,
    i = e.vScale && e.vScale.axis;
  if (i) {
    t = t || e._parsed;
    for (const r of t) {
      const s = r._stacks;
      if (!s || s[i] === void 0 || s[i][n] === void 0) return;
      delete s[i][n],
        s[i]._visualValues !== void 0 &&
          s[i]._visualValues[n] !== void 0 &&
          delete s[i]._visualValues[n];
    }
  }
}
const eu = (e) => e === "reset" || e === "none",
  gp = (e, t) => (t ? e : Object.assign({}, e)),
  nk = (e, t, n) =>
    e && !t.hidden && t._stacked && { keys: Cy(n, !0), values: null };
class rs {
  constructor(t, n) {
    (this.chart = t),
      (this._ctx = t.ctx),
      (this.index = n),
      (this._cachedDataOpts = {}),
      (this._cachedMeta = this.getMeta()),
      (this._type = this._cachedMeta.type),
      (this.options = void 0),
      (this._parsing = !1),
      (this._data = void 0),
      (this._objectData = void 0),
      (this._sharedOptions = void 0),
      (this._drawStart = void 0),
      (this._drawCount = void 0),
      (this.enableOptionSharing = !1),
      (this.supportsDecimation = !1),
      (this.$context = void 0),
      (this._syncList = []),
      (this.datasetElementType = new.target.datasetElementType),
      (this.dataElementType = new.target.dataElementType),
      this.initialize();
  }
  initialize() {
    const t = this._cachedMeta;
    this.configure(),
      this.linkScales(),
      (t._stacked = Za(t.vScale, t)),
      this.addElements(),
      this.options.fill &&
        !this.chart.isPluginEnabled("filler") &&
        console.warn(
          "Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options"
        );
  }
  updateIndex(t) {
    this.index !== t && Or(this._cachedMeta), (this.index = t);
  }
  linkScales() {
    const t = this.chart,
      n = this._cachedMeta,
      i = this.getDataset(),
      r = (f, d, h, m) => (f === "x" ? d : f === "r" ? m : h),
      s = (n.xAxisID = K(i.xAxisID, Ja(t, "x"))),
      o = (n.yAxisID = K(i.yAxisID, Ja(t, "y"))),
      l = (n.rAxisID = K(i.rAxisID, Ja(t, "r"))),
      a = n.indexAxis,
      u = (n.iAxisID = r(a, s, o, l)),
      c = (n.vAxisID = r(a, o, s, l));
    (n.xScale = this.getScaleForId(s)),
      (n.yScale = this.getScaleForId(o)),
      (n.rScale = this.getScaleForId(l)),
      (n.iScale = this.getScaleForId(u)),
      (n.vScale = this.getScaleForId(c));
  }
  getDataset() {
    return this.chart.data.datasets[this.index];
  }
  getMeta() {
    return this.chart.getDatasetMeta(this.index);
  }
  getScaleForId(t) {
    return this.chart.scales[t];
  }
  _getOtherScale(t) {
    const n = this._cachedMeta;
    return t === n.iScale ? n.vScale : n.iScale;
  }
  reset() {
    this._update("reset");
  }
  _destroy() {
    const t = this._cachedMeta;
    this._data && Gh(this._data, this), t._stacked && Or(t);
  }
  _dataCheck() {
    const t = this.getDataset(),
      n = t.data || (t.data = []),
      i = this._data;
    if (te(n)) {
      const r = this._cachedMeta;
      this._data = QE(n, r);
    } else if (i !== n) {
      if (i) {
        Gh(i, this);
        const r = this._cachedMeta;
        Or(r), (r._parsed = []);
      }
      n && Object.isExtensible(n) && Ab(n, this),
        (this._syncList = []),
        (this._data = n);
    }
  }
  addElements() {
    const t = this._cachedMeta;
    this._dataCheck(),
      this.datasetElementType && (t.dataset = new this.datasetElementType());
  }
  buildOrUpdateElements(t) {
    const n = this._cachedMeta,
      i = this.getDataset();
    let r = !1;
    this._dataCheck();
    const s = n._stacked;
    (n._stacked = Za(n.vScale, n)),
      n.stack !== i.stack && ((r = !0), Or(n), (n.stack = i.stack)),
      this._resyncElements(t),
      (r || s !== n._stacked) &&
        (mp(this, n._parsed), (n._stacked = Za(n.vScale, n)));
  }
  configure() {
    const t = this.chart.config,
      n = t.datasetScopeKeys(this._type),
      i = t.getOptionScopes(this.getDataset(), n, !0);
    (this.options = t.createResolver(i, this.getContext())),
      (this._parsing = this.options.parsing),
      (this._cachedDataOpts = {});
  }
  parse(t, n) {
    const { _cachedMeta: i, _data: r } = this,
      { iScale: s, _stacked: o } = i,
      l = s.axis;
    let a = t === 0 && n === r.length ? !0 : i._sorted,
      u = t > 0 && i._parsed[t - 1],
      c,
      f,
      d;
    if (this._parsing === !1) (i._parsed = r), (i._sorted = !0), (d = r);
    else {
      Oe(r[t])
        ? (d = this.parseArrayData(i, r, t, n))
        : te(r[t])
        ? (d = this.parseObjectData(i, r, t, n))
        : (d = this.parsePrimitiveData(i, r, t, n));
      const h = () => f[l] === null || (u && f[l] < u[l]);
      for (c = 0; c < n; ++c)
        (i._parsed[c + t] = f = d[c]), a && (h() && (a = !1), (u = f));
      i._sorted = a;
    }
    o && mp(this, d);
  }
  parsePrimitiveData(t, n, i, r) {
    const { iScale: s, vScale: o } = t,
      l = s.axis,
      a = o.axis,
      u = s.getLabels(),
      c = s === o,
      f = new Array(r);
    let d, h, m;
    for (d = 0, h = r; d < h; ++d)
      (m = d + i),
        (f[d] = { [l]: c || s.parse(u[m], m), [a]: o.parse(n[m], m) });
    return f;
  }
  parseArrayData(t, n, i, r) {
    const { xScale: s, yScale: o } = t,
      l = new Array(r);
    let a, u, c, f;
    for (a = 0, u = r; a < u; ++a)
      (c = a + i),
        (f = n[c]),
        (l[a] = { x: s.parse(f[0], c), y: o.parse(f[1], c) });
    return l;
  }
  parseObjectData(t, n, i, r) {
    const { xScale: s, yScale: o } = t,
      { xAxisKey: l = "x", yAxisKey: a = "y" } = this._parsing,
      u = new Array(r);
    let c, f, d, h;
    for (c = 0, f = r; c < f; ++c)
      (d = c + i),
        (h = n[d]),
        (u[c] = { x: s.parse(Pl(h, l), d), y: o.parse(Pl(h, a), d) });
    return u;
  }
  getParsed(t) {
    return this._cachedMeta._parsed[t];
  }
  getDataElement(t) {
    return this._cachedMeta.data[t];
  }
  applyStack(t, n, i) {
    const r = this.chart,
      s = this._cachedMeta,
      o = n[t.axis],
      l = { keys: Cy(r, !0), values: n._stacks[t.axis]._visualValues };
    return hp(l, o, s.index, { mode: i });
  }
  updateRangeFromParsed(t, n, i, r) {
    const s = i[n.axis];
    let o = s === null ? NaN : s;
    const l = r && i._stacks[n.axis];
    r && l && ((r.values = l), (o = hp(r, s, this._cachedMeta.index))),
      (t.min = Math.min(t.min, o)),
      (t.max = Math.max(t.max, o));
  }
  getMinMax(t, n) {
    const i = this._cachedMeta,
      r = i._parsed,
      s = i._sorted && t === i.iScale,
      o = r.length,
      l = this._getOtherScale(t),
      a = nk(n, i, this.chart),
      u = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
      { min: c, max: f } = ZE(l);
    let d, h;
    function m() {
      h = r[d];
      const v = h[l.axis];
      return !kt(h[t.axis]) || c > v || f < v;
    }
    for (
      d = 0;
      d < o && !(!m() && (this.updateRangeFromParsed(u, t, h, a), s));
      ++d
    );
    if (s) {
      for (d = o - 1; d >= 0; --d)
        if (!m()) {
          this.updateRangeFromParsed(u, t, h, a);
          break;
        }
    }
    return u;
  }
  getAllParsedValues(t) {
    const n = this._cachedMeta._parsed,
      i = [];
    let r, s, o;
    for (r = 0, s = n.length; r < s; ++r)
      (o = n[r][t.axis]), kt(o) && i.push(o);
    return i;
  }
  getMaxOverflow() {
    return !1;
  }
  getLabelAndValue(t) {
    const n = this._cachedMeta,
      i = n.iScale,
      r = n.vScale,
      s = this.getParsed(t);
    return {
      label: i ? "" + i.getLabelForValue(s[i.axis]) : "",
      value: r ? "" + r.getLabelForValue(s[r.axis]) : "",
    };
  }
  _update(t) {
    const n = this._cachedMeta;
    this.update(t || "default"),
      (n._clip = qE(
        K(this.options.clip, KE(n.xScale, n.yScale, this.getMaxOverflow()))
      ));
  }
  update(t) {}
  draw() {
    const t = this._ctx,
      n = this.chart,
      i = this._cachedMeta,
      r = i.data || [],
      s = n.chartArea,
      o = [],
      l = this._drawStart || 0,
      a = this._drawCount || r.length - l,
      u = this.options.drawActiveElementsOnTop;
    let c;
    for (i.dataset && i.dataset.draw(t, s, l, a), c = l; c < l + a; ++c) {
      const f = r[c];
      f.hidden || (f.active && u ? o.push(f) : f.draw(t, s));
    }
    for (c = 0; c < o.length; ++c) o[c].draw(t, s);
  }
  getStyle(t, n) {
    const i = n ? "active" : "default";
    return t === void 0 && this._cachedMeta.dataset
      ? this.resolveDatasetElementOptions(i)
      : this.resolveDataElementOptions(t || 0, i);
  }
  getContext(t, n, i) {
    const r = this.getDataset();
    let s;
    if (t >= 0 && t < this._cachedMeta.data.length) {
      const o = this._cachedMeta.data[t];
      (s = o.$context || (o.$context = tk(this.getContext(), t, o))),
        (s.parsed = this.getParsed(t)),
        (s.raw = r.data[t]),
        (s.index = s.dataIndex = t);
    } else
      (s =
        this.$context ||
        (this.$context = ek(this.chart.getContext(), this.index))),
        (s.dataset = r),
        (s.index = s.datasetIndex = this.index);
    return (s.active = !!n), (s.mode = i), s;
  }
  resolveDatasetElementOptions(t) {
    return this._resolveElementOptions(this.datasetElementType.id, t);
  }
  resolveDataElementOptions(t, n) {
    return this._resolveElementOptions(this.dataElementType.id, n, t);
  }
  _resolveElementOptions(t, n = "default", i) {
    const r = n === "active",
      s = this._cachedDataOpts,
      o = t + "-" + n,
      l = s[o],
      a = this.enableOptionSharing && Ol(i);
    if (l) return gp(l, a);
    const u = this.chart.config,
      c = u.datasetElementScopeKeys(this._type, t),
      f = r ? [`${t}Hover`, "hover", t, ""] : [t, ""],
      d = u.getOptionScopes(this.getDataset(), c),
      h = Object.keys(ye.elements[t]),
      m = () => this.getContext(i, r, n),
      v = u.resolveNamedOptions(d, h, m, f);
    return v.$shared && ((v.$shared = a), (s[o] = Object.freeze(gp(v, a)))), v;
  }
  _resolveAnimations(t, n, i) {
    const r = this.chart,
      s = this._cachedDataOpts,
      o = `animation-${n}`,
      l = s[o];
    if (l) return l;
    let a;
    if (r.options.animation !== !1) {
      const c = this.chart.config,
        f = c.datasetAnimationScopeKeys(this._type, n),
        d = c.getOptionScopes(this.getDataset(), f);
      a = c.createResolver(d, this.getContext(t, i, n));
    }
    const u = new Ty(r, a && a.animations);
    return a && a._cacheable && (s[o] = Object.freeze(u)), u;
  }
  getSharedOptions(t) {
    if (t.$shared)
      return (
        this._sharedOptions || (this._sharedOptions = Object.assign({}, t))
      );
  }
  includeOptions(t, n) {
    return !n || eu(t) || this.chart._animationsDisabled;
  }
  _getSharedOptions(t, n) {
    const i = this.resolveDataElementOptions(t, n),
      r = this._sharedOptions,
      s = this.getSharedOptions(i),
      o = this.includeOptions(n, s) || s !== r;
    return (
      this.updateSharedOptions(s, n, i), { sharedOptions: s, includeOptions: o }
    );
  }
  updateElement(t, n, i, r) {
    eu(r) ? Object.assign(t, i) : this._resolveAnimations(n, r).update(t, i);
  }
  updateSharedOptions(t, n, i) {
    t && !eu(n) && this._resolveAnimations(void 0, n).update(t, i);
  }
  _setStyle(t, n, i, r) {
    t.active = r;
    const s = this.getStyle(n, r);
    this._resolveAnimations(n, i, r).update(t, {
      options: (!r && this.getSharedOptions(s)) || s,
    });
  }
  removeHoverStyle(t, n, i) {
    this._setStyle(t, i, "active", !1);
  }
  setHoverStyle(t, n, i) {
    this._setStyle(t, i, "active", !0);
  }
  _removeDatasetHoverStyle() {
    const t = this._cachedMeta.dataset;
    t && this._setStyle(t, void 0, "active", !1);
  }
  _setDatasetHoverStyle() {
    const t = this._cachedMeta.dataset;
    t && this._setStyle(t, void 0, "active", !0);
  }
  _resyncElements(t) {
    const n = this._data,
      i = this._cachedMeta.data;
    for (const [l, a, u] of this._syncList) this[l](a, u);
    this._syncList = [];
    const r = i.length,
      s = n.length,
      o = Math.min(s, r);
    o && this.parse(0, o),
      s > r
        ? this._insertElements(r, s - r, t)
        : s < r && this._removeElements(s, r - s);
  }
  _insertElements(t, n, i = !0) {
    const r = this._cachedMeta,
      s = r.data,
      o = t + n;
    let l;
    const a = (u) => {
      for (u.length += n, l = u.length - 1; l >= o; l--) u[l] = u[l - n];
    };
    for (a(s), l = t; l < o; ++l) s[l] = new this.dataElementType();
    this._parsing && a(r._parsed),
      this.parse(t, n),
      i && this.updateElements(s, t, n, "reset");
  }
  updateElements(t, n, i, r) {}
  _removeElements(t, n) {
    const i = this._cachedMeta;
    if (this._parsing) {
      const r = i._parsed.splice(t, n);
      i._stacked && Or(i, r);
    }
    i.data.splice(t, n);
  }
  _sync(t) {
    if (this._parsing) this._syncList.push(t);
    else {
      const [n, i, r] = t;
      this[n](i, r);
    }
    this.chart._dataChanges.push([this.index, ...t]);
  }
  _onDataPush() {
    const t = arguments.length;
    this._sync(["_insertElements", this.getDataset().data.length - t, t]);
  }
  _onDataPop() {
    this._sync(["_removeElements", this._cachedMeta.data.length - 1, 1]);
  }
  _onDataShift() {
    this._sync(["_removeElements", 0, 1]);
  }
  _onDataSplice(t, n) {
    n && this._sync(["_removeElements", t, n]);
    const i = arguments.length - 2;
    i && this._sync(["_insertElements", t, i]);
  }
  _onDataUnshift() {
    this._sync(["_insertElements", 0, arguments.length]);
  }
}
Y(rs, "defaults", {}),
  Y(rs, "datasetElementType", null),
  Y(rs, "dataElementType", null);
class Ko extends rs {
  initialize() {
    (this.enableOptionSharing = !0),
      (this.supportsDecimation = !0),
      super.initialize();
  }
  update(t) {
    const n = this._cachedMeta,
      { dataset: i, data: r = [], _dataset: s } = n,
      o = this.chart._animationsDisabled;
    let { start: l, count: a } = Bb(n, r, o);
    (this._drawStart = l),
      (this._drawCount = a),
      Hb(n) && ((l = 0), (a = r.length)),
      (i._chart = this.chart),
      (i._datasetIndex = this.index),
      (i._decimated = !!s._decimated),
      (i.points = r);
    const u = this.resolveDatasetElementOptions(t);
    this.options.showLine || (u.borderWidth = 0),
      (u.segment = this.options.segment),
      this.updateElement(i, void 0, { animated: !o, options: u }, t),
      this.updateElements(r, l, a, t);
  }
  updateElements(t, n, i, r) {
    const s = r === "reset",
      { iScale: o, vScale: l, _stacked: a, _dataset: u } = this._cachedMeta,
      { sharedOptions: c, includeOptions: f } = this._getSharedOptions(n, r),
      d = o.axis,
      h = l.axis,
      { spanGaps: m, segment: v } = this.options,
      _ = Os(m) ? m : Number.POSITIVE_INFINITY,
      g = this.chart._animationsDisabled || s || r === "none",
      y = n + i,
      w = t.length;
    let E = n > 0 && this.getParsed(n - 1);
    for (let k = 0; k < w; ++k) {
      const P = t[k],
        C = g ? P : {};
      if (k < n || k >= y) {
        C.skip = !0;
        continue;
      }
      const N = this.getParsed(k),
        I = pe(N[h]),
        D = (C[d] = o.getPixelForValue(N[d], k)),
        F = (C[h] =
          s || I
            ? l.getBasePixel()
            : l.getPixelForValue(a ? this.applyStack(l, N, a) : N[h], k));
      (C.skip = isNaN(D) || isNaN(F) || I),
        (C.stop = k > 0 && Math.abs(N[d] - E[d]) > _),
        v && ((C.parsed = N), (C.raw = u.data[k])),
        f &&
          (C.options =
            c || this.resolveDataElementOptions(k, P.active ? "active" : r)),
        g || this.updateElement(P, k, C, r),
        (E = N);
    }
  }
  getMaxOverflow() {
    const t = this._cachedMeta,
      n = t.dataset,
      i = (n.options && n.options.borderWidth) || 0,
      r = t.data || [];
    if (!r.length) return i;
    const s = r[0].size(this.resolveDataElementOptions(0)),
      o = r[r.length - 1].size(this.resolveDataElementOptions(r.length - 1));
    return Math.max(i, s, o) / 2;
  }
  draw() {
    const t = this._cachedMeta;
    t.dataset.updateControlPoints(this.chart.chartArea, t.iScale.axis),
      super.draw();
  }
}
Y(Ko, "id", "line"),
  Y(Ko, "defaults", {
    datasetElementType: "line",
    dataElementType: "point",
    showLine: !0,
    spanGaps: !1,
  }),
  Y(Ko, "overrides", {
    scales: { _index_: { type: "category" }, _value_: { type: "linear" } },
  });
function ei() {
  throw new Error(
    "This method is not implemented: Check that a complete date adapter is provided."
  );
}
class Uf {
  constructor(t) {
    Y(this, "options");
    this.options = t || {};
  }
  static override(t) {
    Object.assign(Uf.prototype, t);
  }
  init() {}
  formats() {
    return ei();
  }
  parse() {
    return ei();
  }
  format() {
    return ei();
  }
  add() {
    return ei();
  }
  diff() {
    return ei();
  }
  startOf() {
    return ei();
  }
  endOf() {
    return ei();
  }
}
var ik = { _date: Uf };
function rk(e, t, n, i) {
  const { controller: r, data: s, _sorted: o } = e,
    l = r._cachedMeta.iScale;
  if (l && t === l.axis && t !== "r" && o && s.length) {
    const a = l._reversePixels ? Ib : ui;
    if (i) {
      if (r._sharedOptions) {
        const u = s[0],
          c = typeof u.getRange == "function" && u.getRange(t);
        if (c) {
          const f = a(s, t, n - c),
            d = a(s, t, n + c);
          return { lo: f.lo, hi: d.hi };
        }
      }
    } else return a(s, t, n);
  }
  return { lo: 0, hi: s.length - 1 };
}
function Ws(e, t, n, i, r) {
  const s = e.getSortedVisibleDatasetMetas(),
    o = n[t];
  for (let l = 0, a = s.length; l < a; ++l) {
    const { index: u, data: c } = s[l],
      { lo: f, hi: d } = rk(s[l], t, o, r);
    for (let h = f; h <= d; ++h) {
      const m = c[h];
      m.skip || i(m, u, h);
    }
  }
}
function sk(e) {
  const t = e.indexOf("x") !== -1,
    n = e.indexOf("y") !== -1;
  return function (i, r) {
    const s = t ? Math.abs(i.x - r.x) : 0,
      o = n ? Math.abs(i.y - r.y) : 0;
    return Math.sqrt(Math.pow(s, 2) + Math.pow(o, 2));
  };
}
function tu(e, t, n, i, r) {
  const s = [];
  return (
    (!r && !e.isPointInArea(t)) ||
      Ws(
        e,
        n,
        t,
        function (l, a, u) {
          (!r && !Ns(l, e.chartArea, 0)) ||
            (l.inRange(t.x, t.y, i) &&
              s.push({ element: l, datasetIndex: a, index: u }));
        },
        !0
      ),
    s
  );
}
function ok(e, t, n, i) {
  let r = [];
  function s(o, l, a) {
    const { startAngle: u, endAngle: c } = o.getProps(
        ["startAngle", "endAngle"],
        i
      ),
      { angle: f } = Mb(o, { x: t.x, y: t.y });
    uy(f, u, c) && r.push({ element: o, datasetIndex: l, index: a });
  }
  return Ws(e, n, t, s), r;
}
function lk(e, t, n, i, r, s) {
  let o = [];
  const l = sk(n);
  let a = Number.POSITIVE_INFINITY;
  function u(c, f, d) {
    const h = c.inRange(t.x, t.y, r);
    if (i && !h) return;
    const m = c.getCenterPoint(r);
    if (!(!!s || e.isPointInArea(m)) && !h) return;
    const _ = l(t, m);
    _ < a
      ? ((o = [{ element: c, datasetIndex: f, index: d }]), (a = _))
      : _ === a && o.push({ element: c, datasetIndex: f, index: d });
  }
  return Ws(e, n, t, u), o;
}
function nu(e, t, n, i, r, s) {
  return !s && !e.isPointInArea(t)
    ? []
    : n === "r" && !i
    ? ok(e, t, n, r)
    : lk(e, t, n, i, r, s);
}
function yp(e, t, n, i, r) {
  const s = [],
    o = n === "x" ? "inXRange" : "inYRange";
  let l = !1;
  return (
    Ws(e, n, t, (a, u, c) => {
      a[o] &&
        a[o](t[n], r) &&
        (s.push({ element: a, datasetIndex: u, index: c }),
        (l = l || a.inRange(t.x, t.y, r)));
    }),
    i && !l ? [] : s
  );
}
var ak = {
  evaluateInteractionItems: Ws,
  modes: {
    index(e, t, n, i) {
      const r = Kt(t, e),
        s = n.axis || "x",
        o = n.includeInvisible || !1,
        l = n.intersect ? tu(e, r, s, i, o) : nu(e, r, s, !1, i, o),
        a = [];
      return l.length
        ? (e.getSortedVisibleDatasetMetas().forEach((u) => {
            const c = l[0].index,
              f = u.data[c];
            f &&
              !f.skip &&
              a.push({ element: f, datasetIndex: u.index, index: c });
          }),
          a)
        : [];
    },
    dataset(e, t, n, i) {
      const r = Kt(t, e),
        s = n.axis || "xy",
        o = n.includeInvisible || !1;
      let l = n.intersect ? tu(e, r, s, i, o) : nu(e, r, s, !1, i, o);
      if (l.length > 0) {
        const a = l[0].datasetIndex,
          u = e.getDatasetMeta(a).data;
        l = [];
        for (let c = 0; c < u.length; ++c)
          l.push({ element: u[c], datasetIndex: a, index: c });
      }
      return l;
    },
    point(e, t, n, i) {
      const r = Kt(t, e),
        s = n.axis || "xy",
        o = n.includeInvisible || !1;
      return tu(e, r, s, i, o);
    },
    nearest(e, t, n, i) {
      const r = Kt(t, e),
        s = n.axis || "xy",
        o = n.includeInvisible || !1;
      return nu(e, r, s, n.intersect, i, o);
    },
    x(e, t, n, i) {
      const r = Kt(t, e);
      return yp(e, r, "x", n.intersect, i);
    },
    y(e, t, n, i) {
      const r = Kt(t, e);
      return yp(e, r, "y", n.intersect, i);
    },
  },
};
const Py = ["left", "top", "right", "bottom"];
function Nr(e, t) {
  return e.filter((n) => n.pos === t);
}
function vp(e, t) {
  return e.filter((n) => Py.indexOf(n.pos) === -1 && n.box.axis === t);
}
function Mr(e, t) {
  return e.sort((n, i) => {
    const r = t ? i : n,
      s = t ? n : i;
    return r.weight === s.weight ? r.index - s.index : r.weight - s.weight;
  });
}
function uk(e) {
  const t = [];
  let n, i, r, s, o, l;
  for (n = 0, i = (e || []).length; n < i; ++n)
    (r = e[n]),
      ({
        position: s,
        options: { stack: o, stackWeight: l = 1 },
      } = r),
      t.push({
        index: n,
        box: r,
        pos: s,
        horizontal: r.isHorizontal(),
        weight: r.weight,
        stack: o && s + o,
        stackWeight: l,
      });
  return t;
}
function ck(e) {
  const t = {};
  for (const n of e) {
    const { stack: i, pos: r, stackWeight: s } = n;
    if (!i || !Py.includes(r)) continue;
    const o = t[i] || (t[i] = { count: 0, placed: 0, weight: 0, size: 0 });
    o.count++, (o.weight += s);
  }
  return t;
}
function fk(e, t) {
  const n = ck(e),
    { vBoxMaxWidth: i, hBoxMaxHeight: r } = t;
  let s, o, l;
  for (s = 0, o = e.length; s < o; ++s) {
    l = e[s];
    const { fullSize: a } = l.box,
      u = n[l.stack],
      c = u && l.stackWeight / u.weight;
    l.horizontal
      ? ((l.width = c ? c * i : a && t.availableWidth), (l.height = r))
      : ((l.width = i), (l.height = c ? c * r : a && t.availableHeight));
  }
  return n;
}
function dk(e) {
  const t = uk(e),
    n = Mr(
      t.filter((u) => u.box.fullSize),
      !0
    ),
    i = Mr(Nr(t, "left"), !0),
    r = Mr(Nr(t, "right")),
    s = Mr(Nr(t, "top"), !0),
    o = Mr(Nr(t, "bottom")),
    l = vp(t, "x"),
    a = vp(t, "y");
  return {
    fullSize: n,
    leftAndTop: i.concat(s),
    rightAndBottom: r.concat(a).concat(o).concat(l),
    chartArea: Nr(t, "chartArea"),
    vertical: i.concat(r).concat(a),
    horizontal: s.concat(o).concat(l),
  };
}
function xp(e, t, n, i) {
  return Math.max(e[n], t[n]) + Math.max(e[i], t[i]);
}
function Oy(e, t) {
  (e.top = Math.max(e.top, t.top)),
    (e.left = Math.max(e.left, t.left)),
    (e.bottom = Math.max(e.bottom, t.bottom)),
    (e.right = Math.max(e.right, t.right));
}
function hk(e, t, n, i) {
  const { pos: r, box: s } = n,
    o = e.maxPadding;
  if (!te(r)) {
    n.size && (e[r] -= n.size);
    const f = i[n.stack] || { size: 0, count: 1 };
    (f.size = Math.max(f.size, n.horizontal ? s.height : s.width)),
      (n.size = f.size / f.count),
      (e[r] += n.size);
  }
  s.getPadding && Oy(o, s.getPadding());
  const l = Math.max(0, t.outerWidth - xp(o, e, "left", "right")),
    a = Math.max(0, t.outerHeight - xp(o, e, "top", "bottom")),
    u = l !== e.w,
    c = a !== e.h;
  return (
    (e.w = l),
    (e.h = a),
    n.horizontal ? { same: u, other: c } : { same: c, other: u }
  );
}
function pk(e) {
  const t = e.maxPadding;
  function n(i) {
    const r = Math.max(t[i] - e[i], 0);
    return (e[i] += r), r;
  }
  (e.y += n("top")), (e.x += n("left")), n("right"), n("bottom");
}
function mk(e, t) {
  const n = t.maxPadding;
  function i(r) {
    const s = { left: 0, top: 0, right: 0, bottom: 0 };
    return (
      r.forEach((o) => {
        s[o] = Math.max(t[o], n[o]);
      }),
      s
    );
  }
  return i(e ? ["left", "right"] : ["top", "bottom"]);
}
function Hr(e, t, n, i) {
  const r = [];
  let s, o, l, a, u, c;
  for (s = 0, o = e.length, u = 0; s < o; ++s) {
    (l = e[s]),
      (a = l.box),
      a.update(l.width || t.w, l.height || t.h, mk(l.horizontal, t));
    const { same: f, other: d } = hk(t, n, l, i);
    (u |= f && r.length), (c = c || d), a.fullSize || r.push(l);
  }
  return (u && Hr(r, t, n, i)) || c;
}
function ko(e, t, n, i, r) {
  (e.top = n),
    (e.left = t),
    (e.right = t + i),
    (e.bottom = n + r),
    (e.width = i),
    (e.height = r);
}
function _p(e, t, n, i) {
  const r = n.padding;
  let { x: s, y: o } = t;
  for (const l of e) {
    const a = l.box,
      u = i[l.stack] || { count: 1, placed: 0, weight: 1 },
      c = l.stackWeight / u.weight || 1;
    if (l.horizontal) {
      const f = t.w * c,
        d = u.size || a.height;
      Ol(u.start) && (o = u.start),
        a.fullSize
          ? ko(a, r.left, o, n.outerWidth - r.right - r.left, d)
          : ko(a, t.left + u.placed, o, f, d),
        (u.start = o),
        (u.placed += f),
        (o = a.bottom);
    } else {
      const f = t.h * c,
        d = u.size || a.width;
      Ol(u.start) && (s = u.start),
        a.fullSize
          ? ko(a, s, r.top, d, n.outerHeight - r.bottom - r.top)
          : ko(a, s, t.top + u.placed, d, f),
        (u.start = s),
        (u.placed += f),
        (s = a.right);
    }
  }
  (t.x = s), (t.y = o);
}
var wt = {
  addBox(e, t) {
    e.boxes || (e.boxes = []),
      (t.fullSize = t.fullSize || !1),
      (t.position = t.position || "top"),
      (t.weight = t.weight || 0),
      (t._layers =
        t._layers ||
        function () {
          return [
            {
              z: 0,
              draw(n) {
                t.draw(n);
              },
            },
          ];
        }),
      e.boxes.push(t);
  },
  removeBox(e, t) {
    const n = e.boxes ? e.boxes.indexOf(t) : -1;
    n !== -1 && e.boxes.splice(n, 1);
  },
  configure(e, t, n) {
    (t.fullSize = n.fullSize), (t.position = n.position), (t.weight = n.weight);
  },
  update(e, t, n, i) {
    if (!e) return;
    const r = Tt(e.options.layout.padding),
      s = Math.max(t - r.width, 0),
      o = Math.max(n - r.height, 0),
      l = dk(e.boxes),
      a = l.vertical,
      u = l.horizontal;
    Q(e.boxes, (v) => {
      typeof v.beforeLayout == "function" && v.beforeLayout();
    });
    const c =
        a.reduce(
          (v, _) => (_.box.options && _.box.options.display === !1 ? v : v + 1),
          0
        ) || 1,
      f = Object.freeze({
        outerWidth: t,
        outerHeight: n,
        padding: r,
        availableWidth: s,
        availableHeight: o,
        vBoxMaxWidth: s / 2 / c,
        hBoxMaxHeight: o / 2,
      }),
      d = Object.assign({}, r);
    Oy(d, Tt(i));
    const h = Object.assign(
        { maxPadding: d, w: s, h: o, x: r.left, y: r.top },
        r
      ),
      m = fk(a.concat(u), f);
    Hr(l.fullSize, h, f, m),
      Hr(a, h, f, m),
      Hr(u, h, f, m) && Hr(a, h, f, m),
      pk(h),
      _p(l.leftAndTop, h, f, m),
      (h.x += h.w),
      (h.y += h.h),
      _p(l.rightAndBottom, h, f, m),
      (e.chartArea = {
        left: h.left,
        top: h.top,
        right: h.left + h.w,
        bottom: h.top + h.h,
        height: h.h,
        width: h.w,
      }),
      Q(l.chartArea, (v) => {
        const _ = v.box;
        Object.assign(_, e.chartArea),
          _.update(h.w, h.h, { left: 0, top: 0, right: 0, bottom: 0 });
      });
  },
};
class Ny {
  acquireContext(t, n) {}
  releaseContext(t) {
    return !1;
  }
  addEventListener(t, n, i) {}
  removeEventListener(t, n, i) {}
  getDevicePixelRatio() {
    return 1;
  }
  getMaximumSize(t, n, i, r) {
    return (
      (n = Math.max(0, n || t.width)),
      (i = i || t.height),
      { width: n, height: Math.max(0, r ? Math.floor(n / r) : i) }
    );
  }
  isAttached(t) {
    return !0;
  }
  updateConfig(t) {}
}
class gk extends Ny {
  acquireContext(t) {
    return (t && t.getContext && t.getContext("2d")) || null;
  }
  updateConfig(t) {
    t.options.animation = !1;
  }
}
const qo = "$chartjs",
  yk = {
    touchstart: "mousedown",
    touchmove: "mousemove",
    touchend: "mouseup",
    pointerenter: "mouseenter",
    pointerdown: "mousedown",
    pointermove: "mousemove",
    pointerup: "mouseup",
    pointerleave: "mouseout",
    pointerout: "mouseout",
  },
  wp = (e) => e === null || e === "";
function vk(e, t) {
  const n = e.style,
    i = e.getAttribute("height"),
    r = e.getAttribute("width");
  if (
    ((e[qo] = {
      initial: {
        height: i,
        width: r,
        style: { display: n.display, height: n.height, width: n.width },
      },
    }),
    (n.display = n.display || "block"),
    (n.boxSizing = n.boxSizing || "border-box"),
    wp(r))
  ) {
    const s = lp(e, "width");
    s !== void 0 && (e.width = s);
  }
  if (wp(i))
    if (e.style.height === "") e.height = e.width / (t || 2);
    else {
      const s = lp(e, "height");
      s !== void 0 && (e.height = s);
    }
  return e;
}
const My = NE ? { passive: !0 } : !1;
function xk(e, t, n) {
  e && e.addEventListener(t, n, My);
}
function _k(e, t, n) {
  e && e.canvas && e.canvas.removeEventListener(t, n, My);
}
function wk(e, t) {
  const n = yk[e.type] || e.type,
    { x: i, y: r } = Kt(e, t);
  return {
    type: n,
    chart: t,
    native: e,
    x: i !== void 0 ? i : null,
    y: r !== void 0 ? r : null,
  };
}
function Rl(e, t) {
  for (const n of e) if (n === t || n.contains(t)) return !0;
}
function Sk(e, t, n) {
  const i = e.canvas,
    r = new MutationObserver((s) => {
      let o = !1;
      for (const l of s)
        (o = o || Rl(l.addedNodes, i)), (o = o && !Rl(l.removedNodes, i));
      o && n();
    });
  return r.observe(document, { childList: !0, subtree: !0 }), r;
}
function bk(e, t, n) {
  const i = e.canvas,
    r = new MutationObserver((s) => {
      let o = !1;
      for (const l of s)
        (o = o || Rl(l.removedNodes, i)), (o = o && !Rl(l.addedNodes, i));
      o && n();
    });
  return r.observe(document, { childList: !0, subtree: !0 }), r;
}
const Rs = new Map();
let Sp = 0;
function Ry() {
  const e = window.devicePixelRatio;
  e !== Sp &&
    ((Sp = e),
    Rs.forEach((t, n) => {
      n.currentDevicePixelRatio !== e && t();
    }));
}
function Ek(e, t) {
  Rs.size || window.addEventListener("resize", Ry), Rs.set(e, t);
}
function kk(e) {
  Rs.delete(e), Rs.size || window.removeEventListener("resize", Ry);
}
function Tk(e, t, n) {
  const i = e.canvas,
    r = i && Hf(i);
  if (!r) return;
  const s = dy((l, a) => {
      const u = r.clientWidth;
      n(l, a), u < r.clientWidth && n();
    }, window),
    o = new ResizeObserver((l) => {
      const a = l[0],
        u = a.contentRect.width,
        c = a.contentRect.height;
      (u === 0 && c === 0) || s(u, c);
    });
  return o.observe(r), Ek(e, s), o;
}
function iu(e, t, n) {
  n && n.disconnect(), t === "resize" && kk(e);
}
function Ck(e, t, n) {
  const i = e.canvas,
    r = dy((s) => {
      e.ctx !== null && n(wk(s, e));
    }, e);
  return xk(i, t, r), r;
}
class Pk extends Ny {
  acquireContext(t, n) {
    const i = t && t.getContext && t.getContext("2d");
    return i && i.canvas === t ? (vk(t, n), i) : null;
  }
  releaseContext(t) {
    const n = t.canvas;
    if (!n[qo]) return !1;
    const i = n[qo].initial;
    ["height", "width"].forEach((s) => {
      const o = i[s];
      pe(o) ? n.removeAttribute(s) : n.setAttribute(s, o);
    });
    const r = i.style || {};
    return (
      Object.keys(r).forEach((s) => {
        n.style[s] = r[s];
      }),
      (n.width = n.width),
      delete n[qo],
      !0
    );
  }
  addEventListener(t, n, i) {
    this.removeEventListener(t, n);
    const r = t.$proxies || (t.$proxies = {}),
      o = { attach: Sk, detach: bk, resize: Tk }[n] || Ck;
    r[n] = o(t, n, i);
  }
  removeEventListener(t, n) {
    const i = t.$proxies || (t.$proxies = {}),
      r = i[n];
    if (!r) return;
    (({ attach: iu, detach: iu, resize: iu })[n] || _k)(t, n, r),
      (i[n] = void 0);
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }
  getMaximumSize(t, n, i, r) {
    return OE(t, n, i, r);
  }
  isAttached(t) {
    const n = t && Hf(t);
    return !!(n && n.isConnected);
  }
}
function Ok(e) {
  return !Bf() || (typeof OffscreenCanvas < "u" && e instanceof OffscreenCanvas)
    ? gk
    : Pk;
}
class mn {
  constructor() {
    Y(this, "x");
    Y(this, "y");
    Y(this, "active", !1);
    Y(this, "options");
    Y(this, "$animations");
  }
  tooltipPosition(t) {
    const { x: n, y: i } = this.getProps(["x", "y"], t);
    return { x: n, y: i };
  }
  hasValue() {
    return Os(this.x) && Os(this.y);
  }
  getProps(t, n) {
    const i = this.$animations;
    if (!n || !i) return this;
    const r = {};
    return (
      t.forEach((s) => {
        r[s] = i[s] && i[s].active() ? i[s]._to : this[s];
      }),
      r
    );
  }
}
Y(mn, "defaults", {}), Y(mn, "defaultRoutes");
function Nk(e, t) {
  const n = e.options.ticks,
    i = Mk(e),
    r = Math.min(n.maxTicksLimit || i, i),
    s = n.major.enabled ? Lk(t) : [],
    o = s.length,
    l = s[0],
    a = s[o - 1],
    u = [];
  if (o > r) return Ik(t, u, s, o / r), u;
  const c = Rk(s, t, r);
  if (o > 0) {
    let f, d;
    const h = o > 1 ? Math.round((a - l) / (o - 1)) : null;
    for (To(t, u, c, pe(h) ? 0 : l - h, l), f = 0, d = o - 1; f < d; f++)
      To(t, u, c, s[f], s[f + 1]);
    return To(t, u, c, a, pe(h) ? t.length : a + h), u;
  }
  return To(t, u, c), u;
}
function Mk(e) {
  const t = e.options.offset,
    n = e._tickSize(),
    i = e._length / n + (t ? 0 : 1),
    r = e._maxLength / n;
  return Math.floor(Math.min(i, r));
}
function Rk(e, t, n) {
  const i = Dk(e),
    r = t.length / n;
  if (!i) return Math.max(r, 1);
  const s = Cb(i);
  for (let o = 0, l = s.length - 1; o < l; o++) {
    const a = s[o];
    if (a > r) return a;
  }
  return Math.max(r, 1);
}
function Lk(e) {
  const t = [];
  let n, i;
  for (n = 0, i = e.length; n < i; n++) e[n].major && t.push(n);
  return t;
}
function Ik(e, t, n, i) {
  let r = 0,
    s = n[0],
    o;
  for (i = Math.ceil(i), o = 0; o < e.length; o++)
    o === s && (t.push(e[o]), r++, (s = n[r * i]));
}
function To(e, t, n, i, r) {
  const s = K(i, 0),
    o = Math.min(K(r, e.length), e.length);
  let l = 0,
    a,
    u,
    c;
  for (
    n = Math.ceil(n), r && ((a = r - i), (n = a / Math.floor(a / n))), c = s;
    c < 0;

  )
    l++, (c = Math.round(s + l * n));
  for (u = Math.max(s, 0); u < o; u++)
    u === c && (t.push(e[u]), l++, (c = Math.round(s + l * n)));
}
function Dk(e) {
  const t = e.length;
  let n, i;
  if (t < 2) return !1;
  for (i = e[0], n = 1; n < t; ++n) if (e[n] - e[n - 1] !== i) return !1;
  return i;
}
const Ak = (e) => (e === "left" ? "right" : e === "right" ? "left" : e),
  bp = (e, t, n) => (t === "top" || t === "left" ? e[t] + n : e[t] - n),
  Ep = (e, t) => Math.min(t || e, e);
function kp(e, t) {
  const n = [],
    i = e.length / t,
    r = e.length;
  let s = 0;
  for (; s < r; s += i) n.push(e[Math.floor(s)]);
  return n;
}
function jk(e, t, n) {
  const i = e.ticks.length,
    r = Math.min(t, i - 1),
    s = e._startPixel,
    o = e._endPixel,
    l = 1e-6;
  let a = e.getPixelForTick(r),
    u;
  if (
    !(
      n &&
      (i === 1
        ? (u = Math.max(a - s, o - a))
        : t === 0
        ? (u = (e.getPixelForTick(1) - a) / 2)
        : (u = (a - e.getPixelForTick(r - 1)) / 2),
      (a += r < t ? u : -u),
      a < s - l || a > o + l)
    )
  )
    return a;
}
function zk(e, t) {
  Q(e, (n) => {
    const i = n.gc,
      r = i.length / 2;
    let s;
    if (r > t) {
      for (s = 0; s < r; ++s) delete n.data[i[s]];
      i.splice(0, r);
    }
  });
}
function Rr(e) {
  return e.drawTicks ? e.tickLength : 0;
}
function Tp(e, t) {
  if (!e.display) return 0;
  const n = He(e.font, t),
    i = Tt(e.padding);
  return (Oe(e.text) ? e.text.length : 1) * n.lineHeight + i.height;
}
function Fk(e, t) {
  return Ti(e, { scale: t, type: "scale" });
}
function Bk(e, t, n) {
  return Ti(e, { tick: n, index: t, type: "tick" });
}
function Hk(e, t, n) {
  let i = Lf(e);
  return ((n && t !== "right") || (!n && t === "right")) && (i = Ak(i)), i;
}
function Uk(e, t, n, i) {
  const { top: r, left: s, bottom: o, right: l, chart: a } = e,
    { chartArea: u, scales: c } = a;
  let f = 0,
    d,
    h,
    m;
  const v = o - r,
    _ = l - s;
  if (e.isHorizontal()) {
    if (((h = Fe(i, s, l)), te(n))) {
      const g = Object.keys(n)[0],
        y = n[g];
      m = c[g].getPixelForValue(y) + v - t;
    } else
      n === "center" ? (m = (u.bottom + u.top) / 2 + v - t) : (m = bp(e, n, t));
    d = l - s;
  } else {
    if (te(n)) {
      const g = Object.keys(n)[0],
        y = n[g];
      h = c[g].getPixelForValue(y) - _ + t;
    } else
      n === "center" ? (h = (u.left + u.right) / 2 - _ + t) : (h = bp(e, n, t));
    (m = Fe(i, o, r)), (f = n === "left" ? -Lt : Lt);
  }
  return { titleX: h, titleY: m, maxWidth: d, rotation: f };
}
class cr extends mn {
  constructor(t) {
    super(),
      (this.id = t.id),
      (this.type = t.type),
      (this.options = void 0),
      (this.ctx = t.ctx),
      (this.chart = t.chart),
      (this.top = void 0),
      (this.bottom = void 0),
      (this.left = void 0),
      (this.right = void 0),
      (this.width = void 0),
      (this.height = void 0),
      (this._margins = { left: 0, right: 0, top: 0, bottom: 0 }),
      (this.maxWidth = void 0),
      (this.maxHeight = void 0),
      (this.paddingTop = void 0),
      (this.paddingBottom = void 0),
      (this.paddingLeft = void 0),
      (this.paddingRight = void 0),
      (this.axis = void 0),
      (this.labelRotation = void 0),
      (this.min = void 0),
      (this.max = void 0),
      (this._range = void 0),
      (this.ticks = []),
      (this._gridLineItems = null),
      (this._labelItems = null),
      (this._labelSizes = null),
      (this._length = 0),
      (this._maxLength = 0),
      (this._longestTextCache = {}),
      (this._startPixel = void 0),
      (this._endPixel = void 0),
      (this._reversePixels = !1),
      (this._userMax = void 0),
      (this._userMin = void 0),
      (this._suggestedMax = void 0),
      (this._suggestedMin = void 0),
      (this._ticksLength = 0),
      (this._borderValue = 0),
      (this._cache = {}),
      (this._dataLimitsCached = !1),
      (this.$context = void 0);
  }
  init(t) {
    (this.options = t.setContext(this.getContext())),
      (this.axis = t.axis),
      (this._userMin = this.parse(t.min)),
      (this._userMax = this.parse(t.max)),
      (this._suggestedMin = this.parse(t.suggestedMin)),
      (this._suggestedMax = this.parse(t.suggestedMax));
  }
  parse(t, n) {
    return t;
  }
  getUserBounds() {
    let { _userMin: t, _userMax: n, _suggestedMin: i, _suggestedMax: r } = this;
    return (
      (t = Wt(t, Number.POSITIVE_INFINITY)),
      (n = Wt(n, Number.NEGATIVE_INFINITY)),
      (i = Wt(i, Number.POSITIVE_INFINITY)),
      (r = Wt(r, Number.NEGATIVE_INFINITY)),
      { min: Wt(t, i), max: Wt(n, r), minDefined: kt(t), maxDefined: kt(n) }
    );
  }
  getMinMax(t) {
    let { min: n, max: i, minDefined: r, maxDefined: s } = this.getUserBounds(),
      o;
    if (r && s) return { min: n, max: i };
    const l = this.getMatchingVisibleMetas();
    for (let a = 0, u = l.length; a < u; ++a)
      (o = l[a].controller.getMinMax(this, t)),
        r || (n = Math.min(n, o.min)),
        s || (i = Math.max(i, o.max));
    return (
      (n = s && n > i ? i : n),
      (i = r && n > i ? n : i),
      { min: Wt(n, Wt(i, n)), max: Wt(i, Wt(n, i)) }
    );
  }
  getPadding() {
    return {
      left: this.paddingLeft || 0,
      top: this.paddingTop || 0,
      right: this.paddingRight || 0,
      bottom: this.paddingBottom || 0,
    };
  }
  getTicks() {
    return this.ticks;
  }
  getLabels() {
    const t = this.chart.data;
    return (
      this.options.labels ||
      (this.isHorizontal() ? t.xLabels : t.yLabels) ||
      t.labels ||
      []
    );
  }
  getLabelItems(t = this.chart.chartArea) {
    return this._labelItems || (this._labelItems = this._computeLabelItems(t));
  }
  beforeLayout() {
    (this._cache = {}), (this._dataLimitsCached = !1);
  }
  beforeUpdate() {
    W(this.options.beforeUpdate, [this]);
  }
  update(t, n, i) {
    const { beginAtZero: r, grace: s, ticks: o } = this.options,
      l = o.sampleSize;
    this.beforeUpdate(),
      (this.maxWidth = t),
      (this.maxHeight = n),
      (this._margins = i =
        Object.assign({ left: 0, right: 0, top: 0, bottom: 0 }, i)),
      (this.ticks = null),
      (this._labelSizes = null),
      (this._gridLineItems = null),
      (this._labelItems = null),
      this.beforeSetDimensions(),
      this.setDimensions(),
      this.afterSetDimensions(),
      (this._maxLength = this.isHorizontal()
        ? this.width + i.left + i.right
        : this.height + i.top + i.bottom),
      this._dataLimitsCached ||
        (this.beforeDataLimits(),
        this.determineDataLimits(),
        this.afterDataLimits(),
        (this._range = lE(this, s, r)),
        (this._dataLimitsCached = !0)),
      this.beforeBuildTicks(),
      (this.ticks = this.buildTicks() || []),
      this.afterBuildTicks();
    const a = l < this.ticks.length;
    this._convertTicksToLabels(a ? kp(this.ticks, l) : this.ticks),
      this.configure(),
      this.beforeCalculateLabelRotation(),
      this.calculateLabelRotation(),
      this.afterCalculateLabelRotation(),
      o.display &&
        (o.autoSkip || o.source === "auto") &&
        ((this.ticks = Nk(this, this.ticks)),
        (this._labelSizes = null),
        this.afterAutoSkip()),
      a && this._convertTicksToLabels(this.ticks),
      this.beforeFit(),
      this.fit(),
      this.afterFit(),
      this.afterUpdate();
  }
  configure() {
    let t = this.options.reverse,
      n,
      i;
    this.isHorizontal()
      ? ((n = this.left), (i = this.right))
      : ((n = this.top), (i = this.bottom), (t = !t)),
      (this._startPixel = n),
      (this._endPixel = i),
      (this._reversePixels = t),
      (this._length = i - n),
      (this._alignToPixels = this.options.alignToPixels);
  }
  afterUpdate() {
    W(this.options.afterUpdate, [this]);
  }
  beforeSetDimensions() {
    W(this.options.beforeSetDimensions, [this]);
  }
  setDimensions() {
    this.isHorizontal()
      ? ((this.width = this.maxWidth),
        (this.left = 0),
        (this.right = this.width))
      : ((this.height = this.maxHeight),
        (this.top = 0),
        (this.bottom = this.height)),
      (this.paddingLeft = 0),
      (this.paddingTop = 0),
      (this.paddingRight = 0),
      (this.paddingBottom = 0);
  }
  afterSetDimensions() {
    W(this.options.afterSetDimensions, [this]);
  }
  _callHooks(t) {
    this.chart.notifyPlugins(t, this.getContext()), W(this.options[t], [this]);
  }
  beforeDataLimits() {
    this._callHooks("beforeDataLimits");
  }
  determineDataLimits() {}
  afterDataLimits() {
    this._callHooks("afterDataLimits");
  }
  beforeBuildTicks() {
    this._callHooks("beforeBuildTicks");
  }
  buildTicks() {
    return [];
  }
  afterBuildTicks() {
    this._callHooks("afterBuildTicks");
  }
  beforeTickToLabelConversion() {
    W(this.options.beforeTickToLabelConversion, [this]);
  }
  generateTickLabels(t) {
    const n = this.options.ticks;
    let i, r, s;
    for (i = 0, r = t.length; i < r; i++)
      (s = t[i]), (s.label = W(n.callback, [s.value, i, t], this));
  }
  afterTickToLabelConversion() {
    W(this.options.afterTickToLabelConversion, [this]);
  }
  beforeCalculateLabelRotation() {
    W(this.options.beforeCalculateLabelRotation, [this]);
  }
  calculateLabelRotation() {
    const t = this.options,
      n = t.ticks,
      i = Ep(this.ticks.length, t.ticks.maxTicksLimit),
      r = n.minRotation || 0,
      s = n.maxRotation;
    let o = r,
      l,
      a,
      u;
    if (
      !this._isVisible() ||
      !n.display ||
      r >= s ||
      i <= 1 ||
      !this.isHorizontal()
    ) {
      this.labelRotation = r;
      return;
    }
    const c = this._getLabelSizes(),
      f = c.widest.width,
      d = c.highest.height,
      h = _t(this.chart.width - f, 0, this.maxWidth);
    (l = t.offset ? this.maxWidth / i : h / (i - 1)),
      f + 6 > l &&
        ((l = h / (i - (t.offset ? 0.5 : 1))),
        (a =
          this.maxHeight -
          Rr(t.grid) -
          n.padding -
          Tp(t.title, this.chart.options.font)),
        (u = Math.sqrt(f * f + d * d)),
        (o = Nb(
          Math.min(
            Math.asin(_t((c.highest.height + 6) / l, -1, 1)),
            Math.asin(_t(a / u, -1, 1)) - Math.asin(_t(d / u, -1, 1))
          )
        )),
        (o = Math.max(r, Math.min(s, o)))),
      (this.labelRotation = o);
  }
  afterCalculateLabelRotation() {
    W(this.options.afterCalculateLabelRotation, [this]);
  }
  afterAutoSkip() {}
  beforeFit() {
    W(this.options.beforeFit, [this]);
  }
  fit() {
    const t = { width: 0, height: 0 },
      {
        chart: n,
        options: { ticks: i, title: r, grid: s },
      } = this,
      o = this._isVisible(),
      l = this.isHorizontal();
    if (o) {
      const a = Tp(r, n.options.font);
      if (
        (l
          ? ((t.width = this.maxWidth), (t.height = Rr(s) + a))
          : ((t.height = this.maxHeight), (t.width = Rr(s) + a)),
        i.display && this.ticks.length)
      ) {
        const {
            first: u,
            last: c,
            widest: f,
            highest: d,
          } = this._getLabelSizes(),
          h = i.padding * 2,
          m = ai(this.labelRotation),
          v = Math.cos(m),
          _ = Math.sin(m);
        if (l) {
          const g = i.mirror ? 0 : _ * f.width + v * d.height;
          t.height = Math.min(this.maxHeight, t.height + g + h);
        } else {
          const g = i.mirror ? 0 : v * f.width + _ * d.height;
          t.width = Math.min(this.maxWidth, t.width + g + h);
        }
        this._calculatePadding(u, c, _, v);
      }
    }
    this._handleMargins(),
      l
        ? ((this.width = this._length =
            n.width - this._margins.left - this._margins.right),
          (this.height = t.height))
        : ((this.width = t.width),
          (this.height = this._length =
            n.height - this._margins.top - this._margins.bottom));
  }
  _calculatePadding(t, n, i, r) {
    const {
        ticks: { align: s, padding: o },
        position: l,
      } = this.options,
      a = this.labelRotation !== 0,
      u = l !== "top" && this.axis === "x";
    if (this.isHorizontal()) {
      const c = this.getPixelForTick(0) - this.left,
        f = this.right - this.getPixelForTick(this.ticks.length - 1);
      let d = 0,
        h = 0;
      a
        ? u
          ? ((d = r * t.width), (h = i * n.height))
          : ((d = i * t.height), (h = r * n.width))
        : s === "start"
        ? (h = n.width)
        : s === "end"
        ? (d = t.width)
        : s !== "inner" && ((d = t.width / 2), (h = n.width / 2)),
        (this.paddingLeft = Math.max(
          ((d - c + o) * this.width) / (this.width - c),
          0
        )),
        (this.paddingRight = Math.max(
          ((h - f + o) * this.width) / (this.width - f),
          0
        ));
    } else {
      let c = n.height / 2,
        f = t.height / 2;
      s === "start"
        ? ((c = 0), (f = t.height))
        : s === "end" && ((c = n.height), (f = 0)),
        (this.paddingTop = c + o),
        (this.paddingBottom = f + o);
    }
  }
  _handleMargins() {
    this._margins &&
      ((this._margins.left = Math.max(this.paddingLeft, this._margins.left)),
      (this._margins.top = Math.max(this.paddingTop, this._margins.top)),
      (this._margins.right = Math.max(this.paddingRight, this._margins.right)),
      (this._margins.bottom = Math.max(
        this.paddingBottom,
        this._margins.bottom
      )));
  }
  afterFit() {
    W(this.options.afterFit, [this]);
  }
  isHorizontal() {
    const { axis: t, position: n } = this.options;
    return n === "top" || n === "bottom" || t === "x";
  }
  isFullSize() {
    return this.options.fullSize;
  }
  _convertTicksToLabels(t) {
    this.beforeTickToLabelConversion(), this.generateTickLabels(t);
    let n, i;
    for (n = 0, i = t.length; n < i; n++)
      pe(t[n].label) && (t.splice(n, 1), i--, n--);
    this.afterTickToLabelConversion();
  }
  _getLabelSizes() {
    let t = this._labelSizes;
    if (!t) {
      const n = this.options.ticks.sampleSize;
      let i = this.ticks;
      n < i.length && (i = kp(i, n)),
        (this._labelSizes = t =
          this._computeLabelSizes(
            i,
            i.length,
            this.options.ticks.maxTicksLimit
          ));
    }
    return t;
  }
  _computeLabelSizes(t, n, i) {
    const { ctx: r, _longestTextCache: s } = this,
      o = [],
      l = [],
      a = Math.floor(n / Ep(n, i));
    let u = 0,
      c = 0,
      f,
      d,
      h,
      m,
      v,
      _,
      g,
      y,
      w,
      E,
      k;
    for (f = 0; f < n; f += a) {
      if (
        ((m = t[f].label),
        (v = this._resolveTickFontOptions(f)),
        (r.font = _ = v.string),
        (g = s[_] = s[_] || { data: {}, gc: [] }),
        (y = v.lineHeight),
        (w = E = 0),
        !pe(m) && !Oe(m))
      )
        (w = np(r, g.data, g.gc, w, m)), (E = y);
      else if (Oe(m))
        for (d = 0, h = m.length; d < h; ++d)
          (k = m[d]),
            !pe(k) && !Oe(k) && ((w = np(r, g.data, g.gc, w, k)), (E += y));
      o.push(w), l.push(E), (u = Math.max(w, u)), (c = Math.max(E, c));
    }
    zk(s, n);
    const P = o.indexOf(u),
      C = l.indexOf(c),
      N = (I) => ({ width: o[I] || 0, height: l[I] || 0 });
    return {
      first: N(0),
      last: N(n - 1),
      widest: N(P),
      highest: N(C),
      widths: o,
      heights: l,
    };
  }
  getLabelForValue(t) {
    return t;
  }
  getPixelForValue(t, n) {
    return NaN;
  }
  getValueForPixel(t) {}
  getPixelForTick(t) {
    const n = this.ticks;
    return t < 0 || t > n.length - 1 ? null : this.getPixelForValue(n[t].value);
  }
  getPixelForDecimal(t) {
    this._reversePixels && (t = 1 - t);
    const n = this._startPixel + t * this._length;
    return Lb(this._alignToPixels ? Jn(this.chart, n, 0) : n);
  }
  getDecimalForPixel(t) {
    const n = (t - this._startPixel) / this._length;
    return this._reversePixels ? 1 - n : n;
  }
  getBasePixel() {
    return this.getPixelForValue(this.getBaseValue());
  }
  getBaseValue() {
    const { min: t, max: n } = this;
    return t < 0 && n < 0 ? n : t > 0 && n > 0 ? t : 0;
  }
  getContext(t) {
    const n = this.ticks || [];
    if (t >= 0 && t < n.length) {
      const i = n[t];
      return i.$context || (i.$context = Bk(this.getContext(), t, i));
    }
    return this.$context || (this.$context = Fk(this.chart.getContext(), this));
  }
  _tickSize() {
    const t = this.options.ticks,
      n = ai(this.labelRotation),
      i = Math.abs(Math.cos(n)),
      r = Math.abs(Math.sin(n)),
      s = this._getLabelSizes(),
      o = t.autoSkipPadding || 0,
      l = s ? s.widest.width + o : 0,
      a = s ? s.highest.height + o : 0;
    return this.isHorizontal()
      ? a * i > l * r
        ? l / i
        : a / r
      : a * r < l * i
      ? a / i
      : l / r;
  }
  _isVisible() {
    const t = this.options.display;
    return t !== "auto" ? !!t : this.getMatchingVisibleMetas().length > 0;
  }
  _computeGridLineItems(t) {
    const n = this.axis,
      i = this.chart,
      r = this.options,
      { grid: s, position: o, border: l } = r,
      a = s.offset,
      u = this.isHorizontal(),
      f = this.ticks.length + (a ? 1 : 0),
      d = Rr(s),
      h = [],
      m = l.setContext(this.getContext()),
      v = m.display ? m.width : 0,
      _ = v / 2,
      g = function (ie) {
        return Jn(i, ie, v);
      };
    let y, w, E, k, P, C, N, I, D, F, B, Z;
    if (o === "top")
      (y = g(this.bottom)),
        (C = this.bottom - d),
        (I = y - _),
        (F = g(t.top) + _),
        (Z = t.bottom);
    else if (o === "bottom")
      (y = g(this.top)),
        (F = t.top),
        (Z = g(t.bottom) - _),
        (C = y + _),
        (I = this.top + d);
    else if (o === "left")
      (y = g(this.right)),
        (P = this.right - d),
        (N = y - _),
        (D = g(t.left) + _),
        (B = t.right);
    else if (o === "right")
      (y = g(this.left)),
        (D = t.left),
        (B = g(t.right) - _),
        (P = y + _),
        (N = this.left + d);
    else if (n === "x") {
      if (o === "center") y = g((t.top + t.bottom) / 2 + 0.5);
      else if (te(o)) {
        const ie = Object.keys(o)[0],
          ae = o[ie];
        y = g(this.chart.scales[ie].getPixelForValue(ae));
      }
      (F = t.top), (Z = t.bottom), (C = y + _), (I = C + d);
    } else if (n === "y") {
      if (o === "center") y = g((t.left + t.right) / 2);
      else if (te(o)) {
        const ie = Object.keys(o)[0],
          ae = o[ie];
        y = g(this.chart.scales[ie].getPixelForValue(ae));
      }
      (P = y - _), (N = P - d), (D = t.left), (B = t.right);
    }
    const X = K(r.ticks.maxTicksLimit, f),
      $ = Math.max(1, Math.ceil(f / X));
    for (w = 0; w < f; w += $) {
      const ie = this.getContext(w),
        ae = s.setContext(ie),
        A = l.setContext(ie),
        H = ae.lineWidth,
        U = ae.color,
        re = A.dash || [],
        ee = A.dashOffset,
        ht = ae.tickWidth,
        Ee = ae.tickColor,
        Ct = ae.tickBorderDash || [],
        Re = ae.tickBorderDashOffset;
      (E = jk(this, w, a)),
        E !== void 0 &&
          ((k = Jn(i, E, H)),
          u ? (P = N = D = B = k) : (C = I = F = Z = k),
          h.push({
            tx1: P,
            ty1: C,
            tx2: N,
            ty2: I,
            x1: D,
            y1: F,
            x2: B,
            y2: Z,
            width: H,
            color: U,
            borderDash: re,
            borderDashOffset: ee,
            tickWidth: ht,
            tickColor: Ee,
            tickBorderDash: Ct,
            tickBorderDashOffset: Re,
          }));
    }
    return (this._ticksLength = f), (this._borderValue = y), h;
  }
  _computeLabelItems(t) {
    const n = this.axis,
      i = this.options,
      { position: r, ticks: s } = i,
      o = this.isHorizontal(),
      l = this.ticks,
      { align: a, crossAlign: u, padding: c, mirror: f } = s,
      d = Rr(i.grid),
      h = d + c,
      m = f ? -c : h,
      v = -ai(this.labelRotation),
      _ = [];
    let g,
      y,
      w,
      E,
      k,
      P,
      C,
      N,
      I,
      D,
      F,
      B,
      Z = "middle";
    if (r === "top")
      (P = this.bottom - m), (C = this._getXAxisLabelAlignment());
    else if (r === "bottom")
      (P = this.top + m), (C = this._getXAxisLabelAlignment());
    else if (r === "left") {
      const $ = this._getYAxisLabelAlignment(d);
      (C = $.textAlign), (k = $.x);
    } else if (r === "right") {
      const $ = this._getYAxisLabelAlignment(d);
      (C = $.textAlign), (k = $.x);
    } else if (n === "x") {
      if (r === "center") P = (t.top + t.bottom) / 2 + h;
      else if (te(r)) {
        const $ = Object.keys(r)[0],
          ie = r[$];
        P = this.chart.scales[$].getPixelForValue(ie) + h;
      }
      C = this._getXAxisLabelAlignment();
    } else if (n === "y") {
      if (r === "center") k = (t.left + t.right) / 2 - h;
      else if (te(r)) {
        const $ = Object.keys(r)[0],
          ie = r[$];
        k = this.chart.scales[$].getPixelForValue(ie);
      }
      C = this._getYAxisLabelAlignment(d).textAlign;
    }
    n === "y" && (a === "start" ? (Z = "top") : a === "end" && (Z = "bottom"));
    const X = this._getLabelSizes();
    for (g = 0, y = l.length; g < y; ++g) {
      (w = l[g]), (E = w.label);
      const $ = s.setContext(this.getContext(g));
      (N = this.getPixelForTick(g) + s.labelOffset),
        (I = this._resolveTickFontOptions(g)),
        (D = I.lineHeight),
        (F = Oe(E) ? E.length : 1);
      const ie = F / 2,
        ae = $.color,
        A = $.textStrokeColor,
        H = $.textStrokeWidth;
      let U = C;
      o
        ? ((k = N),
          C === "inner" &&
            (g === y - 1
              ? (U = this.options.reverse ? "left" : "right")
              : g === 0
              ? (U = this.options.reverse ? "right" : "left")
              : (U = "center")),
          r === "top"
            ? u === "near" || v !== 0
              ? (B = -F * D + D / 2)
              : u === "center"
              ? (B = -X.highest.height / 2 - ie * D + D)
              : (B = -X.highest.height + D / 2)
            : u === "near" || v !== 0
            ? (B = D / 2)
            : u === "center"
            ? (B = X.highest.height / 2 - ie * D)
            : (B = X.highest.height - F * D),
          f && (B *= -1),
          v !== 0 && !$.showLabelBackdrop && (k += (D / 2) * Math.sin(v)))
        : ((P = N), (B = ((1 - F) * D) / 2));
      let re;
      if ($.showLabelBackdrop) {
        const ee = Tt($.backdropPadding),
          ht = X.heights[g],
          Ee = X.widths[g];
        let Ct = B - ee.top,
          Re = 0 - ee.left;
        switch (Z) {
          case "middle":
            Ct -= ht / 2;
            break;
          case "bottom":
            Ct -= ht;
            break;
        }
        switch (C) {
          case "center":
            Re -= Ee / 2;
            break;
          case "right":
            Re -= Ee;
            break;
          case "inner":
            g === y - 1 ? (Re -= Ee) : g > 0 && (Re -= Ee / 2);
            break;
        }
        re = {
          left: Re,
          top: Ct,
          width: Ee + ee.width,
          height: ht + ee.height,
          color: $.backdropColor,
        };
      }
      _.push({
        label: E,
        font: I,
        textOffset: B,
        options: {
          rotation: v,
          color: ae,
          strokeColor: A,
          strokeWidth: H,
          textAlign: U,
          textBaseline: Z,
          translation: [k, P],
          backdrop: re,
        },
      });
    }
    return _;
  }
  _getXAxisLabelAlignment() {
    const { position: t, ticks: n } = this.options;
    if (-ai(this.labelRotation)) return t === "top" ? "left" : "right";
    let r = "center";
    return (
      n.align === "start"
        ? (r = "left")
        : n.align === "end"
        ? (r = "right")
        : n.align === "inner" && (r = "inner"),
      r
    );
  }
  _getYAxisLabelAlignment(t) {
    const {
        position: n,
        ticks: { crossAlign: i, mirror: r, padding: s },
      } = this.options,
      o = this._getLabelSizes(),
      l = t + s,
      a = o.widest.width;
    let u, c;
    return (
      n === "left"
        ? r
          ? ((c = this.right + s),
            i === "near"
              ? (u = "left")
              : i === "center"
              ? ((u = "center"), (c += a / 2))
              : ((u = "right"), (c += a)))
          : ((c = this.right - l),
            i === "near"
              ? (u = "right")
              : i === "center"
              ? ((u = "center"), (c -= a / 2))
              : ((u = "left"), (c = this.left)))
        : n === "right"
        ? r
          ? ((c = this.left + s),
            i === "near"
              ? (u = "right")
              : i === "center"
              ? ((u = "center"), (c -= a / 2))
              : ((u = "left"), (c -= a)))
          : ((c = this.left + l),
            i === "near"
              ? (u = "left")
              : i === "center"
              ? ((u = "center"), (c += a / 2))
              : ((u = "right"), (c = this.right)))
        : (u = "right"),
      { textAlign: u, x: c }
    );
  }
  _computeLabelArea() {
    if (this.options.ticks.mirror) return;
    const t = this.chart,
      n = this.options.position;
    if (n === "left" || n === "right")
      return { top: 0, left: this.left, bottom: t.height, right: this.right };
    if (n === "top" || n === "bottom")
      return { top: this.top, left: 0, bottom: this.bottom, right: t.width };
  }
  drawBackground() {
    const {
      ctx: t,
      options: { backgroundColor: n },
      left: i,
      top: r,
      width: s,
      height: o,
    } = this;
    n && (t.save(), (t.fillStyle = n), t.fillRect(i, r, s, o), t.restore());
  }
  getLineWidthForValue(t) {
    const n = this.options.grid;
    if (!this._isVisible() || !n.display) return 0;
    const r = this.ticks.findIndex((s) => s.value === t);
    return r >= 0 ? n.setContext(this.getContext(r)).lineWidth : 0;
  }
  drawGrid(t) {
    const n = this.options.grid,
      i = this.ctx,
      r =
        this._gridLineItems ||
        (this._gridLineItems = this._computeGridLineItems(t));
    let s, o;
    const l = (a, u, c) => {
      !c.width ||
        !c.color ||
        (i.save(),
        (i.lineWidth = c.width),
        (i.strokeStyle = c.color),
        i.setLineDash(c.borderDash || []),
        (i.lineDashOffset = c.borderDashOffset),
        i.beginPath(),
        i.moveTo(a.x, a.y),
        i.lineTo(u.x, u.y),
        i.stroke(),
        i.restore());
    };
    if (n.display)
      for (s = 0, o = r.length; s < o; ++s) {
        const a = r[s];
        n.drawOnChartArea && l({ x: a.x1, y: a.y1 }, { x: a.x2, y: a.y2 }, a),
          n.drawTicks &&
            l(
              { x: a.tx1, y: a.ty1 },
              { x: a.tx2, y: a.ty2 },
              {
                color: a.tickColor,
                width: a.tickWidth,
                borderDash: a.tickBorderDash,
                borderDashOffset: a.tickBorderDashOffset,
              }
            );
      }
  }
  drawBorder() {
    const {
        chart: t,
        ctx: n,
        options: { border: i, grid: r },
      } = this,
      s = i.setContext(this.getContext()),
      o = i.display ? s.width : 0;
    if (!o) return;
    const l = r.setContext(this.getContext(0)).lineWidth,
      a = this._borderValue;
    let u, c, f, d;
    this.isHorizontal()
      ? ((u = Jn(t, this.left, o) - o / 2),
        (c = Jn(t, this.right, l) + l / 2),
        (f = d = a))
      : ((f = Jn(t, this.top, o) - o / 2),
        (d = Jn(t, this.bottom, l) + l / 2),
        (u = c = a)),
      n.save(),
      (n.lineWidth = s.width),
      (n.strokeStyle = s.color),
      n.beginPath(),
      n.moveTo(u, f),
      n.lineTo(c, d),
      n.stroke(),
      n.restore();
  }
  drawLabels(t) {
    if (!this.options.ticks.display) return;
    const i = this.ctx,
      r = this._computeLabelArea();
    r && Df(i, r);
    const s = this.getLabelItems(t);
    for (const o of s) {
      const l = o.options,
        a = o.font,
        u = o.label,
        c = o.textOffset;
      Ms(i, u, 0, c, a, l);
    }
    r && Af(i);
  }
  drawTitle() {
    const {
      ctx: t,
      options: { position: n, title: i, reverse: r },
    } = this;
    if (!i.display) return;
    const s = He(i.font),
      o = Tt(i.padding),
      l = i.align;
    let a = s.lineHeight / 2;
    n === "bottom" || n === "center" || te(n)
      ? ((a += o.bottom),
        Oe(i.text) && (a += s.lineHeight * (i.text.length - 1)))
      : (a += o.top);
    const {
      titleX: u,
      titleY: c,
      maxWidth: f,
      rotation: d,
    } = Uk(this, a, n, l);
    Ms(t, i.text, 0, 0, s, {
      color: i.color,
      maxWidth: f,
      rotation: d,
      textAlign: Hk(l, n, r),
      textBaseline: "middle",
      translation: [u, c],
    });
  }
  draw(t) {
    this._isVisible() &&
      (this.drawBackground(),
      this.drawGrid(t),
      this.drawBorder(),
      this.drawTitle(),
      this.drawLabels(t));
  }
  _layers() {
    const t = this.options,
      n = (t.ticks && t.ticks.z) || 0,
      i = K(t.grid && t.grid.z, -1),
      r = K(t.border && t.border.z, 0);
    return !this._isVisible() || this.draw !== cr.prototype.draw
      ? [
          {
            z: n,
            draw: (s) => {
              this.draw(s);
            },
          },
        ]
      : [
          {
            z: i,
            draw: (s) => {
              this.drawBackground(), this.drawGrid(s), this.drawTitle();
            },
          },
          {
            z: r,
            draw: () => {
              this.drawBorder();
            },
          },
          {
            z: n,
            draw: (s) => {
              this.drawLabels(s);
            },
          },
        ];
  }
  getMatchingVisibleMetas(t) {
    const n = this.chart.getSortedVisibleDatasetMetas(),
      i = this.axis + "AxisID",
      r = [];
    let s, o;
    for (s = 0, o = n.length; s < o; ++s) {
      const l = n[s];
      l[i] === this.id && (!t || l.type === t) && r.push(l);
    }
    return r;
  }
  _resolveTickFontOptions(t) {
    const n = this.options.ticks.setContext(this.getContext(t));
    return He(n.font);
  }
  _maxDigits() {
    const t = this._resolveTickFontOptions(0).lineHeight;
    return (this.isHorizontal() ? this.width : this.height) / t;
  }
}
class Co {
  constructor(t, n, i) {
    (this.type = t),
      (this.scope = n),
      (this.override = i),
      (this.items = Object.create(null));
  }
  isForType(t) {
    return Object.prototype.isPrototypeOf.call(
      this.type.prototype,
      t.prototype
    );
  }
  register(t) {
    const n = Object.getPrototypeOf(t);
    let i;
    $k(n) && (i = this.register(n));
    const r = this.items,
      s = t.id,
      o = this.scope + "." + s;
    if (!s) throw new Error("class does not have id: " + t);
    return (
      s in r ||
        ((r[s] = t),
        Wk(t, o, i),
        this.override && ye.override(t.id, t.overrides)),
      o
    );
  }
  get(t) {
    return this.items[t];
  }
  unregister(t) {
    const n = this.items,
      i = t.id,
      r = this.scope;
    i in n && delete n[i],
      r && i in ye[r] && (delete ye[r][i], this.override && delete _i[i]);
  }
}
function Wk(e, t, n) {
  const i = Ps(Object.create(null), [
    n ? ye.get(n) : {},
    ye.get(t),
    e.defaults,
  ]);
  ye.set(t, i),
    e.defaultRoutes && Vk(t, e.defaultRoutes),
    e.descriptors && ye.describe(t, e.descriptors);
}
function Vk(e, t) {
  Object.keys(t).forEach((n) => {
    const i = n.split("."),
      r = i.pop(),
      s = [e].concat(i).join("."),
      o = t[n].split("."),
      l = o.pop(),
      a = o.join(".");
    ye.route(s, r, a, l);
  });
}
function $k(e) {
  return "id" in e && "defaults" in e;
}
class Yk {
  constructor() {
    (this.controllers = new Co(rs, "datasets", !0)),
      (this.elements = new Co(mn, "elements")),
      (this.plugins = new Co(Object, "plugins")),
      (this.scales = new Co(cr, "scales")),
      (this._typedRegistries = [this.controllers, this.scales, this.elements]);
  }
  add(...t) {
    this._each("register", t);
  }
  remove(...t) {
    this._each("unregister", t);
  }
  addControllers(...t) {
    this._each("register", t, this.controllers);
  }
  addElements(...t) {
    this._each("register", t, this.elements);
  }
  addPlugins(...t) {
    this._each("register", t, this.plugins);
  }
  addScales(...t) {
    this._each("register", t, this.scales);
  }
  getController(t) {
    return this._get(t, this.controllers, "controller");
  }
  getElement(t) {
    return this._get(t, this.elements, "element");
  }
  getPlugin(t) {
    return this._get(t, this.plugins, "plugin");
  }
  getScale(t) {
    return this._get(t, this.scales, "scale");
  }
  removeControllers(...t) {
    this._each("unregister", t, this.controllers);
  }
  removeElements(...t) {
    this._each("unregister", t, this.elements);
  }
  removePlugins(...t) {
    this._each("unregister", t, this.plugins);
  }
  removeScales(...t) {
    this._each("unregister", t, this.scales);
  }
  _each(t, n, i) {
    [...n].forEach((r) => {
      const s = i || this._getRegistryForType(r);
      i || s.isForType(r) || (s === this.plugins && r.id)
        ? this._exec(t, s, r)
        : Q(r, (o) => {
            const l = i || this._getRegistryForType(o);
            this._exec(t, l, o);
          });
    });
  }
  _exec(t, n, i) {
    const r = Mf(t);
    W(i["before" + r], [], i), n[t](i), W(i["after" + r], [], i);
  }
  _getRegistryForType(t) {
    for (let n = 0; n < this._typedRegistries.length; n++) {
      const i = this._typedRegistries[n];
      if (i.isForType(t)) return i;
    }
    return this.plugins;
  }
  _get(t, n, i) {
    const r = n.get(t);
    if (r === void 0)
      throw new Error('"' + t + '" is not a registered ' + i + ".");
    return r;
  }
}
var Yt = new Yk();
class Xk {
  constructor() {
    this._init = [];
  }
  notify(t, n, i, r) {
    n === "beforeInit" &&
      ((this._init = this._createDescriptors(t, !0)),
      this._notify(this._init, t, "install"));
    const s = r ? this._descriptors(t).filter(r) : this._descriptors(t),
      o = this._notify(s, t, n, i);
    return (
      n === "afterDestroy" &&
        (this._notify(s, t, "stop"), this._notify(this._init, t, "uninstall")),
      o
    );
  }
  _notify(t, n, i, r) {
    r = r || {};
    for (const s of t) {
      const o = s.plugin,
        l = o[i],
        a = [n, r, s.options];
      if (W(l, a, o) === !1 && r.cancelable) return !1;
    }
    return !0;
  }
  invalidate() {
    pe(this._cache) || ((this._oldCache = this._cache), (this._cache = void 0));
  }
  _descriptors(t) {
    if (this._cache) return this._cache;
    const n = (this._cache = this._createDescriptors(t));
    return this._notifyStateChanges(t), n;
  }
  _createDescriptors(t, n) {
    const i = t && t.config,
      r = K(i.options && i.options.plugins, {}),
      s = Kk(i);
    return r === !1 && !n ? [] : Qk(t, s, r, n);
  }
  _notifyStateChanges(t) {
    const n = this._oldCache || [],
      i = this._cache,
      r = (s, o) =>
        s.filter((l) => !o.some((a) => l.plugin.id === a.plugin.id));
    this._notify(r(n, i), t, "stop"), this._notify(r(i, n), t, "start");
  }
}
function Kk(e) {
  const t = {},
    n = [],
    i = Object.keys(Yt.plugins.items);
  for (let s = 0; s < i.length; s++) n.push(Yt.getPlugin(i[s]));
  const r = e.plugins || [];
  for (let s = 0; s < r.length; s++) {
    const o = r[s];
    n.indexOf(o) === -1 && (n.push(o), (t[o.id] = !0));
  }
  return { plugins: n, localIds: t };
}
function qk(e, t) {
  return !t && e === !1 ? null : e === !0 ? {} : e;
}
function Qk(e, { plugins: t, localIds: n }, i, r) {
  const s = [],
    o = e.getContext();
  for (const l of t) {
    const a = l.id,
      u = qk(i[a], r);
    u !== null &&
      s.push({
        plugin: l,
        options: Gk(e.config, { plugin: l, local: n[a] }, u, o),
      });
  }
  return s;
}
function Gk(e, { plugin: t, local: n }, i, r) {
  const s = e.pluginScopeKeys(t),
    o = e.getOptionScopes(i, s);
  return (
    n && t.defaults && o.push(t.defaults),
    e.createResolver(o, r, [""], { scriptable: !1, indexable: !1, allKeys: !0 })
  );
}
function pc(e, t) {
  const n = ye.datasets[e] || {};
  return (
    ((t.datasets || {})[e] || {}).indexAxis || t.indexAxis || n.indexAxis || "x"
  );
}
function Zk(e, t) {
  let n = e;
  return (
    e === "_index_" ? (n = t) : e === "_value_" && (n = t === "x" ? "y" : "x"),
    n
  );
}
function Jk(e, t) {
  return e === t ? "_index_" : "_value_";
}
function Cp(e) {
  if (e === "x" || e === "y" || e === "r") return e;
}
function eT(e) {
  if (e === "top" || e === "bottom") return "x";
  if (e === "left" || e === "right") return "y";
}
function mc(e, ...t) {
  if (Cp(e)) return e;
  for (const n of t) {
    const i =
      n.axis || eT(n.position) || (e.length > 1 && Cp(e[0].toLowerCase()));
    if (i) return i;
  }
  throw new Error(
    `Cannot determine type of '${e}' axis. Please provide 'axis' or 'position' option.`
  );
}
function Pp(e, t, n) {
  if (n[t + "AxisID"] === e) return { axis: t };
}
function tT(e, t) {
  if (t.data && t.data.datasets) {
    const n = t.data.datasets.filter((i) => i.xAxisID === e || i.yAxisID === e);
    if (n.length) return Pp(e, "x", n[0]) || Pp(e, "y", n[0]);
  }
  return {};
}
function nT(e, t) {
  const n = _i[e.type] || { scales: {} },
    i = t.scales || {},
    r = pc(e.type, t),
    s = Object.create(null);
  return (
    Object.keys(i).forEach((o) => {
      const l = i[o];
      if (!te(l))
        return console.error(`Invalid scale configuration for scale: ${o}`);
      if (l._proxy)
        return console.warn(
          `Ignoring resolver passed as options for scale: ${o}`
        );
      const a = mc(o, l, tT(o, e), ye.scales[l.type]),
        u = Jk(a, r),
        c = n.scales || {};
      s[o] = Jr(Object.create(null), [{ axis: a }, l, c[a], c[u]]);
    }),
    e.data.datasets.forEach((o) => {
      const l = o.type || e.type,
        a = o.indexAxis || pc(l, t),
        c = (_i[l] || {}).scales || {};
      Object.keys(c).forEach((f) => {
        const d = Zk(f, a),
          h = o[d + "AxisID"] || d;
        (s[h] = s[h] || Object.create(null)),
          Jr(s[h], [{ axis: d }, i[h], c[f]]);
      });
    }),
    Object.keys(s).forEach((o) => {
      const l = s[o];
      Jr(l, [ye.scales[l.type], ye.scale]);
    }),
    s
  );
}
function Ly(e) {
  const t = e.options || (e.options = {});
  (t.plugins = K(t.plugins, {})), (t.scales = nT(e, t));
}
function Iy(e) {
  return (
    (e = e || {}),
    (e.datasets = e.datasets || []),
    (e.labels = e.labels || []),
    e
  );
}
function iT(e) {
  return (e = e || {}), (e.data = Iy(e.data)), Ly(e), e;
}
const Op = new Map(),
  Dy = new Set();
function Po(e, t) {
  let n = Op.get(e);
  return n || ((n = t()), Op.set(e, n), Dy.add(n)), n;
}
const Lr = (e, t, n) => {
  const i = Pl(t, n);
  i !== void 0 && e.add(i);
};
class rT {
  constructor(t) {
    (this._config = iT(t)),
      (this._scopeCache = new Map()),
      (this._resolverCache = new Map());
  }
  get platform() {
    return this._config.platform;
  }
  get type() {
    return this._config.type;
  }
  set type(t) {
    this._config.type = t;
  }
  get data() {
    return this._config.data;
  }
  set data(t) {
    this._config.data = Iy(t);
  }
  get options() {
    return this._config.options;
  }
  set options(t) {
    this._config.options = t;
  }
  get plugins() {
    return this._config.plugins;
  }
  update() {
    const t = this._config;
    this.clearCache(), Ly(t);
  }
  clearCache() {
    this._scopeCache.clear(), this._resolverCache.clear();
  }
  datasetScopeKeys(t) {
    return Po(t, () => [[`datasets.${t}`, ""]]);
  }
  datasetAnimationScopeKeys(t, n) {
    return Po(`${t}.transition.${n}`, () => [
      [`datasets.${t}.transitions.${n}`, `transitions.${n}`],
      [`datasets.${t}`, ""],
    ]);
  }
  datasetElementScopeKeys(t, n) {
    return Po(`${t}-${n}`, () => [
      [`datasets.${t}.elements.${n}`, `datasets.${t}`, `elements.${n}`, ""],
    ]);
  }
  pluginScopeKeys(t) {
    const n = t.id,
      i = this.type;
    return Po(`${i}-plugin-${n}`, () => [
      [`plugins.${n}`, ...(t.additionalOptionScopes || [])],
    ]);
  }
  _cachedScopes(t, n) {
    const i = this._scopeCache;
    let r = i.get(t);
    return (!r || n) && ((r = new Map()), i.set(t, r)), r;
  }
  getOptionScopes(t, n, i) {
    const { options: r, type: s } = this,
      o = this._cachedScopes(t, i),
      l = o.get(n);
    if (l) return l;
    const a = new Set();
    n.forEach((c) => {
      t && (a.add(t), c.forEach((f) => Lr(a, t, f))),
        c.forEach((f) => Lr(a, r, f)),
        c.forEach((f) => Lr(a, _i[s] || {}, f)),
        c.forEach((f) => Lr(a, ye, f)),
        c.forEach((f) => Lr(a, fc, f));
    });
    const u = Array.from(a);
    return (
      u.length === 0 && u.push(Object.create(null)), Dy.has(n) && o.set(n, u), u
    );
  }
  chartOptionScopes() {
    const { options: t, type: n } = this;
    return [t, _i[n] || {}, ye.datasets[n] || {}, { type: n }, ye, fc];
  }
  resolveNamedOptions(t, n, i, r = [""]) {
    const s = { $shared: !0 },
      { resolver: o, subPrefixes: l } = Np(this._resolverCache, t, r);
    let a = o;
    if (oT(o, n)) {
      (s.$shared = !1), (i = Wn(i) ? i() : i);
      const u = this.createResolver(t, i, l);
      a = nr(o, i, u);
    }
    for (const u of n) s[u] = a[u];
    return s;
  }
  createResolver(t, n, i = [""], r) {
    const { resolver: s } = Np(this._resolverCache, t, i);
    return te(n) ? nr(s, n, void 0, r) : s;
  }
}
function Np(e, t, n) {
  let i = e.get(t);
  i || ((i = new Map()), e.set(t, i));
  const r = n.join();
  let s = i.get(r);
  return (
    s ||
      ((s = {
        resolver: jf(t, n),
        subPrefixes: n.filter((l) => !l.toLowerCase().includes("hover")),
      }),
      i.set(r, s)),
    s
  );
}
const sT = (e) => te(e) && Object.getOwnPropertyNames(e).some((t) => Wn(e[t]));
function oT(e, t) {
  const { isScriptable: n, isIndexable: i } = vy(e);
  for (const r of t) {
    const s = n(r),
      o = i(r),
      l = (o || s) && e[r];
    if ((s && (Wn(l) || sT(l))) || (o && Oe(l))) return !0;
  }
  return !1;
}
var lT = "4.4.5";
const aT = ["top", "bottom", "left", "right", "chartArea"];
function Mp(e, t) {
  return e === "top" || e === "bottom" || (aT.indexOf(e) === -1 && t === "x");
}
function Rp(e, t) {
  return function (n, i) {
    return n[e] === i[e] ? n[t] - i[t] : n[e] - i[e];
  };
}
function Lp(e) {
  const t = e.chart,
    n = t.options.animation;
  t.notifyPlugins("afterRender"), W(n && n.onComplete, [e], t);
}
function uT(e) {
  const t = e.chart,
    n = t.options.animation;
  W(n && n.onProgress, [e], t);
}
function Ay(e) {
  return (
    Bf() && typeof e == "string"
      ? (e = document.getElementById(e))
      : e && e.length && (e = e[0]),
    e && e.canvas && (e = e.canvas),
    e
  );
}
const Qo = {},
  Ip = (e) => {
    const t = Ay(e);
    return Object.values(Qo)
      .filter((n) => n.canvas === t)
      .pop();
  };
function cT(e, t, n) {
  const i = Object.keys(e);
  for (const r of i) {
    const s = +r;
    if (s >= t) {
      const o = e[r];
      delete e[r], (n > 0 || s > t) && (e[s + n] = o);
    }
  }
}
function fT(e, t, n, i) {
  return !n || e.type === "mouseout" ? null : i ? t : e;
}
function Oo(e, t, n) {
  return e.options.clip ? e[n] : t[n];
}
function dT(e, t) {
  const { xScale: n, yScale: i } = e;
  return n && i
    ? {
        left: Oo(n, t, "left"),
        right: Oo(n, t, "right"),
        top: Oo(i, t, "top"),
        bottom: Oo(i, t, "bottom"),
      }
    : t;
}
var wn;
let oa =
  ((wn = class {
    static register(...t) {
      Yt.add(...t), Dp();
    }
    static unregister(...t) {
      Yt.remove(...t), Dp();
    }
    constructor(t, n) {
      const i = (this.config = new rT(n)),
        r = Ay(t),
        s = Ip(r);
      if (s)
        throw new Error(
          "Canvas is already in use. Chart with ID '" +
            s.id +
            "' must be destroyed before the canvas with ID '" +
            s.canvas.id +
            "' can be reused."
        );
      const o = i.createResolver(i.chartOptionScopes(), this.getContext());
      (this.platform = new (i.platform || Ok(r))()),
        this.platform.updateConfig(i);
      const l = this.platform.acquireContext(r, o.aspectRatio),
        a = l && l.canvas,
        u = a && a.height,
        c = a && a.width;
      if (
        ((this.id = vb()),
        (this.ctx = l),
        (this.canvas = a),
        (this.width = c),
        (this.height = u),
        (this._options = o),
        (this._aspectRatio = this.aspectRatio),
        (this._layers = []),
        (this._metasets = []),
        (this._stacks = void 0),
        (this.boxes = []),
        (this.currentDevicePixelRatio = void 0),
        (this.chartArea = void 0),
        (this._active = []),
        (this._lastEvent = void 0),
        (this._listeners = {}),
        (this._responsiveListeners = void 0),
        (this._sortedMetasets = []),
        (this.scales = {}),
        (this._plugins = new Xk()),
        (this.$proxies = {}),
        (this._hiddenIndices = {}),
        (this.attached = !1),
        (this._animationsDisabled = void 0),
        (this.$context = void 0),
        (this._doResize = zb((f) => this.update(f), o.resizeDelay || 0)),
        (this._dataChanges = []),
        (Qo[this.id] = this),
        !l || !a)
      ) {
        console.error(
          "Failed to create chart: can't acquire context from the given item"
        );
        return;
      }
      nn.listen(this, "complete", Lp),
        nn.listen(this, "progress", uT),
        this._initialize(),
        this.attached && this.update();
    }
    get aspectRatio() {
      const {
        options: { aspectRatio: t, maintainAspectRatio: n },
        width: i,
        height: r,
        _aspectRatio: s,
      } = this;
      return pe(t) ? (n && s ? s : r ? i / r : null) : t;
    }
    get data() {
      return this.config.data;
    }
    set data(t) {
      this.config.data = t;
    }
    get options() {
      return this._options;
    }
    set options(t) {
      this.config.options = t;
    }
    get registry() {
      return Yt;
    }
    _initialize() {
      return (
        this.notifyPlugins("beforeInit"),
        this.options.responsive
          ? this.resize()
          : op(this, this.options.devicePixelRatio),
        this.bindEvents(),
        this.notifyPlugins("afterInit"),
        this
      );
    }
    clear() {
      return ip(this.canvas, this.ctx), this;
    }
    stop() {
      return nn.stop(this), this;
    }
    resize(t, n) {
      nn.running(this)
        ? (this._resizeBeforeDraw = { width: t, height: n })
        : this._resize(t, n);
    }
    _resize(t, n) {
      const i = this.options,
        r = this.canvas,
        s = i.maintainAspectRatio && this.aspectRatio,
        o = this.platform.getMaximumSize(r, t, n, s),
        l = i.devicePixelRatio || this.platform.getDevicePixelRatio(),
        a = this.width ? "resize" : "attach";
      (this.width = o.width),
        (this.height = o.height),
        (this._aspectRatio = this.aspectRatio),
        op(this, l, !0) &&
          (this.notifyPlugins("resize", { size: o }),
          W(i.onResize, [this, o], this),
          this.attached && this._doResize(a) && this.render());
    }
    ensureScalesHaveIDs() {
      const n = this.options.scales || {};
      Q(n, (i, r) => {
        i.id = r;
      });
    }
    buildOrUpdateScales() {
      const t = this.options,
        n = t.scales,
        i = this.scales,
        r = Object.keys(i).reduce((o, l) => ((o[l] = !1), o), {});
      let s = [];
      n &&
        (s = s.concat(
          Object.keys(n).map((o) => {
            const l = n[o],
              a = mc(o, l),
              u = a === "r",
              c = a === "x";
            return {
              options: l,
              dposition: u ? "chartArea" : c ? "bottom" : "left",
              dtype: u ? "radialLinear" : c ? "category" : "linear",
            };
          })
        )),
        Q(s, (o) => {
          const l = o.options,
            a = l.id,
            u = mc(a, l),
            c = K(l.type, o.dtype);
          (l.position === void 0 || Mp(l.position, u) !== Mp(o.dposition)) &&
            (l.position = o.dposition),
            (r[a] = !0);
          let f = null;
          if (a in i && i[a].type === c) f = i[a];
          else {
            const d = Yt.getScale(c);
            (f = new d({ id: a, type: c, ctx: this.ctx, chart: this })),
              (i[f.id] = f);
          }
          f.init(l, t);
        }),
        Q(r, (o, l) => {
          o || delete i[l];
        }),
        Q(i, (o) => {
          wt.configure(this, o, o.options), wt.addBox(this, o);
        });
    }
    _updateMetasets() {
      const t = this._metasets,
        n = this.data.datasets.length,
        i = t.length;
      if ((t.sort((r, s) => r.index - s.index), i > n)) {
        for (let r = n; r < i; ++r) this._destroyDatasetMeta(r);
        t.splice(n, i - n);
      }
      this._sortedMetasets = t.slice(0).sort(Rp("order", "index"));
    }
    _removeUnreferencedMetasets() {
      const {
        _metasets: t,
        data: { datasets: n },
      } = this;
      t.length > n.length && delete this._stacks,
        t.forEach((i, r) => {
          n.filter((s) => s === i._dataset).length === 0 &&
            this._destroyDatasetMeta(r);
        });
    }
    buildOrUpdateControllers() {
      const t = [],
        n = this.data.datasets;
      let i, r;
      for (
        this._removeUnreferencedMetasets(), i = 0, r = n.length;
        i < r;
        i++
      ) {
        const s = n[i];
        let o = this.getDatasetMeta(i);
        const l = s.type || this.config.type;
        if (
          (o.type &&
            o.type !== l &&
            (this._destroyDatasetMeta(i), (o = this.getDatasetMeta(i))),
          (o.type = l),
          (o.indexAxis = s.indexAxis || pc(l, this.options)),
          (o.order = s.order || 0),
          (o.index = i),
          (o.label = "" + s.label),
          (o.visible = this.isDatasetVisible(i)),
          o.controller)
        )
          o.controller.updateIndex(i), o.controller.linkScales();
        else {
          const a = Yt.getController(l),
            { datasetElementType: u, dataElementType: c } = ye.datasets[l];
          Object.assign(a, {
            dataElementType: Yt.getElement(c),
            datasetElementType: u && Yt.getElement(u),
          }),
            (o.controller = new a(this, i)),
            t.push(o.controller);
        }
      }
      return this._updateMetasets(), t;
    }
    _resetElements() {
      Q(
        this.data.datasets,
        (t, n) => {
          this.getDatasetMeta(n).controller.reset();
        },
        this
      );
    }
    reset() {
      this._resetElements(), this.notifyPlugins("reset");
    }
    update(t) {
      const n = this.config;
      n.update();
      const i = (this._options = n.createResolver(
          n.chartOptionScopes(),
          this.getContext()
        )),
        r = (this._animationsDisabled = !i.animation);
      if (
        (this._updateScales(),
        this._checkEventBindings(),
        this._updateHiddenIndices(),
        this._plugins.invalidate(),
        this.notifyPlugins("beforeUpdate", { mode: t, cancelable: !0 }) === !1)
      )
        return;
      const s = this.buildOrUpdateControllers();
      this.notifyPlugins("beforeElementsUpdate");
      let o = 0;
      for (let u = 0, c = this.data.datasets.length; u < c; u++) {
        const { controller: f } = this.getDatasetMeta(u),
          d = !r && s.indexOf(f) === -1;
        f.buildOrUpdateElements(d), (o = Math.max(+f.getMaxOverflow(), o));
      }
      (o = this._minPadding = i.layout.autoPadding ? o : 0),
        this._updateLayout(o),
        r ||
          Q(s, (u) => {
            u.reset();
          }),
        this._updateDatasets(t),
        this.notifyPlugins("afterUpdate", { mode: t }),
        this._layers.sort(Rp("z", "_idx"));
      const { _active: l, _lastEvent: a } = this;
      a
        ? this._eventHandler(a, !0)
        : l.length && this._updateHoverStyles(l, l, !0),
        this.render();
    }
    _updateScales() {
      Q(this.scales, (t) => {
        wt.removeBox(this, t);
      }),
        this.ensureScalesHaveIDs(),
        this.buildOrUpdateScales();
    }
    _checkEventBindings() {
      const t = this.options,
        n = new Set(Object.keys(this._listeners)),
        i = new Set(t.events);
      (!Xh(n, i) || !!this._responsiveListeners !== t.responsive) &&
        (this.unbindEvents(), this.bindEvents());
    }
    _updateHiddenIndices() {
      const { _hiddenIndices: t } = this,
        n = this._getUniformDataChanges() || [];
      for (const { method: i, start: r, count: s } of n) {
        const o = i === "_removeElements" ? -s : s;
        cT(t, r, o);
      }
    }
    _getUniformDataChanges() {
      const t = this._dataChanges;
      if (!t || !t.length) return;
      this._dataChanges = [];
      const n = this.data.datasets.length,
        i = (s) =>
          new Set(
            t
              .filter((o) => o[0] === s)
              .map((o, l) => l + "," + o.splice(1).join(","))
          ),
        r = i(0);
      for (let s = 1; s < n; s++) if (!Xh(r, i(s))) return;
      return Array.from(r)
        .map((s) => s.split(","))
        .map((s) => ({ method: s[1], start: +s[2], count: +s[3] }));
    }
    _updateLayout(t) {
      if (this.notifyPlugins("beforeLayout", { cancelable: !0 }) === !1) return;
      wt.update(this, this.width, this.height, t);
      const n = this.chartArea,
        i = n.width <= 0 || n.height <= 0;
      (this._layers = []),
        Q(
          this.boxes,
          (r) => {
            (i && r.position === "chartArea") ||
              (r.configure && r.configure(), this._layers.push(...r._layers()));
          },
          this
        ),
        this._layers.forEach((r, s) => {
          r._idx = s;
        }),
        this.notifyPlugins("afterLayout");
    }
    _updateDatasets(t) {
      if (
        this.notifyPlugins("beforeDatasetsUpdate", {
          mode: t,
          cancelable: !0,
        }) !== !1
      ) {
        for (let n = 0, i = this.data.datasets.length; n < i; ++n)
          this.getDatasetMeta(n).controller.configure();
        for (let n = 0, i = this.data.datasets.length; n < i; ++n)
          this._updateDataset(n, Wn(t) ? t({ datasetIndex: n }) : t);
        this.notifyPlugins("afterDatasetsUpdate", { mode: t });
      }
    }
    _updateDataset(t, n) {
      const i = this.getDatasetMeta(t),
        r = { meta: i, index: t, mode: n, cancelable: !0 };
      this.notifyPlugins("beforeDatasetUpdate", r) !== !1 &&
        (i.controller._update(n),
        (r.cancelable = !1),
        this.notifyPlugins("afterDatasetUpdate", r));
    }
    render() {
      this.notifyPlugins("beforeRender", { cancelable: !0 }) !== !1 &&
        (nn.has(this)
          ? this.attached && !nn.running(this) && nn.start(this)
          : (this.draw(), Lp({ chart: this })));
    }
    draw() {
      let t;
      if (this._resizeBeforeDraw) {
        const { width: i, height: r } = this._resizeBeforeDraw;
        (this._resizeBeforeDraw = null), this._resize(i, r);
      }
      if (
        (this.clear(),
        this.width <= 0 ||
          this.height <= 0 ||
          this.notifyPlugins("beforeDraw", { cancelable: !0 }) === !1)
      )
        return;
      const n = this._layers;
      for (t = 0; t < n.length && n[t].z <= 0; ++t) n[t].draw(this.chartArea);
      for (this._drawDatasets(); t < n.length; ++t) n[t].draw(this.chartArea);
      this.notifyPlugins("afterDraw");
    }
    _getSortedDatasetMetas(t) {
      const n = this._sortedMetasets,
        i = [];
      let r, s;
      for (r = 0, s = n.length; r < s; ++r) {
        const o = n[r];
        (!t || o.visible) && i.push(o);
      }
      return i;
    }
    getSortedVisibleDatasetMetas() {
      return this._getSortedDatasetMetas(!0);
    }
    _drawDatasets() {
      if (this.notifyPlugins("beforeDatasetsDraw", { cancelable: !0 }) === !1)
        return;
      const t = this.getSortedVisibleDatasetMetas();
      for (let n = t.length - 1; n >= 0; --n) this._drawDataset(t[n]);
      this.notifyPlugins("afterDatasetsDraw");
    }
    _drawDataset(t) {
      const n = this.ctx,
        i = t._clip,
        r = !i.disabled,
        s = dT(t, this.chartArea),
        o = { meta: t, index: t.index, cancelable: !0 };
      this.notifyPlugins("beforeDatasetDraw", o) !== !1 &&
        (r &&
          Df(n, {
            left: i.left === !1 ? 0 : s.left - i.left,
            right: i.right === !1 ? this.width : s.right + i.right,
            top: i.top === !1 ? 0 : s.top - i.top,
            bottom: i.bottom === !1 ? this.height : s.bottom + i.bottom,
          }),
        t.controller.draw(),
        r && Af(n),
        (o.cancelable = !1),
        this.notifyPlugins("afterDatasetDraw", o));
    }
    isPointInArea(t) {
      return Ns(t, this.chartArea, this._minPadding);
    }
    getElementsAtEventForMode(t, n, i, r) {
      const s = ak.modes[n];
      return typeof s == "function" ? s(this, t, i, r) : [];
    }
    getDatasetMeta(t) {
      const n = this.data.datasets[t],
        i = this._metasets;
      let r = i.filter((s) => s && s._dataset === n).pop();
      return (
        r ||
          ((r = {
            type: null,
            data: [],
            dataset: null,
            controller: null,
            hidden: null,
            xAxisID: null,
            yAxisID: null,
            order: (n && n.order) || 0,
            index: t,
            _dataset: n,
            _parsed: [],
            _sorted: !1,
          }),
          i.push(r)),
        r
      );
    }
    getContext() {
      return (
        this.$context ||
        (this.$context = Ti(null, { chart: this, type: "chart" }))
      );
    }
    getVisibleDatasetCount() {
      return this.getSortedVisibleDatasetMetas().length;
    }
    isDatasetVisible(t) {
      const n = this.data.datasets[t];
      if (!n) return !1;
      const i = this.getDatasetMeta(t);
      return typeof i.hidden == "boolean" ? !i.hidden : !n.hidden;
    }
    setDatasetVisibility(t, n) {
      const i = this.getDatasetMeta(t);
      i.hidden = !n;
    }
    toggleDataVisibility(t) {
      this._hiddenIndices[t] = !this._hiddenIndices[t];
    }
    getDataVisibility(t) {
      return !this._hiddenIndices[t];
    }
    _updateVisibility(t, n, i) {
      const r = i ? "show" : "hide",
        s = this.getDatasetMeta(t),
        o = s.controller._resolveAnimations(void 0, r);
      Ol(n)
        ? ((s.data[n].hidden = !i), this.update())
        : (this.setDatasetVisibility(t, i),
          o.update(s, { visible: i }),
          this.update((l) => (l.datasetIndex === t ? r : void 0)));
    }
    hide(t, n) {
      this._updateVisibility(t, n, !1);
    }
    show(t, n) {
      this._updateVisibility(t, n, !0);
    }
    _destroyDatasetMeta(t) {
      const n = this._metasets[t];
      n && n.controller && n.controller._destroy(), delete this._metasets[t];
    }
    _stop() {
      let t, n;
      for (
        this.stop(), nn.remove(this), t = 0, n = this.data.datasets.length;
        t < n;
        ++t
      )
        this._destroyDatasetMeta(t);
    }
    destroy() {
      this.notifyPlugins("beforeDestroy");
      const { canvas: t, ctx: n } = this;
      this._stop(),
        this.config.clearCache(),
        t &&
          (this.unbindEvents(),
          ip(t, n),
          this.platform.releaseContext(n),
          (this.canvas = null),
          (this.ctx = null)),
        delete Qo[this.id],
        this.notifyPlugins("afterDestroy");
    }
    toBase64Image(...t) {
      return this.canvas.toDataURL(...t);
    }
    bindEvents() {
      this.bindUserEvents(),
        this.options.responsive
          ? this.bindResponsiveEvents()
          : (this.attached = !0);
    }
    bindUserEvents() {
      const t = this._listeners,
        n = this.platform,
        i = (s, o) => {
          n.addEventListener(this, s, o), (t[s] = o);
        },
        r = (s, o, l) => {
          (s.offsetX = o), (s.offsetY = l), this._eventHandler(s);
        };
      Q(this.options.events, (s) => i(s, r));
    }
    bindResponsiveEvents() {
      this._responsiveListeners || (this._responsiveListeners = {});
      const t = this._responsiveListeners,
        n = this.platform,
        i = (a, u) => {
          n.addEventListener(this, a, u), (t[a] = u);
        },
        r = (a, u) => {
          t[a] && (n.removeEventListener(this, a, u), delete t[a]);
        },
        s = (a, u) => {
          this.canvas && this.resize(a, u);
        };
      let o;
      const l = () => {
        r("attach", l),
          (this.attached = !0),
          this.resize(),
          i("resize", s),
          i("detach", o);
      };
      (o = () => {
        (this.attached = !1),
          r("resize", s),
          this._stop(),
          this._resize(0, 0),
          i("attach", l);
      }),
        n.isAttached(this.canvas) ? l() : o();
    }
    unbindEvents() {
      Q(this._listeners, (t, n) => {
        this.platform.removeEventListener(this, n, t);
      }),
        (this._listeners = {}),
        Q(this._responsiveListeners, (t, n) => {
          this.platform.removeEventListener(this, n, t);
        }),
        (this._responsiveListeners = void 0);
    }
    updateHoverStyle(t, n, i) {
      const r = i ? "set" : "remove";
      let s, o, l, a;
      for (
        n === "dataset" &&
          ((s = this.getDatasetMeta(t[0].datasetIndex)),
          s.controller["_" + r + "DatasetHoverStyle"]()),
          l = 0,
          a = t.length;
        l < a;
        ++l
      ) {
        o = t[l];
        const u = o && this.getDatasetMeta(o.datasetIndex).controller;
        u && u[r + "HoverStyle"](o.element, o.datasetIndex, o.index);
      }
    }
    getActiveElements() {
      return this._active || [];
    }
    setActiveElements(t) {
      const n = this._active || [],
        i = t.map(({ datasetIndex: s, index: o }) => {
          const l = this.getDatasetMeta(s);
          if (!l) throw new Error("No dataset found at index " + s);
          return { datasetIndex: s, element: l.data[o], index: o };
        });
      !Tl(i, n) &&
        ((this._active = i),
        (this._lastEvent = null),
        this._updateHoverStyles(i, n));
    }
    notifyPlugins(t, n, i) {
      return this._plugins.notify(this, t, n, i);
    }
    isPluginEnabled(t) {
      return this._plugins._cache.filter((n) => n.plugin.id === t).length === 1;
    }
    _updateHoverStyles(t, n, i) {
      const r = this.options.hover,
        s = (a, u) =>
          a.filter(
            (c) =>
              !u.some(
                (f) => c.datasetIndex === f.datasetIndex && c.index === f.index
              )
          ),
        o = s(n, t),
        l = i ? t : s(t, n);
      o.length && this.updateHoverStyle(o, r.mode, !1),
        l.length && r.mode && this.updateHoverStyle(l, r.mode, !0);
    }
    _eventHandler(t, n) {
      const i = {
          event: t,
          replay: n,
          cancelable: !0,
          inChartArea: this.isPointInArea(t),
        },
        r = (o) =>
          (o.options.events || this.options.events).includes(t.native.type);
      if (this.notifyPlugins("beforeEvent", i, r) === !1) return;
      const s = this._handleEvent(t, n, i.inChartArea);
      return (
        (i.cancelable = !1),
        this.notifyPlugins("afterEvent", i, r),
        (s || i.changed) && this.render(),
        this
      );
    }
    _handleEvent(t, n, i) {
      const { _active: r = [], options: s } = this,
        o = n,
        l = this._getActiveElements(t, r, i, o),
        a = Eb(t),
        u = fT(t, this._lastEvent, i, a);
      i &&
        ((this._lastEvent = null),
        W(s.onHover, [t, l, this], this),
        a && W(s.onClick, [t, l, this], this));
      const c = !Tl(l, r);
      return (
        (c || n) && ((this._active = l), this._updateHoverStyles(l, r, n)),
        (this._lastEvent = u),
        c
      );
    }
    _getActiveElements(t, n, i, r) {
      if (t.type === "mouseout") return [];
      if (!i) return n;
      const s = this.options.hover;
      return this.getElementsAtEventForMode(t, s.mode, s, r);
    }
  }),
  Y(wn, "defaults", ye),
  Y(wn, "instances", Qo),
  Y(wn, "overrides", _i),
  Y(wn, "registry", Yt),
  Y(wn, "version", lT),
  Y(wn, "getChart", Ip),
  wn);
function Dp() {
  return Q(oa.instances, (e) => e._plugins.invalidate());
}
function jy(e, t, n = t) {
  (e.lineCap = K(n.borderCapStyle, t.borderCapStyle)),
    e.setLineDash(K(n.borderDash, t.borderDash)),
    (e.lineDashOffset = K(n.borderDashOffset, t.borderDashOffset)),
    (e.lineJoin = K(n.borderJoinStyle, t.borderJoinStyle)),
    (e.lineWidth = K(n.borderWidth, t.borderWidth)),
    (e.strokeStyle = K(n.borderColor, t.borderColor));
}
function hT(e, t, n) {
  e.lineTo(n.x, n.y);
}
function pT(e) {
  return e.stepped
    ? Gb
    : e.tension || e.cubicInterpolationMode === "monotone"
    ? Zb
    : hT;
}
function zy(e, t, n = {}) {
  const i = e.length,
    { start: r = 0, end: s = i - 1 } = n,
    { start: o, end: l } = t,
    a = Math.max(r, o),
    u = Math.min(s, l),
    c = (r < o && s < o) || (r > l && s > l);
  return {
    count: i,
    start: a,
    loop: t.loop,
    ilen: u < a && !c ? i + u - a : u - a,
  };
}
function mT(e, t, n, i) {
  const { points: r, options: s } = t,
    { count: o, start: l, loop: a, ilen: u } = zy(r, n, i),
    c = pT(s);
  let { move: f = !0, reverse: d } = i || {},
    h,
    m,
    v;
  for (h = 0; h <= u; ++h)
    (m = r[(l + (d ? u - h : h)) % o]),
      !m.skip &&
        (f ? (e.moveTo(m.x, m.y), (f = !1)) : c(e, v, m, d, s.stepped),
        (v = m));
  return a && ((m = r[(l + (d ? u : 0)) % o]), c(e, v, m, d, s.stepped)), !!a;
}
function gT(e, t, n, i) {
  const r = t.points,
    { count: s, start: o, ilen: l } = zy(r, n, i),
    { move: a = !0, reverse: u } = i || {};
  let c = 0,
    f = 0,
    d,
    h,
    m,
    v,
    _,
    g;
  const y = (E) => (o + (u ? l - E : E)) % s,
    w = () => {
      v !== _ && (e.lineTo(c, _), e.lineTo(c, v), e.lineTo(c, g));
    };
  for (a && ((h = r[y(0)]), e.moveTo(h.x, h.y)), d = 0; d <= l; ++d) {
    if (((h = r[y(d)]), h.skip)) continue;
    const E = h.x,
      k = h.y,
      P = E | 0;
    P === m
      ? (k < v ? (v = k) : k > _ && (_ = k), (c = (f * c + E) / ++f))
      : (w(), e.lineTo(E, k), (m = P), (f = 0), (v = _ = k)),
      (g = k);
  }
  w();
}
function gc(e) {
  const t = e.options,
    n = t.borderDash && t.borderDash.length;
  return !e._decimated &&
    !e._loop &&
    !t.tension &&
    t.cubicInterpolationMode !== "monotone" &&
    !t.stepped &&
    !n
    ? gT
    : mT;
}
function yT(e) {
  return e.stepped
    ? ME
    : e.tension || e.cubicInterpolationMode === "monotone"
    ? RE
    : ii;
}
function vT(e, t, n, i) {
  let r = t._path;
  r || ((r = t._path = new Path2D()), t.path(r, n, i) && r.closePath()),
    jy(e, t.options),
    e.stroke(r);
}
function xT(e, t, n, i) {
  const { segments: r, options: s } = t,
    o = gc(t);
  for (const l of r)
    jy(e, s, l.style),
      e.beginPath(),
      o(e, t, l, { start: n, end: n + i - 1 }) && e.closePath(),
      e.stroke();
}
const _T = typeof Path2D == "function";
function wT(e, t, n, i) {
  _T && !t.options.segment ? vT(e, t, n, i) : xT(e, t, n, i);
}
class Ur extends mn {
  constructor(t) {
    super(),
      (this.animated = !0),
      (this.options = void 0),
      (this._chart = void 0),
      (this._loop = void 0),
      (this._fullLoop = void 0),
      (this._path = void 0),
      (this._points = void 0),
      (this._segments = void 0),
      (this._decimated = !1),
      (this._pointsUpdated = !1),
      (this._datasetIndex = void 0),
      t && Object.assign(this, t);
  }
  updateControlPoints(t, n) {
    const i = this.options;
    if (
      (i.tension || i.cubicInterpolationMode === "monotone") &&
      !i.stepped &&
      !this._pointsUpdated
    ) {
      const r = i.spanGaps ? this._loop : this._fullLoop;
      bE(this._points, i, t, r, n), (this._pointsUpdated = !0);
    }
  }
  set points(t) {
    (this._points = t),
      delete this._segments,
      delete this._path,
      (this._pointsUpdated = !1);
  }
  get points() {
    return this._points;
  }
  get segments() {
    return this._segments || (this._segments = BE(this, this.options.segment));
  }
  first() {
    const t = this.segments,
      n = this.points;
    return t.length && n[t[0].start];
  }
  last() {
    const t = this.segments,
      n = this.points,
      i = t.length;
    return i && n[t[i - 1].end];
  }
  interpolate(t, n) {
    const i = this.options,
      r = t[n],
      s = this.points,
      o = jE(this, { property: n, start: r, end: r });
    if (!o.length) return;
    const l = [],
      a = yT(i);
    let u, c;
    for (u = 0, c = o.length; u < c; ++u) {
      const { start: f, end: d } = o[u],
        h = s[f],
        m = s[d];
      if (h === m) {
        l.push(h);
        continue;
      }
      const v = Math.abs((r - h[n]) / (m[n] - h[n])),
        _ = a(h, m, v, i.stepped);
      (_[n] = t[n]), l.push(_);
    }
    return l.length === 1 ? l[0] : l;
  }
  pathSegment(t, n, i) {
    return gc(this)(t, this, n, i);
  }
  path(t, n, i) {
    const r = this.segments,
      s = gc(this);
    let o = this._loop;
    (n = n || 0), (i = i || this.points.length - n);
    for (const l of r) o &= s(t, this, l, { start: n, end: n + i - 1 });
    return !!o;
  }
  draw(t, n, i, r) {
    const s = this.options || {};
    (this.points || []).length &&
      s.borderWidth &&
      (t.save(), wT(t, this, i, r), t.restore()),
      this.animated && ((this._pointsUpdated = !1), (this._path = void 0));
  }
}
Y(Ur, "id", "line"),
  Y(Ur, "defaults", {
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: "miter",
    borderWidth: 3,
    capBezierPoints: !0,
    cubicInterpolationMode: "default",
    fill: !1,
    spanGaps: !1,
    stepped: !1,
    tension: 0,
  }),
  Y(Ur, "defaultRoutes", {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor",
  }),
  Y(Ur, "descriptors", {
    _scriptable: !0,
    _indexable: (t) => t !== "borderDash" && t !== "fill",
  });
function Ap(e, t, n, i) {
  const r = e.options,
    { [n]: s } = e.getProps([n], i);
  return Math.abs(t - s) < r.radius + r.hitRadius;
}
class Go extends mn {
  constructor(n) {
    super();
    Y(this, "parsed");
    Y(this, "skip");
    Y(this, "stop");
    (this.options = void 0),
      (this.parsed = void 0),
      (this.skip = void 0),
      (this.stop = void 0),
      n && Object.assign(this, n);
  }
  inRange(n, i, r) {
    const s = this.options,
      { x: o, y: l } = this.getProps(["x", "y"], r);
    return (
      Math.pow(n - o, 2) + Math.pow(i - l, 2) <
      Math.pow(s.hitRadius + s.radius, 2)
    );
  }
  inXRange(n, i) {
    return Ap(this, n, "x", i);
  }
  inYRange(n, i) {
    return Ap(this, n, "y", i);
  }
  getCenterPoint(n) {
    const { x: i, y: r } = this.getProps(["x", "y"], n);
    return { x: i, y: r };
  }
  size(n) {
    n = n || this.options || {};
    let i = n.radius || 0;
    i = Math.max(i, (i && n.hoverRadius) || 0);
    const r = (i && n.borderWidth) || 0;
    return (i + r) * 2;
  }
  draw(n, i) {
    const r = this.options;
    this.skip ||
      r.radius < 0.1 ||
      !Ns(this, i, this.size(r) / 2) ||
      ((n.strokeStyle = r.borderColor),
      (n.lineWidth = r.borderWidth),
      (n.fillStyle = r.backgroundColor),
      dc(n, r, this.x, this.y));
  }
  getRange() {
    const n = this.options || {};
    return n.radius + n.hitRadius;
  }
}
Y(Go, "id", "point"),
  Y(Go, "defaults", {
    borderWidth: 1,
    hitRadius: 1,
    hoverBorderWidth: 1,
    hoverRadius: 4,
    pointStyle: "circle",
    radius: 3,
    rotation: 0,
  }),
  Y(Go, "defaultRoutes", {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor",
  });
const jp = (e, t) => {
    let { boxHeight: n = t, boxWidth: i = t } = e;
    return (
      e.usePointStyle &&
        ((n = Math.min(n, t)), (i = e.pointStyleWidth || Math.min(i, t))),
      { boxWidth: i, boxHeight: n, itemHeight: Math.max(t, n) }
    );
  },
  ST = (e, t) =>
    e !== null &&
    t !== null &&
    e.datasetIndex === t.datasetIndex &&
    e.index === t.index;
class zp extends mn {
  constructor(t) {
    super(),
      (this._added = !1),
      (this.legendHitBoxes = []),
      (this._hoveredItem = null),
      (this.doughnutMode = !1),
      (this.chart = t.chart),
      (this.options = t.options),
      (this.ctx = t.ctx),
      (this.legendItems = void 0),
      (this.columnSizes = void 0),
      (this.lineWidths = void 0),
      (this.maxHeight = void 0),
      (this.maxWidth = void 0),
      (this.top = void 0),
      (this.bottom = void 0),
      (this.left = void 0),
      (this.right = void 0),
      (this.height = void 0),
      (this.width = void 0),
      (this._margins = void 0),
      (this.position = void 0),
      (this.weight = void 0),
      (this.fullSize = void 0);
  }
  update(t, n, i) {
    (this.maxWidth = t),
      (this.maxHeight = n),
      (this._margins = i),
      this.setDimensions(),
      this.buildLabels(),
      this.fit();
  }
  setDimensions() {
    this.isHorizontal()
      ? ((this.width = this.maxWidth),
        (this.left = this._margins.left),
        (this.right = this.width))
      : ((this.height = this.maxHeight),
        (this.top = this._margins.top),
        (this.bottom = this.height));
  }
  buildLabels() {
    const t = this.options.labels || {};
    let n = W(t.generateLabels, [this.chart], this) || [];
    t.filter && (n = n.filter((i) => t.filter(i, this.chart.data))),
      t.sort && (n = n.sort((i, r) => t.sort(i, r, this.chart.data))),
      this.options.reverse && n.reverse(),
      (this.legendItems = n);
  }
  fit() {
    const { options: t, ctx: n } = this;
    if (!t.display) {
      this.width = this.height = 0;
      return;
    }
    const i = t.labels,
      r = He(i.font),
      s = r.size,
      o = this._computeTitleHeight(),
      { boxWidth: l, itemHeight: a } = jp(i, s);
    let u, c;
    (n.font = r.string),
      this.isHorizontal()
        ? ((u = this.maxWidth), (c = this._fitRows(o, s, l, a) + 10))
        : ((c = this.maxHeight), (u = this._fitCols(o, r, l, a) + 10)),
      (this.width = Math.min(u, t.maxWidth || this.maxWidth)),
      (this.height = Math.min(c, t.maxHeight || this.maxHeight));
  }
  _fitRows(t, n, i, r) {
    const {
        ctx: s,
        maxWidth: o,
        options: {
          labels: { padding: l },
        },
      } = this,
      a = (this.legendHitBoxes = []),
      u = (this.lineWidths = [0]),
      c = r + l;
    let f = t;
    (s.textAlign = "left"), (s.textBaseline = "middle");
    let d = -1,
      h = -c;
    return (
      this.legendItems.forEach((m, v) => {
        const _ = i + n / 2 + s.measureText(m.text).width;
        (v === 0 || u[u.length - 1] + _ + 2 * l > o) &&
          ((f += c), (u[u.length - (v > 0 ? 0 : 1)] = 0), (h += c), d++),
          (a[v] = { left: 0, top: h, row: d, width: _, height: r }),
          (u[u.length - 1] += _ + l);
      }),
      f
    );
  }
  _fitCols(t, n, i, r) {
    const {
        ctx: s,
        maxHeight: o,
        options: {
          labels: { padding: l },
        },
      } = this,
      a = (this.legendHitBoxes = []),
      u = (this.columnSizes = []),
      c = o - t;
    let f = l,
      d = 0,
      h = 0,
      m = 0,
      v = 0;
    return (
      this.legendItems.forEach((_, g) => {
        const { itemWidth: y, itemHeight: w } = bT(i, n, s, _, r);
        g > 0 &&
          h + w + 2 * l > c &&
          ((f += d + l),
          u.push({ width: d, height: h }),
          (m += d + l),
          v++,
          (d = h = 0)),
          (a[g] = { left: m, top: h, col: v, width: y, height: w }),
          (d = Math.max(d, y)),
          (h += w + l);
      }),
      (f += d),
      u.push({ width: d, height: h }),
      f
    );
  }
  adjustHitBoxes() {
    if (!this.options.display) return;
    const t = this._computeTitleHeight(),
      {
        legendHitBoxes: n,
        options: {
          align: i,
          labels: { padding: r },
          rtl: s,
        },
      } = this,
      o = Ki(s, this.left, this.width);
    if (this.isHorizontal()) {
      let l = 0,
        a = Fe(i, this.left + r, this.right - this.lineWidths[l]);
      for (const u of n)
        l !== u.row &&
          ((l = u.row),
          (a = Fe(i, this.left + r, this.right - this.lineWidths[l]))),
          (u.top += this.top + t + r),
          (u.left = o.leftForLtr(o.x(a), u.width)),
          (a += u.width + r);
    } else {
      let l = 0,
        a = Fe(i, this.top + t + r, this.bottom - this.columnSizes[l].height);
      for (const u of n)
        u.col !== l &&
          ((l = u.col),
          (a = Fe(
            i,
            this.top + t + r,
            this.bottom - this.columnSizes[l].height
          ))),
          (u.top = a),
          (u.left += this.left + r),
          (u.left = o.leftForLtr(o.x(u.left), u.width)),
          (a += u.height + r);
    }
  }
  isHorizontal() {
    return (
      this.options.position === "top" || this.options.position === "bottom"
    );
  }
  draw() {
    if (this.options.display) {
      const t = this.ctx;
      Df(t, this), this._draw(), Af(t);
    }
  }
  _draw() {
    const { options: t, columnSizes: n, lineWidths: i, ctx: r } = this,
      { align: s, labels: o } = t,
      l = ye.color,
      a = Ki(t.rtl, this.left, this.width),
      u = He(o.font),
      { padding: c } = o,
      f = u.size,
      d = f / 2;
    let h;
    this.drawTitle(),
      (r.textAlign = a.textAlign("left")),
      (r.textBaseline = "middle"),
      (r.lineWidth = 0.5),
      (r.font = u.string);
    const { boxWidth: m, boxHeight: v, itemHeight: _ } = jp(o, f),
      g = function (P, C, N) {
        if (isNaN(m) || m <= 0 || isNaN(v) || v < 0) return;
        r.save();
        const I = K(N.lineWidth, 1);
        if (
          ((r.fillStyle = K(N.fillStyle, l)),
          (r.lineCap = K(N.lineCap, "butt")),
          (r.lineDashOffset = K(N.lineDashOffset, 0)),
          (r.lineJoin = K(N.lineJoin, "miter")),
          (r.lineWidth = I),
          (r.strokeStyle = K(N.strokeStyle, l)),
          r.setLineDash(K(N.lineDash, [])),
          o.usePointStyle)
        ) {
          const D = {
              radius: (v * Math.SQRT2) / 2,
              pointStyle: N.pointStyle,
              rotation: N.rotation,
              borderWidth: I,
            },
            F = a.xPlus(P, m / 2),
            B = C + d;
          gy(r, D, F, B, o.pointStyleWidth && m);
        } else {
          const D = C + Math.max((f - v) / 2, 0),
            F = a.leftForLtr(P, m),
            B = is(N.borderRadius);
          r.beginPath(),
            Object.values(B).some((Z) => Z !== 0)
              ? hc(r, { x: F, y: D, w: m, h: v, radius: B })
              : r.rect(F, D, m, v),
            r.fill(),
            I !== 0 && r.stroke();
        }
        r.restore();
      },
      y = function (P, C, N) {
        Ms(r, N.text, P, C + _ / 2, u, {
          strikethrough: N.hidden,
          textAlign: a.textAlign(N.textAlign),
        });
      },
      w = this.isHorizontal(),
      E = this._computeTitleHeight();
    w
      ? (h = {
          x: Fe(s, this.left + c, this.right - i[0]),
          y: this.top + c + E,
          line: 0,
        })
      : (h = {
          x: this.left + c,
          y: Fe(s, this.top + E + c, this.bottom - n[0].height),
          line: 0,
        }),
      by(this.ctx, t.textDirection);
    const k = _ + c;
    this.legendItems.forEach((P, C) => {
      (r.strokeStyle = P.fontColor), (r.fillStyle = P.fontColor);
      const N = r.measureText(P.text).width,
        I = a.textAlign(P.textAlign || (P.textAlign = o.textAlign)),
        D = m + d + N;
      let F = h.x,
        B = h.y;
      a.setWidth(this.width),
        w
          ? C > 0 &&
            F + D + c > this.right &&
            ((B = h.y += k),
            h.line++,
            (F = h.x = Fe(s, this.left + c, this.right - i[h.line])))
          : C > 0 &&
            B + k > this.bottom &&
            ((F = h.x = F + n[h.line].width + c),
            h.line++,
            (B = h.y =
              Fe(s, this.top + E + c, this.bottom - n[h.line].height)));
      const Z = a.x(F);
      if (
        (g(Z, B, P),
        (F = Fb(I, F + m + d, w ? F + D : this.right, t.rtl)),
        y(a.x(F), B, P),
        w)
      )
        h.x += D + c;
      else if (typeof P.text != "string") {
        const X = u.lineHeight;
        h.y += Fy(P, X) + c;
      } else h.y += k;
    }),
      Ey(this.ctx, t.textDirection);
  }
  drawTitle() {
    const t = this.options,
      n = t.title,
      i = He(n.font),
      r = Tt(n.padding);
    if (!n.display) return;
    const s = Ki(t.rtl, this.left, this.width),
      o = this.ctx,
      l = n.position,
      a = i.size / 2,
      u = r.top + a;
    let c,
      f = this.left,
      d = this.width;
    if (this.isHorizontal())
      (d = Math.max(...this.lineWidths)),
        (c = this.top + u),
        (f = Fe(t.align, f, this.right - d));
    else {
      const m = this.columnSizes.reduce((v, _) => Math.max(v, _.height), 0);
      c =
        u +
        Fe(
          t.align,
          this.top,
          this.bottom - m - t.labels.padding - this._computeTitleHeight()
        );
    }
    const h = Fe(l, f, f + d);
    (o.textAlign = s.textAlign(Lf(l))),
      (o.textBaseline = "middle"),
      (o.strokeStyle = n.color),
      (o.fillStyle = n.color),
      (o.font = i.string),
      Ms(o, n.text, h, c, i);
  }
  _computeTitleHeight() {
    const t = this.options.title,
      n = He(t.font),
      i = Tt(t.padding);
    return t.display ? n.lineHeight + i.height : 0;
  }
  _getLegendItemAt(t, n) {
    let i, r, s;
    if (Br(t, this.left, this.right) && Br(n, this.top, this.bottom)) {
      for (s = this.legendHitBoxes, i = 0; i < s.length; ++i)
        if (
          ((r = s[i]),
          Br(t, r.left, r.left + r.width) && Br(n, r.top, r.top + r.height))
        )
          return this.legendItems[i];
    }
    return null;
  }
  handleEvent(t) {
    const n = this.options;
    if (!TT(t.type, n)) return;
    const i = this._getLegendItemAt(t.x, t.y);
    if (t.type === "mousemove" || t.type === "mouseout") {
      const r = this._hoveredItem,
        s = ST(r, i);
      r && !s && W(n.onLeave, [t, r, this], this),
        (this._hoveredItem = i),
        i && !s && W(n.onHover, [t, i, this], this);
    } else i && W(n.onClick, [t, i, this], this);
  }
}
function bT(e, t, n, i, r) {
  const s = ET(i, e, t, n),
    o = kT(r, i, t.lineHeight);
  return { itemWidth: s, itemHeight: o };
}
function ET(e, t, n, i) {
  let r = e.text;
  return (
    r &&
      typeof r != "string" &&
      (r = r.reduce((s, o) => (s.length > o.length ? s : o))),
    t + n.size / 2 + i.measureText(r).width
  );
}
function kT(e, t, n) {
  let i = e;
  return typeof t.text != "string" && (i = Fy(t, n)), i;
}
function Fy(e, t) {
  const n = e.text ? e.text.length : 0;
  return t * n;
}
function TT(e, t) {
  return !!(
    ((e === "mousemove" || e === "mouseout") && (t.onHover || t.onLeave)) ||
    (t.onClick && (e === "click" || e === "mouseup"))
  );
}
var CT = {
  id: "legend",
  _element: zp,
  start(e, t, n) {
    const i = (e.legend = new zp({ ctx: e.ctx, options: n, chart: e }));
    wt.configure(e, i, n), wt.addBox(e, i);
  },
  stop(e) {
    wt.removeBox(e, e.legend), delete e.legend;
  },
  beforeUpdate(e, t, n) {
    const i = e.legend;
    wt.configure(e, i, n), (i.options = n);
  },
  afterUpdate(e) {
    const t = e.legend;
    t.buildLabels(), t.adjustHitBoxes();
  },
  afterEvent(e, t) {
    t.replay || e.legend.handleEvent(t.event);
  },
  defaults: {
    display: !0,
    position: "top",
    align: "center",
    fullSize: !0,
    reverse: !1,
    weight: 1e3,
    onClick(e, t, n) {
      const i = t.datasetIndex,
        r = n.chart;
      r.isDatasetVisible(i)
        ? (r.hide(i), (t.hidden = !0))
        : (r.show(i), (t.hidden = !1));
    },
    onHover: null,
    onLeave: null,
    labels: {
      color: (e) => e.chart.options.color,
      boxWidth: 40,
      padding: 10,
      generateLabels(e) {
        const t = e.data.datasets,
          {
            labels: {
              usePointStyle: n,
              pointStyle: i,
              textAlign: r,
              color: s,
              useBorderRadius: o,
              borderRadius: l,
            },
          } = e.legend.options;
        return e._getSortedDatasetMetas().map((a) => {
          const u = a.controller.getStyle(n ? 0 : void 0),
            c = Tt(u.borderWidth);
          return {
            text: t[a.index].label,
            fillStyle: u.backgroundColor,
            fontColor: s,
            hidden: !a.visible,
            lineCap: u.borderCapStyle,
            lineDash: u.borderDash,
            lineDashOffset: u.borderDashOffset,
            lineJoin: u.borderJoinStyle,
            lineWidth: (c.width + c.height) / 4,
            strokeStyle: u.borderColor,
            pointStyle: i || u.pointStyle,
            rotation: u.rotation,
            textAlign: r || u.textAlign,
            borderRadius: o && (l || u.borderRadius),
            datasetIndex: a.index,
          };
        }, this);
      },
    },
    title: {
      color: (e) => e.chart.options.color,
      display: !1,
      position: "center",
      text: "",
    },
  },
  descriptors: {
    _scriptable: (e) => !e.startsWith("on"),
    labels: {
      _scriptable: (e) => !["generateLabels", "filter", "sort"].includes(e),
    },
  },
};
class By extends mn {
  constructor(t) {
    super(),
      (this.chart = t.chart),
      (this.options = t.options),
      (this.ctx = t.ctx),
      (this._padding = void 0),
      (this.top = void 0),
      (this.bottom = void 0),
      (this.left = void 0),
      (this.right = void 0),
      (this.width = void 0),
      (this.height = void 0),
      (this.position = void 0),
      (this.weight = void 0),
      (this.fullSize = void 0);
  }
  update(t, n) {
    const i = this.options;
    if (((this.left = 0), (this.top = 0), !i.display)) {
      this.width = this.height = this.right = this.bottom = 0;
      return;
    }
    (this.width = this.right = t), (this.height = this.bottom = n);
    const r = Oe(i.text) ? i.text.length : 1;
    this._padding = Tt(i.padding);
    const s = r * He(i.font).lineHeight + this._padding.height;
    this.isHorizontal() ? (this.height = s) : (this.width = s);
  }
  isHorizontal() {
    const t = this.options.position;
    return t === "top" || t === "bottom";
  }
  _drawArgs(t) {
    const { top: n, left: i, bottom: r, right: s, options: o } = this,
      l = o.align;
    let a = 0,
      u,
      c,
      f;
    return (
      this.isHorizontal()
        ? ((c = Fe(l, i, s)), (f = n + t), (u = s - i))
        : (o.position === "left"
            ? ((c = i + t), (f = Fe(l, r, n)), (a = Me * -0.5))
            : ((c = s - t), (f = Fe(l, n, r)), (a = Me * 0.5)),
          (u = r - n)),
      { titleX: c, titleY: f, maxWidth: u, rotation: a }
    );
  }
  draw() {
    const t = this.ctx,
      n = this.options;
    if (!n.display) return;
    const i = He(n.font),
      s = i.lineHeight / 2 + this._padding.top,
      { titleX: o, titleY: l, maxWidth: a, rotation: u } = this._drawArgs(s);
    Ms(t, n.text, 0, 0, i, {
      color: n.color,
      maxWidth: a,
      rotation: u,
      textAlign: Lf(n.align),
      textBaseline: "middle",
      translation: [o, l],
    });
  }
}
function PT(e, t) {
  const n = new By({ ctx: e.ctx, options: t, chart: e });
  wt.configure(e, n, t), wt.addBox(e, n), (e.titleBlock = n);
}
var OT = {
  id: "title",
  _element: By,
  start(e, t, n) {
    PT(e, n);
  },
  stop(e) {
    const t = e.titleBlock;
    wt.removeBox(e, t), delete e.titleBlock;
  },
  beforeUpdate(e, t, n) {
    const i = e.titleBlock;
    wt.configure(e, i, n), (i.options = n);
  },
  defaults: {
    align: "center",
    display: !1,
    font: { weight: "bold" },
    fullSize: !0,
    padding: 10,
    position: "top",
    text: "",
    weight: 2e3,
  },
  defaultRoutes: { color: "color" },
  descriptors: { _scriptable: !0, _indexable: !1 },
};
const Wr = {
  average(e) {
    if (!e.length) return !1;
    let t,
      n,
      i = new Set(),
      r = 0,
      s = 0;
    for (t = 0, n = e.length; t < n; ++t) {
      const l = e[t].element;
      if (l && l.hasValue()) {
        const a = l.tooltipPosition();
        i.add(a.x), (r += a.y), ++s;
      }
    }
    return s === 0 || i.size === 0
      ? !1
      : { x: [...i].reduce((l, a) => l + a) / i.size, y: r / s };
  },
  nearest(e, t) {
    if (!e.length) return !1;
    let n = t.x,
      i = t.y,
      r = Number.POSITIVE_INFINITY,
      s,
      o,
      l;
    for (s = 0, o = e.length; s < o; ++s) {
      const a = e[s].element;
      if (a && a.hasValue()) {
        const u = a.getCenterPoint(),
          c = cc(t, u);
        c < r && ((r = c), (l = a));
      }
    }
    if (l) {
      const a = l.tooltipPosition();
      (n = a.x), (i = a.y);
    }
    return { x: n, y: i };
  },
};
function Vt(e, t) {
  return t && (Oe(t) ? Array.prototype.push.apply(e, t) : e.push(t)), e;
}
function rn(e) {
  return (typeof e == "string" || e instanceof String) &&
    e.indexOf(`
`) > -1
    ? e.split(`
`)
    : e;
}
function NT(e, t) {
  const { element: n, datasetIndex: i, index: r } = t,
    s = e.getDatasetMeta(i).controller,
    { label: o, value: l } = s.getLabelAndValue(r);
  return {
    chart: e,
    label: o,
    parsed: s.getParsed(r),
    raw: e.data.datasets[i].data[r],
    formattedValue: l,
    dataset: s.getDataset(),
    dataIndex: r,
    datasetIndex: i,
    element: n,
  };
}
function Fp(e, t) {
  const n = e.chart.ctx,
    { body: i, footer: r, title: s } = e,
    { boxWidth: o, boxHeight: l } = t,
    a = He(t.bodyFont),
    u = He(t.titleFont),
    c = He(t.footerFont),
    f = s.length,
    d = r.length,
    h = i.length,
    m = Tt(t.padding);
  let v = m.height,
    _ = 0,
    g = i.reduce(
      (E, k) => E + k.before.length + k.lines.length + k.after.length,
      0
    );
  if (
    ((g += e.beforeBody.length + e.afterBody.length),
    f &&
      (v += f * u.lineHeight + (f - 1) * t.titleSpacing + t.titleMarginBottom),
    g)
  ) {
    const E = t.displayColors ? Math.max(l, a.lineHeight) : a.lineHeight;
    v += h * E + (g - h) * a.lineHeight + (g - 1) * t.bodySpacing;
  }
  d && (v += t.footerMarginTop + d * c.lineHeight + (d - 1) * t.footerSpacing);
  let y = 0;
  const w = function (E) {
    _ = Math.max(_, n.measureText(E).width + y);
  };
  return (
    n.save(),
    (n.font = u.string),
    Q(e.title, w),
    (n.font = a.string),
    Q(e.beforeBody.concat(e.afterBody), w),
    (y = t.displayColors ? o + 2 + t.boxPadding : 0),
    Q(i, (E) => {
      Q(E.before, w), Q(E.lines, w), Q(E.after, w);
    }),
    (y = 0),
    (n.font = c.string),
    Q(e.footer, w),
    n.restore(),
    (_ += m.width),
    { width: _, height: v }
  );
}
function MT(e, t) {
  const { y: n, height: i } = t;
  return n < i / 2 ? "top" : n > e.height - i / 2 ? "bottom" : "center";
}
function RT(e, t, n, i) {
  const { x: r, width: s } = i,
    o = n.caretSize + n.caretPadding;
  if ((e === "left" && r + s + o > t.width) || (e === "right" && r - s - o < 0))
    return !0;
}
function LT(e, t, n, i) {
  const { x: r, width: s } = n,
    {
      width: o,
      chartArea: { left: l, right: a },
    } = e;
  let u = "center";
  return (
    i === "center"
      ? (u = r <= (l + a) / 2 ? "left" : "right")
      : r <= s / 2
      ? (u = "left")
      : r >= o - s / 2 && (u = "right"),
    RT(u, e, t, n) && (u = "center"),
    u
  );
}
function Bp(e, t, n) {
  const i = n.yAlign || t.yAlign || MT(e, n);
  return { xAlign: n.xAlign || t.xAlign || LT(e, t, n, i), yAlign: i };
}
function IT(e, t) {
  let { x: n, width: i } = e;
  return t === "right" ? (n -= i) : t === "center" && (n -= i / 2), n;
}
function DT(e, t, n) {
  let { y: i, height: r } = e;
  return (
    t === "top" ? (i += n) : t === "bottom" ? (i -= r + n) : (i -= r / 2), i
  );
}
function Hp(e, t, n, i) {
  const { caretSize: r, caretPadding: s, cornerRadius: o } = e,
    { xAlign: l, yAlign: a } = n,
    u = r + s,
    { topLeft: c, topRight: f, bottomLeft: d, bottomRight: h } = is(o);
  let m = IT(t, l);
  const v = DT(t, a, u);
  return (
    a === "center"
      ? l === "left"
        ? (m += u)
        : l === "right" && (m -= u)
      : l === "left"
      ? (m -= Math.max(c, d) + r)
      : l === "right" && (m += Math.max(f, h) + r),
    { x: _t(m, 0, i.width - t.width), y: _t(v, 0, i.height - t.height) }
  );
}
function No(e, t, n) {
  const i = Tt(n.padding);
  return t === "center"
    ? e.x + e.width / 2
    : t === "right"
    ? e.x + e.width - i.right
    : e.x + i.left;
}
function Up(e) {
  return Vt([], rn(e));
}
function AT(e, t, n) {
  return Ti(e, { tooltip: t, tooltipItems: n, type: "tooltip" });
}
function Wp(e, t) {
  const n = t && t.dataset && t.dataset.tooltip && t.dataset.tooltip.callbacks;
  return n ? e.override(n) : e;
}
const Hy = {
  beforeTitle: tn,
  title(e) {
    if (e.length > 0) {
      const t = e[0],
        n = t.chart.data.labels,
        i = n ? n.length : 0;
      if (this && this.options && this.options.mode === "dataset")
        return t.dataset.label || "";
      if (t.label) return t.label;
      if (i > 0 && t.dataIndex < i) return n[t.dataIndex];
    }
    return "";
  },
  afterTitle: tn,
  beforeBody: tn,
  beforeLabel: tn,
  label(e) {
    if (this && this.options && this.options.mode === "dataset")
      return e.label + ": " + e.formattedValue || e.formattedValue;
    let t = e.dataset.label || "";
    t && (t += ": ");
    const n = e.formattedValue;
    return pe(n) || (t += n), t;
  },
  labelColor(e) {
    const n = e.chart
      .getDatasetMeta(e.datasetIndex)
      .controller.getStyle(e.dataIndex);
    return {
      borderColor: n.borderColor,
      backgroundColor: n.backgroundColor,
      borderWidth: n.borderWidth,
      borderDash: n.borderDash,
      borderDashOffset: n.borderDashOffset,
      borderRadius: 0,
    };
  },
  labelTextColor() {
    return this.options.bodyColor;
  },
  labelPointStyle(e) {
    const n = e.chart
      .getDatasetMeta(e.datasetIndex)
      .controller.getStyle(e.dataIndex);
    return { pointStyle: n.pointStyle, rotation: n.rotation };
  },
  afterLabel: tn,
  afterBody: tn,
  beforeFooter: tn,
  footer: tn,
  afterFooter: tn,
};
function qe(e, t, n, i) {
  const r = e[t].call(n, i);
  return typeof r > "u" ? Hy[t].call(n, i) : r;
}
class yc extends mn {
  constructor(t) {
    super(),
      (this.opacity = 0),
      (this._active = []),
      (this._eventPosition = void 0),
      (this._size = void 0),
      (this._cachedAnimations = void 0),
      (this._tooltipItems = []),
      (this.$animations = void 0),
      (this.$context = void 0),
      (this.chart = t.chart),
      (this.options = t.options),
      (this.dataPoints = void 0),
      (this.title = void 0),
      (this.beforeBody = void 0),
      (this.body = void 0),
      (this.afterBody = void 0),
      (this.footer = void 0),
      (this.xAlign = void 0),
      (this.yAlign = void 0),
      (this.x = void 0),
      (this.y = void 0),
      (this.height = void 0),
      (this.width = void 0),
      (this.caretX = void 0),
      (this.caretY = void 0),
      (this.labelColors = void 0),
      (this.labelPointStyles = void 0),
      (this.labelTextColors = void 0);
  }
  initialize(t) {
    (this.options = t),
      (this._cachedAnimations = void 0),
      (this.$context = void 0);
  }
  _resolveAnimations() {
    const t = this._cachedAnimations;
    if (t) return t;
    const n = this.chart,
      i = this.options.setContext(this.getContext()),
      r = i.enabled && n.options.animation && i.animations,
      s = new Ty(this.chart, r);
    return r._cacheable && (this._cachedAnimations = Object.freeze(s)), s;
  }
  getContext() {
    return (
      this.$context ||
      (this.$context = AT(this.chart.getContext(), this, this._tooltipItems))
    );
  }
  getTitle(t, n) {
    const { callbacks: i } = n,
      r = qe(i, "beforeTitle", this, t),
      s = qe(i, "title", this, t),
      o = qe(i, "afterTitle", this, t);
    let l = [];
    return (l = Vt(l, rn(r))), (l = Vt(l, rn(s))), (l = Vt(l, rn(o))), l;
  }
  getBeforeBody(t, n) {
    return Up(qe(n.callbacks, "beforeBody", this, t));
  }
  getBody(t, n) {
    const { callbacks: i } = n,
      r = [];
    return (
      Q(t, (s) => {
        const o = { before: [], lines: [], after: [] },
          l = Wp(i, s);
        Vt(o.before, rn(qe(l, "beforeLabel", this, s))),
          Vt(o.lines, qe(l, "label", this, s)),
          Vt(o.after, rn(qe(l, "afterLabel", this, s))),
          r.push(o);
      }),
      r
    );
  }
  getAfterBody(t, n) {
    return Up(qe(n.callbacks, "afterBody", this, t));
  }
  getFooter(t, n) {
    const { callbacks: i } = n,
      r = qe(i, "beforeFooter", this, t),
      s = qe(i, "footer", this, t),
      o = qe(i, "afterFooter", this, t);
    let l = [];
    return (l = Vt(l, rn(r))), (l = Vt(l, rn(s))), (l = Vt(l, rn(o))), l;
  }
  _createItems(t) {
    const n = this._active,
      i = this.chart.data,
      r = [],
      s = [],
      o = [];
    let l = [],
      a,
      u;
    for (a = 0, u = n.length; a < u; ++a) l.push(NT(this.chart, n[a]));
    return (
      t.filter && (l = l.filter((c, f, d) => t.filter(c, f, d, i))),
      t.itemSort && (l = l.sort((c, f) => t.itemSort(c, f, i))),
      Q(l, (c) => {
        const f = Wp(t.callbacks, c);
        r.push(qe(f, "labelColor", this, c)),
          s.push(qe(f, "labelPointStyle", this, c)),
          o.push(qe(f, "labelTextColor", this, c));
      }),
      (this.labelColors = r),
      (this.labelPointStyles = s),
      (this.labelTextColors = o),
      (this.dataPoints = l),
      l
    );
  }
  update(t, n) {
    const i = this.options.setContext(this.getContext()),
      r = this._active;
    let s,
      o = [];
    if (!r.length) this.opacity !== 0 && (s = { opacity: 0 });
    else {
      const l = Wr[i.position].call(this, r, this._eventPosition);
      (o = this._createItems(i)),
        (this.title = this.getTitle(o, i)),
        (this.beforeBody = this.getBeforeBody(o, i)),
        (this.body = this.getBody(o, i)),
        (this.afterBody = this.getAfterBody(o, i)),
        (this.footer = this.getFooter(o, i));
      const a = (this._size = Fp(this, i)),
        u = Object.assign({}, l, a),
        c = Bp(this.chart, i, u),
        f = Hp(i, u, c, this.chart);
      (this.xAlign = c.xAlign),
        (this.yAlign = c.yAlign),
        (s = {
          opacity: 1,
          x: f.x,
          y: f.y,
          width: a.width,
          height: a.height,
          caretX: l.x,
          caretY: l.y,
        });
    }
    (this._tooltipItems = o),
      (this.$context = void 0),
      s && this._resolveAnimations().update(this, s),
      t &&
        i.external &&
        i.external.call(this, { chart: this.chart, tooltip: this, replay: n });
  }
  drawCaret(t, n, i, r) {
    const s = this.getCaretPosition(t, i, r);
    n.lineTo(s.x1, s.y1), n.lineTo(s.x2, s.y2), n.lineTo(s.x3, s.y3);
  }
  getCaretPosition(t, n, i) {
    const { xAlign: r, yAlign: s } = this,
      { caretSize: o, cornerRadius: l } = i,
      { topLeft: a, topRight: u, bottomLeft: c, bottomRight: f } = is(l),
      { x: d, y: h } = t,
      { width: m, height: v } = n;
    let _, g, y, w, E, k;
    return (
      s === "center"
        ? ((E = h + v / 2),
          r === "left"
            ? ((_ = d), (g = _ - o), (w = E + o), (k = E - o))
            : ((_ = d + m), (g = _ + o), (w = E - o), (k = E + o)),
          (y = _))
        : (r === "left"
            ? (g = d + Math.max(a, c) + o)
            : r === "right"
            ? (g = d + m - Math.max(u, f) - o)
            : (g = this.caretX),
          s === "top"
            ? ((w = h), (E = w - o), (_ = g - o), (y = g + o))
            : ((w = h + v), (E = w + o), (_ = g + o), (y = g - o)),
          (k = w)),
      { x1: _, x2: g, x3: y, y1: w, y2: E, y3: k }
    );
  }
  drawTitle(t, n, i) {
    const r = this.title,
      s = r.length;
    let o, l, a;
    if (s) {
      const u = Ki(i.rtl, this.x, this.width);
      for (
        t.x = No(this, i.titleAlign, i),
          n.textAlign = u.textAlign(i.titleAlign),
          n.textBaseline = "middle",
          o = He(i.titleFont),
          l = i.titleSpacing,
          n.fillStyle = i.titleColor,
          n.font = o.string,
          a = 0;
        a < s;
        ++a
      )
        n.fillText(r[a], u.x(t.x), t.y + o.lineHeight / 2),
          (t.y += o.lineHeight + l),
          a + 1 === s && (t.y += i.titleMarginBottom - l);
    }
  }
  _drawColorBox(t, n, i, r, s) {
    const o = this.labelColors[i],
      l = this.labelPointStyles[i],
      { boxHeight: a, boxWidth: u } = s,
      c = He(s.bodyFont),
      f = No(this, "left", s),
      d = r.x(f),
      h = a < c.lineHeight ? (c.lineHeight - a) / 2 : 0,
      m = n.y + h;
    if (s.usePointStyle) {
      const v = {
          radius: Math.min(u, a) / 2,
          pointStyle: l.pointStyle,
          rotation: l.rotation,
          borderWidth: 1,
        },
        _ = r.leftForLtr(d, u) + u / 2,
        g = m + a / 2;
      (t.strokeStyle = s.multiKeyBackground),
        (t.fillStyle = s.multiKeyBackground),
        dc(t, v, _, g),
        (t.strokeStyle = o.borderColor),
        (t.fillStyle = o.backgroundColor),
        dc(t, v, _, g);
    } else {
      (t.lineWidth = te(o.borderWidth)
        ? Math.max(...Object.values(o.borderWidth))
        : o.borderWidth || 1),
        (t.strokeStyle = o.borderColor),
        t.setLineDash(o.borderDash || []),
        (t.lineDashOffset = o.borderDashOffset || 0);
      const v = r.leftForLtr(d, u),
        _ = r.leftForLtr(r.xPlus(d, 1), u - 2),
        g = is(o.borderRadius);
      Object.values(g).some((y) => y !== 0)
        ? (t.beginPath(),
          (t.fillStyle = s.multiKeyBackground),
          hc(t, { x: v, y: m, w: u, h: a, radius: g }),
          t.fill(),
          t.stroke(),
          (t.fillStyle = o.backgroundColor),
          t.beginPath(),
          hc(t, { x: _, y: m + 1, w: u - 2, h: a - 2, radius: g }),
          t.fill())
        : ((t.fillStyle = s.multiKeyBackground),
          t.fillRect(v, m, u, a),
          t.strokeRect(v, m, u, a),
          (t.fillStyle = o.backgroundColor),
          t.fillRect(_, m + 1, u - 2, a - 2));
    }
    t.fillStyle = this.labelTextColors[i];
  }
  drawBody(t, n, i) {
    const { body: r } = this,
      {
        bodySpacing: s,
        bodyAlign: o,
        displayColors: l,
        boxHeight: a,
        boxWidth: u,
        boxPadding: c,
      } = i,
      f = He(i.bodyFont);
    let d = f.lineHeight,
      h = 0;
    const m = Ki(i.rtl, this.x, this.width),
      v = function (N) {
        n.fillText(N, m.x(t.x + h), t.y + d / 2), (t.y += d + s);
      },
      _ = m.textAlign(o);
    let g, y, w, E, k, P, C;
    for (
      n.textAlign = o,
        n.textBaseline = "middle",
        n.font = f.string,
        t.x = No(this, _, i),
        n.fillStyle = i.bodyColor,
        Q(this.beforeBody, v),
        h = l && _ !== "right" ? (o === "center" ? u / 2 + c : u + 2 + c) : 0,
        E = 0,
        P = r.length;
      E < P;
      ++E
    ) {
      for (
        g = r[E],
          y = this.labelTextColors[E],
          n.fillStyle = y,
          Q(g.before, v),
          w = g.lines,
          l &&
            w.length &&
            (this._drawColorBox(n, t, E, m, i),
            (d = Math.max(f.lineHeight, a))),
          k = 0,
          C = w.length;
        k < C;
        ++k
      )
        v(w[k]), (d = f.lineHeight);
      Q(g.after, v);
    }
    (h = 0), (d = f.lineHeight), Q(this.afterBody, v), (t.y -= s);
  }
  drawFooter(t, n, i) {
    const r = this.footer,
      s = r.length;
    let o, l;
    if (s) {
      const a = Ki(i.rtl, this.x, this.width);
      for (
        t.x = No(this, i.footerAlign, i),
          t.y += i.footerMarginTop,
          n.textAlign = a.textAlign(i.footerAlign),
          n.textBaseline = "middle",
          o = He(i.footerFont),
          n.fillStyle = i.footerColor,
          n.font = o.string,
          l = 0;
        l < s;
        ++l
      )
        n.fillText(r[l], a.x(t.x), t.y + o.lineHeight / 2),
          (t.y += o.lineHeight + i.footerSpacing);
    }
  }
  drawBackground(t, n, i, r) {
    const { xAlign: s, yAlign: o } = this,
      { x: l, y: a } = t,
      { width: u, height: c } = i,
      {
        topLeft: f,
        topRight: d,
        bottomLeft: h,
        bottomRight: m,
      } = is(r.cornerRadius);
    (n.fillStyle = r.backgroundColor),
      (n.strokeStyle = r.borderColor),
      (n.lineWidth = r.borderWidth),
      n.beginPath(),
      n.moveTo(l + f, a),
      o === "top" && this.drawCaret(t, n, i, r),
      n.lineTo(l + u - d, a),
      n.quadraticCurveTo(l + u, a, l + u, a + d),
      o === "center" && s === "right" && this.drawCaret(t, n, i, r),
      n.lineTo(l + u, a + c - m),
      n.quadraticCurveTo(l + u, a + c, l + u - m, a + c),
      o === "bottom" && this.drawCaret(t, n, i, r),
      n.lineTo(l + h, a + c),
      n.quadraticCurveTo(l, a + c, l, a + c - h),
      o === "center" && s === "left" && this.drawCaret(t, n, i, r),
      n.lineTo(l, a + f),
      n.quadraticCurveTo(l, a, l + f, a),
      n.closePath(),
      n.fill(),
      r.borderWidth > 0 && n.stroke();
  }
  _updateAnimationTarget(t) {
    const n = this.chart,
      i = this.$animations,
      r = i && i.x,
      s = i && i.y;
    if (r || s) {
      const o = Wr[t.position].call(this, this._active, this._eventPosition);
      if (!o) return;
      const l = (this._size = Fp(this, t)),
        a = Object.assign({}, o, this._size),
        u = Bp(n, t, a),
        c = Hp(t, a, u, n);
      (r._to !== c.x || s._to !== c.y) &&
        ((this.xAlign = u.xAlign),
        (this.yAlign = u.yAlign),
        (this.width = l.width),
        (this.height = l.height),
        (this.caretX = o.x),
        (this.caretY = o.y),
        this._resolveAnimations().update(this, c));
    }
  }
  _willRender() {
    return !!this.opacity;
  }
  draw(t) {
    const n = this.options.setContext(this.getContext());
    let i = this.opacity;
    if (!i) return;
    this._updateAnimationTarget(n);
    const r = { width: this.width, height: this.height },
      s = { x: this.x, y: this.y };
    i = Math.abs(i) < 0.001 ? 0 : i;
    const o = Tt(n.padding),
      l =
        this.title.length ||
        this.beforeBody.length ||
        this.body.length ||
        this.afterBody.length ||
        this.footer.length;
    n.enabled &&
      l &&
      (t.save(),
      (t.globalAlpha = i),
      this.drawBackground(s, t, r, n),
      by(t, n.textDirection),
      (s.y += o.top),
      this.drawTitle(s, t, n),
      this.drawBody(s, t, n),
      this.drawFooter(s, t, n),
      Ey(t, n.textDirection),
      t.restore());
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(t, n) {
    const i = this._active,
      r = t.map(({ datasetIndex: l, index: a }) => {
        const u = this.chart.getDatasetMeta(l);
        if (!u) throw new Error("Cannot find a dataset at index " + l);
        return { datasetIndex: l, element: u.data[a], index: a };
      }),
      s = !Tl(i, r),
      o = this._positionChanged(r, n);
    (s || o) &&
      ((this._active = r),
      (this._eventPosition = n),
      (this._ignoreReplayEvents = !0),
      this.update(!0));
  }
  handleEvent(t, n, i = !0) {
    if (n && this._ignoreReplayEvents) return !1;
    this._ignoreReplayEvents = !1;
    const r = this.options,
      s = this._active || [],
      o = this._getActiveElements(t, s, n, i),
      l = this._positionChanged(o, t),
      a = n || !Tl(o, s) || l;
    return (
      a &&
        ((this._active = o),
        (r.enabled || r.external) &&
          ((this._eventPosition = { x: t.x, y: t.y }), this.update(!0, n))),
      a
    );
  }
  _getActiveElements(t, n, i, r) {
    const s = this.options;
    if (t.type === "mouseout") return [];
    if (!r)
      return n.filter(
        (l) =>
          this.chart.data.datasets[l.datasetIndex] &&
          this.chart
            .getDatasetMeta(l.datasetIndex)
            .controller.getParsed(l.index) !== void 0
      );
    const o = this.chart.getElementsAtEventForMode(t, s.mode, s, i);
    return s.reverse && o.reverse(), o;
  }
  _positionChanged(t, n) {
    const { caretX: i, caretY: r, options: s } = this,
      o = Wr[s.position].call(this, t, n);
    return o !== !1 && (i !== o.x || r !== o.y);
  }
}
Y(yc, "positioners", Wr);
var jT = {
  id: "tooltip",
  _element: yc,
  positioners: Wr,
  afterInit(e, t, n) {
    n && (e.tooltip = new yc({ chart: e, options: n }));
  },
  beforeUpdate(e, t, n) {
    e.tooltip && e.tooltip.initialize(n);
  },
  reset(e, t, n) {
    e.tooltip && e.tooltip.initialize(n);
  },
  afterDraw(e) {
    const t = e.tooltip;
    if (t && t._willRender()) {
      const n = { tooltip: t };
      if (e.notifyPlugins("beforeTooltipDraw", { ...n, cancelable: !0 }) === !1)
        return;
      t.draw(e.ctx), e.notifyPlugins("afterTooltipDraw", n);
    }
  },
  afterEvent(e, t) {
    if (e.tooltip) {
      const n = t.replay;
      e.tooltip.handleEvent(t.event, n, t.inChartArea) && (t.changed = !0);
    }
  },
  defaults: {
    enabled: !0,
    external: null,
    position: "average",
    backgroundColor: "rgba(0,0,0,0.8)",
    titleColor: "#fff",
    titleFont: { weight: "bold" },
    titleSpacing: 2,
    titleMarginBottom: 6,
    titleAlign: "left",
    bodyColor: "#fff",
    bodySpacing: 2,
    bodyFont: {},
    bodyAlign: "left",
    footerColor: "#fff",
    footerSpacing: 2,
    footerMarginTop: 6,
    footerFont: { weight: "bold" },
    footerAlign: "left",
    padding: 6,
    caretPadding: 2,
    caretSize: 5,
    cornerRadius: 6,
    boxHeight: (e, t) => t.bodyFont.size,
    boxWidth: (e, t) => t.bodyFont.size,
    multiKeyBackground: "#fff",
    displayColors: !0,
    boxPadding: 0,
    borderColor: "rgba(0,0,0,0)",
    borderWidth: 0,
    animation: { duration: 400, easing: "easeOutQuart" },
    animations: {
      numbers: {
        type: "number",
        properties: ["x", "y", "width", "height", "caretX", "caretY"],
      },
      opacity: { easing: "linear", duration: 200 },
    },
    callbacks: Hy,
  },
  defaultRoutes: { bodyFont: "font", footerFont: "font", titleFont: "font" },
  descriptors: {
    _scriptable: (e) => e !== "filter" && e !== "itemSort" && e !== "external",
    _indexable: !1,
    callbacks: { _scriptable: !1, _indexable: !1 },
    animation: { _fallback: !1 },
    animations: { _fallback: "animation" },
  },
  additionalOptionScopes: ["interaction"],
};
const zT = (e, t, n, i) => (
  typeof t == "string"
    ? ((n = e.push(t) - 1), i.unshift({ index: n, label: t }))
    : isNaN(t) && (n = null),
  n
);
function FT(e, t, n, i) {
  const r = e.indexOf(t);
  if (r === -1) return zT(e, t, n, i);
  const s = e.lastIndexOf(t);
  return r !== s ? n : r;
}
const BT = (e, t) => (e === null ? null : _t(Math.round(e), 0, t));
function Vp(e) {
  const t = this.getLabels();
  return e >= 0 && e < t.length ? t[e] : e;
}
class vc extends cr {
  constructor(t) {
    super(t),
      (this._startValue = void 0),
      (this._valueRange = 0),
      (this._addedLabels = []);
  }
  init(t) {
    const n = this._addedLabels;
    if (n.length) {
      const i = this.getLabels();
      for (const { index: r, label: s } of n) i[r] === s && i.splice(r, 1);
      this._addedLabels = [];
    }
    super.init(t);
  }
  parse(t, n) {
    if (pe(t)) return null;
    const i = this.getLabels();
    return (
      (n =
        isFinite(n) && i[n] === t ? n : FT(i, t, K(n, t), this._addedLabels)),
      BT(n, i.length - 1)
    );
  }
  determineDataLimits() {
    const { minDefined: t, maxDefined: n } = this.getUserBounds();
    let { min: i, max: r } = this.getMinMax(!0);
    this.options.bounds === "ticks" &&
      (t || (i = 0), n || (r = this.getLabels().length - 1)),
      (this.min = i),
      (this.max = r);
  }
  buildTicks() {
    const t = this.min,
      n = this.max,
      i = this.options.offset,
      r = [];
    let s = this.getLabels();
    (s = t === 0 && n === s.length - 1 ? s : s.slice(t, n + 1)),
      (this._valueRange = Math.max(s.length - (i ? 0 : 1), 1)),
      (this._startValue = this.min - (i ? 0.5 : 0));
    for (let o = t; o <= n; o++) r.push({ value: o });
    return r;
  }
  getLabelForValue(t) {
    return Vp.call(this, t);
  }
  configure() {
    super.configure(),
      this.isHorizontal() || (this._reversePixels = !this._reversePixels);
  }
  getPixelForValue(t) {
    return (
      typeof t != "number" && (t = this.parse(t)),
      t === null
        ? NaN
        : this.getPixelForDecimal((t - this._startValue) / this._valueRange)
    );
  }
  getPixelForTick(t) {
    const n = this.ticks;
    return t < 0 || t > n.length - 1 ? null : this.getPixelForValue(n[t].value);
  }
  getValueForPixel(t) {
    return Math.round(
      this._startValue + this.getDecimalForPixel(t) * this._valueRange
    );
  }
  getBasePixel() {
    return this.bottom;
  }
}
Y(vc, "id", "category"), Y(vc, "defaults", { ticks: { callback: Vp } });
function HT(e, t) {
  const n = [],
    {
      bounds: r,
      step: s,
      min: o,
      max: l,
      precision: a,
      count: u,
      maxTicks: c,
      maxDigits: f,
      includeBounds: d,
    } = e,
    h = s || 1,
    m = c - 1,
    { min: v, max: _ } = t,
    g = !pe(o),
    y = !pe(l),
    w = !pe(u),
    E = (_ - v) / (f + 1);
  let k = qh((_ - v) / m / h) * h,
    P,
    C,
    N,
    I;
  if (k < 1e-14 && !g && !y) return [{ value: v }, { value: _ }];
  (I = Math.ceil(_ / k) - Math.floor(v / k)),
    I > m && (k = qh((I * k) / m / h) * h),
    pe(a) || ((P = Math.pow(10, a)), (k = Math.ceil(k * P) / P)),
    r === "ticks"
      ? ((C = Math.floor(v / k) * k), (N = Math.ceil(_ / k) * k))
      : ((C = v), (N = _)),
    g && y && s && Pb((l - o) / s, k / 1e3)
      ? ((I = Math.round(Math.min((l - o) / k, c))),
        (k = (l - o) / I),
        (C = o),
        (N = l))
      : w
      ? ((C = g ? o : C), (N = y ? l : N), (I = u - 1), (k = (N - C) / I))
      : ((I = (N - C) / k),
        es(I, Math.round(I), k / 1e3)
          ? (I = Math.round(I))
          : (I = Math.ceil(I)));
  const D = Math.max(Qh(k), Qh(C));
  (P = Math.pow(10, pe(a) ? D : a)),
    (C = Math.round(C * P) / P),
    (N = Math.round(N * P) / P);
  let F = 0;
  for (
    g &&
    (d && C !== o
      ? (n.push({ value: o }),
        C < o && F++,
        es(Math.round((C + F * k) * P) / P, o, $p(o, E, e)) && F++)
      : C < o && F++);
    F < I;
    ++F
  ) {
    const B = Math.round((C + F * k) * P) / P;
    if (y && B > l) break;
    n.push({ value: B });
  }
  return (
    y && d && N !== l
      ? n.length && es(n[n.length - 1].value, l, $p(l, E, e))
        ? (n[n.length - 1].value = l)
        : n.push({ value: l })
      : (!y || N === l) && n.push({ value: N }),
    n
  );
}
function $p(e, t, { horizontal: n, minRotation: i }) {
  const r = ai(i),
    s = (n ? Math.sin(r) : Math.cos(r)) || 0.001,
    o = 0.75 * t * ("" + e).length;
  return Math.min(t / s, o);
}
class UT extends cr {
  constructor(t) {
    super(t),
      (this.start = void 0),
      (this.end = void 0),
      (this._startValue = void 0),
      (this._endValue = void 0),
      (this._valueRange = 0);
  }
  parse(t, n) {
    return pe(t) ||
      ((typeof t == "number" || t instanceof Number) && !isFinite(+t))
      ? null
      : +t;
  }
  handleTickRangeOptions() {
    const { beginAtZero: t } = this.options,
      { minDefined: n, maxDefined: i } = this.getUserBounds();
    let { min: r, max: s } = this;
    const o = (a) => (r = n ? r : a),
      l = (a) => (s = i ? s : a);
    if (t) {
      const a = Vn(r),
        u = Vn(s);
      a < 0 && u < 0 ? l(0) : a > 0 && u > 0 && o(0);
    }
    if (r === s) {
      let a = s === 0 ? 1 : Math.abs(s * 0.05);
      l(s + a), t || o(r - a);
    }
    (this.min = r), (this.max = s);
  }
  getTickLimit() {
    const t = this.options.ticks;
    let { maxTicksLimit: n, stepSize: i } = t,
      r;
    return (
      i
        ? ((r = Math.ceil(this.max / i) - Math.floor(this.min / i) + 1),
          r > 1e3 &&
            (console.warn(
              `scales.${this.id}.ticks.stepSize: ${i} would result generating up to ${r} ticks. Limiting to 1000.`
            ),
            (r = 1e3)))
        : ((r = this.computeTickLimit()), (n = n || 11)),
      n && (r = Math.min(n, r)),
      r
    );
  }
  computeTickLimit() {
    return Number.POSITIVE_INFINITY;
  }
  buildTicks() {
    const t = this.options,
      n = t.ticks;
    let i = this.getTickLimit();
    i = Math.max(2, i);
    const r = {
        maxTicks: i,
        bounds: t.bounds,
        min: t.min,
        max: t.max,
        precision: n.precision,
        step: n.stepSize,
        count: n.count,
        maxDigits: this._maxDigits(),
        horizontal: this.isHorizontal(),
        minRotation: n.minRotation || 0,
        includeBounds: n.includeBounds !== !1,
      },
      s = this._range || this,
      o = HT(r, s);
    return (
      t.bounds === "ticks" && Ob(o, this, "value"),
      t.reverse
        ? (o.reverse(), (this.start = this.max), (this.end = this.min))
        : ((this.start = this.min), (this.end = this.max)),
      o
    );
  }
  configure() {
    const t = this.ticks;
    let n = this.min,
      i = this.max;
    if ((super.configure(), this.options.offset && t.length)) {
      const r = (i - n) / Math.max(t.length - 1, 1) / 2;
      (n -= r), (i += r);
    }
    (this._startValue = n), (this._endValue = i), (this._valueRange = i - n);
  }
  getLabelForValue(t) {
    return hy(t, this.chart.options.locale, this.options.ticks.format);
  }
}
class xc extends UT {
  determineDataLimits() {
    const { min: t, max: n } = this.getMinMax(!0);
    (this.min = kt(t) ? t : 0),
      (this.max = kt(n) ? n : 1),
      this.handleTickRangeOptions();
  }
  computeTickLimit() {
    const t = this.isHorizontal(),
      n = t ? this.width : this.height,
      i = ai(this.options.ticks.minRotation),
      r = (t ? Math.sin(i) : Math.cos(i)) || 0.001,
      s = this._resolveTickFontOptions(0);
    return Math.ceil(n / Math.min(40, s.lineHeight / r));
  }
  getPixelForValue(t) {
    return t === null
      ? NaN
      : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
  }
  getValueForPixel(t) {
    return this._startValue + this.getDecimalForPixel(t) * this._valueRange;
  }
}
Y(xc, "id", "linear"),
  Y(xc, "defaults", { ticks: { callback: my.formatters.numeric } });
const la = {
    millisecond: { common: !0, size: 1, steps: 1e3 },
    second: { common: !0, size: 1e3, steps: 60 },
    minute: { common: !0, size: 6e4, steps: 60 },
    hour: { common: !0, size: 36e5, steps: 24 },
    day: { common: !0, size: 864e5, steps: 30 },
    week: { common: !1, size: 6048e5, steps: 4 },
    month: { common: !0, size: 2628e6, steps: 12 },
    quarter: { common: !1, size: 7884e6, steps: 4 },
    year: { common: !0, size: 3154e7 },
  },
  Ze = Object.keys(la);
function Yp(e, t) {
  return e - t;
}
function Xp(e, t) {
  if (pe(t)) return null;
  const n = e._adapter,
    { parser: i, round: r, isoWeekday: s } = e._parseOpts;
  let o = t;
  return (
    typeof i == "function" && (o = i(o)),
    kt(o) || (o = typeof i == "string" ? n.parse(o, i) : n.parse(o)),
    o === null
      ? null
      : (r &&
          (o =
            r === "week" && (Os(s) || s === !0)
              ? n.startOf(o, "isoWeek", s)
              : n.startOf(o, r)),
        +o)
  );
}
function Kp(e, t, n, i) {
  const r = Ze.length;
  for (let s = Ze.indexOf(e); s < r - 1; ++s) {
    const o = la[Ze[s]],
      l = o.steps ? o.steps : Number.MAX_SAFE_INTEGER;
    if (o.common && Math.ceil((n - t) / (l * o.size)) <= i) return Ze[s];
  }
  return Ze[r - 1];
}
function WT(e, t, n, i, r) {
  for (let s = Ze.length - 1; s >= Ze.indexOf(n); s--) {
    const o = Ze[s];
    if (la[o].common && e._adapter.diff(r, i, o) >= t - 1) return o;
  }
  return Ze[n ? Ze.indexOf(n) : 0];
}
function VT(e) {
  for (let t = Ze.indexOf(e) + 1, n = Ze.length; t < n; ++t)
    if (la[Ze[t]].common) return Ze[t];
}
function qp(e, t, n) {
  if (!n) e[t] = !0;
  else if (n.length) {
    const { lo: i, hi: r } = Rf(n, t),
      s = n[i] >= t ? n[i] : n[r];
    e[s] = !0;
  }
}
function $T(e, t, n, i) {
  const r = e._adapter,
    s = +r.startOf(t[0].value, i),
    o = t[t.length - 1].value;
  let l, a;
  for (l = s; l <= o; l = +r.add(l, 1, i))
    (a = n[l]), a >= 0 && (t[a].major = !0);
  return t;
}
function Qp(e, t, n) {
  const i = [],
    r = {},
    s = t.length;
  let o, l;
  for (o = 0; o < s; ++o)
    (l = t[o]), (r[l] = o), i.push({ value: l, major: !1 });
  return s === 0 || !n ? i : $T(e, i, r, n);
}
class Ll extends cr {
  constructor(t) {
    super(t),
      (this._cache = { data: [], labels: [], all: [] }),
      (this._unit = "day"),
      (this._majorUnit = void 0),
      (this._offsets = {}),
      (this._normalized = !1),
      (this._parseOpts = void 0);
  }
  init(t, n = {}) {
    const i = t.time || (t.time = {}),
      r = (this._adapter = new ik._date(t.adapters.date));
    r.init(n),
      Jr(i.displayFormats, r.formats()),
      (this._parseOpts = {
        parser: i.parser,
        round: i.round,
        isoWeekday: i.isoWeekday,
      }),
      super.init(t),
      (this._normalized = n.normalized);
  }
  parse(t, n) {
    return t === void 0 ? null : Xp(this, t);
  }
  beforeLayout() {
    super.beforeLayout(), (this._cache = { data: [], labels: [], all: [] });
  }
  determineDataLimits() {
    const t = this.options,
      n = this._adapter,
      i = t.time.unit || "day";
    let { min: r, max: s, minDefined: o, maxDefined: l } = this.getUserBounds();
    function a(u) {
      !o && !isNaN(u.min) && (r = Math.min(r, u.min)),
        !l && !isNaN(u.max) && (s = Math.max(s, u.max));
    }
    (!o || !l) &&
      (a(this._getLabelBounds()),
      (t.bounds !== "ticks" || t.ticks.source !== "labels") &&
        a(this.getMinMax(!1))),
      (r = kt(r) && !isNaN(r) ? r : +n.startOf(Date.now(), i)),
      (s = kt(s) && !isNaN(s) ? s : +n.endOf(Date.now(), i) + 1),
      (this.min = Math.min(r, s - 1)),
      (this.max = Math.max(r + 1, s));
  }
  _getLabelBounds() {
    const t = this.getLabelTimestamps();
    let n = Number.POSITIVE_INFINITY,
      i = Number.NEGATIVE_INFINITY;
    return t.length && ((n = t[0]), (i = t[t.length - 1])), { min: n, max: i };
  }
  buildTicks() {
    const t = this.options,
      n = t.time,
      i = t.ticks,
      r = i.source === "labels" ? this.getLabelTimestamps() : this._generate();
    t.bounds === "ticks" &&
      r.length &&
      ((this.min = this._userMin || r[0]),
      (this.max = this._userMax || r[r.length - 1]));
    const s = this.min,
      o = this.max,
      l = Db(r, s, o);
    return (
      (this._unit =
        n.unit ||
        (i.autoSkip
          ? Kp(n.minUnit, this.min, this.max, this._getLabelCapacity(s))
          : WT(this, l.length, n.minUnit, this.min, this.max))),
      (this._majorUnit =
        !i.major.enabled || this._unit === "year" ? void 0 : VT(this._unit)),
      this.initOffsets(r),
      t.reverse && l.reverse(),
      Qp(this, l, this._majorUnit)
    );
  }
  afterAutoSkip() {
    this.options.offsetAfterAutoskip &&
      this.initOffsets(this.ticks.map((t) => +t.value));
  }
  initOffsets(t = []) {
    let n = 0,
      i = 0,
      r,
      s;
    this.options.offset &&
      t.length &&
      ((r = this.getDecimalForValue(t[0])),
      t.length === 1
        ? (n = 1 - r)
        : (n = (this.getDecimalForValue(t[1]) - r) / 2),
      (s = this.getDecimalForValue(t[t.length - 1])),
      t.length === 1
        ? (i = s)
        : (i = (s - this.getDecimalForValue(t[t.length - 2])) / 2));
    const o = t.length < 3 ? 0.5 : 0.25;
    (n = _t(n, 0, o)),
      (i = _t(i, 0, o)),
      (this._offsets = { start: n, end: i, factor: 1 / (n + 1 + i) });
  }
  _generate() {
    const t = this._adapter,
      n = this.min,
      i = this.max,
      r = this.options,
      s = r.time,
      o = s.unit || Kp(s.minUnit, n, i, this._getLabelCapacity(n)),
      l = K(r.ticks.stepSize, 1),
      a = o === "week" ? s.isoWeekday : !1,
      u = Os(a) || a === !0,
      c = {};
    let f = n,
      d,
      h;
    if (
      (u && (f = +t.startOf(f, "isoWeek", a)),
      (f = +t.startOf(f, u ? "day" : o)),
      t.diff(i, n, o) > 1e5 * l)
    )
      throw new Error(
        n + " and " + i + " are too far apart with stepSize of " + l + " " + o
      );
    const m = r.ticks.source === "data" && this.getDataTimestamps();
    for (d = f, h = 0; d < i; d = +t.add(d, l, o), h++) qp(c, d, m);
    return (
      (d === i || r.bounds === "ticks" || h === 1) && qp(c, d, m),
      Object.keys(c)
        .sort(Yp)
        .map((v) => +v)
    );
  }
  getLabelForValue(t) {
    const n = this._adapter,
      i = this.options.time;
    return i.tooltipFormat
      ? n.format(t, i.tooltipFormat)
      : n.format(t, i.displayFormats.datetime);
  }
  format(t, n) {
    const r = this.options.time.displayFormats,
      s = this._unit,
      o = n || r[s];
    return this._adapter.format(t, o);
  }
  _tickFormatFunction(t, n, i, r) {
    const s = this.options,
      o = s.ticks.callback;
    if (o) return W(o, [t, n, i], this);
    const l = s.time.displayFormats,
      a = this._unit,
      u = this._majorUnit,
      c = a && l[a],
      f = u && l[u],
      d = i[n],
      h = u && f && d && d.major;
    return this._adapter.format(t, r || (h ? f : c));
  }
  generateTickLabels(t) {
    let n, i, r;
    for (n = 0, i = t.length; n < i; ++n)
      (r = t[n]), (r.label = this._tickFormatFunction(r.value, n, t));
  }
  getDecimalForValue(t) {
    return t === null ? NaN : (t - this.min) / (this.max - this.min);
  }
  getPixelForValue(t) {
    const n = this._offsets,
      i = this.getDecimalForValue(t);
    return this.getPixelForDecimal((n.start + i) * n.factor);
  }
  getValueForPixel(t) {
    const n = this._offsets,
      i = this.getDecimalForPixel(t) / n.factor - n.end;
    return this.min + i * (this.max - this.min);
  }
  _getLabelSize(t) {
    const n = this.options.ticks,
      i = this.ctx.measureText(t).width,
      r = ai(this.isHorizontal() ? n.maxRotation : n.minRotation),
      s = Math.cos(r),
      o = Math.sin(r),
      l = this._resolveTickFontOptions(0).size;
    return { w: i * s + l * o, h: i * o + l * s };
  }
  _getLabelCapacity(t) {
    const n = this.options.time,
      i = n.displayFormats,
      r = i[n.unit] || i.millisecond,
      s = this._tickFormatFunction(t, 0, Qp(this, [t], this._majorUnit), r),
      o = this._getLabelSize(s),
      l =
        Math.floor(this.isHorizontal() ? this.width / o.w : this.height / o.h) -
        1;
    return l > 0 ? l : 1;
  }
  getDataTimestamps() {
    let t = this._cache.data || [],
      n,
      i;
    if (t.length) return t;
    const r = this.getMatchingVisibleMetas();
    if (this._normalized && r.length)
      return (this._cache.data = r[0].controller.getAllParsedValues(this));
    for (n = 0, i = r.length; n < i; ++n)
      t = t.concat(r[n].controller.getAllParsedValues(this));
    return (this._cache.data = this.normalize(t));
  }
  getLabelTimestamps() {
    const t = this._cache.labels || [];
    let n, i;
    if (t.length) return t;
    const r = this.getLabels();
    for (n = 0, i = r.length; n < i; ++n) t.push(Xp(this, r[n]));
    return (this._cache.labels = this._normalized ? t : this.normalize(t));
  }
  normalize(t) {
    return jb(t.sort(Yp));
  }
}
Y(Ll, "id", "time"),
  Y(Ll, "defaults", {
    bounds: "data",
    adapters: {},
    time: {
      parser: !1,
      unit: !1,
      round: !1,
      isoWeekday: !1,
      minUnit: "millisecond",
      displayFormats: {},
    },
    ticks: { source: "auto", callback: !1, major: { enabled: !1 } },
  });
function Mo(e, t, n) {
  let i = 0,
    r = e.length - 1,
    s,
    o,
    l,
    a;
  n
    ? (t >= e[i].pos && t <= e[r].pos && ({ lo: i, hi: r } = ui(e, "pos", t)),
      ({ pos: s, time: l } = e[i]),
      ({ pos: o, time: a } = e[r]))
    : (t >= e[i].time &&
        t <= e[r].time &&
        ({ lo: i, hi: r } = ui(e, "time", t)),
      ({ time: s, pos: l } = e[i]),
      ({ time: o, pos: a } = e[r]));
  const u = o - s;
  return u ? l + ((a - l) * (t - s)) / u : l;
}
class Gp extends Ll {
  constructor(t) {
    super(t),
      (this._table = []),
      (this._minPos = void 0),
      (this._tableRange = void 0);
  }
  initOffsets() {
    const t = this._getTimestampsForTable(),
      n = (this._table = this.buildLookupTable(t));
    (this._minPos = Mo(n, this.min)),
      (this._tableRange = Mo(n, this.max) - this._minPos),
      super.initOffsets(t);
  }
  buildLookupTable(t) {
    const { min: n, max: i } = this,
      r = [],
      s = [];
    let o, l, a, u, c;
    for (o = 0, l = t.length; o < l; ++o)
      (u = t[o]), u >= n && u <= i && r.push(u);
    if (r.length < 2)
      return [
        { time: n, pos: 0 },
        { time: i, pos: 1 },
      ];
    for (o = 0, l = r.length; o < l; ++o)
      (c = r[o + 1]),
        (a = r[o - 1]),
        (u = r[o]),
        Math.round((c + a) / 2) !== u && s.push({ time: u, pos: o / (l - 1) });
    return s;
  }
  _generate() {
    const t = this.min,
      n = this.max;
    let i = super.getDataTimestamps();
    return (
      (!i.includes(t) || !i.length) && i.splice(0, 0, t),
      (!i.includes(n) || i.length === 1) && i.push(n),
      i.sort((r, s) => r - s)
    );
  }
  _getTimestampsForTable() {
    let t = this._cache.all || [];
    if (t.length) return t;
    const n = this.getDataTimestamps(),
      i = this.getLabelTimestamps();
    return (
      n.length && i.length
        ? (t = this.normalize(n.concat(i)))
        : (t = n.length ? n : i),
      (t = this._cache.all = t),
      t
    );
  }
  getDecimalForValue(t) {
    return (Mo(this._table, t) - this._minPos) / this._tableRange;
  }
  getValueForPixel(t) {
    const n = this._offsets,
      i = this.getDecimalForPixel(t) / n.factor - n.end;
    return Mo(this._table, i * this._tableRange + this._minPos, !0);
  }
}
Y(Gp, "id", "timeseries"), Y(Gp, "defaults", Ll.defaults);
const Uy = "label";
function Zp(e, t) {
  typeof e == "function" ? e(t) : e && (e.current = t);
}
function YT(e, t) {
  const n = e.options;
  n && t && Object.assign(n, t);
}
function Wy(e, t) {
  e.labels = t;
}
function Vy(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Uy;
  const i = [];
  e.datasets = t.map((r) => {
    const s = e.datasets.find((o) => o[n] === r[n]);
    return !s || !r.data || i.includes(s)
      ? { ...r }
      : (i.push(s), Object.assign(s, r), s);
  });
}
function XT(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Uy;
  const n = { labels: [], datasets: [] };
  return Wy(n, e.labels), Vy(n, e.datasets, t), n;
}
function KT(e, t) {
  const {
      height: n = 150,
      width: i = 300,
      redraw: r = !1,
      datasetIdKey: s,
      type: o,
      data: l,
      options: a,
      plugins: u = [],
      fallbackContent: c,
      updateMode: f,
      ...d
    } = e,
    h = M.useRef(null),
    m = M.useRef(),
    v = () => {
      h.current &&
        ((m.current = new oa(h.current, {
          type: o,
          data: XT(l, s),
          options: a && { ...a },
          plugins: u,
        })),
        Zp(t, m.current));
    },
    _ = () => {
      Zp(t, null), m.current && (m.current.destroy(), (m.current = null));
    };
  return (
    M.useEffect(() => {
      !r && m.current && a && YT(m.current, a);
    }, [r, a]),
    M.useEffect(() => {
      !r && m.current && Wy(m.current.config.data, l.labels);
    }, [r, l.labels]),
    M.useEffect(() => {
      !r && m.current && l.datasets && Vy(m.current.config.data, l.datasets, s);
    }, [r, l.datasets]),
    M.useEffect(() => {
      m.current && (r ? (_(), setTimeout(v)) : m.current.update(f));
    }, [r, a, l.labels, l.datasets, f]),
    M.useEffect(() => {
      m.current && (_(), setTimeout(v));
    }, [o]),
    M.useEffect(() => (v(), () => _()), []),
    It.createElement(
      "canvas",
      Object.assign({ ref: h, role: "img", height: n, width: i }, d),
      c
    )
  );
}
const qT = M.forwardRef(KT);
function QT(e, t) {
  return (
    oa.register(t),
    M.forwardRef((n, i) =>
      It.createElement(qT, Object.assign({}, n, { ref: i, type: e }))
    )
  );
}
const GT = QT("line", Ko);
var $y = { exports: {} };
/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */ (function (e) {
  (function (t, n, i, r) {
    var s = ["", "webkit", "Moz", "MS", "ms", "o"],
      o = n.createElement("div"),
      l = "function",
      a = Math.round,
      u = Math.abs,
      c = Date.now;
    function f(p, x, b) {
      return setTimeout(w(p, b), x);
    }
    function d(p, x, b) {
      return Array.isArray(p) ? (h(p, b[x], b), !0) : !1;
    }
    function h(p, x, b) {
      var T;
      if (p)
        if (p.forEach) p.forEach(x, b);
        else if (p.length !== r)
          for (T = 0; T < p.length; ) x.call(b, p[T], T, p), T++;
        else for (T in p) p.hasOwnProperty(T) && x.call(b, p[T], T, p);
    }
    function m(p, x, b) {
      var T =
        "DEPRECATED METHOD: " +
        x +
        `
` +
        b +
        ` AT 
`;
      return function () {
        var R = new Error("get-stack-trace"),
          j =
            R && R.stack
              ? R.stack
                  .replace(/^[^\(]+?[\n$]/gm, "")
                  .replace(/^\s+at\s+/gm, "")
                  .replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@")
              : "Unknown Stack Trace",
          q = t.console && (t.console.warn || t.console.log);
        return q && q.call(t.console, T, j), p.apply(this, arguments);
      };
    }
    var v;
    typeof Object.assign != "function"
      ? (v = function (x) {
          if (x === r || x === null)
            throw new TypeError("Cannot convert undefined or null to object");
          for (var b = Object(x), T = 1; T < arguments.length; T++) {
            var R = arguments[T];
            if (R !== r && R !== null)
              for (var j in R) R.hasOwnProperty(j) && (b[j] = R[j]);
          }
          return b;
        })
      : (v = Object.assign);
    var _ = m(
        function (x, b, T) {
          for (var R = Object.keys(b), j = 0; j < R.length; )
            (!T || (T && x[R[j]] === r)) && (x[R[j]] = b[R[j]]), j++;
          return x;
        },
        "extend",
        "Use `assign`."
      ),
      g = m(
        function (x, b) {
          return _(x, b, !0);
        },
        "merge",
        "Use `assign`."
      );
    function y(p, x, b) {
      var T = x.prototype,
        R;
      (R = p.prototype = Object.create(T)),
        (R.constructor = p),
        (R._super = T),
        b && v(R, b);
    }
    function w(p, x) {
      return function () {
        return p.apply(x, arguments);
      };
    }
    function E(p, x) {
      return typeof p == l ? p.apply((x && x[0]) || r, x) : p;
    }
    function k(p, x) {
      return p === r ? x : p;
    }
    function P(p, x, b) {
      h(D(x), function (T) {
        p.addEventListener(T, b, !1);
      });
    }
    function C(p, x, b) {
      h(D(x), function (T) {
        p.removeEventListener(T, b, !1);
      });
    }
    function N(p, x) {
      for (; p; ) {
        if (p == x) return !0;
        p = p.parentNode;
      }
      return !1;
    }
    function I(p, x) {
      return p.indexOf(x) > -1;
    }
    function D(p) {
      return p.trim().split(/\s+/g);
    }
    function F(p, x, b) {
      if (p.indexOf && !b) return p.indexOf(x);
      for (var T = 0; T < p.length; ) {
        if ((b && p[T][b] == x) || (!b && p[T] === x)) return T;
        T++;
      }
      return -1;
    }
    function B(p) {
      return Array.prototype.slice.call(p, 0);
    }
    function Z(p, x, b) {
      for (var T = [], R = [], j = 0; j < p.length; ) {
        var q = p[j][x];
        F(R, q) < 0 && T.push(p[j]), (R[j] = q), j++;
      }
      return (
        (T = T.sort(function (Le, We) {
          return Le[x] > We[x];
        })),
        T
      );
    }
    function X(p, x) {
      for (
        var b, T, R = x[0].toUpperCase() + x.slice(1), j = 0;
        j < s.length;

      ) {
        if (((b = s[j]), (T = b ? b + R : x), T in p)) return T;
        j++;
      }
      return r;
    }
    var $ = 1;
    function ie() {
      return $++;
    }
    function ae(p) {
      var x = p.ownerDocument || p;
      return x.defaultView || x.parentWindow || t;
    }
    var A = /mobile|tablet|ip(ad|hone|od)|android/i,
      H = "ontouchstart" in t,
      U = X(t, "PointerEvent") !== r,
      re = H && A.test(navigator.userAgent),
      ee = "touch",
      ht = "pen",
      Ee = "mouse",
      Ct = "kinect",
      Re = 25,
      xe = 1,
      qn = 2,
      _e = 4,
      Ke = 8,
      Vs = 1,
      hr = 2,
      pr = 4,
      mr = 8,
      gr = 16,
      Ft = hr | pr,
      Qn = mr | gr,
      Yf = Ft | Qn,
      Xf = ["x", "y"],
      $s = ["clientX", "clientY"];
    function pt(p, x) {
      var b = this;
      (this.manager = p),
        (this.callback = x),
        (this.element = p.element),
        (this.target = p.options.inputTarget),
        (this.domHandler = function (T) {
          E(p.options.enable, [p]) && b.handler(T);
        }),
        this.init();
    }
    pt.prototype = {
      handler: function () {},
      init: function () {
        this.evEl && P(this.element, this.evEl, this.domHandler),
          this.evTarget && P(this.target, this.evTarget, this.domHandler),
          this.evWin && P(ae(this.element), this.evWin, this.domHandler);
      },
      destroy: function () {
        this.evEl && C(this.element, this.evEl, this.domHandler),
          this.evTarget && C(this.target, this.evTarget, this.domHandler),
          this.evWin && C(ae(this.element), this.evWin, this.domHandler);
      },
    };
    function cv(p) {
      var x,
        b = p.options.inputClass;
      return (
        b ? (x = b) : U ? (x = ua) : re ? (x = Ks) : H ? (x = ca) : (x = Xs),
        new x(p, fv)
      );
    }
    function fv(p, x, b) {
      var T = b.pointers.length,
        R = b.changedPointers.length,
        j = x & xe && T - R === 0,
        q = x & (_e | Ke) && T - R === 0;
      (b.isFirst = !!j),
        (b.isFinal = !!q),
        j && (p.session = {}),
        (b.eventType = x),
        dv(p, b),
        p.emit("hammer.input", b),
        p.recognize(b),
        (p.session.prevInput = b);
    }
    function dv(p, x) {
      var b = p.session,
        T = x.pointers,
        R = T.length;
      b.firstInput || (b.firstInput = Kf(x)),
        R > 1 && !b.firstMultiple
          ? (b.firstMultiple = Kf(x))
          : R === 1 && (b.firstMultiple = !1);
      var j = b.firstInput,
        q = b.firstMultiple,
        Ce = q ? q.center : j.center,
        Le = (x.center = qf(T));
      (x.timeStamp = c()),
        (x.deltaTime = x.timeStamp - j.timeStamp),
        (x.angle = aa(Ce, Le)),
        (x.distance = Ys(Ce, Le)),
        hv(b, x),
        (x.offsetDirection = Gf(x.deltaX, x.deltaY));
      var We = Qf(x.deltaTime, x.deltaX, x.deltaY);
      (x.overallVelocityX = We.x),
        (x.overallVelocityY = We.y),
        (x.overallVelocity = u(We.x) > u(We.y) ? We.x : We.y),
        (x.scale = q ? gv(q.pointers, T) : 1),
        (x.rotation = q ? mv(q.pointers, T) : 0),
        (x.maxPointers = b.prevInput
          ? x.pointers.length > b.prevInput.maxPointers
            ? x.pointers.length
            : b.prevInput.maxPointers
          : x.pointers.length),
        pv(b, x);
      var Ht = p.element;
      N(x.srcEvent.target, Ht) && (Ht = x.srcEvent.target), (x.target = Ht);
    }
    function hv(p, x) {
      var b = x.center,
        T = p.offsetDelta || {},
        R = p.prevDelta || {},
        j = p.prevInput || {};
      (x.eventType === xe || j.eventType === _e) &&
        ((R = p.prevDelta = { x: j.deltaX || 0, y: j.deltaY || 0 }),
        (T = p.offsetDelta = { x: b.x, y: b.y })),
        (x.deltaX = R.x + (b.x - T.x)),
        (x.deltaY = R.y + (b.y - T.y));
    }
    function pv(p, x) {
      var b = p.lastInterval || x,
        T = x.timeStamp - b.timeStamp,
        R,
        j,
        q,
        Ce;
      if (x.eventType != Ke && (T > Re || b.velocity === r)) {
        var Le = x.deltaX - b.deltaX,
          We = x.deltaY - b.deltaY,
          Ht = Qf(T, Le, We);
        (j = Ht.x),
          (q = Ht.y),
          (R = u(Ht.x) > u(Ht.y) ? Ht.x : Ht.y),
          (Ce = Gf(Le, We)),
          (p.lastInterval = x);
      } else
        (R = b.velocity),
          (j = b.velocityX),
          (q = b.velocityY),
          (Ce = b.direction);
      (x.velocity = R),
        (x.velocityX = j),
        (x.velocityY = q),
        (x.direction = Ce);
    }
    function Kf(p) {
      for (var x = [], b = 0; b < p.pointers.length; )
        (x[b] = {
          clientX: a(p.pointers[b].clientX),
          clientY: a(p.pointers[b].clientY),
        }),
          b++;
      return {
        timeStamp: c(),
        pointers: x,
        center: qf(x),
        deltaX: p.deltaX,
        deltaY: p.deltaY,
      };
    }
    function qf(p) {
      var x = p.length;
      if (x === 1) return { x: a(p[0].clientX), y: a(p[0].clientY) };
      for (var b = 0, T = 0, R = 0; R < x; )
        (b += p[R].clientX), (T += p[R].clientY), R++;
      return { x: a(b / x), y: a(T / x) };
    }
    function Qf(p, x, b) {
      return { x: x / p || 0, y: b / p || 0 };
    }
    function Gf(p, x) {
      return p === x ? Vs : u(p) >= u(x) ? (p < 0 ? hr : pr) : x < 0 ? mr : gr;
    }
    function Ys(p, x, b) {
      b || (b = Xf);
      var T = x[b[0]] - p[b[0]],
        R = x[b[1]] - p[b[1]];
      return Math.sqrt(T * T + R * R);
    }
    function aa(p, x, b) {
      b || (b = Xf);
      var T = x[b[0]] - p[b[0]],
        R = x[b[1]] - p[b[1]];
      return (Math.atan2(R, T) * 180) / Math.PI;
    }
    function mv(p, x) {
      return aa(x[1], x[0], $s) + aa(p[1], p[0], $s);
    }
    function gv(p, x) {
      return Ys(x[0], x[1], $s) / Ys(p[0], p[1], $s);
    }
    var yv = { mousedown: xe, mousemove: qn, mouseup: _e },
      vv = "mousedown",
      xv = "mousemove mouseup";
    function Xs() {
      (this.evEl = vv),
        (this.evWin = xv),
        (this.pressed = !1),
        pt.apply(this, arguments);
    }
    y(Xs, pt, {
      handler: function (x) {
        var b = yv[x.type];
        b & xe && x.button === 0 && (this.pressed = !0),
          b & qn && x.which !== 1 && (b = _e),
          this.pressed &&
            (b & _e && (this.pressed = !1),
            this.callback(this.manager, b, {
              pointers: [x],
              changedPointers: [x],
              pointerType: Ee,
              srcEvent: x,
            }));
      },
    });
    var _v = {
        pointerdown: xe,
        pointermove: qn,
        pointerup: _e,
        pointercancel: Ke,
        pointerout: Ke,
      },
      wv = { 2: ee, 3: ht, 4: Ee, 5: Ct },
      Zf = "pointerdown",
      Jf = "pointermove pointerup pointercancel";
    t.MSPointerEvent &&
      !t.PointerEvent &&
      ((Zf = "MSPointerDown"),
      (Jf = "MSPointerMove MSPointerUp MSPointerCancel"));
    function ua() {
      (this.evEl = Zf),
        (this.evWin = Jf),
        pt.apply(this, arguments),
        (this.store = this.manager.session.pointerEvents = []);
    }
    y(ua, pt, {
      handler: function (x) {
        var b = this.store,
          T = !1,
          R = x.type.toLowerCase().replace("ms", ""),
          j = _v[R],
          q = wv[x.pointerType] || x.pointerType,
          Ce = q == ee,
          Le = F(b, x.pointerId, "pointerId");
        j & xe && (x.button === 0 || Ce)
          ? Le < 0 && (b.push(x), (Le = b.length - 1))
          : j & (_e | Ke) && (T = !0),
          !(Le < 0) &&
            ((b[Le] = x),
            this.callback(this.manager, j, {
              pointers: b,
              changedPointers: [x],
              pointerType: q,
              srcEvent: x,
            }),
            T && b.splice(Le, 1));
      },
    });
    var Sv = { touchstart: xe, touchmove: qn, touchend: _e, touchcancel: Ke },
      bv = "touchstart",
      Ev = "touchstart touchmove touchend touchcancel";
    function ed() {
      (this.evTarget = bv),
        (this.evWin = Ev),
        (this.started = !1),
        pt.apply(this, arguments);
    }
    y(ed, pt, {
      handler: function (x) {
        var b = Sv[x.type];
        if ((b === xe && (this.started = !0), !!this.started)) {
          var T = kv.call(this, x, b);
          b & (_e | Ke) &&
            T[0].length - T[1].length === 0 &&
            (this.started = !1),
            this.callback(this.manager, b, {
              pointers: T[0],
              changedPointers: T[1],
              pointerType: ee,
              srcEvent: x,
            });
        }
      },
    });
    function kv(p, x) {
      var b = B(p.touches),
        T = B(p.changedTouches);
      return x & (_e | Ke) && (b = Z(b.concat(T), "identifier")), [b, T];
    }
    var Tv = { touchstart: xe, touchmove: qn, touchend: _e, touchcancel: Ke },
      Cv = "touchstart touchmove touchend touchcancel";
    function Ks() {
      (this.evTarget = Cv), (this.targetIds = {}), pt.apply(this, arguments);
    }
    y(Ks, pt, {
      handler: function (x) {
        var b = Tv[x.type],
          T = Pv.call(this, x, b);
        T &&
          this.callback(this.manager, b, {
            pointers: T[0],
            changedPointers: T[1],
            pointerType: ee,
            srcEvent: x,
          });
      },
    });
    function Pv(p, x) {
      var b = B(p.touches),
        T = this.targetIds;
      if (x & (xe | qn) && b.length === 1)
        return (T[b[0].identifier] = !0), [b, b];
      var R,
        j,
        q = B(p.changedTouches),
        Ce = [],
        Le = this.target;
      if (
        ((j = b.filter(function (We) {
          return N(We.target, Le);
        })),
        x === xe)
      )
        for (R = 0; R < j.length; ) (T[j[R].identifier] = !0), R++;
      for (R = 0; R < q.length; )
        T[q[R].identifier] && Ce.push(q[R]),
          x & (_e | Ke) && delete T[q[R].identifier],
          R++;
      if (Ce.length) return [Z(j.concat(Ce), "identifier"), Ce];
    }
    var Ov = 2500,
      td = 25;
    function ca() {
      pt.apply(this, arguments);
      var p = w(this.handler, this);
      (this.touch = new Ks(this.manager, p)),
        (this.mouse = new Xs(this.manager, p)),
        (this.primaryTouch = null),
        (this.lastTouches = []);
    }
    y(ca, pt, {
      handler: function (x, b, T) {
        var R = T.pointerType == ee,
          j = T.pointerType == Ee;
        if (
          !(j && T.sourceCapabilities && T.sourceCapabilities.firesTouchEvents)
        ) {
          if (R) Nv.call(this, b, T);
          else if (j && Mv.call(this, T)) return;
          this.callback(x, b, T);
        }
      },
      destroy: function () {
        this.touch.destroy(), this.mouse.destroy();
      },
    });
    function Nv(p, x) {
      p & xe
        ? ((this.primaryTouch = x.changedPointers[0].identifier),
          nd.call(this, x))
        : p & (_e | Ke) && nd.call(this, x);
    }
    function nd(p) {
      var x = p.changedPointers[0];
      if (x.identifier === this.primaryTouch) {
        var b = { x: x.clientX, y: x.clientY };
        this.lastTouches.push(b);
        var T = this.lastTouches,
          R = function () {
            var j = T.indexOf(b);
            j > -1 && T.splice(j, 1);
          };
        setTimeout(R, Ov);
      }
    }
    function Mv(p) {
      for (
        var x = p.srcEvent.clientX, b = p.srcEvent.clientY, T = 0;
        T < this.lastTouches.length;
        T++
      ) {
        var R = this.lastTouches[T],
          j = Math.abs(x - R.x),
          q = Math.abs(b - R.y);
        if (j <= td && q <= td) return !0;
      }
      return !1;
    }
    var id = X(o.style, "touchAction"),
      rd = id !== r,
      sd = "compute",
      od = "auto",
      fa = "manipulation",
      Gn = "none",
      yr = "pan-x",
      vr = "pan-y",
      qs = Lv();
    function da(p, x) {
      (this.manager = p), this.set(x);
    }
    da.prototype = {
      set: function (p) {
        p == sd && (p = this.compute()),
          rd &&
            this.manager.element.style &&
            qs[p] &&
            (this.manager.element.style[id] = p),
          (this.actions = p.toLowerCase().trim());
      },
      update: function () {
        this.set(this.manager.options.touchAction);
      },
      compute: function () {
        var p = [];
        return (
          h(this.manager.recognizers, function (x) {
            E(x.options.enable, [x]) && (p = p.concat(x.getTouchAction()));
          }),
          Rv(p.join(" "))
        );
      },
      preventDefaults: function (p) {
        var x = p.srcEvent,
          b = p.offsetDirection;
        if (this.manager.session.prevented) {
          x.preventDefault();
          return;
        }
        var T = this.actions,
          R = I(T, Gn) && !qs[Gn],
          j = I(T, vr) && !qs[vr],
          q = I(T, yr) && !qs[yr];
        if (R) {
          var Ce = p.pointers.length === 1,
            Le = p.distance < 2,
            We = p.deltaTime < 250;
          if (Ce && Le && We) return;
        }
        if (!(q && j) && (R || (j && b & Ft) || (q && b & Qn)))
          return this.preventSrc(x);
      },
      preventSrc: function (p) {
        (this.manager.session.prevented = !0), p.preventDefault();
      },
    };
    function Rv(p) {
      if (I(p, Gn)) return Gn;
      var x = I(p, yr),
        b = I(p, vr);
      return x && b ? Gn : x || b ? (x ? yr : vr) : I(p, fa) ? fa : od;
    }
    function Lv() {
      if (!rd) return !1;
      var p = {},
        x = t.CSS && t.CSS.supports;
      return (
        [
          "auto",
          "manipulation",
          "pan-y",
          "pan-x",
          "pan-x pan-y",
          "none",
        ].forEach(function (b) {
          p[b] = x ? t.CSS.supports("touch-action", b) : !0;
        }),
        p
      );
    }
    var Qs = 1,
      mt = 2,
      Ci = 4,
      yn = 8,
      Jt = yn,
      xr = 16,
      Bt = 32;
    function en(p) {
      (this.options = v({}, this.defaults, p || {})),
        (this.id = ie()),
        (this.manager = null),
        (this.options.enable = k(this.options.enable, !0)),
        (this.state = Qs),
        (this.simultaneous = {}),
        (this.requireFail = []);
    }
    en.prototype = {
      defaults: {},
      set: function (p) {
        return (
          v(this.options, p),
          this.manager && this.manager.touchAction.update(),
          this
        );
      },
      recognizeWith: function (p) {
        if (d(p, "recognizeWith", this)) return this;
        var x = this.simultaneous;
        return (
          (p = Gs(p, this)),
          x[p.id] || ((x[p.id] = p), p.recognizeWith(this)),
          this
        );
      },
      dropRecognizeWith: function (p) {
        return d(p, "dropRecognizeWith", this)
          ? this
          : ((p = Gs(p, this)), delete this.simultaneous[p.id], this);
      },
      requireFailure: function (p) {
        if (d(p, "requireFailure", this)) return this;
        var x = this.requireFail;
        return (
          (p = Gs(p, this)),
          F(x, p) === -1 && (x.push(p), p.requireFailure(this)),
          this
        );
      },
      dropRequireFailure: function (p) {
        if (d(p, "dropRequireFailure", this)) return this;
        p = Gs(p, this);
        var x = F(this.requireFail, p);
        return x > -1 && this.requireFail.splice(x, 1), this;
      },
      hasRequireFailures: function () {
        return this.requireFail.length > 0;
      },
      canRecognizeWith: function (p) {
        return !!this.simultaneous[p.id];
      },
      emit: function (p) {
        var x = this,
          b = this.state;
        function T(R) {
          x.manager.emit(R, p);
        }
        b < yn && T(x.options.event + ld(b)),
          T(x.options.event),
          p.additionalEvent && T(p.additionalEvent),
          b >= yn && T(x.options.event + ld(b));
      },
      tryEmit: function (p) {
        if (this.canEmit()) return this.emit(p);
        this.state = Bt;
      },
      canEmit: function () {
        for (var p = 0; p < this.requireFail.length; ) {
          if (!(this.requireFail[p].state & (Bt | Qs))) return !1;
          p++;
        }
        return !0;
      },
      recognize: function (p) {
        var x = v({}, p);
        if (!E(this.options.enable, [this, x])) {
          this.reset(), (this.state = Bt);
          return;
        }
        this.state & (Jt | xr | Bt) && (this.state = Qs),
          (this.state = this.process(x)),
          this.state & (mt | Ci | yn | xr) && this.tryEmit(x);
      },
      process: function (p) {},
      getTouchAction: function () {},
      reset: function () {},
    };
    function ld(p) {
      return p & xr
        ? "cancel"
        : p & yn
        ? "end"
        : p & Ci
        ? "move"
        : p & mt
        ? "start"
        : "";
    }
    function ad(p) {
      return p == gr
        ? "down"
        : p == mr
        ? "up"
        : p == hr
        ? "left"
        : p == pr
        ? "right"
        : "";
    }
    function Gs(p, x) {
      var b = x.manager;
      return b ? b.get(p) : p;
    }
    function Pt() {
      en.apply(this, arguments);
    }
    y(Pt, en, {
      defaults: { pointers: 1 },
      attrTest: function (p) {
        var x = this.options.pointers;
        return x === 0 || p.pointers.length === x;
      },
      process: function (p) {
        var x = this.state,
          b = p.eventType,
          T = x & (mt | Ci),
          R = this.attrTest(p);
        return T && (b & Ke || !R)
          ? x | xr
          : T || R
          ? b & _e
            ? x | yn
            : x & mt
            ? x | Ci
            : mt
          : Bt;
      },
    });
    function Zs() {
      Pt.apply(this, arguments), (this.pX = null), (this.pY = null);
    }
    y(Zs, Pt, {
      defaults: { event: "pan", threshold: 10, pointers: 1, direction: Yf },
      getTouchAction: function () {
        var p = this.options.direction,
          x = [];
        return p & Ft && x.push(vr), p & Qn && x.push(yr), x;
      },
      directionTest: function (p) {
        var x = this.options,
          b = !0,
          T = p.distance,
          R = p.direction,
          j = p.deltaX,
          q = p.deltaY;
        return (
          R & x.direction ||
            (x.direction & Ft
              ? ((R = j === 0 ? Vs : j < 0 ? hr : pr),
                (b = j != this.pX),
                (T = Math.abs(p.deltaX)))
              : ((R = q === 0 ? Vs : q < 0 ? mr : gr),
                (b = q != this.pY),
                (T = Math.abs(p.deltaY)))),
          (p.direction = R),
          b && T > x.threshold && R & x.direction
        );
      },
      attrTest: function (p) {
        return (
          Pt.prototype.attrTest.call(this, p) &&
          (this.state & mt || (!(this.state & mt) && this.directionTest(p)))
        );
      },
      emit: function (p) {
        (this.pX = p.deltaX), (this.pY = p.deltaY);
        var x = ad(p.direction);
        x && (p.additionalEvent = this.options.event + x),
          this._super.emit.call(this, p);
      },
    });
    function ha() {
      Pt.apply(this, arguments);
    }
    y(ha, Pt, {
      defaults: { event: "pinch", threshold: 0, pointers: 2 },
      getTouchAction: function () {
        return [Gn];
      },
      attrTest: function (p) {
        return (
          this._super.attrTest.call(this, p) &&
          (Math.abs(p.scale - 1) > this.options.threshold || this.state & mt)
        );
      },
      emit: function (p) {
        if (p.scale !== 1) {
          var x = p.scale < 1 ? "in" : "out";
          p.additionalEvent = this.options.event + x;
        }
        this._super.emit.call(this, p);
      },
    });
    function pa() {
      en.apply(this, arguments), (this._timer = null), (this._input = null);
    }
    y(pa, en, {
      defaults: { event: "press", pointers: 1, time: 251, threshold: 9 },
      getTouchAction: function () {
        return [od];
      },
      process: function (p) {
        var x = this.options,
          b = p.pointers.length === x.pointers,
          T = p.distance < x.threshold,
          R = p.deltaTime > x.time;
        if (((this._input = p), !T || !b || (p.eventType & (_e | Ke) && !R)))
          this.reset();
        else if (p.eventType & xe)
          this.reset(),
            (this._timer = f(
              function () {
                (this.state = Jt), this.tryEmit();
              },
              x.time,
              this
            ));
        else if (p.eventType & _e) return Jt;
        return Bt;
      },
      reset: function () {
        clearTimeout(this._timer);
      },
      emit: function (p) {
        this.state === Jt &&
          (p && p.eventType & _e
            ? this.manager.emit(this.options.event + "up", p)
            : ((this._input.timeStamp = c()),
              this.manager.emit(this.options.event, this._input)));
      },
    });
    function ma() {
      Pt.apply(this, arguments);
    }
    y(ma, Pt, {
      defaults: { event: "rotate", threshold: 0, pointers: 2 },
      getTouchAction: function () {
        return [Gn];
      },
      attrTest: function (p) {
        return (
          this._super.attrTest.call(this, p) &&
          (Math.abs(p.rotation) > this.options.threshold || this.state & mt)
        );
      },
    });
    function ga() {
      Pt.apply(this, arguments);
    }
    y(ga, Pt, {
      defaults: {
        event: "swipe",
        threshold: 10,
        velocity: 0.3,
        direction: Ft | Qn,
        pointers: 1,
      },
      getTouchAction: function () {
        return Zs.prototype.getTouchAction.call(this);
      },
      attrTest: function (p) {
        var x = this.options.direction,
          b;
        return (
          x & (Ft | Qn)
            ? (b = p.overallVelocity)
            : x & Ft
            ? (b = p.overallVelocityX)
            : x & Qn && (b = p.overallVelocityY),
          this._super.attrTest.call(this, p) &&
            x & p.offsetDirection &&
            p.distance > this.options.threshold &&
            p.maxPointers == this.options.pointers &&
            u(b) > this.options.velocity &&
            p.eventType & _e
        );
      },
      emit: function (p) {
        var x = ad(p.offsetDirection);
        x && this.manager.emit(this.options.event + x, p),
          this.manager.emit(this.options.event, p);
      },
    });
    function Js() {
      en.apply(this, arguments),
        (this.pTime = !1),
        (this.pCenter = !1),
        (this._timer = null),
        (this._input = null),
        (this.count = 0);
    }
    y(Js, en, {
      defaults: {
        event: "tap",
        pointers: 1,
        taps: 1,
        interval: 300,
        time: 250,
        threshold: 9,
        posThreshold: 10,
      },
      getTouchAction: function () {
        return [fa];
      },
      process: function (p) {
        var x = this.options,
          b = p.pointers.length === x.pointers,
          T = p.distance < x.threshold,
          R = p.deltaTime < x.time;
        if ((this.reset(), p.eventType & xe && this.count === 0))
          return this.failTimeout();
        if (T && R && b) {
          if (p.eventType != _e) return this.failTimeout();
          var j = this.pTime ? p.timeStamp - this.pTime < x.interval : !0,
            q = !this.pCenter || Ys(this.pCenter, p.center) < x.posThreshold;
          (this.pTime = p.timeStamp),
            (this.pCenter = p.center),
            !q || !j ? (this.count = 1) : (this.count += 1),
            (this._input = p);
          var Ce = this.count % x.taps;
          if (Ce === 0)
            return this.hasRequireFailures()
              ? ((this._timer = f(
                  function () {
                    (this.state = Jt), this.tryEmit();
                  },
                  x.interval,
                  this
                )),
                mt)
              : Jt;
        }
        return Bt;
      },
      failTimeout: function () {
        return (
          (this._timer = f(
            function () {
              this.state = Bt;
            },
            this.options.interval,
            this
          )),
          Bt
        );
      },
      reset: function () {
        clearTimeout(this._timer);
      },
      emit: function () {
        this.state == Jt &&
          ((this._input.tapCount = this.count),
          this.manager.emit(this.options.event, this._input));
      },
    });
    function vn(p, x) {
      return (
        (x = x || {}),
        (x.recognizers = k(x.recognizers, vn.defaults.preset)),
        new ya(p, x)
      );
    }
    (vn.VERSION = "2.0.7"),
      (vn.defaults = {
        domEvents: !1,
        touchAction: sd,
        enable: !0,
        inputTarget: null,
        inputClass: null,
        preset: [
          [ma, { enable: !1 }],
          [ha, { enable: !1 }, ["rotate"]],
          [ga, { direction: Ft }],
          [Zs, { direction: Ft }, ["swipe"]],
          [Js],
          [Js, { event: "doubletap", taps: 2 }, ["tap"]],
          [pa],
        ],
        cssProps: {
          userSelect: "none",
          touchSelect: "none",
          touchCallout: "none",
          contentZooming: "none",
          userDrag: "none",
          tapHighlightColor: "rgba(0,0,0,0)",
        },
      });
    var Iv = 1,
      ud = 2;
    function ya(p, x) {
      (this.options = v({}, vn.defaults, x || {})),
        (this.options.inputTarget = this.options.inputTarget || p),
        (this.handlers = {}),
        (this.session = {}),
        (this.recognizers = []),
        (this.oldCssProps = {}),
        (this.element = p),
        (this.input = cv(this)),
        (this.touchAction = new da(this, this.options.touchAction)),
        cd(this, !0),
        h(
          this.options.recognizers,
          function (b) {
            var T = this.add(new b[0](b[1]));
            b[2] && T.recognizeWith(b[2]), b[3] && T.requireFailure(b[3]);
          },
          this
        );
    }
    ya.prototype = {
      set: function (p) {
        return (
          v(this.options, p),
          p.touchAction && this.touchAction.update(),
          p.inputTarget &&
            (this.input.destroy(),
            (this.input.target = p.inputTarget),
            this.input.init()),
          this
        );
      },
      stop: function (p) {
        this.session.stopped = p ? ud : Iv;
      },
      recognize: function (p) {
        var x = this.session;
        if (!x.stopped) {
          this.touchAction.preventDefaults(p);
          var b,
            T = this.recognizers,
            R = x.curRecognizer;
          (!R || (R && R.state & Jt)) && (R = x.curRecognizer = null);
          for (var j = 0; j < T.length; )
            (b = T[j]),
              x.stopped !== ud && (!R || b == R || b.canRecognizeWith(R))
                ? b.recognize(p)
                : b.reset(),
              !R && b.state & (mt | Ci | yn) && (R = x.curRecognizer = b),
              j++;
        }
      },
      get: function (p) {
        if (p instanceof en) return p;
        for (var x = this.recognizers, b = 0; b < x.length; b++)
          if (x[b].options.event == p) return x[b];
        return null;
      },
      add: function (p) {
        if (d(p, "add", this)) return this;
        var x = this.get(p.options.event);
        return (
          x && this.remove(x),
          this.recognizers.push(p),
          (p.manager = this),
          this.touchAction.update(),
          p
        );
      },
      remove: function (p) {
        if (d(p, "remove", this)) return this;
        if (((p = this.get(p)), p)) {
          var x = this.recognizers,
            b = F(x, p);
          b !== -1 && (x.splice(b, 1), this.touchAction.update());
        }
        return this;
      },
      on: function (p, x) {
        if (p !== r && x !== r) {
          var b = this.handlers;
          return (
            h(D(p), function (T) {
              (b[T] = b[T] || []), b[T].push(x);
            }),
            this
          );
        }
      },
      off: function (p, x) {
        if (p !== r) {
          var b = this.handlers;
          return (
            h(D(p), function (T) {
              x ? b[T] && b[T].splice(F(b[T], x), 1) : delete b[T];
            }),
            this
          );
        }
      },
      emit: function (p, x) {
        this.options.domEvents && Dv(p, x);
        var b = this.handlers[p] && this.handlers[p].slice();
        if (!(!b || !b.length)) {
          (x.type = p),
            (x.preventDefault = function () {
              x.srcEvent.preventDefault();
            });
          for (var T = 0; T < b.length; ) b[T](x), T++;
        }
      },
      destroy: function () {
        this.element && cd(this, !1),
          (this.handlers = {}),
          (this.session = {}),
          this.input.destroy(),
          (this.element = null);
      },
    };
    function cd(p, x) {
      var b = p.element;
      if (b.style) {
        var T;
        h(p.options.cssProps, function (R, j) {
          (T = X(b.style, j)),
            x
              ? ((p.oldCssProps[T] = b.style[T]), (b.style[T] = R))
              : (b.style[T] = p.oldCssProps[T] || "");
        }),
          x || (p.oldCssProps = {});
      }
    }
    function Dv(p, x) {
      var b = n.createEvent("Event");
      b.initEvent(p, !0, !0), (b.gesture = x), x.target.dispatchEvent(b);
    }
    v(vn, {
      INPUT_START: xe,
      INPUT_MOVE: qn,
      INPUT_END: _e,
      INPUT_CANCEL: Ke,
      STATE_POSSIBLE: Qs,
      STATE_BEGAN: mt,
      STATE_CHANGED: Ci,
      STATE_ENDED: yn,
      STATE_RECOGNIZED: Jt,
      STATE_CANCELLED: xr,
      STATE_FAILED: Bt,
      DIRECTION_NONE: Vs,
      DIRECTION_LEFT: hr,
      DIRECTION_RIGHT: pr,
      DIRECTION_UP: mr,
      DIRECTION_DOWN: gr,
      DIRECTION_HORIZONTAL: Ft,
      DIRECTION_VERTICAL: Qn,
      DIRECTION_ALL: Yf,
      Manager: ya,
      Input: pt,
      TouchAction: da,
      TouchInput: Ks,
      MouseInput: Xs,
      PointerEventInput: ua,
      TouchMouseInput: ca,
      SingleTouchInput: ed,
      Recognizer: en,
      AttrRecognizer: Pt,
      Tap: Js,
      Pan: Zs,
      Swipe: ga,
      Pinch: ha,
      Rotate: ma,
      Press: pa,
      on: P,
      off: C,
      each: h,
      merge: g,
      extend: _,
      assign: v,
      inherit: y,
      bindFn: w,
      prefixed: X,
    });
    var Av = typeof t < "u" ? t : typeof self < "u" ? self : {};
    (Av.Hammer = vn), e.exports ? (e.exports = vn) : (t[i] = vn);
  })(window, document, "Hammer");
})($y);
var ZT = $y.exports;
const ss = kc(ZT);
/*!
 * chartjs-plugin-zoom v2.0.1
 * undefined
 * (c) 2016-2023 chartjs-plugin-zoom Contributors
 * Released under the MIT License
 */ const Ls = (e) => e && e.enabled && e.modifierKey,
  Yy = (e, t) => e && t[e + "Key"],
  Wf = (e, t) => e && !t[e + "Key"];
function $n(e, t, n) {
  return e === void 0
    ? !0
    : typeof e == "string"
    ? e.indexOf(t) !== -1
    : typeof e == "function"
    ? e({ chart: n }).indexOf(t) !== -1
    : !1;
}
function ru(e, t) {
  return (
    typeof e == "function" && (e = e({ chart: t })),
    typeof e == "string"
      ? { x: e.indexOf("x") !== -1, y: e.indexOf("y") !== -1 }
      : { x: !1, y: !1 }
  );
}
function JT(e, t) {
  let n;
  return function () {
    return clearTimeout(n), (n = setTimeout(e, t)), t;
  };
}
function eC({ x: e, y: t }, n) {
  const i = n.scales,
    r = Object.keys(i);
  for (let s = 0; s < r.length; s++) {
    const o = i[r[s]];
    if (t >= o.top && t <= o.bottom && e >= o.left && e <= o.right) return o;
  }
  return null;
}
function Xy(e, t, n) {
  const { mode: i = "xy", scaleMode: r, overScaleMode: s } = e || {},
    o = eC(t, n),
    l = ru(i, n),
    a = ru(r, n);
  if (s) {
    const c = ru(s, n);
    for (const f of ["x", "y"]) c[f] && ((a[f] = l[f]), (l[f] = !1));
  }
  if (o && a[o.axis]) return [o];
  const u = [];
  return (
    Q(n.scales, function (c) {
      l[c.axis] && u.push(c);
    }),
    u
  );
}
const _c = new WeakMap();
function ve(e) {
  let t = _c.get(e);
  return (
    t ||
      ((t = {
        originalScaleLimits: {},
        updatedScaleLimits: {},
        handlers: {},
        panDelta: {},
      }),
      _c.set(e, t)),
    t
  );
}
function tC(e) {
  _c.delete(e);
}
function Ky(e, t, n) {
  const i = e.max - e.min,
    r = i * (t - 1),
    s = e.isHorizontal() ? n.x : n.y,
    o = Math.max(0, Math.min(1, (e.getValueForPixel(s) - e.min) / i || 0)),
    l = 1 - o;
  return { min: r * o, max: r * l };
}
function Jp(e, t, n, i, r) {
  let s = n[i];
  if (s === "original") {
    const o = e.originalScaleLimits[t.id][i];
    s = K(o.options, o.scale);
  }
  return K(s, r);
}
function nC(e, t, n) {
  const i = e.getValueForPixel(t),
    r = e.getValueForPixel(n);
  return { min: Math.min(i, r), max: Math.max(i, r) };
}
function fr(e, { min: t, max: n }, i, r = !1) {
  const s = ve(e.chart),
    { id: o, axis: l, options: a } = e,
    u = (i && (i[o] || i[l])) || {},
    { minRange: c = 0 } = u,
    f = Jp(s, e, u, "min", -1 / 0),
    d = Jp(s, e, u, "max", 1 / 0),
    h = r ? Math.max(n - t, c) : e.max - e.min,
    m = (h - n + t) / 2;
  return (
    (t -= m),
    (n += m),
    t < f
      ? ((t = f), (n = Math.min(f + h, d)))
      : n > d && ((n = d), (t = Math.max(d - h, f))),
    (a.min = t),
    (a.max = n),
    (s.updatedScaleLimits[e.id] = { min: t, max: n }),
    e.parse(t) !== e.min || e.parse(n) !== e.max
  );
}
function iC(e, t, n, i) {
  const r = Ky(e, t, n),
    s = { min: e.min + r.min, max: e.max - r.max };
  return fr(e, s, i, !0);
}
function rC(e, t, n, i) {
  fr(e, nC(e, t, n), i, !0);
}
const em = (e) =>
  e === 0 || isNaN(e)
    ? 0
    : e < 0
    ? Math.min(Math.round(e), -1)
    : Math.max(Math.round(e), 1);
function sC(e) {
  const n = e.getLabels().length - 1;
  e.min > 0 && (e.min -= 1), e.max < n && (e.max += 1);
}
function oC(e, t, n, i) {
  const r = Ky(e, t, n);
  e.min === e.max && t < 1 && sC(e);
  const s = { min: e.min + em(r.min), max: e.max - em(r.max) };
  return fr(e, s, i, !0);
}
function lC(e) {
  return e.isHorizontal() ? e.width : e.height;
}
function aC(e, t, n) {
  const r = e.getLabels().length - 1;
  let { min: s, max: o } = e;
  const l = Math.max(o - s, 1),
    a = Math.round(lC(e) / Math.max(l, 10)),
    u = Math.round(Math.abs(t / a));
  let c;
  return (
    t < -a
      ? ((o = Math.min(o + u, r)), (s = l === 1 ? o : o - l), (c = o === r))
      : t > a &&
        ((s = Math.max(0, s - u)), (o = l === 1 ? s : s + l), (c = s === 0)),
    fr(e, { min: s, max: o }, n) || c
  );
}
const uC = {
  second: 500,
  minute: 30 * 1e3,
  hour: 30 * 60 * 1e3,
  day: 12 * 60 * 60 * 1e3,
  week: 3.5 * 24 * 60 * 60 * 1e3,
  month: 15 * 24 * 60 * 60 * 1e3,
  quarter: 60 * 24 * 60 * 60 * 1e3,
  year: 182 * 24 * 60 * 60 * 1e3,
};
function qy(e, t, n, i = !1) {
  const { min: r, max: s, options: o } = e,
    l = o.time && o.time.round,
    a = uC[l] || 0,
    u = e.getValueForPixel(e.getPixelForValue(r + a) - t),
    c = e.getValueForPixel(e.getPixelForValue(s + a) - t),
    { min: f = -1 / 0, max: d = 1 / 0 } = (i && n && n[e.axis]) || {};
  return isNaN(u) || isNaN(c) || u < f || c > d
    ? !0
    : fr(e, { min: u, max: c }, n, i);
}
function tm(e, t, n) {
  return qy(e, t, n, !0);
}
const wc = { category: oC, default: iC },
  Sc = { default: rC },
  bc = { category: aC, default: qy, logarithmic: tm, timeseries: tm };
function cC(e, t, n) {
  const {
    id: i,
    options: { min: r, max: s },
  } = e;
  if (!t[i] || !n[i]) return !0;
  const o = n[i];
  return o.min !== r || o.max !== s;
}
function nm(e, t) {
  Q(e, (n, i) => {
    t[i] || delete e[i];
  });
}
function dr(e, t) {
  const { scales: n } = e,
    { originalScaleLimits: i, updatedScaleLimits: r } = t;
  return (
    Q(n, function (s) {
      cC(s, i, r) &&
        (i[s.id] = {
          min: { scale: s.min, options: s.options.min },
          max: { scale: s.max, options: s.options.max },
        });
    }),
    nm(i, n),
    nm(r, n),
    i
  );
}
function im(e, t, n, i) {
  const r = wc[e.type] || wc.default;
  W(r, [e, t, n, i]);
}
function rm(e, t, n, i, r) {
  const s = Sc[e.type] || Sc.default;
  W(s, [e, t, n, i, r]);
}
function fC(e) {
  const t = e.chartArea;
  return { x: (t.left + t.right) / 2, y: (t.top + t.bottom) / 2 };
}
function Vf(e, t, n = "none") {
  const {
      x: i = 1,
      y: r = 1,
      focalPoint: s = fC(e),
    } = typeof t == "number" ? { x: t, y: t } : t,
    o = ve(e),
    {
      options: { limits: l, zoom: a },
    } = o;
  dr(e, o);
  const u = i !== 1,
    c = r !== 1,
    f = Xy(a, s, e);
  Q(f || e.scales, function (d) {
    d.isHorizontal() && u
      ? im(d, i, s, l)
      : !d.isHorizontal() && c && im(d, r, s, l);
  }),
    e.update(n),
    W(a.onZoom, [{ chart: e }]);
}
function Qy(e, t, n, i = "none") {
  const r = ve(e),
    {
      options: { limits: s, zoom: o },
    } = r,
    { mode: l = "xy" } = o;
  dr(e, r);
  const a = $n(l, "x", e),
    u = $n(l, "y", e);
  Q(e.scales, function (c) {
    c.isHorizontal() && a
      ? rm(c, t.x, n.x, s)
      : !c.isHorizontal() && u && rm(c, t.y, n.y, s);
  }),
    e.update(i),
    W(o.onZoom, [{ chart: e }]);
}
function dC(e, t, n, i = "none") {
  dr(e, ve(e));
  const r = e.scales[t];
  fr(r, n, void 0, !0), e.update(i);
}
function hC(e, t = "default") {
  const n = ve(e),
    i = dr(e, n);
  Q(e.scales, function (r) {
    const s = r.options;
    i[r.id]
      ? ((s.min = i[r.id].min.options), (s.max = i[r.id].max.options))
      : (delete s.min, delete s.max);
  }),
    e.update(t),
    W(n.options.zoom.onZoomComplete, [{ chart: e }]);
}
function pC(e, t) {
  const n = e.originalScaleLimits[t];
  if (!n) return;
  const { min: i, max: r } = n;
  return K(r.options, r.scale) - K(i.options, i.scale);
}
function mC(e) {
  const t = ve(e);
  let n = 1,
    i = 1;
  return (
    Q(e.scales, function (r) {
      const s = pC(t, r.id);
      if (s) {
        const o = Math.round((s / (r.max - r.min)) * 100) / 100;
        (n = Math.min(n, o)), (i = Math.max(i, o));
      }
    }),
    n < 1 ? n : i
  );
}
function sm(e, t, n, i) {
  const { panDelta: r } = i,
    s = r[e.id] || 0;
  Vn(s) === Vn(t) && (t += s);
  const o = bc[e.type] || bc.default;
  W(o, [e, t, n]) ? (r[e.id] = 0) : (r[e.id] = t);
}
function Gy(e, t, n, i = "none") {
  const { x: r = 0, y: s = 0 } = typeof t == "number" ? { x: t, y: t } : t,
    o = ve(e),
    {
      options: { pan: l, limits: a },
    } = o,
    { onPan: u } = l || {};
  dr(e, o);
  const c = r !== 0,
    f = s !== 0;
  Q(n || e.scales, function (d) {
    d.isHorizontal() && c
      ? sm(d, r, a, o)
      : !d.isHorizontal() && f && sm(d, s, a, o);
  }),
    e.update(i),
    W(u, [{ chart: e }]);
}
function Zy(e) {
  const t = ve(e);
  dr(e, t);
  const n = {};
  for (const i of Object.keys(e.scales)) {
    const { min: r, max: s } = t.originalScaleLimits[i] || { min: {}, max: {} };
    n[i] = { min: r.scale, max: s.scale };
  }
  return n;
}
function gC(e) {
  const t = Zy(e);
  for (const n of Object.keys(e.scales)) {
    const { min: i, max: r } = t[n];
    if (
      (i !== void 0 && e.scales[n].min !== i) ||
      (r !== void 0 && e.scales[n].max !== r)
    )
      return !0;
  }
  return !1;
}
function Ge(e, t) {
  const { handlers: n } = ve(e),
    i = n[t];
  i && i.target && (i.target.removeEventListener(t, i), delete n[t]);
}
function os(e, t, n, i) {
  const { handlers: r, options: s } = ve(e),
    o = r[n];
  (o && o.target === t) ||
    (Ge(e, n),
    (r[n] = (l) => i(e, l, s)),
    (r[n].target = t),
    t.addEventListener(n, r[n]));
}
function yC(e, t) {
  const n = ve(e);
  n.dragStart && ((n.dragging = !0), (n.dragEnd = t), e.update("none"));
}
function vC(e, t) {
  const n = ve(e);
  !n.dragStart ||
    t.key !== "Escape" ||
    (Ge(e, "keydown"),
    (n.dragging = !1),
    (n.dragStart = n.dragEnd = null),
    e.update("none"));
}
function Jy(e, t, n) {
  const { onZoomStart: i, onZoomRejected: r } = n;
  if (i) {
    const s = Kt(t, e);
    if (W(i, [{ chart: e, event: t, point: s }]) === !1)
      return W(r, [{ chart: e, event: t }]), !1;
  }
}
function xC(e, t) {
  const n = ve(e),
    { pan: i, zoom: r = {} } = n.options;
  if (t.button !== 0 || Yy(Ls(i), t) || Wf(Ls(r.drag), t))
    return W(r.onZoomRejected, [{ chart: e, event: t }]);
  Jy(e, t, r) !== !1 &&
    ((n.dragStart = t),
    os(e, e.canvas, "mousemove", yC),
    os(e, window.document, "keydown", vC));
}
function ev(e, t, n, i) {
  const r = $n(t, "x", e),
    s = $n(t, "y", e);
  let {
    top: o,
    left: l,
    right: a,
    bottom: u,
    width: c,
    height: f,
  } = e.chartArea;
  const d = Kt(n, e),
    h = Kt(i, e);
  r && ((l = Math.min(d.x, h.x)), (a = Math.max(d.x, h.x))),
    s && ((o = Math.min(d.y, h.y)), (u = Math.max(d.y, h.y)));
  const m = a - l,
    v = u - o;
  return {
    left: l,
    top: o,
    right: a,
    bottom: u,
    width: m,
    height: v,
    zoomX: r && m ? 1 + (c - m) / c : 1,
    zoomY: s && v ? 1 + (f - v) / f : 1,
  };
}
function _C(e, t) {
  const n = ve(e);
  if (!n.dragStart) return;
  Ge(e, "mousemove");
  const {
      mode: i,
      onZoomComplete: r,
      drag: { threshold: s = 0 },
    } = n.options.zoom,
    o = ev(e, i, n.dragStart, t),
    l = $n(i, "x", e) ? o.width : 0,
    a = $n(i, "y", e) ? o.height : 0,
    u = Math.sqrt(l * l + a * a);
  if (((n.dragStart = n.dragEnd = null), u <= s)) {
    (n.dragging = !1), e.update("none");
    return;
  }
  Qy(e, { x: o.left, y: o.top }, { x: o.right, y: o.bottom }, "zoom"),
    setTimeout(() => (n.dragging = !1), 500),
    W(r, [{ chart: e }]);
}
function wC(e, t, n) {
  if (Wf(Ls(n.wheel), t)) {
    W(n.onZoomRejected, [{ chart: e, event: t }]);
    return;
  }
  if (
    Jy(e, t, n) !== !1 &&
    (t.cancelable && t.preventDefault(), t.deltaY !== void 0)
  )
    return !0;
}
function SC(e, t) {
  const {
    handlers: { onZoomComplete: n },
    options: { zoom: i },
  } = ve(e);
  if (!wC(e, t, i)) return;
  const r = t.target.getBoundingClientRect(),
    s = 1 + (t.deltaY >= 0 ? -i.wheel.speed : i.wheel.speed),
    o = {
      x: s,
      y: s,
      focalPoint: { x: t.clientX - r.left, y: t.clientY - r.top },
    };
  Vf(e, o), n && n();
}
function bC(e, t, n, i) {
  n && (ve(e).handlers[t] = JT(() => W(n, [{ chart: e }]), i));
}
function EC(e, t) {
  const n = e.canvas,
    { wheel: i, drag: r, onZoomComplete: s } = t.zoom;
  i.enabled
    ? (os(e, n, "wheel", SC), bC(e, "onZoomComplete", s, 250))
    : Ge(e, "wheel"),
    r.enabled
      ? (os(e, n, "mousedown", xC), os(e, n.ownerDocument, "mouseup", _C))
      : (Ge(e, "mousedown"),
        Ge(e, "mousemove"),
        Ge(e, "mouseup"),
        Ge(e, "keydown"));
}
function kC(e) {
  Ge(e, "mousedown"),
    Ge(e, "mousemove"),
    Ge(e, "mouseup"),
    Ge(e, "wheel"),
    Ge(e, "click"),
    Ge(e, "keydown");
}
function TC(e, t) {
  return function (n, i) {
    const { pan: r, zoom: s = {} } = t.options;
    if (!r || !r.enabled) return !1;
    const o = i && i.srcEvent;
    return o &&
      !t.panning &&
      i.pointerType === "mouse" &&
      (Wf(Ls(r), o) || Yy(Ls(s.drag), o))
      ? (W(r.onPanRejected, [{ chart: e, event: i }]), !1)
      : !0;
  };
}
function CC(e, t) {
  const n = Math.abs(e.clientX - t.clientX),
    i = Math.abs(e.clientY - t.clientY),
    r = n / i;
  let s, o;
  return (
    r > 0.3 && r < 1.7 ? (s = o = !0) : n > i ? (s = !0) : (o = !0),
    { x: s, y: o }
  );
}
function tv(e, t, n) {
  if (t.scale) {
    const { center: i, pointers: r } = n,
      s = (1 / t.scale) * n.scale,
      o = n.target.getBoundingClientRect(),
      l = CC(r[0], r[1]),
      a = t.options.zoom.mode,
      u = {
        x: l.x && $n(a, "x", e) ? s : 1,
        y: l.y && $n(a, "y", e) ? s : 1,
        focalPoint: { x: i.x - o.left, y: i.y - o.top },
      };
    Vf(e, u), (t.scale = n.scale);
  }
}
function PC(e, t) {
  t.options.zoom.pinch.enabled && (t.scale = 1);
}
function OC(e, t, n) {
  t.scale &&
    (tv(e, t, n),
    (t.scale = null),
    W(t.options.zoom.onZoomComplete, [{ chart: e }]));
}
function nv(e, t, n) {
  const i = t.delta;
  i &&
    ((t.panning = !0),
    Gy(e, { x: n.deltaX - i.x, y: n.deltaY - i.y }, t.panScales),
    (t.delta = { x: n.deltaX, y: n.deltaY }));
}
function NC(e, t, n) {
  const { enabled: i, onPanStart: r, onPanRejected: s } = t.options.pan;
  if (!i) return;
  const o = n.target.getBoundingClientRect(),
    l = { x: n.center.x - o.left, y: n.center.y - o.top };
  if (W(r, [{ chart: e, event: n, point: l }]) === !1)
    return W(s, [{ chart: e, event: n }]);
  (t.panScales = Xy(t.options.pan, l, e)),
    (t.delta = { x: 0, y: 0 }),
    clearTimeout(t.panEndTimeout),
    nv(e, t, n);
}
function MC(e, t) {
  (t.delta = null),
    t.panning &&
      ((t.panEndTimeout = setTimeout(() => (t.panning = !1), 500)),
      W(t.options.pan.onPanComplete, [{ chart: e }]));
}
const Ec = new WeakMap();
function RC(e, t) {
  const n = ve(e),
    i = e.canvas,
    { pan: r, zoom: s } = t,
    o = new ss.Manager(i);
  s &&
    s.pinch.enabled &&
    (o.add(new ss.Pinch()),
    o.on("pinchstart", () => PC(e, n)),
    o.on("pinch", (l) => tv(e, n, l)),
    o.on("pinchend", (l) => OC(e, n, l))),
    r &&
      r.enabled &&
      (o.add(new ss.Pan({ threshold: r.threshold, enable: TC(e, n) })),
      o.on("panstart", (l) => NC(e, n, l)),
      o.on("panmove", (l) => nv(e, n, l)),
      o.on("panend", () => MC(e, n))),
    Ec.set(e, o);
}
function LC(e) {
  const t = Ec.get(e);
  t &&
    (t.remove("pinchstart"),
    t.remove("pinch"),
    t.remove("pinchend"),
    t.remove("panstart"),
    t.remove("pan"),
    t.remove("panend"),
    t.destroy(),
    Ec.delete(e));
}
var IC = "2.0.1";
function Ro(e, t, n) {
  const i = n.zoom.drag,
    { dragStart: r, dragEnd: s } = ve(e);
  if (i.drawTime !== t || !s) return;
  const { left: o, top: l, width: a, height: u } = ev(e, n.zoom.mode, r, s),
    c = e.ctx;
  c.save(),
    c.beginPath(),
    (c.fillStyle = i.backgroundColor || "rgba(225,225,225,0.3)"),
    c.fillRect(o, l, a, u),
    i.borderWidth > 0 &&
      ((c.lineWidth = i.borderWidth),
      (c.strokeStyle = i.borderColor || "rgba(225,225,225)"),
      c.strokeRect(o, l, a, u)),
    c.restore();
}
var DC = {
    id: "zoom",
    version: IC,
    defaults: {
      pan: { enabled: !1, mode: "xy", threshold: 10, modifierKey: null },
      zoom: {
        wheel: { enabled: !1, speed: 0.1, modifierKey: null },
        drag: {
          enabled: !1,
          drawTime: "beforeDatasetsDraw",
          modifierKey: null,
        },
        pinch: { enabled: !1 },
        mode: "xy",
      },
    },
    start: function (e, t, n) {
      const i = ve(e);
      (i.options = n),
        Object.prototype.hasOwnProperty.call(n.zoom, "enabled") &&
          console.warn(
            "The option `zoom.enabled` is no longer supported. Please use `zoom.wheel.enabled`, `zoom.drag.enabled`, or `zoom.pinch.enabled`."
          ),
        (Object.prototype.hasOwnProperty.call(n.zoom, "overScaleMode") ||
          Object.prototype.hasOwnProperty.call(n.pan, "overScaleMode")) &&
          console.warn(
            "The option `overScaleMode` is deprecated. Please use `scaleMode` instead (and update `mode` as desired)."
          ),
        ss && RC(e, n),
        (e.pan = (r, s, o) => Gy(e, r, s, o)),
        (e.zoom = (r, s) => Vf(e, r, s)),
        (e.zoomRect = (r, s, o) => Qy(e, r, s, o)),
        (e.zoomScale = (r, s, o) => dC(e, r, s, o)),
        (e.resetZoom = (r) => hC(e, r)),
        (e.getZoomLevel = () => mC(e)),
        (e.getInitialScaleBounds = () => Zy(e)),
        (e.isZoomedOrPanned = () => gC(e));
    },
    beforeEvent(e) {
      const t = ve(e);
      if (t.panning || t.dragging) return !1;
    },
    beforeUpdate: function (e, t, n) {
      const i = ve(e);
      (i.options = n), EC(e, n);
    },
    beforeDatasetsDraw(e, t, n) {
      Ro(e, "beforeDatasetsDraw", n);
    },
    afterDatasetsDraw(e, t, n) {
      Ro(e, "afterDatasetsDraw", n);
    },
    beforeDraw(e, t, n) {
      Ro(e, "beforeDraw", n);
    },
    afterDraw(e, t, n) {
      Ro(e, "afterDraw", n);
    },
    stop: function (e) {
      kC(e), ss && LC(e), tC(e);
    },
    panFunctions: bc,
    zoomFunctions: wc,
    zoomRectFunctions: Sc,
  },
  iv = {
    color: void 0,
    size: void 0,
    className: void 0,
    style: void 0,
    attr: void 0,
  },
  om = It.createContext && It.createContext(iv),
  AC = ["attr", "size", "title"];
function jC(e, t) {
  if (e == null) return {};
  var n = zC(e, t),
    i,
    r;
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (r = 0; r < s.length; r++)
      (i = s[r]),
        !(t.indexOf(i) >= 0) &&
          Object.prototype.propertyIsEnumerable.call(e, i) &&
          (n[i] = e[i]);
  }
  return n;
}
function zC(e, t) {
  if (e == null) return {};
  var n = {};
  for (var i in e)
    if (Object.prototype.hasOwnProperty.call(e, i)) {
      if (t.indexOf(i) >= 0) continue;
      n[i] = e[i];
    }
  return n;
}
function Il() {
  return (
    (Il = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var i in n)
              Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
          }
          return e;
        }),
    Il.apply(this, arguments)
  );
}
function lm(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t &&
      (i = i.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })),
      n.push.apply(n, i);
  }
  return n;
}
function Dl(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? lm(Object(n), !0).forEach(function (i) {
          FC(e, i, n[i]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
      : lm(Object(n)).forEach(function (i) {
          Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
        });
  }
  return e;
}
function FC(e, t, n) {
  return (
    (t = BC(t)),
    t in e
      ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = n),
    e
  );
}
function BC(e) {
  var t = HC(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function HC(e, t) {
  if (typeof e != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t || "default");
    if (typeof i != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function rv(e) {
  return (
    e &&
    e.map((t, n) =>
      It.createElement(t.tag, Dl({ key: n }, t.attr), rv(t.child))
    )
  );
}
function $f(e) {
  return (t) =>
    It.createElement(UC, Il({ attr: Dl({}, e.attr) }, t), rv(e.child));
}
function UC(e) {
  var t = (n) => {
    var { attr: i, size: r, title: s } = e,
      o = jC(e, AC),
      l = r || n.size || "1em",
      a;
    return (
      n.className && (a = n.className),
      e.className && (a = (a ? a + " " : "") + e.className),
      It.createElement(
        "svg",
        Il(
          { stroke: "currentColor", fill: "currentColor", strokeWidth: "0" },
          n.attr,
          i,
          o,
          {
            className: a,
            style: Dl(Dl({ color: e.color || n.color }, n.style), e.style),
            height: l,
            width: l,
            xmlns: "http://www.w3.org/2000/svg",
          }
        ),
        s && It.createElement("title", null, s),
        e.children
      )
    );
  };
  return om !== void 0
    ? It.createElement(om.Consumer, null, (n) => t(n))
    : t(iv);
}
function WC(e) {
  return $f({
    tag: "svg",
    attr: { viewBox: "0 0 320 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z",
        },
        child: [],
      },
    ],
  })(e);
}
function VC(e) {
  return $f({
    tag: "svg",
    attr: { viewBox: "0 0 320 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z",
        },
        child: [],
      },
    ],
  })(e);
}
function $C(e) {
  return $f({
    tag: "svg",
    attr: { viewBox: "0 0 352 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z",
        },
        child: [],
      },
    ],
  })(e);
}
var sv = { exports: {} },
  YC = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",
  XC = YC,
  KC = XC;
function ov() {}
function lv() {}
lv.resetWarningCache = ov;
var qC = function () {
  function e(i, r, s, o, l, a) {
    if (a !== KC) {
      var u = new Error(
        "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
      );
      throw ((u.name = "Invariant Violation"), u);
    }
  }
  e.isRequired = e;
  function t() {
    return e;
  }
  var n = {
    array: e,
    bigint: e,
    bool: e,
    func: e,
    number: e,
    object: e,
    string: e,
    symbol: e,
    any: e,
    arrayOf: t,
    element: e,
    elementType: e,
    instanceOf: t,
    node: e,
    objectOf: t,
    oneOf: t,
    oneOfType: t,
    shape: t,
    exact: t,
    checkPropTypes: lv,
    resetWarningCache: ov,
  };
  return (n.PropTypes = n), n;
};
sv.exports = qC();
var QC = sv.exports;
const we = kc(QC);
oa.register(Ur, Go, vc, xc, jT, CT, OT, DC);
const av = ({ data: e, onClose: t }) => {
  if (!e) return null;
  const r = {
      labels: ((o) =>
        o.map((l) =>
          new Date(l * 1e3).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        ))(e.timestamp),
      datasets: [
        {
          label: "OI Change",
          data: e.oichng,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: !1,
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.1,
        },
        {
          label: "(OI)",
          data: e.oi,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: !1,
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.1,
        },
        {
          label: "Volume",
          data: e.vol,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: !1,
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.1,
        },
      ],
    },
    s = {
      responsive: !0,
      maintainAspectRatio: !1,
      plugins: {
        legend: { display: !0, position: "top" },
        tooltip: { enabled: !0, mode: "nearest", intersect: !1 },
        zoom: {
          zoom: { wheel: { enabled: !0 }, pinch: { enabled: !0 }, mode: "xy" },
          pan: { enabled: !0, mode: "xy" },
        },
      },
    };
  return S.jsx("div", {
    className: `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 \r
                 bg-teal-400 bg-opacity-75 rounded-lg p-1 shadow-lg w-[97%] h-[95%] z-50`,
    role: "dialog",
    "aria-modal": "true",
    children: S.jsxs("div", {
      className: "flex flex-col items-center relative w-full h-full",
      children: [
        S.jsx("button", {
          className:
            "absolute top-1 right-2 text-gray-800 hover:text-gray-600 transition duration-200",
          onClick: (o) => {
            o.stopPropagation(), t();
          },
          "aria-label": "Close Popup",
          children: S.jsx($C, { size: 24 }),
        }),
        S.jsxs("p", {
          className: "text-2xl font-bold text-gray-800 ",
          children: [e.strike, " ", e.isCe ? "CE" : "PE"],
        }),
        S.jsx("div", {
          className:
            "bg-gray-100 bg-opacity-80 p-2 rounded-lg shadow-md w-full h-[95%]",
          children: S.jsx(GT, { data: r, options: s }),
        }),
      ],
    }),
  });
};
av.propTypes = {
  data: we.shape({
    timestamp: we.arrayOf(we.string).isRequired,
    oichng: we.arrayOf(we.number).isRequired,
    oi: we.arrayOf(we.number).isRequired,
    vol: we.arrayOf(we.number).isRequired,
    strike: we.oneOfType([we.string, we.number]).isRequired,
    isCe: we.bool.isRequired,
  }),
  onClose: we.func.isRequired,
};
const su = (e, t, n, i) => {
    if (isNaN(t) || !n) return "";
    const r = i ? "bg-red-300 z-50" : "bg-green-300 z-50";
    return t == "1"
      ? r
      : e <= 0
      ? "text-red-500"
      : t == "2"
      ? "bg-yellow-300"
      : ["3", "4", "5"].includes(t)
      ? "bg-yellow-100"
      : "";
  },
  am = (e) => (!isNaN(e) && e <= 0 ? "text-red-500" : "text-green-700"),
  um = (e) => (e > 1.2 ? "text-green-700" : e < 0.8 ? "text-red-500" : "");
function GC(e, t, n, i, r) {
  var f, d;
  const [s, o] = M.useState({ ceData: {}, peData: {}, oc: {} });
  M.useEffect(() => {
    o({
      ceData: (e == null ? void 0 : e.ce) || {},
      peData: (e == null ? void 0 : e.pe) || {},
      oc: i || {},
    });
  }, [e, i]);
  const { ceData: l, peData: a, oc: u } = s,
    c = M.memo(({ data: h, valueKey: m, isCe: v, strike: _ }) =>
      S.jsxs("td", {
        onClick: () => r(v, _, u),
        className: `${su(h[m], h[m + "_max_value"], n, v)} cursor-pointer`,
        children: [
          st(h[`${m}_percentage`]),
          "% ",
          S.jsx("br", {}),
          S.jsx("small", { children: st(h[m]) }),
        ],
      })
    );
  return (
    (c.propTypes = {
      data: we.object.isRequired,
      valueKey: we.string.isRequired,
      isCe: we.bool.isRequired,
      strike: we.oneOfType([we.string, we.number]).isRequired,
    }),
    S.jsxs(
      It.Fragment,
      {
        children: [
          S.jsxs("td", {
            className: `${su(
              l == null ? void 0 : l.iv,
              l == null ? void 0 : l.iv,
              n,
              !0
            )}`,
            children: [
              st(l == null ? void 0 : l.iv),
              " ",
              S.jsx("br", {}),
              S.jsx("small", {
                children: st(
                  (f = l == null ? void 0 : l.optgeeks) == null
                    ? void 0
                    : f.delta
                ),
              }),
            ],
          }),
          S.jsx(c, { data: l, valueKey: "oichng", isCe: !0, strike: t }),
          S.jsx(c, { data: l, valueKey: "OI", isCe: !0, strike: t }),
          S.jsx(c, { data: l, valueKey: "vol", isCe: !0, strike: t }),
          S.jsxs("td", {
            children: [
              st(l == null ? void 0 : l.ltp),
              " ",
              S.jsx("br", {}),
              S.jsx("small", {
                className: am(l == null ? void 0 : l.p_chng),
                children: st(l == null ? void 0 : l.p_chng),
              }),
            ],
          }),
          S.jsxs("td", {
            className: "font-bold bg-gray-300",
            children: [
              t,
              " ",
              S.jsx("br", {}),
              S.jsx("small", {
                className: `font-normal ${um(
                  (a == null ? void 0 : a.OI) / (l == null ? void 0 : l.OI)
                )}`,
                children: Xt(
                  (a == null ? void 0 : a.OI) / (l == null ? void 0 : l.OI)
                ),
              }),
              " /",
              S.jsx("small", {
                className: `font-normal ${um(
                  (a == null ? void 0 : a.oichng) /
                    (l == null ? void 0 : l.oichng)
                )}`,
                children: Xt(
                  (a == null ? void 0 : a.oichng) /
                    (l == null ? void 0 : l.oichng)
                ),
              }),
            ],
          }),
          S.jsxs("td", {
            children: [
              st(a == null ? void 0 : a.ltp),
              " ",
              S.jsx("br", {}),
              S.jsx("small", {
                className: am(a == null ? void 0 : a.p_chng),
                children: st(a == null ? void 0 : a.p_chng),
              }),
            ],
          }),
          S.jsx(c, { data: a, valueKey: "vol", isCe: !1, strike: t }),
          S.jsx(c, { data: a, valueKey: "OI", isCe: !1, strike: t }),
          S.jsx(c, { data: a, valueKey: "oichng", isCe: !1, strike: t }),
          S.jsxs("td", {
            className: `${su(
              a == null ? void 0 : a.iv,
              a == null ? void 0 : a.iv,
              n,
              !1
            )}`,
            children: [
              st(a == null ? void 0 : a.iv),
              " ",
              S.jsx("br", {}),
              S.jsx("small", {
                children: st(
                  (d = a == null ? void 0 : a.optgeeks) == null
                    ? void 0
                    : d.delta
                ),
              }),
            ],
          }),
        ],
      },
      t
    )
  );
}
function ZC(e, t) {
  const n = t,
    i = Object.keys(e).filter((s) => s > t),
    r = Object.keys(e).filter((s) => s < t);
  return { nearestStrike: n, otmStrikes: i, itmStrikes: r };
}
function JC() {
  var N, I, D, F, B, Z;
  const {
      data: e,
      isReversed: t,
      isHighlighting: n,
      setIsOc: i,
      symbol: r,
      exp: s,
    } = M.useContext(ki),
    [o, l] = M.useState(null),
    [a, u] = M.useState(!1),
    [c, f] = M.useState(!1),
    [d, h] = M.useState(null);
  M.useEffect(() => (i(!0), () => i(!1)), [i]);
  const m = M.useCallback(async (X) => {
      f(!0), h(null);
      try {
        const $ = await me.post(
          "http://192.168.29.33:8000/api/percentage-data",
          X
        );
        $.data ? (l($.data), u(!0)) : h("No data received from API.");
      } catch ($) {
        console.error("Error fetching data:", $), h("Failed to fetch data.");
      } finally {
        f(!1);
      }
    }, []),
    v =
      ((I = (N = e == null ? void 0 : e.options) == null ? void 0 : N.data) ==
      null
        ? void 0
        : I.oc) || {},
    _ = ((D = e == null ? void 0 : e.options) == null ? void 0 : D.data) || {},
    g =
      (B = (F = e == null ? void 0 : e.spot) == null ? void 0 : F.data) !=
        null && B.Ltp
        ? Math.round(e.spot.data.Ltp)
        : null,
    {
      nearestStrike: y,
      otmStrikes: w,
      itmStrikes: E,
    } = M.useMemo(() => ZC(v, g), [v, g]),
    k = M.useMemo(() => {
      const X = [...E, ...w];
      return t ? X.reverse() : X;
    }, [E, w, t]),
    P = (X, $) => {
      m({ strike: $, exp: s, isCe: X, sid: r });
    },
    C = () => {
      l(null), u(!1);
    };
  return (Z = e == null ? void 0 : e.options) != null && Z.data
    ? S.jsxs("div", {
        className: "h-[100vh] overflow-y-auto",
        children: [
          c && S.jsx("div", { children: "Loading..." }),
          d && S.jsx("div", { className: "text-red-500", children: d }),
          S.jsxs("table", {
            id: "options-table",
            className:
              "w-full bg-white shadow-lg rounded-lg text-sm md:text-base border border-gray-300 text-center table-fixed",
            children: [
              S.jsx("thead", {
                className:
                  "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 text-gray-700 font-semibold sticky top-0 z-10",
                children: S.jsxs("tr", {
                  className: "divide-x divide-gray-300",
                  children: [
                    ["IV", "OI CHANGE", "OI", "VOLUME", "LTP"].map((X, $) =>
                      S.jsxs(
                        "th",
                        {
                          className: "p-2",
                          children: [
                            X,
                            S.jsx("br", {}),
                            S.jsx("small", {
                              className: "text-xs text-gray-500",
                              children: $ === 0 ? "Delta" : "Ltp_chng",
                            }),
                          ],
                        },
                        $
                      )
                    ),
                    S.jsxs("th", {
                      className: "p-2 bg-yellow-100 text-yellow-800 font-bold",
                      children: [
                        "Strike Price",
                        S.jsx("br", {}),
                        S.jsx("small", {
                          className: "text-xs text-yellow-600",
                          children: "PCR",
                        }),
                      ],
                    }),
                    ["LTP", "VOLUME", "OI", "OI CHANGE", "IV"].map((X, $) =>
                      S.jsxs(
                        "th",
                        {
                          className: "p-2",
                          children: [
                            X,
                            S.jsx("br", {}),
                            S.jsx("small", {
                              className: "text-xs text-gray-500",
                              children: $ === 0 ? "Ltp_chng" : "Delta",
                            }),
                          ],
                        },
                        $ + 5
                      )
                    ),
                  ],
                }),
              }),
              S.jsx("tbody", {
                className: "divide-y divide-gray-200",
                children: k.map((X) =>
                  S.jsx(
                    "tr",
                    {
                      className:
                        "hover:bg-gray-100 transition-all duration-200 ease-in-out divide-x divide-gray-300",
                      children: GC(v[X], X, n, _, P),
                    },
                    X
                  )
                ),
              }),
            ],
          }),
          a && S.jsx(av, { data: o, onClose: C }),
        ],
      })
    : S.jsx("div", { children: "No data available" });
}
const e2 = "/assets/loading-1-CRADPi3j.gif";
function uv() {
  return S.jsx("div", {
    className:
      "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50",
    children: S.jsx("img", { src: e2, alt: "Loading", className: "w-16 h-16" }),
  });
}
function t2({
  setIsReversed: e,
  setIsHighlighting: t,
  isHighlighting: n,
  isReversed: i,
}) {
  return S.jsxs("div", {
    className: "flex gap-4 z-20",
    children: [
      S.jsx("button", {
        id: "toggleOrder",
        onClick: () => e((r) => !r),
        className:
          "bg-blue-600 text-white px-4 py-2 rounded-md transition  ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300",
        children: "Toggle Order",
      }),
      S.jsxs("button", {
        id: "toggleHighlight",
        onClick: () => t((r) => !r),
        className: `bg-green-600 text-white px-4 py-2 rounded-md transition  ease-in-out ${
          n ? "hover:bg-green-700" : "hover:bg-green-500"
        } focus:outline-none focus:ring-2 focus:ring-green-300`,
        children: [n ? "Disable" : "Enable", " Highlighting"],
      }),
    ],
  });
}
function n2() {
  const {
      setIsHighlighting: e,
      setIsReversed: t,
      isHighlighting: n,
      isReversed: i,
      data: r,
      setExp: s,
      expDate: o,
    } = M.useContext(ki),
    a = r
      ? ((w) =>
          w.map((E) => {
            const k = new Date(E * 1e3),
              P = k.getUTCDate().toString().padStart(2, "0"),
              C = k.toLocaleString("en-US", {
                month: "short",
                timeZone: "UTC",
              });
            return `${P} ${C}`;
          }))(r.fut.data.explist)
      : [],
    u = r ? r.fut.data.explist : [],
    [c, f] = M.useState(0),
    d = 8,
    h = c * d,
    m = h + d,
    v = a.slice(h, m),
    _ = () => {
      m < a.length && f(c + 1);
    },
    g = () => {
      h > 0 && f(c - 1);
    },
    y = (w, E) => {
      h >= 8 ? s(u[h + E] || 0) : s(u[E] || 0);
    };
  return S.jsx("div", {
    className: "flex items-center justify-between",
    children: r
      ? S.jsxs(S.Fragment, {
          children: [
            S.jsx("div", {
              className: "flex flex-wrap",
              children: v.map((w, E) =>
                S.jsx(
                  "button",
                  {
                    onClick: () => y(w, E),
                    className:
                      "m-1 px-2 py-0 bg-blue-500 text-white rounded-md transition  ease-in-out hover:bg-blue-600",
                    children: w,
                  },
                  E
                )
              ),
            }),
            S.jsx("div", { className: "font-bold", children: S.jsx(ry, {}) }),
            S.jsxs("div", {
              className: "gap-3 flex ",
              children: [
                S.jsxs("div", {
                  className: "flex items-center ml-4",
                  children: [
                    S.jsx("button", {
                      onClick: g,
                      disabled: h === 0,
                      className:
                        "p-2 bg-blue-500 text-white rounded disabled:bg-gray-300",
                      children: S.jsx(WC, {}),
                    }),
                    S.jsx("button", {
                      onClick: _,
                      disabled: m >= a.length,
                      className:
                        "p-2 bg-blue-500 text-white rounded disabled:bg-gray-300 ml-2",
                      children: S.jsx(VC, {}),
                    }),
                  ],
                }),
                S.jsx("div", {
                  children: S.jsx(t2, {
                    setIsReversed: t,
                    setIsHighlighting: e,
                    isHighlighting: n,
                    isReversed: i,
                  }),
                }),
              ],
            }),
          ],
        })
      : S.jsx("div", {
          className: "bg-white rounded-lg shadow-md p-2 mb-0.5 text-center",
          children: S.jsx(uv, {}),
        }),
  });
}
function i2() {
  const { data: e } = M.useContext(ki);
  return S.jsx("div", {
    className: "bg-gray-100 min-h-screen flex flex-col items-center p-4",
    children: S.jsx("div", {
      className: "w-full max-w-full space-y-4",
      children: e
        ? S.jsxs(S.Fragment, {
            children: [
              S.jsx("div", {
                className: "bg-white shadow-lg rounded-lg p-4",
                children: S.jsx(qS, {}),
              }),
              S.jsx("div", {
                className: "bg-white shadow-lg rounded-lg p-4",
                children: S.jsx(n2, {}),
              }),
              S.jsx("div", {
                className:
                  "flex flex-col flex-grow bg-white shadow-lg rounded-lg overflow-hidden",
                children: S.jsx(JC, {}),
              }),
            ],
          })
        : S.jsx("div", {
            className: "bg-white rounded-lg shadow-md p-6 mb-0.5 text-center",
            role: "status",
            "aria-live": "polite",
            children: S.jsx(uv, {}),
          }),
    }),
  });
}
const r2 = () =>
  S.jsxs(aw, {
    children: [
      S.jsx(dw, {}),
      S.jsxs(tw, {
        children: [
          S.jsx($o, { path: "/", element: S.jsx(WS, {}) }),
          S.jsx($o, { path: "/about", element: S.jsx(XS, {}) }),
          S.jsx($o, { path: "/advanced-option-chain", element: S.jsx(i2, {}) }),
        ],
      }),
    ],
  });
S0(document.getElementById("root")).render(
  S.jsx(M.StrictMode, { children: S.jsx(US, { children: S.jsx(r2, {}) }) })
);
