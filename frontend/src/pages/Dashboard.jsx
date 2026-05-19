import { useEffect, useState } from "react";

import PatientForm from "../components/PatientForm";

import PatientDetailsModal from "../components/PatientDetailsModal";

import { getAllPatients } from "../services/patientService";


export default function Dashboard() {

    const [patients, setPatients] = useState([]);

    const [search, setSearch] = useState("");

    const [selectedPatient, setSelectedPatient] = useState(null);



    // LOAD PATIENTS
    const loadPatients = async () => {

        try {

            const response = await getAllPatients();

            setPatients(response.data);

        } catch (error) {

            console.log(error);
        }
    };


    useEffect(() => {

        loadPatients();

    }, []);




    // FILTER PATIENTS
    const filteredPatients = patients.filter((patient) => {

        return patient.full_name
            .toLowerCase()
            .includes(search.toLowerCase());
    });



    return (

        <div className="min-h-screen bg-gray-100 p-6">

            <h1 className="text-4xl font-bold mb-6">
                UdayHealthCare Clinic
            </h1>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* LEFT */}
                <PatientForm refreshPatients={loadPatients} />


                {/* RIGHT */}
                <div className="bg-white shadow-lg rounded-xl p-6">

                    <div className="flex justify-between items-center mb-4">

                        <h2 className="text-2xl font-bold">
                            Patients
                        </h2>


                        <input
                            type="text"
                            placeholder="Search patient..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        />

                    </div>



                    <div className="overflow-auto">

                        <table className="w-full border">

                            <thead className="bg-gray-200">

                                <tr>
                                    <th className="border p-2">ID</th>
                                    <th className="border p-2">Name</th>
                                    <th className="border p-2">Mobile</th>
                                    <th className="border p-2">Age</th>
                                    <th className="border p-2">Action</th>
                                </tr>

                            </thead>


                            <tbody>

                                {
                                    filteredPatients.map((patient) => (

                                        <tr key={patient.id}>

                                            <td className="border p-2">
                                                {patient.id}
                                            </td>

                                            <td className="border p-2">
                                                {patient.full_name}
                                            </td>

                                            <td className="border p-2">
                                                {patient.mobile}
                                            </td>

                                            <td className="border p-2">
                                                {patient.age}
                                            </td>

                                            <td className="border p-2">

                                                <button
                                                    onClick={() => setSelectedPatient(patient)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded-lg"
                                                >
                                                    Open
                                                </button>

                                            </td>

                                        </tr>
                                    ))
                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>



            {/* MODAL */}
            {
                selectedPatient && (

                    <PatientDetailsModal
                        patient={selectedPatient}
                        onClose={() => setSelectedPatient(null)}
                    />
                )
            }

        </div>
    );
}