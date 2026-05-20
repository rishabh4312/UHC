import clinicLogo from "../assets/clinic-logo.png";

export default function UdayHealthCareLogo() {

    return (

        <div className="flex items-center gap-6 flex-wrap">

            {/* LOGO IMAGE */}
            <div className="bg-white rounded-3xl shadow-2xl p-3 border border-slate-200">

                <img
                    src={clinicLogo}
                    alt="Uday Health Care"
                    className="w-[220px] md:w-[320px] object-contain"
                />

            </div>



            {/* TITLE */}
            <div>

                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-800 leading-none">

                    Uday{" "}

                    <span className="text-indigo-700">
                        Health Care
                    </span>

                </h1>



                <p className="text-slate-500 text-lg md:text-xl mt-3 font-medium tracking-wide">

                    Neurology Clinic Management System

                </p>

            </div>

        </div>
    );
}