import svgPaths from "./svg-v9kica88li";
import imgContainer from "figma:asset/5fe655e20a7fa102f3d85c7cfb6cccf13980563c.png";

function Button() {
  return (
    <div className="bg-[#1c1c1e] h-[38px] relative rounded-[1.67772e+07px] shrink-0 w-[62px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px] shadow-[0px_0px_1px_0px_rgba(255,255,255,0.3)]" />
      <p className="absolute font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] font-medium leading-[20px] left-[31px] not-italic text-[#a1a1a1] text-[14px] text-center text-nowrap top-[9.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">全部</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#1c1c1e] h-[38px] relative rounded-[1.67772e+07px] shrink-0 w-[62px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px] shadow-[0px_0px_1px_0px_rgba(255,255,255,0.3)]" />
      <p className="absolute font-['Inter:Medium','Noto_Sans_SC:Medium','Noto_Sans_JP:Medium',sans-serif] font-medium leading-[20px] left-[31px] not-italic text-[#a1a1a1] text-[14px] text-center text-nowrap top-[9.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">动效</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#1c1c1e] h-[38px] relative rounded-[1.67772e+07px] shrink-0 w-[104px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px] shadow-[0px_0px_1px_0px_rgba(255,255,255,0.3)]" />
      <p className="absolute font-['Inter:Medium','Noto_Sans_SC:Medium','Noto_Sans_JP:Medium',sans-serif] font-medium leading-[20px] left-[52px] not-italic text-[#a1a1a1] text-[14px] text-center text-nowrap top-[9.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">逛逛，动效</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#1c1c1e] h-[38px] relative rounded-[1.67772e+07px] shrink-0 w-[62px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px] shadow-[0px_0px_1px_0px_rgba(255,255,255,0.3)]" />
      <p className="absolute font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] font-medium leading-[20px] left-[31px] not-italic text-[#a1a1a1] text-[14px] text-center text-nowrap top-[9.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">逛逛</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#1c1c1e] h-[38px] relative rounded-[1.67772e+07px] shrink-0 w-[62.133px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px] shadow-[0px_0px_1px_0px_rgba(255,255,255,0.3)]" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[31.5px] not-italic text-[#a1a1a1] text-[14px] text-center text-nowrap top-[9.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Icon</p>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#1c1c1e] h-[38px] relative rounded-[1.67772e+07px] shrink-0 w-[112.641px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px] shadow-[0px_0px_1px_0px_rgba(255,255,255,0.3)]" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[56.5px] not-italic text-[#a1a1a1] text-[14px] text-center text-nowrap top-[9.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Typography</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-start flex flex-wrap gap-[8px] items-start justify-center left-[173px] top-[63px] w-[601px]">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
      {[...Array(6).keys()].map((_, i) => (
        <Button4 key={i} />
      ))}
      {[...Array(2).keys()].map((_, i) => (
        <Button5 key={i} />
      ))}
    </div>
  );
}

function Frame() {
  return <div className="bg-[#1c1c1e] h-[198px] rounded-[16px] shadow-[0px_0px_1px_0px_rgba(255,255,255,0.3)] w-[241.391px]" />;
}

function MainContent() {
  return (
    <div className="absolute h-[678px] left-[74px] top-[65px] w-[1024px]" data-name="Main Content">
      <Frame1 />
      <div className="absolute flex h-[202.183px] items-center justify-center left-[-28px] top-[186px] w-[244.81px]" style={{ "--transform-inner-width": "241.390625", "--transform-inner-height": "198" } as React.CSSProperties}>
        <div className="flex-none rotate-[1deg]">
          {[...Array(4).keys()].map((_, i) => (
            <Frame key={i} />
          ))}
        </div>
      </div>
      <div className="absolute flex h-[206.304px] items-center justify-center left-[235.33px] top-[188.16px] w-[248.154px]" style={{ "--transform-inner-width": "241.390625", "--transform-inner-height": "198" } as React.CSSProperties}>
        <div className="flex-none rotate-[358deg]" />
      </div>
      <div className="absolute flex h-[206.304px] items-center justify-center left-[759px] top-[190.22px] w-[248.154px]" style={{ "--transform-inner-width": "241.390625", "--transform-inner-height": "198" } as React.CSSProperties}>
        <div className="flex-none rotate-[358deg]" />
      </div>
      <div className="absolute flex h-[202.183px] items-center justify-center left-[501px] top-[192.22px] w-[244.81px]" style={{ "--transform-inner-width": "241.390625", "--transform-inner-height": "198" } as React.CSSProperties}>
        <div className="flex-none rotate-[1deg]" />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[488.19px] not-italic text-[14px] text-center text-neutral-600 text-nowrap top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">© 2025 DesignVault. Curated for designers.</p>
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute bg-neutral-950 box-border content-stretch flex flex-col h-[117px] items-start left-0 pb-0 pt-[49px] px-[98px] top-[791px] w-[1172px]" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none" />
      <Paragraph />
    </div>
  );
}

function App() {
  return (
    <div className="absolute bg-[#121212] h-[908px] left-0 top-0 w-[1172px]" data-name="App">
      <MainContent />
      <Footer />
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Container">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgContainer} />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[32px]" />
    </div>
  );
}

function Heading() {
  return (
    <div className="basis-0 grow h-[28px] min-h-px min-w-px relative shrink-0" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[28px] relative w-full">
        <p className="absolute font-['Kameron:Regular',sans-serif] font-normal leading-[28px] left-0 text-[18px] text-nowrap text-white top-0 tracking-[0.36px] whitespace-pre">Gilded Collection</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center left-[24px] top-[16px] w-[182.906px]" data-name="Container">
      <Container />
      <Heading />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[9px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #D4D4D4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, #D4D4D4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute border border-neutral-800 border-solid h-[36px] left-[903.22px] rounded-[10px] top-[14px] w-[96.773px]" data-name="Button">
      <Icon />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[59.5px] not-italic text-[14px] text-center text-neutral-300 text-nowrap top-[7.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Submit</p>
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-[#1c1c1e] h-[40px] left-0 rounded-[10px] top-0 w-[512px]" data-name="Input">
      <div className="box-border content-stretch flex h-[40px] items-center overflow-clip pl-[40px] pr-[12px] py-[4px] relative rounded-[inherit] w-[512px]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-neutral-600 text-nowrap tracking-[-0.1504px] whitespace-pre">Search for resources...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M14 14L11.1067 11.1067" id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p107a080} id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[40px] left-[299.06px] top-[12px] w-[512px]" data-name="Container">
      <Input />
      <Icon1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Button6 />
      <Container2 />
    </div>
  );
}

function App1() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[65px] items-start left-0 pb-px pt-0 px-[74px] top-0 w-[1172px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none" />
      <Container3 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="深色设计搜集首页">
      <App />
      <App1 />
    </div>
  );
}