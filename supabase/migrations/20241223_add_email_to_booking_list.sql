-- Add email field to BookingList table
ALTER TABLE "BookingList" 
ADD COLUMN email VARCHAR(255);

-- Add comment for the new column
COMMENT ON COLUMN "BookingList".email IS 'Email address of the person making the reservation'; 