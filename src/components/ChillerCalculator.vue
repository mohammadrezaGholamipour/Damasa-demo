<template>
  <div class="app" dir="rtl">
    <a class="skip" href="#main" @click.prevent="focusMain">پرش به محتوا</a>

    <div class="snow-layer" aria-hidden="true" v-if="snowOn">
      <span
        v-for="flake in snowflakes"
        :key="flake.id"
        class="snowflake"
        :style="{
          left: flake.left,
          animationDuration: flake.duration,
          animationDelay: flake.delay,
          fontSize: flake.size,
          opacity: flake.opacity,
          '--drift': flake.drift,
        }"
        >❄</span
      >
    </div>

    <header class="top">
      <div class="wrap top-in">
        <button
          class="brand"
          aria-label="دمآسا انرژی؛ بازگشت به صفحه اول"
          @click="go('home')"
        >
          <img
            v-if="logoOk"
            class="logo-img"
            src="/logo.png"
            alt="DamaSa energy"
            @error="logoOk = false"
          />
          <template v-else
            ><span class="logo">D</span><b>دمآسا انرژی</b></template
          >
          <small class="tagline">محاسبه و انتخاب تجهیزات تاسیسات</small>
        </button>

        <nav class="crumbs" v-if="view !== 'home'" aria-label="مسیر">
          <ol>
            <li v-for="(c, i) in crumbs" :key="c.k">
              <span v-if="i === crumbs.length - 1" aria-current="page">{{
                c.t
              }}</span>
              <button v-else @click="go(c.k)">{{ c.t }}</button>
              <i v-if="i < crumbs.length - 1" aria-hidden="true">‹</i>
            </li>
          </ol>
        </nav>

        <button
          class="snow-btn"
          :aria-pressed="snowOn"
          :title="snowOn ? 'خاموش کردن برف' : 'روشن کردن برف'"
          @click="snowOn = !snowOn"
        >
          <span aria-hidden="true">❄</span><span class="snow-txt">برف</span>
        </button>
      </div>
    </header>

    <main id="main" class="wrap" tabindex="-1" ref="mainEl">
      <Transition name="fade" mode="out-in">
        <!-- ۱. گروه‌ها -->
        <section v-if="view === 'home'" class="page" key="home">
          <h1>
            برای محاسبه تجهیزات تاسیسات،<br />گروه مورد نظر را انتخاب کنید
          </h1>
          <p class="lead">در این نسخه نمایشی، «تاسیسات سرمایشی» فعال است.</p>
          <div class="ggrid">
            <button
              v-for="(g, i) in groups"
              :key="g.id"
              class="gcard"
              :class="['g-' + g.id, { live: g.live, off: !g.live }]"
              :style="{ '--i': i }"
              :disabled="!g.live"
              @click="go('cool')"
            >
              <span class="fx" aria-hidden="true">
                <template v-if="g.id === 'cool'">
                  <i class="fl f1">❄</i><i class="fl f2">❄</i
                  ><i class="fl f3">❄</i>
                </template>
                <template v-else-if="g.id === 'heat'">
                  <i class="hb h1"></i><i class="hb h2"></i
                  ><i class="hb h3"></i>
                </template>
                <template v-else-if="g.id === 'pool'">
                  <svg
                    class="wave w1"
                    viewBox="0 0 800 40"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 20 Q50 0 100 20 T200 20 T300 20 T400 20 T500 20 T600 20 T700 20 T800 20 V40 H0Z"
                    />
                  </svg>
                  <svg
                    class="wave w2"
                    viewBox="0 0 800 40"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 20 Q50 0 100 20 T200 20 T300 20 T400 20 T500 20 T600 20 T700 20 T800 20 V40 H0Z"
                    />
                  </svg>
                </template>
                <template v-else-if="g.id === 'floor'">
                  <svg
                    class="heatlines"
                    viewBox="0 0 200 120"
                    preserveAspectRatio="none"
                  >
                    <path d="M30 120 C14 96 46 84 30 60 S46 24 30 0" />
                    <path
                      class="d2"
                      d="M100 120 C84 96 116 84 100 60 S116 24 100 0"
                    />
                    <path
                      class="d3"
                      d="M170 120 C154 96 186 84 170 60 S186 24 170 0"
                    />
                  </svg>
                </template>
                <template v-else-if="g.id === 'pump'">
                  <svg class="impeller" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="#fff"
                      stroke-width="3"
                    />
                    <g fill="#fff">
                      <ellipse cx="50" cy="26" rx="9" ry="20" />
                      <ellipse
                        cx="50"
                        cy="26"
                        rx="9"
                        ry="20"
                        transform="rotate(90 50 50)"
                      />
                      <ellipse
                        cx="50"
                        cy="26"
                        rx="9"
                        ry="20"
                        transform="rotate(180 50 50)"
                      />
                      <ellipse
                        cx="50"
                        cy="26"
                        rx="9"
                        ry="20"
                        transform="rotate(270 50 50)"
                      />
                    </g>
                  </svg>
                  <svg
                    class="flow"
                    viewBox="0 0 200 6"
                    preserveAspectRatio="none"
                  >
                    <line x1="0" y1="3" x2="200" y2="3" />
                  </svg>
                </template>
              </span>
              <span class="gicon" v-html="g.icon"></span>
              <b>{{ g.title }}</b>
              <small v-if="g.live"
                >{{ fa(coolItems.length) }} محاسبه · ورود</small
              >
              <small v-else><span v-html="lock"></span> به‌زودی</small>
              <span class="badge" v-if="g.live">فعال</span>
            </button>
          </div>
        </section>

        <!-- ۲. زیرشاخه‌ها -->
        <section v-else-if="view === 'cool'" class="page" key="cool">
          <h1>تاسیسات سرمایشی</h1>
          <p class="lead">محاسبه‌ای را که می‌خواهید انتخاب کنید.</p>
          <div class="items">
            <button
              v-for="(it, i) in coolItems"
              :key="it.t"
              class="item"
              :class="{ live: it.ready, off: !it.ready }"
              :style="{ '--i': i }"
              :disabled="!it.ready"
              @click="go('products')"
            >
              <span>{{ it.t }}</span>
              <em v-if="it.ready">فعال · {{ fa(catalog.length) }} مدل</em>
              <small v-else class="soon"
                ><span v-html="lock"></span> به‌زودی</small
              >
            </button>
          </div>
        </section>

        <!-- ۳. محصولات -->
        <section v-else-if="view === 'products'" class="page" key="products">
          <div class="phead">
            <div>
              <h1>چیلر و مینی‌چیلر</h1>
              <p class="lead">
                محصولات کاتالوگ دمآسا انرژی؛ ظرفیت‌ها در هوای ۳۵°C
              </p>
            </div>
            <button class="cta" @click="go('calc')">شروع محاسبه</button>
          </div>

          <div class="tabs" role="group" aria-label="نوع محصول">
            <button
              v-for="s in series"
              :key="s.k"
              :aria-pressed="tab === s.k"
              :class="{ on: tab === s.k }"
              @click="setTab(s.k)"
            >
              {{ s.t
              }}<small
                >{{
                  fa(catalog.filter((m) => m.series === s.k).length)
                }}
                مدل</small
              >
            </button>
          </div>

          <div class="pgrid" :key="tab">
            <article
              v-for="(m, i) in shown"
              :key="m.id"
              class="prod"
              :style="{ '--i': i }"
            >
              <div class="prow">
                <b class="pname">{{ m.id }}</b
                ><span class="pill">{{ m.comp }}</span>
              </div>
              <div class="range-line">
                <b>{{ rng(m, "kW") }}</b
                ><span>kW ظرفیت واقعی</span>
              </div>
              <div class="refline" aria-label="مبردهای موجود">
                <span v-for="v in m.variants" :key="v.ref" class="pill ref">{{
                  v.ref
                }}</span>
              </div>
              <dl>
                <div>
                  <dt>ظرفیت نامی</dt>
                  <dd>{{ rng(m, "nomTR") }} تن</dd>
                </div>
                <div>
                  <dt>توان مصرفی</dt>
                  <dd>{{ rng(m, "power") }} kW</dd>
                </div>
                <div>
                  <dt>مدار تبرید</dt>
                  <dd>{{ fa(m.circuits) }}</dd>
                </div>
                <div>
                  <dt>کمپرسور</dt>
                  <dd>{{ fa(m.compressors) }}</dd>
                </div>
                <div v-if="m.weight">
                  <dt>وزن</dt>
                  <dd>{{ fa(m.weight) }} kg</dd>
                </div>
                <div v-if="m.dims">
                  <dt>ابعاد (mm)</dt>
                  <dd class="ltr">{{ m.dims.join(" × ") }}</dd>
                </div>
              </dl>
              <button
                class="lnk"
                :aria-expanded="openProd === m.id"
                @click="openProd = openProd === m.id ? null : m.id"
              >
                {{
                  openProd === m.id ? "بستن جدول مبردها" : "جدول به تفکیک مبرد"
                }}
              </button>
              <div class="tw" v-if="openProd === m.id">
                <table>
                  <thead>
                    <tr>
                      <th>مبرد</th>
                      <th>ظرفیت (TR)</th>
                      <th>ظرفیت (kW)</th>
                      <th>توان (kW)</th>
                      <th>جریان (A)</th>
                      <th>دبی (gpm)</th>
                      <th>افت فشار (kPa)</th>
                      <th>FLA (A)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="v in m.variants" :key="v.ref">
                      <th>{{ v.ref }}</th>
                      <td>{{ fa(v.tr, 2) }}</td>
                      <td>{{ fa(v.kW, 1) }}</td>
                      <td>{{ fa(v.power, 2) }}</td>
                      <td>{{ fa(v.amp, 2) }}</td>
                      <td>{{ v.gpm == null ? "—" : fa(v.gpm, 1) }}</td>
                      <td>{{ v.dp == null ? "—" : fa(v.dp, 2) }}</td>
                      <td>{{ fa(v.fla, 1) }}</td>
                    </tr>
                  </tbody>
                </table>
                <p class="fine">
                  فن: {{ fa(m.fan.n) }} عدد آکسیال، {{ fa(m.fan.rpm) }} دور بر
                  دقیقه، {{ fa(m.fan.kW, 1) }} kW · برق ۳۸۰ ولت سه‌فاز ۵۰ هرتز
                </p>
              </div>
            </article>
          </div>

          <div class="bottom-cta">
            <button class="cta big" @click="go('calc')">
              شروع محاسبه و انتخاب مدل
            </button>
          </div>
        </section>

        <!-- ۴. محاسبه -->
        <section v-else class="page calc" key="calc">
          <div class="inputs">
            <div class="ihead">
              <div>
                <h1>محاسبه ظرفیت چیلر</h1>
                <p class="lead">
                  گزینه را انتخاب کنید یا مقدار دلخواه بنویسید؛ نتیجه همزمان
                  به‌روز می‌شود.
                </p>
              </div>
              <button class="ghost" @click="resetInputs">بازنشانی</button>
            </div>

            <div class="seg" role="group" aria-label="روش محاسبه">
              <button
                :class="{ on: f.mode === 'est' }"
                :aria-pressed="f.mode === 'est'"
                @click="f.mode = 'est'"
              >
                برآورد از روی ساختمان
              </button>
              <button
                :class="{ on: f.mode === 'man' }"
                :aria-pressed="f.mode === 'man'"
                @click="f.mode = 'man'"
              >
                بار سرمایی را دارم
              </button>
            </div>

            <div class="blk" v-for="b in blocks" :key="b.id">
              <!-- گزینه‌ای -->
              <template v-if="b.kind === 'field'">
                <div class="bh">
                  <b>{{ b.fd.title }}</b>
                  <button
                    class="q"
                    :aria-expanded="!!tips[b.fd.key]"
                    :aria-label="'راهنما: ' + b.fd.title"
                    @click="tips[b.fd.key] = !tips[b.fd.key]"
                  >
                    ؟
                  </button>
                </div>
                <p class="tip" v-if="tips[b.fd.key]">{{ b.fd.tip }}</p>
                <div class="chips" role="group" :aria-label="b.fd.title">
                  <button
                    v-for="o in b.fd.opts"
                    :key="o.v"
                    type="button"
                    :class="{ on: f[b.fd.key] === o.v }"
                    :aria-pressed="f[b.fd.key] === o.v"
                    @click="f[b.fd.key] = o.v"
                  >
                    <b>{{ o.t }}</b
                    ><small>{{ o.s }}</small>
                  </button>
                  <button
                    type="button"
                    :class="{ on: f[b.fd.key] === 'custom' }"
                    :aria-pressed="f[b.fd.key] === 'custom'"
                    @click="chooseCustom(b.fd)"
                  >
                    <b>دلخواه</b><small>مقدار خودتان</small>
                  </button>
                </div>
                <template v-if="f[b.fd.key] === 'custom'">
                  <label class="cust" :class="{ bad: customBad(b.fd) }">
                    <input
                      type="number"
                      inputmode="decimal"
                      :min="b.fd.min"
                      :max="b.fd.max"
                      v-model.number="f[b.fd.ck]"
                      :aria-label="b.fd.title"
                      :aria-invalid="customBad(b.fd)"
                    />
                    <span>{{ b.fd.unit }}</span>
                  </label>
                  <p class="field-err" v-if="customBad(b.fd)">
                    مقدار مجاز: {{ fa(b.fd.min) }} تا {{ fa(b.fd.max) }}
                    {{ b.fd.unit }}
                  </p>
                </template>
              </template>

              <!-- زیربنا -->
              <template v-else-if="b.kind === 'area'">
                <div class="bh">
                  <b>زیربنای مفید</b>
                  <button
                    class="q"
                    :aria-expanded="!!tips.area"
                    aria-label="راهنما: زیربنای مفید"
                    @click="tips.area = !tips.area"
                  >
                    ؟
                  </button>
                </div>
                <p class="tip" v-if="tips.area">
                  مساحت فضاهایی که سرمایش می‌گیرند، نه کل زمین. اسلایدر را بکشید
                  یا عدد را بنویسید؛ عدد بیشتر از ۱۰٬۰۰۰ هم قابل قبول است.
                </p>
                <label class="cust big" :class="{ bad: !(f.area > 0) }">
                  <input
                    type="number"
                    inputmode="decimal"
                    min="0"
                    step="10"
                    v-model.number="f.area"
                    aria-label="زیربنا"
                  />
                  <span>متر مربع</span>
                </label>
                <input
                  class="slider"
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  :value="Math.min(f.area || 0, 10000)"
                  @input="f.area = +$event.target.value"
                  aria-label="زیربنا"
                />
                <div class="ticks">
                  <span>۵۰</span><span>۵٬۰۰۰</span><span>۱۰٬۰۰۰</span>
                </div>
              </template>

              <!-- بار مستقیم -->
              <template v-else>
                <div class="bh"><b>بار سرمایی پروژه</b></div>
                <label class="cust big" :class="{ bad: !(f.manual > 0) }">
                  <input
                    type="number"
                    inputmode="decimal"
                    min="0"
                    v-model.number="f.manual"
                    aria-label="بار سرمایی"
                  />
                  <span>{{ f.unit }}</span>
                </label>
                <div class="chips three" role="group" aria-label="واحد">
                  <button
                    v-for="u in units"
                    :key="u.k"
                    type="button"
                    :class="{ on: f.unit === u.k }"
                    :aria-pressed="f.unit === u.k"
                    @click="f.unit = u.k"
                  >
                    <b>{{ u.k }}</b
                    ><small>{{ u.t }}</small>
                  </button>
                </div>
              </template>
            </div>
          </div>

          <aside class="result" ref="resEl" aria-label="نتیجه محاسبه">
            <div class="gauge" :class="{ bad: calc.errors.length }">
              <template v-if="!calc.errors.length">
                <small>ظرفیت موردنیاز چیلر</small>
                <div class="figure" aria-live="polite">
                  <b>{{ fa(displayReq, 0) }}</b
                  ><span>kW</span>
                </div>
                <div class="units">
                  <span>{{ fa(displayReq / TR, 1) }} تن تبرید</span
                  ><span>{{ fa(displayReq / BTU / 1000, 0) }} هزار BTU/h</span>
                </div>
              </template>
              <template v-else>
                <small>ورودی‌ها را اصلاح کنید</small>
                <ul role="alert">
                  <li v-for="e in calc.errors" :key="e">{{ e }}</li>
                </ul>
              </template>
            </div>

            <template v-if="!calc.errors.length">
              <div class="rhead">
                <h2>مدل‌های پیشنهادی</h2>
                <div class="refs" role="group" aria-label="نوع مبرد">
                  <button
                    v-for="r in refsList"
                    :key="r"
                    :class="{ on: f.ref === r }"
                    :aria-pressed="f.ref === r"
                    @click="f.ref = r"
                  >
                    {{ r === "all" ? "همه مبردها" : r }}
                  </button>
                </div>
              </div>

              <p class="warn banner" v-if="ambient > 35">
                ظرفیت‌های کاتالوگ برای هوای ۳۵°C است و در {{ fa(ambient) }}°C
                کمتر می‌شود. مدل‌های زیر این کاهش را در نظر نمی‌گیرند؛ ضریب
                اطمینان را بالاتر بگیرید یا با کارشناس شرکت چک کنید.
              </p>

              <div class="empty" v-if="!picks.length">
                <p>{{ emptyMsg }}</p>
                <button
                  class="ghost"
                  v-if="f.ref !== 'all'"
                  @click="f.ref = 'all'"
                >
                  نمایش همه مبردها
                </button>
              </div>

              <article
                v-for="(p, i) in picks"
                :key="p.m.id"
                class="pick"
                :class="{ first: i === 0 }"
              >
                <button
                  class="pk"
                  @click="openId = isOpen(p, i) ? null : p.m.id"
                  :aria-expanded="isOpen(p, i)"
                >
                  <div class="pt">
                    <b>{{ p.n > 1 ? fa(p.n) + "× " : "" }}{{ p.m.id }}</b>
                    <span class="pill">{{
                      p.m.series === "mini" ? "مینی‌چیلر" : "چیلر"
                    }}</span>
                    <span class="pill ref">{{ p.v.ref }}</span>
                    <span class="tag" :class="p.tag.c">{{ p.tag.t }}</span>
                    <span class="chev" aria-hidden="true">⌄</span>
                  </div>
                  <div
                    class="bar"
                    role="img"
                    :aria-label="'ظرفیت کل ' + fa(p.total, 0) + ' کیلووات'"
                  >
                    <i
                      class="fill"
                      :style="{
                        width:
                          Math.min(100, (p.total / (calc.req * 1.6)) * 100) +
                          '%',
                      }"
                    ></i>
                    <i class="mark" title="حد نیاز"></i>
                  </div>
                  <div class="pm">
                    <span>ظرفیت کل {{ fa(p.total, 0) }} kW</span>
                    <span>نیاز {{ fa(calc.req, 0) }} kW</span>
                  </div>
                </button>
                <dl v-if="isOpen(p, i)">
                  <div>
                    <dt>ظرفیت هر دستگاه</dt>
                    <dd>{{ fa(p.v.kW, 1) }} kW ({{ fa(p.v.tr, 1) }} TR)</dd>
                  </div>
                  <div>
                    <dt>ظرفیت نامی</dt>
                    <dd>{{ fa(p.v.nomTR, 1) }} تن</dd>
                  </div>
                  <div>
                    <dt>مازاد نسبت به نیاز</dt>
                    <dd>{{ fa(p.over, 0) }}٪</dd>
                  </div>
                  <div>
                    <dt>توان مصرفی هر دستگاه</dt>
                    <dd>{{ fa(p.v.power, 1) }} kW</dd>
                  </div>
                  <div>
                    <dt>جریان / حداکثر جریان</dt>
                    <dd>{{ fa(p.v.amp, 1) }} / {{ fa(p.v.fla, 1) }} A</dd>
                  </div>
                  <div>
                    <dt>دبی آب هر دستگاه</dt>
                    <dd>
                      {{ p.v.gpm == null ? "—" : fa(p.v.gpm, 1) + " gpm" }}
                    </dd>
                  </div>
                  <div>
                    <dt>مدار / کمپرسور</dt>
                    <dd>{{ fa(p.m.circuits) }} / {{ fa(p.m.compressors) }}</dd>
                  </div>
                </dl>
              </article>

              <button
                class="ghost wide"
                v-if="picks.length"
                @click="copySummary"
                aria-live="polite"
              >
                {{ copied ? "کپی شد ✓" : "کپی خلاصه نتیجه" }}
              </button>

              <details class="how">
                <summary>این عدد چطور به دست آمد؟</summary>
                <ol>
                  <li v-for="s in calc.steps" :key="s">{{ s }}</li>
                </ol>
              </details>
            </template>
          </aside>

          <Transition name="dock">
            <button
              class="dock"
              v-if="showDock"
              @click="resEl && resEl.scrollIntoView({ behavior: 'smooth' })"
            >
              <span
                >نیاز: <b>{{ fa(calc.req, 0) }} kW</b></span
              >
              <span>{{ fa(picks.length) }} مدل پیشنهادی ↓</span>
            </button>
          </Transition>
        </section>
      </Transition>
    </main>

    <footer class="wrap foot">
      نسخه نمایشی · داده‌های محصول از کاتالوگ دمآسا انرژی · ضرایب بار ساختمان
      برآورد اولیه‌اند و جایگزین محاسبه دقیق نیستند.
    </footer>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";

