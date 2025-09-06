export const doctorDetailCard = {
    "gender": "F",
    "contactNumber": "9897040350",
    "diagnosis": "Choroidal neovascular membrane in left eye",
    "surgery": "Intravitreal procedure for delivering Eylea in left eye under Sedation",
    "totalClaimedAmount": 65000,
    "billNumber": "SEC01\\25-26\\IPD\\35648",
    "billDate": "2025-08-08",
    "hospital": "Shroff Eye Centre",
    "patientName": "Mrs. SEEMA GARG",
    "patientID": "63918/66624",
    "age": 60,
    "billItems": [
      {"description": "D-303 Plain Towel", "quantity": 1.0, "unitPrice": 41, "amount": 41},
      {"description": "Inj. Decadron 2 ML (8mg)", "quantity": 1.0, "unitPrice": 12, "amount": 12},
      {"description": "Surgical spirit", "quantity": 1.0, "unitPrice": 15, "amount": 15},
      {"description": "Pad syringe", "quantity": 1.0, "unitPrice": 25, "amount": 25},
      {"description": "Cap Proxicycin", "quantity": 1.0, "unitPrice": 74, "amount": 74},
      {"description": "Tab Alpraz", "quantity": 1.0, "unitPrice": 12, "amount": 12},
      {"description": "Tab Rantac 150 mg", "quantity": 1.0, "unitPrice": 15, "amount": 15},
      {"description": "Ciplox eye ointment", "quantity": 1.0, "unitPrice": 35, "amount": 35}
    ],
    "tariffMatches": [
      {
        "description": "COST OF EYLEA INJECTION",
        "billedAmount": 55000,
        "tariffService": "PACKAGE CHARGE FOR INJECTION EYLEA",
        "tariffPrice": 65000,
        "variance": -10000,
        "classification": "UNDERCHARGED",
        "category": "RETINA & VITREOUS SURGERY"
      },
      {
        "description": "ROOM RENT(SHORT ADMISSION)",
        "billedAmount": 800,
        "tariffService": "DAY CARE/CUBICLE CHARGES INCLUDING NURSING CARE - SHORT ADMISSION",
        "tariffPrice": 1000,
        "variance": -200,
        "classification": "UNDERCHARGED",
        "category": "NURSING HOME CHARGES"
      }
    ],
    "totalBillAmount": 65000,
    "admissibleAmount": 55800,
    "tariffAmount": 66000,
    "variance": -10200,
    "netAdmissiblePayable": 55800,
    "treatmentAppropriateness": 75,
    "totalBillItems": 20,
    "questionableItems": 6,
    "questionableItemList": [
      "Tobacin eye drop", 
      "Vigamox eye drop", 
      "Ciplox eye ointment", 
      "Cap.Proxieyion", 
      "Tab Alprox 0.25 mg", 
      "Tab Rantac 150 mg"
    ],
    "missingExpectedItems": [],
    "recommendations": {
      "reviewItems": [
        "Tobacin eye drop", 
        "Vigamox eye drop", 
        "Ciplox eye ointment", 
        "Cap.Proxieyion", 
        "Tab Alprox 0.25 mg", 
        "Tab Rantac 150 mg"
      ]
    }
  };
  
  export const patientsList = [
    {
      id: "9599915873",
      patientName: "Mrs. SEEMA GARG",
      hospital: "Shroff Eye Centre",
      billDate: "2025-08-08",
      totalAmount: 65000,
      diagnosis: "Choroidal neovascular membrane in left eye"
    },
    {
      id: "12345-67890",
      patientName: "Mr. RAJESH KUMAR",
      hospital: "Apollo Hospital",
      billDate: "2025-08-15",
      totalAmount: 45000,
      diagnosis: "Cataract surgery right eye"
    }
  ];
  