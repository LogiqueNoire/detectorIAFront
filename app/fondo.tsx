
const Fondo = ({color1, color2}: {color1: string, color2: string}) => {
    return (
        <div id="lienzo_fijo" className="w-480 h-220 fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none">
            <div id="derecha_atras" className={`w-65 h-30 ${color1} absolute z-0 rotate-75 top-60 left-265`}></div>
            <div id="gordo_arriba" className={`w-45 h-62 ${color2} absolute z-0 rotate-15 top-38 left-233`}></div>
            <div id="echado_arriba" className={`w-58 h-30 ${color1} absolute z-1 rotate-355 top-10 left-210`}></div>
            <div id="cuadrado" className={`w-45 h-62 ${color2} absolute z-1 rotate-45 top-8 left-155`}></div>
            <div id="cuadrado" className={`w-35 h-35 ${color1} absolute z-1 rotate-45 top-45 left-155`}></div>
            <div id="cuadrado" className={`w-45 h-62 ${color2} absolute z-1 rotate-8 top-72 left-148`}></div>
            <div id="flaco_central" className={`w-13 h-60 ${color1} absolute z-1 rotate-342 top-90 left-230`}></div>
            <div id="largo_der" className={`w-60 h-15 ${color1} absolute z-2 rotate-25 top-125 left-262`}></div>
            <div id="cuadrado" className={`w-25 h-42 ${color2} absolute z-3 rotate-0 top-100 left-285`}></div>
            <div id="echado-ab" className={`w-40 h-30 ${color2} absolute z-3 rotate-15 top-160 left-185`}></div>
            <div id="pequeño" className={`w-15 h-35 ${color1} absolute z-3 rotate-12 top-125 left-185`}></div>
            <div id="echado_izq" className={`w-25 h-50 ${color2} absolute z-3 rotate-60 top-80 left-190`}></div>
            <div id="gordo_abajo" className={`w-45 h-60 ${color2} absolute z-4 rotate-25 top-125 left-235`}></div>
            <div id="echado_abajo" className={`w-65 h-30 ${color1} absolute z-4 rotate-355 top-175 left-175`}></div>
        </div>
    )
}

export default Fondo