import ExcelJS from "exceljs"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { DateTime } from 'luxon'
import { enlistedFilename, officerFilename } from "./constants.js"
import { Stream } from "stream"

const getS3Client = () => {
  return new S3Client({ region: process.env.AWS_DEFAULT_REGION })
}

const getWorksheet = async (filename: string) => {
  const workbook = new ExcelJS.Workbook()
  let lastModifiedAt = DateTime.now()

  if (process.env.S3_BUCKET_NAME && process.env.S3_BUCKET_NAME !== 'test_bucket') {
    // s3 mode
    const s3client = getS3Client()
    const response = await s3client.send(
      new GetObjectCommand({ 
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename,
      })
    )

    if (response.LastModified) {
      lastModifiedAt = DateTime.fromJSDate(response.LastModified)
    }

    // TODO: not sure how to handle this, the type of Body doesn't match the type
    // requested by xlsx read, but it does work so I'm casting it
    const stream = response.Body as Stream
    await workbook.xlsx.read(stream)
  } else {
    await workbook.xlsx.readFile(`./spreadsheets/${filename}`);
  }
  return { 
    // Assume first sheet is the list of data
    worksheet: workbook.worksheets[0],
    lastModifiedAt: lastModifiedAt
  }
}

export const getEnlistedWorksheet = async () => {
  return getWorksheet(enlistedFilename)
}

export const getOfficerWorksheet = async () => {
  return getWorksheet(officerFilename)
}
