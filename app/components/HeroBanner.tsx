interface BannerProp{
    title:React.ReactNode,
    subheading?:string,
    button?:{
        label:string,
        link:string
    }
}

import Homehero from '../assets/home-hero.webp';

export default function Banner({ title, subheading, button}:BannerProp) {
  return (
    <section>
      <div className="h-dvh relative w-full px-6 md:px-10 pt-[3rem] md:pt-[6rem]">
        <img
          src={Homehero}
          alt="Home hero"
          className="object-cover absolute z-[1] inset-0 size-full"
        />
        <div className="w-full relative z-[2] h-full">
          <h1 className='text-[52px] tracking-normal whitespace-pre-line leading-[1.2em] font-bold'>{ title }</h1>
          <p className='text-base font-medium leading-[1.4em] mt-3 max-w-[30rem]'>
           {subheading}
          </p>
          { button && 
           <a href={ button.link} className='bg-orange-500 text-white rounded-full mt-6 cursor-pointer hover:bg-orange-500/80 px-6 py-4 leading-[1em] font-bold block w-fit'>
              {button.label}
              </a>
          }
             
        </div>
      </div>
    </section>
  );
}
