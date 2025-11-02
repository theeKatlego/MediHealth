namespace BookMD.Domain.Enums
{
    public enum MedicalSpecialty
    {
        // Primary Care (100–199)
        FamilyMedicine = 100,
        InternalMedicine = 101,
        Pediatrics = 102,
        Geriatrics = 103,
        GeneralPractice = 104,

        // Surgical Specialties (200–299)
        GeneralSurgery = 200,
        CardiothoracicSurgery = 201,
        Neurosurgery = 202,
        OrthopedicSurgery = 203,
        PlasticSurgery = 204,
        Urology = 205,
        VascularSurgery = 206,
        ColorectalSurgery = 207,
        Otolaryngology = 208, // ENT
        TransplantSurgery = 209,
        PediatricSurgery = 210,
        TraumaSurgery = 211,

        // Internal Medicine Subspecialties (300–399)
        Cardiology = 300,
        Endocrinology = 301,
        Gastroenterology = 302,
        Hematology = 303,
        InfectiousDisease = 304,
        Nephrology = 305,
        Oncology = 306,
        Pulmonology = 307,
        Rheumatology = 308,
        AllergyAndImmunology = 309,

        // Diagnostic Specialties (400–499)
        Pathology = 400,
        Radiology = 401,
        NuclearMedicine = 402,
        DiagnosticImaging = 403,

        // Emergency and Critical Care (500–599)
        EmergencyMedicine = 500,
        CriticalCareMedicine = 501,
        Anesthesiology = 502,
        PainMedicine = 503,

        // Obstetrics and Gynecology (600–699)
        ObstetricsAndGynecology = 600,
        ReproductiveEndocrinology = 601,
        MaternalFetalMedicine = 602,
        GynecologicOncology = 603,
        Urogynecology = 604,

        // Neurological and Psychiatric Specialties (700–799)
        Neurology = 700,
        Psychiatry = 701,
        ChildAndAdolescentPsychiatry = 702,
        GeriatricPsychiatry = 703,
        Neuropsychiatry = 704,

        // Musculoskeletal and Rehabilitation (800–899)
        PhysicalMedicineAndRehabilitation = 800,
        SportsMedicine = 801,
        OccupationalMedicine = 802,

        // Dermatology and Eye Care (900–999)
        Dermatology = 900,
        Ophthalmology = 901,
        Optometry = 902,

        // Public Health and Preventive Medicine (1000–1099)
        PreventiveMedicine = 1000,
        PublicHealth = 1001,
        OccupationalHealth = 1002,
        AerospaceMedicine = 1003,

        // Laboratory and Research Specialties (1100–1199)
        MedicalGenetics = 1100,
        MolecularMedicine = 1101,
        ClinicalPharmacology = 1102,
        LaboratoryMedicine = 1103,

        // Dentistry and Oral Specialties (1200–1299)
        Dentistry = 1200,
        OralAndMaxillofacialSurgery = 1201,
        Orthodontics = 1202,
        Periodontics = 1203,
        Endodontics = 1204,
        Prosthodontics = 1205,
        PediatricDentistry = 1206,

        // Other Specialties (1300–1399)
        PalliativeCare = 1300,
        SleepMedicine = 1301,
        AddictionMedicine = 1302,
        HospitalMedicine = 1303,
        ForensicMedicine = 1304,
        TropicalMedicine = 1305,
        Immunopathology = 1306,
        NuclearRadiology = 1307
    }
}
