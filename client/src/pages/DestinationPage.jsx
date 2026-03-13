import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, ArrowLeft, Shield, TrendingUp, Sparkles,
  Landmark, Leaf, UtensilsCrossed, Zap, Sun, Snowflake,
  Wind, Cloud, ArrowRight, Coffee, Bed, Utensils
} from 'lucide-react';
import API from '../api/axios';

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLE_ID = 'dpx3-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    .dpx{background:#050f1c;color:#eaf2fb;min-height:100vh;overflow-x:hidden;font-family:'Inter',system-ui,sans-serif;}

    /* HERO */
    .dpx-hero-wrap{position:relative;width:100%;height:100vh;}
    .dpx-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:transform;transform-origin:center center;}
    .dpx-overlay-base{position:absolute;inset:0;background:linear-gradient(175deg,rgba(5,15,28,.15) 0%,rgba(5,15,28,.1) 30%,rgba(5,15,28,.6) 65%,rgba(5,15,28,.98) 100%);pointer-events:none;}
    .dpx-overlay-text-scrim{position:absolute;bottom:0;left:0;right:0;height:72%;background:radial-gradient(ellipse 90% 70% at 50% 100%,rgba(5,15,28,.95) 0%,rgba(5,15,28,.55) 55%,transparent 100%);pointer-events:none;}
    .dpx-hero-text{position:absolute;bottom:7%;left:0;right:0;display:flex;flex-direction:column;align-items:center;pointer-events:none;}
    .dpx-continent-label{font-size:clamp(.65rem,1.2vw,.875rem);font-weight:700;letter-spacing:.34em;text-transform:uppercase;color:#67e8f9;text-shadow:0 0 20px rgba(5,15,28,1),0 2px 8px rgba(5,15,28,1);margin-bottom:.75rem;opacity:0;transform:translateY(16px);transition:opacity .9s ease,transform .9s ease;}
    .dpx-city-name{font-size:clamp(4.5rem,15vw,13rem);font-weight:900;letter-spacing:-.04em;line-height:.88;text-align:center;text-transform:uppercase;color:#fff;text-shadow:0 0 80px rgba(5,15,28,1),0 0 40px rgba(5,15,28,.95),0 4px 24px rgba(5,15,28,.9),0 2px 4px rgba(5,15,28,1);opacity:0;transform:translateY(60px) scale(.92);transition:opacity 1.1s cubic-bezier(.16,1,.3,1),transform 1.1s cubic-bezier(.16,1,.3,1);will-change:transform,opacity;}
    .dpx-badges{display:flex;gap:.65rem;flex-wrap:wrap;justify-content:center;margin-top:1.25rem;opacity:0;transform:translateY(20px);transition:opacity .8s ease .45s,transform .8s ease .45s;}
    .dpx-badge{display:inline-flex;align-items:center;gap:5px;padding:5px 13px;border-radius:9999px;font-size:11px;font-weight:700;backdrop-filter:blur(16px);box-shadow:0 2px 12px rgba(5,15,28,.6);}
    .dpx-scroll-hint{position:absolute;bottom:2.5%;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:7px;opacity:0;transition:opacity 1s ease .9s;pointer-events:none;}
    .dpx-scroll-hint span{font-size:9px;letter-spacing:.25em;text-transform:uppercase;color:rgba(255,255,255,.5);text-shadow:0 1px 6px rgba(5,15,28,.8);}
    .dpx-scroll-bar{width:1px;height:38px;background:linear-gradient(to bottom,rgba(103,232,249,.7),transparent);animation:dpxBar 2.2s ease-in-out infinite;}
    @keyframes dpxBar{0%,100%{opacity:.35}50%{opacity:1}}

    /* BACK */
    .dpx-back{position:fixed;top:5.5rem;left:1.5rem;z-index:200;display:inline-flex;align-items:center;gap:7px;padding:8px 17px;border-radius:9999px;background:rgba(5,15,28,.8);border:1px solid rgba(103,232,249,.22);color:rgba(160,184,208,.9);font-size:12.5px;font-weight:500;cursor:pointer;backdrop-filter:blur(20px);transition:border-color .2s,color .2s;}
    .dpx-back:hover{border-color:rgba(103,232,249,.45);color:#eaf2fb;}

    /* BODY */
    .dpx-body{padding:0 clamp(1rem,6vw,7rem) 6rem;}

    /* STAT STRIP */
    .dpx-strip{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid rgba(56,189,248,.1);border-radius:1.25rem;overflow:hidden;margin-bottom:5rem;}
    .dpx-strip-cell{background:rgba(8,20,36,.85);padding:1.75rem 2rem;display:flex;flex-direction:column;gap:.35rem;}
    .dpx-strip-cell+.dpx-strip-cell{border-left:1px solid rgba(56,189,248,.08);}
    .dpx-strip-label{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:rgba(103,232,249,.55);}
    .dpx-strip-val{font-size:1.55rem;font-weight:800;letter-spacing:-.03em;color:#eaf2fb;line-height:1;}
    .dpx-strip-sub{font-size:11px;color:rgba(160,184,208,.45);}

    /* SECTION LABEL */
    .dpx-sec{display:flex;align-items:center;gap:10px;margin-bottom:1.75rem;}
    .dpx-sec span{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.22em;color:rgba(45,212,191,.8);flex-shrink:0;}
    .dpx-sec-line{height:1px;flex:1;background:linear-gradient(90deg,rgba(45,212,191,.22),transparent);}

    /* DESCRIPTION — frosted glass panel */
    .dpx-desc{margin-bottom:5rem;}
    .dpx-desc-panel{
      background:rgba(5,15,28,.75);
      border:1px solid rgba(103,232,249,.12);
      border-radius:1.25rem;
      padding:2.25rem 2.5rem;
      backdrop-filter:blur(24px);
      -webkit-backdrop-filter:blur(24px);
    }
    .dpx-accent{font-style:italic;background:linear-gradient(125deg,#67e8f9,#2dd4bf,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .dpx-desc-text{font-size:clamp(1.2rem,2.6vw,2.1rem);font-weight:700;line-height:1.4;letter-spacing:-.02em;color:#eaf2fb;margin:0;}

    /* HIGHLIGHTS — image cards */
    .dpx-hl-section{margin-bottom:5rem;}
    .dpx-hl-cards{display:flex;flex-direction:column;gap:1rem;}
    .dpx-hl-card{
      display:grid;grid-template-columns:1fr 220px;
      border:1px solid rgba(56,189,248,.08);border-radius:1.25rem;overflow:hidden;
      background:rgba(8,20,36,.65);
      transition:border-color .3s,transform .3s,background .3s;
      cursor:default;
    }
    .dpx-hl-card:hover{border-color:rgba(56,189,248,.22);transform:translateX(5px);background:rgba(10,26,48,.8);}
    .dpx-hl-left{display:grid;grid-template-columns:4px 1fr;gap:0;}
    .dpx-hl-stripe{flex-shrink:0;}
    .dpx-hl-body{padding:1.5rem 1.75rem;display:flex;flex-direction:column;gap:.6rem;}
    .dpx-hl-top{display:flex;align-items:center;gap:.875rem;}
    .dpx-hl-ico{width:38px;height:38px;border-radius:.625rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    .dpx-hl-name{font-size:1.1rem;font-weight:800;color:#eaf2fb;letter-spacing:-.02em;line-height:1.1;margin:0;transition:color .25s;}
    .dpx-hl-card:hover .dpx-hl-name{color:#67e8f9;}
    .dpx-hl-type-pill{display:inline-flex;align-items:center;gap:4px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;padding:3px 9px;border-radius:9999px;border:1px solid;margin-top:2px;width:fit-content;}
    .dpx-hl-desc-text{font-size:13.5px;color:rgba(160,184,208,.72);line-height:1.7;margin:0;}
    .dpx-hl-img-wrap{position:relative;overflow:hidden;min-height:160px;}
    .dpx-hl-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease;}
    .dpx-hl-card:hover .dpx-hl-img{transform:scale(1.06);}
    .dpx-hl-img-fade{position:absolute;inset:0;background:linear-gradient(to right,rgba(8,20,36,.7) 0%,transparent 35%);}
    .dpx-hl-index{position:absolute;bottom:.75rem;right:.875rem;font-size:2rem;font-weight:900;color:rgba(255,255,255,.12);letter-spacing:-.05em;line-height:1;font-variant-numeric:tabular-nums;}

    /* SEASON CARD STACK */
    .dpx-season-wrap{margin-bottom:5rem;}
    .dpx-season-stack{
      position:relative;
      height:340px;
      touch-action:pan-y;
      user-select:none;
    }
    .dpx-sc{
      position:absolute;inset:0;
      border-radius:1.5rem;overflow:hidden;
      cursor:grab;
      will-change:transform;
      transition:box-shadow .3s;
    }
    .dpx-sc:active{cursor:grabbing;}
    .dpx-sc-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
    .dpx-sc-overlay{position:absolute;inset:0;background:linear-gradient(170deg,rgba(5,15,28,.08) 0%,rgba(5,15,28,.72) 100%);}
    .dpx-sc-content{
      position:absolute;inset:0;
      display:flex;flex-direction:column;justify-content:flex-end;
      padding:2rem 2.25rem;
    }
    .dpx-sc-icon-ring{
      width:64px;height:64px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      border:2px solid;margin-bottom:1rem;
      backdrop-filter:blur(12px);
    }
    .dpx-sc-name{font-size:2.25rem;font-weight:900;letter-spacing:-.04em;line-height:1;text-transform:capitalize;margin-bottom:.4rem;}
    .dpx-sc-desc{font-size:12.5px;letter-spacing:.1em;text-transform:uppercase;opacity:.7;margin-bottom:.875rem;}
    .dpx-sc-pill{
      display:inline-flex;align-items:center;gap:6px;
      font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;
      padding:4px 14px;border-radius:9999px;border:1px solid;
      width:fit-content;
    }
    .dpx-season-hint{
      display:flex;align-items:center;justify-content:center;gap:.75rem;
      margin-top:1.25rem;
    }
    .dpx-season-hint span{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(160,184,208,.4);}
    .dpx-sdots{display:flex;gap:.5rem;}
    .dpx-sdot{width:6px;height:6px;border-radius:50%;background:rgba(56,189,248,.2);transition:background .3s,transform .3s;cursor:pointer;}
    .dpx-sdot.active{transform:scale(1.6);}

    /* COST SELECTOR */
    .dpx-cost-wrap{margin-bottom:5rem;}
    .dpx-cost-card{border:1px solid rgba(56,189,248,.1);border-radius:1.5rem;overflow:hidden;}
    .dpx-cost-tabs{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid rgba(56,189,248,.08);}
    .dpx-cost-tab{
      padding:1.125rem 1rem;text-align:center;cursor:pointer;
      border:none;background:rgba(8,20,36,.7);
      transition:background .25s,color .25s;
      display:flex;flex-direction:column;align-items:center;gap:.35rem;
    }
    .dpx-cost-tab+.dpx-cost-tab{border-left:1px solid rgba(56,189,248,.06);}
    .dpx-cost-tab.active{background:rgba(12,30,56,.9);}
    .dpx-cost-tab-label{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;opacity:.5;transition:opacity .25s,color .25s;}
    .dpx-cost-tab.active .dpx-cost-tab-label{opacity:1;}
    .dpx-cost-tab-price{font-size:1.4rem;font-weight:900;letter-spacing:-.03em;line-height:1;transition:color .25s;}
    .dpx-cost-tab-sub{font-size:10px;opacity:.4;}
    .dpx-cost-panel{padding:2rem 2.25rem;}
    .dpx-cost-row2{display:flex;align-items:center;gap:.875rem;padding:.875rem 0;border-bottom:1px solid rgba(56,189,248,.05);}
    .dpx-cost-row2:last-child{border-bottom:none;}
    .dpx-cost-ico{width:36px;height:36px;border-radius:.625rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    .dpx-cost-item-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;opacity:.45;margin:0;}
    .dpx-cost-item-val{font-size:14px;font-weight:600;color:#eaf2fb;margin:.1rem 0 0;}

    /* COMPASS */
    .dpx-compass-wrap{margin-bottom:5rem;}
    .dpx-compass-card{border:1px solid rgba(56,189,248,.1);border-radius:1.5rem;overflow:hidden;background:rgba(8,20,36,.65);padding:2.25rem;}
    .dpx-compass-inner{display:grid;grid-template-columns:1fr 200px;gap:2.5rem;align-items:center;}
    .dpx-compass-info{display:flex;flex-direction:column;gap:1rem;}
    .dpx-coord-row{display:flex;flex-direction:column;gap:.25rem;}
    .dpx-coord-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;color:rgba(103,232,249,.55);}
    .dpx-coord-val{font-family:monospace;font-size:1.35rem;font-weight:700;color:#eaf2fb;letter-spacing:-.01em;}
    .dpx-compass-svg-wrap{display:flex;flex-direction:column;align-items:center;gap:.75rem;}
    .dpx-compass-hint{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:rgba(160,184,208,.35);}

    /* VIBES MARQUEE */
    .dpx-vibes-section{margin-bottom:5rem;overflow:hidden;}
    .dpx-vibes-track-wrap{position:relative;overflow:hidden;mask-image:linear-gradient(90deg,transparent,black 7%,black 93%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,black 7%,black 93%,transparent);}
    .dpx-vibes-track{display:flex;gap:.875rem;width:max-content;animation:dpxTicker 30s linear infinite;}
    .dpx-vibes-track:hover{animation-play-state:paused;}
    @keyframes dpxTicker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    .dpx-vtag{display:inline-flex;align-items:center;font-size:12px;font-weight:600;white-space:nowrap;padding:7px 16px;border-radius:9999px;background:rgba(56,189,248,.06);border:1px solid rgba(56,189,248,.14);color:rgba(56,189,248,.85);flex-shrink:0;transition:background .2s;}
    .dpx-vtag:hover{background:rgba(56,189,248,.14);}
    .dpx-ktag{display:inline-flex;align-items:center;font-size:12px;white-space:nowrap;padding:7px 16px;border-radius:9999px;background:rgba(167,139,250,.05);border:1px solid rgba(167,139,250,.12);color:rgba(167,139,250,.75);flex-shrink:0;transition:background .2s;}
    .dpx-ktag:hover{background:rgba(167,139,250,.12);}

    /* CTA */
    .dpx-cta{padding:5rem 0 2rem;display:flex;flex-direction:column;align-items:center;text-align:center;gap:2rem;}
    .dpx-cta-title{font-size:clamp(2rem,5vw,3.5rem);font-weight:900;letter-spacing:-.04em;line-height:1.05;color:#eaf2fb;}
    .dpx-cta-btn{display:inline-flex;align-items:center;gap:10px;padding:15px 34px;border-radius:9999px;background:linear-gradient(135deg,rgba(56,189,248,.18),rgba(45,212,191,.12));border:1px solid rgba(56,189,248,.28);color:#67e8f9;font-size:15px;font-weight:700;cursor:pointer;letter-spacing:.02em;transition:all .3s;}
    .dpx-cta-btn:hover{background:linear-gradient(135deg,rgba(56,189,248,.3),rgba(45,212,191,.22));border-color:rgba(56,189,248,.55);transform:translateY(-2px);box-shadow:0 12px 36px rgba(14,116,144,.22);}

    .dpx-divider{width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(56,189,248,.1),transparent);margin:0 0 5rem;}

    /* SCROLL REVEAL */
    .dpx-reveal{opacity:0;transform:translateY(36px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1);}
    .dpx-reveal.dpx-in{opacity:1;transform:translateY(0);}
    .dpx-reveal-left{opacity:0;transform:translateX(-24px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1);}
    .dpx-reveal-left.dpx-in{opacity:1;transform:translateX(0);}

    /* PARTICLE animation */
    .dpx-particle{position:absolute;border-radius:50%;animation:dpxFloat linear infinite;opacity:.6;}
    @keyframes dpxFloat{0%{transform:translateY(100%) rotate(0deg);opacity:.6}100%{transform:translateY(-120%) rotate(360deg);opacity:0}}

    /* LOADING */
    .dpx-load{min-height:80vh;display:flex;align-items:center;justify-content:center;background:#050f1c;}
    .dpx-pulse{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:rgba(103,232,249,.45);animation:dpxP 2s ease-in-out infinite;}
    @keyframes dpxP{0%,100%{opacity:.25}50%{opacity:1}}

    @media(max-width:768px){
      .dpx-back{display:none;}
      .dpx-body{padding:0 1rem 4rem;}
      .dpx-hl-card{grid-template-columns:1fr;}
      .dpx-hl-img-wrap{height:180px;min-height:unset;}
      .dpx-hl-img-fade{background:linear-gradient(to bottom,rgba(8,20,36,.65) 0%,transparent 45%);}
      .dpx-compass-inner{grid-template-columns:1fr;}
      .dpx-compass-svg-wrap{order:-1;}
      .dpx-strip{grid-template-columns:1fr;}
      .dpx-strip-cell+.dpx-strip-cell{border-left:none;border-top:1px solid rgba(56,189,248,.08);}
      .dpx-season-stack{height:300px;}
      .dpx-desc-panel{padding:1.5rem 1.25rem;}
      .dpx-compass-card{padding:1.5rem 1.25rem;}
      .dpx-cta{padding:3rem 0 1rem;}
      .dpx-cta-title{font-size:2rem;}
      .dpx-sc-name{font-size:1.75rem;}
    }
  `;
  document.head.appendChild(s);
}

// ─── Config ───────────────────────────────────────────────────────────────────
const SEASON_CFG = {
  winter:{ color:'#67e8f9', bg:'linear-gradient(160deg,#061828 0%,#0a2540 50%,#0d3358 100%)', iconBg:'rgba(103,232,249,.12)', border:'rgba(103,232,249,.3)', icon:Snowflake, desc:'Cold & crisp', particle:'❄', particleColor:'rgba(103,232,249,.4)' },
  spring:{ color:'#34d399', bg:'linear-gradient(160deg,#041a12 0%,#062a1d 50%,#0a3d2a 100%)', iconBg:'rgba(52,211,153,.12)',  border:'rgba(52,211,153,.3)',  icon:Wind,      desc:'Fresh & blooming', particle:'🌸', particleColor:'rgba(52,211,153,.4)' },
  summer:{ color:'#fbbf24', bg:'linear-gradient(160deg,#1a1000 0%,#2a1c00 50%,#3d2a00 100%)', iconBg:'rgba(251,191,36,.12)',  border:'rgba(251,191,36,.3)',  icon:Sun,       desc:'Warm & vibrant', particle:'☀', particleColor:'rgba(251,191,36,.35)' },
  fall:  { color:'#fb923c', bg:'linear-gradient(160deg,#1a0a00 0%,#2a1200 50%,#3d1d00 100%)', iconBg:'rgba(251,146,60,.12)',  border:'rgba(251,146,60,.3)',  icon:Cloud,     desc:'Cool & golden', particle:'🍂', particleColor:'rgba(251,146,60,.4)' },
};


const HL_CFG = {
  landmark:  {color:'#a78bfa',bg:'rgba(167,139,250,.12)',icon:Landmark,        label:'Landmark',   img:'architecture'},
  nature:    {color:'#34d399',bg:'rgba(52,211,153,.12)', icon:Leaf,            label:'Nature',     img:'nature'},
  restaurant:{color:'#fb923c',bg:'rgba(251,146,60,.12)', icon:UtensilsCrossed, label:'Dining',     img:'food'},
  experience:{color:'#38bdf8',bg:'rgba(56,189,248,.12)', icon:Sparkles,        label:'Experience', img:'travel'},
  nightlife: {color:'#f472b6',bg:'rgba(244,114,182,.12)',icon:Zap,             label:'Nightlife',  img:'night'},
};

const COST_CFG = {
  budget:  {color:'#34d399',icon:Coffee,  label:'Budget',   perks:['Hostel or guesthouse','Street food & local markets','Public transport','Free walking tours']},
  moderate:{color:'#38bdf8',icon:Bed,     label:'Moderate', perks:['Boutique hotel (3–4★)','Café breakfasts, sit-down dinners','Mix of taxi & transit','1–2 paid attractions/day']},
  luxury:  {color:'#a78bfa',icon:Utensils,label:'Luxury',   perks:['5★ resort or villa','Fine dining every night','Private transfers','Exclusive experiences']},
};

// Per-highlight curated Unsplash photo IDs — matched by landmark name
const HL_IMAGES = {
  // Kyoto
  'Fushimi Inari Shrine':      '1478436127897-769e1b3f0f36',
  'Arashiyama Bamboo Grove':   '1558618666-fcd25c85cd64',
  'Nishiki Market':            '1504754524776-8f4f37790ca0',
  // Santorini
  'Oia Sunset':                '1533105079780-92b9be482077',
  'Red Beach':                 '1516483638261-f4dbaf036963',
  'Santo Wines':               '1510812431401-41d2bd2722f3',
  // Marrakech
  'Jemaa el-Fnaa':             '1597935322836-b4d4780e3b66',
  'Majorelle Garden':          '1548702770-f6c72ab27c68',
  'Le Jardin Secret':          '1551632811-561732d1e306',
  // Reykjavik
  'Blue Lagoon':               '1548615831-2c0b7fcf18a7',
  'Golden Circle':             '1474630548399-e63d91f2f2a4',
  'Northern Lights':           '1531366936337-7c912a4589a7',
  // Buenos Aires
  'La Boca':                   '1589909202802-8f4aadce1849',
  'San Telmo Market':          '1586769852836-bc069f19e1b6',
  'Palermo Soho':              '1516997121675-4c2d1684aa3e',
  // Bali
  'Tegallalang Rice Terraces': '1604999565976-8913ad2ddb7c',
  'Uluwatu Temple':            '1537996194471-e657df975ab4',
  'Ubud Monkey Forest':        '1555400038-63f5ba517a47',
  // Prague
  'Charles Bridge':            '1541849546-216549ae216d',
  'Old Town Square':           '1513805959324-96eb66ca8713',
  'Strahov Monastery Library': '1481627834876-b7833e8f84c6',
  // Cape Town
  'Table Mountain':            '1580060839134-75a5edca2e99',
  'Cape Winelands':            '1510812431401-41d2bd2722f3',
  'Boulders Beach':            '1589802829985-3a52d426f7a3',
  // Tokyo
  'Shibuya Crossing':          '1540959733332-eab4deabeeaf',
  'Tsukiji Outer Market':      '1553621042-f6e147245754',
  'Akihabara':                 '1542640244-7e672d6cef4e',
  // Lisbon
  'Tram 28':                   '1558618666-fcd25c85cd64',
  'Time Out Market':           '1504754524776-8f4f37790ca0',
  'Alfama District':           '1585208798174-6cedd86e019a',
};

// Fallback pool by type — all high quality, distinct images
const TYPE_FALLBACKS = {
  landmark:  ['1548013146-72479768bada','1467269204165-bdbdd97e5c89','1427679669569-1fda13df5600'],
  nature:    ['1501854140801-50d01698950b','1441974231531-c6227db76b6e','1518173946638-7b98d5e87c3f'],
  restaurant:['1414235077428-338989a2e8c0','1555396273-367ea4eb4db5','1504674900247-0877df9cc836'],
  experience:['1488646953014-85cb44e25828','1530521954074-e0a103ceff5c','1571406252241-db0280bd36cd'],
  nightlife: ['1493514789931-586cb221d7a7','1516997121675-4c2d1684aa3e','1571997478799-be44a0a0aa4e'],
};

const hlImageUrl = (type, name) => {
  const id = HL_IMAGES[name] || (TYPE_FALLBACKS[type] || TYPE_FALLBACKS.experience)[0];
  return `https://images.unsplash.com/photo-${id}?w=500&q=80&fit=crop`;
};

// Season background images from Unsplash
const SEASON_IMGS = {
  winter:'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=800&q=80&fit=crop',
  spring:'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&q=80&fit=crop',
  summer:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&fit=crop',
  fall:  'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80&fit=crop',
};

// ─── SeasonCards — swipeable card stack showing only best seasons ─────────────
function SeasonCards({ seasons }) {
  // Only show the destination's actual best seasons
  const cards = (seasons || []).filter(s => SEASON_CFG[s]);
  const [current, setCurrent] = useState(0);       // front card index
  const [dragX,   setDragX]   = useState(0);
  const [dragging,setDragging]= useState(false);
  const [exiting, setExiting] = useState(null);    // {dir: 1|-1}
  const startXRef = useRef(0);
  const cardRef   = useRef(null);

  if (!cards.length) return null;

  const total = cards.length;
  const next = (current + 1) % total;

  const dismiss = (dir) => {
    if (exiting) return;
    setExiting({ dir });
    setTimeout(() => {
      setCurrent(c => (c + 1) % total);
      setExiting(null);
      setDragX(0);
    }, 380);
  };

  const dragXRef = useRef(0);

  const onPointerDown = (e) => {
    if (exiting) return;
    setDragging(true);
    startXRef.current = e.clientX;
    dragXRef.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - startXRef.current;
    dragXRef.current = dx;
    setDragX(dx);
  };
  const onPointerUp = () => {
    setDragging(false);
    const dx = dragXRef.current;
    if (Math.abs(dx) > 80) dismiss(dx > 0 ? 1 : -1);
    else setDragX(0);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); dismiss(1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); dismiss(-1); }
  };

  const frontRotate = exiting ? exiting.dir * 22 : dragging ? dragX * 0.08 : 0;
  const frontTX     = exiting ? exiting.dir * 500 : dragging ? dragX : 0;
  const frontOpacity = exiting ? 0 : 1;

  return (
    <div onKeyDown={onKeyDown} tabIndex={0} style={{outline:'none'}}>
      <div className="dpx-season-stack">
        {/* Back card — scaled down, peeking behind */}
        {total > 1 && (
          <div
            className="dpx-sc"
            style={{
              transform: `scale(0.93) translateY(18px)`,
              zIndex: 1,
              pointerEvents: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,.4)',
            }}
          >
            {renderSeasonCard(cards[next])}
          </div>
        )}

        {/* Front card — draggable */}
        <div
          ref={cardRef}
          className="dpx-sc"
          style={{
            transform: `translateX(${frontTX}px) rotate(${frontRotate}deg)`,
            opacity: frontOpacity,
            transition: dragging
              ? 'none'
              : exiting
              ? 'transform .38s cubic-bezier(.4,0,.2,1), opacity .3s ease'
              : 'transform .3s cubic-bezier(.34,1.56,.64,1)',
            zIndex: 2,
            boxShadow: '0 16px 48px rgba(0,0,0,.5)',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {renderSeasonCard(cards[current])}
          {/* Swipe direction hint tint */}
          {dragging && (
            <div style={{
              position:'absolute',inset:0,borderRadius:'1.5rem',pointerEvents:'none',
              background: dragX > 40 ? 'rgba(52,211,153,.18)' : dragX < -40 ? 'rgba(239,68,68,.15)' : 'transparent',
              transition:'background .15s',
            }}/>
          )}
        </div>
      </div>

      {/* Dots + hint */}
      <div className="dpx-season-hint">
        <span>← swipe or use arrow keys →</span>
        <div className="dpx-sdots">
          {cards.map((s, i) => (
            <div
              key={s}
              className={`dpx-sdot${i === current ? ' active' : ''}`}
              style={{ background: i === current ? SEASON_CFG[s].color : 'rgba(56,189,248,.2)' }}
              onClick={() => { if (i !== current) dismiss(1); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function renderSeasonCard(season) {
  const cfg = SEASON_CFG[season];
  const Icon = cfg.icon;
  return (
    <>
      <img className="dpx-sc-img" src={SEASON_IMGS[season]} alt={season} draggable={false}/>
      <div className="dpx-sc-overlay"/>
      <div className="dpx-sc-content">
        <div className="dpx-sc-icon-ring" style={{ background: cfg.iconBg, borderColor: cfg.border }}>
          <Icon size={28} color={cfg.color}/>
        </div>
        <div className="dpx-sc-name" style={{ color: cfg.color }}>{season}</div>
        <div className="dpx-sc-desc">{cfg.desc}</div>
        <div className="dpx-sc-pill" style={{ color: cfg.color, borderColor: cfg.border, background: cfg.iconBg }}>
          ✓ Best time to visit
        </div>
      </div>
    </>
  );
}

// ─── CostSelector component ───────────────────────────────────────────────────
function CostSelector({ costs }) {
  const [active, setActive] = useState('moderate');
  const cfg = COST_CFG[active];
  const Icon = cfg.icon;
  return (
    <div className="dpx-cost-card">
      <div className="dpx-cost-tabs">
        {Object.entries(COST_CFG).map(([key,c])=>{
          const isActive = key===active;
          const val = costs?.[key];
          if (val==null) return null;
          return (
            <button key={key} className={`dpx-cost-tab${isActive?' active':''}`} onClick={()=>setActive(key)}
              style={{borderBottom: isActive ? `2px solid ${c.color}` : '2px solid transparent'}}>
              <span className="dpx-cost-tab-label" style={{color: isActive?c.color:'inherit'}}>{c.label}</span>
              <span className="dpx-cost-tab-price" style={{color: isActive?c.color:'rgba(160,184,208,.5)'}}>${val}</span>
              <span className="dpx-cost-tab-sub">per day</span>
            </button>
          );
        })}
      </div>
      <div className="dpx-cost-panel">
        <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1.25rem'}}>
          <div className="dpx-cost-ico" style={{background:`${cfg.color}15`}}>
            <Icon size={16} color={cfg.color}/>
          </div>
          <div>
            <p style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.14em',color:cfg.color,margin:0}}>{cfg.label} travel</p>
            <p style={{fontSize:12,color:'rgba(160,184,208,.5)',margin:0}}>What ${costs?.[active]}/day gets you</p>
          </div>
        </div>
        {cfg.perks.map((perk,i)=>(
          <div key={i} className="dpx-cost-row2">
            <div style={{width:6,height:6,borderRadius:'50%',background:cfg.color,flexShrink:0,marginTop:1}}/>
            <span style={{fontSize:13.5,color:'rgba(160,184,208,.82)'}}>{perk}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CompassWidget component ──────────────────────────────────────────────────
function CompassWidget({ coordinates, city }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [spun, setSpun]         = useState(false);

  // bearing from 0,0 to the destination, just for a dramatic spin angle
  const bearing = coordinates ? ((Math.atan2(coordinates.lng, coordinates.lat) * 180 / Math.PI) + 360) % 360 : 0;

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setSpun(false);
    setRotation(r => r + 720 + bearing);
    setTimeout(() => { setSpinning(false); setSpun(true); }, 1400);
  };

  return (
    <div className="dpx-compass-card">
      <div className="dpx-sec" style={{marginBottom:'1.5rem'}}><span>Location</span><div className="dpx-sec-line"/></div>
      <div className="dpx-compass-inner">
        <div className="dpx-compass-info">
          {coordinates && (
            <>
              <div className="dpx-coord-row">
                <span className="dpx-coord-label">Latitude</span>
                <span className="dpx-coord-val">{coordinates.lat >= 0 ? '↑' : '↓'} {Math.abs(coordinates.lat).toFixed(4)}° {coordinates.lat >= 0 ? 'N' : 'S'}</span>
              </div>
              <div className="dpx-coord-row">
                <span className="dpx-coord-label">Longitude</span>
                <span className="dpx-coord-val">{coordinates.lng >= 0 ? '→' : '←'} {Math.abs(coordinates.lng).toFixed(4)}° {coordinates.lng >= 0 ? 'E' : 'W'}</span>
              </div>
              <div className="dpx-coord-row" style={{marginTop:'.25rem'}}>
                <span className="dpx-coord-label">City</span>
                <span style={{fontSize:'.95rem',fontWeight:700,color:'rgba(103,232,249,.85)'}}>{city}</span>
              </div>
            </>
          )}
          <button
            onClick={handleSpin}
            style={{
              marginTop:'.5rem',
              display:'inline-flex',alignItems:'center',gap:8,
              padding:'9px 18px',borderRadius:9999,
              background:'rgba(56,189,248,.07)',
              border:'1px solid rgba(56,189,248,.2)',
              color:'rgba(103,232,249,.85)',fontSize:12,fontWeight:600,
              cursor: spinning?'wait':'pointer',
              transition:'all .25s',letterSpacing:'.04em',width:'fit-content',
            }}
          >
            {spinning ? '…spinning' : spun ? '↻ Spin again' : '↻ Spin the compass'}
          </button>
          {spun && <p style={{fontSize:11,color:'rgba(160,184,208,.4)',margin:0,letterSpacing:'.04em'}}>Pointing toward {city}</p>}
        </div>

        <div className="dpx-compass-svg-wrap">
          <svg
            width="180" height="180" viewBox="0 0 180 180"
            style={{transition:'transform 1.4s cubic-bezier(.34,1.56,.64,1)',transform:`rotate(${rotation}deg)`,filter:'drop-shadow(0 0 12px rgba(56,189,248,.25))'}}
          >
            {/* Outer ring */}
            <circle cx="90" cy="90" r="84" fill="none" stroke="rgba(56,189,248,.15)" strokeWidth="1.5"/>
            <circle cx="90" cy="90" r="76" fill="none" stroke="rgba(56,189,248,.08)" strokeWidth="1"/>
            {/* Tick marks */}
            {Array.from({length:32},(_,i)=>{
              const a = (i/32)*360, r=i%8===0?68:i%4===0?70:72, R=76;
              const x1=90+r*Math.sin(a*Math.PI/180), y1=90-r*Math.cos(a*Math.PI/180);
              const x2=90+R*Math.sin(a*Math.PI/180), y2=90-R*Math.cos(a*Math.PI/180);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(56,189,248,.25)" strokeWidth={i%8===0?1.5:.5}/>;
            })}
            {/* Cardinal letters */}
            {[['N',90,18],['E',163,93],['S',90,168],['W',17,93]].map(([l,x,y])=>(
              <text key={l} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                fontSize={l==='N'?14:11} fontWeight="700" letterSpacing=".1em"
                fill={l==='N'?'#ef4444':'rgba(160,184,208,.5)'}>{l}</text>
            ))}
            {/* Inner circle */}
            <circle cx="90" cy="90" r="52" fill="rgba(5,15,28,.6)" stroke="rgba(56,189,248,.12)" strokeWidth="1"/>
            {/* North needle — red */}
            <polygon points="90,44 85,90 90,82 95,90" fill="#ef4444" opacity=".9"/>
            {/* South needle — blue */}
            <polygon points="90,136 85,90 90,98 95,90" fill="rgba(56,189,248,.6)" opacity=".8"/>
            {/* Center dot */}
            <circle cx="90" cy="90" r="5" fill="rgba(56,189,248,.4)" stroke="rgba(56,189,248,.6)" strokeWidth="1.5"/>
            <circle cx="90" cy="90" r="2" fill="#38bdf8"/>
          </svg>
          <span className="dpx-compass-hint">tap to navigate</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DestinationPage() {
  const { destinationId } = useParams();
  const navigate          = useNavigate();
  const [dest, setDest]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const heroWrapRef   = useRef(null);
  const heroImgRef    = useRef(null);
  const heroTextRef   = useRef(null);
  const cityNameRef   = useRef(null);
  const labelRef      = useRef(null);
  const badgesRef     = useRef(null);
  const scrollHintRef = useRef(null);

  useEffect(()=>{
    setLoading(true);
    API.get(`/destinations/${destinationId}`)
      .then(r=>setDest(r.data.data))
      .catch(()=>setError('Could not load destination.'))
      .finally(()=>setLoading(false));
  },[destinationId]);

  // Scroll reveal
  useEffect(()=>{
    if (!dest) return;
    const io = new IntersectionObserver(entries=>entries.forEach(e=>{
      if (e.isIntersecting) setTimeout(()=>e.target.classList.add('dpx-in'), Number(e.target.dataset.delay||0));
    }),{threshold:.08});
    document.querySelectorAll('.dpx-reveal,.dpx-reveal-left').forEach(el=>io.observe(el));
    return ()=>io.disconnect();
  },[dest]);

  // Hero entrance + parallax
  useEffect(()=>{
    if (!dest) return;
    const t = setTimeout(()=>{
      if (labelRef.current)    { labelRef.current.style.opacity='1';    labelRef.current.style.transform='translateY(0)'; }
      if (cityNameRef.current) { cityNameRef.current.style.opacity='1'; cityNameRef.current.style.transform='translateY(0) scale(1)'; }
      if (badgesRef.current)   { badgesRef.current.style.opacity='1';   badgesRef.current.style.transform='translateY(0)'; }
      if (scrollHintRef.current){ scrollHintRef.current.style.opacity='1'; }
    },60);
    const onScroll=()=>{
      const hero=heroWrapRef.current; if(!hero) return;
      const heroH=hero.offsetHeight, sy=window.scrollY, p=Math.min(sy/heroH,1);
      if(heroImgRef.current)  heroImgRef.current.style.transform=`translateY(${sy*.35}px) scale(${1+p*.07})`;
      if(heroTextRef.current) heroTextRef.current.style.transform=`translateY(-${sy*.52}px)`;
      if(cityNameRef.current) cityNameRef.current.style.opacity=String(Math.max(0,1-p*2.4));
      if(scrollHintRef.current) scrollHintRef.current.style.opacity=String(Math.max(0,1-p*10));
    };
    window.addEventListener('scroll',onScroll,{passive:true});
    return ()=>{ clearTimeout(t); window.removeEventListener('scroll',onScroll); };
  },[dest]);

  if (loading) return <div className="dpx-load"><p className="dpx-pulse">Loading destination…</p></div>;
  if (error||!dest) return (
    <div className="dpx-load" style={{flexDirection:'column',gap:'1rem'}}>
      <p style={{color:'rgba(160,184,208,.5)',fontSize:14}}>{error||'Not found'}</p>
      <button className="dpx-back" style={{position:'static'}} onClick={()=>navigate(-1)}><ArrowLeft size={13}/>Go back</button>
    </div>
  );

  const allTags=[...(dest.vibeCategories||[]).map(t=>({t,kind:'cat'})),...(dest.vibeKeywords||[]).slice(0,10).map(k=>({t:k,kind:'kw'}))];
  const marqueeItems=[...allTags,...allTags];

  return (
    <div className="dpx">
      <button className="dpx-back" onClick={()=>navigate(-1)}><ArrowLeft size={13}/> Back</button>

      {/* HERO */}
      <div className="dpx-hero-wrap" ref={heroWrapRef}>
        <img className="dpx-hero-img" ref={heroImgRef} src={dest.heroImage} alt={dest.city}/>
        <div className="dpx-overlay-base"/>
        <div className="dpx-overlay-text-scrim"/>
        <div className="dpx-hero-text" ref={heroTextRef}>
          <p className="dpx-continent-label" ref={labelRef}>{dest.country}&nbsp;·&nbsp;{dest.continent}</p>
          <h1 className="dpx-city-name" ref={cityNameRef}>{dest.city}</h1>
          <div className="dpx-badges" ref={badgesRef}>
            <div className="dpx-badge" style={{background:'rgba(52,211,153,.15)',border:'1px solid rgba(52,211,153,.35)',color:'#34d399'}}><Shield size={11}/> Safety {dest.safetyRating}/10</div>
            <div className="dpx-badge" style={{background:'rgba(56,189,248,.15)',border:'1px solid rgba(56,189,248,.35)',color:'#38bdf8'}}><TrendingUp size={11}/> {dest.popularityScore}% trending</div>
            <div className="dpx-badge" style={{background:'rgba(103,232,249,.1)',border:'1px solid rgba(103,232,249,.25)',color:'rgba(103,232,249,.9)'}}><MapPin size={11}/> {dest.continent}</div>
          </div>
        </div>
        <div className="dpx-scroll-hint" ref={scrollHintRef}><span>scroll</span><div className="dpx-scroll-bar"/></div>
      </div>

      {/* BODY */}
      <div className="dpx-body">

        {/* Stat strip */}
        <div className="dpx-strip dpx-reveal">
          <div className="dpx-strip-cell">
            <span className="dpx-strip-label">Safety index</span>
            <span className="dpx-strip-val">{dest.safetyRating}<span style={{fontSize:'1rem',color:'rgba(160,184,208,.4)',fontWeight:400}}>/10</span></span>
            <span className="dpx-strip-sub">Out of 10 score</span>
          </div>
          <div className="dpx-strip-cell">
            <span className="dpx-strip-label">Popularity</span>
            <span className="dpx-strip-val">{dest.popularityScore}<span style={{fontSize:'1rem',color:'rgba(160,184,208,.4)',fontWeight:400}}>%</span></span>
            <span className="dpx-strip-sub">Traveller demand</span>
          </div>
          <div className="dpx-strip-cell">
            <span className="dpx-strip-label">Budget from</span>
            <span className="dpx-strip-val">${dest.averageCostPerDay?.budget}<span style={{fontSize:'1rem',color:'rgba(160,184,208,.4)',fontWeight:400}}>/day</span></span>
            <span className="dpx-strip-sub">Average per person</span>
          </div>
        </div>

        {/* Description — frosted glass panel, always readable */}
        <div className="dpx-desc dpx-reveal" style={{marginTop:'4rem'}}>
          <div className="dpx-sec"><span>About</span><div className="dpx-sec-line"/></div>
          <div className="dpx-desc-panel">
            <p className="dpx-desc-text">
              <span className="dpx-accent">{dest.description.split('. ')[0]}. </span>
              {dest.description.split('. ').slice(1).join('. ')}
            </p>
          </div>
        </div>

        <div className="dpx-divider"/>

        {/* HIGHLIGHTS — image cards */}
        <div className="dpx-hl-section">
          <div className="dpx-sec"><span>Highlights</span><div className="dpx-sec-line"/></div>
          <div className="dpx-hl-cards">
            {dest.highlights?.map((h,i)=>{
              const cfg=HL_CFG[h.type]||HL_CFG.experience;
              const Icon=cfg.icon;
              return (
                <div key={h.name} className="dpx-hl-card dpx-reveal-left" data-delay={i*90}>
                  {/* Left: stripe + content */}
                  <div className="dpx-hl-left">
                    <div className="dpx-hl-stripe" style={{background:cfg.color}}/>
                    <div className="dpx-hl-body">
                      <div className="dpx-hl-top">
                        <div className="dpx-hl-ico" style={{background:cfg.bg}}><Icon size={17} color={cfg.color}/></div>
                        <div>
                          <p className="dpx-hl-name">{h.name}</p>
                          <span className="dpx-hl-type-pill" style={{color:cfg.color,borderColor:`${cfg.color}40`,background:cfg.bg}}><Icon size={9}/>{cfg.label}</span>
                        </div>
                      </div>
                      <p className="dpx-hl-desc-text">{h.description}</p>
                    </div>
                  </div>
                  {/* Right: image */}
                  <div className="dpx-hl-img-wrap" style={{position:'relative'}}>
                    <img className="dpx-hl-img" src={hlImageUrl(h.type,h.name)} alt={h.name} loading="lazy"
                      onError={e=>{e.currentTarget.style.display='none';}}/>
                    <div className="dpx-hl-img-fade"/>
                    <div className="dpx-hl-index">{String(i+1).padStart(2,'0')}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dpx-divider"/>

        {/* SEASON SLIDER */}
        <div className="dpx-season-wrap dpx-reveal">
          <div className="dpx-sec"><span>Best seasons</span><div className="dpx-sec-line"/></div>
          <SeasonCards seasons={dest.bestSeasons}/>
        </div>

        <div className="dpx-divider"/>

        {/* COST SELECTOR */}
        <div className="dpx-cost-wrap dpx-reveal">
          <div className="dpx-sec"><span>Budget planner</span><div className="dpx-sec-line"/></div>
          <CostSelector costs={dest.averageCostPerDay}/>
        </div>

        <div className="dpx-divider"/>

        {/* COMPASS */}
        <div className="dpx-reveal">
          <CompassWidget coordinates={dest.coordinates} city={dest.city}/>
        </div>

        <div className="dpx-divider" style={{marginTop:'5rem'}}/>

        {/* VIBES MARQUEE */}
        {marqueeItems.length>0&&(
          <div className="dpx-vibes-section dpx-reveal">
            <div className="dpx-sec"><span>Vibes</span><div className="dpx-sec-line"/></div>
            <div className="dpx-vibes-track-wrap">
              <div className="dpx-vibes-track">
                {marqueeItems.map((item,i)=>(
                  <span key={i} style={{display:'inline-flex',alignItems:'center',gap:'.875rem'}}>
                    {item.kind==='cat'?<span className="dpx-vtag">{item.t}</span>:<span className="dpx-ktag">{item.t}</span>}
                    <span style={{width:3,height:3,borderRadius:'50%',background:'rgba(56,189,248,.2)',flexShrink:0,display:'inline-block'}}/>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="dpx-cta dpx-reveal">
          <div>
            <p style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.22em',color:'rgba(45,212,191,.65)',marginBottom:'.75rem'}}>Ready to go?</p>
            <h2 className="dpx-cta-title">Find your stay<br/>in <span className="dpx-accent">{dest.city}</span></h2>
          </div>
          <button className="dpx-cta-btn" onClick={()=>navigate(`/hotels/${destinationId}`)}>
            <Sparkles size={15}/> Explore hotels <ArrowRight size={15}/>
          </button>
        </div>

      </div>
    </div>
  );
}