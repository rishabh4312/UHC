import clinicLogo from "../assets/clinic-logo.png";

export default function UdayHealthCareLogo() {

    return (

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">

            {/* LOGO IMAGE */}
            <div className="bg-white rounded-3xl shadow-lg p-4 border border-slate-200 flex-shrink-0">
                <img
                    src={clinicLogo}
                    alt="Uday Health Care"
                    className="w-28 md:w-36 object-contain"
                />
            </div>

            {/* TITLE */}
            <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                    Uday <span className="text-indigo-600">Health Care</span>
                </h1>
                <p className="text-slate-500 text-sm md:text-base mt-2 font-medium tracking-normal max-w-xl">
                    Neurology Clinic Management System
                </p>
            </div>

        </div>
    );
}