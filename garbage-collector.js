'use strict';
const http = require('http')
const lib = require('http-helper-functions')
const backend = require('./backend.js')

const ITEMTYPES = ['Map']

function createTrashPickupRequest(req, res, pickupRequest) {
  backend.recordRequest(pickupRequest, function(err) {
    if (err)
      lib.internalError(res, `unable to honor request. err: ${JSON.stringify(err)}`)
    else
      lib.found(req, res)
  })
}

function verifyRequest(req, res, pickupRequest, callback) {
  if (typeof pickupRequest.isA != 'string')
    return lib.badRequest(res, 'pickupRequest must have an isA property with a string value')
  if (pickupRequest.isA != 'TrashPickupRequest')
    return lib.badRequest(res, `pickupRequest.isA must be 'TrashPickupRequest', not ${pickupRequest.isA}`)  
  if (typeof pickupRequest.trashItem != 'string')
    return lib.badRequest(res, 'pickupRequest must have a trashItem property with a string value')
  if (ITEMTYPES.indexOf(pickupRequest.trashItemType) < 0)
    return lib.badRequest(res, `pickupRequest.trashItemType (${pickupRequest.trashItemType}) must be in ${ITEMTYPES}`)
  callback()
}

function requestHandler(req, res) {
  if (req.url == '/trash-pickup-requests')
    if (req.method == 'POST')
      lib.getServerPostObject(req, res, function(req, res, pickupRequest) {
        verifyRequest(req, res, pickupRequest, function() {
          createTrashPickupRequest(req, res, pickupRequest)
        })
      })
    else
      lib.methodNotAllowed(req, res, ['POST'])
  else 
    lib.notFound(req, res)
}

var port = process.env.PORT;
http.createServer(requestHandler).listen(port, function() {
  console.log(`server is listening on ${port}`);
});
