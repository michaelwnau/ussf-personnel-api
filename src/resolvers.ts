import { DateTime } from 'luxon'
import { enlistedUserColumns, officerUserColumns } from './constants.js'
import {
  getEnlistedRankFromGrade,
  getEnlistedWorksheet,
  getOfficerRankFromGrade,
  getOfficerWorksheet,
  titleCase,
  titleCaseMajCom,
} from './helpers.js'
import { Row } from 'exceljs'

const createOfficerUser = (foundUser: Row, lastModifiedAt: DateTime) => {
  const grade = foundUser.getCell(officerUserColumns.Grade).value
  const email = foundUser.getCell(officerUserColumns.ATP31).value?.toString()
  return {
    Rank: getOfficerRankFromGrade(grade),
    Grade: grade,
    ANB2: foundUser.getCell(officerUserColumns.ANB2).value,
    DOD_ID: foundUser.getCell(officerUserColumns.DOD_ID).value,
    Email: email ? email.toLowerCase() : '',
    CAS3: foundUser.getCell(officerUserColumns.CAS3).value,
    AMF: foundUser.getCell(officerUserColumns.AMF).value,
    DutyTitle: foundUser.getCell(officerUserColumns.DUTYTITLE).value?.toString().toUpperCase(),
    MPF: foundUser.getCell(officerUserColumns.MPF).value,
    CMD: foundUser.getCell(officerUserColumns.CMD).value,
    MajCom: titleCaseMajCom(foundUser.getCell(officerUserColumns.MAJCOM).value),
    Country: foundUser.getCell(officerUserColumns.Country).value,
    BaseLoc: titleCase(foundUser.getCell(officerUserColumns.BASE_LOC).value),
    OrgKind: foundUser.getCell(officerUserColumns.org_kind).value,
    EOPDate: foundUser.getCell(officerUserColumns.EOPDate).value,
    LastName: titleCase(foundUser.getCell(officerUserColumns.Last_Name).value),
    FirstName: titleCase(
      foundUser.getCell(officerUserColumns.First_name).value
    ),
    MiddleName: foundUser.getCell(officerUserColumns.Middle_Name).value,
    UserType: 'Officer',
    lastModifiedAt: lastModifiedAt.toString(),
  }
}

const createEnlistedUser = (foundUser: Row, lastModifiedAt: DateTime) => {
  const grade = foundUser.getCell(enlistedUserColumns.Grade).value
  const email = foundUser.getCell(enlistedUserColumns.ATP31).value?.toString()
  return {
    Rank: getEnlistedRankFromGrade(grade),
    Grade: grade,
    DutyTitle: foundUser.getCell(enlistedUserColumns.DUTYTITLE).value?.toString().toUpperCase(),
    AMU: foundUser.getCell(enlistedUserColumns.AMU).value,
    DOD_ID: foundUser.getCell(enlistedUserColumns.DOD_ID).value,
    Email: email ? email.toLowerCase() : '',
    AFC291_01: foundUser.getCell(enlistedUserColumns.AFC291_01).value,
    AMF: foundUser.getCell(enlistedUserColumns.AMF).value,
    MPF: foundUser.getCell(enlistedUserColumns.MPF).value,
    MajCom: titleCaseMajCom(
      foundUser.getCell(enlistedUserColumns.MAJCOM).value
    ),
    Country: foundUser.getCell(enlistedUserColumns.Country).value,
    BaseLoc: titleCase(foundUser.getCell(enlistedUserColumns.BASE_LOC).value),
    OrgType: foundUser.getCell(enlistedUserColumns.Org_type).value,
    EOPDate: foundUser.getCell(enlistedUserColumns.EOPDate).value,
    LastName: titleCase(foundUser.getCell(enlistedUserColumns.Last_Name).value),
    FirstName: titleCase(
      foundUser.getCell(enlistedUserColumns.First_name).value
    ),
    MiddleName: foundUser.getCell(enlistedUserColumns.Middle_Name).value,
    UserType: 'Enlisted',
    lastModifiedAt: lastModifiedAt.toString(),
  }
}

