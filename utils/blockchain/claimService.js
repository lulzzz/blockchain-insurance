var blockchainService = require('./blockchainService');
var config = require('config');

var raiseClaim = function(claim, username, callback){
  // We can be assured the claim has the relevant fields because of schema validaiton ont he endpoint
  var args = [claim.relatedPolicy, claim.description, claim.incidentDate, claim.type];
  blockchainService.invoke("createClaim", args, username, callback);
};

var getFullHistory = function(username, callback){
  blockchainService.query("retrieveAllClaims", [], username, callback);
};

//For now we're getting all the claims and iterating but this is obviously inefficient.
//We should add a query to the chaincode for a specific claim id
var getClaimWithId = function(claimId, username, callback) {
  getFullHistory(username, function(result) {
    var claims = JSON.parse(result.results);

    for (var i = 0; i < claims.length; i++) {
      if (claims[i].id == claimId) {
        callback(claims[i]);
        return
      }
    }

    //claim not found
    return callback();
  });
}

var makeClaimAgreement = function(claimId, agreement, username, callback){
  blockchainService.invoke("agreePayoutAmount", [claimId, agreement.toString()], username, callback);
};

var confirmPaidOut = function(claimId, paymentId, username, callback) {
  blockchainService.invoke("confirmPaidOut", [claimId, paymentId], username, callback);
}

module.exports = {
  raiseClaim: raiseClaim,
  getFullHistory: getFullHistory,
  makeClaimAgreement: makeClaimAgreement,
  confirmPaidOut: confirmPaidOut,
  getClaimWithId: getClaimWithId
};
