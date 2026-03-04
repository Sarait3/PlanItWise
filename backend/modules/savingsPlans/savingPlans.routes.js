const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth'); 
const controller = require('./savingsPlans.controller');
const asyncHandler = require('../../utils/asyncHandler');


/* POST /savingsPlans
   Creates a savings plan
*/
router.post(
  '/',
  auth,
  asyncHandler(controller.createSavingsPlan)
);


/* GET /savingsPlans/paymentDates/:goalId
   Returns payment schedule for next 12 periods
*/
router.get(
  '/paymentDates/:goalId',
  auth,
  asyncHandler(controller.getPaymentDates)
);


/* PUT /savingsPlans/:id
   Updates a savings plan
 */
router.put(
  '/:id',
  auth,
  asyncHandler(controller.updateSavingsPlan)
);


/* DELETE /savingsPlans/:id
   Deletes a savings plan
 */
router.delete(
  '/:id',
  auth,
  asyncHandler(controller.deleteSavingsPlan)
);


/* PUT /savingsPlans/pause/:id
   Pauses a savings plan
 */
router.put(
  '/pause/:id',
  auth,
  asyncHandler(controller.pauseSavingsPlan)
);


/* PUT /savingsPlans/resume/:id
   Resumes a savings plan
 */
router.put(
  '/resume/:id',
  auth,
  asyncHandler(controller.resumeSavingsPlan)
);

module.exports = router;