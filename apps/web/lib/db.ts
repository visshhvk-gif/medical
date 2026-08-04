import { ClinicProfile, Patient, Prescription } from "./types";

const DB_NAME = "MedicalPrescriptionApp";
const DB_VERSION = 1;

interface DBStores {
  clinic: ClinicProfile;
  patients: Patient;
  prescriptions: Prescription;
}

let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains("clinic")) {
        database.createObjectStore("clinic", { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains("patients")) {
        const patientStore = database.createObjectStore("patients", {
          keyPath: "id",
        });
        patientStore.createIndex("name", "name", { unique: false });
        patientStore.createIndex("phone", "phone", { unique: false });
      }

      if (!database.objectStoreNames.contains("prescriptions")) {
        const prescriptionStore = database.createObjectStore("prescriptions", {
          keyPath: "id",
        });
        prescriptionStore.createIndex("patientId", "patientId", {
          unique: false,
        });
        prescriptionStore.createIndex("createdAt", "createdAt", {
          unique: false,
        });
      }
    };
  });
}

export async function saveClinic(clinic: ClinicProfile, userId: string): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(["clinic"], "readwrite");
    const store = tx.objectStore("clinic");
    const clinicWithUser = { ...clinic, id: userId };
    const request = store.put(clinicWithUser);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getClinic(userId: string): Promise<ClinicProfile | null> {
  const database = await initDB();

  // First, try to get clinic with userId
  const userClinic = await new Promise<ClinicProfile | null>((resolve, reject) => {
    const tx = database.transaction(["clinic"], "readonly");
    const store = tx.objectStore("clinic");
    const request = store.get(userId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as ClinicProfile | null);
  });

  if (userClinic) {
    return userClinic;
  }

  // If not found, check for old "clinic-1" key
  const legacyClinic = await new Promise<ClinicProfile | null>((resolve, reject) => {
    const tx = database.transaction(["clinic"], "readonly");
    const store = tx.objectStore("clinic");
    const request = store.get("clinic-1");

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as ClinicProfile | null);
  });

  if (legacyClinic) {
    // Migrate to new userId key in a separate transaction
    await new Promise<void>((resolve, reject) => {
      const tx = database.transaction(["clinic"], "readwrite");
      const store = tx.objectStore("clinic");
      const migrateRequest = store.put({ ...legacyClinic, id: userId });

      migrateRequest.onerror = () => reject(migrateRequest.error);
      migrateRequest.onsuccess = () => resolve();
    });

    return legacyClinic;
  }

  return null;
}

export async function savePatient(patient: Patient): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(["patients"], "readwrite");
    const store = tx.objectStore("patients");
    const request = store.put(patient);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getPatients(): Promise<Patient[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(["patients"], "readonly");
    const store = tx.objectStore("patients");
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as Patient[]);
  });
}

export async function searchPatients(query: string): Promise<Patient[]> {
  const database = await initDB();
  const allPatients = await getPatients();
  const lowerQuery = query.toLowerCase();

  return allPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.phone?.includes(query)
  );
}

export async function getPatient(id: string): Promise<Patient | null> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(["patients"], "readonly");
    const store = tx.objectStore("patients");
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as Patient | null);
  });
}

export async function savePrescription(prescription: Prescription): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(["prescriptions"], "readwrite");
    const store = tx.objectStore("prescriptions");
    const request = store.put(prescription);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getPatientPrescriptions(
  patientId: string
): Promise<Prescription[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(["prescriptions"], "readonly");
    const store = tx.objectStore("prescriptions");
    const index = store.index("patientId");
    const request = index.getAll(patientId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as Prescription[]);
  });
}

export async function getLatestPrescription(
  patientId: string
): Promise<Prescription | null> {
  const prescriptions = await getPatientPrescriptions(patientId);
  if (prescriptions.length === 0) return null;
  return prescriptions.sort((a, b) => b.createdAt - a.createdAt)[0];
}

export async function deleteClinic(): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(["clinic"], "readwrite");
    const store = tx.objectStore("clinic");
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
