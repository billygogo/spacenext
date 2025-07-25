-- Remove payment-related columns from BookingList table
ALTER TABLE "BookingList" 
DROP COLUMN IF EXISTS payment_status,
DROP COLUMN IF EXISTS payment_intent_id,
DROP COLUMN IF EXISTS stripe_customer_id,
DROP COLUMN IF EXISTS amount_paid,
DROP COLUMN IF EXISTS currency;

-- Drop payment-related tables
DROP TABLE IF EXISTS "Refunds";
DROP TABLE IF EXISTS "Payments";

-- Drop payment-related indexes (if they still exist)
DROP INDEX IF EXISTS idx_booking_payment_status;
DROP INDEX IF EXISTS idx_booking_payment_intent_id;