export const resolvers = {
  Query: {
    getEnlistedUser: async (_: any, { id }: { id: string }) => {
      const { worksheet, lastModifiedAt: lastMod } =
        await getEnlistedWorksheet()

      let worksheetValues = worksheet.getColumn(
        enlistedUserColumns.DOD_ID
      ).values

      worksheetValues = worksheetValues.map((value) => {
        return value?.toString().trim()
      })

      // Find the index of the DOD_ID we're looking for in the DOD_ID column
      const foundUserRow = worksheetValues.indexOf(id)
      const foundUser = worksheet.getRow(foundUserRow)

      if (foundUserRow !== -1 && foundUser) {
        return createEnlistedUser(foundUser, lastMod)
      }
      return null
    },
    getOfficerUser: async (_: any, { id }: { id: string }) => {
      const { worksheet, lastModifiedAt: lastMod } = await getOfficerWorksheet()

      let officerWorksheetValues = worksheet.getColumn(
        officerUserColumns.DOD_ID
      ).values

      officerWorksheetValues = officerWorksheetValues.map((value) => {
        return value?.toString().trim()
      })

      // Find the index of the DOD_ID we're looking for in the DOD_ID column
      const foundUserRow = officerWorksheetValues.indexOf(id)
      const foundUser = worksheet.getRow(foundUserRow)

      if (foundUserRow !== -1 && foundUser) {
        return createOfficerUser(foundUser, lastMod)
      }
      return null
    },
    getUser: async (_: any, { id }: { id: string }) => {
      // First check officer list
      const { worksheet: officerWorksheet, lastModifiedAt: officerLastMod } =
        await getOfficerWorksheet()

      let worksheetValues = officerWorksheet.getColumn(
        officerUserColumns.DOD_ID
      ).values

      worksheetValues = worksheetValues.map((value) => {
        return value?.toString().trim()
      })

      // Find the index of the DOD_ID we're looking for in the DOD_ID column
      const foundOfficerUserRow = worksheetValues.indexOf(id)
      const foundOfficerUser = officerWorksheet.getRow(foundOfficerUserRow)

      if (foundOfficerUserRow !== -1 && foundOfficerUser) {
        return createOfficerUser(foundOfficerUser, officerLastMod)
      }
      // If not found in officer list, check enlisted list
      const { worksheet: enlistedWorksheet, lastModifiedAt: enlistedLastMod } =
        await getEnlistedWorksheet()

      let enlistedWorksheetValues = enlistedWorksheet.getColumn(
        enlistedUserColumns.DOD_ID
      ).values

      enlistedWorksheetValues = enlistedWorksheetValues.map((value) => {
        return value?.toString().trim()
      })

      // Find the index of the DOD_ID we're looking for in the DOD_ID column
      const foundEnlistedUserRow = enlistedWorksheetValues.indexOf(id)
      const foundEnlistedUser = enlistedWorksheet.getRow(foundEnlistedUserRow)

      if (foundEnlistedUserRow !== -1 && foundEnlistedUser) {
        return createEnlistedUser(foundEnlistedUser, enlistedLastMod)
      }

      // If not found in either list, return null
      return null
    },
    getGuardianDirectory: async () => {
      const { worksheet: officerWorksheet, lastModifiedAt: officerLastMod } =
        await getOfficerWorksheet()
      const { worksheet: enlistedWorksheet, lastModifiedAt: enlistedLastMod } =
        await getEnlistedWorksheet()

      const officerWorksheetValues = officerWorksheet.getColumn(
        officerUserColumns.DOD_ID
      ).values

      const enlistedWorksheetValues = enlistedWorksheet.getColumn(
        enlistedUserColumns.DOD_ID
      ).values

      const officerGuardianDirectoryUsers = []
      const enlistedGuardianDirectoryUsers = []

      // Initializing at 2 to skip the header row
      for (let i = 2; i < officerWorksheetValues.length; i++) {
        const officerUser = officerWorksheet.getRow(i)
        officerGuardianDirectoryUsers.push(
          createOfficerUser(officerUser, officerLastMod)
        )
      }

      // Initializing at 2 to skip the header row
      for (let i = 2; i < enlistedWorksheetValues.length; i++) {
        const enlistedUser = enlistedWorksheet.getRow(i)
        enlistedGuardianDirectoryUsers.push(
          createEnlistedUser(enlistedUser, enlistedLastMod)
        )
      }

      const sortedArray = [
        ...officerGuardianDirectoryUsers,
        ...enlistedGuardianDirectoryUsers,
      ].sort((a, b) => {
        if (a.LastName! < b.LastName!) {
          return -1
        }
        if (a.LastName! > b.LastName!) {
          return 1
        }
        return 0
      })

      return sortedArray
    },
    searchGuardianDirectory: async (_: any, { search }: { search: string }) => {
      try {
        const { worksheet: officerWorksheet, lastModifiedAt: officerLastMod } =
          await getOfficerWorksheet()
        const {
          worksheet: enlistedWorksheet,
          lastModifiedAt: enlistedLastMod,
        } = await getEnlistedWorksheet()

        const searchTerms = search.trim().split(' ')
        const searchResults: any = []

        let found = false
        let foundOfficerUser
        let foundEnlistedUser

        // Search officers spreadsheet for any cell that contains any of the search terms
        for (let i = 2; i < officerWorksheet.rowCount; i++) {
          const row = officerWorksheet.getRow(i)

          for (let j = 1; j < row.cellCount; j++) {
            const cell = row.getCell(j)

            if (cell.value) {
              // Normalize text from cell
              const cellValue = cell.value.toString().toLowerCase()
              // Check if cell value includes any of the search terms
              if (
                searchTerms.some((term) =>
                  cellValue.includes(term.toLowerCase())
                )
              ) {
                foundOfficerUser = officerWorksheet.getRow(i)
                found = true
                const user = createOfficerUser(foundOfficerUser, officerLastMod)
                searchResults.push(user)
                break
              }
            }
          }
          if (found) {
            found = false
            continue
          }
        }

        // Search enlisted spreadsheet for any cell that contains any of the search terms
        for (let i = 2; i < enlistedWorksheet.rowCount; i++) {
          const row = enlistedWorksheet.getRow(i)

          for (let j = 1; j < row.cellCount; j++) {
            const cell = row.getCell(j)

            if (cell.value) {
              // Normalize text from cel
              const cellValue = cell.value.toString().toLowerCase()
              // Check if cell value includes any of the search terms
              if (
                searchTerms.some((term) =>
                  cellValue.includes(term.toLowerCase())
                )
              ) {
                foundEnlistedUser = enlistedWorksheet.getRow(i)
                found = true
                const user = createEnlistedUser(
                  foundEnlistedUser,
                  enlistedLastMod
                )
                searchResults.push(user)
                break
              }
            }
          }
          if (found) {
            found = false
            continue
          }
        }
        return searchResults
      } catch (error) {
        console.error('Error in guardianDirectorySearch:', error)
      }
    },
  },
}