const TR = 3.517,
  BTU = 0.00029307;
const reduceMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* ---------- برف ---------- */
const snowflakes = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 11) % 100}%`,
  duration: `${10 + ((i * 7) % 13)}s`,
  delay: `${-((i * 3) % 18)}s`,
  size: `${10 + ((i * 11) % 15)}px`,
  opacity: `${0.22 + ((i * 13) % 50) / 100}`,
  drift: `${((i * 17) % 61) - 30}px`,
}));
const LS_KEY = "damasa-chiller-demo-v3";
const LS_SNOW = "damasa-snow";
const snowOn = ref(!reduceMotion);

const fa = (n, d = 0) =>
  Number(n).toLocaleString("fa-IR", { maximumFractionDigits: d });
const svg = (d) =>
  `<svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const lock = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;

/* ---------- ناوبری (با دکمه برگشت مرورگر) ---------- */
const VIEWS = ["home", "cool", "products", "calc"];
const LABELS = {
  home: "گروه‌ها",
  cool: "تاسیسات سرمایشی",
  products: "چیلر و مینی‌چیلر",
  calc: "محاسبه",
};
const fromHash = () => {
  const v = (typeof location !== "undefined" ? location.hash : "").replace(
    /^#\/?/,
    "",
  );
  return VIEWS.includes(v) ? v : "home";
};
const view = ref(fromHash());
const mainEl = ref(null);
const go = (v) => {
  view.value = v;
};
const onHash = () => {
  view.value = fromHash();
};
watch(view, (v) => {
  if (fromHash() !== v) location.hash = `/${v}`;
  window.scrollTo({ top: 0 });
  nextTick(() => mainEl.value?.focus({ preventScroll: true }));
});
const focusMain = () => mainEl.value?.focus();
const crumbs = computed(() =>
  VIEWS.slice(0, VIEWS.indexOf(view.value) + 1).map((k) => ({
    k,
    t: LABELS[k],
  })),
);
const logoOk = ref(true);

