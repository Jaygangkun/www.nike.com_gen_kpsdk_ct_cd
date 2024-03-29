/* eslint-disable */

module.exports = function() {
    /**
   * @license
   * Adobe Visitor API for JavaScript version: 3.4.0
   * Copyright 2019 Adobe, Inc. All Rights Reserved
   * More info available at https://marketing.adobe.com/resources/help/en_US/mcvid/
   */
    var e = (function() {
        'use strict';
        function e() {
            return {
                callbacks: {},
                add: function(e, t) {
                    this.callbacks[e] = this.callbacks[e] || [];
                    var i = this.callbacks[e].push(t) - 1;
                    return function() {
                        this.callbacks[e].splice(i, 1);
                    }
                    ;
                },
                execute: function(e, t) {
                    if (this.callbacks[e]) {
                        (t = void 0 === t ? [] : t),
                        (t = t instanceof Array ? t : [t]);
                        try {
                            for (; this.callbacks[e].length; ) {
                                var i = this.callbacks[e].shift();
                                'function' == typeof i ? i.apply(null, t) : i instanceof Array && i[1].apply(i[0], t);
                            }
                            delete this.callbacks[e];
                        } catch (e) {}
                    }
                },
                executeAll: function(e, t) {
                    (t || (e && !v.isObjectEmpty(e))) && Object.keys(this.callbacks).forEach(function(t) {
                        var i = void 0 !== e[t] ? e[t] : '';
                        this.execute(t, i);
                    }, this);
                },
                hasCallbacks: function() {
                    return Boolean(Object.keys(this.callbacks).length);
                }
            };
        }
        function t(e) {
            for (var t = /^\d+$/, i = 0, n = e.length; i < n; i++)
                if (!t.test(e[i]))
                    return !1;
            return !0;
        }
        function i(e, t) {
            for (; e.length < t.length; )
                e.push('0');
            for (; t.length < e.length; )
                t.push('0');
        }
        function n(e, t) {
            for (var i = 0; i < e.length; i++) {
                var n = parseInt(e[i], 10)
                  , r = parseInt(t[i], 10);
                if (n > r)
                    return 1;
                if (r > n)
                    return -1;
            }
            return 0;
        }
        function r(e, r) {
            if (e === r)
                return 0;
            var a = e.toString().split('.')
              , s = r.toString().split('.');
            return t(a.concat(s)) ? (i(a, s),
            n(a, s)) : NaN;
        }
        var a = 'undefined' != typeof window ? window : 'undefined' != typeof global ? global : 'undefined' != typeof self ? self : {};
        Object.assign = Object.assign || function(e) {
            for (var t, i, n = 1; n < arguments.length; ++n) {
                i = arguments[n];
                for (t in i)
                    Object.prototype.hasOwnProperty.call(i, t) && (e[t] = i[t]);
            }
            return e;
        }
        ;
        var s = {
            HANDSHAKE: 'HANDSHAKE',
            GETSTATE: 'GETSTATE',
            PARENTSTATE: 'PARENTSTATE'
        }
          , o = {
            MCMID: 'MCMID',
            MCAID: 'MCAID',
            MCAAMB: 'MCAAMB',
            MCAAMLH: 'MCAAMLH',
            MCOPTOUT: 'MCOPTOUT',
            CUSTOMERIDS: 'CUSTOMERIDS'
        }
          , l = {
            MCMID: 'getMarketingCloudVisitorID',
            MCAID: 'getAnalyticsVisitorID',
            MCAAMB: 'getAudienceManagerBlob',
            MCAAMLH: 'getAudienceManagerLocationHint',
            MCOPTOUT: 'getOptOut',
            ALLFIELDS: 'getVisitorValues'
        }
          , d = {
            CUSTOMERIDS: 'getCustomerIDs'
        }
          , c = {
            MCMID: 'getMarketingCloudVisitorID',
            MCAAMB: 'getAudienceManagerBlob',
            MCAAMLH: 'getAudienceManagerLocationHint',
            MCOPTOUT: 'getOptOut',
            MCAID: 'getAnalyticsVisitorID',
            CUSTOMERIDS: 'getCustomerIDs',
            ALLFIELDS: 'getVisitorValues'
        }
          , u = {
            MC: 'MCMID',
            A: 'MCAID',
            AAM: 'MCAAMB'
        }
          , f = {
            MCMID: 'MCMID',
            MCOPTOUT: 'MCOPTOUT',
            MCAID: 'MCAID',
            MCAAMLH: 'MCAAMLH',
            MCAAMB: 'MCAAMB'
        }
          , g = {
            UNKNOWN: 0,
            AUTHENTICATED: 1,
            LOGGED_OUT: 2
        }
          , m = {
            GLOBAL: 'global'
        }
          , h = {
            MESSAGES: s,
            STATE_KEYS_MAP: o,
            ASYNC_API_MAP: l,
            SYNC_API_MAP: d,
            ALL_APIS: c,
            FIELDGROUP_TO_FIELD: u,
            FIELDS: f,
            AUTH_STATE: g,
            OPT_OUT: m
        }
          , _ = h.STATE_KEYS_MAP
          , p = function(e) {
            function t() {}
            function i(t, i) {
                var n = this;
                return function() {
                    var r = e(0, t)
                      , a = {};
                    return (a[t] = r),
                    n.setStateAndPublish(a),
                    i(r),
                    r;
                }
                ;
            }
            var n = this;
            (this.getMarketingCloudVisitorID = function(e) {
                e = e || t;
                var n = this.findField(_.MCMID, e)
                  , r = i.call(this, _.MCMID, e);
                return void 0 !== n ? n : r();
            }
            ),
            (this.getVisitorValues = function(e) {
                n.getMarketingCloudVisitorID(function(t) {
                    e({
                        MCMID: t
                    });
                });
            }
            );
        }
          , C = h.MESSAGES
          , S = h.ASYNC_API_MAP
          , I = h.SYNC_API_MAP
          , D = function() {
            function e() {}
            function t(e, t) {
                var i = this;
                return function() {
                    return (i.callbackRegistry.add(e, t),
                    i.messageParent(C.GETSTATE),
                    '');
                }
                ;
            }
            function i(i) {
                this[S[i]] = function(n) {
                    n = n || e;
                    var r = this.findField(i, n)
                      , a = t.call(this, i, n);
                    return void 0 !== r ? r : a();
                }
                ;
            }
            function n(t) {
                this[I[t]] = function() {
                    return this.findField(t, e) || {};
                }
                ;
            }
            Object.keys(S).forEach(i, this),
            Object.keys(I).forEach(n, this);
        }
          , A = h.ASYNC_API_MAP
          , M = function() {
            Object.keys(A).forEach(function(e) {
                this[A[e]] = function(t) {
                    this.callbackRegistry.add(e, t);
                }
                ;
            }, this);
        }
          , v = (function(e, t) {
            return (t = {
                exports: {}
            }),
            e(t, t.exports),
            t.exports;
        }
        )(function(e, t) {
            (t.isObjectEmpty = function(e) {
                return e === Object(e) && 0 === Object.keys(e).length;
            }
            ),
            (t.isValueEmpty = function(e) {
                return '' === e || t.isObjectEmpty(e);
            }
            ),
            (t.getIeVersion = function() {
                if (document.documentMode)
                    return document.documentMode;
                for (var e = 7; e > 4; e--) {
                    var t = document.createElement('div');
                    if (((t.innerHTML = '\x3c!--[if IE ' + e + ']><span></span><![endif]--\x3e'),
                    t.getElementsByTagName('span').length))
                        return (t = null),
                        e;
                    t = null;
                }
                return null;
            }
            ),
            (t.encodeAndBuildRequest = function(e, t) {
                return e.map(encodeURIComponent).join(t);
            }
            ),
            (t.isObject = function(e) {
                return (null !== e && 'object' == typeof e && !1 === Array.isArray(e));
            }
            );
        })
          , y = (v.isObjectEmpty,
        v.isValueEmpty,
        v.getIeVersion,
        v.encodeAndBuildRequest,
        v.isObject,
        e)
          , b = h.MESSAGES
          , T = {
            0: 'prefix',
            1: 'orgID',
            2: 'state'
        }
          , k = function(e, t) {
            (this.parse = function(e) {
                try {
                    var t = {};
                    return (e.data.split('|').forEach(function(e, i) {
                        if (void 0 !== e) {
                            t[T[i]] = 2 !== i ? e : JSON.parse(e);
                        }
                    }),
                    t);
                } catch (e) {}
            }
            ),
            (this.isInvalid = function(i) {
                var n = this.parse(i);
                if (!n || Object.keys(n).length < 2)
                    return !0;
                var r = e !== n.orgID
                  , a = !t || i.origin !== t
                  , s = -1 === Object.keys(b).indexOf(n.prefix);
                return r || a || s;
            }
            ),
            (this.send = function(i, n, r) {
                var a = n + '|' + e;
                r && r === Object(r) && (a += '|' + JSON.stringify(r));
                try {
                    i.postMessage(a, t);
                } catch (e) {}
            }
            );
        }
          , O = h.MESSAGES
          , E = function(e, t, i, n) {
            function r(e) {
                Object.assign(m, e);
            }
            function s(e) {
                Object.assign(m.state, e),
                Object.assign(m.state.ALLFIELDS, e),
                m.callbackRegistry.executeAll(m.state);
            }
            function o(e) {
                if (!C.isInvalid(e)) {
                    _ = !1;
                    var t = C.parse(e);
                    m.setStateAndPublish(t.state);
                }
            }
            function l(e) {
                !_ && h && ((_ = !0),
                C.send(n, e));
            }
            function d() {
                r(new p(i._generateID)),
                m.getMarketingCloudVisitorID(),
                m.callbackRegistry.executeAll(m.state, !0),
                a.removeEventListener('message', c);
            }
            function c(e) {
                if (!C.isInvalid(e)) {
                    var t = C.parse(e);
                    (_ = !1),
                    a.clearTimeout(m._handshakeTimeout),
                    a.removeEventListener('message', c),
                    r(new D(m)),
                    a.addEventListener('message', o),
                    m.setStateAndPublish(t.state),
                    m.callbackRegistry.hasCallbacks() && l(O.GETSTATE);
                }
            }
            function u() {
                h && postMessage ? (a.addEventListener('message', c),
                l(O.HANDSHAKE),
                (m._handshakeTimeout = setTimeout(d, 250))) : d();
            }
            function f() {
                a.s_c_in || ((a.s_c_il = []),
                (a.s_c_in = 0)),
                (m._c = 'Visitor'),
                (m._il = a.s_c_il),
                (m._in = a.s_c_in),
                (m._il[m._in] = m),
                a.s_c_in++;
            }
            function g() {
                function e(e) {
                    0 !== e.indexOf('_') && 'function' == typeof i[e] && (m[e] = function() {}
                    );
                }
                Object.keys(i).forEach(e),
                (m.getSupplementalDataID = i.getSupplementalDataID),
                (m.isAllowed = function() {
                    return !0;
                }
                );
            }
            var m = this
              , h = t.whitelistParentDomain;
            (m.state = {
                ALLFIELDS: {}
            }),
            (m.version = i.version),
            (m.marketingCloudOrgID = e),
            (m.cookieDomain = i.cookieDomain || ''),
            (m._instanceType = 'child');
            var _ = !1
              , C = new k(e,h);
            (m.callbackRegistry = y()),
            (m.init = function() {
                f(),
                g(),
                r(new M(m)),
                u();
            }
            ),
            (m.findField = function(e, t) {
                if (m.state[e])
                    return t(m.state[e]),
                    m.state[e];
            }
            ),
            (m.messageParent = l),
            (m.setStateAndPublish = s);
        }
          , L = h.MESSAGES
          , P = h.ALL_APIS
          , R = h.ASYNC_API_MAP
          , F = h.FIELDGROUP_TO_FIELD
          , V = function(e, t) {
            function i() {
                var t = {};
                return (Object.keys(P).forEach(function(i) {
                    var n = P[i]
                      , r = e[n]();
                    v.isValueEmpty(r) || (t[i] = r);
                }),
                t);
            }
            function n() {
                var t = [];
                return (e._loading && Object.keys(e._loading).forEach(function(i) {
                    if (e._loading[i]) {
                        var n = F[i];
                        t.push(n);
                    }
                }),
                t.length ? t : null);
            }
            function r(t) {
                return function i(r) {
                    var a = n();
                    if (a) {
                        var s = R[a[0]];
                        e[s](i, !0);
                    } else
                        t();
                }
                ;
            }
            function a(e, n) {
                var r = i();
                t.send(e, n, r);
            }
            function s(e) {
                l(e),
                a(e, L.HANDSHAKE);
            }
            function o(e) {
                r(function() {
                    a(e, L.PARENTSTATE);
                })();
            }
            function l(i) {
                function n(n) {
                    r.call(e, n),
                    t.send(i, L.PARENTSTATE, {
                        CUSTOMERIDS: e.getCustomerIDs()
                    });
                }
                var r = e.setCustomerIDs;
                e.setCustomerIDs = n;
            }
            return function(e) {
                if (!t.isInvalid(e)) {
                    (t.parse(e).prefix === L.HANDSHAKE ? s : o)(e.source);
                }
            }
            ;
        }
          , w = function(e, t) {
            function i(e) {
                return function(i) {
                    (n[e] = i),
                    r++,
                    r === a && t(n);
                }
                ;
            }
            var n = {}
              , r = 0
              , a = Object.keys(e).length;
            Object.keys(e).forEach(function(t) {
                var n = e[t];
                if (n.fn) {
                    var r = n.args || [];
                    r.unshift(i(t)),
                    n.fn.apply(n.context || null, r);
                }
            });
        }
          , N = function(e) {
            var t;
            if ((!e && a.location && (e = a.location.hostname),
            (t = e)))
                if (/^[0-9.]+$/.test(t))
                    t = '';
                else {
                    var i = ',ac,ad,ae,af,ag,ai,al,am,an,ao,aq,ar,as,at,au,aw,ax,az,ba,bb,be,bf,bg,bh,bi,bj,bm,bo,br,bs,bt,bv,bw,by,bz,ca,cc,cd,cf,cg,ch,ci,cl,cm,cn,co,cr,cu,cv,cw,cx,cz,de,dj,dk,dm,do,dz,ec,ee,eg,es,et,eu,fi,fm,fo,fr,ga,gb,gd,ge,gf,gg,gh,gi,gl,gm,gn,gp,gq,gr,gs,gt,gw,gy,hk,hm,hn,hr,ht,hu,id,ie,im,in,io,iq,ir,is,it,je,jo,jp,kg,ki,km,kn,kp,kr,ky,kz,la,lb,lc,li,lk,lr,ls,lt,lu,lv,ly,ma,mc,md,me,mg,mh,mk,ml,mn,mo,mp,mq,mr,ms,mt,mu,mv,mw,mx,my,na,nc,ne,nf,ng,nl,no,nr,nu,nz,om,pa,pe,pf,ph,pk,pl,pm,pn,pr,ps,pt,pw,py,qa,re,ro,rs,ru,rw,sa,sb,sc,sd,se,sg,sh,si,sj,sk,sl,sm,sn,so,sr,st,su,sv,sx,sy,sz,tc,td,tf,tg,th,tj,tk,tl,tm,tn,to,tp,tr,tt,tv,tw,tz,ua,ug,uk,us,uy,uz,va,vc,ve,vg,vi,vn,vu,wf,ws,yt,'
                      , n = t.split('.')
                      , r = n.length - 1
                      , s = r - 1;
                    if ((r > 1 && n[r].length <= 2 && (2 === n[r - 1].length || i.indexOf(',' + n[r] + ',') < 0) && s--,
                    s > 0))
                        for (t = ''; r >= s; )
                            (t = n[r] + (t ? '.' : '') + t),
                            r--;
                }
            return t;
        }
          , x = {
            compare: r,
            isLessThan: function(e, t) {
                return r(e, t) < 0;
            },
            areVersionsDifferent: function(e, t) {
                return 0 !== r(e, t);
            },
            isGreaterThan: function(e, t) {
                return r(e, t) > 0;
            },
            isEqual: function(e, t) {
                return 0 === r(e, t);
            }
        }
          , j = !!a.postMessage
          , U = {
            postMessage: function(e, t, i) {
                var n = 1;
                t && (j ? i.postMessage(e, t.replace(/([^:]+:\/\/[^\/]+).*/, '$1')) : t && (i.location = t.replace(/#.*$/, '') + '#' + +new Date() + n++ + '&' + e));
            },
            receiveMessage: function(e, t) {
                var i;
                try {
                    j && (e && (i = function(i) {
                        if (('string' == typeof t && i.origin !== t) || ('[object Function]' === Object.prototype.toString.call(t) && !1 === t(i.origin)))
                            return !1;
                        e(i);
                    }
                    ),
                    a.addEventListener ? a[e ? 'addEventListener' : 'removeEventListener']('message', i) : a[e ? 'attachEvent' : 'detachEvent']('onmessage', i));
                } catch (e) {}
            }
        }
          , H = function(e) {
            var t, i, n = '0123456789', r = '', a = '', s = 8, o = 10, l = 10;
            if (1 == e) {
                for (n += 'ABCDEF',
                t = 0; 16 > t; t++)
                    (i = Math.floor(Math.random() * s)),
                    (r += n.substring(i, i + 1)),
                    (i = Math.floor(Math.random() * s)),
                    (a += n.substring(i, i + 1)),
                    (s = 16);
                return r + '-' + a;
            }
            for (t = 0; 19 > t; t++)
                (i = Math.floor(Math.random() * o)),
                (r += n.substring(i, i + 1)),
                0 === t && 9 == i ? (o = 3) : (1 == t || 2 == t) && 10 != o && 2 > i ? (o = 10) : 2 < t && (o = 10),
                (i = Math.floor(Math.random() * l)),
                (a += n.substring(i, i + 1)),
                0 === t && 9 == i ? (l = 3) : (1 == t || 2 == t) && 10 != l && 2 > i ? (l = 10) : 2 < t && (l = 10);
            return r + a;
        }
          , B = function(e, t) {
            return {
                corsMetadata: (function() {
                    var e = 'none'
                      , t = !0;
                    return ('undefined' != typeof XMLHttpRequest && XMLHttpRequest === Object(XMLHttpRequest) && ('withCredentials'in new XMLHttpRequest() ? (e = 'XMLHttpRequest') : 'undefined' != typeof XDomainRequest && XDomainRequest === Object(XDomainRequest) && (t = !1),
                    Object.prototype.toString.call(a.HTMLElement).indexOf('Constructor') > 0 && (t = !1)),
                    {
                        corsType: e,
                        corsCookiesEnabled: t
                    });
                }
                )(),
                getCORSInstance: function() {
                    return 'none' === this.corsMetadata.corsType ? null : new a[this.corsMetadata.corsType]();
                },
                fireCORS: function(t, i, n) {
                    function r(e) {
                        var i;
                        try {
                            if ((i = JSON.parse(e)) !== Object(i))
                                return void s.handleCORSError(t, null, 'Response is not JSON');
                        } catch (e) {
                            return void s.handleCORSError(t, e, 'Error parsing response as JSON');
                        }
                        try {
                            for (var n = t.callback, r = a, o = 0; o < n.length; o++)
                                r = r[n[o]];
                            r(i);
                        } catch (e) {
                            s.handleCORSError(t, e, 'Error forming callback function');
                        }
                    }
                    var s = this;
                    i && (t.loadErrorHandler = i);
                    try {
                        var o = this.getCORSInstance();
                        o.open('get', t.corsUrl + '&ts=' + new Date().getTime(), !0),
                        'XMLHttpRequest' === this.corsMetadata.corsType && ((o.withCredentials = !0),
                        (o.timeout = e.loadTimeout),
                        o.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'),
                        (o.onreadystatechange = function() {
                            4 === this.readyState && 200 === this.status && r(this.responseText);
                        }
                        )),
                        (o.onerror = function(e) {
                            s.handleCORSError(t, e, 'onerror');
                        }
                        ),
                        (o.ontimeout = function(e) {
                            s.handleCORSError(t, e, 'ontimeout');
                        }
                        ),
                        o.send(),
                        e._log.requests.push(t.corsUrl);
                    } catch (e) {
                        this.handleCORSError(t, e, 'try-catch');
                    }
                },
                handleCORSError: function(t, i, n) {
                    e.CORSErrors.push({
                        corsData: t,
                        error: i,
                        description: n
                    }),
                    t.loadErrorHandler && ('ontimeout' === n ? t.loadErrorHandler(!0) : t.loadErrorHandler(!1));
                }
            };
        }
          , G = {
            POST_MESSAGE_ENABLED: !!a.postMessage,
            DAYS_BETWEEN_SYNC_ID_CALLS: 1,
            MILLIS_PER_DAY: 864e5,
            ADOBE_MC: 'adobe_mc',
            ADOBE_MC_SDID: 'adobe_mc_sdid',
            VALID_VISITOR_ID_REGEX: /^[0-9a-fA-F\-]+$/,
            ADOBE_MC_TTL_IN_MIN: 5,
            VERSION_REGEX: /vVersion\|((\d+\.)?(\d+\.)?(\*|\d+))(?=$|\|)/
        }
          , q = function(e, t) {
            var i = a.document;
            return {
                THROTTLE_START: 3e4,
                MAX_SYNCS_LENGTH: 649,
                throttleTimerSet: !1,
                id: null,
                onPagePixels: [],
                iframeHost: null,
                getIframeHost: function(e) {
                    if ('string' == typeof e) {
                        var t = e.split('/');
                        return t[0] + '//' + t[2];
                    }
                },
                subdomain: null,
                url: null,
                getUrl: function() {
                    var t, n = 'http://fast.', r = '?d_nsid=' + e.idSyncContainerID + '#' + encodeURIComponent(i.location.origin);
                    return (this.subdomain || (this.subdomain = 'nosubdomainreturned'),
                    e.loadSSL && (n = e.idSyncSSLUseAkamai ? 'https://fast.' : 'https://'),
                    (t = n + this.subdomain + '.demdex.net/dest5.html' + r),
                    (this.iframeHost = this.getIframeHost(t)),
                    (this.id = 'destination_publishing_iframe_' + this.subdomain + '_' + e.idSyncContainerID),
                    t);
                },
                checkDPIframeSrc: function() {
                    var t = '?d_nsid=' + e.idSyncContainerID + '#' + encodeURIComponent(i.location.href);
                    'string' == typeof e.dpIframeSrc && e.dpIframeSrc.length && ((this.id = 'destination_publishing_iframe_' + (e._subdomain || this.subdomain || new Date().getTime()) + '_' + e.idSyncContainerID),
                    (this.iframeHost = this.getIframeHost(e.dpIframeSrc)),
                    (this.url = e.dpIframeSrc + t));
                },
                idCallNotProcesssed: null,
                doAttachIframe: !1,
                startedAttachingIframe: !1,
                iframeHasLoaded: null,
                iframeIdChanged: null,
                newIframeCreated: null,
                originalIframeHasLoadedAlready: null,
                iframeLoadedCallbacks: [],
                regionChanged: !1,
                timesRegionChanged: 0,
                sendingMessages: !1,
                messages: [],
                messagesPosted: [],
                messagesReceived: [],
                messageSendingInterval: G.POST_MESSAGE_ENABLED ? null : 100,
                jsonForComparison: [],
                jsonDuplicates: [],
                jsonWaiting: [],
                jsonProcessed: [],
                canSetThirdPartyCookies: !0,
                receivedThirdPartyCookiesNotification: !1,
                readyToAttachIframePreliminary: function() {
                    return !(e.idSyncDisableSyncs || e.disableIdSyncs || e.idSyncDisable3rdPartySyncing || e.disableThirdPartyCookies || e.disableThirdPartyCalls);
                },
                readyToAttachIframe: function() {
                    return (this.readyToAttachIframePreliminary() && (this.doAttachIframe || e._doAttachIframe) && ((this.subdomain && 'nosubdomainreturned' !== this.subdomain) || e._subdomain) && this.url && !this.startedAttachingIframe);
                },
                attachIframe: function() {
                    function e() {
                        (r = i.createElement('iframe')),
                        (r.sandbox = 'allow-scripts allow-same-origin'),
                        (r.title = 'Adobe ID Syncing iFrame'),
                        (r.id = n.id),
                        (r.name = n.id + '_name'),
                        (r.style.cssText = 'display: none; width: 0; height: 0;'),
                        (r.src = n.url),
                        (n.newIframeCreated = !0),
                        t(),
                        i.body.appendChild(r);
                    }
                    function t(e) {
                        r.addEventListener('load', function() {
                            (r.className = 'aamIframeLoaded'),
                            (n.iframeHasLoaded = !0),
                            n.fireIframeLoadedCallbacks(e),
                            n.requestToProcess();
                        });
                    }
                    this.startedAttachingIframe = !0;
                    var n = this
                      , r = i.getElementById(this.id);
                    r ? 'IFRAME' !== r.nodeName ? ((this.id += '_2'),
                    (this.iframeIdChanged = !0),
                    e()) : ((this.newIframeCreated = !1),
                    'aamIframeLoaded' !== r.className ? ((this.originalIframeHasLoadedAlready = !1),
                    t("The destination publishing iframe already exists from a different library, but hadn't loaded yet.")) : ((this.originalIframeHasLoadedAlready = !0),
                    (this.iframeHasLoaded = !0),
                    (this.iframe = r),
                    this.fireIframeLoadedCallbacks('The destination publishing iframe already exists from a different library, and had loaded alresady.'),
                    this.requestToProcess())) : e(),
                    (this.iframe = r);
                },
                fireIframeLoadedCallbacks: function(e) {
                    this.iframeLoadedCallbacks.forEach(function(t) {
                        'function' == typeof t && t({
                            message: e || 'The destination publishing iframe was attached and loaded successfully.'
                        });
                    }),
                    (this.iframeLoadedCallbacks = []);
                },
                requestToProcess: function(t) {
                    function i() {
                        r.jsonForComparison.push(t),
                        r.jsonWaiting.push(t),
                        r.processSyncOnPage(t);
                    }
                    var n, r = this;
                    if (t === Object(t) && t.ibs)
                        if (((n = JSON.stringify(t.ibs || [])),
                        this.jsonForComparison.length)) {
                            var a, s, o, l = !1;
                            for (a = 0,
                            s = this.jsonForComparison.length; a < s; a++)
                                if (((o = this.jsonForComparison[a]),
                                n === JSON.stringify(o.ibs || []))) {
                                    l = !0;
                                    break;
                                }
                            l ? this.jsonDuplicates.push(t) : i();
                        } else
                            i();
                    if ((this.receivedThirdPartyCookiesNotification || !G.POST_MESSAGE_ENABLED || this.iframeHasLoaded) && this.jsonWaiting.length) {
                        var d = this.jsonWaiting.shift();
                        this.process(d),
                        this.requestToProcess();
                    }
                    e.idSyncDisableSyncs || e.disableIdSyncs || !this.iframeHasLoaded || !this.messages.length || this.sendingMessages || (this.throttleTimerSet || ((this.throttleTimerSet = !0),
                    setTimeout(function() {
                        r.messageSendingInterval = G.POST_MESSAGE_ENABLED ? null : 150;
                    }, this.THROTTLE_START)),
                    (this.sendingMessages = !0),
                    this.sendMessages());
                },
                getRegionAndCheckIfChanged: function(t, i) {
                    var n = e._getField('MCAAMLH')
                      , r = t.d_region || t.dcs_region;
                    return (n ? r && (e._setFieldExpire('MCAAMLH', i),
                    e._setField('MCAAMLH', r),
                    parseInt(n, 10) !== r && ((this.regionChanged = !0),
                    this.timesRegionChanged++,
                    e._setField('MCSYNCSOP', ''),
                    e._setField('MCSYNCS', ''),
                    (n = r))) : (n = r) && (e._setFieldExpire('MCAAMLH', i),
                    e._setField('MCAAMLH', n)),
                    n || (n = ''),
                    n);
                },
                processSyncOnPage: function(e) {
                    var t, i, n, r;
                    if ((t = e.ibs) && t instanceof Array && (i = t.length))
                        for (n = 0; n < i; n++)
                            (r = t[n]),
                            r.syncOnPage && this.checkFirstPartyCookie(r, '', 'syncOnPage');
                },
                process: function(e) {
                    var t, i, n, r, a, s = encodeURIComponent, o = !1;
                    if ((t = e.ibs) && t instanceof Array && (i = t.length))
                        for (o = !0,
                        n = 0; n < i; n++)
                            (r = t[n]),
                            (a = [s('ibs'), s(r.id || ''), s(r.tag || ''), v.encodeAndBuildRequest(r.url || [], ','), s(r.ttl || ''), '', '', r.fireURLSync ? 'true' : 'false']),
                            r.syncOnPage || (this.canSetThirdPartyCookies ? this.addMessage(a.join('|')) : r.fireURLSync && this.checkFirstPartyCookie(r, a.join('|')));
                    o && this.jsonProcessed.push(e);
                },
                checkFirstPartyCookie: function(t, i, n) {
                    var r = 'syncOnPage' === n
                      , a = r ? 'MCSYNCSOP' : 'MCSYNCS';
                    e._readVisitor();
                    var s, o, l = e._getField(a), d = !1, c = !1, u = Math.ceil(new Date().getTime() / G.MILLIS_PER_DAY);
                    l ? ((s = l.split('*')),
                    (o = this.pruneSyncData(s, t.id, u)),
                    (d = o.dataPresent),
                    (c = o.dataValid),
                    (d && c) || this.fireSync(r, t, i, s, a, u)) : ((s = []),
                    this.fireSync(r, t, i, s, a, u));
                },
                pruneSyncData: function(e, t, i) {
                    var n, r, a, s = !1, o = !1;
                    for (r = 0; r < e.length; r++)
                        (n = e[r]),
                        (a = parseInt(n.split('-')[1], 10)),
                        n.match('^' + t + '-') ? ((s = !0),
                        i < a ? (o = !0) : (e.splice(r, 1),
                        r--)) : i >= a && (e.splice(r, 1),
                        r--);
                    return {
                        dataPresent: s,
                        dataValid: o
                    };
                },
                manageSyncsSize: function(e) {
                    if (e.join('*').length > this.MAX_SYNCS_LENGTH)
                        for (e.sort(function(e, t) {
                            return (parseInt(e.split('-')[1], 10) - parseInt(t.split('-')[1], 10));
                        }); e.join('*').length > this.MAX_SYNCS_LENGTH;
                        )
                            e.shift();
                },
                fireSync: function(t, i, n, r, a, s) {
                    var o = this;
                    if (t) {
                        if ('img' === i.tag) {
                            var l, d, c, u, f = i.url, g = e.loadSSL ? 'https:' : 'http:';
                            for (l = 0,
                            d = f.length; l < d; l++) {
                                (c = f[l]),
                                (u = /^\/\//.test(c));
                                var m = new Image();
                                m.addEventListener('load', (function(t, i, n, r) {
                                    return function() {
                                        (o.onPagePixels[t] = null),
                                        e._readVisitor();
                                        var s, l = e._getField(a), d = [];
                                        if (l) {
                                            s = l.split('*');
                                            var c, u, f;
                                            for (c = 0,
                                            u = s.length; c < u; c++)
                                                (f = s[c]),
                                                f.match('^' + i.id + '-') || d.push(f);
                                        }
                                        o.setSyncTrackingData(d, i, n, r);
                                    }
                                    ;
                                }
                                )(this.onPagePixels.length, i, a, s)),
                                (m.src = (u ? g : '') + c),
                                this.onPagePixels.push(m);
                            }
                        }
                    } else
                        this.addMessage(n),
                        this.setSyncTrackingData(r, i, a, s);
                },
                addMessage: function(t) {
                    var i = encodeURIComponent
                      , n = i(e._enableErrorReporting ? '---destpub-debug---' : '---destpub---');
                    this.messages.push((G.POST_MESSAGE_ENABLED ? '' : n) + t);
                },
                setSyncTrackingData: function(t, i, n, r) {
                    t.push(i.id + '-' + (r + Math.ceil(i.ttl / 60 / 24))),
                    this.manageSyncsSize(t),
                    e._setField(n, t.join('*'));
                },
                sendMessages: function() {
                    var e, t = this, i = '', n = encodeURIComponent;
                    this.regionChanged && ((i = n('---destpub-clear-dextp---')),
                    (this.regionChanged = !1)),
                    this.messages.length ? G.POST_MESSAGE_ENABLED ? ((e = i + n('---destpub-combined---') + this.messages.join('%01')),
                    this.postMessage(e),
                    (this.messages = []),
                    (this.sendingMessages = !1)) : ((e = this.messages.shift()),
                    this.postMessage(i + e),
                    setTimeout(function() {
                        t.sendMessages();
                    }, this.messageSendingInterval)) : (this.sendingMessages = !1);
                },
                postMessage: function(e) {
                    U.postMessage(e, this.url, this.iframe.contentWindow),
                    this.messagesPosted.push(e);
                },
                receiveMessage: function(e) {
                    var t, i = /^---destpub-to-parent---/;
                    'string' == typeof e && i.test(e) && ((t = e.replace(i, '').split('|')),
                    'canSetThirdPartyCookies' === t[0] && ((this.canSetThirdPartyCookies = 'true' === t[1]),
                    (this.receivedThirdPartyCookiesNotification = !0),
                    this.requestToProcess()),
                    this.messagesReceived.push(e));
                },
                processIDCallData: function(n) {
                    (null == this.url || (n.subdomain && 'nosubdomainreturned' === this.subdomain)) && ('string' == typeof e._subdomain && e._subdomain.length ? (this.subdomain = e._subdomain) : (this.subdomain = n.subdomain || ''),
                    (this.url = this.getUrl())),
                    n.ibs instanceof Array && n.ibs.length && (this.doAttachIframe = !0),
                    this.readyToAttachIframe() && (e.idSyncAttachIframeOnWindowLoad ? (t.windowLoaded || 'complete' === i.readyState || 'loaded' === i.readyState) && this.attachIframe() : this.attachIframeASAP()),
                    'function' == typeof e.idSyncIDCallResult ? e.idSyncIDCallResult(n) : this.requestToProcess(n),
                    'function' == typeof e.idSyncAfterIDCallResult && e.idSyncAfterIDCallResult(n);
                },
                canMakeSyncIDCall: function(t, i) {
                    return (e._forceSyncIDCall || !t || i - t > G.DAYS_BETWEEN_SYNC_ID_CALLS);
                },
                attachIframeASAP: function() {
                    function e() {
                        t.startedAttachingIframe || (i.body ? t.attachIframe() : setTimeout(e, 30));
                    }
                    var t = this;
                    e();
                }
            };
        }
          , Y = {
            audienceManagerServer: {},
            audienceManagerServerSecure: {},
            cookieDomain: {},
            cookieLifetime: {},
            cookieName: {},
            disableThirdPartyCalls: {},
            idSyncAfterIDCallResult: {},
            idSyncAttachIframeOnWindowLoad: {},
            idSyncContainerID: {},
            idSyncDisable3rdPartySyncing: {},
            disableThirdPartyCookies: {},
            idSyncDisableSyncs: {},
            disableIdSyncs: {},
            idSyncIDCallResult: {},
            idSyncSSLUseAkamai: {},
            isCoopSafe: {},
            loadSSL: {},
            loadTimeout: {},
            marketingCloudServer: {},
            marketingCloudServerSecure: {},
            overwriteCrossDomainMCIDAndAID: {},
            resetBeforeVersion: {},
            sdidParamExpiry: {},
            serverState: {},
            sessionCookieName: {},
            secureCookie: {},
            takeTimeoutMetrics: {},
            trackingServer: {},
            trackingServerSecure: {},
            whitelistIframeDomains: {},
            whitelistParentDomain: {}
        }
          , X = {
            getConfigNames: function() {
                return Object.keys(Y);
            },
            getConfigs: function() {
                return Y;
            }
        }
          , W = function(e, t, i) {
            function n(e) {
                var t = e;
                return function(e) {
                    var i = e || c.location.href;
                    try {
                        var n = d._extractParamFromUri(i, t);
                        if (n)
                            return y.parsePipeDelimetedKeyValues(n);
                    } catch (e) {}
                }
                ;
            }
            function r(e) {
                function t(e, t) {
                    e && e.match(G.VALID_VISITOR_ID_REGEX) && t(e);
                }
                t(e[m], d.setMarketingCloudVisitorID),
                d._setFieldExpire(I, -1),
                t(e[C], d.setAnalyticsVisitorID);
            }
            function s(e) {
                (e = e || {}),
                (d._supplementalDataIDCurrent = e.supplementalDataIDCurrent || ''),
                (d._supplementalDataIDCurrentConsumed = e.supplementalDataIDCurrentConsumed || {}),
                (d._supplementalDataIDLast = e.supplementalDataIDLast || ''),
                (d._supplementalDataIDLastConsumed = e.supplementalDataIDLastConsumed || {});
            }
            function o(e) {
                function t(e, t, i) {
                    return ((i = i ? (i += '|') : i),
                    (i += e + '=' + encodeURIComponent(t)));
                }
                function i(e, i) {
                    var n = i[0]
                      , r = i[1];
                    return null != r && r !== D && (e = t(n, r, e)),
                    e;
                }
                var n = e.reduce(i, '');
                return (function(e) {
                    var t = y.getTimestampInSeconds();
                    return (e = e ? (e += '|') : e),
                    (e += 'TS=' + t);
                }
                )(n);
            }
            function l(e) {
                var t = e.minutesToLive
                  , i = '';
                return ((d.idSyncDisableSyncs || d.disableIdSyncs) && (i = i || 'Error: id syncs have been disabled'),
                ('string' == typeof e.dpid && e.dpid.length) || (i = i || 'Error: config.dpid is empty'),
                ('string' == typeof e.url && e.url.length) || (i = i || 'Error: config.url is empty'),
                void 0 === t ? (t = 20160) : ((t = parseInt(t, 10)),
                (isNaN(t) || t <= 0) && (i = i || 'Error: config.minutesToLive needs to be a positive number')),
                {
                    error: i,
                    ttl: t
                });
            }
            if (!i || i.split('').reverse().join('') !== e)
                throw new Error('Please use `Visitor.getInstance` to instantiate Visitor.');
            var d = this;
            d.version = '3.4.0';
            var c = a
              , u = c.Visitor;
            (u.version = d.version),
            (u.AuthState = h.AUTH_STATE),
            (u.OptOut = h.OPT_OUT),
            c.s_c_in || ((c.s_c_il = []),
            (c.s_c_in = 0)),
            (d._c = 'Visitor'),
            (d._il = c.s_c_il),
            (d._in = c.s_c_in),
            (d._il[d._in] = d),
            c.s_c_in++,
            (d._instanceType = 'regular'),
            (d._log = {
                requests: []
            }),
            (d.marketingCloudOrgID = e),
            (d.cookieName = 'AMCV_' + e),
            (d.sessionCookieName = 'AMCVS_' + e),
            (d.cookieDomain = N()),
            d.cookieDomain === c.location.hostname && (d.cookieDomain = ''),
            (d.loadSSL = c.location.protocol.toLowerCase().indexOf('https') >= 0),
            (d.loadTimeout = 3e4),
            (d.CORSErrors = []),
            (d.marketingCloudServer = d.audienceManagerServer = 'dpm.demdex.net'),
            (d.sdidParamExpiry = 30);
            var f = c.document
              , g = null
              , m = 'MCMID'
              , _ = 'MCIDTS'
              , p = 'A'
              , C = 'MCAID'
              , S = 'AAM'
              , I = 'MCAAMB'
              , D = 'NONE'
              , A = function(e) {
                return !Object.prototype[e];
            }
              , M = B(d);
            (d.FIELDS = h.FIELDS),
            (d.cookieRead = function(e) {
                e = encodeURIComponent(e);
                var t = (';' + f.cookie).split(' ').join(';')
                  , i = t.indexOf(';' + e + '=')
                  , n = i < 0 ? i : t.indexOf(';', i + 1);
                return i < 0 ? '' : decodeURIComponent(t.substring(i + 2 + e.length, n < 0 ? t.length : n));
            }
            ),
            (d.cookieWrite = function(e, t, i) {
                var n, r = d.cookieLifetime, a = '';
                if (((t = '' + t),
                (r = r ? ('' + r).toUpperCase() : ''),
                i && 'SESSION' !== r && 'NONE' !== r)) {
                    if ((n = '' !== t ? parseInt(r || 0, 10) : -60))
                        (i = new Date()),
                        i.setTime(i.getTime() + 1e3 * n);
                    else if (1 === i) {
                        i = new Date();
                        var s = i.getYear();
                        i.setYear(s + 2 + (s < 1900 ? 1900 : 0));
                    }
                } else
                    i = 0;
                return e && 'NONE' !== r ? (d.configs && d.configs.secureCookie && 'https:' === location.protocol && (a = 'Secure'),
                (f.cookie = encodeURIComponent(e) + '=' + encodeURIComponent(t) + '; path=/;' + (i ? ' expires=' + i.toGMTString() + ';' : '') + (d.cookieDomain ? ' domain=' + d.cookieDomain + ';' : '') + a),
                d.cookieRead(e) === t) : 0;
            }
            ),
            (d.resetState = function(e) {
                e ? d._mergeServerState(e) : s();
            }
            ),
            (d._isAllowedDone = !1),
            (d._isAllowedFlag = !1),
            (d.isAllowed = function() {
                return (d._isAllowedDone || ((d._isAllowedDone = !0),
                (d.cookieRead(d.cookieName) || d.cookieWrite(d.cookieName, 'T', 1)) && (d._isAllowedFlag = !0)),
                d._isAllowedFlag);
            }
            ),
            (d.setMarketingCloudVisitorID = function(e) {
                d._setMarketingCloudFields(e);
            }
            ),
            (d._use1stPartyMarketingCloudServer = !1),
            (d.getMarketingCloudVisitorID = function(e, t) {
                if (d.isAllowed()) {
                    d.marketingCloudServer && d.marketingCloudServer.indexOf('.demdex.net') < 0 && (d._use1stPartyMarketingCloudServer = !0);
                    var i = d._getAudienceManagerURLData('_setMarketingCloudFields')
                      , n = i.url;
                    return d._getRemoteField(m, n, e, t, i);
                }
                return '';
            }
            ),
            (d.getVisitorValues = function(e, t) {
                var i = {
                    MCMID: {
                        fn: d.getMarketingCloudVisitorID,
                        args: [!0],
                        context: d
                    },
                    MCOPTOUT: {
                        fn: d.isOptedOut,
                        args: [void 0, !0],
                        context: d
                    },
                    MCAID: {
                        fn: d.getAnalyticsVisitorID,
                        args: [!0],
                        context: d
                    },
                    MCAAMLH: {
                        fn: d.getAudienceManagerLocationHint,
                        args: [!0],
                        context: d
                    },
                    MCAAMB: {
                        fn: d.getAudienceManagerBlob,
                        args: [!0],
                        context: d
                    }
                }
                  , n = t && t.length ? y.pluck(i, t) : i;
                w(n, e);
            }
            ),
            (d._currentCustomerIDs = {}),
            (d._customerIDsHashChanged = !1),
            (d._newCustomerIDsHash = ''),
            (d.setCustomerIDs = function(e) {
                function t() {
                    d._customerIDsHashChanged = !1;
                }
                if (d.isAllowed() && e) {
                    if (!v.isObject(e) || v.isObjectEmpty(e))
                        return !1;
                    d._readVisitor();
                    var i, n;
                    for (i in e)
                        if (A(i) && (n = e[i]))
                            if ('object' == typeof n) {
                                var r = {};
                                n.id && (r.id = n.id),
                                void 0 != n.authState && (r.authState = n.authState),
                                (d._currentCustomerIDs[i] = r);
                            } else
                                d._currentCustomerIDs[i] = {
                                    id: n
                                };
                    var a = d.getCustomerIDs()
                      , s = d._getField('MCCIDH')
                      , o = '';
                    s || (s = 0);
                    for (i in a)
                        A(i) && ((n = a[i]),
                        (o += (o ? '|' : '') + i + '|' + (n.id ? n.id : '') + (n.authState ? n.authState : '')));
                    (d._newCustomerIDsHash = String(d._hash(o))),
                    d._newCustomerIDsHash !== s && ((d._customerIDsHashChanged = !0),
                    d._mapCustomerIDs(t));
                }
            }
            ),
            (d.getCustomerIDs = function() {
                d._readVisitor();
                var e, t, i = {};
                for (e in d._currentCustomerIDs)
                    A(e) && ((t = d._currentCustomerIDs[e]),
                    i[e] || (i[e] = {}),
                    t.id && (i[e].id = t.id),
                    void 0 != t.authState ? (i[e].authState = t.authState) : (i[e].authState = u.AuthState.UNKNOWN));
                return i;
            }
            ),
            (d.setAnalyticsVisitorID = function(e) {
                d._setAnalyticsFields(e);
            }
            ),
            (d.getAnalyticsVisitorID = function(e, t, i) {
                if (!y.isTrackingServerPopulated() && !i)
                    return d._callCallback(e, ['']),
                    '';
                if (d.isAllowed()) {
                    var n = '';
                    if ((i || (n = d.getMarketingCloudVisitorID(function(t) {
                        d.getAnalyticsVisitorID(e, !0);
                    })),
                    n || i)) {
                        var r = i ? d.marketingCloudServer : d.trackingServer
                          , a = '';
                        d.loadSSL && (i ? d.marketingCloudServerSecure && (r = d.marketingCloudServerSecure) : d.trackingServerSecure && (r = d.trackingServerSecure));
                        var s = {};
                        if (r) {
                            var o = 'http' + (d.loadSSL ? 's' : '') + '://' + r + '/id'
                              , l = 'd_visid_ver=' + d.version + '&mcorgid=' + encodeURIComponent(d.marketingCloudOrgID) + (n ? '&mid=' + encodeURIComponent(n) : '') + (d.idSyncDisable3rdPartySyncing || d.disableThirdPartyCookies ? '&d_coppa=true' : '')
                              , c = ['s_c_il', d._in, '_set' + (i ? 'MarketingCloud' : 'Analytics') + 'Fields'];
                            (a = o + '?' + l + '&callback=s_c_il%5B' + d._in + '%5D._set' + (i ? 'MarketingCloud' : 'Analytics') + 'Fields'),
                            (s.corsUrl = o + '?' + l),
                            (s.callback = c);
                        }
                        return (s.url = a),
                        d._getRemoteField(i ? m : C, a, e, t, s);
                    }
                }
                return '';
            }
            ),
            (d.getAudienceManagerLocationHint = function(e, t) {
                if (d.isAllowed()) {
                    if (d.getMarketingCloudVisitorID(function(t) {
                        d.getAudienceManagerLocationHint(e, !0);
                    })) {
                        var i = d._getField(C);
                        if ((!i && y.isTrackingServerPopulated() && (i = d.getAnalyticsVisitorID(function(t) {
                            d.getAudienceManagerLocationHint(e, !0);
                        })),
                        i || !y.isTrackingServerPopulated())) {
                            var n = d._getAudienceManagerURLData()
                              , r = n.url;
                            return d._getRemoteField('MCAAMLH', r, e, t, n);
                        }
                    }
                }
                return '';
            }
            ),
            (d.getLocationHint = d.getAudienceManagerLocationHint),
            (d.getAudienceManagerBlob = function(e, t) {
                if (d.isAllowed()) {
                    if (d.getMarketingCloudVisitorID(function(t) {
                        d.getAudienceManagerBlob(e, !0);
                    })) {
                        var i = d._getField(C);
                        if ((!i && y.isTrackingServerPopulated() && (i = d.getAnalyticsVisitorID(function(t) {
                            d.getAudienceManagerBlob(e, !0);
                        })),
                        i || !y.isTrackingServerPopulated())) {
                            var n = d._getAudienceManagerURLData()
                              , r = n.url;
                            return (d._customerIDsHashChanged && d._setFieldExpire(I, -1),
                            d._getRemoteField(I, r, e, t, n));
                        }
                    }
                }
                return '';
            }
            ),
            (d._supplementalDataIDCurrent = ''),
            (d._supplementalDataIDCurrentConsumed = {}),
            (d._supplementalDataIDLast = ''),
            (d._supplementalDataIDLastConsumed = {}),
            (d.getSupplementalDataID = function(e, t) {
                d._supplementalDataIDCurrent || t || (d._supplementalDataIDCurrent = d._generateID(1));
                var i = d._supplementalDataIDCurrent;
                return (d._supplementalDataIDLast && !d._supplementalDataIDLastConsumed[e] ? ((i = d._supplementalDataIDLast),
                (d._supplementalDataIDLastConsumed[e] = !0)) : i && (d._supplementalDataIDCurrentConsumed[e] && ((d._supplementalDataIDLast = d._supplementalDataIDCurrent),
                (d._supplementalDataIDLastConsumed = d._supplementalDataIDCurrentConsumed),
                (d._supplementalDataIDCurrent = i = t ? '' : d._generateID(1)),
                (d._supplementalDataIDCurrentConsumed = {})),
                i && (d._supplementalDataIDCurrentConsumed[e] = !0)),
                i);
            }
            ),
            (d.getOptOut = function(e, t) {
                if (d.isAllowed()) {
                    var i = d._getAudienceManagerURLData('_setMarketingCloudFields')
                      , n = i.url;
                    return d._getRemoteField('MCOPTOUT', n, e, t, i);
                }
                return '';
            }
            ),
            (d.isOptedOut = function(e, t, i) {
                if (d.isAllowed()) {
                    t || (t = u.OptOut.GLOBAL);
                    var n = d.getOptOut(function(i) {
                        var n = i === u.OptOut.GLOBAL || i.indexOf(t) >= 0;
                        d._callCallback(e, [n]);
                    }, i);
                    return n ? n === u.OptOut.GLOBAL || n.indexOf(t) >= 0 : null;
                }
                return !1;
            }
            ),
            (d._fields = null),
            (d._fieldsExpired = null),
            (d._hash = function(e) {
                var t, i, n = 0;
                if (e)
                    for (t = 0; t < e.length; t++)
                        (i = e.charCodeAt(t)),
                        (n = (n << 5) - n + i),
                        (n &= n);
                return n;
            }
            ),
            (d._generateID = H),
            (d._generateLocalMID = function() {
                var e = d._generateID(0);
                return (T.isClientSideMarketingCloudVisitorID = !0),
                e;
            }
            ),
            (d._callbackList = null),
            (d._callCallback = function(e, t) {
                try {
                    'function' == typeof e ? e.apply(c, t) : e[1].apply(e[0], t);
                } catch (e) {}
            }
            ),
            (d._registerCallback = function(e, t) {
                t && (null == d._callbackList && (d._callbackList = {}),
                void 0 == d._callbackList[e] && (d._callbackList[e] = []),
                d._callbackList[e].push(t));
            }
            ),
            (d._callAllCallbacks = function(e, t) {
                if (null != d._callbackList) {
                    var i = d._callbackList[e];
                    if (i)
                        for (; i.length > 0; )
                            d._callCallback(i.shift(), t);
                }
            }
            ),
            (d._addQuerystringParam = function(e, t, i, n) {
                var r = encodeURIComponent(t) + '=' + encodeURIComponent(i)
                  , a = y.parseHash(e)
                  , s = y.hashlessUrl(e);
                if (-1 === s.indexOf('?'))
                    return s + '?' + r + a;
                var o = s.split('?')
                  , l = o[0] + '?'
                  , d = o[1];
                return l + y.addQueryParamAtLocation(d, r, n) + a;
            }
            ),
            (d._extractParamFromUri = function(e, t) {
                var i = new RegExp('[\\?&#]' + t + '=([^&#]*)')
                  , n = i.exec(e);
                if (n && n.length)
                    return decodeURIComponent(n[1]);
            }
            ),
            (d._parseAdobeMcFromUrl = n(G.ADOBE_MC)),
            (d._parseAdobeMcSdidFromUrl = n(G.ADOBE_MC_SDID)),
            (d._attemptToPopulateSdidFromUrl = function(t) {
                var i = d._parseAdobeMcSdidFromUrl(t)
                  , n = 1e9;
                i && i.TS && (n = y.getTimestampInSeconds() - i.TS),
                i && i.SDID && i.MCORGID === e && n < d.sdidParamExpiry && ((d._supplementalDataIDCurrent = i.SDID),
                (d._supplementalDataIDCurrentConsumed.SDID_URL_PARAM = !0));
            }
            ),
            (d._attemptToPopulateIdsFromUrl = function() {
                var t = d._parseAdobeMcFromUrl();
                if (t && t.TS) {
                    var i = y.getTimestampInSeconds()
                      , n = i - t.TS;
                    if (Math.floor(n / 60) > G.ADOBE_MC_TTL_IN_MIN || t.MCORGID !== e)
                        return;
                    r(t);
                }
            }
            ),
            (d._mergeServerState = function(e) {
                if (e)
                    try {
                        if (((e = (function(e) {
                            return y.isObject(e) ? e : JSON.parse(e);
                        }
                        )(e)),
                        e[d.marketingCloudOrgID])) {
                            var t = e[d.marketingCloudOrgID];
                            !(function(e) {
                                y.isObject(e) && d.setCustomerIDs(e);
                            }
                            )(t.customerIDs),
                            s(t.sdid);
                        }
                    } catch (e) {
                        throw new Error('`serverState` has an invalid format.');
                    }
            }
            ),
            (d._timeout = null),
            (d._loadData = function(e, t, i, n) {
                (t = d._addQuerystringParam(t, 'd_fieldgroup', e, 1)),
                (n.url = d._addQuerystringParam(n.url, 'd_fieldgroup', e, 1)),
                (n.corsUrl = d._addQuerystringParam(n.corsUrl, 'd_fieldgroup', e, 1)),
                (T.fieldGroupObj[e] = !0),
                n === Object(n) && n.corsUrl && 'XMLHttpRequest' === M.corsMetadata.corsType && M.fireCORS(n, i, e);
            }
            ),
            (d._clearTimeout = function(e) {
                null != d._timeout && d._timeout[e] && (clearTimeout(d._timeout[e]),
                (d._timeout[e] = 0));
            }
            ),
            (d._settingsDigest = 0),
            (d._getSettingsDigest = function() {
                if (!d._settingsDigest) {
                    var e = d.version;
                    d.audienceManagerServer && (e += '|' + d.audienceManagerServer),
                    d.audienceManagerServerSecure && (e += '|' + d.audienceManagerServerSecure),
                    (d._settingsDigest = d._hash(e));
                }
                return d._settingsDigest;
            }
            ),
            (d._readVisitorDone = !1),
            (d._readVisitor = function() {
                if (!d._readVisitorDone) {
                    d._readVisitorDone = !0;
                    var e, t, i, n, r, a, s = d._getSettingsDigest(), o = !1, l = d.cookieRead(d.cookieName), c = new Date();
                    if ((null == d._fields && (d._fields = {}),
                    l && 'T' !== l))
                        for (l = l.split('|'),
                        l[0].match(/^[\-0-9]+$/) && (parseInt(l[0], 10) !== s && (o = !0),
                        l.shift()),
                        l.length % 2 == 1 && l.pop(),
                        e = 0; e < l.length; e += 2)
                            (t = l[e].split('-')),
                            (i = t[0]),
                            (n = l[e + 1]),
                            t.length > 1 ? ((r = parseInt(t[1], 10)),
                            (a = t[1].indexOf('s') > 0)) : ((r = 0),
                            (a = !1)),
                            o && ('MCCIDH' === i && (n = ''),
                            r > 0 && (r = c.getTime() / 1e3 - 60)),
                            i && n && (d._setField(i, n, 1),
                            r > 0 && ((d._fields['expire' + i] = r + (a ? 's' : '')),
                            (c.getTime() >= 1e3 * r || (a && !d.cookieRead(d.sessionCookieName))) && (d._fieldsExpired || (d._fieldsExpired = {}),
                            (d._fieldsExpired[i] = !0))));
                    !d._getField(C) && y.isTrackingServerPopulated() && (l = d.cookieRead('s_vi')) && ((l = l.split('|')),
                    l.length > 1 && l[0].indexOf('v1') >= 0 && ((n = l[1]),
                    (e = n.indexOf('[')),
                    e >= 0 && (n = n.substring(0, e)),
                    n && n.match(G.VALID_VISITOR_ID_REGEX) && d._setField(C, n)));
                }
            }
            ),
            (d._appendVersionTo = function(e) {
                var t = 'vVersion|' + d.version
                  , i = e ? d._getCookieVersion(e) : null;
                return (i ? x.areVersionsDifferent(i, d.version) && (e = e.replace(G.VERSION_REGEX, t)) : (e += (e ? '|' : '') + t),
                e);
            }
            ),
            (d._writeVisitor = function() {
                var e, t, i = d._getSettingsDigest();
                for (e in d._fields)
                    A(e) && d._fields[e] && 'expire' !== e.substring(0, 6) && ((t = d._fields[e]),
                    (i += (i ? '|' : '') + e + (d._fields['expire' + e] ? '-' + d._fields['expire' + e] : '') + '|' + t));
                (i = d._appendVersionTo(i)),
                d.cookieWrite(d.cookieName, i, 1);
            }
            ),
            (d._getField = function(e, t) {
                return null == d._fields || (!t && d._fieldsExpired && d._fieldsExpired[e]) ? null : d._fields[e];
            }
            ),
            (d._setField = function(e, t, i) {
                null == d._fields && (d._fields = {}),
                (d._fields[e] = t),
                i || d._writeVisitor();
            }
            ),
            (d._getFieldList = function(e, t) {
                var i = d._getField(e, t);
                return i ? i.split('*') : null;
            }
            ),
            (d._setFieldList = function(e, t, i) {
                d._setField(e, t ? t.join('*') : '', i);
            }
            ),
            (d._getFieldMap = function(e, t) {
                var i = d._getFieldList(e, t);
                if (i) {
                    var n, r = {};
                    for (n = 0; n < i.length; n += 2)
                        r[i[n]] = i[n + 1];
                    return r;
                }
                return null;
            }
            ),
            (d._setFieldMap = function(e, t, i) {
                var n, r = null;
                if (t) {
                    r = [];
                    for (n in t)
                        A(n) && (r.push(n),
                        r.push(t[n]));
                }
                d._setFieldList(e, r, i);
            }
            ),
            (d._setFieldExpire = function(e, t, i) {
                var n = new Date();
                n.setTime(n.getTime() + 1e3 * t),
                null == d._fields && (d._fields = {}),
                (d._fields['expire' + e] = Math.floor(n.getTime() / 1e3) + (i ? 's' : '')),
                t < 0 ? (d._fieldsExpired || (d._fieldsExpired = {}),
                (d._fieldsExpired[e] = !0)) : d._fieldsExpired && (d._fieldsExpired[e] = !1),
                i && (d.cookieRead(d.sessionCookieName) || d.cookieWrite(d.sessionCookieName, '1'));
            }
            ),
            (d._findVisitorID = function(e) {
                return (e && ('object' == typeof e && (e = e.d_mid ? e.d_mid : e.visitorID ? e.visitorID : e.id ? e.id : e.uuid ? e.uuid : '' + e),
                e && 'NOTARGET' === (e = e.toUpperCase()) && (e = D),
                (e && (e === D || e.match(G.VALID_VISITOR_ID_REGEX))) || (e = '')),
                e);
            }
            ),
            (d._setFields = function(e, t) {
                if ((d._clearTimeout(e),
                null != d._loading && (d._loading[e] = !1),
                T.fieldGroupObj[e] && T.setState(e, !1),
                'MC' === e)) {
                    !0 !== T.isClientSideMarketingCloudVisitorID && (T.isClientSideMarketingCloudVisitorID = !1);
                    var i = d._getField(m);
                    if (!i || d.overwriteCrossDomainMCIDAndAID) {
                        if (!(i = 'object' == typeof t && t.mid ? t.mid : d._findVisitorID(t))) {
                            if (d._use1stPartyMarketingCloudServer && !d.tried1stPartyMarketingCloudServer)
                                return ((d.tried1stPartyMarketingCloudServer = !0),
                                void d.getAnalyticsVisitorID(null, !1, !0));
                            i = d._generateLocalMID();
                        }
                        d._setField(m, i);
                    }
                    (i && i !== D) || (i = ''),
                    'object' == typeof t && ((t.d_region || t.dcs_region || t.d_blob || t.blob) && d._setFields(S, t),
                    d._use1stPartyMarketingCloudServer && t.mid && d._setFields(p, {
                        id: t.id
                    })),
                    d._callAllCallbacks(m, [i]);
                }
                if (e === S && 'object' == typeof t) {
                    var n = 604800;
                    void 0 != t.id_sync_ttl && t.id_sync_ttl && (n = parseInt(t.id_sync_ttl, 10));
                    var r = b.getRegionAndCheckIfChanged(t, n);
                    d._callAllCallbacks('MCAAMLH', [r]);
                    var a = d._getField(I);
                    (t.d_blob || t.blob) && ((a = t.d_blob),
                    a || (a = t.blob),
                    d._setFieldExpire(I, n),
                    d._setField(I, a)),
                    a || (a = ''),
                    d._callAllCallbacks(I, [a]),
                    !t.error_msg && d._newCustomerIDsHash && d._setField('MCCIDH', d._newCustomerIDsHash);
                }
                if (e === p) {
                    var s = d._getField(C);
                    (s && !d.overwriteCrossDomainMCIDAndAID) || ((s = d._findVisitorID(t)),
                    s ? s !== D && d._setFieldExpire(I, -1) : (s = D),
                    d._setField(C, s)),
                    (s && s !== D) || (s = ''),
                    d._callAllCallbacks(C, [s]);
                }
                if (d.idSyncDisableSyncs || d.disableIdSyncs)
                    b.idCallNotProcesssed = !0;
                else {
                    b.idCallNotProcesssed = !1;
                    var o = {};
                    (o.ibs = t.ibs),
                    (o.subdomain = t.subdomain),
                    b.processIDCallData(o);
                }
                if (t === Object(t)) {
                    var l, c;
                    d.isAllowed() && (l = d._getField('MCOPTOUT')),
                    l || ((l = D),
                    t.d_optout && t.d_optout instanceof Array && (l = t.d_optout.join(',')),
                    (c = parseInt(t.d_ottl, 10)),
                    isNaN(c) && (c = 7200),
                    d._setFieldExpire('MCOPTOUT', c, !0),
                    d._setField('MCOPTOUT', l)),
                    d._callAllCallbacks('MCOPTOUT', [l]);
                }
            }
            ),
            (d._loading = null),
            (d._getRemoteField = function(e, t, i, n, r) {
                var a, s = '', o = y.isFirstPartyAnalyticsVisitorIDCall(e), l = {
                    MCAAMLH: !0,
                    MCAAMB: !0
                };
                if (d.isAllowed()) {
                    d._readVisitor(),
                    (s = d._getField(e, !0 === l[e]));
                    if ((function() {
                        return ((!s || (d._fieldsExpired && d._fieldsExpired[e])) && (!d.disableThirdPartyCalls || o));
                    }
                    )()) {
                        if ((e === m || 'MCOPTOUT' === e ? (a = 'MC') : 'MCAAMLH' === e || e === I ? (a = S) : e === C && (a = p),
                        a))
                            return (!t || (null != d._loading && d._loading[a]) || (null == d._loading && (d._loading = {}),
                            (d._loading[a] = !0),
                            d._loadData(a, t, function(t) {
                                if (!d._getField(e)) {
                                    t && T.setState(a, !0);
                                    var i = '';
                                    e === m ? (i = d._generateLocalMID()) : a === S && (i = {
                                        error_msg: 'timeout'
                                    }),
                                    d._setFields(a, i);
                                }
                            }, r)),
                            d._registerCallback(e, i),
                            s || (t || d._setFields(a, {
                                id: D
                            }),
                            ''));
                    } else
                        s || (e === m ? (d._registerCallback(e, i),
                        (s = d._generateLocalMID()),
                        d.setMarketingCloudVisitorID(s)) : e === C ? (d._registerCallback(e, i),
                        (s = ''),
                        d.setAnalyticsVisitorID(s)) : ((s = ''),
                        (n = !0)));
                }
                return ((e !== m && e !== C) || s !== D || ((s = ''),
                (n = !0)),
                i && n && d._callCallback(i, [s]),
                s);
            }
            ),
            (d._setMarketingCloudFields = function(e) {
                d._readVisitor(),
                d._setFields('MC', e);
            }
            ),
            (d._mapCustomerIDs = function(e) {
                d.getAudienceManagerBlob(e, !0);
            }
            ),
            (d._setAnalyticsFields = function(e) {
                d._readVisitor(),
                d._setFields(p, e);
            }
            ),
            (d._setAudienceManagerFields = function(e) {
                d._readVisitor(),
                d._setFields(S, e);
            }
            ),
            (d._getAudienceManagerURLData = function(e) {
                var t = d.audienceManagerServer
                  , i = ''
                  , n = d._getField(m)
                  , r = d._getField(I, !0)
                  , a = d._getField(C)
                  , s = a && a !== D ? '&d_cid_ic=AVID%01' + encodeURIComponent(a) : '';
                if ((d.loadSSL && d.audienceManagerServerSecure && (t = d.audienceManagerServerSecure),
                t)) {
                    var o, l, c = d.getCustomerIDs();
                    if (c)
                        for (o in c)
                            A(o) && ((l = c[o]),
                            (s += '&d_cid_ic=' + encodeURIComponent(o) + '%01' + encodeURIComponent(l.id ? l.id : '') + (l.authState ? '%01' + l.authState : '')));
                    e || (e = '_setAudienceManagerFields');
                    var u = 'http' + (d.loadSSL ? 's' : '') + '://' + t + '/id'
                      , f = 'd_visid_ver=' + d.version + '&d_rtbd=json&d_ver=2' + (!n && d._use1stPartyMarketingCloudServer ? '&d_verify=1' : '') + '&d_orgid=' + encodeURIComponent(d.marketingCloudOrgID) + '&d_nsid=' + (d.idSyncContainerID || 0) + (n ? '&d_mid=' + encodeURIComponent(n) : '') + (d.idSyncDisable3rdPartySyncing || d.disableThirdPartyCookies ? '&d_coppa=true' : '') + (!0 === g ? '&d_coop_safe=1' : !1 === g ? '&d_coop_unsafe=1' : '') + (r ? '&d_blob=' + encodeURIComponent(r) : '') + s
                      , h = ['s_c_il', d._in, e];
                    return ((i = u + '?' + f + '&d_cb=s_c_il%5B' + d._in + '%5D.' + e),
                    {
                        url: i,
                        corsUrl: u + '?' + f,
                        callback: h
                    });
                }
                return {
                    url: i
                };
            }
            ),
            (d.appendVisitorIDsTo = function(e) {
                try {
                    var t = [[m, d._getField(m)], [C, d._getField(C)], ['MCORGID', d.marketingCloudOrgID]];
                    return d._addQuerystringParam(e, G.ADOBE_MC, o(t));
                } catch (t) {
                    return e;
                }
            }
            ),
            (d.appendSupplementalDataIDTo = function(e, t) {
                if (!(t = t || d.getSupplementalDataID(y.generateRandomString(), !0)))
                    return e;
                try {
                    var i = o([['SDID', t], ['MCORGID', d.marketingCloudOrgID]]);
                    return d._addQuerystringParam(e, G.ADOBE_MC_SDID, i);
                } catch (t) {
                    return e;
                }
            }
            );
            var y = {
                parseHash: function(e) {
                    var t = e.indexOf('#');
                    return t > 0 ? e.substr(t) : '';
                },
                hashlessUrl: function(e) {
                    var t = e.indexOf('#');
                    return t > 0 ? e.substr(0, t) : e;
                },
                addQueryParamAtLocation: function(e, t, i) {
                    var n = e.split('&');
                    return ((i = null != i ? i : n.length),
                    n.splice(i, 0, t),
                    n.join('&'));
                },
                isFirstPartyAnalyticsVisitorIDCall: function(e, t, i) {
                    if (e !== C)
                        return !1;
                    var n;
                    return (t || (t = d.trackingServer),
                    i || (i = d.trackingServerSecure),
                    !('string' != typeof (n = d.loadSSL ? i : t) || !n.length) && (n.indexOf('2o7.net') < 0 && n.indexOf('omtrdc.net') < 0));
                },
                isObject: function(e) {
                    return Boolean(e && e === Object(e));
                },
                removeCookie: function(e) {
                    document.cookie = encodeURIComponent(e) + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;' + (d.cookieDomain ? ' domain=' + d.cookieDomain + ';' : '');
                },
                isTrackingServerPopulated: function() {
                    return !!d.trackingServer || !!d.trackingServerSecure;
                },
                getTimestampInSeconds: function() {
                    return Math.round(new Date().getTime() / 1e3);
                },
                parsePipeDelimetedKeyValues: function(e) {
                    return e.split('|').reduce(function(e, t) {
                        var i = t.split('=');
                        return (e[i[0]] = decodeURIComponent(i[1])),
                        e;
                    }, {});
                },
                generateRandomString: function(e) {
                    e = e || 5;
                    for (var t = '', i = 'abcdefghijklmnopqrstuvwxyz0123456789'; e--; )
                        t += i[Math.floor(Math.random() * i.length)];
                    return t;
                },
                normalizeBoolean: function(e) {
                    return 'true' === e || ('false' !== e && e);
                },
                parseBoolean: function(e) {
                    return 'true' === e || ('false' !== e && null);
                },
                replaceMethodsWithFunction: function(e, t) {
                    for (var i in e)
                        e.hasOwnProperty(i) && 'function' == typeof e[i] && (e[i] = t);
                    return e;
                },
                pluck: function(e, t) {
                    return t.reduce(function(t, i) {
                        return e[i] && (t[i] = e[i]),
                        t;
                    }, Object.create(null));
                }
            };
            d._helpers = y;
            var b = q(d, u);
            (d._destinationPublishing = b),
            (d.timeoutMetricsLog = []);
            var T = {
                isClientSideMarketingCloudVisitorID: null,
                MCIDCallTimedOut: null,
                AnalyticsIDCallTimedOut: null,
                AAMIDCallTimedOut: null,
                fieldGroupObj: {},
                setState: function(e, t) {
                    switch (e) {
                    case 'MC':
                        !1 === t ? !0 !== this.MCIDCallTimedOut && (this.MCIDCallTimedOut = !1) : (this.MCIDCallTimedOut = t);
                        break;
                    case p:
                        !1 === t ? !0 !== this.AnalyticsIDCallTimedOut && (this.AnalyticsIDCallTimedOut = !1) : (this.AnalyticsIDCallTimedOut = t);
                        break;
                    case S:
                        !1 === t ? !0 !== this.AAMIDCallTimedOut && (this.AAMIDCallTimedOut = !1) : (this.AAMIDCallTimedOut = t);
                    }
                }
            };
            (d.isClientSideMarketingCloudVisitorID = function() {
                return T.isClientSideMarketingCloudVisitorID;
            }
            ),
            (d.MCIDCallTimedOut = function() {
                return T.MCIDCallTimedOut;
            }
            ),
            (d.AnalyticsIDCallTimedOut = function() {
                return T.AnalyticsIDCallTimedOut;
            }
            ),
            (d.AAMIDCallTimedOut = function() {
                return T.AAMIDCallTimedOut;
            }
            ),
            (d.idSyncGetOnPageSyncInfo = function() {
                return d._readVisitor(),
                d._getField('MCSYNCSOP');
            }
            ),
            (d.idSyncByURL = function(e) {
                var t = l(e || {});
                if (t.error)
                    return t.error;
                var i, n, r = e.url, a = encodeURIComponent, s = b;
                return ((r = r.replace(/^https:/, '').replace(/^http:/, '')),
                (i = v.encodeAndBuildRequest(['', e.dpid, e.dpuuid || ''], ',')),
                (n = ['ibs', a(e.dpid), 'img', a(r), t.ttl, '', i]),
                s.addMessage(n.join('|')),
                s.requestToProcess(),
                'Successfully queued');
            }
            ),
            (d.idSyncByDataSource = function(e) {
                return e === Object(e) && 'string' == typeof e.dpuuid && e.dpuuid.length ? ((e.url = '//dpm.demdex.net/ibs:dpid=' + e.dpid + '&dpuuid=' + e.dpuuid),
                d.idSyncByURL(e)) : 'Error: config or config.dpuuid is empty';
            }
            ),
            (d.publishDestinations = function(e, t, i) {
                if (((i = 'function' == typeof i ? i : function() {}
                ),
                'string' != typeof e || !e.length))
                    return void i({
                        error: 'subdomain is not a populated string.'
                    });
                if (!(t instanceof Array && t.length))
                    return void i({
                        error: 'messages is not a populated array.'
                    });
                var n = b;
                if (!n.readyToAttachIframePreliminary())
                    return void i({
                        error: 'The destination publishing iframe is disabled in the Visitor library.'
                    });
                var r = !1;
                if ((t.forEach(function(e) {
                    'string' == typeof e && e.length && (n.addMessage(e),
                    (r = !0));
                }),
                !r))
                    return void i({
                        error: 'None of the messages are populated strings.'
                    });
                n.iframe ? (i({
                    message: 'The destination publishing iframe is already attached and loaded.'
                }),
                n.requestToProcess()) : !d.subdomain && d._getField(m) ? ((n.subdomain = e),
                (n.doAttachIframe = !0),
                (n.url = n.getUrl()),
                n.readyToAttachIframe() ? (n.iframeLoadedCallbacks.push(function(e) {
                    i({
                        message: 'Attempted to attach and load the destination publishing iframe through this API call. Result: ' + (e.message || 'no result')
                    });
                }),
                n.attachIframe()) : i({
                    error: 'Encountered a problem in attempting to attach and load the destination publishing iframe through this API call.'
                })) : n.iframeLoadedCallbacks.push(function(e) {
                    i({
                        message: 'Attempted to attach and load the destination publishing iframe through normal Visitor API processing. Result: ' + (e.message || 'no result')
                    });
                });
            }
            ),
            (d._getCookieVersion = function(e) {
                e = e || d.cookieRead(d.cookieName);
                var t = G.VERSION_REGEX.exec(e);
                return t && t.length > 1 ? t[1] : null;
            }
            ),
            (d._resetAmcvCookie = function(e) {
                var t = d._getCookieVersion();
                (t && !x.isLessThan(t, e)) || y.removeCookie(d.cookieName);
            }
            ),
            (d.setAsCoopSafe = function() {
                g = !0;
            }
            ),
            (d.setAsCoopUnsafe = function() {
                g = !1;
            }
            ),
            (d.init = function() {
                !(function() {
                    var e = null;
                    if (t && 'object' == typeof t) {
                        d.configs = Object.create(null);
                        for (var i in t)
                            A(i) && ((e = y.normalizeBoolean(t[i])),
                            (d[i] = e),
                            (d.configs[i] = e));
                        (d.idSyncContainerID = d.idSyncContainerID || 0),
                        (g = 'boolean' == typeof d.isCoopSafe ? d.isCoopSafe : y.parseBoolean(d.isCoopSafe)),
                        d.resetBeforeVersion && d._resetAmcvCookie(d.resetBeforeVersion),
                        d._attemptToPopulateIdsFromUrl(),
                        d._attemptToPopulateSdidFromUrl(),
                        d._readVisitor();
                        var n = d._getField(_)
                          , r = Math.ceil(new Date().getTime() / G.MILLIS_PER_DAY);
                        d.idSyncDisableSyncs || d.disableIdSyncs || !b.canMakeSyncIDCall(n, r) || (d._setFieldExpire(I, -1),
                        d._setField(_, r)),
                        d.getMarketingCloudVisitorID(),
                        d.getAudienceManagerLocationHint(),
                        d.getAudienceManagerBlob(),
                        d._mergeServerState(d.serverState);
                    } else
                        d._attemptToPopulateIdsFromUrl(),
                        d._attemptToPopulateSdidFromUrl();
                }
                )(),
                (function() {
                    if (!d.idSyncDisableSyncs && !d.disableIdSyncs) {
                        b.checkDPIframeSrc();
                        var e = function() {
                            var e = b;
                            e.readyToAttachIframe() && e.attachIframe();
                        };
                        c.addEventListener('load', function() {
                            (u.windowLoaded = !0),
                            e();
                        });
                        try {
                            U.receiveMessage(function(e) {
                                b.receiveMessage(e.data);
                            }, b.iframeHost);
                        } catch (e) {}
                    }
                }
                )(),
                (function() {
                    d.whitelistIframeDomains && G.POST_MESSAGE_ENABLED && ((d.whitelistIframeDomains = d.whitelistIframeDomains instanceof Array ? d.whitelistIframeDomains : [d.whitelistIframeDomains]),
                    d.whitelistIframeDomains.forEach(function(t) {
                        var i = new k(e,t)
                          , n = V(d, i);
                        U.receiveMessage(n, t);
                    }));
                }
                )();
            }
            );
        };
        return ((W.getInstance = function(e, t) {
            if (!e)
                throw new Error('Visitor requires Adobe Marketing Cloud Org ID.');
            e.indexOf('@') < 0 && (e += '@AdobeOrg');
            var i = (function() {
                var t = a.s_c_il;
                if (t)
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        if (n && 'Visitor' === n._c && n.marketingCloudOrgID === e)
                            return n;
                    }
            }
            )();
            if (i)
                return i;
            var n = e
              , r = n.split('').reverse().join('')
              , s = new W(e,null,r);
            t === Object(t) && t.cookieDomain && (s.cookieDomain = t.cookieDomain),
            (function() {
                a.s_c_il.splice(--a.s_c_in, 1);
            }
            )();
            var o = v.getIeVersion();
            if ('number' == typeof o && o < 10)
                return s._helpers.replaceMethodsWithFunction(s, function() {});
            var l = (function() {
                try {
                    return a.self !== a.parent;
                } catch (e) {
                    return !0;
                }
            }
            )() && !(function(e) {
                return (e.cookieWrite('TEST_AMCV_COOKIE', 'T', 1),
                'T' === e.cookieRead('TEST_AMCV_COOKIE') && (e._helpers.removeCookie('TEST_AMCV_COOKIE'),
                !0));
            }
            )(s) && a.parent ? new E(e,t,s,a.parent) : new W(e,t,r);
            return (s = null),
            l.init(),
            l;
        }
        ),
        (function() {
            function e() {
                W.windowLoaded = !0;
            }
            a.addEventListener ? a.addEventListener('load', e) : a.attachEvent && a.attachEvent('onload', e),
            (W.codeLoadEnd = new Date().getTime());
        }
        )(),
        (W.config = X),
        (a.Visitor = W),
        W);
    }
    )();
}
;
