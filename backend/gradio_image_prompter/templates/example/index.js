const { setContext: ee, getContext: p } = window.__gradio__svelte__internal, v = "WORKER_PROXY_CONTEXT_KEY";
function y() {
  return p(v);
}
function k(l) {
  return l.host === window.location.host || l.host === "localhost:7860" || l.host === "127.0.0.1:7860" || // Ref: https://github.com/gradio-app/gradio/blob/v3.32.0/js/app/src/Index.svelte#L194
  l.host === "lite.local";
}
async function f(l) {
  if (l == null)
    return l;
  const e = new URL(l);
  if (!k(e) || e.protocol !== "http:" && e.protocol !== "https:")
    return l;
  const r = y();
  if (r == null)
    return l;
  const n = e.pathname;
  return r.httpRequest({
    method: "GET",
    path: n,
    headers: {},
    query_string: ""
  }).then((t) => {
    if (t.status !== 200)
      throw new Error(`Failed to get file ${n} from the Wasm worker.`);
    const o = new Blob([t.body], {
      type: t.headers["Content-Type"]
    });
    return URL.createObjectURL(o);
  });
}
const {
  SvelteComponent: w,
  append: C,
  assign: _,
  compute_rest_props: d,
  detach: u,
  element: b,
  empty: E,
  exclude_internal_props: R,
  get_spread_update: O,
  handle_promise: h,
  init: q,
  insert: m,
  noop: c,
  safe_not_equal: T,
  set_attributes: g,
  set_data: P,
  set_style: U,
  src_url_equal: W,
  text: K,
  update_await_block_branch: X
} = window.__gradio__svelte__internal;
function Y(l) {
  let e, r = (
    /*error*/
    l[3].message + ""
  ), n;
  return {
    c() {
      e = b("p"), n = K(r), U(e, "color", "red");
    },
    m(t, o) {
      m(t, e, o), C(e, n);
    },
    p(t, o) {
      o & /*src*/
      1 && r !== (r = /*error*/
      t[3].message + "") && P(n, r);
    },
    d(t) {
      t && u(e);
    }
  };
}
function L(l) {
  let e, r, n = [
    {
      src: r = /*resolved_src*/
      l[2]
    },
    /*$$restProps*/
    l[1]
  ], t = {};
  for (let o = 0; o < n.length; o += 1)
    t = _(t, n[o]);
  return {
    c() {
      e = b("img"), g(e, t);
    },
    m(o, s) {
      m(o, e, s);
    },
    p(o, s) {
      g(e, t = O(n, [
        s & /*src*/
        1 && !W(e.src, r = /*resolved_src*/
        o[2]) && { src: r },
        s & /*$$restProps*/
        2 && /*$$restProps*/
        o[1]
      ]));
    },
    d(o) {
      o && u(e);
    }
  };
}
function N(l) {
  return { c, m: c, p: c, d: c };
}
function S(l) {
  let e, r, n = {
    ctx: l,
    current: null,
    token: null,
    hasCatch: !0,
    pending: N,
    then: L,
    catch: Y,
    value: 2,
    error: 3
  };
  return h(r = f(
    /*src*/
    l[0]
  ), n), {
    c() {
      e = E(), n.block.c();
    },
    m(t, o) {
      m(t, e, o), n.block.m(t, n.anchor = o), n.mount = () => e.parentNode, n.anchor = e;
    },
    p(t, [o]) {
      l = t, n.ctx = l, o & /*src*/
      1 && r !== (r = f(
        /*src*/
        l[0]
      )) && h(r, n) || X(n, l, o);
    },
    i: c,
    o: c,
    d(t) {
      t && u(e), n.block.d(t), n.token = null, n = null;
    }
  };
}
function j(l, e, r) {
  const n = ["src"];
  let t = d(e, n), { src: o = void 0 } = e;
  return l.$$set = (s) => {
    e = _(_({}, e), R(s)), r(1, t = d(e, n)), "src" in s && r(0, o = s.src);
  }, [o, t];
}
class B extends w {
  constructor(e) {
    super(), q(this, e, j, S, T, { src: 0 });
  }
}
const {
  SvelteComponent: F,
  attr: G,
  create_component: I,
  destroy_component: z,
  detach: A,
  element: D,
  init: H,
  insert: J,
  mount_component: M,
  safe_not_equal: Q,
  toggle_class: i,
  transition_in: V,
  transition_out: Z
} = window.__gradio__svelte__internal;
function x(l) {
  let e, r, n;
  return r = new B({
    props: {
      src: (
        /*samples_dir*/
        l[1] + /*value*/
        l[0]
      ),
      alt: ""
    }
  }), {
    c() {
      e = D("div"), I(r.$$.fragment), G(e, "class", "container svelte-h11ksk"), i(
        e,
        "table",
        /*type*/
        l[2] === "table"
      ), i(
        e,
        "gallery",
        /*type*/
        l[2] === "gallery"
      ), i(
        e,
        "selected",
        /*selected*/
        l[3]
      );
    },
    m(t, o) {
      J(t, e, o), M(r, e, null), n = !0;
    },
    p(t, [o]) {
      const s = {};
      o & /*samples_dir, value*/
      3 && (s.src = /*samples_dir*/
      t[1] + /*value*/
      t[0]), r.$set(s), (!n || o & /*type*/
      4) && i(
        e,
        "table",
        /*type*/
        t[2] === "table"
      ), (!n || o & /*type*/
      4) && i(
        e,
        "gallery",
        /*type*/
        t[2] === "gallery"
      ), (!n || o & /*selected*/
      8) && i(
        e,
        "selected",
        /*selected*/
        t[3]
      );
    },
    i(t) {
      n || (V(r.$$.fragment, t), n = !0);
    },
    o(t) {
      Z(r.$$.fragment, t), n = !1;
    },
    d(t) {
      t && A(e), z(r);
    }
  };
}
function $(l, e, r) {
  let { value: n } = e, { samples_dir: t } = e, { type: o } = e, { selected: s = !1 } = e;
  return l.$$set = (a) => {
    "value" in a && r(0, n = a.value), "samples_dir" in a && r(1, t = a.samples_dir), "type" in a && r(2, o = a.type), "selected" in a && r(3, s = a.selected);
  }, [n, t, o, s];
}
class te extends F {
  constructor(e) {
    super(), H(this, e, $, x, Q, {
      value: 0,
      samples_dir: 1,
      type: 2,
      selected: 3
    });
  }
}
export {
  te as default
};