/* ---------- گروه‌ها و زیرشاخه‌ها ---------- */
const groups = [
  {
    id: "cool",
    live: true,
    title: "تاسیسات سرمایشی",
    icon: svg(
      '<path d="M16 3v26M5 9l22 14M27 9L5 23M12 5l4 3 4-3M12 27l4-3 4 3"/>',
    ),
  },
  {
    id: "heat",
    title: "تاسیسات گرمایشی",
    icon: svg(
      '<path d="M16 3c2 5 7 7 7 14a7 7 0 0 1-14 0c0-3 2-5 3-7 1 2 2 3 4 3-1-3-1-6 0-10z"/>',
    ),
  },
  {
    id: "pool",
    title: "استخر، سونا، جکوزی",
    icon: svg(
      '<path d="M3 22c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2M3 28c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2M11 18V6a3 3 0 0 1 6 0M19 18V6"/>',
    ),
  },
  {
    id: "floor",
    title: "گرمایش از کف",
    icon: svg(
      '<path d="M3 26h26M7 26c0-6 4-6 4-10s-4-4-4-8M16 26c0-6 4-6 4-10s-4-4-4-8M25 26c0-6 4-6 4-10"/>',
    ),
  },
  {
    id: "pump",
    title: "پمپ و آبرسانی",
    icon: svg(
      '<circle cx="16" cy="16" r="7"/><path d="M16 9v14M9 16h14M3 16h6M23 16h6"/>',
    ),
  },
];
const coolItems = [
  "ظرفیت چیلر و مینی‌چیلر",
  "ظرفیت هواساز",
  "ظرفیت فن‌کویل",
  "ظرفیت داکت فن‌کویل",
  "ظرفیت داکت اسپلیت",
  "ظرفیت کولرگازی",
  "کویل سرمایشی",
  "ظرفیت ایرواشر",
  "ظرفیت زنت تبخیری سلولزی",
  "ظرفیت کولرآبی سلولزی و زیرسقفی",
  "ظرفیت برج خنک‌کننده",
].map((t, i) => ({ t, ready: i === 0 }));

/* ---------- کاتالوگ دمآسا انرژی (از تصویر کاتالوگ) ----------
   ظرفیت‌ها «ظرفیت واقعی» در دمای هوای طراحی ۳۵°C هستند.
   مواردی که در کاتالوگ مشکوک بود (دبی CMS-20 R407/R134، وزن CCT-50/60، عرض مینی‌چیلرها) خالی گذاشته شد. */
