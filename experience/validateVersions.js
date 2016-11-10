var log = require('./createLogger')
var semver = require('../lib/semver')

module.exports = function validateVersions (experienceVersion, wrapperVersion) {
  log.debug('Checking wrapper version: "' + wrapperVersion + '"')
  if (!semver.isValid(wrapperVersion)) {
    log.error('Invalid wrapper version')
    return false
  }

  if (semver.getMajor(wrapperVersion) !== semver.getMajor(experienceVersion)) {
    log.error('experience and wrapper are on different major versions')
    return false
  }

  if (semver.getMinor(wrapperVersion) !== semver.getMinor(experienceVersion)) {
    log.warn('experience and wrapper are on different minor versions')
  }

  return true
}
