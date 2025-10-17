"use client";

import { useState } from "react";
import {
  Plane, Ship, Warehouse, ShieldCheck, ClipboardList, Boxes, FileCheck2, Settings,
  MapPin, ChevronDown, Receipt, FileText, Cpu, Share2, Truck, Package
} from "lucide-react";
import { motion } from "framer-motion";

/**************************************
 * TRACS – Preview App (EN)
 * Versión pre‑Carmen, estable.
 * Home limpio + Solutions (hero/intro/grid + internals) + Industries + About (sin Carmen) + Contact + Newsletter.
 * Sin WMS.
 **************************************/

// Brand palette
const BLUE = "#114C67";
const GREEN = "#B6CE29";
const SILVER = "#B6B6B6";

// Solutions data (8 items)
const SOLUTIONS = [
  { key: "4pl",        title: "4PL / Program Management", icon: ClipboardList, line: "One control point for vendors, contracts/billing and KPIs." },
  { key: "ocean",      title: "Ocean Freight (FCL/LCL)",  icon: Ship,          line: "Door‑to‑door, consolidation and customs support." },
  { key: "air",        title: "Air Freight",              icon: Plane,         line: "Time‑definite and special cargo." },
  { key: "warehouse",  title: "Warehousing & Distribution",icon: Warehouse,   line: "Bonded, seasonal; DC consolidation." },
  { key: "ppd",        title: "PPD Consolidation (Retail)",icon: Boxes,       line: "Programs that keep retailer scorecards on target." },
  { key: "project",    title: "Project Cargo",            icon: Settings,      line: "Complex moves—even in high‑risk regions." },
  { key: "compliance", title: "Trade Compliance (FF/CHB)",icon: FileCheck2,    line: "Export/import compliance; FF & Customs Brokerage." },
  { key: "insurance",  title: "Cargo Insurance",          icon: ShieldCheck,   line: "Coverage via specialized agents." },
] as const;

type View =
  | "home" | "solutions" | "industries" | "about" | "contact"
  | "sol-4pl" | "sol-ocean" | "sol-air" | "sol-warehouse" | "sol-ppd" | "sol-project" | "sol-compliance" | "sol-insurance";

/***************
 * Header + Track
 ***************/
function Header({ view, setView, toggleTrack }: { view: View; setView: (v: View)=>void; toggleTrack: ()=>void }) {
  const items: Array<{label: string; v: View}> = [
    {label:"Home", v:"home"},
    {label:"Solutions", v:"solutions"},
    {label:"Industries", v:"industries"},
    {label:"About", v:"about"},
    {label:"Contact", v:"contact"},
  ];
  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="bg-[#114C67]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-white/60 grid place-items-center text-white text-sm font-bold">TR</div>
            <span className="text-white text-lg font-semibold tracking-wide">TRACS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-white/90">
            {items.map(({label, v})=> (
              <button key={label} onClick={()=>setView(v)} className={`hover:text-white transition-colors ${view===v?'text-[#B6CE29]':''}`}>{label}</button>
            ))}
          </nav>
          <button onClick={toggleTrack} className="bg-[#B6CE29] text-[#114C67] font-semibold px-4 py-2 rounded-xl shadow-sm hover:brightness-95">Track & Trace</button>
        </div>
      </div>
    </header>
  );
}

function TrackOverlay({ open, close }: { open: boolean; close: ()=>void }) {
  const [id,setId]=useState("");
  if(!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] grid place-items-center" onClick={close}>
      <div className="bg-white rounded-2xl p-5 w-[95%] max-w-xl shadow-xl" onClick={(e)=>e.stopPropagation()}>
        <h3 className="text-xl font-semibold text-[#114C67] mb-2">Track & Trace</h3>
        <p className="text-sm text-gray-600 mb-3">Enter your <strong>B/L</strong>, <strong>PRO</strong> or <strong>PO</strong> number.</p>
        <div className="flex gap-2">
          <input value={id} onChange={(e)=>setId(e.target.value)} placeholder="e.g., BL123456" className="flex-1 border rounded-xl px-3 py-2" />
          <button className="bg-[#B6CE29] text-[#114C67] font-semibold px-4 py-2 rounded-xl">Search</button>
        </div>
        <p className="text-xs text-gray-500 mt-3">*Embedded provider per client’s system (e.g., TradLinx).</p>
      </div>
    </div>
  );
}