const V = (ref, nomTR, tr, kW, power, amp, gpm, dp, fla) => ({
  ref,
  nomTR,
  tr,
  kW,
  power,
  amp,
  gpm,
  dp,
  fla,
});
const SC = "اسکرال کوپلند / دنفوس";
const catalog = [
  {
    id: "CCT-40",
    series: "chiller",
    comp: SC,
    circuits: 2,
    compressors: 4,
    fan: { n: 3, rpm: 930, kW: 1.7 },
    dims: [3492, 1512, 2275],
    weight: 2500,
    variants: [
      V("R407c", 40, 33, 115.6, 34, 62.5, 87.5, 4.02, 99.5),
      V("R134a", 40, 22, 77.6, 24.8, 51.75, 58.5, 3.96, 99.5),
      V("R410a", 40, 33, 115.6, 35, 67.5, 87.5, 3.88, 94),
    ],
  },
  {
    id: "CCT-50",
    series: "chiller",
    comp: SC,
    circuits: 2,
    compressors: 4,
    fan: { n: 4, rpm: 930, kW: 1.7 },
    dims: [2445, 2300, 2208],
    weight: null,
    variants: [
      V("R407c", 48, 37.7, 132.4, 39.3, 70, 100, 4.08, 118),
      V("R134a", 48, 25.7, 90.4, 38.3, 54, 68.5, 4.01, 118),
      V("R410a", 48, 39.5, 138.8, 41.6, 78, 105, 3.98, 111),
    ],
  },
  {
    id: "CCT-60",
    series: "chiller",
    comp: SC,
    circuits: 2,
    compressors: 4,
    fan: { n: 4, rpm: 930, kW: 1.7 },
    dims: [2445, 2300, 2208],
    weight: null,
    variants: [
      V("R407c", 60, 48, 168.8, 51, 103.6, 128, 3.83, 154),
      V("R134a", 60, 33, 116, 38, 93, 88, 3.74, 154),
      V("R410a", 60, 48.3, 170, 51, 101, 129, 3.85, 146),
    ],
  },
  {
    id: "CMS-20",
    series: "chiller",
    comp: "اسکرال کوپلند ZR",
    circuits: 2,
    compressors: 2,
    fan: { n: 2, rpm: 930, kW: 1.7 },
    dims: [2400, 1550, 1974],
    weight: 1500,
    variants: [
      V("R407c", 20, 16.9, 57.8, 18, 32.5, null, 3.96, 51),
      V("R134a", 20, 11, 38.8, 13.4, 27, null, 4.02, 51),
      V("R410a", 20, 16.9, 57.8, 18, 34, 43.7, 3.78, 48),
    ],
  },
  {
    id: "CMS-24",
    series: "chiller",
    comp: "اسکرال کوپلند ZR",
    circuits: 2,
    compressors: 2,
    fan: { n: 2, rpm: 930, kW: 1.7 },
    dims: [2400, 1550, 1974],
    weight: 1600,
    variants: [
      V("R407c", 24, 18.8, 66.2, 20, 35, 50, 4.08, 59),
      V("R134a", 24, 12.85, 45.2, 15, 27, 34.25, 4.01, 59),
      V("R410a", 24, 19.7, 69.4, 21.2, 39, 52.5, 3.98, 55.4),
    ],
  },
  {
    id: "CMS-30",
    series: "chiller",
    comp: "اسکرال کوپلند ZR",
    circuits: 2,
    compressors: 2,
    fan: { n: 2, rpm: 930, kW: 1.7 },
    dims: [2500, 1600, 1974],
    weight: 1800,
    variants: [
      V("R407c", 30, 24, 84.4, 25.8, 52, 64, 3.83, 77),
      V("R134a", 30, 16.5, 58, 19, 47.6, 44, 3.75, 77),
      V("R410a", 30, 24.15, 85, 26, 52, 69.9, 3.85, 73),
    ],
  },
  {
    id: "CMS-4",
    series: "mini",
    comp: "اسکرال کوپلند ZR",
    circuits: 1,
    compressors: 1,
    fan: { n: 1, rpm: 900, kW: 0.9 },
    dims: null,
    weight: 60,
    variants: [
      V("R22", 4, 3, 10.8, 3.8, 8, 8, null, 14),
      V("R410a", 4.5, 3.5, 12.5, 4.25, 8, 8, null, 12.6),
    ],
  },
  {
    id: "CMS-5",
    series: "mini",
    comp: "اسکرال کوپلند ZR",
    circuits: 1,
    compressors: 1,
    fan: { n: 1, rpm: 900, kW: 0.9 },
    dims: null,
    weight: 65,
    variants: [
      V("R22", 5, 4, 13.9, 4.5, 9.7, 10.6, null, 15.1),
      V("R410a", 5, 4.15, 14.6, 4.8, 9, 10.6, null, 13.3),
    ],
  },
  {
    id: "CMS-6",
    series: "mini",
    comp: "اسکرال کوپلند ZR",
    circuits: 1,
    compressors: 1,
    fan: { n: 1, rpm: 900, kW: 0.9 },
    dims: null,
    weight: 65,
    variants: [
      V("R22", 6, 4.5, 15.8, 5.04, 9.9, 12, null, 16.1),
      V("R410a", 6, 4.7, 16.65, 5.45, 10.4, 12, null, 17),
    ],
  },
];
const series = [
  {
    k: "chiller",
    t: "چیلر اسکرال هوا‌خنک",
    feats: [
      "دو مدار مجزا",
      "کارکرد تا دمای محیط ۵۵+ درجه",
      "اواپراتور Shell & Tube",
      "کندانسور Fin Tube یا مایکروچنل",
      "شیر انبساط الکترونیکی Carel یا Danfoss",
      "کنترل از راه دور با WiFi و اتصال به BMS",
      "مبرد R407c، R134a و R410a",
      "۳۰ ماه گارانتی و ۱۲۰ ماه خدمات پس از فروش",
    ],
  },
  {
    k: "mini",
    t: "مینی‌چیلر بغل‌زن",
    feats: [
      "ظرفیت ۱۴، ۱۸ و ۲۱ کیلووات",
      "قابلیت نصب در بالکن (تراس)",
      "کارکرد تا دمای محیط ۵۴+ درجه",
      "اواپراتور Shell & Tube یا استیل پلیت",
      "پمپ سیرکوله داخلی از برندهای اروپایی",
      "کمپرسور High Efficiency Tandem Scroll",
      "نصب، راه‌اندازی و نگهداری آسان",
      "کنترل با WiFi (سفارشی)",
    ],
  },
];
const tab = ref("chiller");
const shown = computed(() => catalog.filter((m) => m.series === tab.value));
const openProd = ref(null);
const setTab = (k) => {
  tab.value = k;
  openProd.value = null;
};
const rng = (m, k) => {
  const a = m.variants.map((v) => v[k]);
  const lo = Math.min(...a),
    hi = Math.max(...a);
  return lo === hi ? fa(lo, 1) : `${fa(lo, 1)} تا ${fa(hi, 1)}`;
};

/* ---------- ورودی‌ها ---------- */
const fields = [
  {
    key: "type",
    ck: "wC",
    title: "کاربری ساختمان",
    unit: "وات بر متر مربع",
    min: 30,
    max: 500,
    tip: "هر کاربری یک بار سرمایی تقریبی بر متر مربع دارد (زیر هر گزینه). اگر عدد دقیق‌تری دارید، «دلخواه» را بزنید.",
    opts: [
      { v: "res", t: "مسکونی", n: 90 },
      { v: "office", t: "اداری", n: 120 },
      { v: "hotel", t: "هتل", n: 110 },
      { v: "hosp", t: "درمانی", n: 140 },
      { v: "shop", t: "تجاری", n: 160 },
      { v: "hall", t: "رستوران و سالن", n: 220 },
    ].map((o) => ({ ...o, s: `${fa(o.n)} W/m²` })),
  },
  {
    key: "fresh",
    ck: "fC",
    title: "هوای تازه ساختمان",
    unit: "درصد افزایش بار",
    min: 0,
    max: 60,
    tip: "هوای بیرونی که وارد ساختمان می‌شود بار سرمایی اضافه می‌کند. مقدار، افزایش تقریبی بار است.",
    opts: [
      { v: "low", t: "کم", n: 10, s: "۱۰٪" },
      { v: "mid", t: "متوسط", n: 20, s: "۲۰٪" },
      { v: "high", t: "زیاد", n: 30, s: "۳۰٪" },
    ],
  },
  {
    key: "ambient",
    ck: "aC",
    title: "دمای هوای محیط در تابستان",
    unit: "درجه سانتی‌گراد",
    min: 20,
    max: 60,
    tip: "ظرفیت چیلر هوا‌خنک با گرم‌تر شدن هوا کم می‌شود. ظرفیت‌های کاتالوگ در ۳۵°C است.",
    opts: [
      { v: 35, t: "۳۵°C", n: 35, s: "معتدل" },
      { v: 40, t: "۴۰°C", n: 40, s: "گرم" },
      { v: 43, t: "۴۳°C", n: 43, s: "خیلی گرم" },
      { v: 46, t: "۴۶°C", n: 46, s: "بسیار گرم" },
    ],
  },
  {
    key: "safety",
    ck: "sC",
    title: "ضریب اطمینان",
    unit: "درصد",
    min: 0,
    max: 50,
    tip: "حاشیه‌ای برای خطای برآورد و رشد آینده؛ معمولاً ۵ تا ۱۵ درصد.",
    opts: [
      { v: "s5", t: "۵٪", n: 5, s: "دقیق" },
      { v: "s10", t: "۱۰٪", n: 10, s: "معمول" },
      { v: "s15", t: "۱۵٪", n: 15, s: "محتاطانه" },
      { v: "s20", t: "۲۰٪", n: 20, s: "رشد آینده" },
    ],
  },
];
const fd = (key) => fields.find((x) => x.key === key);
const units = [
  { k: "kW", t: "کیلووات" },
  { k: "TR", t: "تن تبرید" },
  { k: "BTU/h", t: "بی‌تی‌یو" },
];
const defaults = () => ({
  mode: "est",
  type: "office",
  wC: 120,
  area: 1000,
  ambient: 40,
  aC: 38,
  fresh: "mid",
  fC: 15,
  safety: "s10",
  sC: 12,
  manual: 300,
  unit: "kW",
  ref: "all",
});
const f = reactive(defaults());
const tips = reactive({});
const openId = ref("auto"); // "auto" = اولین پیشنهاد باز است
const resEl = ref(null);
const refsList = ["all", "R407c", "R134a", "R410a", "R22"];

/* ترتیب بلوک‌ها در هر حالت (دمای هوا و ضریب اطمینان در هر دو حالت لازم‌اند) */
const blocks = computed(() =>
  f.mode === "est"
    ? [
        { id: "type", kind: "field", fd: fd("type") },
        { id: "area", kind: "area" },
        { id: "fresh", kind: "field", fd: fd("fresh") },
        { id: "ambient", kind: "field", fd: fd("ambient") },
        { id: "safety", kind: "field", fd: fd("safety") },
      ]
    : [
        { id: "manual", kind: "manual" },
        { id: "ambient", kind: "field", fd: fd("ambient") },
        { id: "safety", kind: "field", fd: fd("safety") },
      ],
);
const activeFields = computed(() =>
  blocks.value.filter((b) => b.kind === "field").map((b) => b.fd),
);

const cv = (key) => {
  const d = fd(key);
  return f[key] === "custom" ? +f[d.ck] : d.opts.find((o) => o.v === f[key])?.n;
};
const customBad = (d) => {
  if (f[d.key] !== "custom") return false;
  const raw = f[d.ck];
  const v = +raw;
  return raw === "" || raw == null || !(v >= d.min && v <= d.max);
};
const chooseCustom = (d) => {
  if (f[d.key] !== "custom") {
    const cur = cv(d.key);
    if (cur != null && !Number.isNaN(cur)) f[d.ck] = cur; // از مقدار فعلی شروع کن
  }
  f[d.key] = "custom";
};
const resetInputs = () => {
  Object.assign(f, defaults());
  openId.value = "auto";
};
const ambient = computed(() => cv("ambient"));

