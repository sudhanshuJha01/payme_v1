const Card = ({children}) => {
  return (
    <div className="card flex flex-col items-center  bg-slate-950 md:w-full  lg:w-1/4 mx-auto max-h-3/4  p-7 pt-7 rounded-lg text-slate-200 text-lg font-sans font-medium gap-4 shadow-2xl border-slate-800 border-2 mt-20">
        {children}
    </div>
  )
}

export default Card