/***************
 * Home (clean)
 ***************/
function Home(){
  return (
    <main>
      {/* HERO */}
      <section aria-label="Home" className="relative h-[82vh] md:h-[92vh]">
        <div className="absolute inset-0 bg-[#114C67]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-black/10" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
          <motion.h1 initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="text-white text-4xl md:text-5xl font-extrabold max-w-2xl">Helping customers to deliver.</motion.h1>
          <p className="mt-3 text-white/90 max-w-2xl">We are a non‑asset 4PL that designs, implements and manages logistics programs with real‑time visibility through a trusted global partner network.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#contact" className="bg-[#B6CE29] text-[#114C67] font-semibold px-4 py-2 rounded-xl">Request a Quote</a>
            <a href="#contact" className="border border-white/80 text-white font-semibold px-4 py-2 rounded-xl">Talk to an Expert</a>
          </div>
        </div>
      </section>

      {/* TRACK & TRACE */}
      <HomeTrack />

      {/* SOLUTIONS SUMMARY */}
      <HomeSolutionsSummary />

      {/* INDUSTRIES */}
      <HomeIndustriesSummary />

      {/* TESTIMONIALS */}
      <HomeTestimonials />

      {/* QUICK CONTACT */}
      <HomeQuickContact />
    </main>
  );
}

function HomeTrack(){
  const [id,setId]=useState("");
  const [msg,setMsg]=useState("");
  return (
    <section id="home-track" className="max-w-7xl mx-auto px-4 py-8">
      <div className="rounded-2xl border-2 border-[#B6CE29] p-4 bg-white">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <span className="font-semibold text-[#114C67]">Track & Trace</span>
          <input value={id} onChange={(e)=>setId(e.target.value)} placeholder="Enter B/L, PRO or PO number" className="flex-1 w-full border rounded-xl px-3 py-2" />
          <button onClick={()=>setMsg(id?`Searching for: ${id}`:"Please enter an ID")} className="bg-[#B6CE29] text-[#114C67] font-semibold px-4 py-2 rounded-xl">Search</button>
        </div>
        {msg && <p className="mt-2 text-sm text-gray-600">{msg}</p>}
      </div>
    </section>
  );
}