const calc = computed(() => {
  const errors = [],
    steps = [];
  let base = 0;
  for (const d of activeFields.value) {
    if (customBad(d))
      errors.push(`${d.title}: عدد مجاز بین ${fa(d.min)} تا ${fa(d.max)} است.`);
  }
  const safety = cv("safety");
  if (f.mode === "man") {
    const k = { kW: 1, TR: TR, "BTU/h": BTU }[f.unit];
    if (!(+f.manual > 0)) errors.push("بار سرمایی باید بزرگ‌تر از صفر باشد.");
    base = (+f.manual || 0) * k;
    steps.push(`تبدیل ${fa(f.manual)} ${f.unit} به kW: ${fa(base, 1)} kW`);
  } else {
    const w = cv("type"),
      fr = cv("fresh");
    if (!(+f.area > 0)) errors.push("زیربنا باید بزرگ‌تر از صفر باشد.");
    const sens = ((+f.area || 0) * (w || 0)) / 1000;
    base = sens * (1 + (fr || 0) / 100);
    steps.push(
      `بار پایه = ${fa(f.area)} × ${fa(w)} ÷ ۱۰۰۰ = ${fa(sens, 1)} kW`,
    );
    steps.push(`با ${fa(fr)}٪ بار هوای تازه: ${fa(base, 1)} kW`);
  }
  const req = base * (1 + (safety || 0) / 100);
  steps.push(`با ضریب اطمینان ${fa(safety || 0)}٪: ${fa(req, 1)} kW`);
  steps.push(`معادل ${fa(req / TR, 1)} تن تبرید (هر تن = ${fa(TR, 3)} kW)`);
  steps.push("انتخاب بر اساس «ظرفیت واقعی» کاتالوگ در هوای ۳۵°C انجام می‌شود.");
  return { errors, steps, req };
});

/* عدد نتیجه با انیمیشن نرم تغییر می‌کند (بدون remount) */
const displayReq = ref(0);
let raf = 0;
watch(
  () => calc.value.req,
  (to) => {
    if (typeof window === "undefined") return;
    cancelAnimationFrame(raf);
    if (reduceMotion || !Number.isFinite(to)) {
      displayReq.value = to || 0;
      return;
    }
    const from = displayReq.value,
      t0 = performance.now(),
      dur = 360;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      displayReq.value = from + (to - from) * (1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  },
  { immediate: true },
);

const picks = computed(() => {
  if (calc.value.errors.length) return [];
  const req = calc.value.req;
  const out = [];
  for (const m of catalog) {
    for (let n = 1; n <= 3; n++) {
      const ok = m.variants.filter(
        (v) => (f.ref === "all" || v.ref === f.ref) && n * v.kW >= req,
      );
      if (ok.length) {
        const v = ok.reduce((a, b) => (a.kW <= b.kW ? a : b));
        const total = n * v.kW,
          over = (total / req - 1) * 100;
        if (over <= 60)
          out.push({
            m,
            v,
            n,
            total,
            over,
            tag:
              over <= 15
                ? { t: "مناسب‌ترین", c: "ok" }
                : over <= 30
                  ? { t: "مناسب", c: "mid" }
                  : { t: "مازاد زیاد", c: "hi" },
          });
        break;
      }
    }
  }
  return out.sort((a, b) => a.n - b.n || a.over - b.over).slice(0, 4);
});
const isOpen = (p, i) =>
  openId.value === "auto" ? i === 0 : openId.value === p.m.id;

/* پیام وقتی مدلی پیدا نشد؛ دلیلش را دقیق می‌گوید */
const emptyMsg = computed(() => {
  const ks = catalog.flatMap((m) =>
    m.variants
      .filter((v) => f.ref === "all" || v.ref === f.ref)
      .map((v) => v.kW),
  );
  if (!ks.length) return "برای این مبرد مدلی در کاتالوگ نیست.";
  if (calc.value.req > Math.max(...ks) * 3)
    return `نیاز شما از بزرگ‌ترین ترکیب کاتالوگ (۳ دستگاه هم‌مدل، ${fa(Math.max(...ks) * 3, 0)} kW) بیشتر است. برای این پروژه با کارشناس شرکت مشورت کنید.`;
  if (calc.value.req * 1.6 < Math.min(...ks))
    return "نیاز شما از کوچک‌ترین مدل کاتالوگ خیلی کمتر است.";
  return "با این مبرد و حداکثر ۳ دستگاه هم‌مدل، مدلی با مازاد معقول پیدا نشد. مبرد دیگری انتخاب کنید یا ورودی‌ها را تغییر دهید.";
});

/* ---------- خلاصه قابل کپی ---------- */
const copied = ref(false);
const copySummary = async () => {
  const lines = [
    `ظرفیت موردنیاز چیلر: ${fa(calc.value.req, 0)} kW (${fa(calc.value.req / TR, 1)} تن تبرید)`,
    `دمای هوای طراحی: ${fa(ambient.value)}°C`,
    "",
    "مدل‌های پیشنهادی:",
    ...picks.value.map(
      (p) =>
        `• ${p.n > 1 ? fa(p.n) + "× " : ""}${p.m.id} (${p.v.ref}) — ظرفیت کل ${fa(p.total, 0)} kW`,
    ),
    "",
    "دمآسا انرژی",
  ];
  try {
    await navigator.clipboard.writeText(lines.join("\n"));
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    /* کلیپ‌بورد در دسترس نیست */
  }
};

/* ---------- نوار پایین موبایل: فقط وقتی نتیجه دیده نمی‌شود ---------- */
const resVisible = ref(false);
let io = null;
watch(resEl, (el) => {
  io?.disconnect();
  resVisible.value = false;
  if (el && "IntersectionObserver" in window) {
    io = new IntersectionObserver(
      ([e]) => (resVisible.value = e.isIntersecting),
    );
    io.observe(el);
  }
});
const showDock = computed(() => !calc.value.errors.length && !resVisible.value);

/* ---------- ذخیره/بازیابی ---------- */
onMounted(() => {
  window.addEventListener("hashchange", onHash);
  try {
    Object.assign(
      f,
      defaults(),
      JSON.parse(localStorage.getItem(LS_KEY) || "{}"),
    );
    const s = localStorage.getItem(LS_SNOW);
    if (s !== null) snowOn.value = s === "1" && !reduceMotion;
  } catch {
    /* ناخوانا */
  }
});
onBeforeUnmount(() => {
  window.removeEventListener("hashchange", onHash);
  cancelAnimationFrame(raf);
  io?.disconnect();
});
watch(
  f,
  () => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(f));
    } catch {
      /* ذخیره ممکن نیست */
    }
  },
  { deep: true },
);
watch(snowOn, (v) => {
  try {
    localStorage.setItem(LS_SNOW, v ? "1" : "0");
  } catch {
    /* ذخیره ممکن نیست */
  }
});
watch(
  () => [
    f.mode,
    f.ref,
    f.area,
    f.type,
    f.fresh,
    f.safety,
    f.ambient,
    f.manual,
    f.unit,
  ],
  () => {
    openId.value = "auto";
  },
);
</script>

<style>
/* مخفی کردن اسکرول‌بار در همه‌ی بخش‌ها (اسکرول همچنان کار می‌کند) */
html,
body,
* {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE / Edge قدیمی */
}
*::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
  width: 0;
  height: 0;
}

