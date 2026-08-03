"use client";

import { useRef } from "react";
import { ClinicProfile, Patient } from "@/lib/types";
import { Button } from "@workspace/ui/components/button";
import { format } from "date-fns";

interface PrescriptionPreviewProps {
  clinic: ClinicProfile;
  patient: Patient;
  formData: {
    diagnosis: string;
    medicines: any[];
    advice: string;
    followUpDate: string;
  };
  onBack: () => void;
  onComplete: () => void;
}

export default function PrescriptionPreview({
  clinic,
  patient,
  formData,
  onBack,
  onComplete,
}: PrescriptionPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (printWindow && printRef.current) {
      printWindow.document.write(printRef.current.innerHTML);
      printWindow.document.close();
      printWindow.print();
    }
  }

  function handleSaveAsPDF() {
    const element = printRef.current;
    if (!element) return;

    const opt = {
      margin: 10,
      filename: `prescription-${patient.name}-${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
    };

    // For now, we'll use a simple approach with html2pdf if available
    // Otherwise, just trigger browser print dialog
    handlePrint();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 border-b bg-background z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex gap-3 justify-between items-center">
          <Button variant="ghost" onClick={onBack}>
            ← Edit
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveAsPDF}>
              📄 Save as PDF
            </Button>
            <Button onClick={handlePrint}>🖨️ Print</Button>
            <Button onClick={onComplete} variant="ghost">
              ✓ Done
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div
          ref={printRef}
          className="bg-white p-8 rounded shadow-sm border print:shadow-none print:border-none"
          style={{ minHeight: "297mm" }}
        >
          {/* Header */}
          <div className="border-b-2 pb-6 mb-6 text-center">
            <h1 className="text-3xl font-bold">{clinic.name}</h1>
            <p className="text-gray-600 mt-1">Dr. {clinic.doctorName}</p>
            {clinic.registrationNumber && (
              <p className="text-sm text-gray-500">
                Reg. No.: {clinic.registrationNumber}
              </p>
            )}
            {clinic.address && (
              <p className="text-sm text-gray-500 mt-1">{clinic.address}</p>
            )}
            {clinic.phone && (
              <p className="text-sm text-gray-500">{clinic.phone}</p>
            )}
          </div>

          {/* Patient & Date Info */}
          <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
            <div>
              <div className="font-semibold text-gray-700 mb-2">Patient Information</div>
              <div className="space-y-1 text-gray-600">
                <div>
                  <span className="font-medium">Name:</span> {patient.name}
                </div>
                {patient.age && (
                  <div>
                    <span className="font-medium">Age:</span> {patient.age}
                  </div>
                )}
                {patient.gender && (
                  <div>
                    <span className="font-medium">Gender:</span> {patient.gender}
                  </div>
                )}
                {patient.phone && (
                  <div>
                    <span className="font-medium">Phone:</span> {patient.phone}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-2">Date</div>
              <div className="text-gray-600">
                {format(new Date(), "PPP")}
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="mb-8">
            <div className="font-semibold text-gray-700 mb-2">
              Diagnosis / Chief Complaint:
            </div>
            <div className="text-gray-600 whitespace-pre-wrap border-l-4 border-blue-200 pl-4">
              {formData.diagnosis}
            </div>
          </div>

          {/* Medicines */}
          <div className="mb-8">
            <div className="font-semibold text-gray-700 mb-3">Prescription:</div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2 font-semibold">Medicine</th>
                  <th className="text-left py-2 font-semibold">Dosage</th>
                  <th className="text-left py-2 font-semibold">Frequency</th>
                  <th className="text-left py-2 font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody>
                {formData.medicines.map((medicine, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-3">{medicine.name}</td>
                    <td className="py-3">{medicine.dosage}</td>
                    <td className="py-3">{medicine.frequency}</td>
                    <td className="py-3">
                      {medicine.duration}
                      {medicine.instructions && ` (${medicine.instructions})`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Advice */}
          {formData.advice && (
            <div className="mb-8">
              <div className="font-semibold text-gray-700 mb-2">
                Advice & Instructions:
              </div>
              <div className="text-gray-600 whitespace-pre-wrap border-l-4 border-green-200 pl-4">
                {formData.advice}
              </div>
            </div>
          )}

          {/* Follow-up */}
          {formData.followUpDate && (
            <div className="mb-8">
              <div className="font-semibold text-gray-700">Follow-up Date:</div>
              <div className="text-gray-600">
                {format(new Date(formData.followUpDate), "PPP")}
              </div>
            </div>
          )}

          {/* Signature space */}
          <div className="mt-12 flex justify-end">
            <div className="text-center">
              <div style={{ height: "60px" }}></div>
              <div className="border-t border-gray-400 pt-2">
                <div className="font-semibold">Dr. {clinic.doctorName}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
