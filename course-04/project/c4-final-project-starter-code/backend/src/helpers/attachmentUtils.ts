import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)


const bucketName = process.env.ATTACHMENT_S3_BUCKET,
const urlExpiration = process.env.SIGNED_URL_EXPIRATION,
const s3 = new XAWS.S3({ signatureVersion: 'v4' })

  
export async function presignedUrl(attachmentId: string): Promise<string> {
        return s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: attachmentId,
            Expires: parseInt(urlExpiration)
        })
    }


export async function getAttachmentUrl(attachmentId: string): Promise<string> {
    const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${attachmentId}`
    return attachmentUrl
}