/* فونت‌ها: فایل‌ها داخل public/fonts/woff2 و public/fonts/woff قرار می‌گیرند */
@font-face {
  font-family: "KalamehWeb";
  src:
    url("/fonts/woff2/KalamehWeb(FaNum)-Thin.woff2") format("woff2"),
    url("/fonts/woff/KalamehWeb(FaNum)-Thin.woff") format("woff");
  font-weight: 100;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "KalamehWeb";
  src:
    url("/fonts/woff2/KalamehWeb(FaNum)-Regular.woff2") format("woff2"),
    url("/fonts/woff/KalamehWeb(FaNum)-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "KalamehWeb";
  src:
    url("/fonts/woff2/KalamehWeb(FaNum)-Bold.woff2") format("woff2"),
    url("/fonts/woff/KalamehWeb(FaNum)-Bold.woff") format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "KalamehWeb";
  src:
    url("/fonts/woff2/KalamehWeb(FaNum)-Black.woff2") format("woff2"),
    url("/fonts/woff/KalamehWeb(FaNum)-Black.woff") format("woff");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "ravi";
  src:
    url("/fonts/woff2/RaviFaNum-Light.woff2") format("woff2"),
    url("/fonts/woff/RaviFaNum-Light.woff") format("woff");
  font-weight: 100;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "ravi";
  src:
    url("/fonts/woff2/RaviFaNum-Regular.woff2") format("woff2"),
    url("/fonts/woff/RaviFaNum-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "ravi";
  src:
    url("/fonts/woff2/RaviFaNum-Bold.woff2") format("woff2"),
    url("/fonts/woff/RaviFaNum-Bold.woff") format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "ravi";
  src:
    url("/fonts/woff2/RaviFaNum-ExtraBlack.woff2") format("woff2"),
    url("/fonts/woff/RaviFaNum-ExtraBlack.woff") format("woff");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}
</style>

<style scoped>
/* =========================================================
   توکن‌ها
   ========================================================= */
.app {
  --ink: #1c2b2c;
  --deep: #0f5e5d;
  --teal: #14aba5;
  --teal-d: #137b7a; /* کنتراست بهتر روی سفید */
  --mint: #ddf1ef;
  --red: #ed1f25;
  --red-d: #c4181d;
  --paper: #f3f9f8;
  --line: #d3e6e4;
  --mut: #4b6061; /* کنتراست بهتر برای متن کم‌رنگ */
  --warn-bg: #fff4e5;
  --warn-ink: #7a3f06;
  --head: "ravi", "KalamehWeb", Tahoma, sans-serif;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --tap: 44px; /* حداقل اندازه لمسی */

  font-family: "KalamehWeb", Tahoma, sans-serif;
  font-size: 17px;
  color: var(--ink);
  line-height: 1.8;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  isolation: isolate;
  background:
    radial-gradient(
      900px 380px at 85% -80px,
      rgba(20, 171, 165, 0.18),
      transparent
    ),
    var(--paper);
}
.app * {
  box-sizing: border-box;
}
button {
  font: inherit;
  color: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
button:disabled {
  cursor: not-allowed;
}
:is(button, input, summary, a):focus-visible {
  outline: 3px solid #0c8d88;
  outline-offset: 2px;
}
main:focus {
  outline: none;
}
.skip {
  position: absolute;
  top: -60px;
  right: 12px;
  z-index: 100;
  background: var(--deep);
  color: #fff;
  padding: 8px 16px;
  border-radius: 10px;
}
.skip:focus {
  top: 8px;
}

.wrap {
  width: 100%;
  margin-inline: auto;
  padding-inline: clamp(16px, 3.2vw, 56px);
}
.page {
  padding: clamp(28px, 4vw, 60px) 0 110px;
}
h1 {
  font-family: var(--head);
  font-size: clamp(26px, 2.7vw, 44px);
  line-height: 1.45;
  font-weight: 700;
  margin: 0 0 10px;
  color: var(--deep);
}
h2 {
  font-family: var(--head);
  font-size: clamp(20px, 1.6vw, 26px);
  margin: 0;
}
.lead {
  color: var(--mut);
  margin: 0 0 28px;
  font-size: clamp(16px, 1.15vw, 19px);
  max-width: 62ch;
}
.ltr {
  direction: ltr;
  display: inline-block;
}

/* =========================================================
   هدر
   ========================================================= */
.top {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}
.top::after {
  content: "";
  position: absolute;
  inset: auto 0 0 0;
  height: 4px;
  background: linear-gradient(270deg, var(--red) 0 14%, var(--teal) 14% 100%);
}
.top-in {
  display: flex;
  align-items: center;
  gap: 12px 20px;
  min-height: 76px;
  padding-block: 12px;
  flex-wrap: wrap;
}
.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  background: none;
  border: 0;
  text-align: right;
  padding: 4px 0;
  margin-inline-end: auto;
}
.logo-img {
  height: 52px;
  width: auto;
  display: block;
}
.logo {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 20px;
  background: var(--teal);
  color: #fff;
}
.tagline {
  font-size: 13px;
  color: var(--mut);
  padding-right: 14px;
  border-right: 1px solid var(--line);
  line-height: 1.4;
}
.crumbs ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  font-size: 15px;
  color: var(--mut);
}
.crumbs li {
  display: flex;
  align-items: center;
  gap: 4px;
}
.crumbs button {
  background: none;
  border: 0;
  padding: 6px 8px;
  min-height: 36px;
  border-radius: 8px;
  color: var(--teal-d);
}
.crumbs button:hover {
  background: var(--mint);
}
.crumbs [aria-current] {
  font-weight: 700;
  color: var(--ink);
  padding: 6px 8px;
}
.crumbs i {
  opacity: 0.5;
  font-style: normal;
}
.snow-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 99px;
  border: 1.5px solid var(--line);
  background: #fff;
  font-size: 14px;
  color: var(--mut);
}
.snow-btn[aria-pressed="true"] {
  background: var(--mint);
  border-color: var(--teal);
  color: var(--deep);
}

/* =========================================================
   برف (کم‌هزینه و غیرمزاحم)
   ========================================================= */
.snow-layer {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 30;
  contain: strict;
}
.snowflake {
  position: absolute;
  top: -8vh;
  color: #70cbd8;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.9);
  animation: snowfall linear infinite;
  will-change: transform;
  user-select: none;
}
@keyframes snowfall {
  0% {
    transform: translate3d(0, -8vh, 0) rotate(0);
  }
  50% {
    transform: translate3d(var(--drift, 0), 52vh, 0) rotate(180deg);
  }
  100% {
    transform: translate3d(0, 112vh, 0) rotate(360deg);
  }
}

/* =========================================================
   دکمه‌ها و اجزای مشترک
   ========================================================= */
.cta {
  position: relative;
  min-height: 52px;
  padding: 12px 30px;
  background: var(--red);
  color: #fff;
  border: 0;
  border-radius: 14px;
  font-weight: 800;
  font-size: 17px;
  box-shadow: 0 6px 18px rgba(237, 31, 37, 0.25);
  transition:
    transform 0.2s var(--ease),
    box-shadow 0.2s var(--ease);
}
.cta.big {
  min-height: 60px;
  padding-inline: 44px;
  font-size: 19px;
}
.ghost {
  min-height: 40px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1.5px solid var(--line);
  background: #fff;
  color: var(--teal-d);
  font-weight: 700;
  font-size: 15px;
  transition:
    background 0.2s,
    border-color 0.2s;
}
.ghost.wide {
  width: 100%;
  min-height: 48px;
  margin-top: 4px;
}
.ghost:hover {
  background: var(--mint);
  border-color: var(--teal);
}
.pill {
  display: inline-block;
  font-size: 13px;
  padding: 1px 12px;
  border-radius: 99px;
  background: #e6efee;
  color: var(--mut);
  white-space: nowrap;
}
.pill.ref {
  background: #ffeded;
  color: var(--red-d);
}
button:not(:disabled):active {
  transform: scale(0.98);
}

/* =========================================================
   جابه‌جایی صفحه و ورود اولیه (یک لحظه هماهنگ)
   ========================================================= */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s var(--ease);
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
}
.gcard,
.item,
.prod {
  animation: arrive 0.45s var(--ease) backwards;
  animation-delay: calc(var(--i, 0) * 45ms);
}
@keyframes arrive {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* =========================================================
   ۱. گروه‌ها
   ========================================================= */
.ggrid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(14px, 1.5vw, 24px);
}
.gcard {
  --c1: #14aba5;
  --c2: #0f5e5d;
  --ring: rgba(20, 171, 165, 0.5);
  --glow: rgba(15, 94, 93, 0.28);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  text-align: right;
  min-height: 190px;
  padding: clamp(20px, 2vw, 28px);
  color: #fff;
  border: 0;
  border-radius: 24px;
  background: linear-gradient(170deg, var(--c1), var(--c2));
  box-shadow:
    0 12px 30px var(--glow),
    0 0 0 0 var(--ring);
  animation:
    arrive 0.45s var(--ease) backwards,
    ring 3.4s ease-out infinite;
  animation-delay: calc(var(--i, 0) * 45ms), calc(var(--i, 0) * 450ms);
  transition: transform 0.25s var(--ease);
}
@keyframes ring {
  0% {
    box-shadow:
      0 12px 30px var(--glow),
      0 0 0 0 var(--ring);
  }
  70%,
  100% {
    box-shadow:
      0 12px 30px var(--glow),
      0 0 0 20px transparent;
  }
}
.gcard.live {
  grid-column: span 2;
  grid-row: span 2;
  min-height: 300px;
}
.gcard.off {
  cursor: not-allowed;
}
.gcard > .gicon,
.gcard > b,
.gcard > small {
  position: relative;
  z-index: 1;
}
.gcard b {
  font-family: var(--head);
  font-size: clamp(19px, 1.5vw, 23px);
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
}
.gcard.live b {
  font-size: clamp(28px, 2.2vw, 38px);
}
.gcard small {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
}
.gcard.live small {
  font-size: 16px;
}
.gicon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  margin-bottom: auto;
}
.gicon :deep(svg) {
  width: 32px;
  height: 32px;
}
.gcard.live .gicon {
  width: 68px;
  height: 68px;
}
.badge {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;
  background: var(--red);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 2px 14px;
  border-radius: 99px;
}

/* ---- پوسته هر گروه ---- */
.g-cool {
  --c1: #14aba5;
  --c2: #0f5e5d;
  --ring: rgba(20, 171, 165, 0.55);
  --glow: rgba(15, 94, 93, 0.3);
}
.g-heat {
  --c1: #ff9a3c;
  --c2: #c92a1a;
  --ring: rgba(240, 83, 42, 0.5);
  --glow: rgba(201, 42, 26, 0.3);
}
.g-pool {
  --c1: #3cc9f5;
  --c2: #0a4a96;
  --ring: rgba(11, 107, 194, 0.5);
  --glow: rgba(10, 74, 150, 0.3);
}
.g-floor {
  --c1: #f5b45f;
  --c2: #8f4318;
  --ring: rgba(217, 116, 44, 0.5);
  --glow: rgba(143, 67, 24, 0.3);
}
.g-pump {
  --c1: #7f8cf2;
  --c2: #25237a;
  --ring: rgba(74, 63, 192, 0.5);
  --glow: rgba(37, 35, 122, 0.3);
}

