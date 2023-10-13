import { enlistedUserColumns, officerUserColumns } from "./constants.js";
import {
  getEnlistedRankFromGrade,
  getEnlistedWorksheet,
  getOfficerRankFromGrade,
  getOfficerWorksheet,
} from "./helpers.js";

export const resolvers = {
  Query: {
    getEnlistedUser: async (_: any, { id }: { id: string }) => {
      const { worksheet, lastModifiedAt: lastMod } =
        await getEnlistedWorksheet();

      let worksheetValues = worksheet.getColumn(
        enlistedUserColumns.DOD_ID
      ).values;

      worksheetValues = worksheetValues.map((value) => {
        return value?.toString().trim();
      });

      // Find the index of the DOD_ID we're looking for in the DOD_ID column
      const foundUserRow = worksheetValues.indexOf(id);
      const foundUser = worksheet.getRow(foundUserRow);

      if (foundUserRow !== -1 && foundUser) {
        const grade = foundUser.getCell(enlistedUserColumns.Grade).value;
        return {
          Rank: getEnlistedRankFromGrade(grade),
          Grade: grade,
          DUTYTITLE: foundUser.getCell(enlistedUserColumns.DUTYTITLE).value,
          AMU: foundUser.getCell(enlistedUserColumns.AMU).value,
          DOD_ID: foundUser.getCell(enlistedUserColumns.DOD_ID).value,
          ATP31: foundUser.getCell(enlistedUserColumns.ATP31).value,
          AFC291_01: foundUser.getCell(enlistedUserColumns.AFC291_01).value,
          AMF: foundUser.getCell(enlistedUserColumns.AMF).value,
          MPF: foundUser.getCell(enlistedUserColumns.MPF).value,
          MAJCOM: foundUser.getCell(enlistedUserColumns.MAJCOM).value,
          Country: foundUser.getCell(enlistedUserColumns.Country).value,
          BASE_LOC: foundUser.getCell(enlistedUserColumns.BASE_LOC).value,
          Org_type: foundUser.getCell(enlistedUserColumns.Org_type).value,
          EOPDate: foundUser.getCell(enlistedUserColumns.EOPDate).value,
          Last_Name: foundUser.getCell(enlistedUserColumns.Last_Name).value,
          First_name: foundUser.getCell(enlistedUserColumns.First_name).value,
          Middle_Name: foundUser.getCell(enlistedUserColumns.Middle_Name).value,
          userType: "Enlisted",
          lastModifiedAt: lastMod.toString(),
        };
      }
      return null;
    },
    getOfficerUser: async (_: any, { id }: { id: string }) => {
      const { worksheet, lastModifiedAt: lastMod } =
        await getOfficerWorksheet();

      let officerWorksheetValues = worksheet.getColumn(
        officerUserColumns.DOD_ID
      ).values;

      officerWorksheetValues = officerWorksheetValues.map((value) => {
        return value?.toString().trim();
      });

      // Find the index of the DOD_ID we're looking for in the DOD_ID column
      const foundUserRow = officerWorksheetValues.indexOf(id);
      const foundUser = worksheet.getRow(foundUserRow);

      if (foundUserRow !== -1 && foundUser) {
        const grade = foundUser.getCell(officerUserColumns.Grade).value;
        return {
          Rank: getOfficerRankFromGrade(grade),
          Grade: grade,
          ANB2: foundUser.getCell(officerUserColumns.ANB2).value,
          DOD_ID: foundUser.getCell(officerUserColumns.DOD_ID).value,
          ATP31: foundUser.getCell(officerUserColumns.ATP31).value,
          CAS3: foundUser.getCell(officerUserColumns.CAS3).value,
          AMF: foundUser.getCell(officerUserColumns.AMF).value,
          DUTYTITLE: foundUser.getCell(officerUserColumns.DUTYTITLE).value,
          MPF: foundUser.getCell(officerUserColumns.MPF).value,
          CMD: foundUser.getCell(officerUserColumns.CMD).value,
          MAJCOM: foundUser.getCell(officerUserColumns.MAJCOM).value,
          Country: foundUser.getCell(officerUserColumns.Country).value,
          BASE_LOC: foundUser.getCell(officerUserColumns.BASE_LOC).value,
          org_kind: foundUser.getCell(officerUserColumns.org_kind).value,
          EOPDate: foundUser.getCell(officerUserColumns.EOPDate).value,
          Last_Name: foundUser.getCell(officerUserColumns.Last_Name).value,
          First_name: foundUser.getCell(officerUserColumns.First_name).value,
          Middle_Name: foundUser.getCell(officerUserColumns.Middle_Name).value,
          userType: "Officer",
          lastModifiedAt: lastMod.toString(),
        };
      }
      return null;
    },
    getUser: async (_: any, { id }: { id: string }) => {
      // First check officer list
      const { worksheet: officerWorksheet, lastModifiedAt: officerLastMod } =
        await getOfficerWorksheet();

      let worksheetValues = officerWorksheet.getColumn(
        officerUserColumns.DOD_ID
      ).values;

      worksheetValues = worksheetValues.map((value) => {
        return value?.toString().trim();
      });

      // Find the index of the DOD_ID we're looking for in the DOD_ID column
      const foundOfficerUserRow = worksheetValues.indexOf(id);
      const foundOfficerUser = officerWorksheet.getRow(foundOfficerUserRow);

      if (foundOfficerUserRow !== -1 && foundOfficerUser) {
        const grade = foundOfficerUser.getCell(officerUserColumns.Grade).value;
        return {
          Rank: getOfficerRankFromGrade(grade),
          Grade: grade,
          ANB2: foundOfficerUser.getCell(officerUserColumns.ANB2).value,
          DOD_ID: foundOfficerUser.getCell(officerUserColumns.DOD_ID).value,
          ATP31: foundOfficerUser.getCell(officerUserColumns.ATP31).value,
          CAS3: foundOfficerUser.getCell(officerUserColumns.CAS3).value,
          AMF: foundOfficerUser.getCell(officerUserColumns.AMF).value,
          DUTYTITLE: foundOfficerUser.getCell(officerUserColumns.DUTYTITLE)
            .value,
          MPF: foundOfficerUser.getCell(officerUserColumns.MPF).value,
          CMD: foundOfficerUser.getCell(officerUserColumns.CMD).value,
          MAJCOM: foundOfficerUser.getCell(officerUserColumns.MAJCOM).value,
          Country: foundOfficerUser.getCell(officerUserColumns.Country).value,
          BASE_LOC: foundOfficerUser.getCell(officerUserColumns.BASE_LOC).value,
          org_kind: foundOfficerUser.getCell(officerUserColumns.org_kind).value,
          EOPDate: foundOfficerUser.getCell(officerUserColumns.EOPDate).value,
          Last_Name: foundOfficerUser.getCell(officerUserColumns.Last_Name)
            .value,
          First_name: foundOfficerUser.getCell(officerUserColumns.First_name)
            .value,
          Middle_Name: foundOfficerUser.getCell(officerUserColumns.Middle_Name)
            .value,
          userType: "Officer",
          lastModifiedAt: officerLastMod.toString(),
        };
      }
      // If not found in officer list, check enlisted list
      const { worksheet: enlistedWorksheet, lastModifiedAt: enlistedLastMod } =
        await getEnlistedWorksheet();

      let enlistedWorksheetValues = enlistedWorksheet.getColumn(
        enlistedUserColumns.DOD_ID
      ).values;

      enlistedWorksheetValues = enlistedWorksheetValues.map((value) => {
        return value?.toString().trim();
      });

      // Find the index of the DOD_ID we're looking for in the DOD_ID column
      const foundEnlistedUserRow = enlistedWorksheetValues.indexOf(id);
      const foundEnlistedUser = enlistedWorksheet.getRow(foundEnlistedUserRow);

      if (foundEnlistedUserRow !== -1 && foundEnlistedUser) {
        const grade = foundEnlistedUser.getCell(
          enlistedUserColumns.Grade
        ).value;
        return {
          Rank: getEnlistedRankFromGrade(grade),
          Grade: grade,
          DUTYTITLE: foundEnlistedUser.getCell(enlistedUserColumns.DUTYTITLE)
            .value,
          AMU: foundEnlistedUser.getCell(enlistedUserColumns.AMU).value,
          DOD_ID: foundEnlistedUser.getCell(enlistedUserColumns.DOD_ID).value,
          ATP31: foundEnlistedUser.getCell(enlistedUserColumns.ATP31).value,
          AFC291_01: foundEnlistedUser.getCell(enlistedUserColumns.AFC291_01)
            .value,
          AMF: foundEnlistedUser.getCell(enlistedUserColumns.AMF).value,
          MPF: foundEnlistedUser.getCell(enlistedUserColumns.MPF).value,
          MAJCOM: foundEnlistedUser.getCell(enlistedUserColumns.MAJCOM).value,
          Country: foundEnlistedUser.getCell(enlistedUserColumns.Country).value,
          BASE_LOC: foundEnlistedUser.getCell(enlistedUserColumns.BASE_LOC)
            .value,
          Org_type: foundEnlistedUser.getCell(enlistedUserColumns.Org_type)
            .value,
          EOPDate: foundEnlistedUser.getCell(enlistedUserColumns.EOPDate).value,
          Last_Name: foundEnlistedUser.getCell(enlistedUserColumns.Last_Name)
            .value,
          First_name: foundEnlistedUser.getCell(enlistedUserColumns.First_name)
            .value,
          Middle_Name: foundEnlistedUser.getCell(
            enlistedUserColumns.Middle_Name
          ).value,
          userType: "Enlisted",
          lastModifiedAt: enlistedLastMod.toString(),
        };
      }

      // If not found in either list, return null
      return null;
    },
    getGuardianDirectory: async () => {
      const { worksheet: officerWorksheet } = await getOfficerWorksheet();
      const { worksheet: enlistedWorksheet } = await getEnlistedWorksheet();

      const officerWorksheetValues = officerWorksheet.getColumn(
        officerUserColumns.DOD_ID
      ).values;

      const enlistedWorksheetValues = enlistedWorksheet.getColumn(
        enlistedUserColumns.DOD_ID
      ).values;

      const officerGuardianDirectoryUsers = [];
      const enlistedGuardianDirectoryUsers = [];

      // Initializing at 2 to skip the header row
      for (let i = 2; i < officerWorksheetValues.length; i++) {
        const officerUser = officerWorksheet.getRow(i);
        officerGuardianDirectoryUsers.push({
          DOD_ID: officerUser.getCell(officerUserColumns.DOD_ID).value,
          First_name: officerUser.getCell(officerUserColumns.First_name).value,
          Middle_Name: officerUser.getCell(officerUserColumns.Middle_Name)
            .value,
          Last_Name: officerUser.getCell(officerUserColumns.Last_Name).value,
          Email: officerUser.getCell(officerUserColumns.ATP31).value,
          Rank: getOfficerRankFromGrade(
            officerUser.getCell(officerUserColumns.Grade).value
          ),
          Duty: officerUser.getCell(officerUserColumns.DUTYTITLE).value,
          BaseLoc: officerUser.getCell(officerUserColumns.BASE_LOC).value,
          MajCom: officerUser.getCell(officerUserColumns.MAJCOM).value,
          OrgType: officerUser.getCell(officerUserColumns.Org_type).value,
          OrgKind: officerUser.getCell(officerUserColumns.org_kind).value,
        });
      }

      // Initializing at 2 to skip the header row
      for (let i = 2; i < enlistedWorksheetValues.length; i++) {
        const enlistedUser = enlistedWorksheet.getRow(i);
        enlistedGuardianDirectoryUsers.push({
          DOD_ID: enlistedUser.getCell(enlistedUserColumns.DOD_ID).value,
          First_name: enlistedUser.getCell(enlistedUserColumns.First_name)
            .value,
          Middle_Name: enlistedUser.getCell(enlistedUserColumns.Middle_Name)
            .value,
          Last_Name: enlistedUser.getCell(enlistedUserColumns.Last_Name).value,
          Email: enlistedUser.getCell(enlistedUserColumns.ATP31).value,
          Rank: getEnlistedRankFromGrade(
            enlistedUser.getCell(enlistedUserColumns.Grade).value
          ),
          Duty: enlistedUser.getCell(enlistedUserColumns.DUTYTITLE).value,
          BaseLoc: enlistedUser.getCell(enlistedUserColumns.BASE_LOC).value,
          MajCom: enlistedUser.getCell(enlistedUserColumns.MAJCOM).value,
          OrgType: enlistedUser.getCell(enlistedUserColumns.Org_type).value,
          OrgKind: enlistedUser.getCell(enlistedUserColumns.org_kind).value,
        });
      }

      const sortedArray = [
        ...officerGuardianDirectoryUsers,
        ...enlistedGuardianDirectoryUsers,
      ].sort((a, b) => {
        if (a.Last_Name! < b.Last_Name!) {
          return -1;
        }
        if (a.Last_Name! > b.Last_Name!) {
          return 1;
        }
        return 0;
      });

      return sortedArray;
    },
  },
};
