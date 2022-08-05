import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../../auth/JwtPayload'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJet4ZtAMZJ4mkMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1lNGlncmswcC51cy5hdXRoMC5jb20wHhcNMjIwNzA5MDk1NzU5WhcN
MzYwMzE3MDk1NzU5WjAkMSIwIAYDVQQDExlkZXYtZTRpZ3JrMHAudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA/ZH/TCZ/gOP+ettY
yfKjoT0rnHGStNloSUI4j1e6d6pp5e5ujIh88S5kGXe+rHzqNGdRvAjnp/Hzh/lk
jZImsbUPM/CGiy1z3Y2mxfFOU9oDFxj1UlkHHC/SQ1kretvBpcYenqPoLEXX2S4v
X9ZlR6SkxfRsFt9c6iSLS/fCFaH8C7cmQfQIgjbL30TsVu2qqCLqoL/z5xtFyseU
nMoUat/MHH1UoVL5PtOHep8eeuZRPRhdEf0GKhskyTZFqGNPkQxDndzTyBd4sPth
wzUrbzPoSTvMQBMNKI7sy07T2iQBXNPPWCtUFpPGotbZRC4+2hy4a7RhLZxPoFDb
tkgGXQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQZ8vhN887w
M+WYzUlUtlGTRZZ3ODAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AA4/IN/ELoU3B6SUG3XnXoPoMa4XX8ag/VqSo3T3bY+mfFpQ08BXTDATvfN8MNqM
n/XmkIAcoawz/6QLM22+5Z6UzjVPf5o2NQLa/GAgpWGNoP7dMWPeF8cX+YRaUWzs
9Pf6d4p8yDRrrsDeJxMuAKPu6fvfVZo3T7bef4GnIJD5n9G1FF1tglko/ExJ/sNI
RNJz/N66OYhCcSH8pXBE67VelSl3jG179ciZDXqiRcXvZOl0Mt6j0DTtjhOWlRzq
3C6OSHY/JZVBObTdGcsa64MiWnNDhrJHr0+ymfEJPH+MB5ZXWIUj60BVpBoxkh4K
Lj2cnvlLc0IdLih4jrW7Eqc=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtPayload {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}