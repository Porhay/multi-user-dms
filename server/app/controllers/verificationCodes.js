const dal = require('../dal')
const email = require('../lib/email')
const config = require('../config')
const helpers = require('../lib/helpers')

exports.create = async (req, res) => {
  const user = await dal.users.getById(req.params.userId)

  //= create code, save to db, send by email
  const code = helpers.createRandomCode(config.VERIFICATION_CODE.DIGITS)().toString()
  const id = await dal.verificationCodes.create(user.id, code)
  await email.sendVerificationEmail(user.email, code)

  return res.json({id})
}

exports.setAsUsed = async (req, res) => {
  const {userId, codeId} = req.params

  const used = await dal.verificationCodes.setAsUsed(userId, codeId)
  if(!used) {
    return res.json({message: 'Code has expired'})
  }
  return res.json({message: 'OK'})
}