function HomeSolutionsSummary(){
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6"><h2 className="text-2xl md:text-3xl font-semibold text-[#114C67]">Solutions</h2></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SOLUTIONS.map(({title,line,icon:Icon,key})=> (
          <a key={key} href={`#sol-${key}`} className="rounded-2xl border border-[#114C67]/30 p-4 bg-white block hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B6CE29]/30 grid place-items-center"><Icon className="w-5 h-5 text-[#114C67]"/></div>
              <h3 className="font-semibold text-[#114C67]">{title}</h3>
            </div>
            <p className="mt-2 text-sm text-gray-700">{line}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

function HomeIndustriesSummary(){
  const items = [
    { title: "Manufacturing", line: "Better lead‑times, visibility and lower costs." },
    { title: "Consumer & Retail", line: "Seasonality, MABD and PO/PPD consolidation." },
    { title: "Government & Infrastructure", line: "Tight compliance and coordinated deployments." },
    { title: "Humanitarian Relief & NGOs", line: "Rapid response in changing environments." },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6"><h2 className="text-2xl md:text-3xl font-semibold text-[#114C67]">Industries we serve</h2></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({title,line})=> (
          <div key={title} className="rounded-2xl overflow-hidden border border-[#114C67]/30 bg-white">
            <div className="h-28 bg-gray-100 grid place-items-center text-gray-400">Photo</div>
            <div className="p-4">
              <h3 className="font-semibold text-[#114C67]">{title}</h3>
              <p className="text-sm text-gray-700">{line}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomeTestimonials(){
  const quotes = [
    "TRACS keeps our retailer scorecards on target.",
    "Clear visibility and quick responses across our lanes.",
    "Fast support when we needed it most.",
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6"><h2 className="text-2xl md:text-3xl font-semibold text-[#114C67]">Testimonials</h2></div>
      <div className="grid md:grid-cols-3 gap-4">
        {quotes.map((q,i)=> (
          <blockquote key={i} className="rounded-2xl border border-[#114C67]/30 p-4 bg-white">“{q}”</blockquote>
        ))}
      </div>
    </section>
  );
}

function HomeQuickContact(){
  const [sent,setSent]=useState(false);
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-[#114C67]/30 p-4 bg-white">
          <h3 className="font-semibold text-[#114C67] mb-1">Request a Quote</h3>
          <p className="text-sm text-gray-600 mb-3">Tell us about your shipment. We’ll reply within one business day.</p>
          <form onSubmit={(e)=>{e.preventDefault();setSent(true);}} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="border rounded-xl px-3 py-2" placeholder="Name" required />
            <input className="border rounded-xl px-3 py-2" placeholder="Company" required />
            <input className="border rounded-xl px-3 py-2 md:col-span-2" placeholder="Email" type="email" required />
            <input className="border rounded-xl px-3 py-2 md:col-span-2" placeholder="Phone" />
            <textarea className="border rounded-xl px-3 py-2 md:col-span-2" rows={4} placeholder="Message" />
            <button className="bg-[#114C67] text-white font-semibold px-4 py-2 rounded-xl md:w-max">Request a Quote → sales@tracs-us.com</button>
            {sent && <p className="text-sm text-green-700 md:col-span-2">Thanks! We’ll reply within one business day.</p>}
          </form>
        </div>
        <div className="rounded-2xl border border-[#114C67]/30 p-4 bg-white">
          <h3 className="font-semibold text-[#114C67] mb-2">Need shipment status?</h3>
          <p className="text-sm text-gray-700">Use the Track & Trace box above or the button in the header.</p>
        </div>
      </div>
    </section>
  );
}

/***************
 * Solutions (hero + intro + grid)
 ***************/
function SolutionsHero() {
  return (
    <section className="relative max-w-7xl mx-auto mt-6">
      <div className="relative h-56 md:h-72 w-full rounded-2xl overflow-hidden bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-black/10" />
        <div className="absolute inset-0 grid place-items-center text-gray-400">Solutions hero image</div>
        <div className="absolute inset-0 flex items=end">
          <div className="p-6 md:p-8">
            <h1 className="text-white text-3xl md:text-5xl font-extrabold">Solutions</h1>
            <p className="text-white/90 mt-2 max-w-3xl">Design, implementation and management of customized logistics programs—working alongside your current infrastructure.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionsIntro() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <p className="text-lg text-gray-700 leading-relaxed">
        We build end‑to‑end supply‑chain programs tailored to your strategic and operational goals. Using a non‑invasive approach, our team works with your existing infrastructure while focusing on core areas such as Process Improvement, KPIs Evaluation & Transformation, Supply Chain Network design, a Centralized Billing Center, Carrier Contract Management, and ERP optimization.
      </p>
    </section>
  );
}

function SpeakToExpertCard(){
  const [sent,setSent]=useState(false);
  return (
    <div className="rounded-2xl border border-[#114C67]/30 p-4 bg-white sticky top-24 h-max">
      <h3 className="font-semibold text-[#114C67] mb-2">Talk to an Expert</h3>
      <form onSubmit={(e)=>{e.preventDefault();setSent(true);}} className="grid gap-3">
        <input className="border rounded-xl px-3 py-2" placeholder="Name" required />
        <input className="border rounded-xl px-3 py-2" placeholder="Company" required />
        <input className="border rounded-xl px-3 py-2" placeholder="Email" type="email" required />
        <input className="border rounded-xl px-3 py-2" placeholder="Phone" />
        <textarea className="border rounded-xl px-3 py-2" rows={4} placeholder="Message" />
        <button className="bg-[#B6CE29] text-[#114C67] font-semibold px-4 py-2 rounded-xl">Send → sales@tracs-us.com</button>
        {sent && <p className="text-sm text-green-700">Thanks! We’ll reach out soon.</p>}
      </form>
    </div>
  );
}

function FAQItem({ q, a }:{ q: string; a: string }){
  const [open,setOpen]=useState(false);
  return (
    <div className="rounded-2xl border border-[#114C67]/20 bg-white">
      <button onClick={()=>setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 font-medium text-[#114C67]">
        <span>{q}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${open? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 pb-4 text-sm text-gray-700">{a}</div>}
    </div>
  );
}

function FAQs({ items }:{ items: Array<{q:string;a:string}> }){
  return (
    <div className="space-y-3">
      {items.map((it,i)=>(<FAQItem key={i} q={it.q} a={it.a} />))}
    </div>
  );
}

function SolutionPage({ title, deck, context, bullets, setView }:{
  title: string;
  deck?: string;
  context?: string;
  bullets: Array<{ Icon: any; text: string }>;
  setView: (v: View)=>void;
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="relative h-48 md:h-64 w-full rounded-2xl overflow-hidden bg-gray-100 mb-6">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-black/10" />
        <div className="absolute inset-0 grid place-items-center text-gray-400">{title} hero image</div>
        <div className="absolute inset-0 flex items-end">
          <div className="p-6 md:p-8">
            <h1 className="text-white text-3xl md:text-5xl font-extrabold">{title}</h1>
            {deck && <p className="text-white/90 mt-2 max-w-3xl">{deck}</p>}
          </div>
        </div>
      </div>
      {context && <p className="text-lg text-gray-700 leading-relaxed mb-6">{context}</p>}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ul className="grid md:grid-cols-2 gap-4">
            {bullets.map(({Icon, text}, i)=> (
              <li key={i} className="flex items-start gap-3 p-4 rounded-2xl border border-[#114C67]/20 bg-white">
                <div className="w-9 h-9 rounded-xl bg-[#B6CE29]/30 grid place-items-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#114C67]" />
                </div>
                <p className="text-sm text-gray-700">{text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <button onClick={()=>setView('solutions')} className="border border-[#114C67] text-[#114C67] font-semibold px-4 py-2 rounded-xl">← Back to Solutions</button>
          </div>
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-[#114C67] mb-3">FAQs</h3>
            <FAQs items={[
              { q: 'What documents are required for imports/exports?', a: 'We coordinate Freight Forwarding and Customs Brokerage to ensure the right filings and compliance for each lane.' },
              { q: 'Do you support door‑to‑door?', a: 'Yes — through our partner network we orchestrate pick‑up, line‑haul and final delivery.' },
              { q: 'Can you manage consolidation (LCL/FCL or PPD)?', a: 'We support consolidation programs and visibility so you can keep scorecards on target.' }
            ]} />
          </div>
          <div className="mt-10 rounded-2xl bg-[#114C67] text-white p-6 flex items-center justify-between flex-col md:flex-row gap-4">
            <div className="text-lg font-semibold">Ready to connect?</div>
            <button onClick={()=>setView('contact')} className="bg-[#B6CE29] text-[#114C67] font-semibold px-4 py-2 rounded-xl">Contact Us</button>
          </div>
        </div>
        <SpeakToExpertCard />
      </div>
    </section>
  );
}

// Individual solutions (no WMS)
function Sol4PL({ setView }:{ setView: (v: View)=>void }) {
  const bullets = [
    { Icon: Settings,     text: 'Process Improvement — governance and continuous improvement.' },
    { Icon: ClipboardList, text: 'KPIs Evaluation & Transformation — metrics that drive decisions.' },
    { Icon: Share2,       text: 'Supply Chain Network — cost‑effective network design.' },
    { Icon: Receipt,      text: 'Centralized Billing Center — one audit and payables hub.' },
    { Icon: FileText,     text: 'Carrier Contract Management — sourcing & compliance.' },
    { Icon: Cpu,          text: 'ERP — optimization software and integrations.' },
  ];
  return <SolutionPage title="4PL / Program Management" deck="Customized program management to meet your strategic and operational goals." context="We design, implement and manage supply‑chain and logistics programs alongside your current infrastructure, focusing on process improvement, KPIs transformation, network design, centralized billing, carrier contracts and ERP optimization." bullets={bullets} setView={setView} />;
}

function SolOcean({ setView }:{ setView: (v: View)=>void }) {
  const bullets = [
    { Icon: Ship,         text: 'FCL/LCL — global coverage and consolidation.' },
    { Icon: FileCheck2,   text: 'Customs Brokerage — export/import documentation.' },
    { Icon: Truck,        text: 'Door‑to‑Door — first/last mile orchestration.' },
    { Icon: Package,      text: 'Consolidation — LCL/FCL programs.' },
    { Icon: Warehouse,    text: 'Warehousing, Distribution & Delivery.' },
  ];
  return <SolutionPage title="Ocean Freight (FCL/LCL)" deck="FCL/LCL sea freight from pick‑up to delivery with advice and supervision." context="Through our network of experienced professionals and strong world shipping connections, we respond to your needs from pick‑up to delivery, keeping you informed, providing technical assistance and supervision for safe, efficient cargo delivery." bullets={bullets} setView={setView} />;
}

function SolAir({ setView }:{ setView: (v: View)=>void }) {
  const bullets = [
    { Icon: Plane,        text: 'Time‑definite and special cargo.' },
    { Icon: FileCheck2,   text: 'Customs & security paperwork.' },
    { Icon: Settings,     text: 'Project handling & flight chartering.' },
    { Icon: Truck,        text: 'Door‑to‑Door to most worldwide locations.' },
  ];
  return <SolutionPage title="Air Freight" deck="Time‑definite and hazardous cargo with optimized schedules and end‑to‑end control." context="When shipments demand extra care, we optimize carrier schedules and maintain door‑to‑door control so your critical cargo moves on time and intact." bullets={bullets} setView={setView} />;
}

function SolWarehousing({ setView }:{ setView: (v: View)=>void }) {
  const bullets = [
    { Icon: Warehouse,    text: 'Bonded facilities and seasonal overflow.' },
    { Icon: Settings,     text: 'DC consolidation / de‑consolidation.' },
  ];
  return <SolutionPage title="Warehousing & Distribution" deck="Bonded & seasonal capacity, DC consolidation and de‑consolidation." context="We support planned programs and quickly address inventory and distribution issues—scaling for seasonal or cyclical models with bonded facilities and consolidation services." bullets={bullets} setView={setView} />;
}

function SolPPD({ setView }:{ setView: (v: View)=>void }) {
  const bullets = [
    { Icon: Boxes,        text: 'PO/PPD consolidation for retail.' },
    { Icon: ClipboardList, text: 'Scorecards on target (MABD/OTIF).' },
    { Icon: Settings,     text: 'SLAs and exception management.' },
  ];
  return <SolutionPage title="PPD Consolidation (Retail)" deck="PO/PPD consolidation programs that keep retailer scorecards high and costs under control." context="Our partner programs provide online visibility, defined service levels to keep scorecards high, competitive advantage through efficiency, and protection against margin erosion with rate/equipment strategies." bullets={bullets} setView={setView} />;
}

function SolProject({ setView }:{ setView: (v: View)=>void }) {
  const bullets = [
    { Icon: Settings,     text: 'Planning and risk control.' },
    { Icon: Truck,        text: 'Multi‑mode orchestration.' },
    { Icon: Ship,         text: 'Heavy/oversized handling.' },
    { Icon: Plane,        text: 'Urgent and remote lanes.' },
  ];
  return <SolutionPage title="Project Cargo" deck="Extreme project logistics and retrograde operations, including high‑risk zones." context="We partner with experts to move complex loads in challenging environments—from unstable regions to demanding infrastructures—planning and controlling risk at each stage." bullets={bullets} setView={setView} />;
}

function SolCompliance({ setView }:{ setView: (v: View)=>void }) {
  const bullets = [
    { Icon: FileCheck2,   text: 'Export/import compliance (FF/CHB).' },
    { Icon: FileText,     text: 'Regulatory documents & filings.' },
    { Icon: Settings,     text: 'Risk & audit readiness.' },
  ];
  return <SolutionPage title="Trade Compliance (FF/CHB)" deck="Freight Forwarding, Customs House Brokerage and trade regulations support." context="Compliance is critical in a global economy. We help navigate export and import rules with FF/CHB services and regulatory guidance to avoid fines and penalties." bullets={bullets} setView={setView} />;
}

function SolInsurance({ setView }:{ setView: (v: View)=>void }) {
  const bullets = [
    { Icon: ShieldCheck,  text: 'Cargo coverage via specialized agents.' },
    { Icon: FileText,     text: 'Claims documentation support.' },
  ];
  return <SolutionPage title="Cargo Insurance" deck="Cargo coverage via specialized agents to protect assets and minimize loss." context="Our network of specialized agents allows us to outsource insurance coverage regardless of location and program complexity—so your assets and investments stay protected." bullets={bullets} setView={setView} />;
}

function Solutions({ setView }:{ setView: (v: View)=>void }){
  return (
    <>
      <SolutionsHero />
      <SolutionsIntro />
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {SOLUTIONS.map(({key,title,icon:Icon,line})=> (
            <button key={key} onClick={()=>setView(('sol-' + key) as View)} className="text-left rounded-2xl border border-[#114C67]/30 p-4 bg-white hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#B6CE29]/30 grid place-items-center"><Icon className="w-5 h-5 text-[#114C67]"/></div>
                <h3 className="font-semibold text-[#114C67]">{title}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-700">{line}</p>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

/***************
 * Industries
 ***************/
function Industries(){
  const items = [
    { title: "Industrial & Manufacturing", line: "Better lead‑times, visibility and lower costs." },
    { title: "Consumer & Retail",          line: "Seasonality, MABD and PO/PPD consolidation." },
    { title: "Government & Infrastructure",line: "Tight compliance and coordinated deployments." },
    { title: "Humanitarian Relief & NGOs", line: "Rapid response in changing environments." },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-semibold text-[#114C67] mb-2">Industries</h2>
      <p className="text-gray-600 mb-6">Programs tailored to each market—demand, compliance and seasonality.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(({ title, line }) => (
          <div key={title} className="rounded-2xl overflow-hidden border border-[#114C67]/30 bg-white">
            <div className="h-28 bg-gray-100 grid place-items-center text-gray-400">Photo</div>
            <div className="p-4">
              <h3 className="font-semibold text-[#114C67]">{title}</h3>
              <p className="text-sm text-gray-700">{line}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/***************
 * About (no Carmen)
 ***************/
function AboutHero(){
  return (
    <section className="relative max-w-7xl mx-auto mt-6">
      <div className="relative h-56 md:h-72 w-full rounded-2xl overflow-hidden bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-black/10" />
        <div className="absolute inset-0 grid place-items-center text-gray-400">About hero image</div>
        <div className="absolute inset-0 flex items-end">
          <div className="p-6 md:p-8">
            <h1 className="text-white text-3xl md:text-5xl font-extrabold">About</h1>
            <p className="text-white/90 mt-2 max-w-3xl">TRACS is a non‑asset 4PL that designs, implements and manages customized logistics programs—working alongside your existing infrastructure.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutIntro(){
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="rounded-2xl border border-[#114C67]/30 p-5 bg-white">
          <h3 className="font-semibold text-[#114C67] mb-2">Who we are</h3>
          <p className="text-sm text-gray-700 leading-relaxed">We help organizations reach strategic and operational goals by designing, implementing and managing supply‑chain programs in‑house or from a control tower. Our non‑invasive approach means we work with your current teams and processes.</p>
        </div>
        <div className="h-40 md:h-48 rounded-2xl bg-gray-100 grid place-items-center text-gray-400">Team photo placeholder</div>
      </div>
    </section>
  );
}

function Leadership(){
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <h3 className="text-2xl font-semibold text-[#114C67] mb-4">Leadership</h3>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#114C67]/30 p-5 bg-white">
          <div className="h-28 rounded-xl bg-gray-100 grid place-items-center text-gray-400 mb-3">Salvador photo</div>
          <h4 className="font-semibold text-[#114C67]">Salvador O. Hernández — President</h4>
          <p className="text-sm text-gray-700 mt-1">Strategic, hands‑on leader with 25+ years across freight, retail supply chain and complex operations.</p>
          <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>International Transportation & Trading (1980s).</li>
            <li>Maersk Sea‑Land / CSX Lines (2000): Business Development & Strategy.</li>
            <li>Walmart Corporate (2002): warehousing & supply‑chain projects.</li>
            <li>KBR (2008): governance, procurement & Iraq base‑closure ops.</li>
            <li>Today at TRACS: unbiased control‑tower programs to improve profits and reduce logistics costs.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-[#114C67]/30 p-5 bg-white">
          <div className="h-28 rounded-xl bg-gray-100 grid place-items-center text-gray-400 mb-3">Jay photo</div>
          <h4 className="font-semibold text-[#114C67]">Jay A. Mejía — VP Operations</h4>
          <p className="text-sm text-gray-700 mt-1">Operator and builder of high‑performing logistics networks; CEO of Leon Cannon Logistics.</p>
          <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>2005–2009: growth and new markets; renombre a Leon Cannon Logistics.</li>
            <li>Expansión a dedicated, van, flatbed, refrigerated, LTL, RGN, OD, expedited, air & intermodal.</li>
            <li>Construyó equipo global y lideró resultados operativos en entornos complejos.</li>
            <li>Education: BSc Electrical & Mechanical Eng.; MSc Operations Management.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function MissionVision(){
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#114C67]/30 p-5 bg-white">
          <h4 className="font-semibold text-[#114C67] mb-2">Mission</h4>
          <p className="text-sm text-gray-700">A straightforward logistics & supply‑chain partner that bridges the gap between customers and the right providers—and develops, implements and manages programs when required.</p>
        </div>
        <div className="rounded-2xl border border-[#114C67]/30 p-5 bg-white">
          <h4 className="font-semibold text-[#114C67] mb-2">Vision</h4>
          <p className="text-sm text-gray-700">To be the most competitive and preferred outsourced partner for end users of 3PL services, domestically and internationally.</p>
        </div>
      </div>
    </section>
  );
}

function Values(){
  const items = [
    'Trust','Respect','Servant Leadership','Honesty & Integrity','Dependability & Accountability','Excellence & Quality','Passion & Purpose'
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <h3 className="text-2xl font-semibold text-[#114C67] mb-4">Values & Attributes</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(v=> (
          <div key={v} className="rounded-2xl border border-[#114C67]/20 bg-white p-4 text-sm text-gray-700">{v}</div>
        ))}
      </div>
    </section>
  );
}

function Objectives(){
  const items = [
    'Be Quick to Respond','Be Clear in Our Approach','Long‑Term Customer Oriented','Quality & Soundness','Create Added Value','Integrity: Honest, Ethical, Legal','Highly Competent Staff','Trusted, Reliable Partner'
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <h3 className="text-2xl font-semibold text-[#114C67] mb-4">Corporate Objectives</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(v=> (
          <div key={v} className="rounded-2xl border border-[#114C67]/20 bg-white p-4 text-sm text-gray-700">{v}</div>
        ))}
      </div>
    </section>
  );
}

function Timeline(){
  const items = ['1980s – Intl. Transportation & Trading','2000 – Maersk Sea‑Land / CSX (BD & Strategy)','2002 – Walmart (SC/Warehouse)','2008 – KBR (Governance/Iraq)','2013 – TRACS founded','Today – Global 4PL programs'];
  return (
    <section className="py-10" style={{background: BLUE}}>
      <div className="max-w-7xl mx-auto px-4 text-white">
        <h3 className="text-2xl font-semibold mb-4">Company Timeline</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {items.map((t,i)=> (
            <div key={i} className="rounded-2xl border border-white/30 p-4 text-sm">{t}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GlobalPresence(){
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h3 className="text-2xl font-semibold text-[#114C67] mb-4">Global Presence</h3>
      <div className="rounded-2xl border border-[#114C67]/30 p-5 bg-white">
        <p className="text-sm text-gray-700"><strong>Agencies:</strong> USA · Netherlands · Dubai · Pakistan · India · Spain · South Korea · Mexico · Japan · Panama · Dominican Rep.</p>
        <div className="mt-3 h-40 rounded-xl bg-gray-100 grid place-items-center text-gray-400">Map placeholder</div>
      </div>
    </section>
  );
}

function About(){
  return (
    <main>
      <AboutHero />
      <AboutIntro />
      <Leadership />
      <MissionVision />
      <Values />
      <Objectives />
      <Timeline />
      <GlobalPresence />
      <section className="mt-6 rounded-2xl bg-[#114C67] text-white p-6 max-w-7xl mx-auto flex items-center justify-between flex-col md:flex-row gap-4">
        <div className="text-lg font-semibold">Ready to connect?</div>
        <a href="#contact" className="bg-[#B6CE29] text-[#114C67] font-semibold px-4 py-2 rounded-xl">Contact Us</a>
      </section>
    </main>
  );
}

/***************
 * Contact
 ***************/
function Contact(){
  const [sent,setSent]=useState(false);
  return (
    <section id="contact" className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-[#114C67]/30 p-4 bg-white">
          <h3 className="font-semibold text-[#114C67] mb-2">Inquiry Form</h3>
          <form onSubmit={(e)=>{e.preventDefault();setSent(true);}} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="border rounded-xl px-3 py-2" placeholder="Name" required />
            <input className="border rounded-xl px-3 py-2" placeholder="Company" required />
            <input className="border rounded-xl px-3 py-2 md:col-span-2" placeholder="Email" type="email" required />
            <input className="border rounded-xl px-3 py-2 md:col-span-2" placeholder="Phone" />
            <textarea className="border rounded-xl px-3 py-2 md:col-span-2" rows={4} placeholder="Message" />
            <button className="bg-[#114C67] text-white font-semibold px-4 py-2 rounded-xl md:w-max">Send → sales@tracs-us.com</button>
            {sent && <p className="text-sm text-green-700 md:col-span-2">Thanks! We’ll reply within one business day.</p>}
          </form>
        </div>
        <div className="rounded-2xl border border-[#114C67]/30 p-4 bg-white space-y-2">
          <h3 className="font-semibold text-[#114C67] mb-2">Headquarters & Global Agencies</h3>
          <p className="text-sm"><strong>Headquarters:</strong> 1119 NW 122 St, Medley, FL 33178, USA</p>
          <p className="text-sm">USA (479) 715‑1879 · PR (787) 461‑3088</p>
          <p className="text-sm">shernandez@tracs‑us.com · sales@tracs‑us.com</p>
          <p className="text-sm"><strong>Agencies:</strong> USA · Netherlands · Dubai · Pakistan · India · Spain · South Korea · Mexico · Japan · Panama · Dominican Rep.</p>
          <div className="aspect-video rounded-xl bg-gray-100 grid place-items-center text-gray-400"><MapPin className="w-5 h-5"/> Map / Location</div>
        </div>
      </div>
    </section>
  );
}

/***************
 * Stay Connected (Newsletter)
 ***************/
function StayConnected(){
  const [sent,setSent]=useState(false);
  return (
    <section className="bg-[#F3F6F8] py-10">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-semibold text-[#114C67]">Stay Connected</h2>
          <p className="mt-2 text-gray-700 text-sm">Join the TRACS community to receive updates and useful guides that support your supply chain.</p>
        </div>
        <form onSubmit={(e)=>{e.preventDefault();setSent(true);}} className="grid md:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-[#114C67]/20">
          <input className="border rounded-xl px-3 py-2" placeholder="First Name" required/>
          <input className="border rounded-xl px-3 py-2" placeholder="Last Name" required/>
          <input className="border rounded-xl px-3 py-2 md:col-span-2" placeholder="Email Address" type="email" required/>
          <button className="md:col-span-2 bg-[#B6CE29] text-[#114C67] font-semibold px-5 py-2.5 rounded-xl w-max">Subscribe</button>
          {sent && <p className="md:col-span-2 text-sm text-green-700">Thanks! You’re on the list.</p>}
        </form>
      </div>
    </section>
  );
}

function Footer(){
  return (
    <footer className="bg-[#B6B6B6] text-[#114C67]">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-sm">Privacy Policy · Terms of Service</div>
        <div className="text-sm">LinkedIn · Instagram · Facebook</div>
      </div>
    </footer>
  );
}

/***************
 * App + simple runtime check
 ***************/
function runSelfChecks(){
  const keys = new Set(SOLUTIONS.map(s=>s.key));
  console.assert(keys.size === 8, "[Check] SOLUTIONS should have 8 unique keys");
}

export default function TracsLivePagesApp(){
  const [view,setView] = useState<View>("home");
  const [track,setTrack]=useState(false);
  runSelfChecks();
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header view={view} setView={setView} toggleTrack={()=>setTrack(true)} />
      <TrackOverlay open={track} close={()=>setTrack(false)} />

      {view==="home" && <Home/>}
      {view==="solutions" && <Solutions setView={setView} />}
      {view==="industries" && <Industries/>}
      {view==="about" && <About/>}
      {view==="contact" && <Contact/>}

      {/* Deep links for solution pages */}
      <div id="sol-4pl">{view==="sol-4pl" && <Sol4PL setView={setView}/>}</div>
      <div id="sol-ocean">{view==="sol-ocean" && <SolOcean setView={setView}/>}</div>
      <div id="sol-air">{view==="sol-air" && <SolAir setView={setView}/>}</div>
      <div id="sol-warehouse">{view==="sol-warehouse" && <SolWarehousing setView={setView}/>}</div>
      <div id="sol-ppd">{view==="sol-ppd" && <SolPPD setView={setView}/>}</div>
      <div id="sol-project">{view==="sol-project" && <SolProject setView={setView}/>}</div>
      <div id="sol-compliance">{view==="sol-compliance" && <SolCompliance setView={setView}/>}</div>
      <div id="sol-insurance">{view==="sol-insurance" && <SolInsurance setView={setView}/>}</div>

      <StayConnected />
      <Footer/>
    </main>
  );
}