/* لایه جلوه‌ها */
.fx {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  border-radius: inherit;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* سرمایشی: برف ریز + درخشش یخی */
.g-cool .fx {
  background: radial-gradient(
    circle at 85% 0%,
    rgba(255, 255, 255, 0.28),
    transparent 45%
  );
}
.g-cool .gicon :deep(svg) {
  animation: spin 22s linear infinite;
}
.fl {
  position: absolute;
  top: -12%;
  font-style: normal;
  color: #fff;
  opacity: 0.5;
  animation: flake-fall linear infinite;
}
.f1 {
  left: 12%;
  font-size: 18px;
  animation-duration: 9s;
}
.f2 {
  left: 48%;
  font-size: 26px;
  animation-duration: 12s;
  animation-delay: -4s;
}
.f3 {
  left: 78%;
  font-size: 14px;
  animation-duration: 8s;
  animation-delay: -2s;
}
@keyframes flake-fall {
  0% {
    transform: translate(0, 0) rotate(0);
  }
  50% {
    transform: translate(18px, 170px) rotate(180deg);
  }
  100% {
    transform: translate(-6px, 360px) rotate(360deg);
  }
}

/* گرمایشی: حباب‌های گرما که بالا می‌روند + سوسوی شعله */
.g-heat .fx {
  background: radial-gradient(
    120% 60% at 50% 115%,
    rgba(255, 214, 120, 0.5),
    transparent 60%
  );
  animation: glow-pulse 2.6s ease-in-out infinite alternate;
}
.g-heat .gicon :deep(svg) {
  transform-origin: 50% 100%;
  animation: flicker 1.5s ease-in-out infinite;
}
.hb {
  position: absolute;
  bottom: -40px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 225, 140, 0.6),
    transparent 70%
  );
  filter: blur(6px);
  opacity: 0;
  animation: rise 5.5s ease-in infinite;
}
.h1 {
  left: 8%;
}
.h2 {
  left: 42%;
  width: 100px;
  height: 100px;
  animation-duration: 6.5s;
  animation-delay: -2s;
}
.h3 {
  left: 70%;
  animation-duration: 5s;
  animation-delay: -4s;
}
@keyframes rise {
  0% {
    transform: translateY(0) scale(0.7);
    opacity: 0;
  }
  25% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-200px) scale(1.5);
    opacity: 0;
  }
}
@keyframes glow-pulse {
  from {
    opacity: 0.7;
  }
  to {
    opacity: 1;
  }
}
@keyframes flicker {
  0%,
  100% {
    transform: scaleY(1) rotate(0);
  }
  30% {
    transform: scaleY(1.08) rotate(-2deg);
  }
  60% {
    transform: scaleY(0.95) rotate(2deg);
  }
}

/* استخر: موج‌های آب + شناور بودن آیکون */
.g-pool .gicon :deep(svg) {
  animation: bob 3.2s ease-in-out infinite;
}
.wave {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 200%;
  height: 46px;
  fill: rgba(255, 255, 255, 0.16);
  animation: wave 7s linear infinite;
}
.wave.w2 {
  bottom: -6px;
  height: 40px;
  fill: rgba(255, 255, 255, 0.12);
  animation-duration: 11s;
  animation-direction: reverse;
}
@keyframes wave {
  to {
    transform: translateX(-50%);
  }
}
@keyframes bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* گرمایش از کف: خطوط گرمای صعودی + لوله روشن کف */
.heatlines {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 70%;
  opacity: 0.55;
}
.heatlines path {
  fill: none;
  stroke: #fff;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 6 12;
  vector-effect: non-scaling-stroke;
  animation: dash-up 3s linear infinite;
}
.heatlines .d2 {
  animation-duration: 3.8s;
  animation-delay: -1s;
}
.heatlines .d3 {
  animation-duration: 2.6s;
  animation-delay: -2s;
}
.g-floor .fx::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 8px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 236, 190, 0.9),
    transparent
  );
  box-shadow: 0 0 24px 6px rgba(255, 200, 120, 0.55);
  animation: glow-pulse 2.2s ease-in-out infinite alternate;
}
@keyframes dash-up {
  to {
    stroke-dashoffset: -72;
  }
}

/* پمپ: پروانه چرخان + جریان آب در لوله */
.g-pump .gicon :deep(svg) {
  animation: spin 5s linear infinite;
}
.impeller {
  position: absolute;
  left: -30px;
  bottom: -30px;
  width: 130px;
  height: 130px;
  opacity: 0.2;
  animation: spin 6s linear infinite;
}
.flow {
  position: absolute;
  left: 0;
  top: 55%;
  width: 100%;
  height: 6px;
  opacity: 0.5;
}
.flow line {
  stroke: #fff;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 1 14;
  vector-effect: non-scaling-stroke;
  animation: dash-flow 1.4s linear infinite;
}
@keyframes dash-flow {
  to {
    stroke-dashoffset: -30;
  }
}

/* =========================================================
   ۲. زیرشاخه‌ها
   ========================================================= */
.items {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  min-height: 112px;
  text-align: right;
  background: #fff;
  border: 1.5px dashed #b5d0cd;
  border-radius: 18px;
  padding: 20px 22px;
  font-weight: 500;
}
.item.off {
  opacity: 0.65;
  color: var(--mut);
}
.item .soon {
  font-size: 13px;
}
.item.live {
  grid-column: 1 / -1;
  flex-direction: row;
  align-items: center;
  background: linear-gradient(120deg, var(--teal), var(--deep));
  color: #fff;
  border: 0;
  font-size: clamp(21px, 1.8vw, 28px);
  font-weight: 800;
  padding: 28px 32px;
  box-shadow: 0 14px 36px rgba(15, 94, 93, 0.22);
  transition:
    transform 0.25s var(--ease),
    box-shadow 0.25s var(--ease);
}
.item.live em {
  font-style: normal;
  font-size: 14px;
  background: var(--red);
  padding: 2px 16px;
  border-radius: 99px;
  font-weight: 700;
  white-space: nowrap;
}

/* =========================================================
   ۳. محصولات
   ========================================================= */
.phead {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px 24px;
  flex-wrap: wrap;
}
.phead .lead {
  margin-bottom: 20px;
}
.phead .cta {
  margin-bottom: 20px;
}
.tabs {
  display: flex;
  gap: 10px;
  margin: 8px 0 22px;
  flex-wrap: wrap;
}
.tabs button {
  position: relative;
  flex: 1 1 220px;
  min-height: 52px;
  padding: 10px 22px;
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 14px;
  font-weight: 700;
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s;
}
.tabs button small {
  margin-right: 8px;
  color: var(--mut);
  font-weight: 400;
  font-size: 13px;
}
.tabs button.on {
  background: var(--deep);
  border-color: var(--deep);
  color: #fff;
}
.tabs button.on small {
  color: #b7e8e5;
}
.pgrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
  gap: 18px;
  align-items: start;
}
.prod {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: clamp(20px, 1.8vw, 28px);
}
.prow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.pname {
  font-family: var(--head);
  font-size: 26px;
  font-weight: 800;
  color: var(--deep);
}
.range-line {
  margin: 10px 0 8px;
}
.range-line b {
  font-family: var(--head);
  font-size: clamp(28px, 2.2vw, 36px);
  color: var(--teal-d);
  font-weight: 800;
}
.range-line span {
  font-size: 14px;
  color: var(--mut);
  margin-right: 8px;
}
.refline {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
dl {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 18px;
  margin: 0;
}
dt {
  font-size: 13px;
  color: var(--mut);
}
dd {
  margin: 0;
  font-weight: 700;
  font-size: 15px;
  overflow-wrap: anywhere;
}
.lnk {
  background: none;
  border: 0;
  color: var(--teal-d);
  font-weight: 700;
  min-height: var(--tap);
  padding: 8px 0 0;
  font-size: 15px;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.tw {
  overflow-x: auto;
  margin-top: 10px;
  border: 1px solid var(--line);
  border-radius: 12px;
}
table {
  border-collapse: collapse;
  width: 100%;
  font-size: 14px;
  text-align: center;
  min-width: 620px;
}
th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--line);
  white-space: nowrap;
}
thead th {
  color: var(--mut);
  font-weight: 500;
  background: #f5fbfa;
}
tbody tr:last-child > * {
  border-bottom: 0;
}
tbody th {
  color: var(--red-d);
  position: sticky;
  right: 0;
  background: #fff;
}
.fine {
  font-size: 13px;
  color: var(--mut);
  margin: 0;
  padding: 10px 12px;
  line-height: 1.9;
  white-space: normal;
}
.bottom-cta {
  text-align: center;
  margin-top: 40px;
}

/* =========================================================
   ۴. محاسبه
   ========================================================= */
