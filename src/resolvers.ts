import { enlistedUserColumns, officerUserColumns } from "./constants.js"
import { getEnlistedWorksheet, getOfficerWorksheet } from "./helpers.js";

export const resolvers = {
  Query: {
    getEnlistedUser: async (_: any, { id }: { id: string }) => {
      const { worksheet, lastModifiedAt: lastMod } = await getEnlistedWorksheet()
      const foundUserRow = worksheet
        .getColumn(enlistedUserColumns.DOD_ID)
        .values.indexOf(id);
      if (foundUserRow !== -1) {
        return {
          Grade: worksheet
            .getRow(foundUserRow)
            .getCell(enlistedUserColumns.Grade).value,
          DUTYTITLE: worksheet
            .getRow(foundUserRow)
            .getCell(enlistedUserColumns.DUTYTITLE).value,
          AMU: worksheet.getRow(foundUserRow).getCell(enlistedUserColumns.AMU)
            .value,
          DOD_ID: worksheet
            .getRow(foundUserRow)
            .getCell(enlistedUserColumns.DOD_ID).value,
          ATP31: worksheet
            .getRow(foundUserRow)
            .getCell(enlistedUserColumns.ATP31).value,
          AFC291_01: worksheet
            .getRow(foundUserRow)
            .getCell(enlistedUserColumns.AFC291_01).value,
          AMF: worksheet.getRow(foundUserRow).getCell(enlistedUserColumns.AMF)
            .value,
          MPF: worksheet.getRow(foundUserRow).getCell(enlistedUserColumns.MPF)
            .value,
          MAJCOM: worksheet
            .getRow(foundUserRow)
            .getCell(enlistedUserColumns.MAJCOM).value,
          Country: worksheet
            .getRow(foundUserRow)
            .getCell(enlistedUserColumns.Country).value,
          BASE_LOC: worksheet
            .getRow(foundUserRow)
            .getCell(enlistedUserColumns.BASE_LOC).value,
          Org_type: worksheet
            .getRow(foundUserRow)
            .getCell(enlistedUserColumns.Org_type).value,
          EOPDate: worksheet
            .getRow(foundUserRow)
            .getCell(enlistedUserColumns.EOPDate).value,
          Last_Name: worksheet
            .getRow(foundUserRow)
            .getCell(enlistedUserColumns.Last_Name).value,
          First_name: worksheet
            .getRow(foundUserRow)
            .getCell(enlistedUserColumns.First_name).value,
          Middle_Name: worksheet
            .getRow(foundUserRow)
            .getCell(enlistedUserColumns.Middle_Name).value,
          userType: "Enlisted",
          lastModifiedAt: lastMod.toString(),
        };
      }
      return null;
    },
    getOfficerUser: async (_: any, { id }: { id: string }) => {
      const { worksheet, lastModifiedAt: lastMod } = await getOfficerWorksheet()
      const foundUserRow = worksheet
        .getColumn(officerUserColumns.DOD_ID)
        .values.indexOf(id);
      if (foundUserRow !== -1) {
        return {
          ANB2: worksheet.getRow(foundUserRow).getCell(officerUserColumns.ANB2)
            .value,
          DOD_ID: worksheet
            .getRow(foundUserRow)
            .getCell(officerUserColumns.DOD_ID).value,
          ATP31: worksheet
            .getRow(foundUserRow)
            .getCell(officerUserColumns.ATP31).value,
          CAS3: worksheet.getRow(foundUserRow).getCell(officerUserColumns.CAS3)
            .value,
          AMF: worksheet.getRow(foundUserRow).getCell(officerUserColumns.AMF)
            .value,
          Grade: worksheet
            .getRow(foundUserRow)
            .getCell(officerUserColumns.Grade).value,
          DUTYTITLE: worksheet
            .getRow(foundUserRow)
            .getCell(officerUserColumns.DUTYTITLE).value,
          MPF: worksheet.getRow(foundUserRow).getCell(officerUserColumns.MPF)
            .value,
          CMD: worksheet.getRow(foundUserRow).getCell(officerUserColumns.CMD)
            .value,
          MAJCOM: worksheet
            .getRow(foundUserRow)
            .getCell(officerUserColumns.MAJCOM).value,
          Country: worksheet
            .getRow(foundUserRow)
            .getCell(officerUserColumns.Country).value,
          BASE_LOC: worksheet
            .getRow(foundUserRow)
            .getCell(officerUserColumns.BASE_LOC).value,
          org_kind: worksheet
            .getRow(foundUserRow)
            .getCell(officerUserColumns.org_kind).value,
          EOPDate: worksheet
            .getRow(foundUserRow)
            .getCell(officerUserColumns.EOPDate).value,
          Last_Name: worksheet
            .getRow(foundUserRow)
            .getCell(officerUserColumns.Last_Name).value,
          First_name: worksheet
            .getRow(foundUserRow)
            .getCell(officerUserColumns.First_name).value,
          Middle_Name: worksheet
            .getRow(foundUserRow)
            .getCell(officerUserColumns.Middle_Name).value,
          userType: "Officer",
          lastModifiedAt: lastMod.toString(),
        };
      }
      return null;
    },
    getUser: async (_: any, { id }: { id: string }) => {
      // First check officer list
      const { worksheet: officerWorksheet, lastModifiedAt: officerLastMod } = await getOfficerWorksheet()
      const foundOfficerUserRow = officerWorksheet
        .getColumn(officerUserColumns.DOD_ID)
        .values.indexOf(id);

      if (foundOfficerUserRow !== -1) {
        return {
          ANB2: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.ANB2).value,
          DOD_ID: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.DOD_ID).value,
          ATP31: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.ATP31).value,
          CAS3: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.CAS3).value,
          AMF: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.AMF).value,
          Grade: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.Grade).value,
          DUTYTITLE: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.DUTYTITLE).value,
          MPF: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.MPF).value,
          CMD: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.CMD).value,
          MAJCOM: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.MAJCOM).value,
          Country: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.Country).value,
          BASE_LOC: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.BASE_LOC).value,
          org_kind: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.org_kind).value,
          EOPDate: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.EOPDate).value,
          Last_Name: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.Last_Name).value,
          First_name: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.First_name).value,
          Middle_Name: officerWorksheet
            .getRow(foundOfficerUserRow)
            .getCell(officerUserColumns.Middle_Name).value,
          userType: "Officer",
          lastModifiedAt: officerLastMod.toString(),
        };
      }
      // If not found in officer list, check enlisted list
      const { worksheet: enlistedWorksheet, lastModifiedAt: enlistedLastMod } = await getEnlistedWorksheet()
      const foundEnlistedUserRow = enlistedWorksheet
        .getColumn(enlistedUserColumns.DOD_ID)
        .values.indexOf(id);

      if (foundEnlistedUserRow !== -1) {
        return {
          Grade: enlistedWorksheet
            .getRow(foundEnlistedUserRow)
            .getCell(enlistedUserColumns.Grade).value,
          DUTYTITLE: enlistedWorksheet
            .getRow(foundEnlistedUserRow)
            .getCell(enlistedUserColumns.DUTYTITLE).value,
          AMU: enlistedWorksheet
            .getRow(foundEnlistedUserRow)
            .getCell(enlistedUserColumns.AMU).value,
          DOD_ID: enlistedWorksheet
            .getRow(foundEnlistedUserRow)
            .getCell(enlistedUserColumns.DOD_ID).value,
          ATP31: enlistedWorksheet
            .getRow(foundEnlistedUserRow)
            .getCell(enlistedUserColumns.ATP31).value,
          AFC291_01: enlistedWorksheet
            .getRow(foundEnlistedUserRow)
            .getCell(enlistedUserColumns.AFC291_01).value,
          AMF: enlistedWorksheet
            .getRow(foundEnlistedUserRow)
            .getCell(enlistedUserColumns.AMF).value,
          MPF: enlistedWorksheet
            .getRow(foundEnlistedUserRow)
            .getCell(enlistedUserColumns.MPF).value,
          MAJCOM: enlistedWorksheet
            .getRow(foundEnlistedUserRow)
            .getCell(enlistedUserColumns.MAJCOM).value,
          Country: enlistedWorksheet
            .getRow(foundEnlistedUserRow)
            .getCell(enlistedUserColumns.Country).value,
          BASE_LOC: enlistedWorksheet
            .getRow(foundEnlistedUserRow)
            .getCell(enlistedUserColumns.BASE_LOC).value,
          Org_type: enlistedWorksheet
            .getRow(foundEnlistedUserRow)
            .getCell(enlistedUserColumns.Org_type).value,
          EOPDate: enlistedWorksheet
            .getRow(foundEnlistedUserRow)
            .getCell(enlistedUserColumns.EOPDate).value,
          Last_Name: enlistedWorksheet
            .getRow(foundEnlistedUserRow)
            .getCell(enlistedUserColumns.Last_Name).value,
          First_name: enlistedWorksheet
            .getRow(foundEnlistedUserRow)
            .getCell(enlistedUserColumns.First_name).value,
          Middle_Name: enlistedWorksheet
            .getRow(foundEnlistedUserRow)
            .getCell(enlistedUserColumns.Middle_Name).value,
          userType: "Enlisted",
          lastModifiedAt: enlistedLastMod.toString(),
        };
      }

      // If not found in either list, return null
      return null;
    },
  },
};
