"use client";

import { useState } from "react";
import { Medicine } from "@/lib/types";
import { searchMedicines, getMedicineByName } from "@/lib/medicines";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

interface MedicineSelectorProps {
  medicines: Medicine[];
  onAdd: (medicine: Medicine) => void;
  onRemove: (id: string) => void;
}

export default function MedicineSelector({
  medicines,
  onAdd,
  onRemove,
}: MedicineSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");

  const frequencies = [
    "Once daily (24h)",
    "Twice daily (12h)",
    "Three times daily (8h)",
    "Four times daily (6h)",
    "As needed",
    "Before food",
    "After food",
  ];

  function handleSearch(query: string) {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchMedicines(query);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }

  function handleSelectMedicine(medicine: any) {
    setSelectedMedicine(medicine);
    setSearchQuery(medicine.name);
    setSuggestions([]);
    setDosage(medicine.dosages?.[0] || "");
    setFrequency(medicine.frequencies?.[0] || "");
  }

  function handleAddMedicine() {
    if (!selectedMedicine || !dosage || !frequency || !duration) {
      alert("Please fill all fields");
      return;
    }

    const newMedicine: Medicine = {
      id: `medicine-${Date.now()}`,
      name: selectedMedicine.name,
      dosage,
      frequency,
      duration,
      instructions,
    };

    onAdd(newMedicine);

    // Reset form
    setSearchQuery("");
    setSelectedMedicine(null);
    setDosage("");
    setFrequency("");
    setDuration("");
    setInstructions("");
    setSuggestions([]);
  }

  return (
    <div className="space-y-6">
      {/* Medicine search and add */}
      <div className="space-y-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search medicine by name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 border rounded mt-1 bg-background shadow-md z-10 max-h-40 overflow-y-auto">
              {suggestions.map((medicine) => (
                <button
                  key={medicine.name}
                  onClick={() => handleSelectMedicine(medicine)}
                  className="w-full text-left px-4 py-2 hover:bg-accent text-sm"
                >
                  {medicine.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedMedicine && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Dosage</label>
              <Select value={dosage} onValueChange={setDosage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedMedicine.dosages?.map((d: string) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Frequency</label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(selectedMedicine.frequencies || frequencies).map(
                    (f: string) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Duration</label>
              <Input
                type="text"
                placeholder="e.g. 5 days, 2 weeks"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Special Instructions</label>
              <Input
                type="text"
                placeholder="e.g. with food"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            <Button onClick={handleAddMedicine} className="col-span-2">
              Add Medicine
            </Button>
          </div>
        )}
      </div>

      {/* Medicines list */}
      {medicines.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Added Medicines</h3>
          {medicines.map((medicine) => (
            <div
              key={medicine.id}
              className="flex items-start justify-between p-3 border rounded bg-muted"
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{medicine.name}</div>
                <div className="text-xs text-muted-foreground">
                  {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                </div>
                {medicine.instructions && (
                  <div className="text-xs text-muted-foreground">
                    ({medicine.instructions})
                  </div>
                )}
              </div>
              <button
                onClick={() => onRemove(medicine.id)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
