import udayHealthCareLogo from "../assets/uday-health-care-logo.png";

export default function UdayHealthCareLogo() {
    return (
        <div className="w-48 max-w-full md:w-60" aria-label="Uday Health Care">
            <img
                src={udayHealthCareLogo}
                alt="Uday Health Care"
                className="w-full object-contain"
            />
        </div>
    );
}
