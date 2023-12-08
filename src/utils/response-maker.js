const { generateAccessToken, generateRefreshToken } = require('../utils/token-manager')
const bycrypt = require('bcryptjs')
const appConfig = require('../config')

function responseMaker (res, data, response, config = {
  includeJwt: false,
  includeRefreshToken: false
}) {
  let objectResponse = {
    status: response.code,
    message: response.message,
    data
  }

  if (config.includeJwt) {
    const accessToken = generateAccessToken({})
    objectResponse = {
      status: objectResponse.status,
      message: objectResponse.message,
      accessToken,
      data
    }

    if (config.includeRefreshToken) {
      const refreshToken = generateRefreshToken({
        signature: bycrypt.hashSync(appConfig.keySignature, 8)
      })
      objectResponse = {
        status: objectResponse.status,
        message: objectResponse.message,
        accessToken,
        refreshToken,
        data
      }
    }
  }

  return res.status(response.code).json(objectResponse)
}

module.exports = responseMaker