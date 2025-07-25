-- Add payment_status and payment_intent_id to BookingList table
ALTER TABLE "BookingList" 
ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'failed', 'refunded')),
ADD COLUMN payment_intent_id VARCHAR(255),
ADD COLUMN stripe_customer_id VARCHAR(255),
ADD COLUMN amount_paid INTEGER DEFAULT 0,
ADD COLUMN currency VARCHAR(3) DEFAULT 'KRW';

-- Add comments for the new columns
COMMENT ON COLUMN "BookingList".payment_status IS 'Payment status: pending, confirmed, failed, refunded';
COMMENT ON COLUMN "BookingList".payment_intent_id IS 'Stripe PaymentIntent ID';
COMMENT ON COLUMN "BookingList".stripe_customer_id IS 'Stripe Customer ID';
COMMENT ON COLUMN "BookingList".amount_paid IS 'Amount paid in smallest currency unit (won for KRW)';
COMMENT ON COLUMN "BookingList".currency IS 'Payment currency code';

-- Create Payments table for detailed payment tracking
CREATE TABLE IF NOT EXISTS "Payments" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES "BookingList"(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) NOT NULL,
  stripe_charge_id VARCHAR(255),
  amount INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'KRW',
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
  payment_method_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add comments for Payments table
COMMENT ON TABLE "Payments" IS 'Detailed payment transaction records';
COMMENT ON COLUMN "Payments".booking_id IS 'Reference to booking record';
COMMENT ON COLUMN "Payments".stripe_payment_intent_id IS 'Stripe PaymentIntent ID';
COMMENT ON COLUMN "Payments".stripe_charge_id IS 'Stripe Charge ID (after successful payment)';
COMMENT ON COLUMN "Payments".amount IS 'Payment amount in smallest currency unit';
COMMENT ON COLUMN "Payments".currency IS 'Payment currency code';
COMMENT ON COLUMN "Payments".status IS 'Payment status from Stripe';
COMMENT ON COLUMN "Payments".payment_method_type IS 'Payment method used (card, etc.)';

-- Create Refunds table for refund tracking
CREATE TABLE IF NOT EXISTS "Refunds" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id UUID NOT NULL REFERENCES "Payments"(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES "BookingList"(id) ON DELETE CASCADE,
  stripe_refund_id VARCHAR(255) NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'KRW',
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
  reason VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add comments for Refunds table
COMMENT ON TABLE "Refunds" IS 'Refund transaction records';
COMMENT ON COLUMN "Refunds".payment_id IS 'Reference to original payment';
COMMENT ON COLUMN "Refunds".booking_id IS 'Reference to booking record';
COMMENT ON COLUMN "Refunds".stripe_refund_id IS 'Stripe Refund ID';
COMMENT ON COLUMN "Refunds".amount IS 'Refund amount in smallest currency unit';
COMMENT ON COLUMN "Refunds".currency IS 'Refund currency code';
COMMENT ON COLUMN "Refunds".status IS 'Refund status from Stripe';
COMMENT ON COLUMN "Refunds".reason IS 'Reason for refund';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON "Payments"(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON "Payments"(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_refunds_payment_id ON "Refunds"(payment_id);
CREATE INDEX IF NOT EXISTS idx_refunds_booking_id ON "Refunds"(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_payment_status ON "BookingList"(payment_status);
CREATE INDEX IF NOT EXISTS idx_booking_payment_intent_id ON "BookingList"(payment_intent_id);

-- Enable RLS (Row Level Security) for new tables
ALTER TABLE "Payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Refunds" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for Payments table
CREATE POLICY "Enable read access for all users" ON "Payments"
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON "Payments"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON "Payments"
  FOR UPDATE USING (true);

-- Create RLS policies for Refunds table
CREATE POLICY "Enable read access for all users" ON "Refunds"
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON "Refunds"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON "Refunds"
  FOR UPDATE USING (true);

-- Update existing bookings to have pending payment status
UPDATE "BookingList" 
SET payment_status = 'confirmed', amount_paid = total_price * 100
WHERE status = 'confirmed' AND payment_status IS NULL;