.calc {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(400px, 0.95fr);
  gap: clamp(24px, 3vw, 52px);
  align-items: start;
}
.ihead {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.ihead .ghost {
  flex: 0 0 auto;
  margin-top: 8px;
}
.seg {
  display: flex;
  background: #e0eeec;
  border-radius: 16px;
  padding: 5px;
  margin-bottom: 18px;
}
.seg button {
  flex: 1;
  min-height: 48px;
  border: 0;
  background: none;
  border-radius: 12px;
  padding: 8px 10px;
  font-weight: 700;
  font-size: 16px;
  color: var(--mut);
  transition:
    background 0.2s,
    color 0.2s,
    box-shadow 0.2s;
}
.seg button.on {
  background: #fff;
  color: var(--deep);
  box-shadow: 0 2px 8px rgba(15, 94, 93, 0.15);
}
.blk {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: clamp(18px, 1.8vw, 28px);
  margin-bottom: 16px;
}
.bh {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.bh b {
  font-size: clamp(17px, 1.25vw, 20px);
}
.q {
  flex: 0 0 auto;
  width: var(--tap);
  height: var(--tap);
  margin: -6px;
  border: 0;
  background: none;
  display: grid;
  place-items: center;
  position: relative;
  font-weight: 700;
  font-size: 15px;
  color: var(--teal-d);
}
.q::before {
  content: "";
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: #f2f9f8;
  z-index: -1;
}
.q[aria-expanded="true"] {
  color: #fff;
}
.q[aria-expanded="true"]::before {
  background: var(--teal-d);
  border-color: var(--teal-d);
}
.tip {
  font-size: 15px;
  line-height: 1.9;
  color: #1f4747;
  background: var(--mint);
  border-radius: 12px;
  padding: 10px 14px;
  margin: 0 0 14px;
}
.chips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}
.chips button {
  min-height: 72px;
  padding: 10px 8px;
  background: #f5fbfa;
  border: 1.5px solid var(--line);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1.5;
  font-size: 16px;
  transition:
    border-color 0.15s,
    background 0.15s,
    color 0.15s;
}
.chips button small {
  font-size: 13px;
  color: var(--mut);
}
.chips button:hover {
  border-color: var(--teal);
}
.chips button.on {
  background: linear-gradient(135deg, var(--teal-d), var(--deep));
  border-color: transparent;
  color: #fff;
}
.chips button.on small {
  color: #dcf6f4;
}
.cust {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-top: 14px;
}
.cust input {
  width: 160px;
  max-width: 100%;
  font: inherit;
  font-size: 22px;
  font-weight: 800;
  border: 0;
  border-bottom: 2px solid var(--teal);
  background: var(--mint);
  border-radius: 8px 8px 0 0;
  padding: 6px 12px;
  color: var(--ink);
  transition:
    box-shadow 0.2s,
    border-color 0.2s;
}
.cust input:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(20, 171, 165, 0.18);
}
.cust.bad input {
  border-bottom-color: var(--red);
  background: #fff0f0;
}
.cust.big {
  margin: 0 0 8px;
}
.cust.big input {
  font-size: clamp(32px, 3vw, 42px);
  width: min(230px, 65%);
  background: none;
  border-bottom-color: var(--line);
}
.cust.big input:focus {
  border-color: var(--teal);
  box-shadow: none;
}
.cust.big.bad input {
  border-bottom-color: var(--red);
}
.cust span {
  color: var(--mut);
  font-size: 15px;
}
.field-err {
  margin: 6px 0 0;
  font-size: 14px;
  color: var(--red-d);
}
.slider {
  width: 100%;
  height: 36px;
  accent-color: var(--teal-d);
  cursor: grab;
}
.slider:active {
  cursor: grabbing;
}
.ticks {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--mut);
}

/* نتیجه */
.result {
  position: sticky;
  top: 92px;
  min-width: 0;
  max-height: calc(100vh - 108px);
  max-height: calc(100dvh - 108px);
  overflow-y: auto;
  padding: 4px 4px 12px;
  margin: -4px;
  scrollbar-width: none;
}
.gauge {
  background: linear-gradient(135deg, var(--deep), #1a8887);
  color: #fff;
  border-radius: 26px;
  padding: clamp(24px, 2.5vw, 38px);
  margin-bottom: 20px;
}
.gauge small {
  font-size: 16px;
  opacity: 0.85;
}
.figure {
  justify-content: center;
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 6px 0 4px;
}
.figure b {
  font-family: var(--head);
  font-size: clamp(54px, 5vw, 76px);
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -1px;
  font-variant-numeric: tabular-nums;
}
.figure span {
  font-size: 24px;
  color: #7ee8e3;
}
.units {
  justify-content: center;
  display: flex;
  gap: 8px 22px;
  flex-wrap: wrap;
  font-size: 16px;
  color: #d3f1ef;
}
.gauge.bad {
  background: #7a1c1f;
}
.gauge ul {
  margin: 10px 0 0;
  padding-right: 20px;
}
.rhead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.refs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.refs button {
  min-height: 40px;
  padding: 0 14px;
  border: 1.5px solid var(--line);
  background: #fff;
  border-radius: 99px;
  font-size: 14px;
  transition:
    background 0.15s,
    border-color 0.15s;
}
.refs button:hover {
  border-color: var(--teal);
}
.refs button.on {
  background: var(--deep);
  color: #fff;
  border-color: var(--deep);
}
.warn {
  font-size: 14px;
  line-height: 1.9;
  color: var(--warn-ink);
  background: var(--warn-bg);
  border-radius: 12px;
  padding: 10px 14px;
  margin: 0 0 14px;
}
.empty {
  background: #fff;
  border: 1.5px dashed var(--line);
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 14px;
}
.empty p {
  margin: 0 0 12px;
  color: var(--mut);
  font-size: 15px;
}
.pick {
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 18px;
  margin-bottom: 12px;
  overflow: hidden;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.pick.first {
  border-color: var(--teal);
  box-shadow: 0 6px 18px rgba(20, 171, 165, 0.16);
}
.pk {
  width: 100%;
  background: none;
  border: 0;
  text-align: right;
  padding: 18px 20px 16px;
}
.pt {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.pt b {
  font-size: 19px;
  margin-left: auto;
}
.chev {
  order: -1;
  width: 20px;
  text-align: center;
  color: var(--mut);
  transition: transform 0.25s var(--ease);
}
.pk[aria-expanded="true"] .chev {
  transform: rotate(180deg);
}
.tag {
  font-size: 13px;
  padding: 1px 12px;
  border-radius: 99px;
}
.tag.ok {
  background: #d4f0e0;
  color: #14633a;
}
.tag.mid {
  background: var(--mint);
  color: var(--teal-d);
}
.tag.hi {
  background: #fff0de;
  color: #8a4707;
}
.bar {
  position: relative;
  height: 12px;
  background: #e1eeec;
  border-radius: 99px;
  overflow: hidden;
}
.fill {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(270deg, var(--teal), #4fd1cb);
  border-radius: 99px;
  transition: width 0.35s ease;
}
.mark {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 62.5%; /* 1 ÷ 1.6 */
  width: 3px;
  background: var(--red);
}
.pm {
  display: flex;
  justify-content: space-between;
  gap: 4px 12px;
  flex-wrap: wrap;
  font-size: 14px;
  color: var(--mut);
  margin-top: 8px;
}
.pick dl {
  padding: 16px 20px 18px;
  border-top: 1px solid var(--line);
}
.how {
  margin-top: 16px;
  color: var(--mut);
  font-size: 15px;
}
.how summary {
  cursor: pointer;
  min-height: var(--tap);
  display: flex;
  align-items: center;
}
.how ol {
  padding-right: 22px;
  color: #1f4747;
}
.foot {
  padding-block: 24px;
  font-size: 14px;
  line-height: 1.9;
  color: var(--mut);
  border-top: 1px solid var(--line);
}

/* نوار پایین (فقط موبایل/تبلت) */
.dock {
  display: none;
}
.dock-enter-active,
.dock-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s var(--ease);
}
.dock-enter-from,
.dock-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

/* hover فقط روی دستگاه‌هایی که واقعاً hover دارند */
@media (hover: hover) {
  .gcard.live:hover,
  .item.live:hover,
  .cta:hover {
    transform: translateY(-3px);
  }
  .gcard:not(.off):not(.live):hover {
    box-shadow: 0 10px 28px rgba(15, 94, 93, 0.1);
  }
  .prod:hover {
    box-shadow: 0 14px 36px rgba(15, 94, 93, 0.1);
  }
  .tabs button:not(.on):hover {
    border-color: var(--teal);
  }
}

/* =========================================================
   ریسپانسیو
   ========================================================= */
@media (min-width: 1600px) {
  .app {
    font-size: 18px;
  }
  .calc {
    grid-template-columns: minmax(0, 1.1fr) minmax(500px, 0.9fr);
  }
}
@media (max-width: 1100px) {
  .ggrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .gcard.live {
    grid-column: span 2;
    grid-row: auto;
    min-height: 230px;
  }
  .calc {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.95fr);
    gap: 22px;
  }
}
@media (max-width: 900px) {
  .calc {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }
  .result {
    position: static;
    max-height: none;
    overflow: visible;
    padding: 0;
    margin: 0;
    margin-top: 12px;
  }
  .items {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .dock {
    position: fixed;
    z-index: 35;
    bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    right: 12px;
    left: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 52px;
    background: var(--deep);
    color: #fff;
    border: 0;
    border-radius: 16px;
    padding: 10px 18px;
    box-shadow: 0 12px 32px rgba(15, 94, 93, 0.35);
    font-size: 15px;
  }
  .dock b {
    color: #7ee8e3;
    font-size: 18px;
  }
}
@media (max-width: 640px) {
  .tagline,
  .snow-txt {
    display: none;
  }
  .top-in {
    min-height: 64px;
    gap: 6px 12px;
  }
  .logo-img {
    height: 42px;
    max-width: 125px;
  }
  .crumbs {
    order: 3;
    width: 100%;
    overflow-x: auto;
  }
  .crumbs ol {
    flex-wrap: nowrap;
    white-space: nowrap;
  }
  .ggrid,
  .items {
    grid-template-columns: minmax(0, 1fr);
  }
  .gcard,
  .gcard.live {
    grid-column: auto;
    min-height: 140px;
    padding: 20px;
  }
  .gcard.live {
    min-height: 190px;
  }
  .item,
  .item.live {
    grid-column: auto;
    min-height: 84px;
    padding: 16px;
  }
  .item.live {
    flex-direction: column;
    align-items: flex-start;
    font-size: 20px;
  }
  .phead {
    align-items: stretch;
  }
  .phead .cta {
    width: 100%;
  }
  .tabs button {
    flex-basis: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: right;
  }
  .ihead .ghost {
    margin-top: 4px;
  }
  .chips {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .seg button {
    font-size: 14px;
  }
  .rhead {
    flex-direction: column;
    align-items: flex-start;
  }
  .refs {
    width: 100%;
  }
  .refs button {
    flex: 1 1 auto;
  }
  .pk {
    padding: 16px;
  }
  .pt b {
    font-size: 18px;
  }
  .pick dl {
    padding: 14px 16px;
  }
  .cta.big {
    width: 100%;
    padding-inline: 16px;
  }
}

/* =========================================================
   کاهش حرکت
   ========================================================= */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .snow-layer {
    display: none;
  }
}
</style>
